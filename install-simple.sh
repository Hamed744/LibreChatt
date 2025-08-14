#!/bin/bash

echo "🔧 نصب چت بات آلفا - نسخه ساده شده LibreChat"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد. لطفاً Node.js 18 یا بالاتر را نصب کنید."
    echo "💡 دانلود از: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js نسخه 18 یا بالاتر مورد نیاز است. نسخه فعلی: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) یافت شد."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 ایجاد فایل .env..."
    cp .env.example .env
    echo "✅ فایل .env ایجاد شد."
    echo "⚠️  لطفاً کلیدهای API خود را در فایل .env تنظیم کنید."
else
    echo "✅ فایل .env موجود است."
fi

# Setup backend
echo "🔧 راه‌اندازی Backend..."
cd api
if [ ! -f package.json ]; then
    cp package-simple.json package.json
    echo "✅ فایل package.json کپی شد."
fi

echo "📦 نصب وابستگی‌های Backend..."
npm install
cd ..

# Setup frontend
echo "🎨 راه‌اندازی Frontend..."
cd client
if [ ! -f package.json ]; then
    cp package-simple.json package.json
    echo "✅ فایل package.json کپی شد."
fi

if [ ! -f vite.config.js ]; then
    cp vite-simple.config.js vite.config.js
    echo "✅ فایل vite.config.js کپی شد."
fi

if [ ! -f index.html ]; then
    cp index-simple.html index.html
    echo "✅ فایل index.html کپی شد."
fi

echo "📦 نصب وابستگی‌های Frontend..."
npm install
cd ..

echo ""
echo "🎉 نصب با موفقیت انجام شد!"
echo ""
echo "📋 مراحل بعدی:"
echo "1. فایل .env را ویرایش کنید و کلیدهای API خود را قرار دهید"
echo "2. برای اجرا، دستور زیر را اجرا کنید:"
echo "   ./start-simple.sh"
echo ""
echo "💡 یا می‌توانید به صورت دستی اجرا کنید:"
echo "   Backend: cd api && npm start"
echo "   Frontend: cd client && npm run dev"
echo ""
echo "🌐 پس از اجرا، به آدرس http://localhost:3080 مراجعه کنید."