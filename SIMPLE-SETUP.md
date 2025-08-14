# چت بات آلفا - راه‌اندازی ساده شده

## خلاصه تغییرات

این پروژه یک نسخه کاملاً ساده شده از LibreChat است که فقط قابلیت‌های ضروری را حفظ کرده است:

### ✅ ویژگی‌های حفظ شده:
- چت با دو مدل Gemini (سریع آلفا و پیشرفته آلفا)
- تولید تصویر
- جستجو در وب
- رابط کاربری زیبا با پشتیبانی از فارسی
- چرخش خودکار کلیدهای API

### ❌ ویژگی‌های حذف شده:
- احراز هویت و ثبت‌نام
- مدیریت کاربران
- مدل‌های OpenAI/Anthropic
- پلاگین‌ها
- فایل‌های پیچیده
- تنظیمات پیشرفته

## فایل‌های جدید ایجاد شده

### Backend (سرور):
- `api/server/simple-server.js` - سرور ساده شده
- `api/package-simple.json` - وابستگی‌های backend

### Frontend (رابط کاربری):
- `client/src/AppSimple.jsx` - کامپوننت اصلی
- `client/src/main-simple.jsx` - نقطه ورود
- `client/src/style-simple.css` - استایل‌ها
- `client/package-simple.json` - وابستگی‌های frontend
- `client/vite-simple.config.js` - پیکربندی Vite
- `client/index-simple.html` - فایل HTML

### Docker و Deployment:
- `Dockerfile-simple` - Dockerfile ساده شده
- `docker-compose-simple.yml` - Docker Compose
- `.env.example` - نمونه فایل محیطی

### اسکریپت‌های راه‌اندازی:
- `install-simple.sh` - اسکریپت نصب
- `start-simple.sh` - اسکریپت اجرا
- `README-SIMPLE.md` - راهنمای کامل

## نحوه استفاده

### ۱. نصب سریع:
```bash
./install-simple.sh
```

### ۲. تنظیم کلیدهای API:
فایل `.env` را ویرایش کنید:
```bash
ALL_GEMINI_API_KEYS=your_api_key_1,your_api_key_2,your_api_key_3
PORT=3080
```

### ۳. اجرا:
```bash
./start-simple.sh
```

### ۴. مراجعه:
به آدرس `http://localhost:3080` مراجعه کنید.

## ساختار ساده شده

```
├── api/
│   ├── server/simple-server.js    # سرور اصلی
│   └── package-simple.json        # وابستگی‌ها
├── client/
│   ├── src/
│   │   ├── AppSimple.jsx          # رابط کاربری
│   │   ├── main-simple.jsx        # نقطه ورود
│   │   └── style-simple.css       # استایل‌ها
│   ├── package-simple.json        # وابستگی‌ها
│   ├── vite-simple.config.js      # پیکربندی
│   └── index-simple.html          # HTML
├── Dockerfile-simple              # Docker
├── docker-compose-simple.yml      # Docker Compose
├── install-simple.sh              # نصب
├── start-simple.sh                # اجرا
└── README-SIMPLE.md               # راهنما
```

## API Endpoints

- `POST /api/chat` - چت عادی
- `POST /api/generate-image` - تولید تصویر
- `POST /api/search` - جستجو
- `GET /health` - وضعیت سرور

## مزایای این نسخه

1. **سادگی**: فقط قابلیت‌های ضروری
2. **سرعت**: بارگذاری سریع‌تر
3. **امنیت**: بدون نیاز به احراز هویت
4. **نگهداری آسان**: کد کمتر، مشکل کمتر
5. **قابلیت حمل**: اجرا آسان در هر محیطی

## پشتیبانی

برای سوالات و مشکلات، لطفاً Issues ارسال کنید.