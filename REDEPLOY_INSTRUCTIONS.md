# 🚀 Quick Redeploy Guide

## Option 1: Automatic Redeploy (GitHub + Vercel/Netlify)

If your project is connected to GitHub and auto-deploy is enabled:

### Step 1: Commit Your Changes
```bash
git add .
git commit -m "Fix admin panel - restore posts list and edit/delete functionality"
git push
```

### Step 2: Wait for Auto-Deploy
- **Vercel**: Automatically deploys when you push to GitHub (check Vercel dashboard)
- **Netlify**: Automatically deploys when you push to GitHub (check Netlify dashboard)

**That's it!** Your site will redeploy automatically in 2-3 minutes.

---

## Option 2: Manual Redeploy

### If Using Vercel:

1. **Go to [vercel.com](https://vercel.com)**
2. **Select your project**
3. **Click "Deployments" tab**
4. **Click the "..." menu on the latest deployment**
5. **Click "Redeploy"**
6. **Confirm redeploy**

OR

1. **Go to your project dashboard**
2. **Click "Deploy" button** (if available)
3. **Select branch** (usually `main` or `master`)
4. **Click "Deploy"**

### If Using Netlify:

1. **Go to [netlify.com](https://netlify.com)**
2. **Select your site**
3. **Click "Deploys" tab**
4. **Click "Trigger deploy" → "Deploy site"**
5. **Select branch** (usually `main` or `master`)
6. **Click "Deploy site"**

---

## Option 3: Redeploy via Command Line (Vercel CLI)

### Install Vercel CLI (if not installed):
```bash
npm install -g vercel
```

### Login:
```bash
vercel login
```

### Deploy:
```bash
vercel --prod
```

---

## ✅ Pre-Deploy Checklist

Before redeploying, make sure:

- [ ] All changes are committed to Git
- [ ] `vercel.json` exists in project root (for SPA routing)
- [ ] Environment variables are set in Vercel/Netlify dashboard:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Build works locally: `npm run build`

---

## 🐛 If Redeploy Fails

### Check Build Logs:
1. Go to your deployment dashboard
2. Click on the failed deployment
3. Check the build logs for errors

### Common Issues:

**Error: Module not found**
```bash
# Fix: Make sure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: Environment variables missing**
- Go to Project Settings → Environment Variables
- Add missing variables
- Redeploy

**Error: Build command failed**
- Test locally: `npm run build`
- Fix any errors
- Commit and push

---

## 📝 Quick Commands Reference

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Commit and push (triggers auto-deploy)
git add .
git commit -m "Your commit message"
git push

# Check deployment status (Vercel CLI)
vercel ls

# View deployment logs (Vercel CLI)
vercel logs
```

---

## ⚡ Fastest Method

**If you have GitHub auto-deploy enabled:**

1. Open terminal in project folder
2. Run:
   ```bash
   git add .
   git commit -m "Update admin panel"
   git push
   ```
3. Wait 2-3 minutes
4. Check your deployment dashboard
5. Done! ✅

---

**Need help?** Check your deployment platform's documentation:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
