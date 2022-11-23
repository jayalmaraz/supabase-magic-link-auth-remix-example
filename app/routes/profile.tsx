import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { getUserId, logout } from '~/utils/session.server';

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    console.log('💩');
    throw redirect('/');
  }

  return json({ userId });
};

export default function ProfilePage() {
  const { userId } = useLoaderData();

  return (
    <div>
      <h1>Supabase Magic Link x Remix</h1>
      <h2>Profile</h2>
      <p>
        You're signed in with user ID: <code>{userId}</code>
      </p>
      <Form method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
}
