# How to Redeploy the Website

## Option 1: Automatic Deployment (GitHub + Vercel/Netlify)

If your repository is connected to Vercel or Netlify:

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Update programs, footer, add legal pages"
   git push origin main
   ```

2. **Wait for automatic deployment:**
   - Vercel/Netlify will automatically detect the push and start building
   - Check your deployment dashboard for build status
   - Usually takes 2-5 minutes

## Option 2: Manual Deployment on Vercel

1. **Install Vercel CLI (if not already installed):**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## Option 3: Manual Deployment on Netlify

1. **Install Netlify CLI (if not already installed):**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

## Option 4: Free Deployment Platforms

### Vercel (Recommended - Free Tier)
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Import your repository
- Vercel auto-detects Vite/React projects
- Deploy automatically on every push

### Netlify (Free Tier)
- Go to [netlify.com](https://netlify.com)
- Sign up with GitHub
- Import your repository
- Set build command: `npm run build`
- Set publish directory: `dist`
- Deploy

### GitHub Pages (Free)
1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Important Notes

- **Environment Variables**: Make sure your Supabase environment variables are set in your deployment platform's settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: Use Node.js 18+ or 20+

## After Deployment

1. Verify all pages are accessible:
   - `/terms`
   - `/privacy`
   - `/credits`

2. Check that:
   - Footer shows logo and updated copyright
   - Phone number is removed
   - Programs show brief descriptions
   - IR programs are in correct order

3. Test admin panel (if applicable):
   - Navigate to `/a8f4e2c9d7b1`
   - Verify login and permissions work
