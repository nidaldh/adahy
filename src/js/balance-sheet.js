// Balance sheet functionality

function initializeBalanceSheet() {
    displayBalanceSheet();
}

function displayBalanceSheet(searchTerm = '') {
    const container = document.getElementById('balance-sheet-container');
    
    Promise.all([loadCustomersFromStorage(), loadPaymentsFromStorage()])
        .then(([customers, payments]) => {
            if (!customers || customers.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 20px;">لا توجد عملاء مسجلين</p>';
                return;
            }
            
            // Calculate balance for each customer
            const balanceData = customers.map(customer => {
                const customerPayments = payments.filter(payment => payment.customerId == customer.id);
                const totalPayments = customerPayments.reduce((sum, payment) => 
                    sum + (payment.paymentAmount || 0) + (payment.discountAmount || 0), 0);
                
                const originalAmount = customer.totalAmount || 0;
                const currentBalance = customer.balance !== undefined ? customer.balance : (originalAmount - totalPayments);
                
                return {
                    id: customer.id,
                    name: customer.name,
                    phone: customer.phone || 'غير محدد',
                    originalAmount: originalAmount,
                    totalPayments: totalPayments,
                    currentBalance: currentBalance,
                    createdAt: customer.createdAt,
                    paymentsCount: customerPayments.length
                };
            });
            
            // Filter based on search term
            const filteredData = balanceData.filter(data => 
                data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                data.phone.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (filteredData.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 20px;">لا توجد نتائج للبحث</p>';
                return;
            }
            
            const table = createBalanceTable(filteredData);
            const summary = createBalanceSummary(filteredData);
            
            container.innerHTML = '';
            container.appendChild(summary);
            container.appendChild(table);
        })
        .catch(error => {
            console.error('Error loading balance data:', error);
            container.innerHTML = '<p style="text-align: center; padding: 20px; color: red;">حدث خطأ في تحميل البيانات</p>';
        });
}

function createBalanceSummary(balanceData) {
    const totalOriginal = balanceData.reduce((sum, data) => sum + data.originalAmount, 0);
    const totalPayments = balanceData.reduce((sum, data) => sum + data.totalPayments, 0);
    const totalBalance = balanceData.reduce((sum, data) => sum + data.currentBalance, 0);
    const customersCount = balanceData.length;
    
    const summary = document.createElement('div');
    summary.className = 'total-display';
    summary.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; text-align: center;">
            <div>
                <div style="font-size: 1.1rem;">عدد العملاء</div>
                <div style="font-size: 1.5rem; font-weight: bold;">${customersCount}</div>
            </div>
            <div>
                <div style="font-size: 1.1rem;">إجمالي المبيعات</div>
                <div style="font-size: 1.5rem; font-weight: bold;">${totalOriginal.toFixed(2)} شيكل</div>
            </div>
            <div>
                <div style="font-size: 1.1rem;">إجمالي المدفوعات</div>
                <div style="font-size: 1.5rem; font-weight: bold;">${totalPayments.toFixed(2)} شيكل</div>
            </div>
            <div>
                <div style="font-size: 1.1rem;">إجمالي الرصيد المتبقي</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: ${totalBalance >= 0 ? '#28a745' : '#dc3545'};">
                    ${totalBalance.toFixed(2)} شيكل
                </div>
            </div>
        </div>
    `;
    
    return summary;
}

function createBalanceTable(balanceData) {
    const table = document.createElement('table');
    
    // Create header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>اسم العميل</th>
            <th>رقم الهاتف</th>
            <th>إجمالي المبلغ الأصلي</th>
            <th>إجمالي المدفوعات</th>
            <th>الرصيد المتبقي</th>
            <th>عدد الدفعات</th>
            <th>تاريخ التسجيل</th>
            <th>العمليات</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    balanceData.forEach(data => {
        const row = document.createElement('tr');
        
        const formattedDate = new Date(data.createdAt).toLocaleDateString('ar-EG');
        const balanceClass = data.currentBalance >= 0 ? 'balance-positive' : 'balance-negative';
        
        row.innerHTML = `
            <td>${data.name}</td>
            <td>${data.phone}</td>
            <td>${data.originalAmount.toFixed(2)} شيكل</td>
            <td>${data.totalPayments.toFixed(2)} شيكل</td>
            <td class="${balanceClass}">${data.currentBalance.toFixed(2)} شيكل</td>
            <td>${data.paymentsCount}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-primary" onclick="showPaymentHistory('${data.id}')">
                    تاريخ المدفوعات
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    return table;
}

function showPaymentHistory(customerId) {
    Promise.all([loadCustomersFromStorage(), loadPaymentsFromStorage()])
        .then(([customers, payments]) => {
            const customer = customers.find(c => c.id == customerId);
            const customerPayments = payments.filter(payment => payment.customerId == customerId);
            
            if (!customer) {
                alert('لا توجد بيانات للعميل');
                return;
            }
            
            const modal = createPaymentHistoryModal(customer, customerPayments);
            document.body.appendChild(modal);
        })
        .catch(error => {
            console.error('Error loading payment history:', error);
            alert('حدث خطأ في تحميل تاريخ المدفوعات');
        });
}

function createPaymentHistoryModal(customer, payments) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 700px;
        max-height: 80%;
        overflow-y: auto;
        direction: rtl;
    `;
    
    let paymentsTable = '';
    
    if (payments.length === 0) {
        paymentsTable = '<p style="text-align: center; padding: 20px;">لا توجد مدفوعات لهذا العميل</p>';
    } else {
        paymentsTable = '<table style="width: 100%; border-collapse: collapse;">';
        paymentsTable += `
            <thead>
                <tr style="background: #2c3e50; color: white;">
                    <th style="padding: 10px; border: 1px solid #ddd;">التاريخ</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">مبلغ الدفع</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">الخصم</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">إجمالي الخصم</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">ملاحظات</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        payments.forEach(payment => {
            const paymentDate = new Date(payment.createdAt).toLocaleDateString('ar-EG');
            paymentsTable += `
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${paymentDate}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${(payment.paymentAmount || 0).toFixed(2)} شيكل</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${(payment.discountAmount || 0).toFixed(2)} شيكل</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${(payment.totalDeduction || 0).toFixed(2)} شيكل</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${payment.notes || 'لا توجد ملاحظات'}</td>
                </tr>
            `;
        });
        
        paymentsTable += '</tbody></table>';
        
        const totalPayments = payments.reduce((sum, payment) => sum + (payment.totalDeduction || 0), 0);
        paymentsTable += `<div style="margin-top: 15px; text-align: center;"><strong>إجمالي المدفوعات: ${totalPayments.toFixed(2)} شيكل</strong></div>`;
    }
    
    content.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #2c3e50;">تاريخ مدفوعات العميل: ${customer.name}</h3>
        ${paymentsTable}
        <div style="margin-top: 20px; text-align: center;">
            <button class="btn btn-danger" onclick="this.closest('div').parentElement.remove()">إغلاق</button>
        </div>
    `;
    
    modal.appendChild(content);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

function loadPaymentsFromStorage() {
    return new Promise((resolve, reject) => {
        if (typeof firebase !== 'undefined' && firebase.database) {
            const userPath = getUserDataPath ? getUserDataPath('payments') : 'payments';
            const dbRef = firebase.database().ref(userPath);
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