// Authentication debugging utilities - NO TEST ACCOUNTS
// This script provides debugging information only

console.log('=== Authentication Debug Utilities Loaded ===');

// Debug function to check Firebase and Auth state
async function debugAuthState() {
    try {
        console.log('🔍 Checking Firebase initialization...');
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase not loaded');
            return false;
        }
        console.log('✅ Firebase is loaded');

        console.log('🔍 Checking Firebase Auth availability...');
        if (!firebase.auth) {
            console.error('❌ Firebase Auth not available');
            return false;
        }
        console.log('✅ Firebase Auth is available');

        console.log('🔍 Checking current auth state...');
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            console.log('✅ User is authenticated:', currentUser.email);
            console.log('   User ID:', currentUser.uid);
            console.log('   Email verified:', currentUser.emailVerified);
        } else {
            console.log('ℹ️ No user currently authenticated');
        }

        console.log('🔍 Checking auth state listener...');
        firebase.auth().onAuthStateChanged((user) => {
            console.log('🔄 Auth state changed:', user ? user.email : 'No user');
        });

        console.log('✅ Authentication debug complete');
        return true;

    } catch (error) {
        console.error('❌ Debug failed:', error);
        return false;
    }
}

// Function to check if auth elements exist in DOM
function checkAuthElements() {
    console.log('🔍 Checking auth-related DOM elements...');
    
    const loginSection = document.getElementById('login-section');
    const appSection = document.getElementById('app-section');
    const loginForm = document.getElementById('login-form');
    
    console.log('Login section exists:', !!loginSection);
    console.log('App section exists:', !!appSection);
    console.log('Login form exists:', !!loginForm);
    
    if (loginSection) {
        console.log('Login section visible:', loginSection.style.display !== 'none');
    }
    if (appSection) {
        console.log('App section visible:', appSection.style.display !== 'none');
    }
}

// Function to manually trigger logout (for debugging)
async function debugLogout() {
    try {
        console.log('🔍 Attempting logout...');
        await firebase.auth().signOut();
        console.log('✅ Logout successful');
    } catch (error) {
        console.error('❌ Logout failed:', error);
    }
}

// Make debug functions available globally
window.debugAuthState = debugAuthState;
window.checkAuthElements = checkAuthElements;
window.debugLogout = debugLogout;

// Run basic debug check when script loads
console.log('🚀 Auth debug utilities ready. Available functions:');
console.log('   - debugAuthState(): Check Firebase and auth status');
console.log('   - checkAuthElements(): Check auth DOM elements');
console.log('   - debugLogout(): Force logout current user');
console.log('   Call any function from browser console for debugging.');
