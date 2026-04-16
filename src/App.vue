<template>
  <!-- 最外層容器：透過綁定 class 來統一控制深色模式、注音顯示、與警告動畫 -->
  <div :class="['app-wrapper', { 'dark-mode': isDarkMode, 'show-zhuyin': showZhuyin, 'warning-active': isWarningActive }]">
    
    <header>
      <a href="https://www.et.tku.edu.tw/" target="_blank" class="menu-btn">☰ 淡江教科</a>
      <h1>
        <span class="title-black"><ruby>考<rt>ㄎㄠˇ</rt></ruby><ruby>試<rt>ㄕˋ</rt></ruby></span><span class="title-gray"><ruby>系<rt>ㄒㄧˋ</rt></ruby><ruby>統<rt>ㄊㄨㄥˇ</rt></ruby></span>
      </h1>
    </header>

    <div class="subtitle">
      <ruby>114<rt></rt></ruby><ruby>學<rt>ㄒㄩㄝˊ</rt></ruby><ruby>年<rt>ㄋㄧㄢˊ</rt></ruby><ruby>度<rt>ㄉㄨˋ</rt></ruby><ruby>第<rt>ㄉㄧˋ</rt></ruby><ruby>二<rt>ㄦˋ</rt></ruby><ruby>學<rt>ㄒㄩㄝˊ</rt></ruby><ruby>期<rt>ㄑㄧˊ</rt></ruby><ruby>互<rt>ㄏㄨˋ</rt></ruby><ruby>動<rt>ㄉㄨㄥˋ</rt></ruby><ruby>程<rt>ㄔㄥˊ</rt></ruby><ruby>式<rt>ㄕˋ</rt></ruby><ruby>設<rt>ㄕㄜˋ</rt></ruby><ruby>計<rt>ㄐㄧˋ</rt></ruby><ruby>期<rt>ㄑㄧˊ</rt></ruby><ruby>中<rt>ㄓㄨㄥ</rt></ruby><ruby>報<rt>ㄅㄠˋ</rt></ruby><ruby>告<rt>ㄍㄠˋ</rt></ruby>
    </div>

    <!-- 五個控制按鈕 -->
    <div class="controls">
      <button :class="{ active: isCountdown }" @click="toggleTimeMode">
        ⏱️ <ruby>倒<rt>ㄉㄠˇ</rt></ruby><ruby>數<rt>ㄕㄨˋ</rt></ruby>
      </button>
      <button :class="{ active: showZhuyin }" @click="toggleZhuyin">
        🔤 <ruby>注<rt>ㄓㄨˋ</rt></ruby><ruby>音<rt>ㄧㄣ</rt></ruby>
      </button>
      <button :class="{ active: isDarkMode }" @click="toggleTheme">
        <span v-if="isDarkMode">☀️ <ruby>白<rt>ㄅㄞˊ</rt></ruby><ruby>天<rt>ㄊㄧㄢ</rt></ruby></span>
        <span v-else>🌙 <ruby>夜<rt>ㄧㄝˋ</rt></ruby><ruby>間<rt>ㄐㄧㄢ</rt></ruby></span>
      </button>
      <button :class="{ active: soundEnabled }" @click="toggleSound">
        🔔 <ruby>鈴<rt>ㄌㄧㄥˊ</rt></ruby><ruby>聲<rt>ㄕㄥ</rt></ruby>
      </button>
      <button :class="{ active: warningEnabled }" @click="toggleWarning">
        ⚠️ <ruby>警<rt>ㄐㄧㄥˇ</rt></ruby><ruby>告<rt>ㄍㄠˋ</rt></ruby>
      </button>
      <label v-if="warningEnabled" class="warning-setting">
        <input type="number" v-model.number="warningMinutes" min="1" max="60"> 分鐘
      </label>
    </div>

    <!-- 時間顯示區 -->
    <div class="time-display">
      <span class="time-label">
        <template v-if="isCountdown">
          <ruby>距<rt>ㄐㄩˋ</rt></ruby><ruby>離<rt>ㄌㄧˊ</rt></ruby><ruby>下<rt>ㄒㄧㄚˋ</rt></ruby><ruby>場<rt>ㄔㄤˇ</rt></ruby><ruby>考<rt>ㄎㄠˇ</rt></ruby><ruby>試<rt>ㄕˋ</rt></ruby>
        </template>
        <template v-else>
          <ruby>現<rt>ㄒㄧㄢˋ</rt></ruby><ruby>在<rt>ㄗㄞˋ</rt></ruby><ruby>時<rt>ㄕˊ</rt></ruby><ruby>間<rt>ㄐㄧㄢ</rt></ruby>
        </template>
      </span>
      <span>{{ timeText }}</span>
    </div>

    <!-- 考科與時刻表區 -->
    <div class="exam-section">
      <div class="action-buttons">
        <button class="add-btn" @click="openModal">
          ➕ <ruby>新<rt>ㄒㄧㄣ</rt></ruby><ruby>增<rt>ㄗㄥ</rt></ruby><ruby>考<rt>ㄎㄠˇ</rt></ruby><ruby>科<rt>ㄎㄜ</rt></ruby>
        </button>
        <button class="export-btn" @click="exportToCSV" title="匯出為 Excel (CSV)">
          📊 <ruby>匯<rt>ㄏㄨㄟˋ</rt></ruby><ruby>出<rt>ㄔㄨ</rt></ruby> CSV
        </button>
        <button class="export-btn" @click="exportToJSON" title="匯出為 JSON">
          📄 <ruby>匯<rt>ㄏㄨㄟˋ</rt></ruby><ruby>出<rt>ㄔㄨ</rt></ruby> JSON
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th><ruby>時<rt>ㄕˊ</rt></ruby><ruby>間<rt>ㄐㄧㄢ</rt></ruby></th>
            <th><ruby>科<rt>ㄎㄜ</rt></ruby><ruby>目<rt>ㄇㄨˋ</rt></ruby></th>
            <th><ruby>監<rt>ㄐㄧㄢ</rt></ruby><ruby>考<rt>ㄎㄠˇ</rt></ruby><ruby>老<rt>ㄌㄠˇ</rt></ruby><ruby>師<rt>ㄕ</rt></ruby></th>
            <th><ruby>操<rt>ㄘㄠ</rt></ruby><ruby>作<rt>ㄗㄨㄛˋ</rt></ruby></th>
          </tr>
        </thead>
        <tbody>
          <!-- 透過 v-for 迴圈渲染資料 -->
          <tr v-for="(exam, index) in exams" :key="index">
            <td>{{ exam.time }}</td>
            <td>{{ exam.subject }}</td>
            <td>{{ exam.teacher }}</td>
            <td>
              <button class="edit-btn" @click="editExam(index)" title="編輯">✏️</button>
              <button class="delete-btn" @click="deleteExam(index)" title="刪除">🗑️</button>
            </td>
          </tr>
          <tr v-if="exams.length === 0">
            <td colspan="4" style="text-align: center; color: var(--title-gray);">目前尚無考試排程</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增考科的彈出視窗 -->
    <dialog ref="examModalRef">
      <h3 style="margin-top:0;">{{ editingIndex !== null ? '編輯考試排程' : '新增考試排程' }}</h3>
      <form @submit.prevent="handleAddExam">
        <div class="form-group">
          <label>時間 (HH:MM)</label>
          <input type="time" v-model="newExam.time" required>
        </div>
        <div class="form-group">
          <label>科目名稱</label>
          <input type="text" v-model="newExam.subject" required>
        </div>
        <div class="form-group">
          <label>監考老師</label>
          <input type="text" v-model="newExam.teacher" required>
        </div>
        <div class="dialog-actions">
          <button type="button" @click="closeModal">取消</button>
          <button type="submit" style="background:var(--primary-color); color:white;">儲存</button>
        </div>
      </form>
    </dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { db } from './firebase.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// 狀態變數 (取代原有的 state 物件，利用 Vue 的響應式 ref)
const isCountdown = ref(false);
const showZhuyin = ref(false);
const isDarkMode = ref(false);
const soundEnabled = ref(false);
const warningEnabled = ref(false);
const warningMinutes = ref(3); // 預設為 3 分鐘

const timeText = ref('00:00:00');
const isWarningActive = ref(false);

// 考試資料儲存
const exams = ref([]);

// 紀錄目前正在編輯的陣列索引（null 代表新增模式）
const editingIndex = ref(null);

// 表單狀態與 Dialog 參考
const examModalRef = ref(null);
const newExam = reactive({
  time: '',
  subject: '',
  teacher: ''
});

let timer = null;

// 控制按鈕切換邏輯
const toggleTimeMode = () => isCountdown.value = !isCountdown.value;
const toggleZhuyin = () => showZhuyin.value = !showZhuyin.value;
const toggleTheme = () => isDarkMode.value = !isDarkMode.value;
const toggleSound = () => soundEnabled.value = !soundEnabled.value;
const toggleWarning = () => {
  warningEnabled.value = !warningEnabled.value;
  if (!warningEnabled.value) {
    isWarningActive.value = false;
  }
};

// 視窗控制
const openModal = () => {
  editingIndex.value = null; // 確保點擊「新增」時是乾淨的狀態
  newExam.time = '';
  newExam.subject = '';
  newExam.teacher = '';
  examModalRef.value.showModal();
};

const closeModal = () => {
  examModalRef.value.close();
  // 重置表單
  newExam.time = '';
  newExam.subject = '';
  newExam.teacher = '';
  editingIndex.value = null;
};

// 編輯考試：將舊資料帶入表單並開啟視窗
const editExam = (index) => {
  editingIndex.value = index;
  newExam.time = exams.value[index].time;
  newExam.subject = exams.value[index].subject;
  newExam.teacher = exams.value[index].teacher;
  examModalRef.value.showModal();
};

// 新增與儲存考試
const handleAddExam = async () => {
  try {
    if (editingIndex.value !== null) {
      const examId = exams.value[editingIndex.value].id;
      await updateDoc(doc(db, 'exams', examId), {
        time: newExam.time,
        subject: newExam.subject,
        teacher: newExam.teacher,
        notified: false
      });
    } else {
      await addDoc(collection(db, 'exams'), {
        time: newExam.time,
        subject: newExam.subject,
        teacher: newExam.teacher,
        notified: false
      });
    }
    await fetchExams(); // 重新從資料庫獲取最新資料
    closeModal();
  } catch (error) {
    console.error("儲存到資料庫時發生錯誤：", error);
  }
};

// 刪除考試
const deleteExam = async (index) => {
  if (confirm('確定要刪除這個考科嗎？')) {
    try {
      const examId = exams.value[index].id;
      await deleteDoc(doc(db, 'exams', examId));
      await fetchExams(); // 重新讀取資料
    } catch (error) {
      console.error("刪除資料時發生錯誤：", error);
    }
  }
};

// 監聽自訂警告時間變化並儲存
watch(warningMinutes, (newVal) => {
  localStorage.setItem('warning-minutes', newVal);
});

// 匯出為 CSV (可用 Excel 開啟)
const exportToCSV = () => {
  if (exams.value.length === 0) {
    alert('目前沒有資料可以匯出！');
    return;
  }
  // 加入 BOM (\uFEFF) 讓 Excel 能正確解析 UTF-8 中文
  let csvContent = '\uFEFF時間,科目,監考老師\n';
  exams.value.forEach(e => {
    csvContent += `${e.time},${e.subject},${e.teacher}\n`;
  });
  downloadFile(csvContent, '考試排程.csv', 'text/csv;charset=utf-8;');
};

// 匯出為 JSON
const exportToJSON = () => {
  if (exams.value.length === 0) {
    alert('目前沒有資料可以匯出！');
    return;
  }
  const jsonContent = JSON.stringify(exams.value, null, 2);
  downloadFile(jsonContent, '考試排程.json', 'application/json');
};

// 下載檔案的共用函式
const downloadFile = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // 釋放記憶體
};

// 產生提示嗶聲
const playBeep = () => {
  if (!soundEnabled.value) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1.5);
};

// 時鐘與倒數核心邏輯
const updateClock = () => {
  const now = new Date();
  
  if (!isCountdown.value) {
    // 時鐘模式
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    timeText.value = `${hh}:${mm}:${ss}`;
    isWarningActive.value = false;
  } else {
    // 倒數模式
    let nextExam = null;
    for(let i = 0; i < exams.value.length; i++) {
      const [eHour, eMin] = exams.value[i].time.split(':');
      const examDate = new Date();
      examDate.setHours(eHour, eMin, 0, 0);
      
      if (examDate > now) {
        nextExam = { data: exams.value[i], date: examDate };
        break;
      } else if (!exams.value[i].notified && (now - examDate) < 2000) {
        exams.value[i].notified = true;
        playBeep();
      }
    }

    if (nextExam) {
      const diffMs = nextExam.date - now;
      const totalSeconds = Math.floor(diffMs / 1000);
      
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      
      timeText.value = (h > 0 ? `${String(h).padStart(2,'0')}:` : '') + 
                       `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      
      // 自訂警告時間判斷
      if (warningEnabled.value && totalSeconds <= warningMinutes.value * 60 && totalSeconds > 0) {
        isWarningActive.value = true;
      } else {
        isWarningActive.value = false;
      }
    } else {
      timeText.value = "--:--";
      isWarningActive.value = false;
    }
  }
};

// 從 Firebase Firestore 讀取資料
const fetchExams = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'exams'));
    const loadedExams = [];
    querySnapshot.forEach((doc) => {
      loadedExams.push({ id: doc.id, ...doc.data() });
    });
    loadedExams.sort((a, b) => a.time.localeCompare(b.time));
    exams.value = loadedExams;
  } catch (error) {
    console.error("讀取資料庫時發生錯誤：", error);
  }
};

// 生命週期綁定
onMounted(() => {
  // 當元件掛載時，從 Firebase 讀取考試資料
  fetchExams();

  // 讀取已儲存的自訂警告時間
  const savedWarningMin = localStorage.getItem('warning-minutes');
  if (savedWarningMin) {
    warningMinutes.value = parseInt(savedWarningMin, 10);
  }

  timer = setInterval(updateClock, 1000);
  updateClock();
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style>
/* 移除預設 body 邊距，確保 wrapper 可以滿版 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>

<style scoped>
.app-wrapper {
  --bg-color: #f8f9fa;
  --text-color: #333333;
  --title-black: #000000;
  --title-gray: #777777;
  --panel-bg: #ffffff;
  --border-color: #dddddd;
  --primary-color: #0056b3;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  padding: 10px;
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.app-wrapper.dark-mode {
  --bg-color: #1a1a1a;
  --text-color: #f0f0f0;
  --title-black: #ffffff;
  --title-gray: #aaaaaa;
  --panel-bg: #2d2d2d;
  --border-color: #444444;
  --primary-color: #4dabf7;
}

.warning-active {
  animation: warningPulse 1s infinite alternate;
}
@keyframes warningPulse {
  from { background-color: var(--bg-color); }
  to { background-color: #ff4c4c; }
}

header {
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
  padding-top: 20px;
}

.menu-btn {
  position: absolute;
  left: 0;
  text-decoration: none;
  background: var(--primary-color);
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 0.9em;
  font-weight: bold;
}

header h1 {
  margin: 0;
  font-size: 1.8em;
}
header h1 .title-black { color: var(--title-black); }
header h1 .title-gray { color: var(--title-gray); }

.subtitle {
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
}

button {
  background-color: var(--panel-bg);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}
button:hover { background-color: var(--border-color); }
button.active {
  border-color: var(--primary-color);
  background-color: rgba(0, 86, 179, 0.1);
}

.warning-setting {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  color: var(--title-gray);
}
.warning-setting input {
  width: 50px;
  background: var(--panel-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 4px;
  text-align: center;
  margin-right: 5px;
}

.time-display {
  font-size: 4em;
  font-weight: bold;
  margin: 20px 0;
  font-variant-numeric: tabular-nums;
  text-align: center;
}
.time-label {
  font-size: 0.3em;
  display: block;
  color: var(--title-gray);
  margin-bottom: -10px;
}

.exam-section {
  width: 100%;
  max-width: 800px;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}
.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.add-btn {
  flex: 1;
  justify-content: center;
  background-color: var(--primary-color);
  color: white;
  border: none;
}
.add-btn:hover { background-color: #004494; color: white; }

.export-btn {
  justify-content: center;
  background-color: #28a745;
  color: white;
  border: none;
}
.export-btn:hover { background-color: #218838; color: white; }

.edit-btn {
  background-color: transparent;
  border: 1px solid transparent;
  padding: 6px 10px;
  color: var(--primary-color);
}
.edit-btn:hover {
  background-color: rgba(0, 86, 179, 0.1);
  border-color: var(--primary-color);
}

.delete-btn {
  background-color: transparent;
  border: 1px solid transparent;
  padding: 6px 10px;
  color: #ff4c4c;
}
.delete-btn:hover {
  background-color: rgba(255, 76, 76, 0.1);
  border-color: #ff4c4c;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}
th { background-color: rgba(0,0,0,0.05); }
.app-wrapper.dark-mode th { background-color: rgba(255,255,255,0.05); }

rt {
  display: none;
  font-size: 0.5em;
  color: var(--title-gray);
}
.show-zhuyin rt { display: block; }

dialog {
  background-color: var(--panel-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
}
dialog::backdrop { background: rgba(0,0,0,0.5); }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; }
.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-color);
  color: var(--text-color);
}
.dialog-actions { display: flex; justify-content: flex-end; gap: 10px; }

@media (max-width: 600px) {
  .time-display { font-size: 3em; }
  header h1 { font-size: 1.4em; }
  .subtitle { font-size: 1em; }
  .controls button { font-size: 0.9em; padding: 8px 10px; }
  th, td { padding: 8px; font-size: 0.9em; }
}
</style>