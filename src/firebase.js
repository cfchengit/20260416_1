import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 你的網頁應用程式的 Firebase 設定
// 請替換成你在 Firebase Console 中獲得的實際設定值
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Cloud Firestore 並導出以供其他檔案使用
export const db = getFirestore(app);