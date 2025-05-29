// Test Firebase Authentication Flow
console.log('=== Firebase Auth Diagnostic Started ===');

// Check if Firebase is loaded
console.log('1. Firebase available:', typeof firebase !== 'undefined');
console.log('2. Firebase.auth available:', typeof firebase !== 'undefined' && !!firebase.auth);

if (typeof firebase !== 'undefined' && firebase.auth) {
    console.log('3. Creating auth instance...');
    const auth = firebase.auth();
    console.log('4. Auth instance created:', !!auth);
    
    // Test auth state listener
    console.log('5. Setting up auth state listener...');
    auth.onAuthStateChanged((user) => {
        console.log('=== AUTH STATE CHANGED ===');
        console.log('User:', user);
        if (user) {
            console.log('User email:', user.email);
            console.log('User UID:', user.uid);
            console.log('User emailVerified:', user.emailVerified);
        } else {
            console.log('No user signed in');
        }
    });
    
    // Test login function
    window.testLogin = async function(email, password) {
        console.log('=== TESTING LOGIN ===');
        console.log('Email:', email);
        console.log('Password length:', password.length);
        
        try {
            console.log('Calling signInWithEmailAndPassword...');
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('Login successful!');
            console.log('User credential:', userCredential);
            console.log('User:', userCredential.user);
            return userCredential;
        } catch (error) {
            console.error('Login failed:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            throw error;
        }
    };
    
    console.log('6. Test functions ready. Use testLogin("email", "password") to test.');
} else {
    console.error('Firebase Auth not available!');
}
