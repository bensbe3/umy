# 🚀 Free Deployment Guide - Youth Parliament Morocco Website

This guide will help you deploy the website for **FREE** using popular hosting platforms.

---

## 📋 Prerequisites

1. **GitHub Account** (free)
2. **Supabase Account** (free tier available)
3. **Vercel/Netlify Account** (free tier available)

---

## 🎯 Option 1: Vercel (Recommended - Easiest)

### Step 1: Prepare Your Code

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up with GitHub (free)

2. **Import Project**
   - Click "Add New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

4. **Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Click "Save"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live! 🎉

### Step 3: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**Vercel Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ HTTPS (automatic)
- ✅ Global CDN
- ✅ 100GB bandwidth/month
- ✅ Serverless functions

---

## 🎯 Option 2: Netlify (Alternative)

### Step 1: Prepare Your Code

Same as Vercel - push to GitHub.

### Step 2: Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)**
   - Sign up with GitHub (free)

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Click "Show advanced"
   - **Base directory:** Leave empty

4. **Environment Variables**
   - Click "Environment variables"
   - Add:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Click "Save"

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Your site is live! 🎉

### Step 3: Custom Domain (Optional)

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Follow DNS configuration

**Netlify Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ HTTPS (automatic)
- ✅ Global CDN
- ✅ 100GB bandwidth/month
- ✅ Form handling (for contact form)

---

## 🗄️ Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free tier available)
3. Create new project
4. Wait for database to initialize (2-3 minutes)

### Step 2: Run Database Schema

1. Go to SQL Editor in Supabase Dashboard
2. Copy contents of `setup-supabase.sql`
3. Paste and run
4. Verify tables are created

### Step 3: Create Storage Buckets

1. Go to Storage in Supabase Dashboard
2. Create buckets:
   - `article-images` (Public)
   - `actualite-images` (Public)
   - `profile-images` (Public, optional)

3. **Set Storage Policies:**
   - Go to Storage → Policies
   - For each bucket, add:
     ```sql
     -- Allow public read
     CREATE POLICY "Public Access" ON storage.objects
     FOR SELECT USING (bucket_id = 'bucket-name');
     
     -- Allow authenticated upload
     CREATE POLICY "Authenticated Upload" ON storage.objects
     FOR INSERT WITH CHECK (
       bucket_id = 'bucket-name' AND
       auth.role() = 'authenticated'
     );
     ```

### Step 4: Get API Keys

1. Go to Settings → API
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### Step 5: Create Admin User

1. Go to Authentication → Users
2. Create user or use email/password
3. Go to SQL Editor and run:
   ```sql
   INSERT INTO users (id, role, commissions_role)
   SELECT id, 'super_admin', 'full'
   FROM auth.users
   WHERE email = 'your-email@example.com'
   ON CONFLICT (id) DO UPDATE
   SET role = 'super_admin',
       commissions_role = 'full';
   ```

---

## 🔧 Environment Variables

### Local Development

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Production (Vercel/Netlify)

Add in platform dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 📦 Build & Test Locally

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## ✅ Post-Deployment Checklist

- [ ] Test homepage loads
- [ ] Test all navigation links
- [ ] Test contact form submission
- [ ] Test admin login (`/a8f4e2c9d7b1`)
- [ ] Test image uploads
- [ ] Test article/actualité creation
- [ ] Test mobile responsiveness
- [ ] Verify HTTPS is enabled
- [ ] Check Lighthouse performance score
- [ ] Test on different browsers

---

## 🐛 Troubleshooting

### Build Fails

**Error: Module not found**
- Run `npm install` again
- Check `package.json` dependencies

**Error: Environment variables missing**
- Verify `.env` file exists
- Check variable names (must start with `VITE_`)
- Restart dev server after adding variables

### Images Not Loading

1. Check Supabase Storage buckets exist
2. Verify storage policies are set
3. Check image URLs in database
4. Verify bucket is public

### Admin Panel Not Working

1. Verify user exists in `users` table
2. Check role is set correctly
3. Verify RLS policies allow access
4. Check browser console for errors

### Contact Form 403 Error

1. Run `FIX_CONTACT_FORM_RLS.sql` in Supabase
2. Verify RLS policy allows anonymous inserts
3. Check Supabase logs

---

## 🔒 Security Best Practices

1. **Never commit `.env` file**
   - Add to `.gitignore`
   - Use platform environment variables

2. **Use RLS Policies**
   - Always enable RLS on tables
   - Test policies thoroughly

3. **Admin Route**
   - Keep obfuscated route secret
   - Don't link to it publicly

4. **API Keys**
   - Use anon key (not service role key) in frontend
   - Rotate keys if compromised

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Optional)
- Add Vercel Analytics package
- Get insights on performance

### Supabase Dashboard
- Monitor database usage
- Check storage usage
- View API requests

---

## 💰 Cost Breakdown

### Free Tier Limits

**Vercel/Netlify:**
- ✅ 100GB bandwidth/month (usually enough)
- ✅ Unlimited deployments
- ✅ Custom domains

**Supabase:**
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth/month
- ⚠️ May need to upgrade for high traffic

### When to Upgrade

- **Supabase:** If you exceed free tier limits
- **Hosting:** Usually stays free unless very high traffic

---

## 🎉 You're Done!

Your website is now live and accessible worldwide!

**Admin Panel:** `https://your-domain.com/a8f4e2c9d7b1`

**Next Steps:**
1. Test all functionality
2. Add content via admin panel
3. Share your website!
4. Monitor performance

---

## 📞 Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)

---

**Last Updated:** January 2026  
**Version:** 1.0.0
