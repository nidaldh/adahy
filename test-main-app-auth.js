// Complete Auth Test Script
console.log('=== COMPREHENSIVE AUTH TEST ===');

// Test the exact flow from the main app
function testMainAppAuthFlow() {
    console.log('Testing main app auth flow...');
    
    // Simulate the exact initialization sequence
    let currentUser = null;
    let authStateListenerAttached = false;
    
    // Step 1: Check Firebase availability
    console.log('1. Firebase available:', typeof firebase !== 'undefined');
    console.log('2. Firebase.auth available:', typeof firebase !== 'undefined' && !!firebase.auth);
    
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.error('❌ Firebase Auth not available');
        return;
    }
    
    // Step 2: Initialize Firebase if needed
    try {
        const auth = firebase.auth();
        console.log('3. Auth instance created:', !!auth);
        
        // Step 3: Set up auth state listener
        if (!authStateListenerAttached) {
            console.log('4. Setting up auth state listener...');
            
            auth.onAuthStateChanged((user) => {
                console.log('=== AUTH STATE CHANGED ===');
                console.log('Timestamp:', new Date().toISOString());
                
                if (user) {
                    console.log('✅ User authenticated:', user.email);
                    currentUser = user;
                } else {
                    console.log('❌ No user authenticated');
                    currentUser = null;
                }
            });
            
            authStateListenerAttached = true;
            console.log('5. ✅ Auth state listener set up');
        }
        
        // Step 4: Test login function
        window.testMainAppLogin = async function(email, password) {
            console.log('=== TESTING LOGIN ===');
            console.log('Email:', email);
            
            try {
                console.log('6. Calling signInWithEmailAndPassword...');
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                
                console.log('7. ✅ Login successful!');
                console.log('User:', userCredential.user.email);
                console.log('UID:', userCredential.user.uid);
                
                // Manual check
                currentUser = userCredential.user;
                console.log('8. Current user set to:', currentUser.email);
                
                return userCredential;
            } catch (error) {
                console.error('❌ Login failed:', error.code, error.message);
                throw error;
            }
        };
        
        console.log('✅ Main app auth flow test ready');
        console.log('Use testMainAppLogin("email", "password") to test');
        
    } catch (error) {
        console.error('❌ Auth flow test failed:', error);
    }
}

// Run the test
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(testMainAppAuthFlow, 1000);
});
