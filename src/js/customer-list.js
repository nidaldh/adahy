// Customer list functionality

function initializeCustomerList() {
    displayCustomers();
}

function displayCustomers(searchTerm = '') {
    const container = document.getElementById('customer-list-container');
    
    loadCustomersFromStorage()
        .then(customers => {
            if (!customers || customers.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 20px;">لا توجد عملاء مسجلين</p>';
                return;
            }
            
            // Filter customers based on search term
            const filteredCustomers = customers.filter(customer => 
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (filteredCustomers.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 20px;">لا توجد نتائج للبحث</p>';
                return;
            }
            
            const table = createCustomersTable(filteredCustomers);
            container.innerHTML = '';
            container.appendChild(table);
        })
        .catch(error => {
            console.error('Error loading customers:', error);
            container.innerHTML = '<p style="text-align: center; padding: 20px; color: red;">حدث خطأ في تحميل البيانات</p>';
        });
}

function createCustomersTable(customers) {
    const table = document.createElement('table');
    
    // Create header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>اسم العميل</th>
            <th>رقم الهاتف</th>
            <th>عدد الأضاحي</th>
            <th>إجمالي المبلغ</th>
            <th>الرصيد المتبقي</th>
            <th>تاريخ الإضافة</th>
            <th>تفاصيل الأضاحي</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    customers.forEach(customer => {
        const row = document.createElement('tr');
        
        const formattedDate = new Date(customer.createdAt).toLocaleDateString('ar-EG');
        const totalAnimals = customer.animals ? customer.animals.length : 0;
        const totalAmount = customer.totalAmount || 0;
        const balance = customer.balance || 0;
        
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone || 'غير محدد'}</td>
            <td>${totalAnimals}</td>
            <td>${totalAmount.toFixed(2)} جنيه</td>
            <td style="color: ${balance > 0 ? 'red' : 'green'}">${balance.toFixed(2)} جنيه</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-primary" onclick="showAnimalDetails('${customer.id}')">
                    عرض التفاصيل
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    return table;
}

function showAnimalDetails(customerId) {
    loadCustomersFromStorage()
        .then(customers => {
            const customer = customers.find(c => c.id == customerId);
            if (!customer || !customer.animals) {
                alert('لا توجد بيانات للعميل');
                return;
            }
            
            const modal = createAnimalDetailsModal(customer);
            document.body.appendChild(modal);
        })
        .catch(error => {
            console.error('Error loading customer details:', error);
            alert('حدث خطأ في تحميل التفاصيل');
        });
}

function createAnimalDetailsModal(customer) {
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
        max-width: 600px;
        max-height: 80%;
        overflow-y: auto;
        direction: rtl;
    `;
    
    let animalsTable = '<table style="width: 100%; border-collapse: collapse;">';
    animalsTable += `
        <thead>
            <tr style="background: #2c3e50; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">النوع</th>
                <th style="padding: 10px; border: 1px solid #ddd;">الرقم</th>
                <th style="padding: 10px; border: 1px solid #ddd;">الوزن</th>
                <th style="padding: 10px; border: 1px solid #ddd;">سعر الكيلو</th>
                <th style="padding: 10px; border: 1px solid #ddd;">المجموع</th>
                <th style="padding: 10px; border: 1px solid #ddd;">الحالة</th>
                <th style="padding: 10px; border: 1px solid #ddd;">الإجراءات</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    customer.animals.forEach((animal, index) => {
        const statusColor = getStatusColor(animal.status);
        animalsTable += `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${animal.type}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${animal.number || 'غير محدد'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${animal.weight} كجم</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${animal.kiloPrice} جنيه</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${animal.totalPrice.toFixed(2)} جنيه</td>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: ${statusColor};">
                    <select onchange="updateAnimalStatusInModal('${customer.id}', '${animal.compositeKey}', this.value)" style="background: transparent; border: none;">
                        <option value="${ANIMAL_STATUS.ALIVE}" ${animal.status === ANIMAL_STATUS.ALIVE ? 'selected' : ''}>${ANIMAL_STATUS.ALIVE}</option>
                        <option value="${ANIMAL_STATUS.READY}" ${animal.status === ANIMAL_STATUS.READY ? 'selected' : ''}>${ANIMAL_STATUS.READY}</option>
                        <option value="${ANIMAL_STATUS.SLAUGHTERED}" ${animal.status === ANIMAL_STATUS.SLAUGHTERED ? 'selected' : ''}>${ANIMAL_STATUS.SLAUGHTERED}</option>
                        <option value="${ANIMAL_STATUS.CANCELLED}" ${animal.status === ANIMAL_STATUS.CANCELLED ? 'selected' : ''}>${ANIMAL_STATUS.CANCELLED}</option>
                    </select>
                </td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                    <button onclick="removeAnimalFromCustomerModal('${customer.id}', '${animal.compositeKey}')" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin: 2px;">حذف</button>
                </td>
            </tr>
        `;
    });
    
    animalsTable += '</tbody></table>';
    
    content.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #2c3e50;">تفاصيل أضاحي العميل: ${customer.name}</h3>
        ${animalsTable}
        <div style="margin-top: 20px; text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div><strong>إجمالي المبلغ: ${customer.totalAmount.toFixed(2)} جنيه</strong></div>
            <div><strong>إجمالي المدفوع: ${(customer.totalPayments || 0).toFixed(2)} جنيه</strong></div>
            <div style="color: ${customer.balance > 0 ? '#e74c3c' : '#27ae60'}"><strong>الرصيد المتبقي: ${(customer.balance || 0).toFixed(2)} جنيه</strong></div>
        </div>
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

// Status color mapping
function getStatusColor(status) {
    switch (status) {
        case ANIMAL_STATUS.ALIVE:
            return '#d4edda'; // light green
        case ANIMAL_STATUS.READY:
            return '#fff3cd'; // light yellow
        case ANIMAL_STATUS.SLAUGHTERED:
            return '#f8d7da'; // light red
        case ANIMAL_STATUS.CANCELLED:
            return '#e2e3e5'; // light gray
        default:
            return '#ffffff'; // white
    }
}

// Update animal status from modal
function updateAnimalStatusInModal(customerId, animalCompositeKey, newStatus) {
    updateAnimalStatus(customerId, animalCompositeKey, newStatus)
        .then(() => {
            // Refresh the customer list display
            displayCustomers();
            // Close and reopen the modal with updated data
            document.querySelector('div[style*="position: fixed"]')?.remove();
            showAnimalDetails(customerId);
        })
        .catch(error => {
            console.error('Error updating animal status:', error);
            alert('حدث خطأ في تحديث حالة الأضحية');
        });
}

// Remove animal from customer via modal
function removeAnimalFromCustomerModal(customerId, animalCompositeKey) {
    if (!confirm('هل أنت متأكد من حذف هذه الأضحية؟')) {
        return;
    }
    
    removeAnimalFromCustomer(customerId, animalCompositeKey)
        .then(() => {
            // Refresh the customer list display
            displayCustomers();
            // Close and reopen the modal with updated data
            document.querySelector('div[style*="position: fixed"]')?.remove();
            showAnimalDetails(customerId);
            alert('تم حذف الأضحية بنجاح');
        })
        .catch(error => {
            console.error('Error removing animal:', error);
            alert('حدث خطأ في حذف الأضحية');
        });
}

function loadCustomersFromStorage() {
    return new Promise((resolve, reject) => {
        if (typeof firebase !== 'undefined' && firebase.database) {
            const userPath = getUserDataPath ? getUserDataPath('customers') : 'customers';
            const dbRef = firebase.database().ref(userPath);
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