// --- This is the complete and correct code for your main.js file ---

// 1. Your Firebase Configuration from the Firebase Console
// Make sure you have pasted your actual config object here!
const firebaseConfig = {
    apiKey: "AIzaSyD66DfvSsomkSJB4FlDjBNDb0rmPIPqj-0",
    authDomain: "bq-hub.firebaseapp.com",
    databaseURL: "https://bq-hub-default-rtdb.firebaseio.com",
    projectId: "bq-hub",
    storageBucket: "bq-hub.firebasestorage.app",
    messagingSenderId: "155390522014",
    appId: "1:155390522014:web:1588e2e8ddbef4a5dac18f",
    measurementId: "G-M32FNT4MPS"
};

// 2. Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 3. Get References to Services
const auth = firebase.auth();
const database = firebase.database();

// 4. Get References to DOM Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginSection = document.getElementById('login-section');
const appContent = document.getElementById('app-content');
const userNameEl = document.getElementById('user-name');
const userPhotoEl = document.getElementById('user-photo');
const dbContentEl = document.getElementById('db-content');

// 5. Setup Authentication Provider
const provider = new firebase.auth.GoogleAuthProvider();

// --- DEBUGGING CHECK ---
// This message confirms that main.js is being loaded and executed.
console.log("main.js script loaded. Attaching event listener to the login button...");

// Add the click listener to the login button
loginBtn.addEventListener('click', () => {
    // This message proves the button click is being detected.
    console.log("Login button was CLICKED!"); 
    
    console.log("Attempting to sign in with Google popup...");
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Successfully signed in!", result.user);
        })
        .catch(error => {
            console.error("Error during sign-in popup:", error);
        });
});

logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// 6. Auth State Change Listener (manages UI based on login state)
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in.
        console.log("Auth state changed: User is signed IN.", user.displayName);
        loginSection.classList.add('hidden');
        appContent.classList.remove('hidden');
        userNameEl.textContent = user.displayName;
        userPhotoEl.src = user.photoURL;

        const userRef = database.ref('users/' + user.uid);
        
        userRef.set({
            displayName: user.displayName,
            email: user.email,
            lastLogin: new Date().toISOString()
        });

        userRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                dbContentEl.innerHTML = `
                    <p><strong>Name:</strong> ${data.displayName}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Last Login:</strong> ${new Date(data.lastLogin).toLocaleString()}</p>
                `;
            }
        });

    } else {
        // User is signed out.
        console.log("Auth state changed: User is signed OUT.");
        loginSection.classList.remove('hidden');
        appContent.classList.add('hidden');
        dbContentEl.innerHTML = "<p>Loading...</p>";
    }
});