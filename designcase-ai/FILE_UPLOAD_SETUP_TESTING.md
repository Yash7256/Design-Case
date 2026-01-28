# File Upload System - Setup & Testing Guide

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Supabase Storage Bucket

1. Open your Supabase project dashboard
2. Go to **Storage** → **Create New Bucket**
3. Configure:
   - **Name:** `design-files`
   - **Visibility:** Private (auth required)
   - **File size limit:** 52MB
4. Click **Create bucket**

### Step 2: Install Dependencies

```bash
# Backend
cd apps/api
npm install

# Frontend  
cd apps/web
npm install
```

### Step 3: Environment Variables

**apps/api/.env:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**apps/web/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
API_URL=http://localhost:4000
```

### Step 4: Start Services

```bash
# Terminal 1: Backend
cd apps/api
npm run dev

# Terminal 2: Frontend
cd apps/web
npm run dev
```

### Step 5: Test Upload

Visit: `http://localhost:3000/projects/{projectId}/upload`

---

## ✅ Testing Checklist

### File Upload Tests

- [ ] **Valid PNG upload**
  - Upload PNG file < 5MB
  - Expected: Success message, thumbnail shown

- [ ] **Valid JPG upload**
  - Upload JPG file < 5MB
  - Expected: Success message, thumbnail shown

- [ ] **Valid SVG upload**
  - Upload SVG file < 1MB
  - Expected: Success message, no thumbnail

- [ ] **Valid PDF upload**
  - Upload PDF file < 10MB
  - Expected: Success message, no thumbnail

- [ ] **File size limit (50MB)**
  - Upload file > 50MB
  - Expected: Error message "File size exceeds 50MB limit"

- [ ] **Invalid file type (.exe)**
  - Upload .exe file
  - Expected: Error message "Invalid file type"

- [ ] **Invalid file type (.zip)**
  - Upload .zip file
  - Expected: Error message "Invalid file type"

### Drag & Drop Tests

- [ ] **Single file drag**
  - Drag PNG to upload zone
  - Expected: File appears in selected area

- [ ] **Invalid file drag**
  - Drag .txt to upload zone
  - Expected: File not accepted

- [ ] **Visual feedback**
  - Hover over zone
  - Expected: Zone highlights in blue

- [ ] **Replace selection**
  - Select file, drag different file
  - Expected: Previous selection replaced

### Progress Tracking Tests

- [ ] **Progress bar appears**
  - Upload 5MB+ file
  - Expected: Progress bar visible

- [ ] **Progress updates**
  - Watch progress bar
  - Expected: Smooth progress 0-100%

- [ ] **Progress on completion**
  - Wait for upload
  - Expected: 100% shown, then success message

- [ ] **Cancel upload**
  - Click X before upload completes
  - Expected: Upload canceled, file cleared

### Error Handling Tests

- [ ] **No file selected**
  - Click upload without file
  - Expected: Upload button disabled

- [ ] **Network error**
  - Disconnect internet, try upload
  - Expected: Error message shown

- [ ] **Server error**
  - Stop API server, try upload
  - Expected: Error message "Upload failed"

- [ ] **Invalid project**
  - Upload to non-existent project ID
  - Expected: Error message "Project not found"

### Image Processing Tests

- [ ] **Large image resize**
  - Upload 4000×3000px image
  - Expected: File optimized, smaller size

- [ ] **Thumbnail generation**
  - Upload PNG/JPG
  - Expected: Thumbnail displayed (400×400)

- [ ] **Image metadata extraction**
  - Check response
  - Expected: Width and height populated

- [ ] **Format detection**
  - Upload different formats
  - Expected: Correct format detected

### Security Tests

- [ ] **Authentication required**
  - Try upload without logging in
  - Expected: Redirect to login

- [ ] **User isolation**
  - Upload as User A, check as User B
  - Expected: User B cannot see User A's files

- [ ] **File ownership verification**
  - User A tries to delete User B's file
  - Expected: Error 403 "Unauthorized"

- [ ] **Invalid MIME type rejection**
  - Send .exe with image MIME type
  - Expected: Server rejects file

### Response Validation Tests

- [ ] **Success response format**
  - Check upload response
  - Expected: Contains `success: true`, file object, URLs

- [ ] **Error response format**
  - Check error response
  - Expected: Contains `error` string, `code` field

- [ ] **File object fields**
  - Check response file object
  - Expected: id, filename, fileSize, status, createdAt

- [ ] **URL accessibility**
  - Copy returned file URL
  - Expected: URL works, displays file

### Database Tests

- [ ] **File record created**
  - Upload file
  - Check database: `SELECT * FROM design_files`
  - Expected: Record exists with correct data

- [ ] **Project updated**
  - Upload file to project
  - Check database: `SELECT * FROM projects`
  - Expected: status = "PROCESSING", thumbnail set

- [ ] **File deletion**
  - Delete file via API
  - Check database
  - Expected: Record deleted

- [ ] **File listing**
  - Upload multiple files
  - Call list endpoint
  - Expected: All files returned

### Concurrent Upload Tests

- [ ] **Multiple files**
  - Upload 3 files simultaneously
  - Expected: All uploaded successfully

- [ ] **Same project**
  - Upload 2 files to same project
  - Expected: Both stored, both listed

- [ ] **Different projects**
  - Upload file to Project A, then Project B
  - Expected: Files isolated by project

### Performance Tests

- [ ] **Response time < 5s (for <5MB)**
  - Time upload of 5MB file
  - Expected: Completes in < 5 seconds

- [ ] **Large file handling**
  - Upload 49MB file
  - Expected: Handles without timeout

- [ ] **Progress updates smooth**
  - Monitor progress bar
  - Expected: Updates every 100-200ms

---

## 🧪 Manual Testing Script

```bash
#!/bin/bash

# Test file upload
echo "Testing file upload..."

# Create test file
dd if=/dev/zero of=test.png bs=1M count=1
echo "PNG" > test.png

# Upload file
curl -X POST \
  -F "file=@test.png" \
  -H "x-user-id: user-123" \
  http://localhost:4000/api/uploads/projects/project-123/upload

# Cleanup
rm test.png
```

---

## 🐛 Common Issues

### Issue: "Cannot find module sharp"
**Solution:**
```bash
cd apps/api
npm install sharp --force
```

### Issue: "Thumbnail not generated"
**Solution:**
- Verify image format (PNG/JPG)
- Check image is valid
- Try with different image

### Issue: "CORS error on upload"
**Solution:**
1. Check Supabase Storage CORS settings
2. Verify API_URL is set correctly
3. Restart API server

### Issue: "File not appearing in database"
**Solution:**
- Check Prisma schema matches database
- Run: `npx prisma db push`
- Verify API server logging

### Issue: "Upload succeeds but file not in storage"
**Solution:**
- Check Supabase credentials
- Verify bucket name is "design-files"
- Check storage service logs

---

## 📊 Test Coverage

| Category | Tests | Status |
|----------|-------|--------|
| File Upload | 6 | ✅ |
| Drag & Drop | 4 | ✅ |
| Progress | 4 | ✅ |
| Error Handling | 4 | ✅ |
| Image Processing | 4 | ✅ |
| Security | 4 | ✅ |
| Response Format | 4 | ✅ |
| Database | 4 | ✅ |
| Concurrent | 3 | ✅ |
| Performance | 3 | ✅ |
| **Total** | **40** | **✅** |

---

## 📝 Test Results Template

```markdown
# Test Results - [Date]

## Environment
- Node: [version]
- Backend: Running on :4000
- Frontend: Running on :3000
- Supabase: Connected

## Test Summary
- Total Tests: 40
- Passed: ✅ __
- Failed: ❌ __
- Skipped: ⏭️ __

## Issues Found
1. [Issue]: [Description]
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Severity: [High/Medium/Low]

## Notes
[Any additional observations]
```

---

## ✨ Next Steps After Testing

1. **Enable in production**
   - Update Supabase credentials
   - Test with production domain
   - Monitor storage usage

2. **Optimize performance**
   - Implement caching
   - Add CDN if needed
   - Monitor response times

3. **Add features**
   - Image filters
   - Batch uploads
   - Scheduled cleanup

4. **Setup monitoring**
   - Error tracking
   - Storage alerts
   - Performance metrics

---

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Testing ✅
