// ======================================================================
// FIREBASE SETUP — replace the values below with YOUR project's config.
//
// How to get these values (free, ~5 minutes):
// 1. Go to https://console.firebase.google.com and sign in with Google.
// 2. Click "Add project", name it whatever you like (e.g. "nutsathegoat"),
//    skip Google Analytics (not needed).
// 3. Once created, click the "</>" (web) icon to register a web app.
//    Give it a nickname, click "Register app".
// 4. Firebase shows you a firebaseConfig object — copy those values into
//    the object below.
// 5. In the left sidebar: Build > Firestore Database > Create database.
//    Start in "production mode", pick any region.
// 6. In the left sidebar: Build > Authentication > Get started >
//    enable "Email/Password" sign-in method.
// 7. Still in Authentication, go to the "Users" tab and click
//    "Add user" — create ONE user with your own email + a password.
//    This is the only account that will be able to log in and reply
//    to letters on the mailbox page.
// 8. Go back to Firestore Database > Rules tab, and paste in the rules
//    from firestore.rules.txt (included alongside this file), replacing
//    OWNER_EMAIL with the email you used in step 7. Click "Publish".
// ======================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmC1LMUOioxSc6oX-zYXqDMJ55-x4xWkU",
  authDomain: "nutsathegoat.firebaseapp.com",
  projectId: "nutsathegoat",
  storageBucket: "nutsathegoat.firebasestorage.app",
  messagingSenderId: "1001379499456",
  appId: "1:1001379499456:web:e9796e5f3e153aa3148c25"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
