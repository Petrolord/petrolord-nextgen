#!/usr/bin/env python3
"""Fold the raw per-course annotations into annot/, applying the lead's review.

The annotations were written course by course by separate reviewers. Two things
were not applied the same way everywhere, and this script makes them uniform so
the per-class counts mean one thing:

1. A LESSON OR PANEL LEAK is not one of B5's three defects. Some reviewers
   classed a field `redesign` ONLY because its tier's walkthrough lesson or a
   panel's default state prints the answer; others classed the same situation
   `none` with a note. Every field whose redesign rests on a leak alone is
   reclassed `none`, keeps `leak: true`, and records `reclassed_from`. The leak
   is reported separately in README.md (it is a finding, and an owner decision).
2. Every field carries `leak: true|false`. A course whose reviewer reported that
   its walkthrough lessons or its panels' default states print the graded
   answers is `ALL`; a course with isolated reports is read field by field from
   the reviewer's evidence and notes (a sentence naming a leak that does not deny
   one). It is a pointer for the owner, not a gate input.

It also records the fixes this PR SHIPS (`shipped`), so fields.json says which
findings are closed by code or migration and which stay open.

  python3 normalize.py RAW_DIR   (writes annot/<course>.json beside this file)
"""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LEAK = re.compile(r'leak|walkthrough[^.]*print|lessons? print|prints? (every|all)[^.]*(answer|graded)|'
                  r'default (panel )?state|opens? on the capstone|on first load|on its default render', re.I)
# a sentence that denies a leak does not count ("No leak: the guard refuses...")
NOT_LEAK = re.compile(r'\bno\b[^.]*\bleak|not (a |the )?leaks?\b|no lesson prints|coincidence|avoids|'
                      r'no graded value printed|nothing (is )?printed', re.I)


def leaks(text):
    return any(LEAK.search(s) and not NOT_LEAK.search(s) for s in re.split(r'(?<=[.;!?])\s+', text))

# reviewer-reported leaks, by course
LEAK_COURSES = {c: 'ALL' for c in (
    'basin', 'reservoircalc', 'sim', 'wellcorrelation', 'welldata', 'waterflood', 'dca', 'porepressure',
    'earthmodel', 'mapping', 'rockphysics', 'petrophysics', 'fluid')}
LEAK_COURSES.update({c: 'FIELD' for c in (
    'mbal', 'scal', 'welltest', 'welldesign', 'wellcontrol', 'seismolord', 'completion', 'perfsand')})

# redesigns whose only ground is a leak (the answer is honest to read, the
# problem is that the course prints it): reclassed none, leak kept
LEAK_ONLY = {
    'reservoircalc': 'ALL',
    'sim': {'deck_cell_count', 'crest_top_ft', 'layer1_dz_ft', 'swof_first_sw', 'sgof_last_sg',
            'vertical_connection_count', 'deck_stoiip_stb', 'stoiip_vs_booking_pct', 'oil_cells_centre_rule',
            'ekene2_deck_top_m', 'correlated_rs_gap_pct', 'deviated_connection_count',
            'deviated_distinct_columns', 'history_total_oil_stb', 'equil_datum_depth_ft'},
    'wellcorrelation': 'ALL_BUT_GUESSABLE',
}

# fixes shipped in this PR
SHIPPED = {
    ('completion', 'beginner', 'drift_surface_casing_m'): {'migration': '20261022_b5_graded_tolerances.sql', 'tol': [5e-08, 1e-07]},
    ('cashflow', 'intermediate', 'jv_breakeven_oil_price_usd_bbl'): {'migration': '20261022_b5_graded_tolerances.sql', 'tol': [0.001, 0.005]},
    ('separation', 'beginner', 'ejulebe1_terminal_velocity_fts'): {'migration': '20261022_b5_graded_tolerances.sql', 'tol': [1e-05, 5e-05]},
    ('separation', 'beginner', 'ejulebe1_velocity_margin'): {'migration': '20261022_b5_graded_tolerances.sql', 'tol': [1e-05, 5e-05]},
    ('separation', 'intermediate', 'ejulebe2_gas_velocity_fts'): {'migration': '20261022_b5_graded_tolerances.sql', 'tol': [1e-05, 5e-05]},
    ('separation', 'advanced', 'ejulebe3_interface_height_ft'): {'migration': '20261022_b5_graded_tolerances.sql', 'tol': [1e-05, 5e-05]},
    ('fdp', 'beginner', 'ukot_base_irr_low_root_pct'): {'suite': 'src/utils/fdp/planEconomics.js irrReason prints each root to 4 decimals'},
}

# the B4/B5 round-off (lead's pick on each owner decision, 2026-09-21): generated
# by roundoff_capstones.py. A tolerance fix is checked by audit.py --post like the
# ones above; a prompt-copy fix moves no field. `decided` clears the owner flag,
# because the decision is taken; `class` records the class once the fix ships.
RO_FISCAL = '20261023c_ro_fiscal_tolerances.sql'
SHIPPED.update({
    ('fiscal', 'beginner', 'con_total_government_take_musd'): {'migration': RO_FISCAL, 'tol': [0.001, 0.05], 'decided': True},
    ('fiscal', 'intermediate', 'psc_npv_musd'): {'migration': RO_FISCAL, 'tol': [0.001, 0.05], 'decided': True},
    ('fiscal', 'advanced', 'cmp_top_npv_musd'): {'migration': RO_FISCAL, 'tol': [0.001, 0.05], 'decided': True},
    ('fiscal', 'advanced', 'cmp_psc_effective_tax_rate_pct'): {'migration': RO_FISCAL, 'tol': [0.0001, 0.05], 'decided': True},
    ('fiscal', 'advanced', 'cmp_psc_price_sweep_at_60_pct'): {'migration': RO_FISCAL, 'tol': [0.0001, 0.05], 'decided': True},
    ('fiscal', 'advanced', 'cmp_psc_capex_loss_last_tenth_musd'): {'migration': RO_FISCAL, 'tol': [0.001, 0.1], 'decided': True},
    ('fiscal', 'advanced', 'cmp_psc_capex_loss_eight_point_musd'): {'migration': RO_FISCAL, 'tol': [0.001, 0.1], 'decided': True},
    ('fiscal', 'advanced', 'cmp_con_price_climb_pct_points'): {'migration': RO_FISCAL, 'tol': [0.0001, 0.1], 'decided': True},
    ('cementing', 'advanced', 'min_standoff_rigid'): {
        'migration': '20261023b_ro_capstone_cementing.sql', 'class': 'none', 'decided': True,
        'prompt': 'the prompt and advanced m06 l02 now say field 5 is the smallest rigid standoff over both bores '
                  '(blade ratio of each bore less that interval\'s sag, zero where vertical), which is what the engine '
                  'grades; no regrade, the engine is physically right'},
    ('casingtubing', 'advanced', 'helical_limit_N'): {
        'migration': '20261023b_ro_capstone_casingtubing.sql',
        'prompt': 'the prompt and advanced m06 l02 state g = 9.80665 m/s2'},
    ('gaswell', 'advanced', 'plunger_liquid_per_day_bbl'): {
        'migration': '20261023b_ro_capstone_gaswell.sql',
        'prompt': 'the prompt names field 6 as the second hand-reachable value alongside field 3'},
})


# B5 FOLLOW-ON W1 (grade integrity), generated by w1_capstones.py from w1/<course>.json
# and its TIGHTEN list. Each entry carries `wave: w1`, so `audit.py --post` checks
# it only with `--wave w1` (the round-off dry run, which runs before W1, is
# unaffected). A re-key records the replacement field and its annotation (the
# post-W1 field is gated as class none); a key that survives with a prompt or
# panel fix records its post-W1 annotation (`annot_update`) and moves class.
def w1_shipped():
    sys.path.insert(0, HERE)
    import w1_capstones as w1
    out = {}
    for course, s in sorted(w1.load_specs().items()):
        mig = f'20261024a_w1_{course}.sql'
        for tier, t in s['tiers'].items():
            for old_key, nf in t.get('fields', {}).items():
                ann = dict(t.get('annot', {}).get(nf['key'], {}))
                ann = {k: v for k, v in ann.items() if k not in ('default_state_prints', 'lesson_prints')}
                out[(course, tier, old_key)] = {
                    'migration': mig, 'wave': 'w1', 'decided': True,
                    'rekey': {'key': nf['key'], 'label': nf['label'], 'unit': nf['unit'],
                              'expected': float(nf['expected']), 'tol': float(nf['tol'])},
                    'rekey_annot': {**ann, 'class': 'none', 'owner_decision': False, 'leak': bool(
                        t.get('annot', {}).get(nf['key'], {}).get('default_state_prints')
                        or t.get('annot', {}).get(nf['key'], {}).get('lesson_prints')
                        or t.get('leak_updates', {}).get(nf['key']))}}
            ups = dict(s.get('annot_updates', {}))
            ups.update(t.get('annot_updates', {}))
            for key, up in ups.items():
                out[(course, tier, key)] = {'migration': mig, 'wave': 'w1', 'decided': True, 'class': up.pop('class', 'none'),
                                            'annot_update': up, 'prompt': t.get('why', '')[:300]}
    for course, tier, key, old, new, why in w1.TIGHTEN:
        e = out.setdefault((course, tier, key), {'migration': f'20261024a_w1_{course}.sql', 'wave': 'w1', 'decided': True})
        e['tol'] = [old, new]
        e['class'] = 'tolerance'
    return out


SHIPPED.update(w1_shipped())


# B5 FOLLOW-ON W2 (publish inputs in prompts and lessons), from the specs
# w2/<course>.json that w2/build_specs.mjs writes and w2_capstones.py turns into
# 20261025a_w2_<course>.sql. W2 moves no key, expected value or tolerance: a
# field it unlocks keeps its key and moves to class none with source
# hand-calc, and records the published text (`prompt_contains`) that
# `audit.py --post --wave w2` requires in the live prompt, or the lesson files
# that carry it (checked by src/lib/w2PublishedInputs.test.js, which also
# re-runs the vendored engines on the published inputs). A field a spec names
# but leaves for a later wave (`not_reproduced`) is not moved; a `suite_only`
# field moves to source suite-app when the spec names its W3 `suite_route`.
W2_LEFT = {'not_reproduced', 'suite_only'}


def w2_shipped():
    out = {}
    for p in sorted(glob.glob(os.path.join(HERE, 'w2', '*.json'))):
        s = json.load(open(p))
        course = s['course']
        for tier, t in s['tiers'].items():
            left = set().union(*[set(t.get(k, [])) for k in W2_LEFT])
            moves = t.get('fields_moved_class') or [k for k in t.get('expected', {}) if k not in left]
            edits = t.get('prompt_edits', [])
            lessons = sorted({e[0] for e in t.get('lesson_edits', [])})
            where = ' and '.join(x for x in ((
                'the capstone prompt (W2 publishes the inputs)' if edits else ''),
                ('the lessons ' + ', '.join(os.path.basename(l) for l in lessons) if lessons else '')) if x)
            # a field the prompt now routes to a Suite surface W3 built (the
            # wellcost case file): readable at full precision, source suite-app
            sr = t.get('suite_route')
            if sr:
                for key in t.get('suite_only', []):
                    out[(course, tier, key)] = {
                        'migration': f'20261025a_w2_{course}.sql', 'wave': 'w2', 'decided': True, 'class': 'none',
                        'annot_update': {'source': 'suite-app', 'source_ref': sr['source_ref'], 'printed': 'full',
                                         'answer_space': None, 'guess_p': None, 'fix': None, 'evidence': sr['evidence']},
                        'prompt_contains': [b for _, b in edits], 'lessons': [], 'lesson_contains': [],
                    }
            for key in moves:
                e = t['expected'][key]
                up = {
                    'source': 'hand-calc', 'source_ref': f'{where}; spec docs/graded-field-audit/w2/{course}.json',
                    'printed': 'full', 'answer_space': None, 'guess_p': None, 'fix': None,
                    'evidence': (f"W2: {t['why']} The published inputs reproduce {key} = {e['reproduced']!r} through the "
                                 f"vendored engines against the key {e['expected']!r} (tol {e['tol']}); "
                                 'src/lib/w2PublishedInputs.test.js re-runs it.'),
                }
                up.update(t.get('annot_updates', {}).get(key, {}))
                out[(course, tier, key)] = {
                    'migration': f'20261025a_w2_{course}.sql' if edits else None, 'wave': 'w2', 'decided': True,
                    'class': 'none', 'annot_update': up,
                    'prompt_contains': [b for _, b in edits], 'lessons': lessons,
                    'lesson_contains': [[f, a + ins] for f, a, ins in t.get('lesson_edits', [])],
                }
    return out


SHIPPED.update(w2_shipped())


# B5 FOLLOW-ON W3 (Suite Full precision), from w3/<course>.json. The Suite app a
# field is read in gains a Full precision switch (Suite PRs named in the spec);
# the brief gains one sentence naming it (20261026_w3_<course>.sql, prompt only).
# Each field the switch now prints at its graded precision records its post-W3
# annotation (`annot_update`: printed, display_ref, evidence) and moves class;
# `printed_before` keeps the Suite print it replaced, so audit.py --selftest can
# prove the class move rests on the new print. `prompt_append` is checked by
# audit.py --post --wave w3.
def w3_shipped():
    out = {}
    for p in sorted(glob.glob(os.path.join(HERE, 'w3', '*.json'))):
        s = json.load(open(p))
        course = s['course']
        for tier, t in s['tiers'].items():
            for key, up in t.get('annot_updates', {}).items():
                up = dict(up)
                e = {'wave': 'w3', 'decided': True, 'class': up.pop('class', 'none'), 'annot_update': up,
                     'suite': s.get('suite', '')}
                if t.get('append'):
                    e['migration'] = f'20261026_w3_{course}.sql'
                    e['prompt_append'] = t['append'].strip()
                out[(course, tier, key)] = e
    return out


def overlay(later):
    # a key two waves both ship (W2 publishes a lesson route, W3 a Suite print):
    # the later wave's annotation lands on top, the earlier wave's checks
    # (prompt_contains, lesson_contains, migration) are kept
    for k, e in later.items():
        prev = SHIPPED.get(k)
        # an entry that chains the earlier fix itself (`prior`, W5 re-keys) replaces it
        if isinstance(prev, dict) and prev.get('wave') != e.get('wave') and 'prior' not in e:
            merged = dict(prev)
            merged.update({x: v for x, v in e.items() if x != 'annot_update'})
            merged['annot_update'] = {**prev.get('annot_update', {}), **e.get('annot_update', {})}
            if not e.get('migration') and prev.get('migration'):
                merged['migration'] = prev['migration']
            SHIPPED[k] = merged
        else:
            SHIPPED[k] = e


overlay(w3_shipped())


# B5 FOLLOW-ON W4a (typed-case panel modes, drilling rows of section 1 route b
# and the casingtubing panel row of section 2), from w4a/<course>.json. Each
# field gains a panel route: its post-W4a annotation (`annot_update`) names the
# panel view and the precision it prints, and the entry carries `route`, which
# audit.py checks: a field that ships a route may no longer be `unobtainable`
# and must be class none with no flag. No key, expected or tol moves, so
# `audit.py --post` has nothing extra to check; a prompt pointer, where there
# is one, is 20261027a_w4_<course>.sql.
def w4a_shipped():
    out = {}
    for p in sorted(glob.glob(os.path.join(HERE, 'w4a', '*.json'))):
        s = json.load(open(p))
        course = s['course']
        has_prompt = any(t.get('prompt_edits') for t in s['tiers'].values())
        for tier, t in s['tiers'].items():
            for key, up in t.get('annot_updates', {}).items():
                up = dict(up)
                route = up.pop('route')
                e = {'wave': 'w4a', 'decided': True, 'class': up.pop('class', 'none'), 'annot_update': up, 'route': route}
                if has_prompt:
                    e['migration'] = f'20261027a_w4_{course}.sql'
                out[(course, tier, key)] = e
    return out


overlay(w4a_shipped())


# B5 FOLLOW-ON W4 PART B (typed "your case" panel modes), from w4b/<course>.json.
# A field whose graded value a typed panel mode now prints at the graded precision
# moves to source `nextgen-panel`, class `none`; `case_mode` names the panel, the
# mode and the test, and audit.py checks all three still exist. The capstone brief
# gains one pointer sentence (20261027b_w4_<course>.sql, prompt only); no key,
# expected value or tolerance moves.
def w4b_shipped():
    out = {}
    for p in sorted(glob.glob(os.path.join(HERE, 'w4b', '*.json'))):
        s = json.load(open(p))
        course = s['course']
        for tier, t in s['tiers'].items():
            for key, k in t.get('keys', {}).items():
                ref = f"{k['panel']}:{k['line']}"
                out[(course, tier, key)] = {
                    'migration': f'20261027b_w4_{course}.sql', 'wave': 'w4b', 'decided': True, 'class': 'none',
                    'prompt': t['pointer'][:300],
                    'case_mode': {'panel': k['panel'], 'mode': k['mode'], 'test': k['test']},
                    'annot_update': {
                        'source': 'nextgen-panel',
                        'source_ref': f"{ref} ({k['mode']} mode: the case typed as the prompt states it)",
                        'printed': {'decimals': k['decimals']}, 'display_scale': 1,
                        'display_ref': f"{ref} {k.get('formatter', '')}".strip(),
                        'fix': None, 'recommendation': None,
                        'evidence': k['evidence']}}
    return out


overlay(w4b_shipped())


# B5 FOLLOW-ON W5, builder D (section 3 pick B, strip), generated by
# w5d_capstones.py. A stripped tier keeps every key; what changes is that
# nothing prints its answers before the learner works (each course's
# capstoneLeak.test.jsx) and its brief loses the W1 open-book label. Every
# field on the tier records `stripped` (wave w5d) and `leak: false`, beside any
# fix it already carries. `audit.py --post --wave w5d` checks the brief.
def w5d_stripped():
    sys.path.insert(0, HERE)
    import w5d_capstones as w5d
    return {(course, tier): {'migration': f'20261028d_w5_{course}.sql', 'wave': 'w5d', 'why': why}
            for course, tiers in w5d.STRIP.items() for tier, why in tiers.items()}


STRIPPED = w5d_stripped()


# B5 FOLLOW-ON W5 (leak re-case A and strip B), generated by w5_capstones.py from
# w5/<course>.json. A pick-A tier re-keys every field onto a case of its own; each
# entry carries its wave (w5a, w5b, ...) and `closes_leak`, so `audit.py --post
# --wave <w5x>` also proves the replacement is printed nowhere. A live key that W1
# had already re-keyed is traced back to its baseline key, and W1's fix is kept as
# `prior`, so a W1-only dry run still checks W1's state. The per-field `leak` flag
# in the annotation (and so in fields.json) is left as the baseline found it:
# w1_capstones.py reads it for the open-book tiers it generated.
def w5_shipped(shipped):
    sys.path.insert(0, HERE)
    import w5_capstones as w5
    out = {}
    for course, s in sorted(w5.load_specs().items()):
        # a W1 replacement key, traced to the baseline key it replaced
        back = {(c, t, v['rekey']['key']): k for (c, t, k), v in shipped.items()
                if c == course and isinstance(v, dict) and 'rekey' in v}
        for tier, t in s['tiers'].items():
            if t['pick'] != 'A':
                continue
            nf = w5.new_fields(s, tier)
            for live_key, f in zip(t['rekey'], nf):
                base_key = back.get((course, tier, live_key), live_key)
                ann = dict(t.get('annot', {}).get(f['key'], {}))
                printed = ann.pop('default_state_prints', False) or ann.pop('lesson_prints', False)
                entry = {'migration': s['migration'], 'wave': s['wave'], 'decided': True, 'closes_leak': True,
                         'rekey': {'key': f['key'], 'label': f['label'], 'unit': f['unit'],
                                   'expected': float(f['expected']), 'tol': float(f['tol'])},
                         'rekey_annot': {**ann, 'class': 'none', 'owner_decision': False, 'leak': bool(printed)}}
                prior = shipped.get((course, tier, base_key))
                if prior:
                    entry['prior'] = {k: v for k, v in prior.items() if k not in ('decided', 'class', 'annot_update')}
                out[(course, tier, base_key)] = entry
    return out


overlay(w5_shipped(SHIPPED))


# B5 FOLLOW-ON W5 part c (section 3 leak re-case and strip), generated by
# w5c_capstones.py from w5c/<course>.json. A pick A tier re-keys every field
# onto its new case: each baseline key records its W5 replacement with
# `wave: w5c`, and any earlier (W1) fix on the same key rides along as `prior` (audit.py effective),
# so `audit.py --post --wave w1` still checks the W1 state and `--wave w1
# --wave w5c` checks this one. A pick B tier moves no field; its leak closes.
def w5c_shipped(prev):
    sys.path.insert(0, HERE)
    import w5c_capstones as w5
    base = {(c['app'], c['tier']): c for c in json.load(open(os.path.join(HERE, 'caps.json')))}
    out, closed = {}, {}
    for course, s in sorted(w5.load_specs().items()):
        for tier, t in s['tiers'].items():
            closed[(course, tier)] = f"w5c pick {t['pick']}"
            if t['pick'] != 'A':
                continue
            mig = t.get('file', f'{w5.PREFIX}{course}.sql')
            for f0, nf in zip(base[(course, tier)]['fields'], w5.spec_fields(s, tier)):
                k = (course, tier, f0['key'])
                ann = {x: v for x, v in t['annot'][nf['key']].items() if x not in ('default_state_prints', 'lesson_prints')}
                e = {'migration': mig, 'wave': 'w5c', 'decided': True,
                     'rekey': {'key': nf['key'], 'label': nf['label'], 'unit': nf['unit'],
                               'expected': float(nf['expected']), 'tol': float(nf['tol'])},
                     'rekey_annot': {**ann, 'class': 'none', 'owner_decision': False, 'leak': False}}
                if k in prev:
                    p = prev[k]
                    e['prior'] = {x: v for x, v in p.items() if x not in ('decided', 'class', 'annot_update')}
                    if p.get('class'):
                        e['class'] = p['class']
                    if p.get('annot_update'):
                        e['annot_update'] = p['annot_update']
                out[k] = e
    return out, closed


_W5C, W5C_CLOSED = w5c_shipped(SHIPPED)
SHIPPED.update(_W5C)


# HELD DECISIONS (HD), 2026-09-22, generated by hd_capstones.py from
# hd/<course>.json. A tightening keeps the key and moves only its tol, recorded
# like W1's TIGHTEN (`tol` [old, new], class tolerance) with `wave: hd`, so
# `audit.py --post --wave hd` checks the new tol on the replay and a post dump
# without --wave hd reads it as an unnamed move. `annot_update` records where
# the learner reads the value after the earlier waves moved its route.
def hda_shipped():
    out = {}
    for p in sorted(glob.glob(os.path.join(HERE, 'hd', '*.json'))):
        s = json.load(open(p))
        course = s['course']
        for tier, t in s['tiers'].items():
            for tt in t.get('tighten', []):
                out[(course, tier, tt['key'])] = {
                    'migration': s['file'], 'wave': 'hd', 'decided': True, 'class': 'tolerance',
                    'tol': [float(tt['tol_old']), float(tt['tol_new'])],
                    'annot_update': dict(tt.get('annot_update', {}))}
    return out


overlay(hda_shipped())


# HELD DECISIONS (HD), 2026-09-22, generated by hd_capstones.py from hd/<course>.json.
# A re-key replaces one live field in place and closes the leak that held it: the
# baseline key records its replacement with `wave: hd` and `closes_leak`, and the
# fix it already carried (W4a's route on hydraulics beginner) rides along as
# `prior`, with its class and annotation kept (as w5c does), so `audit.py --post`
# without `--wave hd` still checks the post-W2-W6 state.
def hdc_shipped(prev):
    sys.path.insert(0, HERE)
    import hdc_capstones as hd
    out = {}
    for course, s in sorted(hd.load_specs().items()):
        for tier, t in s['tiers'].items():
            for old_key, nf in t.get('fields', {}).items():
                k = (course, tier, old_key)
                ann = {x: v for x, v in t['annot'][nf['key']].items() if x not in ('default_state_prints', 'lesson_prints')}
                e = {'migration': s['migration'], 'wave': s['wave'], 'decided': True, 'closes_leak': True,
                     'rekey': {'key': nf['key'], 'label': nf['label'], 'unit': nf['unit'],
                               'expected': float(nf['expected']), 'tol': float(nf['tol'])},
                     'rekey_annot': {**ann, 'class': 'none', 'owner_decision': False, 'leak': False}}
                p = prev.get(k)
                if p:
                    e['prior'] = {x: v for x, v in p.items() if x not in ('decided', 'class', 'annot_update')}
                    if p.get('class'):
                        e['class'] = p['class']
                    if p.get('annot_update'):
                        e['annot_update'] = p['annot_update']
                out[k] = e
    return out


overlay(hdc_shipped(SHIPPED))


def main(raw):
    out = os.path.join(HERE, 'annot')
    os.makedirs(out, exist_ok=True)
    for p in sorted(glob.glob(os.path.join(raw, '*.json'))):
        a = json.load(open(p))
        c = a['course']
        rule = LEAK_ONLY.get(c)
        for f in a['fields']:
            text = ' '.join(str(f.get(k) or '') for k in ('evidence', 'notes', 'recommendation'))
            lc = LEAK_COURSES.get(c)
            f['leak'] = lc == 'ALL' or (lc == 'FIELD' and leaks(text))
            if rule and f['class'] == 'redesign':
                guess = (f.get('guess_p') or 0) >= 0.25
                if rule == 'ALL' or (rule == 'ALL_BUT_GUESSABLE' and not guess) or (isinstance(rule, set) and f['key'] in rule):
                    f['reclassed_from'] = 'redesign'
                    f['class'] = 'none'
                    f['leak'] = True
            s = SHIPPED.get((c, f['tier'], f['key']))
            if s and s.get('annot_update'):
                if s.get('wave') == 'w3' and 'printed' in s['annot_update']:
                    s = {**s, 'printed_before': f.get('printed')}
                f.update(s['annot_update'])
            if s and s.get('decided'):
                f['owner_decision'] = False
            if s and s.get('class') and s['class'] != f['class']:
                f['reclassed_from'] = f['class']
                f['class'] = s['class']
            s = {k: v for k, v in s.items() if k not in ('decided', 'class', 'annot_update')} if s else s
            f['shipped'] = s
            st = STRIPPED.get((c, f['tier']))
            if st:
                f['stripped'] = st
                f['leak'] = False
            if (c, f['tier']) in W5C_CLOSED:
                f['leak'] = False
                f['leak_closed'] = W5C_CLOSED[(c, f['tier'])]
            if s and 'tol' in s:
                f['fix'] = {'new_tol': s['tol'][1]}
                if f['class'] == 'none':
                    f['class'] = 'tolerance'
        json.dump(a, open(os.path.join(out, f'{c}.json'), 'w'), indent=1, ensure_ascii=False)
        open(os.path.join(out, f'{c}.json'), 'a').write('\n')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '/root/b5/annot')
