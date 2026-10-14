import { describe, it, expect, vi } from 'vitest';
import { createHandler, type CreateAdminDeps } from './handler.ts';

const roles: Record<string, string> = { boss: 'super_admin', adm: 'admin', lrn: 'learner', top: 'super_admin' };
const tokens: Record<string, string> = { 'Bearer boss': 'boss', 'Bearer adm': 'adm', 'Bearer lrn': 'lrn' };

function deps(over: Partial<CreateAdminDeps> = {}) {
  return {
    getUser: vi.fn(async (h: string) => (tokens[h] ? { id: tokens[h] } : null)),
    getProfileRole: vi.fn(async (id: string) => roles[id] ?? null),
    findUserByEmail: vi.fn(async (email: string) =>
      email === 'old@x.com' ? { id: 'old', user_metadata: { display_name: 'Old' } }
        : email === 'top@x.com' ? { id: 'top', user_metadata: {} } : null),
    setMetadataRole: vi.fn(async () => {}),
    sendPasswordReset: vi.fn(async () => {}),
    invite: vi.fn(async () => 'new-id'),
    upsertProfile: vi.fn(async () => {}),
    audit: vi.fn(async () => {}),
    now: () => '2026-10-14T00:00:00.000Z',
    ...over,
  };
}
const post = (body: unknown, auth?: string) =>
  new Request('https://fn.local/create-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: auth } : {}) },
    body: JSON.stringify(body),
  });
const writes = (d: ReturnType<typeof deps>) =>
  d.setMetadataRole.mock.calls.length + d.invite.mock.calls.length + d.upsertProfile.mock.calls.length
  + d.sendPasswordReset.mock.calls.length;

describe('create-admin caller check (fails closed)', () => {
  it('401 without an Authorization header, and writes nothing', async () => {
    const d = deps();
    const res = await createHandler(d)(post({ email: 'a@x.com' }));
    expect(res.status).toBe(401);
    expect(writes(d)).toBe(0);
  });

  it('401 when the token does not resolve to a user', async () => {
    const d = deps();
    expect((await createHandler(d)(post({ email: 'a@x.com' }, 'Bearer forged'))).status).toBe(401);
    expect(writes(d)).toBe(0);
  });

  it('401 when getUser throws', async () => {
    const d = deps({ getUser: vi.fn(async () => { throw new Error('boom'); }) });
    expect((await createHandler(d)(post({ email: 'a@x.com' }, 'Bearer boss'))).status).toBe(401);
    expect(writes(d)).toBe(0);
  });

  it.each(['Bearer lrn', 'Bearer adm'])('403 for a non super_admin caller (%s), the self-promotion hole', async (auth) => {
    const d = deps();
    const res = await createHandler(d)(post({ email: 'lrn@x.com' }, auth));
    expect(res.status).toBe(403);
    expect(writes(d)).toBe(0);
    expect(d.findUserByEmail).not.toHaveBeenCalled();
  });

  it('403 when the role lookup fails', async () => {
    const d = deps({ getProfileRole: vi.fn(async () => { throw new Error('db down'); }) });
    expect((await createHandler(d)(post({ email: 'a@x.com' }, 'Bearer boss'))).status).toBe(403);
    expect(writes(d)).toBe(0);
  });
});

describe('create-admin for a super_admin caller', () => {
  it('400 without a valid email', async () => {
    const d = deps();
    expect((await createHandler(d)(post({ email: 'nope' }, 'Bearer boss'))).status).toBe(400);
    expect(writes(d)).toBe(0);
  });

  it('invites an unknown email and writes the admin profile', async () => {
    const d = deps();
    const res = await createHandler(d)(post({ email: 'New@X.com', name: 'New Admin', redirectUrl: 'https://a/reset-password' }, 'Bearer boss'));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ success: true, userId: 'new-id', isExistingUser: false });
    expect(d.invite).toHaveBeenCalledWith('new@x.com', { role: 'admin', display_name: 'New Admin' }, 'https://a/reset-password');
    expect(d.upsertProfile).toHaveBeenCalledWith(expect.objectContaining({ id: 'new-id', role: 'admin', email: 'new@x.com' }));
    expect(d.audit).toHaveBeenCalledWith(expect.objectContaining({ user_id: 'boss', action: 'CREATE_ADMIN' }));
  });

  it('promotes an existing user and sends a reset', async () => {
    const d = deps();
    const res = await createHandler(d)(post({ email: 'old@x.com' }, 'Bearer boss'));
    expect(res.status).toBe(200);
    expect(d.setMetadataRole).toHaveBeenCalledWith({ id: 'old', user_metadata: { display_name: 'Old' } }, 'admin');
    expect(d.sendPasswordReset).toHaveBeenCalledWith('old@x.com', undefined);
    expect(d.invite).not.toHaveBeenCalled();
  });

  it('409 and no writes when the target is a super_admin', async () => {
    const d = deps();
    expect((await createHandler(d)(post({ email: 'top@x.com' }, 'Bearer boss'))).status).toBe(409);
    expect(writes(d)).toBe(0);
  });

  it('405 for GET, 200 for the CORS preflight', async () => {
    const h = createHandler(deps());
    expect((await h(new Request('https://fn.local/create-admin'))).status).toBe(405);
    expect((await h(new Request('https://fn.local/create-admin', { method: 'OPTIONS' }))).status).toBe(200);
  });
});
