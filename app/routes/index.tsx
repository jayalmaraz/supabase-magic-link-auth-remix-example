import type { ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import supabase from '~/utils/supabase';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return json({ error: 'Form error 💩' });
  }

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return json({ error: 'Supabase error 💩' });
  }

  return redirect('/confirm');
};

export default function Index() {
  const data = useActionData();
  return (
    <div>
      <h1>Supabase Magic Link x Remix</h1>

      <Form method="post">
        <input placeholder="Email" name="email" type="email" />
        <button type="submit">Login</button>
      </Form>

      {data?.error && <p>{data?.error}</p>}
    </div>
  );
}
