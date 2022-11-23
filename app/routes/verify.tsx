import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { createUserSession } from '~/utils/session.server';
import supabase from '~/utils/supabase';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const token = url.searchParams.get('token');
  const type = url.searchParams.get('type') ?? 'magiclink';

  if (typeof token !== 'string' || typeof email !== 'string' || (type !== 'signup' && type !== 'magiclink')) {
    console.log('💩');
    throw redirect('/');
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    type,
    token,
  });

  console.log('Supabase Auth verifyOtp response:', { data, error });
  const userId = data.user?.id;

  if (error || !userId || typeof userId !== 'string') {
    console.log('💩');
    throw redirect('/');
  }

  return createUserSession(userId, '/profile');
};

export default function Auth() {
  return (
    <div>
      <h1>Supabase Magic Link x Remix</h1>
      <p>Verifying...</p>
    </div>
  );
}
