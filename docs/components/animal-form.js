import React, { useState } from 'react';
import { db } from '../js/firebase-config'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore';

const AnimalForm = ({ customerId }) => {
    const [animalType, setAnimalType] = useState('');
    const [weight, setWeight] = useState('');
    const [kiloPrice, setKiloPrice] = useState('');
    const [totalPrice, setTotalPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const total = weight * kiloPrice;
            await addDoc(collection(db, 'customers', customerId, 'animals'), {
                type: animalType,
                weight: weight,
                kiloPrice: kiloPrice,
                totalPrice: total,
            });
            alert('تم إضافة الحيوان بنجاح');
            resetForm();
        } catch (error) {
            console.error('Error adding animal: ', error);
            alert('حدث خطأ أثناء إضافة الحيوان');
        }
    };

    const resetForm = () => {
        setAnimalType('');
        setWeight('');
        setKiloPrice('');
        setTotalPrice('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                نوع الحيوان:
                <select value={animalType} onChange={(e) => setAnimalType(e.target.value)} required>
                    <option value="">اختر نوع الحيوان</option>
                    <option value="سخل">سخل</option>
                    <option value="خروف">خروف</option>
                    <option value="عجل">عجل</option>
                </select>
            </label>
            <label>
                الوزن (كجم):
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
            </label>
            <label>
                سعر الكيلو:
                <input type="number" value={kiloPrice} onChange={(e) => setKiloPrice(e.target.value)} required />
            </label>
            <label>
                السعر الإجمالي:
                <input type="number" value={totalPrice} readOnly />
            </label>
            <button type="submit">إضافة الحيوان</button>
        </form>
    );
};

export default AnimalForm;