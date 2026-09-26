-- ============================================================================
-- CATALOG COURSE TITLES: five courses renamed for the skill they teach, and
-- the public certificate verification returns the course title.
--
-- Owner decision 2026-09-26: a course name states the skill, and the Suite app
-- a course teaches in keeps its own name inside the lessons. Slugs never
-- change, so every enrolment, certificate, entitlement, attempt and sponsor
-- pool keyed on a slug is untouched.
--
--   seismolord     Seismolord          -> Seismic Interpretation
--   reservoircalc  ReservoirCalc Pro   -> Reservoir Volumetrics
--   welldata       Well Data Manager   -> Well Data Management
--   mapping        Mapping             -> Subsurface Mapping
--   facies         Electrofacies       -> Electrofacies Classification
--
-- academy_verify_certificate(text) gains one key, course_name, read from
-- academy_apps.name, so the anon verification page prints the catalog title
-- and never the slug. The function keeps its signature, its return type
-- (jsonb), SECURITY DEFINER, search_path = public, and anon + authenticated
-- EXECUTE. course_name is public catalog data (academy_apps is anon-readable)
-- and exposes no user or internal id. Every other key is returned as before,
-- with one tightening of 'holder': a blank display name, or a display name
-- that is itself an email address, now reads 'Registered learner', so the
-- public page can never print an email address.
--
-- Idempotent: each rename touches its row only while the name differs, and
-- the function is create or replace. The assert block raises when any of the
-- five rows is missing or does not carry its new name, which aborts the
-- transaction the file is applied in. No row is deleted. src/lib/appNames.test.js reads the update lines
-- below as the latest name for each slug.
-- ============================================================================

update public.academy_apps set name = 'Seismic Interpretation' where slug = 'seismolord' and name is distinct from 'Seismic Interpretation';
update public.academy_apps set name = 'Reservoir Volumetrics' where slug = 'reservoircalc' and name is distinct from 'Reservoir Volumetrics';
update public.academy_apps set name = 'Well Data Management' where slug = 'welldata' and name is distinct from 'Well Data Management';
update public.academy_apps set name = 'Subsurface Mapping' where slug = 'mapping' and name is distinct from 'Subsurface Mapping';
update public.academy_apps set name = 'Electrofacies Classification' where slug = 'facies' and name is distinct from 'Electrofacies Classification';

-- Assert: every one of the five rows exists and now carries its new name.
do $$
declare
  v_bad text;
begin
  select string_agg(t.slug, ', ') into v_bad
    from (values
      ('seismolord', 'Seismic Interpretation'),
      ('reservoircalc', 'Reservoir Volumetrics'),
      ('welldata', 'Well Data Management'),
      ('mapping', 'Subsurface Mapping'),
      ('facies', 'Electrofacies Classification')
    ) as t(slug, name)
    left join public.academy_apps a on a.slug = t.slug
   where a.name is distinct from t.name;
  if v_bad is not null then
    raise exception 'catalog course titles: rows missing or not renamed: %', v_bad;
  end if;
  raise notice 'catalog course titles: 5 of 5 rows carry the new name';
end $$;

-- Public certificate verification (anon-safe: returns only what the
-- verification page shows).
create or replace function public.academy_verify_certificate(p_verify_code text)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'certificate_number', c.certificate_number,
    'holder', coalesce(nullif(case when p.display_name like '%@%' then null
                                   else btrim(p.display_name) end, ''),
                       'Registered learner'),
    'app_slug', c.app_slug,
    'course_name', a.name,
    'tier', c.tier,
    'issued_at', c.issued_at,
    'valid_until', c.valid_until,
    'status', case when c.revoked_at is not null then 'revoked'
                   when now() >= c.valid_until then 'expired'
                   else 'valid' end)
  from public.academy_certifications c
  left join public.profiles p on p.id = c.user_id
  left join public.academy_apps a on a.slug = c.app_slug
  where c.verify_code = p_verify_code;
$$;
revoke all on function public.academy_verify_certificate(text) from public;
grant execute on function public.academy_verify_certificate(text) to anon, authenticated;
