import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getUserId } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    throw redirect('/profile');
  }

  return {};
};

export default function ConfirmPage() {
  return (
    <div>
      <h1>Supabase Magic Link Auth in Remix</h1>
      <p>Check your email</p>
    </div>
  );
}
