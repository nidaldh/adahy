#!/bin/bash

# Islamic Sacrifice Management System - Deployment Script
# This script sets up and validates the complete application

echo "🐑 برنامج تنظيم الأضاحي الإسلامية - Islamic Sacrifice Management System"
echo "================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [[ ! -f "docs/index.html" ]]; then
    print_error "يرجى تشغيل هذا السكريبت من المجلد الجذر للمشروع"
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "تم العثور على ملفات المشروع - Project files found"

# Validate HTML structure
if [[ -f "docs/index.html" ]]; then
    print_status "فحص الصفحة الرئيسية - Validating main HTML file"
    
    # Check for required elements
    if grep -q "برنامج تنظيم الأضاحي الإسلامية" docs/index.html; then
        print_status "عنوان التطبيق صحيح - Application title correct"
    else
        print_warning "قد يحتاج عنوان التطبيق إلى تحديث - Application title may need update"
    fi
    
    if grep -q "firebase" docs/index.html; then
        print_status "سكريبت Firebase موجود - Firebase script found"
    else
        print_warning "سكريبت Firebase غير موجود - Firebase script missing"
    fi
fi

# Validate JavaScript files
JS_FILES=("app.js" "customer-entry.js" "customer-list.js" "payment-entry.js" "balance-sheet.js" "firebase-config.js")

print_info "فحص ملفات JavaScript - Validating JavaScript files"
for file in "${JS_FILES[@]}"; do
    if [[ -f "docs/js/$file" ]]; then
        print_status "$file موجود - $file exists"
    else
        print_error "$file مفقود - $file missing"
    fi
done

# Check CSS file
if [[ -f "docs/css/style.css" ]]; then
    print_status "ملف CSS موجود - CSS file exists"
    
    # Check for RTL support
    if grep -q "direction: rtl" docs/css/style.css; then
        print_status "دعم RTL موجود - RTL support found"
    else
        print_warning "قد يحتاج دعم RTL إلى تحديث - RTL support may need update"
    fi
else
    print_error "ملف CSS مفقود - CSS file missing"
fi

# Check for test files
if [[ -f "docs/js/test-data.js" ]]; then
    print_status "ملف البيانات التجريبية موجود - Test data file exists"
fi

if [[ -f "docs/js/app-tests.js" ]]; then
    print_status "ملف الاختبارات موجود - Test suite file exists"
fi

# Function to deploy to GitHub Pages
deploy_github_pages() {
    print_info "نشر على GitHub Pages - Deploying to GitHub Pages"
    
    # docs directory should already exist and contain all files
    if [[ ! -d "docs" ]]; then
        print_error "مجلد docs غير موجود - docs directory missing"
        exit 1
    fi
    
    print_status "مجلد docs موجود مع جميع الملفات - docs directory exists with all files"
    
    # Create .nojekyll file to prevent Jekyll processing if not exists
    if [[ ! -f "docs/.nojekyll" ]]; then
        touch docs/.nojekyll
        print_status "تم إنشاء ملف .nojekyll - Created .nojekyll file"
    fi
    
    # Check if we're in a git repository
    if [[ -d ".git" ]]; then
        print_info "إضافة الملفات إلى Git - Adding files to Git"
        git add docs/
        
        # Check if there are changes to commit
        if git diff --staged --quiet; then
            print_warning "لا توجد تغييرات للنشر - No changes to deploy"
        else
            git commit -m "Deploy to GitHub Pages - $(date)"
            print_status "تم إنشاء commit جديد - Created new commit"
            
            print_info "رفع التغييرات - Pushing changes"
            git push origin main
            print_status "تم رفع التغييرات بنجاح - Changes pushed successfully"
            
            echo ""
            print_status "تم نشر التطبيق على GitHub Pages!"
            print_status "Application deployed to GitHub Pages!"
            echo ""
            print_info "يمكنك الوصول للتطبيق على - You can access the app at:"
            echo "https://nidaldh.github.io/adahy/"
            echo ""
            print_warning "قد يستغرق الأمر بضع دقائق لتحديث الموقع"
            print_warning "It may take a few minutes for the site to update"
        fi
    else
        print_error "هذا المجلد ليس repository Git - This directory is not a Git repository"
        print_info "يرجى تشغيل: git init && git remote add origin YOUR_REPO_URL"
        print_info "Please run: git init && git remote add origin YOUR_REPO_URL"
    fi
}

# Function to start development server
start_server() {
    print_info "تشغيل الخادم المحلي - Starting development server"
    
    if command -v python3 &> /dev/null; then
        print_status "تشغيل خادم Python - Starting Python server"
        echo "الخادم يعمل على: http://localhost:8000/index.html"
        echo "Server running at: http://localhost:8000/index.html"
        echo "اضغط Ctrl+C لإيقاف الخادم - Press Ctrl+C to stop the server"
        cd docs && python3 -m http.server 8000
    elif command -v node &> /dev/null; then
        if command -v npx &> /dev/null; then
            print_status "تشغيل خادم Node.js - Starting Node.js server"
            npx serve docs -p 8000
        else
            print_warning "npx غير متاح - npx not available"
        fi
    else
        print_info "يرجى فتح docs/index.html مباشرة في المتصفح"
        print_info "Please open docs/index.html directly in your browser"
    fi
}

# Function to validate Firebase config
check_firebase_config() {
    if grep -q "YOUR_API_KEY" docs/js/firebase-config.js; then
        print_warning "إعدادات Firebase لم يتم تحديثها - Firebase config not updated"
        print_info "يرجى تحديث docs/js/firebase-config.js بإعدادات مشروعك"
        print_info "Please update docs/js/firebase-config.js with your project settings"
    else
        print_status "إعدادات Firebase تبدو محدثة - Firebase config appears updated"
    fi
}

# Function to show application features
show_features() {
    echo ""
    print_info "ميزات التطبيق - Application Features:"
    echo "• إدارة العملاء والأضاحي - Customer and Sacrifice Management"
    echo "• نظام المدفوعات مع الخصومات - Payment System with Discounts"
    echo "• تتبع حالات الأضاحي - Sacrifice Status Tracking"
    echo "• كشوف الأرصدة والتقارير - Balance Sheets and Reports"
    echo "• واجهة عربية مع دعم RTL - Arabic Interface with RTL Support"
    echo "• تخزين البيانات في Firebase - Firebase Data Storage"
    echo ""
}

# Function to show usage instructions
show_usage() {
    echo ""
    print_info "طريقة الاستخدام - Usage Instructions:"
    echo "1. إدخال العملاء والأضاحي - Enter customers and sacrifices"
    echo "2. تسجيل المدفوعات - Record payments"
    echo "3. متابعة الأرصدة - Track balances"
    echo "4. إدارة حالات الأضاحي - Manage sacrifice status"
    echo ""
    print_info "للاختبار - For Testing:"
    echo "• استخدم زر 'تحميل بيانات تجريبية' - Use 'Load Test Data' button"
    echo "• استخدم زر 'تشغيل الاختبارات' - Use 'Run Tests' button"
    echo ""
}

# Main execution
echo ""
print_status "فحص النظام مكتمل - System check complete"

check_firebase_config
show_features
show_usage

# Ask user what to do
echo ""
print_info "اختر العملية التالية - Choose next action:"
echo "1. تشغيل الخادم المحلي - Start development server"
echo "2. فحص الملفات فقط - Check files only"
echo "3. عرض التعليمات - Show instructions"
echo "4. نشر على GitHub Pages - Deploy to GitHub Pages"

read -p "أدخل رقم العملية (1-4): Enter action number (1-4): " choice

case $choice in
    1)
        start_server
        ;;
    2)
        print_status "فحص الملفات مكتمل - File check complete"
        ;;
    3)
        show_usage
        ;;
    4)
        deploy_github_pages
        ;;
    *)
        print_info "يمكنك تشغيل: bash deploy.sh - You can run: bash deploy.sh"
        ;;
esac

echo ""
print_status "شكراً لاستخدام برنامج تنظيم الأضاحي الإسلامية"
print_status "Thank you for using Islamic Sacrifice Management System"
