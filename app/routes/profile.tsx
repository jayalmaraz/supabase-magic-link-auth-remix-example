import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { logout, requireUserId } from '../utils/session.server';

// this should be a separate route so that it can be reused
export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: LoaderFunction = async ({ request }) => {
  // this handles the redirect-on-fail for us
  const userId = await requireUserId(request);
  return json({ userId });
};

export default function ProfilePage() {
  const { userId } = useLoaderData();

  return (
    <div>
      <h1>Supabase Magic Link x Remix</h1>
      <p>You're signed in with user ID: {userId}</p>

      <Form method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
}
