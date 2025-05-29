// Admin-only authentication debugging tools
// This file provides administrative tools for debugging authentication only
// Note: Test account functionality has been removed for security

// Debug function to check Firebase Auth status
function checkAuthStatus() {
    console.log('=== Authentication Status Check ===');
    console.log('Firebase available:', typeof firebase !== 'undefined');
    console.log('Firebase Auth available:', typeof firebase !== 'undefined' && !!firebase.auth);
    
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const currentUser = firebase.auth().currentUser;
        console.log('Current user:', currentUser ? currentUser.email : 'None');
        console.log('Auth state:', currentUser ? 'Authenticated' : 'Not authenticated');
    }
    console.log('===============================');
}

// Debug function to force logout (admin only)
function forceLogout() {
    console.log('Forcing logout...');
    
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut()
            .then(() => {
                console.log('Logout successful');
                alert('تم تسجيل الخروج بنجاح');
            })
            .catch((error) => {
                console.error('Logout error:', error);
                alert('خطأ في تسجيل الخروج: ' + error.message);
            });
    } else {
        console.error('Firebase Auth not available');
        alert('Firebase Auth غير متوفر');
    }
}

// Debug function to check DOM elements
function checkDOMElements() {
    console.log('=== DOM Elements Check ===');
    const elements = {
        'login-container': document.getElementById('login-container'),
        'app-container': document.getElementById('app-container'),
        'login-form': document.getElementById('login-form'),
        'logout-btn': document.getElementById('logout-btn'),
        'user-email': document.getElementById('user-email')
    };

    for (const [name, element] of Object.entries(elements)) {
        console.log(`${name}:`, element ? 'Found' : 'Not found');
    }
    console.log('=========================');
}

// Make functions available for admin debugging
window.checkAuthStatus = checkAuthStatus;
window.forceLogout = forceLogout;
window.checkDOMElements = checkDOMElements;
                loginForm.appendChild(altTestButton);
                loginForm.appendChild(debugButton);
            }
        }, 1000);
    }
});
