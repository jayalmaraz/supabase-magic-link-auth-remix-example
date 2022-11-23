import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { createUserSession } from '~/utils/session.server';
import supabase from '~/utils/supabase';

function getUrlParams(url: string) {
  const urlObject = new URL(url);
  const email = urlObject.searchParams.get('email');
  const token = urlObject.searchParams.get('token');
  const type = urlObject.searchParams.get('type') ?? 'magiclink';

  if (typeof token !== 'string' || typeof email !== 'string' || (type !== 'signup' && type !== 'magiclink')) {
    console.log('Url params error 💩');
    throw redirect('/');
  }

  return {
    email,
    token,
    type: type as 'signup' | 'magiclink',
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const { email, token, type } = getUrlParams(request.url);

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    type,
    token,
  });

  const userId = data.user?.id;

  if (error || !userId || typeof userId !== 'string') {
    console.log('Supabase error 💩');
    throw redirect('/');
  }

  return createUserSession(userId, '/profile');
};

export default function Auth() {
  return (
    <div>
      <h1>Supabase Magic Link x Remix</h1>
      <p>Verifying... please wait</p>
    </div>
  );
}
