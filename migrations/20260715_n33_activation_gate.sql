-- N3.3 — Activation gate + integrity controls
-- (petrolord-suite docs/scope/NextGen-Academy-PLAN.md §3. Doctrine §1
-- "kept from the old policy": orientation step + short entry assessment
-- as a PER-ACCOUNT activation gate; two-device limit; session
-- monitoring; the provided-datasets rule.)
--
-- These controls NEVER EXISTED before (plan §2 "never existed" — this is
-- greenfield, not repair). login_activity is a stray, writer-less feed
-- and student_login_logs is written only by the legacy student hook;
-- neither is reused. Everything here is academy_*-prefixed with
-- commercial-records RLS.
--
-- Enforcement model (doctrine: server-side, never client-only):
--   * The activation gate is folded into academy_has_scope() — the RLS
--     predicate every ported app table will use — so an unactivated
--     account holds entitlements but resolves NO effective scope. Truly
--     RLS-enforced; no ported app can forget the gate.
--   * The two-device limit is enforced in the SECURITY DEFINER
--     device-registration function (the honest ceiling: Supabase JWTs
--     carry no device id, so a per-request RLS predicate cannot see the
--     device — the definer gate + academy_sessions monitoring is the
--     strongest control without an auth proxy; documented as such).
--   * The provided-datasets rule needs NO new mechanism: the
--     learning-scope quota already sets own_data_upload=false (N3.1).
--
-- Q4 (entry-assessment failure policy) is an open owner decision. The
-- mechanism supports both; default is 'advisory' (records a placement,
-- does not hard-block) — owner flips via system_settings.

-- ------------------------------------------------------------- config

-- Reuse the existing system_settings table (super-admin writable,
-- authenticated-readable) for tunable academy knobs.
insert into public.system_settings
    (setting_key, setting_value, setting_type, description, group_name)
values
  ('academy_device_limit', '2', 'number',
   'Maximum concurrent registered devices per learner account.', 'academy'),
  ('academy_entry_assessment_policy', 'advisory', 'string',
   'Entry-assessment failure policy (plan §6 Q4): advisory | hard_gate.', 'academy'),
  ('academy_entry_pass_score', '60', 'number',
   'Percentage required to pass the entry assessment when policy = hard_gate.', 'academy'),
  ('academy_retake_cooldown_hours', '24', 'number',
   'Cooldown before an entry-assessment retake when policy = hard_gate.', 'academy')
on conflict (setting_key) do nothing;

create or replace function public.academy_setting_int(p_key text, p_default integer)
returns integer language sql stable security definer set search_path = public as $$
  select coalesce((select nullif(setting_value,'')::integer
                     from public.system_settings where setting_key = p_key),
                  p_default);
$$;

create or replace function public.academy_setting_text(p_key text, p_default text)
returns text language sql stable security definer set search_path = public as $$
  select coalesce((select nullif(setting_value,'')
                     from public.system_settings where setting_key = p_key),
                  p_default);
$$;

-- ------------------------------------------------------- account state

create table if not exists public.academy_account_state (
    user_id                 uuid primary key
                            references auth.users (id) on delete cascade,
    orientation_completed_at timestamptz,
    entry_assessment_at      timestamptz,
    entry_score              integer,           -- last assessment %, 0-100
    recommended_tier         text
                             check (recommended_tier in ('beginner','intermediate','advanced')),
    retake_after             timestamptz,       -- hard_gate cooldown
    activated_at             timestamptz,       -- gate cleared
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);
comment on table public.academy_account_state is
    'Per-account activation-gate state (orientation + entry assessment). activated_at not null ⇒ the gate is cleared and academy_has_scope() can resolve scope. Commercial record: learner SELECT-own only; written by definer functions.';

-- ------------------------------------------------- entry assessment bank

create table if not exists public.academy_assessment_questions (
    id           uuid primary key default gen_random_uuid(),
    ord          integer not null default 0,
    prompt       text not null,
    options      jsonb not null,                -- ["A","B","C","D"]
    answer_index integer not null,              -- server-side only, never exposed
    active       boolean not null default true,
    created_at   timestamptz not null default now()
);
comment on table public.academy_assessment_questions is
    'Short per-account entry-assessment bank (placement, not a course quiz). answer_index is NEVER sent to the client — questions are read through academy_get_entry_assessment() and graded server-side. Seeded content is PLACEHOLDER — curriculum team tunes.';

-- PLACEHOLDER petroleum-fundamentals placement questions.
insert into public.academy_assessment_questions (ord, prompt, options, answer_index) values
  (1, 'Which log is most directly used to estimate formation porosity?',
      '["Gamma ray","Density/neutron","Caliper","Spontaneous potential"]'::jsonb, 1),
  (2, 'STOIIP stands for:',
      '["Stock-tank oil initially in place","Standard tank oil in production","Static open interval isolation pressure","Sub-surface oil injection index prediction"]'::jsonb, 0),
  (3, 'Archie''s equation is used to compute:',
      '["Permeability","Water saturation","Net pay thickness","Bubble-point pressure"]'::jsonb, 1),
  (4, 'A structural trap is formed primarily by:',
      '["Facies changes","Unconformities","Folding or faulting of strata","Salt dissolution only"]'::jsonb, 2),
  (5, 'The unit "millidarcy" measures:',
      '["Porosity","Permeability","Saturation","Net-to-gross"]'::jsonb, 1)
on conflict do nothing;

-- -------------------------------------------------------------- devices

create table if not exists public.academy_devices (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users (id) on delete cascade,
    device_id   text not null,                 -- client-persisted opaque id
    label       text,
    user_agent  text,
    first_seen  timestamptz not null default now(),
    last_seen   timestamptz not null default now(),
    revoked_at  timestamptz,
    unique (user_id, device_id)
);
comment on table public.academy_devices is
    'Registered devices per learner (two-device limit). Enforced by academy_register_device() (a per-request RLS predicate cannot see the device — the JWT carries none). Learner SELECT-own; written by definer functions only.';
create index if not exists academy_devices_active_idx
    on public.academy_devices (user_id) where revoked_at is null;

-- ------------------------------------------------------- session monitor

create table if not exists public.academy_sessions (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users (id) on delete cascade,
    device_id   text,
    event       text not null
                check (event in ('register','resume','revoke','denied')),
    user_agent  text,
    ip_address  text,
    created_at  timestamptz not null default now()
);
comment on table public.academy_sessions is
    'Session-monitoring feed (login/device events). Learner reads own; admins read all. Append-only via definer functions.';
create index if not exists academy_sessions_user_idx
    on public.academy_sessions (user_id, created_at desc);

-- ---------------------------------------------------------- gate helpers

-- Ensures + returns the caller's account_state row.
create or replace function public.academy_ensure_account_state()
returns public.academy_account_state
language plpgsql security definer set search_path = public as $$
declare v_row public.academy_account_state;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  insert into public.academy_account_state (user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;
  select * into v_row from public.academy_account_state where user_id = auth.uid();
  return v_row;
end $$;

-- Is the account activated? STABLE, used by academy_has_scope().
create or replace function public.academy_is_activated(p_user uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.academy_account_state
                  where user_id = p_user and activated_at is not null);
$$;

-- Recompute activation from the current state + policy. Called after
-- orientation / assessment writes.
create or replace function public.academy_recompute_activation(p_user uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_row    public.academy_account_state;
  v_policy text := public.academy_setting_text('academy_entry_assessment_policy','advisory');
  v_pass   integer := public.academy_setting_int('academy_entry_pass_score', 60);
  v_ok     boolean;
begin
  select * into v_row from public.academy_account_state where user_id = p_user;
  if v_row.user_id is null then return; end if;

  v_ok := v_row.orientation_completed_at is not null
          and v_row.entry_assessment_at is not null
          and (v_policy <> 'hard_gate'
               or coalesce(v_row.entry_score, -1) >= v_pass);

  update public.academy_account_state
     set activated_at = case when v_ok and activated_at is null then now()
                             when v_ok then activated_at
                             else null end,
         updated_at = now()
   where user_id = p_user;
end $$;

-- Orientation step done.
create or replace function public.academy_complete_orientation()
returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  perform public.academy_ensure_account_state();
  update public.academy_account_state
     set orientation_completed_at = coalesce(orientation_completed_at, now()),
         updated_at = now()
   where user_id = auth.uid();
  perform public.academy_recompute_activation(auth.uid());
  return public.academy_activation_status();
end $$;

-- Current gate status for the caller (safe to expose).
create or replace function public.academy_activation_status()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_row public.academy_account_state;
begin
  v_row := public.academy_ensure_account_state();
  return jsonb_build_object(
    'orientation_completed', v_row.orientation_completed_at is not null,
    'assessment_taken',      v_row.entry_assessment_at is not null,
    'entry_score',           v_row.entry_score,
    'recommended_tier',      v_row.recommended_tier,
    'activated',             v_row.activated_at is not null,
    'retake_after',          v_row.retake_after,
    'policy',                public.academy_setting_text('academy_entry_assessment_policy','advisory'));
end $$;

-- Entry-assessment questions WITHOUT the answer key.
create or replace function public.academy_get_entry_assessment()
returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', id, 'ord', ord, 'prompt', prompt, 'options', options)
           order by ord), '[]'::jsonb)
  from public.academy_assessment_questions where active;
$$;

-- Grade + place. p_answers = { "<question_id>": <selected_index>, ... }.
create or replace function public.academy_submit_entry_assessment(p_answers jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_row    public.academy_account_state;
  v_policy text := public.academy_setting_text('academy_entry_assessment_policy','advisory');
  v_pass   integer := public.academy_setting_int('academy_entry_pass_score', 60);
  v_cool   integer := public.academy_setting_int('academy_retake_cooldown_hours', 24);
  v_total  integer;
  v_correct integer;
  v_score  integer;
  v_tier   text;
begin
  v_row := public.academy_ensure_account_state();

  -- Under hard_gate, honour the retake cooldown and don't re-test an
  -- already-activated account.
  if v_policy = 'hard_gate' then
    if v_row.activated_at is not null then
      raise exception 'account already activated';
    end if;
    if v_row.retake_after is not null and now() < v_row.retake_after then
      raise exception 'retake available after %', v_row.retake_after;
    end if;
  end if;

  select count(*) into v_total from public.academy_assessment_questions where active;
  if v_total = 0 then raise exception 'no active assessment questions'; end if;

  select count(*) into v_correct
    from public.academy_assessment_questions q
   where q.active
     and (p_answers ->> q.id::text) is not null
     and (p_answers ->> q.id::text)::integer = q.answer_index;

  v_score := round(100.0 * v_correct / v_total);
  v_tier  := case when v_score >= 80 then 'advanced'
                  when v_score >= 50 then 'intermediate'
                  else 'beginner' end;

  update public.academy_account_state
     set entry_assessment_at = now(),
         entry_score = v_score,
         recommended_tier = v_tier,
         retake_after = case
             when v_policy = 'hard_gate' and v_score < v_pass
             then now() + make_interval(hours => v_cool)
             else null end,
         updated_at = now()
   where user_id = auth.uid();

  perform public.academy_recompute_activation(auth.uid());
  return public.academy_activation_status() || jsonb_build_object(
    'score', v_score, 'correct', v_correct, 'total', v_total);
end $$;

-- ------------------------------------------------------ device controls

-- Register / resume a device under the two-device limit.
create or replace function public.academy_register_device(
    p_device_id  text,
    p_user_agent text default null,
    p_ip         text default null,
    p_label      text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid   uuid := auth.uid();
  v_limit integer := public.academy_setting_int('academy_device_limit', 2);
  v_dev   public.academy_devices;
  v_active integer;
begin
  if v_uid is null then raise exception 'authentication required'; end if;
  if nullif(trim(coalesce(p_device_id,'')),'') is null then
    raise exception 'device id required';
  end if;

  select * into v_dev from public.academy_devices
   where user_id = v_uid and device_id = p_device_id;

  -- known, active → resume
  if v_dev.id is not null and v_dev.revoked_at is null then
    update public.academy_devices
       set last_seen = now(), user_agent = coalesce(p_user_agent, user_agent)
     where id = v_dev.id;
    insert into public.academy_sessions (user_id, device_id, event, user_agent, ip_address)
    values (v_uid, p_device_id, 'resume', p_user_agent, p_ip);
    return jsonb_build_object('status','ok','device_id',p_device_id);
  end if;

  -- new (or previously revoked) device → enforce the limit
  select count(*) into v_active from public.academy_devices
   where user_id = v_uid and revoked_at is null;
  if v_active >= v_limit then
    insert into public.academy_sessions (user_id, device_id, event, user_agent, ip_address)
    values (v_uid, p_device_id, 'denied', p_user_agent, p_ip);
    return jsonb_build_object('status','limit_reached','limit',v_limit,
      'devices', (select coalesce(jsonb_agg(jsonb_build_object(
                    'device_id', device_id, 'label', label,
                    'last_seen', last_seen) order by last_seen desc), '[]'::jsonb)
                  from public.academy_devices
                  where user_id = v_uid and revoked_at is null));
  end if;

  if v_dev.id is not null then
    update public.academy_devices
       set revoked_at = null, last_seen = now(), first_seen = now(),
           user_agent = coalesce(p_user_agent, user_agent),
           label = coalesce(p_label, label)
     where id = v_dev.id;
  else
    insert into public.academy_devices (user_id, device_id, label, user_agent)
    values (v_uid, p_device_id, p_label, p_user_agent);
  end if;
  insert into public.academy_sessions (user_id, device_id, event, user_agent, ip_address)
  values (v_uid, p_device_id, 'register', p_user_agent, p_ip);
  return jsonb_build_object('status','ok','device_id',p_device_id);
end $$;

create or replace function public.academy_revoke_device(p_device_id text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'authentication required'; end if;
  update public.academy_devices
     set revoked_at = now()
   where user_id = v_uid and device_id = p_device_id and revoked_at is null;
  if not found then
    return jsonb_build_object('status','not_found');
  end if;
  insert into public.academy_sessions (user_id, device_id, event)
  values (v_uid, p_device_id, 'revoke');
  return jsonb_build_object('status','revoked','device_id',p_device_id);
end $$;

-- ------------------------------------- fold the gate into has_scope()

-- Redefinition of the N3.1 predicate: an account must be ACTIVATED to
-- resolve any effective scope. Unactivated learners keep their
-- entitlement rows but every ported app table (and frontend flag) reads
-- false until the gate is cleared. Identical ladder logic otherwise.
create or replace function public.academy_has_scope(p_app text, p_min text)
returns boolean
language sql stable security definer set search_path = public as $$
  select public.academy_is_activated(auth.uid())
     and coalesce(
       array_position(array['learning','working','advanced','full'],
                      public.academy_scope(auth.uid(), p_app))
       >= array_position(array['learning','working','advanced','full'], p_min),
       false);
$$;

-- --------------------------------------------------------------- grants

revoke all on function public.academy_activation_status() from public, anon;
grant execute on function public.academy_activation_status() to authenticated;
revoke all on function public.academy_complete_orientation() from public, anon;
grant execute on function public.academy_complete_orientation() to authenticated;
revoke all on function public.academy_get_entry_assessment() from public, anon;
grant execute on function public.academy_get_entry_assessment() to authenticated;
revoke all on function public.academy_submit_entry_assessment(jsonb) from public, anon;
grant execute on function public.academy_submit_entry_assessment(jsonb) to authenticated;
revoke all on function public.academy_register_device(text, text, text, text) from public, anon;
grant execute on function public.academy_register_device(text, text, text, text) to authenticated;
revoke all on function public.academy_revoke_device(text) from public, anon;
grant execute on function public.academy_revoke_device(text) to authenticated;
revoke all on function public.academy_ensure_account_state() from public, anon;
grant execute on function public.academy_ensure_account_state() to authenticated;
-- internal helpers: not client-callable
revoke all on function public.academy_recompute_activation(uuid) from public, anon, authenticated;
revoke all on function public.academy_is_activated(uuid) from public, anon;
grant execute on function public.academy_is_activated(uuid) to authenticated;

-- ------------------------------------------------------------------- RLS

alter table public.academy_account_state        enable row level security;
alter table public.academy_assessment_questions enable row level security;
alter table public.academy_devices              enable row level security;
alter table public.academy_sessions             enable row level security;

-- account_state: learner reads own; admins read all; no client writes.
drop policy if exists "academy_account_state_select_own" on public.academy_account_state;
create policy "academy_account_state_select_own"
    on public.academy_account_state for select using (auth.uid() = user_id);
drop policy if exists "academy_account_state_select_admin" on public.academy_account_state;
create policy "academy_account_state_select_admin"
    on public.academy_account_state for select
    using (public.get_user_role() in ('admin','super_admin'));

-- assessment bank: NO client policies at all — questions (and the answer
-- key) are reachable only through academy_get_entry_assessment(), which
-- omits answer_index. Admins manage via service-role tooling.

-- devices: learner reads own; admins read all; writes via definer fns.
drop policy if exists "academy_devices_select_own" on public.academy_devices;
create policy "academy_devices_select_own"
    on public.academy_devices for select using (auth.uid() = user_id);
drop policy if exists "academy_devices_select_admin" on public.academy_devices;
create policy "academy_devices_select_admin"
    on public.academy_devices for select
    using (public.get_user_role() in ('admin','super_admin'));

-- sessions: learner reads own; admins read all (monitoring surface).
drop policy if exists "academy_sessions_select_own" on public.academy_sessions;
create policy "academy_sessions_select_own"
    on public.academy_sessions for select using (auth.uid() = user_id);
drop policy if exists "academy_sessions_select_admin" on public.academy_sessions;
create policy "academy_sessions_select_admin"
    on public.academy_sessions for select
    using (public.get_user_role() in ('admin','super_admin'));

-- ------------------------------------------------------------- backfill

-- Seed account_state for existing learner accounts (unactivated — they
-- pass through Get Started like everyone else; there are no ported apps
-- to lock yet, so this is inert until N4).
insert into public.academy_account_state (user_id)
select id from public.profiles
 where role in ('learner','student','user')
on conflict (user_id) do nothing;
