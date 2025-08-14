#!/bin/bash

echo "🚀 راه‌اندازی چت بات آلفا - نسخه ساده شده LibreChat"
echo "=================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  فایل .env یافت نشد. ایجاد فایل نمونه..."
    cat > .env << EOF
# Gemini API Keys (comma-separated)
ALL_GEMINI_API_KEYS=your_api_key_here

# Server Port
PORT=3080
EOF
    echo "📝 فایل .env ایجاد شد. لطفاً کلیدهای API خود را در آن قرار دهید."
    echo "💡 مثال: ALL_GEMINI_API_KEYS=key1,key2,key3"
    exit 1
fi

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker یافت شد. اجرا با Docker..."
    docker-compose -f docker-compose-simple.yml up --build
else
    echo "📦 Docker یافت نشد. اجرا بدون Docker..."
    
    # Start backend
    echo "🔧 راه‌اندازی Backend..."
    cd api
    if [ ! -f package.json ]; then
        cp package-simple.json package.json
    fi
    npm install
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    echo "🎨 راه‌اندازی Frontend..."
    cd client
    if [ ! -f package.json ]; then
        cp package-simple.json package.json
    fi
    if [ ! -f vite.config.js ]; then
        cp vite-simple.config.js vite.config.js
    fi
    if [ ! -f index.html ]; then
        cp index-simple.html index.html
    fi
    npm install
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo "✅ برنامه در حال اجرا است!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:3080"
    echo ""
    echo "برای توقف برنامه، Ctrl+C را فشار دهید."
    
    # Wait for user to stop
    wait $BACKEND_PID $FRONTEND_PID
fi