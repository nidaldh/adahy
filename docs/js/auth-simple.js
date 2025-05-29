// Simplified Authentication for Animal Sales App
// Clean, straightforward implementation without complexity

let currentUser = null;
let isInitialized = false;

// Wait for DOM and Firebase to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting auth initialization...');
    initializeAuth();
});

function initializeAuth() {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        console.error('Firebase not loaded');
        setTimeout(initializeAuth, 1000);
        return;
    }

    if (!firebase.auth) {
        console.error('Firebase Auth not available');
        setTimeout(initializeAuth, 1000);
        return;
    }

    console.log('Firebase Auth available, setting up...');

    // Initialize Firebase if needed
    if (typeof initializeFirebase === 'function') {
        initializeFirebase();
    }

    // Hide loading, show login form
    hideLoading();
    
    // Set up auth state listener
    firebase.auth().onAuthStateChanged(user => {
        console.log('Auth state changed:', user ? user.email : 'No user');
        
        if (user) {
            currentUser = user;
            showMainApp();
        } else {
            currentUser = null;
            showLoginScreen();
        }
    });

    // Set up form submission
    setupLoginForm();
    
    isInitialized = true;
    console.log('Auth initialization complete');
}

function setupLoginForm() {
    const form = document.getElementById('login-form');
    
    if (!form) {
        console.error('Login form not found');
        return;
    }

    // Remove any existing listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    // Add single event listener
    newForm.onsubmit = async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Form submitted, processing login...');
        await handleLogin();
        return false;
    };

    console.log('Login form setup complete');
}

async function handleLogin() {
    console.log('=== Starting login process ===');
    
    try {
        // Get form values
        const email = document.getElementById('email')?.value?.trim() || '';
        const password = document.getElementById('password')?.value || '';

        console.log('Login attempt for:', email);

        // Validate inputs
        if (!email || !password) {
            showError('يرجى ملء جميع الحقول');
            return;
        }

        if (!isValidEmail(email)) {
            showError('البريد الإلكتروني غير صحيح');
            return;
        }

        clearError();

        // Attempt login
        console.log('Signing in with Firebase...');
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        
        console.log('Login successful:', userCredential.user.email);
        
        // Clear form
        document.getElementById('login-form').reset();
        
    } catch (error) {
        console.error('Login error:', error);
        showError(getErrorMessage(error.code));
    }
}

// Function to initialize all application components
function initializeMainApplication() {
    console.log('Initializing main application components');
    
    // Initialize the customer entry form (important for name and phone fields)
    if (typeof initializeCustomerEntry === 'function') {
        console.log('Initializing customer entry form');
        initializeCustomerEntry();
    } else {
        console.error('initializeCustomerEntry function not found');
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
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function hideLoading() {
    const loading = document.getElementById('loading-indicator');
    const content = document.getElementById('login-content');
    
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';
}

function showLoginScreen() {
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    
    if (loginContainer) loginContainer.style.display = 'block';
    if (appContainer) appContainer.style.display = 'none';
    
    console.log('Showing login screen');
}

function showMainApp() {
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const userEmailSpan = document.getElementById('user-email');
    
    if (loginContainer) loginContainer.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';
    
    if (userEmailSpan && currentUser) {
        userEmailSpan.textContent = currentUser.email;
    }
    
    // Initialize the main application components
    initializeMainApplication();
    
    console.log('Showing main app for user:', currentUser?.email);
}

function showError(message) {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    console.error('Login error displayed:', message);
}

function clearError() {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

async function handleLogout() {
    try {
        console.log('Logging out...');
        await firebase.auth().signOut();
        console.log('Logout successful');
    } catch (error) {
        console.error('Logout error:', error);
        alert('خطأ في تسجيل الخروج: ' + error.message);
    }
}

// Make logout function globally available
window.handleLogout = handleLogout;

function getErrorMessage(errorCode) {
    const messages = {
        'auth/user-not-found': 'المستخدم غير موجود',
        'auth/wrong-password': 'كلمة المرور غير صحيحة',
        'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
        'auth/user-disabled': 'تم تعطيل هذا الحساب',
        'auth/too-many-requests': 'تم تجاوز حد المحاولات، حاول لاحقاً',
        'auth/network-request-failed': 'خطأ في الاتصال بالشبكة',
        'auth/invalid-credential': 'بيانات الدخول غير صحيحة'
    };
    
    return messages[errorCode] || 'حدث خطأ في تسجيل الدخول';
}

console.log('Simple auth module loaded');
