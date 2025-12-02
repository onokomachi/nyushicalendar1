import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAlqBcmbJf9ZRO90Iq82wEFcDTeU7NhLxw",
    authDomain: "entrance-examcalendar1.firebaseapp.com",
    projectId: "entrance-examcalendar1",
    storageBucket: "entrance-examcalendar1.firebasestorage.app",
    messagingSenderId: "749166806740",
    appId: "1:749166806740:web:2223ecb1fa665297b51d41",
    measurementId: "G-GQ5TNNMK2V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
