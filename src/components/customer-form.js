import React, { useState } from 'react';
import { db } from '../js/firebase-config'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore';

const CustomerForm = () => {
    const [customerName, setCustomerName] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [weight, setWeight] = useState('');
    const [kiloPrice, setKiloPrice] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [animals, setAnimals] = useState([]);

    const handleAddAnimal = () => {
        const newAnimal = {
            type: animalType,
            weight: weight,
            kiloPrice: kiloPrice,
            totalPrice: totalPrice
        };
        setAnimals([...animals, newAnimal]);
        setAnimalType('');
        setWeight('');
        setKiloPrice('');
        setTotalPrice('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'customers'), {
                name: customerName,
                animals: animals
            });
            alert('Customer and animals added successfully!');
            setCustomerName('');
            setAnimals([]);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>إدخال بيانات العميل</h2>
            <input
                type="text"
                placeholder="اسم العميل"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
            />
            <h3>إضافة حيوان</h3>
            <select
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
                required
            >
                <option value="">اختر نوع الحيوان</option>
                <option value="سخل">سخل</option>
                <option value="خروف">خروف</option>
                <option value="عجل">عجل</option>
            </select>
            <input
                type="number"
                placeholder="الوزن (كجم)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="سعر الكيلو"
                value={kiloPrice}
                onChange={(e) => setKiloPrice(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="السعر الإجمالي"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                required
            />
            <button type="button" onClick={handleAddAnimal}>إضافة حيوان</button>
            <button type="submit">إرسال البيانات</button>
            <h3>الحيوانات المضافة:</h3>
            <ul>
                {animals.map((animal, index) => (
                    <li key={index}>
                        {animal.type} - {animal.weight} كجم - {animal.kiloPrice} / كجم - {animal.totalPrice} إجمالي
                    </li>
                ))}
            </ul>
        </form>
    );
};

export default CustomerForm;