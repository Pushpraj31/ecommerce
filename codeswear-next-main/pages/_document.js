<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDGV67d_Nxpari9C6iYmV7amEhWb3MzS4k",
    authDomain: "clothing-2cd1e.firebaseapp.com",
    projectId: "clothing-2cd1e",
    storageBucket: "clothing-2cd1e.firebasestorage.app",
    messagingSenderId: "781872233527",
    appId: "1:781872233527:web:7bfd601e7bcf48314953b2",
    measurementId: "G-3YVPNWTV0M"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
