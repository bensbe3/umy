# Youth Parliament Morocco - Website

Modern, secure website for Youth Parliament Morocco with admin content management system.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 🔐 Admin Access

**URL:** `/a8f4e2c9d7b1` (keep secret!)

Login with your admin credentials to manage content.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── pages/          # Page components
│   ├── auth/           # Authentication
│   └── ...
├── contexts/           # React contexts
├── lib/                # Libraries (Supabase)
├── utils/              # Utilities (security, sanitization)
└── styles/             # Global styles
```

## 🛡️ Security Features

- ✅ XSS Protection
- ✅ SQL Injection Protection
- ✅ Input Sanitization
- ✅ Copy Protection
- ✅ DevTools Detection
- ✅ Obfuscated Admin Route

## 📚 Documentation

- `DEPLOYMENT.md` - Deployment instructions
- `FIX_ALL_RLS.sql` - Database policy fixes
- `setup-supabase.sql` - Initial database setup

## 🔧 Tech Stack

- React + TypeScript
- Vite
- Supabase
- Tailwind CSS
- React Router

## ⚙️ Environment Variables

Create `.env.local`:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## 📄 License

© 2024 Youth Parliament Morocco. All rights reserved.
