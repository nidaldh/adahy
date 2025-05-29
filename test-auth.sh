#!/bin/bash

# Quick authentication test script
echo "🚀 اختبار المصادقة السريع"
echo "========================="

# Check if we're in the right directory
if [ ! -f "src/index.html" ]; then
    echo "❌ خطأ: يرجى تشغيل هذا السكريبت من مجلد المشروع الرئيسي"
    exit 1
fi

echo "✅ المجلد صحيح"

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "✅ Python3 متوفر"
    
    # Start web server in background
    echo "🌐 بدء الخادم المحلي..."
    python3 -m http.server 8080 > /dev/null 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 2
    
    echo "📱 الخادم يعمل على: http://localhost:8080"
    echo ""
    echo "🔗 روابط الاختبار:"
    echo "   التطبيق الرئيسي: http://localhost:8080/docs/index.html"
    echo "   اختبار سريع: http://localhost:8080/quick-test.html"
    echo "   تشخيص مفصل: http://localhost:8080/debug-auth.html"
    echo ""
    echo "📋 خطوات الاختبار:"
    echo "1. افتح الرابط الأول في المتصفح"
    echo "2. جرب إنشاء حساب جديد"
    echo "3. إذا ظهر خطأ 'auth/operation-not-allowed':"
    echo "   - اذهب إلى Firebase Console"
    echo "   - فعّل Email/Password Authentication"
    echo "4. استخدم الاختبار السريع للتحقق"
    echo ""
    echo "⏹️ لإيقاف الخادم: اضغط Ctrl+C"
    
    # Wait for user to stop
    trap "kill $SERVER_PID 2>/dev/null; echo ''; echo '🛑 تم إيقاف الخادم'; exit 0" INT
    wait $SERVER_PID
    
else
    echo "❌ Python3 غير متوفر. يرجى تثبيته أولاً"
    echo "🍎 على macOS: brew install python3"
    exit 1
fi
