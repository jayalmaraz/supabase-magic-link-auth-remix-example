import { createCookieSessionStorage, redirect } from '@remix-run/node';

const REDIRECT_UNAUTHORIZED = '/';
const REDIRECT_AUTHORIZED = '/profile';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'app_session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

async function createUserSession(userId: string, redirectTo: string = REDIRECT_AUTHORIZED) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
}

/**
 * Clear the active session and redirect
 * @returns Redirect
 */
async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect(REDIRECT_UNAUTHORIZED, {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

export { createUserSession, getUserId, logout };
