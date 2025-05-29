import React, { useState } from 'react';
import { db } from '../js/firebase-config'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore';

const PaymentForm = () => {
    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState('');
    const [discount, setDiscount] = useState('');
    const [totalAmount, setTotalAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalAmount = amount - discount;

        try {
            await addDoc(collection(db, 'payments'), {
                customerId,
                amount: finalAmount,
                discount,
                createdAt: new Date(),
            });
            alert('Payment added successfully!');
            setCustomerId('');
            setAmount('');
            setDiscount('');
            setTotalAmount('');
        } catch (error) {
            console.error('Error adding payment: ', error);
            alert('Error adding payment. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>إدخال الدفع</h2>
            <div>
                <label>رقم العميل:</label>
                <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>المبلغ:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>الخصم:</label>
                <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                />
            </div>
            <div>
                <label>المبلغ الإجمالي:</label>
                <input
                    type="number"
                    value={totalAmount}
                    readOnly
                    placeholder={amount - discount}
                />
            </div>
            <button type="submit">إضافة الدفع</button>
        </form>
    );
};

export default PaymentForm;