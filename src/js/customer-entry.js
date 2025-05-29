// Customer entry functionality

function initializeCustomerEntry() {
    createCustomerForm();
    setupEventListeners();
    
    // Add first animal form by default
    addAnimal();
}

function createCustomerForm() {
    const customerFormContainer = document.getElementById('customer-form-container');
    customerFormContainer.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="customer-name">اسم العميل</label>
                <input type="text" id="customer-name" placeholder="أدخل اسم العميل" required>
            </div>
            <div class="form-group">
                <label for="customer-phone">رقم الهاتف</label>
                <input type="text" id="customer-phone" placeholder="أدخل رقم الهاتف">
            </div>
        </div>
    `;
}

function setupEventListeners() {
    const submitButton = document.getElementById('submit-customer');
    submitButton.addEventListener('click', submitCustomerData);
}

function submitCustomerData() {
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    
    if (!customerName) {
        alert('يرجى إدخال اسم العميل');
        return;
    }
    
    if (currentCustomerAnimals.length === 0) {
        alert('يرجى إضافة أضحية واحدة على الأقل');
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
            alert(`الأضحية ${type} رقم ${number} مكررة في نفس العميل`);
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
        alert('يرجى ملء جميع بيانات الأضاحي وحل تضارب الأرقام');
        return;
    }
    
    const totalAmount = validatedAnimals.reduce((sum, animal) => sum + animal.totalPrice, 0);
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
            alert('تم حفظ بيانات العميل بنجاح!');
            resetCustomerForm();
        })
        .catch((error) => {
            console.error('Error saving customer:', error);
            alert('حدث خطأ أثناء حفظ البيانات');
        });
}

function resetCustomerForm() {
    // Reset customer form
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    
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