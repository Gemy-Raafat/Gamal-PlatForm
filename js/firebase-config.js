const firebaseConfig = {
  apiKey: "AIzaSyCqNL7hOHakEuI9AtliO4GswLPPRI75ijc",
  authDomain: "gamal-platform.firebaseapp.com",
  databaseURL: "https://gamal-platform-default-rtdb.firebaseio.com",
  projectId: "gamal-platform",
  storageBucket: "gamal-platform.firebasestorage.app",
  messagingSenderId: "623077685578",
  appId: "1:623077685578:web:df4113565ca42b8f9ae9b3",
  measurementId: "G-H1W0N5WGB9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
console.log('✅ Firebase connected');