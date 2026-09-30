// @vitest-environment jsdom
// Batch 6B behaviour pins for the public and auth pages. The restyle onto
// the public frame changes the look only, so these tests were written
// against the pages as they were and pass unchanged before and after it.
// They pin the exact payloads the pages send: signInWithPassword, signUp
// (its metadata, and the absence of a redirect and of any role),
// resetPasswordForEmail with its redirect, updateUser, the reset-password
// edge function (check and reset) and the academy_verify_certificate RPC,
// plus where each flow navigates. The Supabase client is a stand-in that
// throws on anything else, and fetch is counted and asserted unused.
//
// NextGen has no auth callback, invite, sponsor code or bridge code page
// outside the signed-in dashboard: those flows live on /dashboard/enroll and
// /dashboard/certificates (batch 2A).
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, cleanup, configure, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { installDomShims } from '@/design/testing/domShims';

const h = vi.hoisted(() => ({}));

vi.mock('@/lib/customSupabaseClient', async () => {
  const { publicAuthSupabase } = await import('./publicAuthStubs');
  return publicAuthSupabase(h);
});

const { freshHandlers } = await import('./publicAuthStubs');
const { mountPublic } = await import('./publicAuthHarness');
const { default: LoginPage } = await import('@/pages/LoginPage');
const { default: RegisterPage } = await import('@/pages/RegisterPage');
const { default: PasswordResetPage } = await import('@/pages/PasswordResetPage');
const { default: ResetPasswordPage } = await import('@/pages/ResetPasswordPage');
const { default: VerifyCertificatePage } = await import('@/pages/VerifyCertificatePage');
const { default: NotFoundPage } = await import('@/pages/NotFoundPage');

configure({ asyncUtilTimeout: 8000 });
vi.setConfig({ testTimeout: 30000 });

const type = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const elsewhere = async () => (await screen.findByTestId('elsewhere')).textContent;

let fetchSpy;
beforeAll(installDomShims);
beforeEach(() => {
  Object.assign(h, freshHandlers());
  fetchSpy = vi.fn(async () => { throw new Error('network is off in the 6B tests'); });
  vi.stubGlobal('fetch', fetchSpy);
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  expect(fetchSpy).not.toHaveBeenCalled();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('sign in', () => {
  const fill = async () => {
    mountPublic(LoginPage, '/login');
    await screen.findByText('Sign in to your account');
    type('Email address', 'ada@example.com');
    type('Password', 'S3cret!pw');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  };

  it('sends exactly the email and password, then goes to the dashboard', async () => {
    h.signInWithPassword = vi.fn(async () => ({ data: { user: { id: 'u1' } }, error: null }));
    await fill();
    expect(await elsewhere()).toBe('/dashboard');
    expect(h.signInWithPassword).toHaveBeenCalledTimes(1);
    expect(h.signInWithPassword).toHaveBeenCalledWith({ email: 'ada@example.com', password: 'S3cret!pw' });
  });

  it('shows the worded error for wrong credentials and stays on the page', async () => {
    h.signInWithPassword = vi.fn(async () => ({ data: null, error: { message: 'Invalid login credentials' } }));
    await fill();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Incorrect email or password. Please check your credentials.');
    expect(screen.queryByTestId('elsewhere')).toBeNull();
    expect(screen.getByRole('button', { name: 'Sign in' })).not.toBeDisabled();
  });

  it('shows the worded error for an unconfirmed email', async () => {
    h.signInWithPassword = vi.fn(async () => ({ data: null, error: { message: 'Email not confirmed' } }));
    await fill();
    expect(await screen.findByRole('alert')).toHaveTextContent('Please verify your email address before logging in.');
  });

  it('requires both fields before it calls Supabase', async () => {
    h.signInWithPassword = vi.fn();
    mountPublic(LoginPage, '/login');
    await screen.findByText('Sign in to your account');
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form'));
    await screen.findByText('Email is required');
    expect(screen.getByText('Password is required')).toBeTruthy();
    expect(h.signInWithPassword).not.toHaveBeenCalled();
  });

  it('links to the forgot password and register pages', async () => {
    mountPublic(LoginPage, '/login');
    await screen.findByText('Sign in to your account');
    expect(screen.getByRole('link', { name: 'Forgot your password?' })).toHaveAttribute('href', '/forgot-password');
    expect(screen.getByRole('link', { name: 'Create an account' })).toHaveAttribute('href', '/register');
  });

  it('sends a signed-in visitor straight to the dashboard', async () => {
    h.session = { user: { id: 'u1', email: 'ada@example.com' } };
    h.profile = { id: 'u1', role: 'learner' };
    mountPublic(LoginPage, '/login');
    expect(await elsewhere()).toBe('/dashboard');
  });
});

describe('register (one identity: a personal email, no role from the client)', () => {
  const fill = async ({ confirm = 'Str0ng!pass' } = {}) => {
    mountPublic(RegisterPage, '/register');
    await screen.findByText('Create your account');
    type('Full name', 'Ada Obi');
    type('Personal email address', 'ada@example.com');
    type('Password', 'Str0ng!pass');
    type('Confirm password', confirm);
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
  };

  it('signUp carries the email, the password and only display_name as metadata', async () => {
    h.signUp = vi.fn(async () => ({ data: { user: { id: 'new' }, session: null }, error: null }));
    await fill();
    await screen.findByText('Confirm your email');
    expect(h.signUp).toHaveBeenCalledTimes(1);
    // toHaveBeenCalledWith is an exact match: no emailRedirectTo, no role.
    expect(h.signUp).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'Str0ng!pass',
      options: { data: { display_name: 'Ada Obi' } },
    });
    expect(screen.getByRole('link', { name: 'sign in' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: 'Create account' })).toBeNull();
  });

  it('goes to the enrollment doors when sign-up returns a session', async () => {
    h.signUp = vi.fn(async () => ({ data: { user: { id: 'new' }, session: { access_token: 't' } }, error: null }));
    await fill();
    expect(await elsewhere()).toBe('/dashboard/enroll');
  });

  it('words the already-registered error', async () => {
    h.signUp = vi.fn(async () => ({ data: null, error: { message: 'User already registered' } }));
    await fill();
    expect(await screen.findByRole('alert')).toHaveTextContent('An account with this email already exists. Try signing in instead.');
  });

  it('stops a password mismatch and a short password before Supabase', async () => {
    h.signUp = vi.fn();
    await fill({ confirm: 'different' });
    await screen.findByText('Passwords do not match');
    type('Password', 'short');
    type('Confirm password', 'short');
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    await screen.findByText('At least 8 characters');
    expect(h.signUp).not.toHaveBeenCalled();
  });
});

describe('forgot password', () => {
  it('asks for the reset link with the /reset-password redirect', async () => {
    h.resetPasswordForEmail = vi.fn(async () => ({ data: {}, error: null }));
    mountPublic(PasswordResetPage, '/forgot-password');
    await screen.findByText('Step 1: Identify Account');
    type('Email Address', 'ada@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));
    await screen.findByText('Reset Link Sent');
    expect(h.resetPasswordForEmail).toHaveBeenCalledTimes(1);
    expect(h.resetPasswordForEmail).toHaveBeenCalledWith('ada@example.com', {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    expect(screen.getByText(/We've sent a link to ada@example.com/)).toBeTruthy();
  });

  it('takes the email from the query string', async () => {
    mountPublic(PasswordResetPage, '/forgot-password?email=ada%40example.com');
    await screen.findByText('Step 1: Identify Account');
    expect(screen.getByLabelText('Email Address')).toHaveValue('ada@example.com');
  });

  it('refuses a malformed email before Supabase', async () => {
    h.resetPasswordForEmail = vi.fn();
    mountPublic(PasswordResetPage, '/forgot-password');
    await screen.findByText('Step 1: Identify Account');
    type('Email Address', 'not-an-email');
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please enter a valid email address.');
    expect(h.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it('shows the Supabase error when the link cannot be sent', async () => {
    h.resetPasswordForEmail = vi.fn(async () => ({ data: null, error: { message: 'Rate limit exceeded' } }));
    mountPublic(PasswordResetPage, '/forgot-password');
    await screen.findByText('Step 1: Identify Account');
    type('Email Address', 'ada@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Rate limit exceeded');
  });

  it('with a recovery session: updateUser gets only the new password, then login', async () => {
    h.session = { user: { id: 'u1', email: 'ada@example.com' } };
    h.profile = { id: 'u1', role: 'learner' };
    h.updateUser = vi.fn(async () => ({ data: {}, error: null }));
    mountPublic(PasswordResetPage, '/forgot-password');
    await screen.findByText('Step 2: Create New Password');
    expect(screen.getByLabelText('Email Address')).toHaveValue('ada@example.com');
    expect(screen.getByLabelText('Email Address')).toBeDisabled();
    const update = screen.getByRole('button', { name: 'Update Password' });
    expect(update).toBeDisabled();
    type('New Password', 'N3w!password');
    type('Confirm Password', 'N3w!password');
    await waitFor(() => expect(update).not.toBeDisabled());
    expect(screen.getByText('100%')).toBeTruthy();
    fireEvent.click(update);
    await screen.findByText('Password Reset Complete');
    expect(h.updateUser).toHaveBeenCalledTimes(1);
    expect(h.updateUser).toHaveBeenCalledWith({ password: 'N3w!password' });
    fireEvent.click(screen.getByRole('button', { name: 'Go to Login Now' }));
    expect(await elsewhere()).toBe('/login');
  });

  it('with a recovery session: a weak or mismatched password keeps the button disabled', async () => {
    h.session = { user: { id: 'u1', email: 'ada@example.com' } };
    h.updateUser = vi.fn();
    mountPublic(PasswordResetPage, '/forgot-password');
    await screen.findByText('Step 2: Create New Password');
    type('New Password', 'weak');
    type('Confirm Password', 'weak');
    await screen.findByText('20%');
    expect(screen.getByRole('button', { name: 'Update Password' })).toBeDisabled();
    type('Confirm Password', 'other');
    await screen.findByText('Passwords do not match');
    expect(h.updateUser).not.toHaveBeenCalled();
  });

  it('Back to Login goes to /login', async () => {
    mountPublic(PasswordResetPage, '/forgot-password');
    await screen.findByText('Step 1: Identify Account');
    fireEvent.click(screen.getByRole('button', { name: 'Back to Login' }));
    expect(await elsewhere()).toBe('/login');
  });
});

describe('reset password (the reset-password edge function)', () => {
  it('checks the token, then resets with the token and the new password', async () => {
    h.invoke = vi.fn(async (_name, { body }) => (body.action === 'check'
      ? { data: { success: true, email: 'admin@uni.example' }, error: null }
      : { data: { success: true }, error: null }));
    mountPublic(ResetPasswordPage, '/reset-password?token=tok-1');
    await screen.findByText('admin@uni.example');
    expect(h.invoke).toHaveBeenCalledTimes(1);
    expect(h.invoke).toHaveBeenCalledWith('reset-password', { body: { action: 'check', token: 'tok-1' } });
    type('New Password', 'N3w!password');
    type('Confirm Password', 'N3w!password');
    await screen.findByText('Strong');
    fireEvent.click(screen.getByRole('button', { name: 'Set Password & Login' }));
    await screen.findByText('Password Set Successfully!');
    expect(h.invoke).toHaveBeenCalledTimes(2);
    expect(h.invoke).toHaveBeenLastCalledWith('reset-password', {
      body: { action: 'reset', token: 'tok-1', new_password: 'N3w!password' },
    });
    expect(screen.getByRole('link', { name: 'Go to Login Now' })).toHaveAttribute('href', '/login');
  });

  it('without a token it never calls the function and offers the way back', async () => {
    h.invoke = vi.fn();
    mountPublic(ResetPasswordPage, '/reset-password');
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid reset link. Token is missing.');
    expect(h.invoke).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Return to Login' })).toHaveAttribute('href', '/login');
    expect(screen.queryByLabelText('New Password')).toBeNull();
  });

  // Flow A, the self-serve recovery email. /forgot-password asks Supabase to
  // send the visitor back to /reset-password, and the Supabase client turns
  // that link into a session. There is no ?token=, so the page must take the
  // session and save the new password with updateUser. The edge function is
  // for the token link only and is never called here.
  it('a Supabase recovery landing shows the password form and saves with updateUser', async () => {
    h.session = { user: { id: 'u1', email: 'ada@example.com' } };
    h.profile = { id: 'u1', role: 'learner' };
    h.invoke = vi.fn();
    h.updateUser = vi.fn(async () => ({ data: {}, error: null }));
    mountPublic(ResetPasswordPage, '/reset-password');
    await screen.findByText('ada@example.com');
    expect(screen.queryByText('Invalid reset link. Token is missing.')).toBeNull();
    expect(screen.getByText('Choose a new password for your account.')).toBeTruthy();
    type('New Password', 'N3w!password');
    type('Confirm Password', 'N3w!password');
    await screen.findByText('Strong');
    fireEvent.click(screen.getByRole('button', { name: 'Set Password & Login' }));
    await screen.findByText('Password Set Successfully!');
    expect(h.updateUser).toHaveBeenCalledTimes(1);
    expect(h.updateUser).toHaveBeenCalledWith({ password: 'N3w!password' });
    expect(h.invoke).not.toHaveBeenCalled();
    expect(screen.getByText(/Your new password is saved\./)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Go to Login Now' })).toHaveAttribute('href', '/login');
  });

  it('a recovery landing shows the Supabase error and keeps the form', async () => {
    h.session = { user: { id: 'u1', email: 'ada@example.com' } };
    h.invoke = vi.fn();
    h.updateUser = vi.fn(async () => ({ data: null, error: { message: 'New password should be different from the old password.' } }));
    mountPublic(ResetPasswordPage, '/reset-password');
    await screen.findByText('ada@example.com');
    type('New Password', 'N3w!password');
    type('Confirm Password', 'N3w!password');
    fireEvent.click(screen.getByRole('button', { name: 'Set Password & Login' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('New password should be different from the old password.');
    expect(screen.getByLabelText('New Password')).toBeTruthy();
    expect(h.invoke).not.toHaveBeenCalled();
  });

  it('a recovery landing stops a mismatch before updateUser', async () => {
    h.session = { user: { id: 'u1', email: 'ada@example.com' } };
    h.updateUser = vi.fn();
    mountPublic(ResetPasswordPage, '/reset-password');
    await screen.findByText('ada@example.com');
    type('New Password', 'N3w!password');
    type('Confirm Password', 'nope');
    fireEvent.click(screen.getByRole('button', { name: 'Set Password & Login' }));
    await screen.findByText('Passwords do not match');
    expect(h.updateUser).not.toHaveBeenCalled();
  });

  it('a token link wins over a session: the edge function flow is unchanged', async () => {
    h.session = { user: { id: 'u1', email: 'ada@example.com' } };
    h.updateUser = vi.fn();
    h.invoke = vi.fn(async (_name, { body }) => (body.action === 'check'
      ? { data: { success: true, email: 'admin@uni.example' }, error: null }
      : { data: { success: true }, error: null }));
    mountPublic(ResetPasswordPage, '/reset-password?token=tok-1');
    await screen.findByText('admin@uni.example');
    expect(screen.queryByText('Choose a new password for your account.')).toBeNull();
    type('New Password', 'N3w!password');
    type('Confirm Password', 'N3w!password');
    fireEvent.click(screen.getByRole('button', { name: 'Set Password & Login' }));
    await screen.findByText('Password Set Successfully!');
    expect(h.invoke).toHaveBeenLastCalledWith('reset-password', {
      body: { action: 'reset', token: 'tok-1', new_password: 'N3w!password' },
    });
    expect(h.updateUser).not.toHaveBeenCalled();
    expect(screen.getByText(/Your account is now active\./)).toBeTruthy();
  });

  it('an expired recovery link offers a new link and never shows the form', async () => {
    h.invoke = vi.fn();
    window.location.hash = '#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired';
    try {
      mountPublic(ResetPasswordPage, '/reset-password');
      expect(await screen.findByRole('alert')).toHaveTextContent('This reset link has expired or was already used. Request a new link to continue.');
      expect(screen.getByRole('link', { name: 'Request a new link' })).toHaveAttribute('href', '/forgot-password');
      expect(screen.getByRole('link', { name: 'Return to Login' })).toHaveAttribute('href', '/login');
      expect(screen.queryByLabelText('New Password')).toBeNull();
      expect(h.invoke).not.toHaveBeenCalled();
    } finally {
      window.location.hash = '';
    }
  });

  it('shows the function\'s reason for a rejected token', async () => {
    h.invoke = vi.fn(async () => ({ data: { success: false, error: 'This link has expired.' }, error: null }));
    mountPublic(ResetPasswordPage, '/reset-password?token=old');
    expect(await screen.findByRole('alert')).toHaveTextContent('This link has expired.');
    expect(screen.queryByLabelText('New Password')).toBeNull();
  });

  it('shows a failed reset and keeps the form', async () => {
    h.invoke = vi.fn(async (_name, { body }) => (body.action === 'check'
      ? { data: { success: true, email: 'admin@uni.example' }, error: null }
      : { data: { success: false, error: 'Password too common.' }, error: null }));
    mountPublic(ResetPasswordPage, '/reset-password?token=tok-1');
    await screen.findByText('admin@uni.example');
    type('New Password', 'N3w!password');
    type('Confirm Password', 'N3w!password');
    fireEvent.click(screen.getByRole('button', { name: 'Set Password & Login' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Password too common.');
    expect(screen.getByLabelText('New Password')).toBeTruthy();
  });

  it('stops a mismatch before the reset call', async () => {
    h.invoke = vi.fn(async () => ({ data: { success: true, email: 'admin@uni.example' }, error: null }));
    mountPublic(ResetPasswordPage, '/reset-password?token=tok-1');
    await screen.findByText('admin@uni.example');
    type('New Password', 'N3w!password');
    type('Confirm Password', 'nope');
    fireEvent.click(screen.getByRole('button', { name: 'Set Password & Login' }));
    await screen.findByText('Passwords do not match');
    expect(h.invoke).toHaveBeenCalledTimes(1);
  });
});

describe('certificate verify (anon RPC, keyed on the verify code)', () => {
  const CERT = {
    status: 'valid',
    certificate_number: 'PLA-2026-000123',
    holder: 'Ada Obi',
    app_slug: 'petrophysics',
    course_name: 'Petrophysics',
    course_type: 'app',
    tier: 'associate',
    issued_at: '2026-03-01T00:00:00Z',
    valid_until: '2027-03-01T00:00:00Z',
  };

  it('verifies the code in the path', async () => {
    h.rpc = vi.fn(async () => ({ data: CERT, error: null }));
    mountPublic(VerifyCertificatePage, '/verify/abc123', '/verify/:code');
    await screen.findByText('Valid certificate');
    expect(h.rpc).toHaveBeenCalledTimes(1);
    expect(h.rpc).toHaveBeenCalledWith('academy_verify_certificate', { p_verify_code: 'abc123' });
    expect(screen.getByText('PLA-2026-000123')).toBeTruthy();
    expect(screen.getByText('Ada Obi')).toBeTruthy();
    expect(screen.getByText('Associate')).toBeTruthy();
  });

  it('verifies the ?code query', async () => {
    h.rpc = vi.fn(async () => ({ data: { ...CERT, status: 'expired' }, error: null }));
    mountPublic(VerifyCertificatePage, '/verify?code=q-77');
    await screen.findByText('Certificate expired');
    expect(h.rpc).toHaveBeenCalledWith('academy_verify_certificate', { p_verify_code: 'q-77' });
  });

  it('verifies a typed code, trimmed, on Enter, and words a revoked certificate', async () => {
    h.rpc = vi.fn(async () => ({ data: { ...CERT, status: 'revoked' }, error: null }));
    mountPublic(VerifyCertificatePage, '/verify');
    const input = await screen.findByPlaceholderText('Verification code');
    expect(h.rpc).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: '  typed-9 ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await screen.findByText('Certificate revoked');
    expect(h.rpc).toHaveBeenCalledWith('academy_verify_certificate', { p_verify_code: 'typed-9' });
  });

  it('says no certificate was found for an unknown code and for an RPC error', async () => {
    h.rpc = vi.fn(async () => ({ data: null, error: null }));
    mountPublic(VerifyCertificatePage, '/verify/unknown', '/verify/:code');
    await screen.findByText('No certificate found');
    cleanup();
    h.rpc = vi.fn(async () => ({ data: null, error: { message: 'boom' } }));
    mountPublic(VerifyCertificatePage, '/verify/unknown', '/verify/:code');
    await screen.findByText('No certificate found');
  });

  it('marks a practice course', async () => {
    h.rpc = vi.fn(async () => ({ data: { ...CERT, course_type: 'practice' }, error: null }));
    mountPublic(VerifyCertificatePage, '/verify/abc123', '/verify/:code');
    await screen.findByText('Valid certificate');
    expect(document.querySelector('[data-course-type="practice"]')).not.toBeNull();
  });
});

describe('not found', () => {
  it('offers the dashboard', async () => {
    mountPublic(NotFoundPage, '/no-such-page');
    await screen.findByText('Page Not Found');
    fireEvent.click(screen.getByRole('button', { name: 'Go to Dashboard' }));
    expect(await elsewhere()).toBe('/dashboard');
  });

  it('offers the way back', async () => {
    mountPublic(NotFoundPage, '/no-such-page');
    expect(await screen.findByRole('button', { name: 'Go Back' })).toBeTruthy();
  });
});

// Wave 7: copy that contradicted the one-identity doctrine (a personal email
// is the account; a university email is only a Campus verification
// attribute). Copy only: the flows above are unchanged.
describe('one identity copy (wave 7)', () => {
  it('the login page is titled Petrolord NextGen', async () => {
    mountPublic(LoginPage, '/login');
    await screen.findByText('Sign in to your account');
    await waitFor(() => expect(document.title).toBe('Login - Petrolord NextGen'));
    expect(document.title).not.toMatch(/Suite/);
  });

  it('the forgot password email placeholder names no university', async () => {
    mountPublic(PasswordResetPage, '/forgot-password');
    await screen.findByText('Step 1: Identify Account');
    const input = screen.getByLabelText('Email Address');
    expect(input.getAttribute('placeholder')).toBe('you@example.com');
    expect(document.body.innerHTML).not.toMatch(/university/i);
  });

  it('the set password page speaks of your account, with no university admin', async () => {
    h.invoke = vi.fn(async () => ({ data: { success: true, email: 'ada@example.com' }, error: null }));
    mountPublic(ResetPasswordPage, '/reset-password?token=tok-1');
    await screen.findByText('ada@example.com');
    expect(screen.getByText('Create a secure password to activate your account.')).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/university|admin account/i);
  });
});
