# Authentication Setup Guide - DesignCase AI

## Overview

This guide covers the complete authentication system setup using Supabase for the DesignCase AI platform.

## Supabase Configuration

### 1. Create a Supabase Project

1. Visit [supabase.com](https://supabase.com) and sign up for a free account
2. Create a new project:
   - Choose a project name (e.g., "designcase-ai")
   - Select a region close to your users
   - Create a strong database password
3. Wait for the project to initialize (2-5 minutes)

### 2. Get Your API Keys

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon (public)** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this private!)

### 3. Configure Environment Variables

In `apps/web/.env.local`, add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## OAuth Configuration (Optional but Recommended)

### Enable Google OAuth

1. In Supabase, go to **Authentication** → **Providers** → **Google**
2. Enable the provider
3. You'll be guided to create OAuth credentials in Google Cloud Console
4. Follow the prompts and paste the Client ID and Secret into Supabase

### Enable GitHub OAuth

1. In Supabase, go to **Authentication** → **Providers** → **GitHub**
2. Enable the provider
3. Create OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
4. Paste the Client ID and Secret into Supabase

## Database Setup

### Create User Table (If Not Using Supabase Auth)

If you're using Supabase Auth, the `auth.users` table is created automatically. However, you may want to extend it with custom fields.

In Supabase SQL Editor, run:

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile."
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

## Application Setup

### 1. Install Dependencies

```bash
cd apps/web
npm install
# or
pnpm install
```

### 2. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

### 3. Test the Authentication Flow

#### Email/Password Signup
1. Navigate to `http://localhost:3000/signup`
2. Fill in:
   - Full Name: Your Name
   - Email: your-email@example.com
   - Password: (min 6 characters)
   - Confirm Password: (must match)
3. Click "Sign up"
4. Verify email in your inbox (check spam)
5. Should redirect to `/dashboard` after email verification

#### Email/Password Login
1. Navigate to `http://localhost:3000/login`
2. Enter your email and password
3. Click "Sign in"
4. Should redirect to `/dashboard`
5. Session persists across page reloads

#### Forgot Password
1. On login page, click "Forgot your password?"
2. Enter your email
3. Check your inbox for password reset link
4. Click link to reset password
5. Enter new password and confirm
6. Redirect to login page

#### OAuth (Google/GitHub)
1. On signup/login page, click "Continue with Google" or "Continue with GitHub"
2. Complete OAuth flow in popup
3. First time: auto-creates account
4. Subsequent times: logs in existing account
5. Should redirect to `/dashboard`

#### Protected Routes
1. Try visiting `http://localhost:3000/dashboard` without logging in
2. Should redirect to `/login?next=/dashboard`
3. After logging in, should redirect to `/dashboard`

#### Session Persistence
1. Log in to account
2. Refresh the page (Ctrl+R or Cmd+R)
3. Session should persist (still logged in)
4. Check browser cookies - look for `sb-*` cookies set by Supabase

#### Logout
1. From dashboard, click "Sign Out"
2. Should redirect to `/login`
3. Session cookie should be cleared

## Architecture Overview

### Key Files

**Authentication Core**
- `apps/web/lib/supabase.ts` - Supabase client setup for browser and server
- `apps/web/lib/auth-context.tsx` - React context for auth state and methods
- `apps/web/middleware.ts` - Next.js middleware for protected routes

**Pages**
- `apps/web/app/(auth)/login/page.tsx` - Login page with email/password and OAuth
- `apps/web/app/(auth)/signup/page.tsx` - User registration page
- `apps/web/app/auth/callback/route.ts` - OAuth callback handler
- `apps/web/app/auth/forgot-password/page.tsx` - Password reset request
- `apps/web/app/auth/reset-password/page.tsx` - New password creation
- `apps/web/app/dashboard/page.tsx` - Protected dashboard page

**Components**
- `apps/web/components/ui/button.tsx` - Button with variants
- `apps/web/components/ui/input.tsx` - Text input field
- `apps/web/components/ui/label.tsx` - Form label

### Authentication Flow

#### Signup Flow
```
User → Signup Form → useAuth.signUp() → Supabase →
Verify Email → Redirect to Dashboard → useAuth hook provides user context
```

#### Login Flow
```
User → Login Form → useAuth.signIn() → Supabase →
Set Session Cookie → Redirect to Dashboard
```

#### OAuth Flow
```
User → Click OAuth Button → Redirect to Supabase OAuth →
External Provider Login → Callback Route →
Exchange Code for Session → Redirect to Dashboard
```

#### Protected Route Flow
```
User Request → Middleware.ts →
Check Session Cookie → If Valid: Allow →
If Invalid: Redirect to Login
```

### useAuth Hook

The `useAuth()` hook provides:

```typescript
{
  user: {
    id: string;
    email: string;
    user_metadata?: { name?: string };
    created_at?: string;
  } | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}
```

## Troubleshooting

### "Can't find module '@supabase/ssr'"
**Solution:** Run `npm install @supabase/ssr` in `apps/web/`

### "NEXT_PUBLIC_SUPABASE_URL is undefined"
**Solution:** 
- Check `.env.local` has the environment variables
- Restart the dev server with `npm run dev`
- Variables must be prefixed with `NEXT_PUBLIC_` to be available in browser

### "Invalid JWT token" errors
**Solution:**
- Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check that your Supabase project is active
- Clear browser cookies and re-login

### Email verification not working
**Solution:**
- Check Supabase Settings → Authentication → Email Templates
- For development, enable "Skip email verification" (not recommended for production)
- Check spam folder for verification emails

### OAuth redirects not working
**Solution:**
- In Supabase Settings → Authentication → Site URL, add `http://localhost:3000`
- For production, add your domain
- OAuth callback route must be exactly at `/auth/callback`

### Sessions not persisting
**Solution:**
- Check that middleware.ts is at the root of `apps/web/` (not in `src/`)
- Ensure cookies are not being blocked in browser settings
- Check browser DevTools → Application → Cookies for `sb-*` cookies

## Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to git
- Keep `SUPABASE_SERVICE_ROLE_KEY` private (never expose in frontend)
- Use `NEXT_PUBLIC_` only for values safe to expose

### 2. Row Level Security (RLS)
- Enable RLS on all user-related tables
- Use Supabase policies to restrict access
- Example: Users can only see/modify their own data

### 3. Passwords
- Minimum 6 characters enforced by signup form
- Always use HTTPS in production
- Never store passwords in application code

### 4. OAuth
- Only enable providers you actually use
- Regularly rotate OAuth credentials
- Use `state` parameter to prevent CSRF attacks (built into Supabase)

### 5. Rate Limiting
- Supabase applies rate limits to auth endpoints
- Free tier: 10 requests per second per IP
- Implement client-side debouncing on forms

## Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production` in environment
- [ ] Update `NEXT_PUBLIC_SUPABASE_URL` to production Supabase project
- [ ] Add production domain to Supabase Site URL settings
- [ ] Enable custom SMTP for emails (Supabase provides default for 30 days)
- [ ] Configure Google/GitHub OAuth for production domains
- [ ] Set strong Supabase database password
- [ ] Enable RLS on all tables
- [ ] Review and test all auth flows
- [ ] Set up monitoring for auth errors
- [ ] Document auth flow for team

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js 14 Security Best Practices](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## Next Steps

After authentication is set up and tested:

1. **Create user profile pages** - Display and edit user information
2. **Integrate with backend API** - Connect frontend auth to Express backend
3. **Implement project management** - Create, read, update, delete projects
4. **Add file upload** - Accept design files for analysis
5. **Create AI integration** - Connect to Claude API for analysis
6. **Build case study generation** - Generate markdown case studies from designs

---

**Version:** 1.0  
**Last Updated:** 2024  
**Maintainers:** DesignCase AI Team
