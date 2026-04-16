import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 你的網頁應用程式的 Firebase 設定
// 請替換成你在 Firebase Console 中獲得的實際設定值
const firebaseConfig = {
apiKey: "AIzaSyADpwfL6Fp8kAXobb2J-qCEbCiebjSxcWk",
  authDomain: "project-5135343239306961332.firebaseapp.com",
  projectId: "project-5135343239306961332",
  storageBucket: "project-5135343239306961332.firebasestorage.app",
  messagingSenderId: "96682590548",
  appId: "1:96682590548:web:2aa7bf9ec8f01f83b108c1",
  measurementId: "G-Z42RZ2M96D"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Cloud Firestore 並導出以供其他檔案使用
export const db = getFirestore(app);