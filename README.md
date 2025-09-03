# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Manual test: protected dashboard routes

1. Start the dev server: `npm run dev`.
2. Open a private browser window (or clear app auth cookies/local storage).
3. Navigate to `/dashboard` or any `/dashboard/...` route.
4. You should be redirected to `/login?next=/dashboard` if not authenticated.
5. After successful login the app redirects to `/dashboard`.

If you want a different redirect target, the `RequireAuth` component is at `src/components/auth/RequireAuth.tsx` and the dashboard layout wraps children with it at `src/app/(tabs)/dashboard/layout.tsx`.
