import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDtpuUgyolmvhIyEa2EYuNbakq_YIf3e0",
  authDomain: "book-log-775c8.firebaseapp.com",
  projectId: "book-log-775c8",
  storageBucket: "book-log-775c8.firebasestorage.app",
  messagingSenderId: "819107852050",
  appId: "1:819107852050:web:df499fdcd167b28ea44dcb",
  measurementId: "G-ZM86MW6ME2",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
