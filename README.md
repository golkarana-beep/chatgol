# ChatGol 🟢

**هوش مصنوعی فارسی سبک، سریع و زیبا**

یک چت‌بات هوش مصنوعی مدرن با رابط کاربری کاملاً فارسی و راست‌چین.

![ChatGol](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

---

## ویژگی‌ها

- ✅ رابط کاربری کاملاً فارسی و راست‌چین
- ✅ پشتیبانی از تم تاریک زیبا
- ✅ ذخیره تاریخچه چت در LocalStorage
- ✅ حالت دمو (بدون نیاز به API Key)
- ✅ اتصال به OpenAI با API Key شخصی
- ✅ طراحی واکنش‌گرا (موبایل و دسکتاپ)
- ✅ تایپینگ انیمیشن و تجربه کاربری روان

---

## شروع سریع

### ۱. کلون کردن پروژه

```bash
git clone https://github.com/YOUR_USERNAME/chatgol.git
cd chatgol
```

### ۲. نصب وابستگی‌ها

```bash
npm install
```

### ۳. اجرای پروژه در حالت توسعه

```bash
npm run dev
```

سپس مرورگر را باز کنید و به آدرس زیر بروید:

```
http://localhost:3000
```

---

## استفاده از API واقعی

1. روی دکمه **تنظیمات** کلیک کنید
2. API Key خود را از [OpenAI](https://platform.openai.com/api-keys) وارد کنید
3. ذخیره کنید

> کلید فقط روی دستگاه شما ذخیره می‌شود و به هیچ سروری ارسال نمی‌گردد.

---

## ساختار پروژه

```
chatgol/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts      # API Route برای چت
│   │   ├── globals.css           # استایل‌های全局
│   │   ├── layout.tsx            # Layout اصلی
│   │   └── page.tsx              # صفحه چت
│   └── ...
├── public/
├── package.json
└── README.md
```

---

## استقرار (Deploy)

### روی Vercel (پیشنهادی)

1. ریپو را به GitHub پوش کنید
2. به [vercel.com](https://vercel.com) بروید
3. پروژه را Import کنید
4. Deploy بزنید

پروژه به صورت خودکار روی دامنه‌ای مثل `chatgol.vercel.app` در دسترس خواهد بود.

---

## تکنولوژی‌ها

| تکنولوژی     | استفاده          |
|--------------|------------------|
| Next.js      | فریمورک اصلی     |
| React        | UI               |
| TypeScript   | تایپ‌سیف بودن    |
| Tailwind CSS | استایل           |
| OpenAI API   | مدل هوش مصنوعی   |

---

## توسعه بیشتر (ایده‌ها)

- [ ] پشتیبانی از مدل‌های دیگر (Grok, Claude, Gemini)
- [ ] آپلود تصویر و تحلیل آن
- [ ] سیستم پرامپت شخصی‌سازی‌شده
- [ ] ذخیره چت‌ها در دیتابیس (Supabase)
- [ ] حالت مهمان با محدودیت
- [ ] پشتیبانی از Markdown کامل + کد بلاک

---

## لایسنس

MIT License - آزاد برای استفاده شخصی و تجاری.

---

ساخته شده با ❤️ برای جامعه فارسی
