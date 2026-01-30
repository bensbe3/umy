# 🔧 Admin Panel Troubleshooting - Tabs Not Showing

## Issue: Can't See Actualités and DecryptMundi Tabs

### Quick Checks:

1. **Open Browser Console (F12)**
   - Look for debug messages starting with `===`
   - Check the permissions values:
     - `canManageActualites: true/false`
     - `canManageArticles: true/false`
     - `activeTab: 'actualites' | 'articles' | 'contacts'`

2. **Check Your User Role in Database**
   ```sql
   SELECT * FROM users WHERE id = 'your-user-id';
   ```
   - Should have `role = 'super_admin'` or `role = 'editor'`
   - For Actualités: `commissions_role` should be `'ir'`, `'mp'`, `'sd'`, or `'full'`
   - For Articles: `role = 'editor'` OR `role = 'super_admin'` with `commissions_role = 'full'`

3. **Verify Tabs Are Rendered**
   - Right-click on page → Inspect
   - Search for `content-tabs` class
   - Check if the div exists but is hidden

### Common Issues:

#### Issue 1: User Doesn't Have Permissions
**Solution:**
```sql
-- For full access (can see both Actualités and DecryptMundi)
UPDATE users 
SET role = 'super_admin', commissions_role = 'full'
WHERE id = 'your-user-id';

-- For Actualités only (specific commission)
UPDATE users 
SET role = 'super_admin', commissions_role = 'ir'  -- or 'mp' or 'sd'
WHERE id = 'your-user-id';

-- For DecryptMundi only
UPDATE users 
SET role = 'editor'
WHERE id = 'your-user-id';
```

#### Issue 2: Tabs Hidden by CSS
**Check:**
- Open DevTools (F12)
- Inspect `.content-tabs` element
- Check if `display: none` is applied
- Check if element is outside viewport

#### Issue 3: Editor is Open
**Solution:**
- Tabs are hidden when editor is open
- Click "Cancel" in editor to close it
- Tabs should appear

#### Issue 4: No Posts Yet
**Solution:**
- Tabs should still be visible even with 0 posts
- If not visible, check permissions

### Debug Steps:

1. **Check Console Logs:**
   ```
   === ContentManagementInterface Permissions ===
   canManageActualites: true/false
   canManageArticles: true/false
   ```

2. **Check Database:**
   ```sql
   SELECT id, role, commissions_role FROM users WHERE id = 'your-user-id';
   ```

3. **Check Network Tab:**
   - Look for failed API calls
   - Check if Supabase requests are successful

4. **Check React DevTools:**
   - Install React DevTools extension
   - Inspect `ContentManagementInterface` component
   - Check state values

### Expected Behavior:

- **Full Access Admin:** Should see 3 tabs (Actualités, DecryptMundi, Contact Submissions)
- **Commission Admin:** Should see 1 tab (Actualités for their commission)
- **Editor:** Should see 1 tab (DecryptMundi)

### If Still Not Working:

1. **Clear browser cache**
2. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check if JavaScript errors in console**
4. **Verify Supabase connection**
5. **Check RLS policies in Supabase**

### Quick Fix SQL:

```sql
-- Make sure your user has full access
INSERT INTO users (id, role, commissions_role)
SELECT id, 'super_admin', 'full'
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin',
    commissions_role = 'full';
```

Then:
1. Log out of admin panel
2. Log back in
3. Tabs should appear

---

**Still having issues?** Check the browser console for the debug messages and share what you see.
