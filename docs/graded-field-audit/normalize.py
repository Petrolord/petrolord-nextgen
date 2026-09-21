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
            f['shipped'] = s
            if s and 'tol' in s:
                f['fix'] = {'new_tol': s['tol'][1]}
                if f['class'] == 'none':
                    f['class'] = 'tolerance'
        json.dump(a, open(os.path.join(out, f'{c}.json'), 'w'), indent=1, ensure_ascii=False)
        open(os.path.join(out, f'{c}.json'), 'a').write('\n')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '/root/b5/annot')
