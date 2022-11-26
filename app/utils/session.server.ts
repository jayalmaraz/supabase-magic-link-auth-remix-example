import { createCookieSessionStorage, redirect } from '@remix-run/node';
import type { EmailOtpType } from '@supabase/supabase-js';
import supabase from './supabase.server';

type LoginForm = {
  email: string;
};

async function login({ email }: LoginForm) {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  if (!data || error) {
    return null;
  }
  return data;
}

type VerifyParams = {
  email: string;
  token: string;
  type: EmailOtpType;
};

async function verify({ email, type, token }: VerifyParams) {
  const { data, error } = await supabase.auth.verifyOtp({ email, type, token });
  const userId = data.user?.id;
  if (error || !userId || typeof userId !== 'string') {
    return null;
  }
  return userId;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'supabase-magic-link-auth-x-remix-session',
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

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
}

async function requireUserId(request: Request) {
  const userId = await getUserId(request);
  if (!userId || typeof userId !== 'string') {
    throw redirect('/');
  }
  return userId;
}

async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

export { login, verify, getUserId, requireUserId, logout, createUserSession };
