// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBDWxvIuGQzht5gbH7598oQi8pKkJFWIhQ",
    authDomain: "kata-progress.firebaseapp.com",
    projectId: "kata-progress",
    storageBucket: "kata-progress.appspot.com",
    messagingSenderId: "376119148504",
    appId: "1:376119148504:web:0b57759017c9ede6837cad",
    measurementId: "G-CQB5ZHMV6R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export { app, analytics };
