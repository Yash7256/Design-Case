# DesignCase AI - Authentication System Components

## 📋 Component Inventory

### Core Authentication
```
lib/supabase.ts
├── Purpose: Supabase client configuration
├── Exports: createClient(), createServerComponentClient()
├── Used by: auth-context, middleware, API routes
└── Key: SSR-compatible with cookie handling

lib/auth-context.tsx
├── Purpose: React context for auth state
├── Exports: AuthProvider, useAuth hook
├── State: user, session, loading, error
├── Methods: signIn, signUp, signOut, signInWithOAuth, resetPassword, updatePassword
└── Type-safe: Full TypeScript support

middleware.ts
├── Purpose: Route protection and auth flow
├── Protected routes: /dashboard, /projects, /settings
├── Auth routes: (auth) group for login/signup
├── Public: Home page, other static content
├── Redirect: Unauthenticated → /login?next=<original_route>
└── Session: Validated on every request
```

### Authentication Pages
```
app/(auth)/login/page.tsx
├── Email/password login form
├── OAuth buttons (Google, GitHub)
├── Forgot password link
├── Remember me checkbox
├── Form validation
├── Error handling
├── Loading states
└── Redirect support via ?next query param

app/(auth)/signup/page.tsx
├── Registration form (name, email, password)
├── Password confirmation validation
├── OAuth options (Google, GitHub)
├── Form validation with error display
├── Minimum 6-character password requirement
├── Email format validation
└── Redirect to login with success message

app/auth/callback/route.ts
├── Purpose: OAuth callback handler
├── Receives: code, state from OAuth provider
├── Process: Exchanges code for session
├── Redirect: To /dashboard on success
└── Error: Redirects to /login with error

app/auth/forgot-password/page.tsx
├── Email input for account recovery
├── Sends password reset email
├── Success message with email display
├── Loading state while sending
├── Back to login link
└── Error handling

app/auth/reset-password/page.tsx
├── Accessed via email reset link
├── New password input with confirmation
├── Password validation (min 6 chars, matching)
├── Updates user password
├── Redirects to login on success
└── Error handling for invalid tokens

app/dashboard/page.tsx
├── Protected route (requires auth)
├── Displays user information
├── Shows email and user ID
├── Account creation date
├── Sign out button
├── Feature preview cards
├── Loading state
└── Navigation bar
```

### UI Components
```
components/ui/button.tsx
├── Variants: default, outline, ghost
├── Sizes: sm, md, lg
├── States: default, hover, active, disabled, loading
├── Features: Flexible styling, icon support
└── Responsive: Mobile-friendly

components/ui/input.tsx
├── Type: text, email, password, number
├── States: default, focus, disabled, error
├── Styling: Tailwind CSS classes
├── Features: Placeholder, label support
└── Accessibility: Proper ARIA labels

components/ui/label.tsx
├── Purpose: Form field labels
├── Features: Text styling, association with inputs
├── Accessibility: htmlFor attribute support
└── Responsive: Mobile-friendly
```

### Root Configuration
```
app/providers.tsx
├── Wraps app with AuthProvider
├── Initializes context
├── Makes useAuth available to all components
└── Used in app/layout.tsx

app/layout.tsx
├── Root layout component
├── Applies providers
├── Metadata configuration
├── Global styling
└── TypeScript: RootLayout props
```

### Configuration
```
package.json (apps/web)
├── Dependencies:
│   ├── @supabase/supabase-js
│   ├── @supabase/ssr ← NEW
│   ├── @supabase/auth-helpers-nextjs
│   ├── react-hook-form
│   ├── zod
│   └── ... other libs
└── Scripts: dev, build, start, lint

.env.local (not in repo - create locally)
├── NEXT_PUBLIC_SUPABASE_URL
├── NEXT_PUBLIC_SUPABASE_ANON_KEY
├── SUPABASE_SERVICE_ROLE_KEY
└── NEXT_PUBLIC_APP_URL
```

## 🔄 Data Flow Diagrams

### Signup Flow
```
User Input
    ↓
[Signup Form] → useAuth.signUp()
    ↓
[Auth Context] → Supabase.auth.signUp()
    ↓
[Supabase] → Create user, send verification email
    ↓
[Email] → User clicks verification link
    ↓
[Callback Route] → Session created, redirect to dashboard
    ↓
[Dashboard] → User logged in, displays user info
```

### Login Flow
```
User Input
    ↓
[Login Form] → useAuth.signIn()
    ↓
[Auth Context] → Supabase.auth.signInWithPassword()
    ↓
[Supabase] → Validate credentials, create session
    ↓
[Browser] → Cookie set with session token
    ↓
[Dashboard] → User logged in, displays user info
```

### Protected Route Flow
```
User Request → /dashboard
    ↓
[Middleware] → Check session
    ↓
Session Valid? 
    ├─ YES → Allow access, render dashboard
    └─ NO → Redirect to /login?next=/dashboard
```

### OAuth Flow (Google/GitHub)
```
User Click → OAuth Button
    ↓
[App] → Redirect to Supabase OAuth endpoint
    ↓
[Supabase] → Redirect to Google/GitHub login
    ↓
[Provider] → User logs in and authorizes
    ↓
[Provider] → Redirect back with code
    ↓
[Callback Route] → Exchange code for session
    ↓
[Session] → Create user if new, or login if existing
    ↓
[Dashboard] → User logged in
```

### Password Reset Flow
```
User Action → Click "Forgot password?"
    ↓
[Form] → Enter email
    ↓
[Auth Context] → Supabase.auth.resetPasswordForEmail()
    ↓
[Supabase] → Send reset link to email
    ↓
[Email] → User clicks reset link
    ↓
[Reset Page] → Form to enter new password
    ↓
[Form] → Validate and submit new password
    ↓
[Auth Context] → Supabase.auth.updateUser()
    ↓
[Supabase] → Update password
    ↓
[Redirect] → Back to login
```

## 🎯 Hook API Reference

### useAuth Hook
```typescript
const {
  user,                    // User | null
  session,                // Session | null
  loading,                // boolean
  error,                  // string | null
  signIn,                 // (email, password) => Promise<void>
  signUp,                 // (email, password, name) => Promise<void>
  signOut,                // () => Promise<void>
  signInWithOAuth,        // (provider) => Promise<void>
  resetPassword,          // (email) => Promise<void>
  updatePassword,         // (password) => Promise<void>
  resetError,             // () => void
} = useAuth();
```

## 📦 Type Definitions

### User Type
```typescript
{
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
  created_at?: string;
}
```

### Auth Context Type
```typescript
{
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  resetError: () => void;
}
```

## 🚀 Usage Examples

### Using useAuth in Components
```tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export default function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
```

### Protecting Routes
```typescript
// In middleware.ts - already configured for:
// - /dashboard
// - /projects
// - /settings
// - /settings/*

// To add more protected routes:
const protectedRoutes = ['dashboard', 'projects', 'settings'];
```

### Checking Auth in Server Components
```tsx
import { createServerComponentClient } from '@/lib/supabase';

export default async function ServerComponent() {
  const supabase = createServerComponentClient();
  const { data } = await supabase.auth.getSession();
  
  if (!data.session) return <div>Not authenticated</div>;
  
  return <div>User: {data.session.user.email}</div>;
}
```

## 🔧 Configuration Points

### Add New OAuth Provider
1. Enable in Supabase: Settings → Authentication → Providers
2. Configure provider credentials
3. Update login/signup buttons

### Add Protected Route
1. Edit `middleware.ts`
2. Add route to `protectedRoutes` matcher
3. Test redirect to /login

### Change Auth Layout
1. Modify `app/(auth)/layout.tsx`
2. Update styles in components
3. Adjust form styling

### Customize Error Messages
1. Edit `lib/auth-context.tsx`
2. Update error handling in catch blocks
3. Modify user-facing messages

## 📊 Component Dependencies

```
├── App
│   ├── Providers (AuthProvider)
│   │   ├── AuthContext
│   │   └── Children using useAuth
│   ├── Middleware (route protection)
│   ├── Auth Pages
│   │   ├── (auth)/login
│   │   │   └── UI Components (Button, Input, Label)
│   │   ├── (auth)/signup
│   │   │   └── UI Components
│   │   ├── auth/callback
│   │   ├── auth/forgot-password
│   │   └── auth/reset-password
│   └── Dashboard (protected)
└── Supabase (Cloud)
```

## ✅ Verification Checklist

- [ ] All files created and present
- [ ] Middleware.ts at root level
- [ ] auth-context.tsx in lib/
- [ ] All auth pages created
- [ ] UI components created
- [ ] Supabase credentials in .env.local
- [ ] Dependencies installed (@supabase/ssr)
- [ ] dev server runs without errors
- [ ] Can navigate to /login and /signup
- [ ] OAuth buttons render on pages

## 🔗 File Cross-References

### Which files use auth-context?
- app/(auth)/login/page.tsx
- app/(auth)/signup/page.tsx
- app/auth/forgot-password/page.tsx
- app/auth/reset-password/page.tsx
- app/dashboard/page.tsx
- Any component using useAuth()

### Which files use supabase client?
- lib/auth-context.tsx
- middleware.ts
- app/auth/callback/route.ts
- API routes

### Which files import UI components?
- app/(auth)/login/page.tsx (Button, Input, Label)
- app/(auth)/signup/page.tsx (Button, Input, Label)
- app/auth/forgot-password/page.tsx (Button, Input)
- app/auth/reset-password/page.tsx (Button, Input)

---

**Component Catalog:** Complete  
**Total Components:** 11  
**Type Safety:** 100% TypeScript  
**Documentation:** Comprehensive
