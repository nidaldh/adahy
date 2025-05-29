// Customer entry functionality

function initializeCustomerEntry() {
    console.log('Customer entry JS: Initializing customer form...');
    createCustomerForm();
    setupEventListeners();
    setupCustomerAutocomplete();
    
    // Add first animal form by default
    addAnimal();
}

// Make the function globally available
window.initializeCustomerEntryForm = initializeCustomerEntry;

function createCustomerForm() {
    const customerFormContainer = document.getElementById('customer-form-container');
    customerFormContainer.innerHTML = `
        <div class="customer-form-wrapper">
            <div class="form-row">
                <div class="form-group">
                    <label for="customer-name">
                        <i class="icon">👤</i>
                        اسم العميل *
                    </label>
                    <div class="input-container">
                        <input type="text" id="customer-name" placeholder="أدخل اسم العميل" required autocomplete="off">
                        <div id="customer-suggestions" class="suggestions-dropdown"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="customer-phone">
                        <i class="icon">📞</i>
                        رقم الهاتف
                    </label>
                    <input type="tel" id="customer-phone" placeholder="أدخل رقم الهاتف (اختياري)" pattern="[0-9]{9,10}">
                </div>
            </div>
            <div id="selected-customer-info" class="selected-customer-info" style="display: none;">
                <div class="info-badge">
                    <span class="info-icon">ℹ️</span>
                    <span id="customer-selection-text"></span>
                    <button type="button" id="clear-selection" class="clear-btn">✖</button>
                </div>
            </div>
        </div>
    `;
}

function setupEventListeners() {
    const submitButton = document.getElementById('submit-customer');
    submitButton.addEventListener('click', submitCustomerData);
}

let selectedCustomer = null;
let existingCustomers = [];

function setupCustomerAutocomplete() {
    const customerNameInput = document.getElementById('customer-name');
    const customerPhoneInput = document.getElementById('customer-phone');
    const suggestionsDiv = document.getElementById('customer-suggestions');
    const selectedCustomerInfo = document.getElementById('selected-customer-info');
    const clearSelectionBtn = document.getElementById('clear-selection');
    
    let currentSelectedIndex = -1;
    let visibleSuggestions = [];
    
    // Load existing customers
    loadExistingCustomers();
    
    // Phone number validation
    customerPhoneInput.addEventListener('input', function() {
        validatePhoneNumber(this);
    });
    
    // Customer name input event listener
    customerNameInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        currentSelectedIndex = -1;
        
        if (searchTerm.length < 2) {
            hideSuggestions();
            return;
        }
        
        const matchingCustomers = existingCustomers.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm)
        );
        
        visibleSuggestions = matchingCustomers;
        
        if (matchingCustomers.length > 0) {
            showSuggestions(matchingCustomers);
        } else {
            hideSuggestions();
        }
        
        // Clear selection if user is typing a new name
        if (selectedCustomer && selectedCustomer.name !== this.value) {
            clearCustomerSelection();
        }
        
        // Update button text based on input
        updateSubmitButtonText(false);
    });
    
    // Keyboard navigation
    customerNameInput.addEventListener('keydown', function(e) {
        if (suggestionsDiv.style.display === 'none' || visibleSuggestions.length === 0) {
            return;
        }
        
        const suggestionItems = suggestionsDiv.querySelectorAll('.suggestion-item');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentSelectedIndex = Math.min(currentSelectedIndex + 1, suggestionItems.length - 1);
                updateSelectedSuggestion(suggestionItems);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                currentSelectedIndex = Math.max(currentSelectedIndex - 1, 0);
                updateSelectedSuggestion(suggestionItems);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (currentSelectedIndex >= 0 && currentSelectedIndex < visibleSuggestions.length) {
                    selectCustomer(visibleSuggestions[currentSelectedIndex].id);
                }
                break;
                
            case 'Escape':
                hideSuggestions();
                break;
        }
    });
    
    // Clear selection event
    clearSelectionBtn.addEventListener('click', clearCustomerSelection);
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.input-container')) {
            hideSuggestions();
        }
    });
    
    function updateSelectedSuggestion(suggestionItems) {
        suggestionItems.forEach((item, index) => {
            if (index === currentSelectedIndex) {
                item.classList.add('suggestion-selected');
            } else {
                item.classList.remove('suggestion-selected');
            }
        });
    }
}

function validatePhoneNumber(input) {
    const phoneNumber = input.value.replace(/\D/g, ''); // Remove non-digits
    const isValid = phoneNumber.length >= 9 && phoneNumber.length <= 10;
    
    if (input.value && !isValid) {
        input.classList.add('input-error');
        input.title = 'يرجى إدخال رقم هاتف صحيح (9-10 أرقام)';
    } else {
        input.classList.remove('input-error');
        input.title = '';
    }
}

function loadExistingCustomers() {
    if (typeof loadCustomersFromStorage === 'function') {
        // Show loading indicator
        showLoadingIndicator();
        
        loadCustomersFromStorage()
            .then(customers => {
                existingCustomers = customers || [];
                hideLoadingIndicator();
            })
            .catch(error => {
                console.error('Error loading existing customers:', error);
                existingCustomers = [];
                hideLoadingIndicator();
            });
    } else {
        // Fallback to localStorage
        try {
            existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
        } catch (error) {
            existingCustomers = [];
        }
    }
}

function showLoadingIndicator() {
    const customerNameInput = document.getElementById('customer-name');
    if (customerNameInput) {
        customerNameInput.placeholder = 'جاري تحميل بيانات العملاء...';
        customerNameInput.disabled = true;
    }
}

function hideLoadingIndicator() {
    const customerNameInput = document.getElementById('customer-name');
    if (customerNameInput) {
        customerNameInput.placeholder = 'أدخل اسم العميل';
        customerNameInput.disabled = false;
    }
}

function showSuggestions(customers) {
    const suggestionsDiv = document.getElementById('customer-suggestions');
    
    if (customers.length === 0) {
        suggestionsDiv.innerHTML = '<div class="no-suggestions">لم يتم العثور على عملاء مطابقين</div>';
    } else {
        suggestionsDiv.innerHTML = customers.map(customer => `
            <div class="suggestion-item" onclick="selectCustomer(${customer.id})">
                <div class="suggestion-name">${customer.name}</div>
                <div class="suggestion-phone">${customer.phone || 'لا يوجد رقم هاتف'}</div>
                <div class="suggestion-balance">الرصيد: ${(customer.balance || 0).toFixed(2)} شيكل</div>
                <div class="suggestion-animals">${customer.animals ? customer.animals.length : 0} أضحية</div>
            </div>
        `).join('');
    }
    
    suggestionsDiv.style.display = 'block';
}

function hideSuggestions() {
    const suggestionsDiv = document.getElementById('customer-suggestions');
    suggestionsDiv.style.display = 'none';
}

function selectCustomer(customerId) {
    const customer = existingCustomers.find(c => c.id == customerId);
    if (!customer) return;
    
    selectedCustomer = customer;
    
    // Fill form fields
    document.getElementById('customer-name').value = customer.name;
    document.getElementById('customer-phone').value = customer.phone || '';
    
    // Show selection info
    const selectedCustomerInfo = document.getElementById('selected-customer-info');
    const selectionText = document.getElementById('customer-selection-text');
    
    selectionText.innerHTML = `
        تم اختيار عميل موجود: <strong>${customer.name}</strong> 
        (الرصيد الحالي: ${(customer.balance || 0).toFixed(2)} شيكل)
    `;
    
    selectedCustomerInfo.style.display = 'block';
    
    // Update submit button text
    updateSubmitButtonText(true);
    
    hideSuggestions();
}

function clearCustomerSelection() {
    selectedCustomer = null;
    document.getElementById('selected-customer-info').style.display = 'none';
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    
    // Update submit button text
    updateSubmitButtonText(false);
    
    hideSuggestions();
}

function updateSubmitButtonText(isExistingCustomer) {
    const submitButtonText = document.getElementById('submit-button-text');
    if (isExistingCustomer) {
        submitButtonText.textContent = 'إضافة أضاحي للعميل';
    } else {
        submitButtonText.textContent = 'حفظ العميل والأضاحي';
    }
}

function submitCustomerData() {
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    
    if (!customerName) {
        showErrorNotification('يرجى إدخال اسم العميل');
        return;
    }
    
    if (currentCustomerAnimals.length === 0) {
        showErrorNotification('يرجى إضافة أضحية واحدة على الأقل');
        return;
    }
    
    // Validate all animals have complete data and unique composite keys
    let isValid = true;
    const validatedAnimals = [];
    const animalKeys = new Set();
    
    currentCustomerAnimals.forEach((animal, index) => {
        const type = document.getElementById(`animal-type-${index}`).value;
        const number = document.getElementById(`animal-number-${index}`).value.trim();
        const weight = parseFloat(document.getElementById(`animal-weight-${index}`).value);
        const price = parseFloat(document.getElementById(`animal-price-${index}`).value);
        const status = document.getElementById(`animal-status-${index}`).value;
        
        if (!type || !number || !weight || !price) {
            isValid = false;
            return;
        }
        
        const compositeKey = `${type}_${number}`;
        
        // Check for duplicates within this customer
        if (animalKeys.has(compositeKey)) {
            showErrorNotification(`الأضحية ${type} رقم ${number} مكررة في نفس العميل`);
            isValid = false;
            return;
        }
        
        // Validate against global animals
        if (!validateAnimalCompositeKey(index)) {
            isValid = false;
            return;
        }
        
        animalKeys.add(compositeKey);
        
        validatedAnimals.push({
            key: `ANIMAL_${Date.now()}_${index}`,
            compositeKey: compositeKey,
            type: type,
            number: number,
            weight: weight,
            kiloPrice: price,
            totalPrice: weight * price,
            status: status || ANIMAL_STATUS.ALIVE
        });
    });
    
    if (!isValid) {
        showErrorNotification('يرجى ملء جميع بيانات الأضاحي وحل تضارب الأرقام');
        return;
    }
    
    const totalAmount = validatedAnimals.reduce((sum, animal) => sum + animal.totalPrice, 0);
    
    if (selectedCustomer) {
        // Adding animals to existing customer
        updateExistingCustomer(selectedCustomer, validatedAnimals, totalAmount);
    } else {
        // Creating new customer
        createNewCustomer(customerName, customerPhone, validatedAnimals, totalAmount);
    }
}

function updateExistingCustomer(customer, newAnimals, additionalAmount) {
    // Add new animals to existing customer
    customer.animals = customer.animals || [];
    customer.animals.push(...newAnimals);
    
    // Update totals
    customer.totalAmount = (customer.totalAmount || 0) + additionalAmount;
    customer.balance = (customer.balance || 0) + additionalAmount;
    
    // Add animals to global tracking
    newAnimals.forEach(animal => {
        globalAnimals.push({
            compositeKey: animal.compositeKey,
            customerId: customer.id,
            customerName: customer.name,
            type: animal.type,
            number: animal.number,
            status: animal.status
        });
    });
    
    // Save to Firebase
    Promise.all([
        saveCustomerToFirebase(customer),
        saveGlobalAnimalsToFirebase()
    ])
        .then(() => {
            showSuccessNotification(`تم إضافة ${newAnimals.length} أضحية جديدة للعميل ${customer.name} بنجاح!`);
            resetCustomerForm();
            loadExistingCustomers(); // Refresh the customer list
        })
        .catch((error) => {
            console.error('Error updating customer:', error);
            showErrorNotification('حدث خطأ أثناء تحديث بيانات العميل');
        });
}

function createNewCustomer(customerName, customerPhone, validatedAnimals, totalAmount) {
    const customerId = Date.now();
    
    const customerData = {
        id: customerId,
        name: customerName,
        phone: customerPhone,
        animals: validatedAnimals,
        totalAmount: totalAmount,
        balance: totalAmount, // Initially, balance equals total amount
        totalPayments: 0,
        createdAt: new Date().toISOString()
    };
    
    // Add animals to global tracking
    validatedAnimals.forEach(animal => {
        globalAnimals.push({
            compositeKey: animal.compositeKey,
            customerId: customerId,
            customerName: customerName,
            type: animal.type,
            number: animal.number,
            status: animal.status
        });
    });
    
    // Save to Firebase
    Promise.all([
        saveCustomerToFirebase(customerData),
        saveGlobalAnimalsToFirebase()
    ])
        .then(() => {
            showSuccessNotification('تم حفظ بيانات العميل الجديد بنجاح!');
            resetCustomerForm();
            loadExistingCustomers(); // Refresh the customer list
        })
        .catch((error) => {
            console.error('Error saving customer:', error);
            showErrorNotification('حدث خطأ أثناء حفظ البيانات');
        });
}

// Notification functions
function showSuccessNotification(message) {
    showNotification(message, 'success');
}

function showErrorNotification(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('notification-show');
    }, 100);
}

function resetCustomerForm() {
    // Reset customer form
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    
    // Clear customer selection
    clearCustomerSelection();
    
    // Reset animals
    currentCustomerAnimals = [];
    document.getElementById('animal-form-container').innerHTML = '';
    
    // Add one animal form
    addAnimal();
}

function saveCustomerToFirebase(customerData) {
    return new Promise((resolve, reject) => {
        if (typeof firebase !== 'undefined' && firebase.database) {
            const userPath = getUserDataPath ? getUserDataPath('customers') : 'customers';
            firebase.database().ref(userPath + '/' + customerData.id).set(customerData)
                .then(resolve)
                .catch(reject);
        } else {
            // Fallback to localStorage for development
            const customers = JSON.parse(localStorage.getItem('customers') || '[]');
            customers.push(customerData);
            localStorage.setItem('customers', JSON.stringify(customers));
            setTimeout(resolve, 100); // Simulate async operation
        }
    });
}