-- N4 — First course on the spine: Petrophysics Beginner capstone
-- (petrolord-suite docs/scope/NextGen-Academy-PLAN.md §3. Doctrine §1:
-- "The teaching datasets ARE the validation golden files, so every
-- practical has a machine-checkable right answer ... auto-graded against
-- oracle truth within stated tolerance." Auto-graded practicals at scale
-- = the moat.)
--
-- The learner drives the Petrophysics engine (@petrolord/engines,
-- consumed via subtree) over the bundled typewell teaching dataset in
-- Learning Mode, then submits a computed net-pay summary. Grading is
-- SERVER-SIDE against an oracle answer key stored here (the goldens
-- ZONES summaries) — the client cannot read the key or forge a pass.
-- On pass, an Associate certification is auto-issued (which grants
-- 'working' scope via the N3.1 certification→entitlement trigger),
-- proving the Learning Mode → certified loop end to end.

-- ------------------------------------------------------------- capstones

create table if not exists public.academy_capstones (
    app_slug   text not null,
    tier       text not null
               check (tier in ('beginner','intermediate','advanced')),
    cert_tier  text not null
               check (cert_tier in ('associate','professional','expert')),
    dataset    text not null,             -- teaching dataset id (client loads it)
    title      text not null,
    prompt     text not null,
    -- fields: [{key,label,unit,expected,tol}] — expected/tol are the
    -- ORACLE ANSWER KEY, never sent to the client.
    fields     jsonb not null,
    active     boolean not null default true,
    primary key (app_slug, tier)
);
comment on table public.academy_capstones is
    'Auto-graded practical capstones. fields[].expected/tol are the oracle answer key (from the validation goldens) — NO client SELECT policy; the client reads only labels via academy_get_capstone() and submits via academy_submit_capstone(), graded server-side.';

-- Petrophysics Beginner capstone — net pay of SAND_A / SAND_B on the
-- typewell teaching dataset. expected values are the goldens.json ZONES
-- summaries (the same oracle the engine validates against); tolerances
-- are set to the 0.5 m sample step for thickness and tight bands for the
-- volume-weighted averages.
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values (
  'petrophysics', 'beginner', 'associate',
  'petrophysics/typewell',
  'Net pay of the typewell reservoir sands',
  'Using the provided GR / RHOB / RT logs and the given parameters, compute Vsh (Larionov tertiary), density porosity, Archie water saturation and apply the cutoffs to report the net-pay summary for SAND_A (2010–2030 m) and SAND_B (2050–2080 m).',
  jsonb_build_array(
    jsonb_build_object('key','sand_a_net_m','label','SAND_A net pay','unit','m','expected',18.0,'tol',0.75),
    jsonb_build_object('key','sand_a_phi_avg','label','SAND_A average porosity','unit','v/v','expected',0.20805198865869562,'tol',0.01),
    jsonb_build_object('key','sand_a_sw_avg','label','SAND_A average Sw','unit','v/v','expected',0.361262643786335,'tol',0.02),
    jsonb_build_object('key','sand_b_net_m','label','SAND_B net pay','unit','m','expected',5.5,'tol',0.75),
    jsonb_build_object('key','sand_b_phi_avg','label','SAND_B average porosity','unit','v/v','expected',0.1417010751338701,'tol',0.01),
    jsonb_build_object('key','sand_b_sw_avg','label','SAND_B average Sw','unit','v/v','expected',0.5423153983883204,'tol',0.02)
  ))
on conflict (app_slug, tier) do nothing;

-- --------------------------------------------------------- attempts log

create table if not exists public.academy_capstone_attempts (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users (id) on delete cascade,
    app_slug    text not null,
    tier        text not null,
    score       integer not null,         -- fields passed, 0..N
    max_score   integer not null,
    passed      boolean not null,
    answers     jsonb,                    -- what the learner submitted
    created_at  timestamptz not null default now()
);
comment on table public.academy_capstone_attempts is
    'Capstone submissions (progress + integrity trail). Learner SELECT-own; written only by academy_submit_capstone().';
create index if not exists academy_capstone_attempts_user_idx
    on public.academy_capstone_attempts (user_id, app_slug);

-- ---------------------------------------------------------- read (safe)

-- Capstone brief WITHOUT the answer key (labels/units only).
create or replace function public.academy_get_capstone(p_app text, p_tier text)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app_slug', c.app_slug, 'tier', c.tier, 'cert_tier', c.cert_tier,
    'dataset', c.dataset, 'title', c.title, 'prompt', c.prompt,
    'fields', (select jsonb_agg(jsonb_build_object(
                 'key', f->>'key', 'label', f->>'label', 'unit', f->>'unit')
               order by ord)
               from jsonb_array_elements(c.fields) with ordinality as t(f, ord)))
  from public.academy_capstones c
  where c.app_slug = p_app and c.tier = p_tier and c.active;
$$;

-- ------------------------------------------------------------ grading

-- Map an app_slug to its course id (best-effort; certs tolerate null).
create or replace function public.academy_course_for_app(p_app text)
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.courses
   where lower(title) like '%' || p_app || '%'
      or lower(coalesce(category,'')) like '%' || p_app || '%'
   limit 1;
$$;

-- Grade a capstone submission server-side and, on a full pass,
-- auto-issue the mapped certification (idempotent). Requires the caller
-- to hold Learning Mode on the app (activated + enrolled). SECURITY
-- DEFINER: this function IS the trusted grader/issuer.
create or replace function public.academy_submit_capstone(
    p_app     text,
    p_tier    text,
    p_answers jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid     uuid := auth.uid();
  v_cap     public.academy_capstones;
  v_field   jsonb;
  v_key     text;
  v_exp     numeric;
  v_tol     numeric;
  v_got     numeric;
  v_total   integer := 0;
  v_pass    integer := 0;
  v_missed  text[] := '{}';
  v_passed  boolean;
  v_cert    public.academy_certifications;
  v_existing boolean;
begin
  if v_uid is null then raise exception 'authentication required'; end if;

  -- Learning Mode required (activated + enrolled → learning scope).
  if not public.academy_has_scope(p_app, 'learning') then
    raise exception 'enroll and activate Learning Mode before attempting the capstone';
  end if;

  select * into v_cap from public.academy_capstones
   where app_slug = p_app and tier = p_tier and active;
  if v_cap.app_slug is null then
    raise exception 'no capstone for % (%)', p_app, p_tier;
  end if;

  -- grade each field within tolerance
  for v_field in select * from jsonb_array_elements(v_cap.fields) loop
    v_total := v_total + 1;
    v_key := v_field->>'key';
    v_exp := (v_field->>'expected')::numeric;
    v_tol := (v_field->>'tol')::numeric;
    begin
      v_got := (p_answers->>v_key)::numeric;
    exception when others then
      v_got := null;
    end;
    if v_got is not null and abs(v_got - v_exp) <= v_tol then
      v_pass := v_pass + 1;
    else
      v_missed := array_append(v_missed, v_key);
    end if;
  end loop;

  v_passed := (v_pass = v_total);

  insert into public.academy_capstone_attempts
      (user_id, app_slug, tier, score, max_score, passed, answers)
  values (v_uid, p_app, p_tier, v_pass, v_total, v_passed, p_answers);

  if not v_passed then
    return jsonb_build_object('passed', false, 'score', v_pass,
      'max_score', v_total, 'missed', to_jsonb(v_missed));
  end if;

  -- pass → auto-issue the mapped cert, unless a live one already exists.
  select exists (select 1 from public.academy_certifications
                  where user_id = v_uid and app_slug = p_app
                    and tier = v_cap.cert_tier
                    and revoked_at is null and now() < valid_until)
    into v_existing;

  if v_existing then
    return jsonb_build_object('passed', true, 'score', v_pass,
      'max_score', v_total, 'already_certified', true);
  end if;

  insert into public.academy_certifications
      (user_id, course_id, app_slug, tier)
  values (v_uid, public.academy_course_for_app(p_app), p_app, v_cap.cert_tier)
  returning * into v_cert;

  return jsonb_build_object('passed', true, 'score', v_pass,
    'max_score', v_total,
    'certificate_number', v_cert.certificate_number,
    'verify_code', v_cert.verify_code,
    'tier', v_cert.tier,
    'valid_until', v_cert.valid_until);
end $$;

-- --------------------------------------------------------------- grants

revoke all on function public.academy_get_capstone(text, text) from public, anon;
grant execute on function public.academy_get_capstone(text, text) to authenticated;
revoke all on function public.academy_submit_capstone(text, text, jsonb) from public, anon;
grant execute on function public.academy_submit_capstone(text, text, jsonb) to authenticated;
revoke all on function public.academy_course_for_app(text) from public, anon, authenticated;

-- ------------------------------------------------------------------- RLS

alter table public.academy_capstones         enable row level security;
alter table public.academy_capstone_attempts enable row level security;

-- academy_capstones: NO client policies — the answer key lives here;
-- reachable only through academy_get_capstone() (labels only).

-- attempts: learner reads own; admins read all.
drop policy if exists "academy_capstone_attempts_select_own" on public.academy_capstone_attempts;
create policy "academy_capstone_attempts_select_own"
    on public.academy_capstone_attempts for select using (auth.uid() = user_id);
drop policy if exists "academy_capstone_attempts_select_admin" on public.academy_capstone_attempts;
create policy "academy_capstone_attempts_select_admin"
    on public.academy_capstone_attempts for select
    using (public.get_user_role() in ('lecturer','admin','super_admin'));

-- Mark the Petrophysics course available for enrollment (N3.2 catalog).
update public.academy_apps set status = 'available' where slug = 'petrophysics';
