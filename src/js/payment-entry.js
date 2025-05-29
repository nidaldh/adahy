// Payment entry functionality

function initializePaymentEntry() {
    createPaymentForm();
    setupPaymentEventListeners();
    loadCustomersForPayment();
}

function createPaymentForm() {
    const paymentFormContainer = document.getElementById('payment-form-container');
    paymentFormContainer.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="payment-customer-select">اختر العميل</label>
                <select id="payment-customer-select" onchange="updateCustomerBalance()">
                    <option value="">اختر العميل</option>
                </select>
            </div>
            <div class="form-group">
                <label for="current-balance">الرصيد الحالي</label>
                <input type="number" id="current-balance" readonly>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="payment-amount">مبلغ الدفع</label>
                <input type="number" id="payment-amount" step="0.01" placeholder="أدخل مبلغ الدفع" onchange="calculateFinalAmount()">
            </div>
            <div class="form-group">
                <label for="discount-amount">خصم (مبلغ ثابت)</label>
                <input type="number" id="discount-amount" step="0.01" placeholder="أدخل مبلغ الخصم" onchange="calculateFinalAmount()">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="final-balance">الرصيد بعد الدفع</label>
                <input type="number" id="final-balance" readonly>
            </div>
            <div class="form-group">
                <label for="payment-notes">ملاحظات</label>
                <input type="text" id="payment-notes" placeholder="أدخل ملاحظات إضافية">
            </div>
        </div>
    `;
}

function setupPaymentEventListeners() {
    const submitButton = document.getElementById('submit-payment');
    submitButton.addEventListener('click', submitPayment);
}

function loadCustomersForPayment() {
    loadCustomersFromStorage()
        .then(customers => {
            const select = document.getElementById('payment-customer-select');
            select.innerHTML = '<option value="">اختر العميل</option>';
            
            customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = `${customer.name} - الرصيد: ${customer.balance?.toFixed(2) || customer.totalAmount?.toFixed(2)} شيكل`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading customers for payment:', error);
        });
}

function updateCustomerBalance() {
    const customerId = document.getElementById('payment-customer-select').value;
    const balanceInput = document.getElementById('current-balance');
    
    if (!customerId) {
        balanceInput.value = '';
        return;
    }
    
    loadCustomersFromStorage()
        .then(customers => {
            const customer = customers.find(c => c.id == customerId);
            if (customer) {
                const currentBalance = customer.balance !== undefined ? customer.balance : customer.totalAmount;
                balanceInput.value = currentBalance.toFixed(2);
                calculateFinalAmount();
            }
        })
        .catch(error => {
            console.error('Error loading customer balance:', error);
        });
}

function calculateFinalAmount() {
    const currentBalance = parseFloat(document.getElementById('current-balance').value) || 0;
    const paymentAmount = parseFloat(document.getElementById('payment-amount').value) || 0;
    const discountAmount = parseFloat(document.getElementById('discount-amount').value) || 0;
    
    const finalBalance = currentBalance - paymentAmount - discountAmount;
    document.getElementById('final-balance').value = finalBalance.toFixed(2);
}

function submitPayment() {
    const customerId = document.getElementById('payment-customer-select').value;
    const paymentAmount = parseFloat(document.getElementById('payment-amount').value) || 0;
    const discountAmount = parseFloat(document.getElementById('discount-amount').value) || 0;
    const notes = document.getElementById('payment-notes').value.trim();
    
    if (!customerId) {
        alert('يرجى اختيار عميل');
        return;
    }
    
    if (paymentAmount <= 0 && discountAmount <= 0) {
        alert('يرجى إدخال مبلغ الدفع أو الخصم');
        return;
    }
    
    const paymentData = {
        id: Date.now(),
        customerId: customerId,
        paymentAmount: paymentAmount,
        discountAmount: discountAmount,
        totalDeduction: paymentAmount + discountAmount,
        notes: notes,
        createdAt: new Date().toISOString()
    };
    
    // Update customer balance and save payment
    updateCustomerBalanceAndSavePayment(paymentData)
        .then(() => {
            alert('تم حفظ الدفعة بنجاح!');
            resetPaymentForm();
            loadCustomersForPayment(); // Refresh customer list
        })
        .catch(error => {
            console.error('Error saving payment:', error);
            alert('حدث خطأ أثناء حفظ الدفعة');
        });
}

function updateCustomerBalanceAndSavePayment(paymentData) {
    return new Promise((resolve, reject) => {
        loadCustomersFromStorage()
            .then(customers => {
                const customerIndex = customers.findIndex(c => c.id == paymentData.customerId);
                if (customerIndex === -1) {
                    reject(new Error('Customer not found'));
                    return;
                }
                
                // Update customer balance and total payments
                const customer = customers[customerIndex];
                const currentBalance = customer.balance !== undefined ? customer.balance : customer.totalAmount;
                customer.balance = currentBalance - paymentData.totalDeduction;
                customer.totalPayments = (customer.totalPayments || 0) + paymentData.totalDeduction;
                
                // Add customer name to payment data
                paymentData.customerName = customer.name;
                
                // Save updated customer and payment
                Promise.all([
                    saveCustomerToFirebase(customer),
                    savePaymentToFirebase(paymentData)
                ])
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
    });
}

function resetPaymentForm() {
    document.getElementById('payment-customer-select').value = '';
    document.getElementById('current-balance').value = '';
    document.getElementById('payment-amount').value = '';
    document.getElementById('discount-amount').value = '';
    document.getElementById('final-balance').value = '';
    document.getElementById('payment-notes').value = '';
}