// Authentication functionality for the animal sales app - Login Only
let currentUser = null;
let authStateListenerAttached = false;

// DOM elements
let loginContainer, appContainer, loginForm, logoutBtn, userEmailSpan, loginError;

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM Content Loaded ===');
    
    // Initialize DOM elements
    loginContainer = document.getElementById('login-container');
    appContainer = document.getElementById('app-container');
    loginForm = document.getElementById('login-form');
    userEmailSpan = document.getElementById('user-email');
    loginError = document.getElementById('login-error');
    
    console.log('DOM elements initialized:', {
        loginContainer: !!loginContainer,
        appContainer: !!appContainer,
        loginForm: !!loginForm,
        userEmailSpan: !!userEmailSpan,
        loginError: !!loginError
    });
    
    // Initialize authentication with retries
    initializeAuthWithRetry();
});

// Initialize auth with retry mechanism
function initializeAuthWithRetry(attempts = 0) {
    const maxAttempts = 5;
    const delay = Math.min(1000 * Math.pow(2, attempts), 5000); // Exponential backoff, max 5s
    
    console.log(`=== Auth initialization attempt ${attempts + 1}/${maxAttempts} ===`);
    
    if (attempts >= maxAttempts) {
        console.error('Failed to initialize Firebase Auth after maximum attempts');
        showError('login-error', 'فشل في تهيئة نظام المصادقة');
        return;
    }
    
    if (typeof firebase !== 'undefined' && firebase.auth) {
        console.log('Firebase Auth available, proceeding with initialization');
        initializeAuth();
    } else {
        console.log(`Firebase not ready, retrying in ${delay}ms...`);
        setTimeout(() => initializeAuthWithRetry(attempts + 1), delay);
    }
}

// Initialize Firebase Auth and check current user
function initializeAuth() {
    console.log('=== initializeAuth() called ===');
    console.log('Firebase available:', typeof firebase !== 'undefined');
    console.log('Firebase.auth available:', typeof firebase !== 'undefined' && !!firebase.auth);
    
    try {
        // Ensure Firebase is properly initialized
        if (typeof initializeFirebase === 'function') {
            console.log('Calling initializeFirebase...');
            const firebaseReady = initializeFirebase();
            if (!firebaseReady) {
                console.warn('Firebase initialization returned false');
            }
        }
        
        // Verify Firebase Auth is available
        if (typeof firebase === 'undefined' || !firebase.auth) {
            throw new Error('Firebase Auth is not available');
        }
        
        console.log('Firebase Auth detected, initializing...');
        
        // Get auth instance
        const auth = firebase.auth();
        console.log('Auth instance created:', !!auth);
        
        // Set auth persistence to LOCAL
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                console.log('✓ Auth persistence set to LOCAL');
            })
            .catch((error) => {
                console.warn('Failed to set auth persistence:', error);
            });
        
        // Hide loading indicator and show login form
        const loadingIndicator = document.getElementById('loading-indicator');
        const loginContent = document.getElementById('login-content');
        
        if (loadingIndicator) {
            console.log('Hiding loading indicator');
            loadingIndicator.style.display = 'none';
        }
        if (loginContent) {
            console.log('Showing login content');
            loginContent.style.display = 'block';
        }
        
        // Set up auth state listener only once
        if (!authStateListenerAttached) {
            console.log('Setting up auth state listener...');
            
            auth.onAuthStateChanged((user) => {
                console.log('=== Auth state changed ===');
                console.log('Timestamp:', new Date().toISOString());
                console.log('User object:', user);
                
                if (user) {
                    console.log('✓ User authenticated:', user.email);
                    console.log('User UID:', user.uid);
                    console.log('Email verified:', user.emailVerified);
                    currentUser = user;
                    showMainApp();
                } else {
                    console.log('✗ No user authenticated');
                    currentUser = null;
                    showLoginScreen();
                }
            });
            
            authStateListenerAttached = true;
            console.log('✓ Auth state listener attached');
        } else {
            console.log('Auth state listener already attached');
        }

        // Set up event listeners for forms
        setupEventListeners();
        console.log('✓ Event listeners set up');
        
    } catch (error) {
        console.error('Error in initializeAuth:', error);
        // Show fallback UI
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.innerHTML = '<p style="color: red;">خطأ في تهيئة النظام</p>';
        }
        throw error;
    }
}

// Set up event listeners for authentication forms
function setupEventListeners() {
    console.log('=== Setting up event listeners ===');
    
    // Re-query the login form in case it wasn't available during initial DOM load
    const currentLoginForm = document.getElementById('login-form');
    console.log('Login form found:', !!currentLoginForm);
    
    if (currentLoginForm) {
        console.log('Adding submit event listener to login form');
        
        // Remove any existing event listeners to prevent duplicates
        const newForm = currentLoginForm.cloneNode(true);
        currentLoginForm.parentNode.replaceChild(newForm, currentLoginForm);
        
        newForm.addEventListener('submit', async (e) => {
            console.log('=== Form submit event triggered ===');
            e.preventDefault(); // Prevent default form submission
            e.stopPropagation(); // Stop event propagation
            console.log('Default prevented, calling handleLogin...');
            
            try {
                const result = await handleLogin();
                console.log('HandleLogin completed with result:', result);
            } catch (error) {
                console.error('Error in handleLogin:', error);
                showError('login-error', 'حدث خطأ أثناء تسجيل الدخول');
            }
            
            return false; // Extra prevention
        });
        
        // Also add a backup event listener to the submit button directly
        const submitButton = newForm.querySelector('button[type="submit"]');
        if (submitButton) {
            console.log('Adding click event listener to submit button');
            submitButton.addEventListener('click', async (e) => {
                console.log('=== Submit button clicked ===');
                e.preventDefault(); // Prevent default behavior
                e.stopPropagation();
                
                try {
                    const result = await handleLogin();
                    console.log('HandleLogin from button click completed with result:', result);
                } catch (error) {
                    console.error('Error in handleLogin from button click:', error);
                    showError('login-error', 'حدث خطأ أثناء تسجيل الدخول');
                }
                
                return false;
            });
        }
        
        console.log('✓ Event listeners attached successfully');
    } else {
        console.error('❌ Login form not found! Available forms:');
        const allForms = document.querySelectorAll('form');
        console.log('All forms found:', allForms.length);
        allForms.forEach((form, index) => {
            console.log(`Form ${index}:`, form.id || 'no id', form);
        });
        
        // Try to set up listeners after a delay
        setTimeout(() => {
            console.log('Retrying setupEventListeners after delay...');
            setupEventListeners();
        }, 1000);
    }
    
    // Note: Logout button is set up in showMainApp() when it becomes available
}

// Handle user login
async function handleLogin() {
    console.log('=== handleLogin() function called ===');
    
    try {
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        console.log('Email field found:', !!emailField);
        console.log('Password field found:', !!passwordField);
        
        if (!emailField || !passwordField) {
            console.error('Email or password field not found');
            showError('login-error', 'خطأ في النموذج - لم يتم العثور على الحقول');
            return false;
        }
        
        const email = emailField.value.trim();
        const password = passwordField.value;

        console.log('=== Login attempt ===');
        console.log('Email:', email);
        console.log('Password length:', password.length);
        console.log('Timestamp:', new Date().toISOString());

        // Validate input
        if (!email || !password) {
            console.warn('Empty email or password');
            showError('login-error', 'يرجى ملء جميع الحقول');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.warn('Invalid email format:', email);
            showError('login-error', 'البريد الإلكتروني غير صحيح');
            return false;
        }

        clearErrors();
        console.log('Validation passed, attempting Firebase sign in...');
        
        // Check if Firebase Auth is available
        if (!firebase || !firebase.auth) {
            console.error('Firebase Auth is not available');
            showError('login-error', 'خدمة المصادقة غير متوفرة');
            return false;
        }

        const auth = firebase.auth();
        console.log('Using auth instance:', !!auth);
        console.log('Auth currentUser before login:', auth.currentUser);
        
        console.log('Calling signInWithEmailAndPassword...');
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        console.log('=== Login successful ===');
        console.log('User credential:', userCredential);
        console.log('User object:', userCredential.user);
        console.log('User email:', userCredential.user.email);
        console.log('User UID:', userCredential.user.uid);
        console.log('Email verified:', userCredential.user.emailVerified);
        
        // Manually update currentUser to ensure it's set
        currentUser = userCredential.user;
        console.log('Current user manually set to:', currentUser);
        
        // Check auth state immediately after login
        console.log('Auth currentUser after login:', auth.currentUser);
        
        // Clear form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.reset();
            console.log('Login form reset');
        }
        
        return true;
        
    } catch (error) {
        console.error('=== Login error ===');
        console.error('Error object:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        showError('login-error', getErrorMessage(error.code));
        return false;
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
