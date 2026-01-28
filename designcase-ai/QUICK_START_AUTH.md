# Quick Start - Authentication

Get the DesignCase AI authentication system running in 5 minutes.

## 1. Get Supabase Credentials (2 minutes)

1. Visit [supabase.com](https://supabase.com)
2. Create account and new project
3. Settings → API → Copy:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY)

## 2. Configure Environment Variables (1 minute)

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. Install & Run (2 minutes)

```bash
cd apps/web
npm install
npm run dev
```

Visit http://localhost:3000

## Test Cases

| Flow | Steps | Expected |
|------|-------|----------|
| **Signup** | Go to /signup → Fill form → Submit → Verify email → Check inbox | Redirects to /dashboard, user logged in |
| **Login** | Go to /login → Enter credentials → Submit | Redirects to /dashboard |
| **OAuth** | Click "Continue with Google" or GitHub | Logs in and redirects to /dashboard |
| **Protected Route** | Try /dashboard without login | Redirects to /login |
| **Logout** | From /dashboard, click "Sign Out" | Redirects to /login, session cleared |
| **Reset Password** | Click "Forgot password?" → Follow email link → Enter new password | Redirects to /login |

## Key Files

- **Authentication**: `apps/web/lib/auth-context.tsx`
- **Routes**: `apps/web/middleware.ts`
- **Pages**: `apps/web/app/(auth)/*` and `apps/web/app/auth/*`
- **Config**: `apps/web/.env.local`

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Module not found errors | Run `npm install` in `apps/web/` |
| Environment variables undefined | Restart dev server after creating `.env.local` |
| Middleware not protecting routes | Verify `middleware.ts` is at project root |
| OAuth errors | Enable provider in Supabase, add localhost:3000 to Site URL |
| Cookies not persisting | Check browser cookies have `sb-*` tokens |

## Next: Enable OAuth (Optional)

**Google OAuth:**
1. Supabase → Authentication → Providers → Google → Enable
2. Follow Google Cloud Console setup
3. Paste Client ID and Secret back into Supabase

**GitHub OAuth:**
1. Supabase → Authentication → Providers → GitHub → Enable
2. Create OAuth App at github.com/settings/developers
3. Paste Client ID and Secret back into Supabase

## Full Documentation

See [AUTH_SETUP.md](./AUTH_SETUP.md) for complete setup guide.

---

**Status:** ✅ Complete | **Time to setup:** ~5 minutes
