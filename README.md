# برنامج تنظيم الأضاحي الإسلامية (Islamic Sacrifice Management System)

## 🌐 Live Demo
**App URL:** https://nidaldh.github.io/adahy/

## نظرة عامة
تطبيق ويب شامل لإدارة الأضاحي الإسلامية ومتابعة العملاء والمدفوعات. يوفر النظام واجهة سهلة الاستخدام باللغة العربية مع دعم RTL ونظام قاعدة بيانات Firebase.

## 🚀 Deployment
This app is automatically deployed to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a new deployment.

### Local Development
```bash
npm install
npm start
```

### Manual Deployment
```bash
npm run deploy
```

## المميزات - Features
- ✅ إدخال معلومات العميل والحيوانات المختارة (سخل، خروف، عجل)
- ✅ عرض قائمة شاملة بجميع العملاء وحيواناتهم
- ✅ إدخال المدفوعات مع إمكانية إضافة خصم ثابت
- ✅ كشف رصيد شامل لجميع العملاء
- ✅ واجهة مستخدم حديثة باللغة العربية
- ✅ تخزين البيانات في Firebase أو localStorage
- ✅ بحث في العملاء والأرصدة
- ✅ تاريخ المدفوعات التفصيلي

## بنية المشروع - Project Structure
```
animal-sales-app/
├── src/
│   ├── index.html              # الصفحة الرئيسية
│   ├── css/
│   │   └── style.css          # التصميم والأنماط
│   ├── js/
│   │   ├── app.js             # الوظائف الرئيسية
│   │   ├── firebase-config.js  # إعدادات Firebase
│   │   ├── customer-entry.js   # إدخال العملاء
│   │   ├── customer-list.js    # قائمة العملاء
│   │   ├── payment-entry.js    # إدخال المدفوعات
│   │   └── balance-sheet.js    # كشف الرصيد
│   └── components/
│       ├── customer-form.js    # نموذج العميل
│       ├── animal-form.js      # نموذج الحيوان
│       └── payment-form.js     # نموذج الدفع
├── package.json               # إعدادات npm
└── README.md                  # توثيق المشروع
```

## التثبيت والإعداد - Installation & Setup

### 1. تحميل المشروع - Download Project
```bash
git clone <repository-url>
cd animal-sales-app
```

### 2. تثبيت التبعيات - Install Dependencies
```bash
npm install
```

### 3. إعداد Firebase - Firebase Setup
✅ **تم التكوين مسبقاً - Pre-configured**

Firebase متصل بالفعل مع المشروع الجديد:
- **Project ID:** `alfaree-615b6`
- **Database URL:** `https://alfaree-615b6-default-rtdb.firebaseio.com/`
- **Firebase SDK:** v11.8.1 (أحدث إصدار)

للاستخدام مع مشروع Firebase جديد:
1. إنشاء مشروع جديد في [Firebase Console](https://console.firebase.google.com/)
2. تفعيل Realtime Database و Analytics
3. تحديث إعدادات المشروع في `src/js/firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
};
```

### 4. تشغيل التطبيق - Run Application
```bash
# تشغيل الخادم المحلي
python3 -m http.server 8080
# افتح: http://localhost:8080/docs/index.html
```

### 5. اختبار Firebase - Test Firebase
```bash
# تشغيل اختبار التكوين
node test-firebase.js
```

## كيفية الاستخدام - Usage Guide

### 1. إدخال العملاء - Customer Entry
- انقر على تبويب "إدخال العملاء"
- أدخل اسم العميل ورقم الهاتف
- أضف الحيوانات مع تحديد النوع والوزن وسعر الكيلو
- اضغط "حفظ العميل والحيوانات"

### 2. قائمة العملاء - Customer List
- اعرض جميع العملاء مع تفاصيل الحيوانات
- استخدم البحث للعثور على عميل محدد
- انقر "عرض التفاصيل" لرؤية بيانات الحيوانات كاملة

### 3. إدخال المدفوعات - Payment Entry
- اختر العميل من القائمة
- أدخل مبلغ الدفع أو الخصم
- أضف ملاحظات إذا لزم الأمر
- احفظ المدفوعات

### 4. كشف الرصيد - Balance Sheet
- اعرض ملخص شامل للمبيعات والمدفوعات
- تتبع الأرصدة المتبقية لكل عميل
- اعرض تاريخ المدفوعات التفصيلي

## أنواع الحيوانات المدعومة - Supported Animal Types
- 🐑 سخل (Young Sheep)
- 🐏 خروف (Sheep)
- 🐄 عجل (Calf)

## التقنيات المستخدمة - Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **Styling**: Modern CSS with Grid and Flexbox
- **Storage**: Firebase + localStorage fallback
- **Language**: Arabic RTL support

## المساهمة - Contributing
المساهمات مرحب بها! يرجى إرسال pull request أو فتح issue للاقتراحات والتحسينات.

Contributions are welcome! Please submit a pull request or open an issue for suggestions and improvements.

## الترخيص - License
هذا المشروع مرخص تحت رخصة MIT - This project is licensed under the MIT License.