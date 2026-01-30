# Youth Parliament Morocco - Website Report

## 📊 Project Overview

**Project Name:** Youth Parliament Morocco (UMY) Website  
**Technology Stack:** React 18, TypeScript, Vite, Supabase  
**Deployment Status:** Ready for Production  
**Last Updated:** January 2026

---

## 🏗️ Architecture

### Frontend
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite 5.0.8
- **Routing:** React Router DOM 7.11.0
- **Styling:** Tailwind CSS 4.1.18 + Custom CSS
- **UI Components:** Radix UI primitives
- **Animations:** Framer Motion, GSAP
- **Rich Text Editor:** React Quill
- **Notifications:** Sonner

### Backend & Database
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (images)
- **Real-time:** Supabase Realtime (if needed)

### Key Libraries
- `@supabase/supabase-js` - Database & Auth
- `react-router-dom` - Client-side routing
- `framer-motion` - Animations
- `gsap` - Advanced animations
- `react-quill` - Rich text editing
- `date-fns` - Date formatting
- `lucide-react` - Icons

---

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── CommissionsPage.tsx
│   │   │   ├── DecryptMundiPage.tsx
│   │   │   ├── ArticleDetailPage.tsx
│   │   │   ├── ActualiteDetailPage.tsx
│   │   │   ├── CachePostPage.tsx (Admin)
│   │   │   ├── ContactPage.tsx
│   │   │   ├── GalleryPage.tsx
│   │   │   └── SponsorPage.tsx
│   │   ├── ActualitesSection.tsx
│   │   ├── HomepageNewsFeed.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── UserMenu.tsx
│   │   ├── ImageUpload.tsx
│   │   └── OptimizedImage.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── utils/
│   │   ├── sanitize.ts
│   │   └── security.ts
│   ├── styles/
│   │   └── editorial.css
│   ├── App.tsx
│   └── main.tsx
├── public/
├── setup-supabase.sql      # Database schema
├── FIX_CONTACT_FORM_RLS.sql
└── package.json
```

---

## 🎯 Features

### Public Features
1. **Homepage**
   - Hero section with Hyperspeed animation
   - Commissions overview
   - Latest news feed (Actualités)
   - Call-to-action sections

2. **Commissions Pages**
   - International Relations (IR)
   - Moroccan Politics (MP)
   - Social Development (SD)
   - Commission-specific actualités

3. **DecryptMundi**
   - Editorial-style article platform
   - Category filtering
   - Featured articles
   - Article detail pages with SEO

4. **Actualités**
   - Commission-specific news
   - Compact card design
   - Image overlays
   - Detail pages

5. **Contact Form**
   - Multi-step form
   - Rate limiting
   - Input sanitization
   - Direct database submission

6. **Gallery**
   - 3D dome gallery
   - Interactive image viewer

### Admin Features (Obfuscated Route: `/a8f4e2c9d7b1`)
1. **Content Management**
   - Create/Edit/Delete Actualités
   - Create/Edit/Delete DecryptMundi Articles
   - Image upload to Supabase Storage
   - Rich text editor (React Quill)
   - SEO fields (meta title, description, keywords)
   - Category management
   - Status management (draft/published)

2. **Contact Submissions** (Full Access Admins Only)
   - View all contact form submissions
   - Status management (new/read/replied/archived)
   - Detailed submission viewer

3. **Role-Based Access Control**
   - **Editor:** Can create/edit own DecryptMundi articles
   - **Super Admin (Commission-specific):** Can manage actualités for assigned commission
   - **Super Admin (Full):** Can manage all content + view contact submissions

---

## 🔐 Security Features

1. **Input Sanitization**
   - XSS protection
   - SQL injection prevention
   - HTML sanitization
   - URL validation

2. **Rate Limiting**
   - Contact form: 5 submissions per minute
   - Client-side throttling

3. **Authentication**
   - Supabase Auth
   - Row Level Security (RLS) policies
   - Role-based access control

4. **Admin Route Obfuscation**
   - Route: `/a8f4e2c9d7b1` (not `/cachepost`)
   - Hidden from public navigation

5. **Security Headers**
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
   - Referrer-Policy
   - Permissions-Policy

---

## 🎨 Design System

### Colors
- **Primary Green:** `#022c22` (Dark green background)
- **Text:** `#f5e6d3` (Beige-pink)
- **Accent Blue:** `#0ea5e9` (International Relations)
- **Accent Red:** `#dc2626` (Moroccan Politics)
- **Accent Green:** `#16a34a` (Social Development)
- **Gold:** `#d4af37` (Highlights)

### Typography
- **Headings:** Sharp, editorial style
- **Body:** Clean, readable fonts
- **Editorial:** Professional press-style typography

### Design Principles
- Sharp edges (no rounded corners)
- Editorial/press-style layout
- Professional, authoritative aesthetic
- University/institutional feel

---

## 📊 Database Schema

### Tables
1. **users** - User profiles and roles
2. **decryptmundi_articles** - DecryptMundi articles
3. **commission_actualites** - Commission news
4. **contact_submissions** - Contact form data
5. **article_categories** - Article categories (if used)

### Storage Buckets
1. **article-images** - DecryptMundi article images
2. **actualite-images** - Actualité images
3. **profile-images** - User profile images (if used)

---

## ⚡ Performance Optimizations

### Implemented
1. **Code Splitting**
   - React vendor chunk
   - Three.js vendor chunk
   - UI component chunks
   - Editor vendor chunk
   - Supabase vendor chunk

2. **Image Optimization**
   - Lazy loading with Intersection Observer
   - OptimizedImage component
   - Responsive image sizing
   - Error handling with fallbacks

3. **Build Optimizations**
   - ESBuild minification
   - Console/debugger removal in production
   - CSS code splitting
   - Source maps only in development

4. **Caching**
   - Manual chunk splitting for better caching
   - Static asset optimization

### Recommendations for Further Optimization
1. **Image Optimization**
   - Use WebP format for images
   - Implement responsive images (srcset)
   - Compress images before upload
   - Use CDN for image delivery

2. **Lazy Loading**
   - Lazy load routes with React.lazy()
   - Lazy load heavy components (Gallery, 3D animations)

3. **Bundle Size**
   - Remove unused dependencies
   - Tree-shake unused code
   - Consider dynamic imports for heavy libraries

4. **Caching Headers**
   - Configure proper cache headers on hosting
   - Use service workers for offline support

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [x] Remove unused files and components
- [x] Remove guide/documentation files
- [x] Optimize images
- [x] Test all routes
- [x] Verify authentication
- [x] Test admin panel
- [x] Verify contact form
- [x] Check mobile responsiveness

### Environment Variables Required
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build Command
```bash
npm run build
```

### Build Output
- `dist/` folder contains production build
- Static assets optimized
- Code minified and obfuscated

---

## 📝 Known Issues & Limitations

1. **Performance**
   - Large images may slow down page load
   - 3D gallery may be heavy on low-end devices
   - Consider implementing image CDN

2. **SEO**
   - Some pages may need better meta tags
   - Consider adding sitemap.xml
   - Add robots.txt

3. **Accessibility**
   - Some contrast ratios may need improvement
   - Keyboard navigation could be enhanced
   - ARIA labels may need expansion

---

## 🔄 Maintenance

### Regular Tasks
1. **Database**
   - Monitor Supabase usage
   - Clean up old contact submissions
   - Archive old articles/actualités

2. **Storage**
   - Monitor storage usage
   - Clean up unused images
   - Optimize image sizes

3. **Security**
   - Review RLS policies periodically
   - Update dependencies
   - Monitor for security vulnerabilities

4. **Performance**
   - Monitor Lighthouse scores
   - Optimize slow pages
   - Review bundle sizes

---

## 📞 Support & Documentation

### Key Files
- `setup-supabase.sql` - Database schema
- `FIX_CONTACT_FORM_RLS.sql` - Contact form RLS fix
- `package.json` - Dependencies
- `vite.config.ts` - Build configuration

### Admin Access
- Route: `/a8f4e2c9d7b1`
- Requires authentication
- Role-based permissions

---

## 📈 Future Enhancements

1. **Performance**
   - Implement service workers
   - Add PWA capabilities
   - Optimize 3D gallery performance

2. **Features**
   - Search functionality
   - Newsletter subscription
   - Social media integration
   - Analytics integration

3. **SEO**
   - Dynamic sitemap generation
   - Better meta tag management
   - Structured data (JSON-LD)

4. **Accessibility**
   - Improve contrast ratios
   - Enhanced keyboard navigation
   - Screen reader optimization

---

**Report Generated:** January 2026  
**Version:** 1.0.0
