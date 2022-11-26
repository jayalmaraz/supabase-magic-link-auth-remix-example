import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { createUserSession, verify } from '../../utils/session.server';

function getUrlParams(url: string) {
  const urlObject = new URL(url);
  const email = urlObject.searchParams.get('email');
  const token = urlObject.searchParams.get('token');

  // ensure that type is present and a correct value
  const type: 'signup' | 'magiclink' | null = urlObject.searchParams.get('type') as any;
  // tiny-invariant makes type narrowing easier
  invariant(type, 'Invalid type');

  // ensure that email and token are present
  if (typeof email !== 'string' || typeof token !== 'string') {
    throw new Error('Bad params');
  }

  return { email, token, type };
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    // get magic link information from URL
    const { email, token, type } = getUrlParams(request.url);

    // verify magic link
    const userId = await verify({ email, token, type });
    if (!userId) {
      throw new Error('Authentication failed');
    }

    // create session from resulting user ID
    return createUserSession(userId, '/profile');
  } catch (e: any) {
    return json({ error: 'Unable to verify magic link 💩' });
  }
};

export default function VerifyPage() {
  const data = useLoaderData();
  return (
    <div>
      <h1>Supabase Magic Link x Remix</h1>
      <p>Verifying, please wait...</p>

      {data?.error && <p>{data?.error}</p>}
    </div>
  );
}
