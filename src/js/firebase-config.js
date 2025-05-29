// Firebase configuration
// Updated with your new Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvmM4YI4sr9mv_-UTSFWuabaw_8D1BBKM",
    authDomain: "alfaree-615b6.firebaseapp.com",
    databaseURL: "https://alfaree-615b6-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "alfaree-615b6",
    storageBucket: "alfaree-615b6.firebasestorage.app",
    messagingSenderId: "935148742009",
    appId: "1:935148742009:web:79b7b2f675b07b2ef2fba8",
    measurementId: "G-0TJ606H9YS"
};

// Initialize Firebase (will be loaded from CDN in HTML)
let firebaseInitialized = false;

function initializeFirebase() {
    if (firebaseInitialized) {
        console.log('Firebase already initialized, skipping');
        return true;
    }
    
    if (typeof firebase !== 'undefined') {
        try {
            // Check if Firebase is already initialized
            if (firebase.apps && firebase.apps.length > 0) {
                console.log('Firebase already initialized by another script');
                firebaseInitialized = true;
                return true;
            }
            
            firebase.initializeApp(firebaseConfig);
            firebaseInitialized = true;
            
            // Initialize Analytics if available
            if (firebase.analytics) {
                firebase.analytics();
                console.log('Firebase Analytics initialized successfully');
            }
            
            // Initialize Auth
            if (firebase.auth) {
                console.log('Firebase Auth initialized successfully');
            }
            
            console.log('Firebase initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Firebase:', error);
            console.log('Falling back to localStorage');
            return false;
        }
    } else {
        console.log('Firebase not available, using localStorage');
        return false;
    }
}

// Get user-specific path for data
function getUserDataPath(path) {
    const user = firebase.auth ? firebase.auth().currentUser : null;
    if (user) {
        return `users/${user.uid}/${path}`;
    }
    return path; // Fallback to global path for backwards compatibility
}

// Global functions for data management
function loadCustomersFromStorage() {
    return new Promise((resolve, reject) => {
        if (typeof firebase !== 'undefined' && firebase.database) {
            const dbRef = firebase.database().ref(getUserDataPath('customers'));
            dbRef.once('value')
                .then(snapshot => {
                    const customers = [];
                    snapshot.forEach(childSnapshot => {
                        customers.push(childSnapshot.val());
                    });
                    resolve(customers);
                })
                .catch(reject);
        } else {
            // Fallback to localStorage
            try {
                const customers = JSON.parse(localStorage.getItem('customers') || '[]');
                resolve(customers);
            } catch (error) {
                reject(error);
            }
        }
    });
}

function saveCustomerToFirebase(customerData) {
    return new Promise((resolve, reject) => {
        if (typeof firebase !== 'undefined' && firebase.database) {
            const dbRef = firebase.database().ref(getUserDataPath('customers') + '/' + customerData.id);
            dbRef.set(customerData)
                .then(resolve)
                .catch(reject);
        } else {
            // Fallback to localStorage
            loadCustomersFromStorage()
                .then(customers => {
                    const existingIndex = customers.findIndex(c => c.id === customerData.id);
                    if (existingIndex !== -1) {
                        customers[existingIndex] = customerData;
                    } else {
                        customers.push(customerData);
                    }
                    localStorage.setItem('customers', JSON.stringify(customers));
                    setTimeout(resolve, 100);
                })
                .catch(reject);
        }
    });
}

function loadPaymentsFromStorage() {
    return new Promise((resolve, reject) => {
        if (typeof firebase !== 'undefined' && firebase.database) {
            const dbRef = firebase.database().ref(getUserDataPath('payments'));
            dbRef.once('value')
                .then(snapshot => {
                    const payments = [];
                    snapshot.forEach(childSnapshot => {
                        payments.push(childSnapshot.val());
                    });
                    resolve(payments);
                })
                .catch(reject);
        } else {
            // Fallback to localStorage
            try {
                const payments = JSON.parse(localStorage.getItem('payments') || '[]');
                resolve(payments);
            } catch (error) {
                reject(error);
            }
        }
    });
}

function savePaymentToFirebase(paymentData) {
    return new Promise((resolve, reject) => {
        if (typeof firebase !== 'undefined' && firebase.database) {
            const dbRef = firebase.database().ref(getUserDataPath('payments') + '/' + paymentData.id);
            dbRef.set(paymentData)
                .then(resolve)
                .catch(reject);
        } else {
            // Fallback to localStorage
            loadPaymentsFromStorage()
                .then(payments => {
                    payments.push(paymentData);
                    localStorage.setItem('payments', JSON.stringify(payments));
                    setTimeout(resolve, 100);
                })
                .catch(reject);
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
});

// Also try to initialize immediately in case DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    console.log('DOM still loading, waiting for DOMContentLoaded');
} else {
    // DOM is already loaded
    console.log('DOM already loaded, initializing Firebase immediately');
    initializeFirebase();
}