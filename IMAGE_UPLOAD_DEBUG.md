# 🔍 Image Upload Debugging Guide

## 🐛 Issue: Images Upload But Don't Display

### What I've Added:

1. ✅ **Console Logging**
   - Logs when image upload completes
   - Logs the URL being saved
   - Logs the data being sent to database
   - Logs the response from database

2. ✅ **Visual Feedback**
   - Shows image URL in form after upload
   - Success message with URL preview
   - Warning if URL is empty

3. ✅ **Error Handling**
   - Image load errors logged to console
   - Failed images hidden gracefully
   - Success messages when images load

---

## 🧪 How to Debug

### Step 1: Open Browser Console
```
Press F12 → Go to Console tab
```

### Step 2: Upload Image
1. Go to admin page
2. Create/Edit actualité
3. Click "Upload Image"
4. Select image file

### Step 3: Check Console Logs

**You should see:**
```
=== IMAGE UPLOAD SUCCESS ===
File path: 1234567890-abc123.jpg
Public URL: https://irfduxuiecqciuvuuoru.supabase.co/storage/v1/object/public/actualite-images/1234567890-abc123.jpg
Bucket: actualite-images

Image upload complete, URL received: https://...
```

### Step 4: Check Form
- You should see: **"✅ Image URL: https://..."** in green text
- The URL should be visible in the form

### Step 5: Save Actualité
1. Fill in title and content
2. Click "Save"

**Check console for:**
```
=== ACTUALITÉ SAVE DATA ===
Image URL: https://...
Image URL (trimmed): https://...
Image URL (final): https://...
Full data: { ... image_url: "https://..." ... }

✅ Created actualité: { ... image_url: "https://..." ... }
✅ Image URL in database: https://...
```

### Step 6: Check Published Actualité
1. Go to homepage or commissions page
2. Find your actualité
3. Check console for:
   - `Image loaded successfully: https://...` ✅
   - OR `Image failed to load: https://...` ❌

---

## 🔍 Common Issues & Fixes

### Issue 1: Image URL is Empty After Upload

**Symptoms:**
- Upload succeeds
- But form shows no URL
- Console shows upload success but URL is empty

**Possible Causes:**
- Storage bucket not public
- CORS issue
- URL generation failed

**Fix:**
1. Check Supabase Dashboard → Storage
2. Verify `actualite-images` bucket exists
3. Check bucket is **Public**
4. Verify storage policies allow public read

### Issue 2: Image URL Saved But Not Displaying

**Symptoms:**
- Console shows URL saved to database
- But image doesn't show on frontend
- Console shows: `Image failed to load`

**Possible Causes:**
- CORS blocking image
- URL format incorrect
- Bucket not public
- Image file corrupted

**Fix:**
1. **Check URL format:**
   - Should be: `https://[project].supabase.co/storage/v1/object/public/actualite-images/[filename]`
   - NOT: `https://[project].supabase.co/storage/v1/object/sign/...`

2. **Test URL directly:**
   - Copy URL from console
   - Paste in browser address bar
   - Should show image
   - If 404: Bucket doesn't exist or not public
   - If CORS error: Storage policies need fixing

3. **Check Storage Policies:**
   ```sql
   -- In Supabase SQL Editor, run:
   SELECT * FROM storage.buckets WHERE name = 'actualite-images';
   
   -- Should return: public = true
   ```

### Issue 3: Image Uploads But URL Not Saved

**Symptoms:**
- Upload succeeds
- URL shows in form
- But after save, database has NULL

**Possible Causes:**
- State not updating
- Save function not including image_url
- Database field name mismatch

**Fix:**
1. Check console logs:
   - Should see `Image URL (final): https://...`
   - Should see `Full data: { image_url: "https://..." }`

2. If URL is in data but not saved:
   - Check database column name: `image_url`
   - Check RLS policies allow update
   - Check for database errors in console

---

## ✅ Quick Verification Steps

### 1. Verify Storage Bucket
```sql
-- Run in Supabase SQL Editor
SELECT name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE name = 'actualite-images';
```

**Should return:**
- `name: actualite-images`
- `public: true`
- `file_size_limit: 5242880` (5MB)
- `allowed_mime_types: ['image/*']`

### 2. Verify Storage Policies
```sql
-- Check policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';
```

**Should have:**
- Policy for SELECT (public read)
- Policy for INSERT (authenticated upload)

### 3. Verify Database Column
```sql
-- Check column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'commission_actualites'
AND column_name = 'image_url';
```

**Should return:**
- `column_name: image_url`
- `data_type: text`

### 4. Test Image URL Directly
1. Get URL from console log
2. Open in new browser tab
3. Should display image
4. If 404: Bucket issue
5. If CORS: Policy issue

---

## 🛠️ Quick Fixes

### Fix 1: Make Bucket Public
```
1. Supabase Dashboard → Storage
2. Click on "actualite-images" bucket
3. Settings → Make Public: ON
4. Save
```

### Fix 2: Add Public Read Policy
```sql
-- Run in Supabase SQL Editor
CREATE POLICY "Public can view actualite images"
ON storage.objects FOR SELECT
USING (bucket_id = 'actualite-images');
```

### Fix 3: Verify Image URL Format
The URL should be:
```
https://[project-id].supabase.co/storage/v1/object/public/actualite-images/[filename]
```

NOT:
```
https://[project-id].supabase.co/storage/v1/object/sign/actualite-images/[filename]?token=...
```

---

## 📊 Debug Checklist

When testing, check:

- [ ] Image uploads successfully (toast message)
- [ ] Console shows upload success with URL
- [ ] Form shows "✅ Image URL: ..." message
- [ ] Console shows URL in save data
- [ ] Console shows URL in database response
- [ ] Image URL works when pasted in browser
- [ ] Image displays on frontend
- [ ] Console shows "Image loaded successfully"

**If any step fails, check the corresponding section above!**

---

## 🆘 Still Not Working?

### Check These:

1. **Browser Console:**
   - Any red errors?
   - What do the logs say?

2. **Network Tab:**
   - Open F12 → Network tab
   - Upload image
   - Check if upload request succeeds (200)
   - Check if image request fails (404, CORS, etc.)

3. **Supabase Dashboard:**
   - Storage → actualite-images
   - Do you see your uploaded files?
   - Can you download them?

4. **Database:**
   - Table Editor → commission_actualites
   - Find your actualité
   - Check `image_url` column
   - Is it NULL or does it have a URL?

---

**Share the console logs and I'll help debug further!** 🔍
