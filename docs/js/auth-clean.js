// Authentication functionality for the animal sales app - Login Only
let currentUser = null;

// DOM elements
let loginContainer, appContainer, loginForm, logoutBtn, userEmailSpan, loginError;

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    loginContainer = document.getElementById('login-container');
    appContainer = document.getElementById('app-container');
    loginForm = document.getElementById('login-form');
    userEmailSpan = document.getElementById('user-email');
    loginError = document.getElementById('login-error');
    
    // Note: logoutBtn will be initialized later when main app is shown
    
    // Initialize Firebase first, then auth
    if (typeof initializeFirebase === 'function') {
        initializeFirebase();
    }
    
    // Wait a bit for Firebase to initialize
    setTimeout(() => {
        initializeAuth();
    }, 500);
});

// Initialize Firebase Auth and check current user
function initializeAuth() {
    // Wait for Firebase to be initialized
    if (typeof firebase !== 'undefined' && firebase.auth) {
        // Hide loading indicator and show login form
        const loadingIndicator = document.getElementById('loading-indicator');
        const loginContent = document.getElementById('login-content');
        
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (loginContent) loginContent.style.display = 'block';
        
        // Listen for authentication state changes
        firebase.auth().onAuthStateChanged((user) => {
            console.log('Auth state changed. User:', user ? user.email : 'null');
            if (user) {
                currentUser = user;
                console.log('Showing main app for user:', user.email);
                showMainApp();
            } else {
                currentUser = null;
                console.log('No user, showing login screen');
                showLoginScreen();
            }
        });

        // Add event listeners for forms
        setupEventListeners();
    } else {
        console.error('Firebase Auth not available');
        // Hide loading and show a fallback message or main app
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.innerHTML = '<p>Firebase غير متاح، الانتقال للوضع المحلي...</p>';
        }
        // Fallback to show main app without authentication after a delay
        setTimeout(() => {
            showMainApp();
        }, 2000);
    }
}

// Set up event listeners for authentication forms
function setupEventListeners() {
    // Check if elements exist before adding listeners
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleLogin();
        });
    } else {
        console.error('Login form not found');
    }
    
    // Note: Logout button is set up in showMainApp() when it becomes available
}

// Handle user login
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Login attempt:', { email, passwordLength: password.length });

    // Validate input
    if (!email || !password) {
        showError('login-error', 'يرجى ملء جميع الحقول');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('login-error', 'البريد الإلكتروني غير صحيح');
        return;
    }

    try {
        clearErrors();
        console.log('Attempting to sign in with Firebase Auth...');
        
        // Check if Firebase Auth is available
        if (!firebase.auth) {
            console.error('Firebase Auth is not available');
            showError('login-error', 'خدمة المصادقة غير متوفرة');
            return;
        }

        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('User logged in successfully:', userCredential.user.email);
        
        // Clear form
        document.getElementById('login-form').reset();
        
    } catch (error) {
        console.error('Login error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        showError('login-error', getErrorMessage(error.code));
    }
}

// Handle user logout
async function handleLogout() {
    try {
        console.log('Starting logout process...');
        if (firebase.auth) {
            await firebase.auth().signOut();
            console.log('User logged out successfully');
            // Clear current user
            currentUser = null;
            // Force redirect to login screen
            showLoginScreen();
        } else {
            console.error('Firebase auth not available for logout');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('خطأ في تسجيل الخروج: ' + error.message);
    }
}

// Make handleLogout globally available
window.handleLogout = handleLogout;

// Show the main application
function showMainApp() {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';
    
    // Initialize logout button now that main app is visible
    logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn && !logoutBtn.hasAttribute('data-listener-added')) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Logout button clicked');
            await handleLogout();
        });
        logoutBtn.setAttribute('data-listener-added', 'true');
        console.log('Logout button event listener added successfully');
    } else if (logoutBtn) {
        console.log('Logout button already has event listener');
    } else {
        console.error('Logout button not found in main app');
    }
    
    // Update user info in header
    if (currentUser && userEmailSpan) {
        userEmailSpan.textContent = currentUser.email;
    }
    
    // Initialize the main app if it hasn't been initialized yet
    // Check if functions exist before calling them
    setTimeout(() => {
        if (typeof initializeCustomerEntry === 'function') {
            initializeCustomerEntry();
        }
        if (typeof initializeCustomerList === 'function') {
            initializeCustomerList();
        }
        if (typeof initializePaymentEntry === 'function') {
            initializePaymentEntry();
        }
        if (typeof initializeBalanceSheet === 'function') {
            initializeBalanceSheet();
        }
        
        // Load data from Firebase
        if (typeof loadCustomersFromFirebase === 'function') {
            loadCustomersFromFirebase();
        }
        if (typeof loadPaymentsFromFirebase === 'function') {
            loadPaymentsFromFirebase();
        }
        if (typeof loadGlobalAnimalsFromFirebase === 'function') {
            loadGlobalAnimalsFromFirebase();
        }
    }, 100);
}

// Show the login screen
function showLoginScreen() {
    loginContainer.style.display = 'flex';
    appContainer.style.display = 'none';
    
    // Reset form if it exists
    if (loginForm) loginForm.reset();
    
    clearErrors();
    
    console.log('Login screen displayed');
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Clear error messages
function clearErrors() {
    if (loginError) {
        loginError.style.display = 'none';
        loginError.textContent = '';
    }
}

// Get user-friendly error messages in Arabic
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'المستخدم غير موجود';
        case 'auth/wrong-password':
            return 'كلمة المرور غير صحيحة';
        case 'auth/invalid-email':
            return 'البريد الإلكتروني غير صحيح';
        case 'auth/too-many-requests':
            return 'عدد كبير من المحاولات، حاول لاحقاً';
        case 'auth/network-request-failed':
            return 'خطأ في الاتصال بالإنترنت';
        case 'auth/user-disabled':
            return 'هذا الحساب معطل';
        case 'auth/invalid-credential':
            return 'بيانات الاعتماد غير صحيحة';
        case 'auth/timeout':
            return 'انتهت مهلة الاتصال، حاول مرة أخرى';
        default:
            return `حدث خطأ في تسجيل الدخول: ${errorCode || 'غير محدد'}`;
    }
}

// Get current user (utility function for other scripts)
function getCurrentUser() {
    return currentUser;
}

// Check if user is authenticated (utility function for other scripts)
function isUserAuthenticated() {
    return currentUser !== null;
}

// Debug function to check logout button status
function debugLogoutButton() {
    const btn = document.getElementById('logout-btn');
    console.log('=== Logout Button Debug ===');
    console.log('Button element:', btn);
    console.log('Button exists:', !!btn);
    if (btn) {
        console.log('Button visible:', btn.offsetParent !== null);
        console.log('Button disabled:', btn.disabled);
        console.log('Button innerHTML:', btn.innerHTML);
        console.log('Button listeners added:', btn.hasAttribute('data-listener-added'));
        console.log('Button onclick:', btn.onclick);
        
        // Test click programmatically
        console.log('Testing programmatic click...');
        btn.click();
    }
    console.log('Current user:', currentUser);
    console.log('========================');
}

// Make it available globally for testing
window.debugLogoutButton = debugLogoutButton;
