#!/usr/bin/env python3
"""Generate the FC2 go-live migration.

Every assertion is written from the ENGINES' output. The eighteen graded
values are read from fields.json, the numbers a learner is handed are read
out of the capstone prompts in scratch/prompts_draft.sql, and the published
headline values are the ones the teaching digest prints for OGBIA and SOKU.
Nothing is retyped.

THE INTEGER-DIVISION GUARD. Postgres divides integer by integer as an
integer. On FC1 `(7350+2480)*4/1440` truncated to 27 and lost a third of a
minute of retention, and the Python check that asserted the same identity to
0.0 difference could not see it, because only SQL does this. So every
denominator in this file is written as a float, and this script REFUSES to
write a migration in which any division has a bare integer denominator.

Usage: python3 /root/fc-wip-linesizing/gen_golive.py
"""
import json
import re
import sys

W = '/root/fc-wip-linesizing'
REPO = '/root/wt-fc2-nextgen'
OUT = f'{REPO}/migrations/20260922_fc2_linesizing_go_live.sql'
SLUG = 'linesizing'

fields = json.load(open(f'{W}/fields.json'))
draft = open(f'{W}/scratch/prompts_draft.sql', encoding='utf-8').read()

PROMPT = re.compile(r"'((?:[^']|'')*)',\n\s*jsonb_build_array", re.S)
prompts = [m.group(1).replace("''", "'") for m in PROMPT.finditer(draft)]
assert len(prompts) == 3, f'{len(prompts)} prompts parsed from the draft'

NUM = re.compile(r'-?\d+(?:\.\d+)?')
handed = sorted({abs(float(t)) for p in prompts for t in NUM.findall(p)})

# The values the teaching digest publishes for the two lines the LESSONS use.
# OGBIA is the Associate line end to end, SOKU is the Professional trunk and
# the Expert pressure envelope, and the last five are the Expert pigging
# reading. The capstone runs IMO-1, BRASS and QUA IBOE and shares no bore,
# rate, length, pressure, density, viscosity, roughness, wall, holdup or speed
# with any of them.
PUBLISHED = [
    # Associate, OGBIA end to end (digest section 6)
    (12000, 'OGBIA rate'), (54.5, 'OGBIA density'), (2.5, 'OGBIA viscosity'),
    (7.981, 'OGBIA bore'), (26400, 'OGBIA length'),
    (2.244621, 'OGBIA velocity'), (48431.2523, 'OGBIA Reynolds'),
    (0.0002255356, 'OGBIA relative roughness'), (0.0218149625, 'OGBIA friction factor'),
    (25.660631, 'OGBIA friction loss'), (4.5, 'OGBIA resistance sum'),
    (0.133351, 'OGBIA fitting loss'), (13.545709, 'OGBIA erosional velocity'),
    (0.165707, 'OGBIA share of the erosional limit'),
    # Professional, SOKU trunk (digest section 12)
    (11.938, 'SOKU bore'), (32, 'SOKU length'), (850, 'SOKU inlet'), (620, 'SOKU outlet'),
    (338100, 'SOKU driving group'),
    (66104956.1404, 'SOKU Weymouth'), (86864172.0167, 'SOKU Panhandle A'),
    (88369202.2673, 'SOKU Panhandle B'), (73861363.0502, 'SOKU General Flow'),
    (0.011213201, 'SOKU General Flow friction factor'),
    (1500, 'the SOKU elevation step'), (61666790.6494, 'SOKU up 1500 ft'),
    (70296168.593, 'SOKU down 1500 ft'), (60000000, 'the SOKU contracted rate'),
    (666.307057, 'the SOKU outlet at that rate'),
    (1.336801, 'the spread across the four forms'),
    (121523381.8036, 'SOKU at one step of bore'), (1.83834, 'the bore spread'),
    (1.375178, 'the bore spread over the form spread'),
    # Expert, the SOKU pressure envelope and the OGBIA pigging reading
    (12.75, 'SOKU outside diameter'), (52000, 'SOKU yield'),
    (0.419231, 'SOKU wall at Class 3'), (0.329327, 'SOKU wall at Class 1'),
    (0.375, 'the SOKU wall the mill rolled'), (1019.607843, 'the SOKU rating'),
    (12.0, 'the SOKU bore'), (4.019, 'the gap between the two bores'),
    (1633.5349, 'OGBIA line volume'), (2.444444, 'the OGBIA pig run'),
    (0.06, 'the OGBIA measured holdup'), (98.0121, 'the OGBIA swept volume'),
    (3.7997, 'the OGBIA interval'),
]

refused = []
for tier, key, val, tol in fields:
    for h in handed:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{key} = {val} is within {tol} of {h}, handed in a prompt')
    for p, label in PUBLISHED:
        if abs(abs(val) - p) <= tol:
            refused.append(f'{key} = {val} is within {tol} of {p} ({label}), which the digest publishes')

F = {k: (v, t) for _t, k, v, t in fields}
assert len(F) == 18

HEADER = """-- ============================================================================
-- FC2 GO-LIVE (HELD): Pipeline & Line Sizing flips to 'available'. The SECOND
-- Facilities course, behind FC1 separation at path_order 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/linesizing. The 78 lessons, the teaching lab
-- (linesizingLab.js) and its three explorer panels (fc-liquid-explorer,
-- fc-gasline-explorer, fc-wall-pig-explorer) ship in the zip and NOT in this
-- database, so a flip before the upload puts a live catalogue tile in front
-- of a route that does not exist. Every Facilities and Drilling wave on this
-- programme has held its go-live behind one verified upload.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer. On FC1 `(7350+2480)*4/1440` truncated to 27 and lost
-- a third of a minute of retention; the Python check that proved the same
-- identity to 0.0 difference could not see it, because only SQL does this.
-- The generator that wrote this file refuses to emit a division with a bare
-- integer denominator.
--
-- THIRTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED HERE BY EXACT CLOSED
-- FORM, most of them to 1e-9 or better, because most of this method is closed
-- form: a bore is an area, an area and a rate are a velocity, a static column
-- is a density and a height, a swept volume is a line volume and a holdup, a
-- wall is a code formula, and a rating is that formula read backwards. A
-- capstone quietly recut to another rate, bore, length, elevation, wall,
-- class, holdup or speed fails them outright.
--
-- THE THREE THAT ARE NOT CLOSED FORM ARE ASSERTED THE ONLY HONEST WAY THERE
-- IS, by the equation they are a root of rather than by a formula they are
-- not. The two friction factors are checked by their COLEBROOK RESIDUAL, and
-- the outlet pressure is checked by INVERSION: the Weymouth form evaluated at
-- the graded outlet pressure must return the contracted rate the prompt
-- states. An iterated value restated as a formula would be a gate that
-- validates nothing.
--
-- NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE ITEM, and that is asserted
-- rather than asserted-by-comment. The RP 14E c factor rows, the transmission
-- efficiency E and the Reynolds 2100 to 4000 transition band are all taught
-- as limits and all held. IMO-1 states its own site c factor, BRASS states
-- its own E, and every graded Reynolds number is above 20000.
-- ============================================================================"""

KEYS = [k for _t, k, _v, _tt in fields]
VARS = {k: 'v_' + k.split('_', 1)[1][:24] for k in KEYS}
# keep the variable names unique and short
seen = {}
for k in KEYS:
    n = VARS[k]
    if n in seen:
        n = n + str(len(seen))
    seen[n] = k
    VARS[k] = n

body = []
A = body.append

A('do $$')
A('declare')
A('  v_structures integer;')
A('  v_capstones  integer;')
A('  v_questions  integer;')
A('  v_graded     integer;')
A('  v_lessons    integer;')
A('  v_modules    integer;')
A('  v_available  integer;')
A('  v_soon       integer;')
for k in KEYS:
    A(f'  {VARS[k]} numeric;')
A('  -- closed-form working')
A('  v_area numeric; v_vh numeric; v_re numeric; v_es numeric; v_le numeric;')
A('  v_driving numeric; v_resid numeric;')
A('begin')

A("""  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'linesizing' and active;
  if v_structures <> 3 then
    raise exception 'FC2 go-live refused: linesizing has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'linesizing';
  if v_questions <> 396 then
    raise exception 'FC2 go-live refused: linesizing has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded
    from (select tier, count(*) n from public.academy_quiz_questions
           where app_slug = 'linesizing' group by tier) t
   where t.n <> 132;
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded
    from (select tier, module_key, count(*) n from public.academy_quiz_questions
           where app_slug = 'linesizing' and scope = 'module'
           group by tier, module_key) t
   where t.n <> 15;
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded
    from (select tier, count(*) n from public.academy_quiz_questions
           where app_slug = 'linesizing' and scope = 'final' group by tier) t
   where t.n <> 42;
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- Every question offers four options and keys one of them. A bank that lost
  -- an option to an escaping accident still counts as a row.
  select count(*) into v_graded
    from public.academy_quiz_questions
   where app_slug = 'linesizing'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'linesizing';
  if v_capstones <> 3 then
    raise exception 'FC2 go-live refused: linesizing has % capstones, expected 3', v_capstones;
  end if;

  -- 78 lessons across three tiers, 26 each, in six modules each. The lab and
  -- the panels ship in the zip; the lesson KEYS are what this database holds,
  -- so this is the count that has to match the upload.
  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'linesizing' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC2 go-live refused: linesizing carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'linesizing' and s.active;
  if v_modules <> 18 then
    raise exception 'FC2 go-live refused: linesizing carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- Every module a question is keyed to is a module the structure declares.
  -- A bank seeded against a module key the manifest renamed would be served
  -- to nobody and would still count 132.
  select count(*) into v_graded
    from (select distinct q.tier, q.module_key
            from public.academy_quiz_questions q
           where q.app_slug = 'linesizing' and q.scope = 'module') qm
   where not exists (
     select 1 from public.academy_course_structures s,
            lateral jsonb_array_elements(s.structure->'modules') m
      where s.app_slug = 'linesizing' and s.tier = qm.tier and m->>'key' = qm.module_key);
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'linesizing';
  if v_graded <> 18 then
    raise exception 'FC2 go-live refused: linesizing has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded
    from (select c.tier, count(*) n
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'linesizing' group by c.tier) t
   where t.n <> 6;
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  -- The catalogue row itself: the module, the slot and the absence of a
  -- prerequisite are decisions, so they are asserted rather than assumed.
  if not exists (select 1 from public.academy_apps
                  where slug = 'linesizing' and module = 'facilities'
                    and path_order = 40 and prereq_slug is null) then
    raise exception 'FC2 go-live refused: the linesizing catalogue row is not facilities at path_order 40 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps a, public.academy_apps b
              where a.slug = 'linesizing' and b.slug <> 'linesizing'
                and b.path_order = a.path_order) then
    raise exception 'FC2 go-live refused: another course already holds path_order 40';
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This course sizes a pipe. It does not book a reserve, estimate an
  -- ultimate recovery, value a barrel, model a reservoir pressure or rank a
  -- portfolio. Velocities, Reynolds numbers, friction factors, pressure
  -- drops, wall thicknesses, volumes, run times and intervals are this
  -- course's subject.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'linesizing'
     and (f->>'label' ilike '%reserve%'    or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%npv%'        or f->>'label' ilike '%irr%'
       or f->>'label' ilike '%permeab%'    or f->>'label' ilike '%porosit%'
       or f->>'label' ilike '%decline%'    or f->>'label' ilike '%skin%'
       or f->>'unit'  ilike '%usd%'        or f->>'unit'  ilike '%md%');
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % capstone field(s) grade a quantity these line-sizing engines cannot produce', v_graded;
  end if;

  -- ------------------------------- the HELD-FOR-LITERATURE assertion --
  -- The RP 14E c factor rows, the transmission efficiency E and the Reynolds
  -- 2100 to 4000 transition band are taught as limits and are never graded.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'linesizing'
     and (f->>'label' ilike '%c factor%'    or f->>'label' ilike '%efficiency%'
       or f->>'label' ilike '%transition%'  or f->>'label' ilike '%schedule%'
       or f->>'label' ilike '%location class%');
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % graded field(s) reach into a quantity held for the literature', v_graded;
  end if;""")

# The comma belongs BEFORE the comment, or the separator ends up inside it
# and the VALUES list stops after one row. The dry run caught exactly that.
pub = '\n'.join(f'            ({p!r}),'.ljust(28) + f'-- {label}' for p, label in PUBLISHED)
pub = pub.rstrip()
pub = re.sub(r',(\s*--[^\n]*)$', r'\1', pub)  # the last row carries no comma
last = PUBLISHED[-1]
assert pub.splitlines()[-1].lstrip().startswith(f'({last[0]!r})'), pub.splitlines()[-1]
A(f"""
  -- --------------------------------------- the published-golden assertion --
  -- Headline values the goldens and the teaching digest publish. A graded
  -- field within its OWN tolerance of one of these is a lookup, not a
  -- calculation. OGBIA and SOKU are the LESSONS' lines; the capstone runs
  -- IMO-1, BRASS and QUA IBOE and shares no bore, rate, length, pressure,
  -- density, viscosity, roughness, wall, holdup or speed with them.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
{pub}
         ) as g(v)
   where c.app_slug = 'linesizing'
     and abs(abs((f->>'expected')::numeric) - g.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % graded field(s) sit within their own tolerance of a value the goldens or the digest publish, which makes them a lookup rather than a calculation', v_graded;
  end if;""")

hv = ','.join(f'({h!r})' for h in handed)
hv = re.sub(r'((?:\([-\d.e+]+\),){8})', r'\1\n                 ', hv)
A(f"""
  -- ------------------------------------ the handed-in-the-prompt assertion --
  -- Every number stated in any of the three capstone prompts, swept out of
  -- the prompts themselves. A graded field landing on one of them would be a
  -- transcription rather than a calculation.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values {hv}) as h(v)
   where c.app_slug = 'linesizing'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  -- FC2's tiers do not chain: the Associate sizes IMO-1, the Professional
  -- reads the BRASS trunk and the Expert rates the QUA IBOE line and plans
  -- its pig. Asserted anyway, because a later recut that reused a line across
  -- tiers would silently hand an answer over.
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'linesizing' and c2.app_slug = 'linesizing' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'FC2 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --""")

for k in KEYS:
    A(f"  select (f->>'expected')::numeric into {VARS[k]} from public.academy_capstones c, "
      f"lateral jsonb_array_elements(c.fields) f where c.app_slug = 'linesizing' and f->>'key' = '{k}';")

A('')
A('  if ' + '\n     or '.join(f'{VARS[k]} is null' for k in KEYS) + ' then')
A("    raise exception 'FC2 go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')

V = VARS
A(f"""
  -- ==================== ASSOCIATE: IMO-1, closed form end to end ==========
  -- 6800 bpd of 52.3 lb/ft3 crude at 4.2 cp through 6.065 in of bore, 19800
  -- ft long, climbing 180 ft, roughness 0.006 in, resistance sum 3.85, site
  -- c factor 120. Every denominator is a float.
  v_area := pi() / 4.0 * power(6.065 / 12.0, 2);

  -- A bore is an area and a rate is a velocity. 5.614583333333333 cubic feet
  -- in a barrel, 86400 seconds in a day.
  if abs({V['imo1_velocity_fts']} - 6800 * 5.614583333333333 / 86400.0 / v_area) > 1e-9 then
    raise exception 'FC2 go-live refused: the velocity % is not 6800 bpd through a 6.065 in bore', {V['imo1_velocity_fts']};
  end if;

  -- The Reynolds number in field units: the centipoise is 0.00067197 lbm per
  -- ft s, and the length scale is the bore in FEET.
  if abs({V['imo1_reynolds']} - 52.3 * {V['imo1_velocity_fts']} * (6.065 / 12.0) / (4.2 * 0.00067197)) > 1e-6 then
    raise exception 'FC2 go-live refused: the Reynolds number % is not the field-unit Reynolds number of that velocity', {V['imo1_reynolds']};
  end if;

  -- The tier is turbulent BY CONSTRUCTION, so the held transition band from
  -- 2100 to 4000 cannot reach a graded friction factor.
  if not ({V['imo1_reynolds']} > 20000) then
    raise exception 'FC2 go-live refused: the graded Reynolds number % is not clear of the HELD transition band', {V['imo1_reynolds']};
  end if;

  -- THE FRICTION FACTOR IS ITERATED, so it is asserted by the equation it is
  -- a root of. Colebrook: 1/sqrt(f) = -2 log10(relRough/3.7 + 2.51/(Re sqrt f)).
  -- Restating an iterated value as a formula would validate nothing.
  v_resid := 1.0 / sqrt({V['imo1_friction_factor']})
             + 2.0 * log((0.006 / 6.065) / 3.7 + 2.51 / ({V['imo1_reynolds']} * sqrt({V['imo1_friction_factor']})));
  if abs(v_resid) > 1e-9 then
    raise exception 'FC2 go-live refused: the friction factor % does not satisfy Colebrook at Reynolds % and relative roughness 0.006/6.065 (residual %)', {V['imo1_friction_factor']}, {V['imo1_reynolds']}, v_resid;
  end if;

  -- The velocity head, in psi. gc is 32.174 lbm ft per lbf s2 and 144 square
  -- inches make a square foot.
  v_vh := 52.3 * power({V['imo1_velocity_fts']}, 2) / (2.0 * 32.174) / 144.0;

  if abs({V['imo1_friction_drop_psi']} - {V['imo1_friction_factor']} * (19800 / (6.065 / 12.0)) * v_vh) > 1e-9 then
    raise exception 'FC2 go-live refused: the friction loss % is not f L over D times the velocity head', {V['imo1_friction_drop_psi']};
  end if;

  -- THE THREE LOSSES ARE KEPT APART, and that is the fact the tier is built
  -- on. The total is the friction, plus 3.85 velocity heads of fittings, plus
  -- a static column of 52.3 lb/ft3 standing 180 ft, which is the one term no
  -- change of bore can move.
  if abs({V['imo1_total_drop_psi']} - ({V['imo1_friction_drop_psi']} + 3.85 * v_vh + 52.3 * 180 / 144.0)) > 1e-9 then
    raise exception 'FC2 go-live refused: the total % is not the friction plus 3.85 velocity heads plus the 180 ft static column', {V['imo1_total_drop_psi']};
  end if;

  -- The elevation term is a third of the total on this line. If a recut ever
  -- made it negligible the tier would stop teaching what it exists to teach.
  if not (52.3 * 180 / 144.0 > 0.5 * {V['imo1_friction_drop_psi']}) then
    raise exception 'FC2 go-live refused: the static column no longer dominates the friction on IMO-1, so the three-losses lesson is not what the capstone grades';
  end if;

  -- The erosional limit is c over root rho, at the SITE c factor of 120, and
  -- it is not a pressure drop at all.
  if abs({V['imo1_erosional_velocity_fts']} - 120 / sqrt(52.3)) > 1e-9 then
    raise exception 'FC2 go-live refused: the erosional velocity % is not 120 over the square root of 52.3', {V['imo1_erosional_velocity_fts']};
  end if;
  if not ({V['imo1_velocity_fts']} < {V['imo1_erosional_velocity_fts']}) then
    raise exception 'FC2 go-live refused: IMO-1 runs above its own erosional limit, which is not the passing line the tier grades';
  end if;

  -- ==================== PROFESSIONAL: the BRASS trunk =====================
  -- 15 in over 58 miles, 1150 to 840 psia, gravity 0.62, 552 degR, z 0.845,
  -- E 0.92, and 950 ft of DESCENT. Base conditions 520 degR and 14.65 psia.
  --
  -- The elevation group is shared by all four published forms and is the only
  -- place a static column enters a gas calculation. s is negative here
  -- because the line arrives below where it left.
  v_es := exp(0.0375 * 0.62 * (-950) / (552 * 0.845));
  if abs({V['brass_elevation_factor']} - v_es) > 1e-12 then
    raise exception 'FC2 go-live refused: the elevation factor % is not e to the s for a 950 ft descent', {V['brass_elevation_factor']};
  end if;
  if not ({V['brass_elevation_factor']} < 1) then
    raise exception 'FC2 go-live refused: the elevation factor % is not below one, so BRASS is no longer the descending line the tier grades', {V['brass_elevation_factor']};
  end if;

  v_le := 58 * (v_es - 1) / (0.0375 * 0.62 * (-950) / (552 * 0.845));
  v_driving := 1150 * 1150 - v_es * 840 * 840;

  -- Weymouth, GPSA: Q = 433.5 (Tb/Pb) [driving / (G T Le Z)]^0.5 d^(8/3) E.
  -- 8/3.0 and not 8/3: integer division would make the exponent 2.
  if abs({V['brass_weymouth_scfd']} - 433.5 * 0.92 * (520 / 14.65)
         * sqrt(v_driving / (0.62 * 552 * v_le * 0.845)) * power(15, 8 / 3.0)) > 1.0 then
    raise exception 'FC2 go-live refused: the Weymouth rate % is not the published form on this trunk', {V['brass_weymouth_scfd']};
  end if;

  -- Panhandle B: Q = 737 (Tb/Pb)^1.02 [driving / (G^0.961 T Le Z)]^0.51 d^2.53 E.
  if abs({V['brass_panhandleb_scfd']} - 737 * 0.92 * power(520 / 14.65, 1.02)
         * power(v_driving / (power(0.62, 0.961) * 552 * v_le * 0.845), 0.51)
         * power(15, 2.53)) > 1.0 then
    raise exception 'FC2 go-live refused: the Panhandle B rate % is not the published form on this trunk', {V['brass_panhandleb_scfd']};
  end if;

  -- FOUR FORMS AND ONE LINE. Panhandle B reads a third higher than Weymouth
  -- on this trunk, and that disagreement is the whole point of the module. A
  -- recut that brought them together would grade one thing twice.
  if not ({V['brass_panhandleb_scfd']} / {V['brass_weymouth_scfd']} > 1.2) then
    raise exception 'FC2 go-live refused: Panhandle B over Weymouth is %, so the four forms no longer disagree by the margin the tier teaches', {V['brass_panhandleb_scfd']} / {V['brass_weymouth_scfd']};
  end if;

  -- General Flow carries an EXPLICIT friction factor:
  -- Q = 77.54 (Tb/Pb) [driving / (G T Le Z f)]^0.5 d^2.5 E.
  if abs({V['brass_general_scfd']} - 77.54 * 0.92 * (520 / 14.65)
         * sqrt(v_driving / (0.62 * 552 * v_le * 0.845 * {V['brass_general_friction_factor']}))
         * power(15, 2.5)) > 1.0 then
    raise exception 'FC2 go-live refused: the General Flow rate % is not the published form at the graded friction factor', {V['brass_general_scfd']};
  end if;

  -- THAT FRICTION FACTOR IS A FIXED POINT, solved against a Reynolds number
  -- that depends on the rate it is used to compute. It is asserted by its
  -- Colebrook residual at the GPSA gas Reynolds number Re = 0.0201 Q G / (d mu),
  -- which is the only assertion that is about the equation rather than about
  -- the iteration.
  v_re := 0.0201 * {V['brass_general_scfd']} * 0.62 / (15 * 0.0125);
  v_resid := 1.0 / sqrt({V['brass_general_friction_factor']})
             + 2.0 * log((0.0006 / 15.0) / 3.7 + 2.51 / (v_re * sqrt({V['brass_general_friction_factor']})));
  if abs(v_resid) > 1e-9 then
    raise exception 'FC2 go-live refused: the General Flow friction factor % does not satisfy Colebrook at its own gas Reynolds number % (residual %)', {V['brass_general_friction_factor']}, v_re, v_resid;
  end if;

  -- THE OUTLET PRESSURE HAS NO CLOSED FORM IN THIS ENGINE. It comes out of a
  -- bisection, so it is asserted BY INVERSION: the Weymouth form evaluated at
  -- the graded outlet must return the 92000000 scfd the prompt contracts for.
  if abs(433.5 * 0.92 * (520 / 14.65)
         * sqrt((1150 * 1150 - v_es * power({V['brass_outlet_pressure_psia']}, 2))
                / (0.62 * 552 * v_le * 0.845)) * power(15, 8 / 3.0)
         - 92000000) > 1.0 then
    raise exception 'FC2 go-live refused: Weymouth at the graded outlet pressure % does not return the contracted 92000000 scfd', {V['brass_outlet_pressure_psia']};
  end if;

  -- And it is INSIDE its bracket, not sitting on it. The ceiling of the
  -- bracket is the inlet over the square root of e to the s, which on this
  -- descent is ABOVE the inlet; the floor is atmospheric. A solve resting on
  -- either end is FINDINGS D1 and is not an answer.
  if not ({V['brass_outlet_pressure_psia']} > 14.7
          and {V['brass_outlet_pressure_psia']} < 1150 / sqrt(v_es) - 1) then
    raise exception 'FC2 go-live refused: the outlet pressure % is sitting on its own bracket rather than inside it', {V['brass_outlet_pressure_psia']};
  end if;

  -- ==================== EXPERT: the QUA IBOE export line ==================
  -- B31.8, design 1450 psig, 16 in outside diameter, 60000 psi yield,
  -- location Class 3 so the design factor is 0.5, joint factor 1, temperature
  -- derate 0.967, corrosion allowance 0.0625 in. The mill rolled 0.5 in.
  if abs({V['quaiboe_required_wall_in']} - (1450 * 16 / (2.0 * 60000 * 0.5 * 1 * 0.967) + 0.0625)) > 1e-12 then
    raise exception 'FC2 go-live refused: the required wall % is not Barlow at Class 3 plus the corrosion allowance', {V['quaiboe_required_wall_in']};
  end if;

  -- THE RATING IS THAT FORMULA READ BACKWARDS, off the wall the mill rolled
  -- and through the same corrosion allowance. It is not the design pressure.
  if abs({V['quaiboe_maop_as_built_psig']} - 2 * 60000 * (0.5 - 0.0625) * 0.5 * 1 * 0.967 / 16.0) > 1e-9 then
    raise exception 'FC2 go-live refused: the MAOP % is not the as-built wall rated through the same allowance', {V['quaiboe_maop_as_built_psig']};
  end if;
  if not ({V['quaiboe_maop_as_built_psig']} > 1450) then
    raise exception 'FC2 go-live refused: the as-built wall rates below its own design pressure, so the Expert capstone grades an illegal pipe';
  end if;
  if not (0.5 > {V['quaiboe_required_wall_in']}) then
    raise exception 'FC2 go-live refused: the 0.5 in the mill rolled is thinner than the code demands';
  end if;

  -- A LINE IS A VOLUME. 15 in of bore over 306240 ft, in barrels.
  if abs({V['quaiboe_line_volume_bbl']} - pi() / 4.0 * power(15 / 12.0, 2) * 306240 / 5.614583333333333) > 1e-6 then
    raise exception 'FC2 go-live refused: the line volume % is not a 15 in bore 306240 ft long', {V['quaiboe_line_volume_bbl']};
  end if;

  -- THE HOLDUP IS AN INPUT, so the swept volume inherits it exactly. This is
  -- the fact the tier owns, and it is one multiplication.
  if abs({V['quaiboe_swept_volume_bbl']} - {V['quaiboe_line_volume_bbl']} * 0.035) > 1e-9 then
    raise exception 'FC2 go-live refused: the swept volume % is not the line volume at the measured holdup of 0.035', {V['quaiboe_swept_volume_bbl']};
  end if;

  -- The run is a length over a speed. 3600.0 and not 3600: integer division
  -- would truncate 76560/3600 to 21 hours and lose sixteen minutes.
  if abs({V['quaiboe_pig_run_hours']} - 306240 / 4.0 / 3600.0) > 1e-12 then
    raise exception 'FC2 go-live refused: the pig run % is not 306240 ft at 4 ft/s', {V['quaiboe_pig_run_hours']};
  end if;

  -- THE INTERVAL IS THE CATCHER AGAINST THE DROPOUT: how long 95 bpd takes to
  -- refill the headroom the catcher has left once the standing swept volume
  -- has arrived. 95.0 and not 95.
  if abs({V['quaiboe_pigging_interval_days']} - (3200 - {V['quaiboe_swept_volume_bbl']}) / 95.0) > 1e-9 then
    raise exception 'FC2 go-live refused: the interval % is not the 3200 bbl catcher less the swept volume at 95 bpd', {V['quaiboe_pigging_interval_days']};
  end if;
  if not ({V['quaiboe_swept_volume_bbl']} < 3200) then
    raise exception 'FC2 go-live refused: the swept volume already exceeds the catcher, so there is no interval to grade';
  end if;

  -- The three Expert answers are INDEPENDENT. A wall, a rating and a pigging
  -- interval come from three different questions, and no one of them can be
  -- derived from the other two. Asserted as a separation so a recut cannot
  -- quietly collapse two of them onto one quantity.
  if abs({V['quaiboe_required_wall_in']} - 0.5) < 0.02 then
    raise exception 'FC2 go-live refused: the required wall has collapsed onto the as-built wall, so two graded fields are one question';
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'linesizing' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'linesizing' and status = 'available') then
    raise exception 'FC2 go-live refused: linesizing did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC2 go-live: linesizing available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;""")

sql = HEADER + '\n\n' + '\n'.join(body) + '\n'

# ---------------------------------------------------- THE INTEGER-DIVISION GUARD
# Any `/ <integer>` that is not followed by a decimal point or an exponent is
# a truncating division in Postgres the moment its numerator is an integer
# too. Flag every one of them and refuse. Comment lines are exempt: they talk
# about the trap.
intdiv = []
for n, line in enumerate(sql.splitlines(), 1):
    code = line.split('--', 1)[0] if not line.lstrip().startswith('--') else ''
    for m in re.finditer(r'/\s*(\d+)(?![\d.eE])', code):
        intdiv.append(f'line {n}: "/ {m.group(1)}" has a bare integer denominator -> {line.strip()[:90]}')

dashes = len(re.findall('[–—]', sql))
if refused or intdiv or dashes:
    print('REFUSED, nothing written:')
    for b in refused + intdiv:
        print('  ', b)
    if dashes:
        print('   en/em dashes:', dashes)
    sys.exit(1)

open(OUT, 'w').write(sql)
print(f'wrote {OUT}: {len(sql.splitlines())} lines')
print(f'integer-division guard: 0 bare integer denominators in {sql.count("/")} divisions')
print(f'published-headline rows: {len(PUBLISHED)} | handed-in-prompt values: {len(handed)}')
print('graded fields colliding with either list, at their own tolerance: 0')
