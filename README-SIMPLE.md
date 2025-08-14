# چت بات آلفا - نسخه ساده شده LibreChat

این پروژه یک نسخه ساده شده از LibreChat است که فقط از مدل‌های Gemini استفاده می‌کند و قابلیت‌های چت، تولید تصویر و جستجو را فراهم می‌کند.

## ویژگی‌ها

- ✅ چت با دو مدل Gemini: سریع آلفا (gemini-2.5-flash) و پیشرفته آلفا (gemini-2.5-pro)
- ✅ تولید تصویر با استفاده از Gemini
- ✅ جستجو در وب با استفاده از Gemini
- ✅ رابط کاربری ساده و زیبا با پشتیبانی از زبان فارسی
- ✅ بدون نیاز به احراز هویت یا ثبت‌نام
- ✅ چرخش خودکار کلیدهای API

## نصب و راه‌اندازی

### پیش‌نیازها

- Node.js 18 یا بالاتر
- Docker (اختیاری)
- کلید API از Google Gemini

### روش ۱: اجرا با Docker (توصیه شده)

۱. فایل `.env` را در پوشه اصلی پروژه ایجاد کنید:

```bash
# Gemini API Keys (comma-separated)
ALL_GEMINI_API_KEYS=your_api_key_1,your_api_key_2,your_api_key_3

# Server Port
PORT=3080
```

۲. اجرای با Docker Compose:

```bash
docker-compose -f docker-compose-simple.yml up --build
```

۳. مراجعه به آدرس: `http://localhost:3080`

### روش ۲: اجرا بدون Docker

#### راه‌اندازی Backend

۱. وارد پوشه `api` شوید:

```bash
cd api
```

۲. فایل `package.json` را کپی کنید:

```bash
cp package-simple.json package.json
```

۳. نصب وابستگی‌ها:

```bash
npm install
```

۴. فایل `.env` را در پوشه `api` ایجاد کنید:

```bash
ALL_GEMINI_API_KEYS=your_api_key_1,your_api_key_2,your_api_key_3
PORT=3080
```

۵. اجرای سرور:

```bash
npm start
```

#### راه‌اندازی Frontend

۱. وارد پوشه `client` شوید:

```bash
cd client
```

۲. فایل‌های پیکربندی را کپی کنید:

```bash
cp package-simple.json package.json
cp vite-simple.config.js vite.config.js
cp index-simple.html index.html
```

۳. نصب وابستگی‌ها:

```bash
npm install
```

۴. اجرای در حالت توسعه:

```bash
npm run dev
```

۵. مراجعه به آدرس: `http://localhost:3000`

## استفاده

### انتخاب مدل

در بالای صفحه، می‌توانید بین دو مدل انتخاب کنید:
- **چت بات سریع آلفا**: برای پاسخ‌های سریع و ساده
- **چت بات پیشرفته آلفا**: برای پاسخ‌های دقیق‌تر و پیچیده‌تر

### انواع ورودی

سه نوع ورودی در دسترس است:

#### ۱. چت
برای گفتگو عادی با بات

#### ۲. تولید تصویر
برای تولید تصویر بر اساس توضیحات متنی

#### ۳. جستجو
برای جستجو در وب و دریافت اطلاعات به‌روز

### کلیدهای API

می‌توانید چندین کلید API را با کاما جدا کنید تا در صورت محدودیت نرخ، به صورت چرخشی استفاده شوند:

```
ALL_GEMINI_API_KEYS=key1,key2,key3
```

## ساختار پروژه

```
├── api/
│   ├── server/
│   │   └── simple-server.js    # سرور ساده شده
│   └── package-simple.json     # وابستگی‌های backend
├── client/
│   ├── src/
│   │   ├── AppSimple.jsx       # کامپوننت اصلی
│   │   ├── main-simple.jsx     # نقطه ورود
│   │   └── style-simple.css    # استایل‌ها
│   ├── package-simple.json     # وابستگی‌های frontend
│   ├── vite-simple.config.js   # پیکربندی Vite
│   └── index-simple.html       # فایل HTML
├── Dockerfile-simple           # Dockerfile
├── docker-compose-simple.yml   # Docker Compose
└── README-SIMPLE.md           # این فایل
```

## API Endpoints

### POST /api/chat
برای چت عادی

```json
{
  "message": "پیام کاربر",
  "history": [],
  "model": "gemini-2.5-flash"
}
```

### POST /api/generate-image
برای تولید تصویر

```json
{
  "prompt": "توضیح تصویر",
  "model": "gemini-2.5-flash"
}
```

### POST /api/search
برای جستجو

```json
{
  "query": "موضوع جستجو",
  "model": "gemini-2.5-flash"
}
```

### GET /health
برای بررسی وضعیت سرور

## عیب‌یابی

### خطای "No Gemini API keys configured"
کلیدهای API را در فایل `.env` تنظیم کنید.

### خطای "Failed to generate image"
برخی مدل‌های Gemini ممکن است قابلیت تولید تصویر نداشته باشند.

### خطای "Search failed"
بررسی کنید که مدل انتخاب شده از قابلیت جستجو پشتیبانی کند.

## مشارکت

برای بهبود این پروژه، لطفاً Issues و Pull Requests ارسال کنید.

## مجوز

این پروژه تحت مجوز MIT منتشر شده است.