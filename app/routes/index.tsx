import type { ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { login } from '../utils/session.server';

export const action: ActionFunction = async ({ request }) => {
  // get the email value from the sign in form
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return json({ error: 'Form error 💩' });
  }

  // sign in with email
  const data = await login({ email });

  if (!data) {
    return json({ error: 'Supabase error 💩' });
  }

  // redirect to "check your email" screen
  return redirect('/auth/confirm');
};

export default function Index() {
  const data = useActionData();
  return (
    <div>
      <h1>Supabase Magic Link x Remix</h1>

      <Form method="post">
        <input name="email" placeholder="Email Address" type="email" />
        <button type="submit">Login/Create account</button>
      </Form>

      {data?.error && <p>{data?.error}</p>}
    </div>
  );
}
