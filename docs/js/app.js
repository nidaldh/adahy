// Main application logic for Islamic Sacrifice Management
let currentCustomerAnimals = [];
let customers = [];
let payments = [];
let globalAnimals = []; // Track all animals globally to prevent duplicates

// Animal statuses
const ANIMAL_STATUS = {
    ALIVE: 'حي',
    SLAUGHTERED: 'مذبوح', 
    CANCELLED: 'ملغي',
    READY: 'جاهز'
};

document.addEventListener('DOMContentLoaded', () => {
    // Application components will be initialized by auth.js
    // when user is authenticated
});

// Tab switching functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Refresh data when switching to certain tabs
    if (tabName === 'customer-list') {
        displayCustomers();
    } else if (tabName === 'balance-sheet') {
        displayBalanceSheet();
    }
}

// Add animal to current customer
function addAnimal() {
    const animalContainer = document.getElementById('animal-form-container');
    const animalIndex = currentCustomerAnimals.length;
    
    const animalForm = document.createElement('div');
    animalForm.className = 'animal-item';
    animalForm.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>نوع الأضحية</label>
                <select id="animal-type-${animalIndex}" onchange="validateAnimalCompositeKey(${animalIndex})">
                    <option value="">اختر النوع</option>
                    <option value="سخل">سخل</option>
                    <option value="خروف">خروف</option>
                    <option value="عجل">عجل</option>
                    <option value="جمل">جمل</option>
                </select>
            </div>
            <div class="form-group">
                <label>رقم الأضحية</label>
                <input type="text" id="animal-number-${animalIndex}" placeholder="أدخل رقم الأضحية" onchange="validateAnimalCompositeKey(${animalIndex})">
                <small id="animal-validation-${animalIndex}" style="color: red; display: none;">هذه الأضحية مرتبطة بعميل آخر</small>
            </div>
            <div class="form-group">
                <label>الوزن (كيلو)</label>
                <input type="number" id="animal-weight-${animalIndex}" step="0.1" onchange="calculateAnimalTotal(${animalIndex})">
            </div>
            <div class="form-group">
                <label>سعر الكيلو</label>
                <input type="number" id="animal-price-${animalIndex}" step="0.01" onchange="calculateAnimalTotal(${animalIndex})">
            </div>
            <div class="form-group">
                <label>المجموع</label>
                <input type="number" id="animal-total-${animalIndex}" readonly>
            </div>
            <div class="form-group">
                <label>الحالة</label>
                <select id="animal-status-${animalIndex}">
                    <option value="${ANIMAL_STATUS.ALIVE}">${ANIMAL_STATUS.ALIVE}</option>
                    <option value="${ANIMAL_STATUS.READY}">${ANIMAL_STATUS.READY}</option>
                    <option value="${ANIMAL_STATUS.SLAUGHTERED}">${ANIMAL_STATUS.SLAUGHTERED}</option>
                    <option value="${ANIMAL_STATUS.CANCELLED}">${ANIMAL_STATUS.CANCELLED}</option>
                </select>
            </div>
            <button type="button" class="btn btn-danger" onclick="removeAnimal(${animalIndex})">حذف</button>
        </div>
    `;
    
    animalContainer.appendChild(animalForm);
    currentCustomerAnimals.push({});
}

// Remove animal
function removeAnimal(index) {
    const animalContainer = document.getElementById('animal-form-container');
    animalContainer.children[index].remove();
    currentCustomerAnimals.splice(index, 1);
    
    // Re-render all animals with updated indices
    rerenderAnimals();
}

// Re-render animals with correct indices
function rerenderAnimals() {
    const animalContainer = document.getElementById('animal-form-container');
    animalContainer.innerHTML = '';
    const tempAnimals = [...currentCustomerAnimals];
    currentCustomerAnimals = [];
    
    tempAnimals.forEach(() => addAnimal());
}

// Calculate animal total
function calculateAnimalTotal(index) {
    const weight = parseFloat(document.getElementById(`animal-weight-${index}`).value) || 0;
    const price = parseFloat(document.getElementById(`animal-price-${index}`).value) || 0;
    const total = weight * price;
    
    document.getElementById(`animal-total-${index}`).value = total.toFixed(2);
    
    // Update the animal data
    currentCustomerAnimals[index] = {
        type: document.getElementById(`animal-type-${index}`).value,
        weight: weight,
        price: price,
        total: total
    };
}

// Search customers
function searchCustomers(searchTerm) {
    displayCustomers(searchTerm);
}

// Search balance
function searchBalance(searchTerm) {
    displayBalanceSheet(searchTerm);
}

// Initialize components
function initializeCustomerEntry() {
    // Customer entry logic will be in customer-entry.js
}

function initializeCustomerList() {
    // Customer list logic will be in customer-list.js
}

function initializePaymentEntry() {
    // Payment entry logic will be in payment-entry.js
}

function initializeBalanceSheet() {
    // Balance sheet logic will be in balance-sheet.js
}

// Firebase functions
function loadCustomersFromFirebase() {
    if (typeof loadCustomersFromStorage === 'function') {
        loadCustomersFromStorage()
            .then(loadedCustomers => {
                customers = loadedCustomers;
                console.log('Customers loaded:', customers.length);
                // Refresh displays if they exist
                if (typeof displayCustomers === 'function') {
                    displayCustomers();
                }
            })
            .catch(error => {
                console.error('Error loading customers:', error);
            });
    }
}

function loadPaymentsFromFirebase() {
    if (typeof loadPaymentsFromStorage === 'function') {
        loadPaymentsFromStorage()
            .then(loadedPayments => {
                payments = loadedPayments;
                console.log('Payments loaded:', payments.length);
                // Refresh displays if they exist
                if (typeof displayBalanceSheet === 'function') {
                    displayBalanceSheet();
                }
            })
            .catch(error => {
                console.error('Error loading payments:', error);
            });
    }
}

function loadGlobalAnimalsFromFirebase() {
    if (typeof loadGlobalAnimalsFromStorage === 'function') {
        loadGlobalAnimalsFromStorage()
            .then(loadedAnimals => {
                globalAnimals = loadedAnimals;
                console.log('Global animals loaded:', globalAnimals.length);
            })
            .catch(error => {
                console.error('Error loading global animals:', error);
            });
    }
}

function displayCustomers(searchTerm = '') {
    // Implementation in customer-list.js
}

function displayBalanceSheet(searchTerm = '') {
    // Implementation in balance-sheet.js
}

// Validate animal composite key (type + number)
function validateAnimalCompositeKey(index) {
    const type = document.getElementById(`animal-type-${index}`).value;
    const number = document.getElementById(`animal-number-${index}`).value;
    const validationMsg = document.getElementById(`animal-validation-${index}`);
    
    if (!type || !number) {
        validationMsg.style.display = 'none';
        return true;
    }
    
    const compositeKey = `${type}_${number}`;
    
    // Check if this animal exists for another customer
    const existingAnimal = globalAnimals.find(animal => 
        animal.compositeKey === compositeKey && 
        animal.customerId !== getCurrentEditingCustomerId()
    );
    
    if (existingAnimal) {
        validationMsg.style.display = 'block';
        validationMsg.textContent = `هذه الأضحية مرتبطة بالعميل: ${existingAnimal.customerName}`;
        return false;
    }
    
    validationMsg.style.display = 'none';
    return true;
}

// Get current editing customer ID (for edit mode)
function getCurrentEditingCustomerId() {
    return window.currentEditingCustomerId || null;
}

// Update animal status
function updateAnimalStatus(customerId, animalCompositeKey, newStatus) {
    return new Promise((resolve, reject) => {
        loadCustomersFromStorage()
            .then(customers => {
                const customerIndex = customers.findIndex(c => c.id == customerId);
                if (customerIndex === -1) {
                    reject(new Error('Customer not found'));
                    return;
                }
                
                const customer = customers[customerIndex];
                const animalIndex = customer.animals.findIndex(a => a.compositeKey === animalCompositeKey);
                
                if (animalIndex === -1) {
                    reject(new Error('Animal not found'));
                    return;
                }
                
                // Update animal status
                customer.animals[animalIndex].status = newStatus;
                
                // Update in global animals
                const globalAnimalIndex = globalAnimals.findIndex(a => a.compositeKey === animalCompositeKey);
                if (globalAnimalIndex !== -1) {
                    globalAnimals[globalAnimalIndex].status = newStatus;
                }
                
                // Save to storage
                saveCustomerToFirebase(customer)
                    .then(() => saveGlobalAnimalsToFirebase())
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}

// Remove animal from customer and global list
function removeAnimalFromCustomer(customerId, animalCompositeKey) {
    return new Promise((resolve, reject) => {
        loadCustomersFromStorage()
            .then(customers => {
                const customerIndex = customers.findIndex(c => c.id == customerId);
                if (customerIndex === -1) {
                    reject(new Error('Customer not found'));
                    return;
                }
                
                const customer = customers[customerIndex];
                const animalIndex = customer.animals.findIndex(a => a.compositeKey === animalCompositeKey);
                
                if (animalIndex === -1) {
                    reject(new Error('Animal not found'));
                    return;
                }
                
                const removedAnimal = customer.animals[animalIndex];
                
                // Remove from customer
                customer.animals.splice(animalIndex, 1);
                
                // Recalculate customer total
                customer.totalAmount = customer.animals.reduce((sum, animal) => sum + animal.totalPrice, 0);
                customer.balance = customer.totalAmount - (customer.totalPayments || 0);
                
                // Remove from global animals
                const globalAnimalIndex = globalAnimals.findIndex(a => a.compositeKey === animalCompositeKey);
                if (globalAnimalIndex !== -1) {
                    globalAnimals.splice(globalAnimalIndex, 1);
                }
                
                // Save to storage
                saveCustomerToFirebase(customer)
                    .then(() => saveGlobalAnimalsToFirebase())
                    .then(() => resolve(removedAnimal))
                    .catch(reject);
            })
            .catch(reject);
    });
}

// Transfer animal to another customer
function transferAnimal(animalCompositeKey, fromCustomerId, toCustomerId) {
    return new Promise((resolve, reject) => {
        if (fromCustomerId === toCustomerId) {
            reject(new Error('Cannot transfer to same customer'));
            return;
        }
        
        loadCustomersFromStorage()
            .then(customers => {
                const fromCustomerIndex = customers.findIndex(c => c.id == fromCustomerId);
                const toCustomerIndex = customers.findIndex(c => c.id == toCustomerId);
                
                if (fromCustomerIndex === -1 || toCustomerIndex === -1) {
                    reject(new Error('Customer not found'));
                    return;
                }
                
                const fromCustomer = customers[fromCustomerIndex];
                const toCustomer = customers[toCustomerIndex];
                
                const animalIndex = fromCustomer.animals.findIndex(a => a.compositeKey === animalCompositeKey);
                if (animalIndex === -1) {
                    reject(new Error('Animal not found'));
                    return;
                }
                
                const animal = fromCustomer.animals[animalIndex];
                
                // Remove from source customer
                fromCustomer.animals.splice(animalIndex, 1);
                fromCustomer.totalAmount = fromCustomer.animals.reduce((sum, a) => sum + a.totalPrice, 0);
                fromCustomer.balance = fromCustomer.totalAmount - (fromCustomer.totalPayments || 0);
                
                // Add to destination customer
                animal.customerId = toCustomerId;
                animal.customerName = toCustomer.name;
                toCustomer.animals.push(animal);
                toCustomer.totalAmount = toCustomer.animals.reduce((sum, a) => sum + a.totalPrice, 0);
                toCustomer.balance = toCustomer.totalAmount - (toCustomer.totalPayments || 0);
                
                // Update global animals
                const globalAnimalIndex = globalAnimals.findIndex(a => a.compositeKey === animalCompositeKey);
                if (globalAnimalIndex !== -1) {
                    globalAnimals[globalAnimalIndex].customerId = toCustomerId;
                    globalAnimals[globalAnimalIndex].customerName = toCustomer.name;
                }
                
                // Save both customers
                Promise.all([
                    saveCustomerToFirebase(fromCustomer),
                    saveCustomerToFirebase(toCustomer),
                    saveGlobalAnimalsToFirebase()
                ])
                .then(() => resolve(animal))
                .catch(reject);
            })
            .catch(reject);
    });
}

// Load global animals from Firebase
function loadGlobalAnimalsFromFirebase() {
    loadGlobalAnimalsFromStorage()
        .then(animals => {
            globalAnimals = animals;
        })
        .catch(error => {
            console.error('Error loading global animals:', error);
            globalAnimals = [];
        });
}

// Save global animals to Firebase
function saveGlobalAnimalsToFirebase() {
    return new Promise((resolve, reject) => {
        if (typeof firebase !== 'undefined' && firebase.database) {
            const userPath = getUserDataPath ? getUserDataPath('globalAnimals') : 'globalAnimals';
            firebase.database().ref(userPath).set(globalAnimals)
                .then(resolve)
                .catch(reject);
        } else {
            // Fallback to localStorage
            localStorage.setItem('globalAnimals', JSON.stringify(globalAnimals));
            setTimeout(resolve, 100);
        }
    });
}

// Load global animals from storage
function loadGlobalAnimalsFromStorage() {
    return new Promise((resolve, reject) => {
        if (typeof firebase !== 'undefined' && firebase.database) {
            const userPath = getUserDataPath ? getUserDataPath('globalAnimals') : 'globalAnimals';
            const dbRef = firebase.database().ref(userPath);
            dbRef.once('value')
                .then(snapshot => {
                    const animals = snapshot.val() || [];
                    resolve(Array.isArray(animals) ? animals : []);
                })
                .catch(reject);
        } else {
            // Fallback to localStorage
            try {
                const animals = JSON.parse(localStorage.getItem('globalAnimals') || '[]');
                resolve(animals);
            } catch (error) {
                reject(error);
            }
        }
    });
}