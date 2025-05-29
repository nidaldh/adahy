// Test data for Islamic Sacrifice Management Application
// This file can be used to populate the application with sample data for testing

function loadTestData() {
    if (confirm('هل تريد تحميل بيانات تجريبية؟ سيتم حذف البيانات الحالية.')) {
        // Clear existing data
        localStorage.clear();
        
        // Sample customers with animals
        const testCustomers = [
            {
                id: 1640995200000, // Sample timestamp
                name: 'أحمد محمد',
                phone: '01234567890',
                animals: [
                    {
                        key: 'ANIMAL_1640995200001_0',
                        compositeKey: 'خروف_001',
                        type: 'خروف',
                        number: '001',
                        weight: 45,
                        kiloPrice: 180,
                        totalPrice: 8100,
                        status: 'حي'
                    },
                    {
                        key: 'ANIMAL_1640995200001_1',
                        compositeKey: 'سخل_002',
                        type: 'سخل',
                        number: '002',
                        weight: 25,
                        kiloPrice: 200,
                        totalPrice: 5000,
                        status: 'جاهز'
                    }
                ],
                totalAmount: 13100,
                totalPayments: 5000,
                balance: 8100,
                createdAt: new Date(1640995200000).toISOString()
            },
            {
                id: 1641081600000,
                name: 'فاطمة علي',
                phone: '01987654321',
                animals: [
                    {
                        key: 'ANIMAL_1641081600000_0',
                        compositeKey: 'عجل_003',
                        type: 'عجل',
                        number: '003',
                        weight: 150,
                        kiloPrice: 170,
                        totalPrice: 25500,
                        status: 'حي'
                    }
                ],
                totalAmount: 25500,
                totalPayments: 10000,
                balance: 15500,
                createdAt: new Date(1641081600000).toISOString()
            },
            {
                id: 1641168000000,
                name: 'محمد حسن',
                phone: '01555666777',
                animals: [
                    {
                        key: 'ANIMAL_1641168000000_0',
                        compositeKey: 'جمل_004',
                        type: 'جمل',
                        number: '004',
                        weight: 300,
                        kiloPrice: 160,
                        totalPrice: 48000,
                        status: 'مذبوح'
                    }
                ],
                totalAmount: 48000,
                totalPayments: 48000,
                balance: 0,
                createdAt: new Date(1641168000000).toISOString()
            }
        ];
        
        // Sample payments
        const testPayments = [
            {
                id: 1641000000000,
                customerId: 1640995200000,
                customerName: 'أحمد محمد',
                paymentAmount: 4000,
                discountAmount: 1000,
                totalDeduction: 5000,
                notes: 'دفعة أولى مع خصم',
                createdAt: new Date(1641000000000).toISOString()
            },
            {
                id: 1641100000000,
                customerId: 1641081600000,
                customerName: 'فاطمة علي',
                paymentAmount: 10000,
                discountAmount: 0,
                totalDeduction: 10000,
                notes: 'دفعة جزئية',
                createdAt: new Date(1641100000000).toISOString()
            },
            {
                id: 1641200000000,
                customerId: 1641168000000,
                customerName: 'محمد حسن',
                paymentAmount: 45000,
                discountAmount: 3000,
                totalDeduction: 48000,
                notes: 'تسديد كامل مع خصم',
                createdAt: new Date(1641200000000).toISOString()
            }
        ];
        
        // Sample global animals tracking
        const testGlobalAnimals = [
            {
                compositeKey: 'خروف_001',
                customerId: 1640995200000,
                customerName: 'أحمد محمد',
                type: 'خروف',
                number: '001',
                status: 'حي'
            },
            {
                compositeKey: 'سخل_002',
                customerId: 1640995200000,
                customerName: 'أحمد محمد',
                type: 'سخل',
                number: '002',
                status: 'جاهز'
            },
            {
                compositeKey: 'عجل_003',
                customerId: 1641081600000,
                customerName: 'فاطمة علي',
                type: 'عجل',
                number: '003',
                status: 'حي'
            },
            {
                compositeKey: 'جمل_004',
                customerId: 1641168000000,
                customerName: 'محمد حسن',
                type: 'جمل',
                number: '004',
                status: 'مذبوح'
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('customers', JSON.stringify(testCustomers));
        localStorage.setItem('payments', JSON.stringify(testPayments));
        localStorage.setItem('globalAnimals', JSON.stringify(testGlobalAnimals));
        
        // Update global variables
        customers = testCustomers;
        payments = testPayments;
        globalAnimals = testGlobalAnimals;
        
        alert('تم تحميل البيانات التجريبية بنجاح!');
        
        // Refresh all displays
        displayCustomers();
        displayBalanceSheet();
    }
}

// Add test data button to each tab
function addTestDataButton() {
    const style = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
        font-size: 14px;
    `;
    
    const button = document.createElement('button');
    button.textContent = 'تحميل بيانات تجريبية';
    button.style.cssText = style;
    button.onclick = loadTestData;
    
    // document.body.appendChild(button);
}

// Initialize test data functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only add test button in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        addTestDataButton();
    }
});
