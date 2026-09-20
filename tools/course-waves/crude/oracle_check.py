#!/usr/bin/env python3
"""GATE: an INDEPENDENT ORACLE computes every one of the eighteen graded fields.

Rule 4 of the brief: do not grade an output no oracle checks. The engines repo
carries a stdlib Python oracle per module, written from the rules rather than
from the JavaScript (FINDINGS-crude.md says what each is independent of). Its
goldens show each graded EXPORT is covered; that is not yet proof that the
oracle reaches the same answer on THESE records. So this gate imports the
vendored oracles themselves and computes each graded field from the capstone
conditions with the oracle's own functions:

  oracle_crudeassay.blend_cargo    loads the IDAMA cargo in barrels and pounds:
                                   API, sulfur, vanadium, mass share, SARA and CII
  oracle_crudeassay.cut_yield      yields by segment overlap
  oracle_crudeassay.blended_curve  the OGBELE blend's curve from barrels distilled
  oracle_crudeassay.t_at           its 50 percent point by bisection
  oracle_crudeassay.netback_cargo  a 100,000 bbl account: gross, loss, netback
  oracle_productblending.case      the ONNE recipe by exact rational vertex
                                   enumeration on physically built rows; the
                                   value of relief by exact re-solve with the
                                   limit moved 1e-7 either way

WHAT IS COMPARED, AND HOW TIGHTLY. Each oracle value must sit within the
field's own grading tolerance of the engine's value. For every relief the
oracle gives two one-sided difference quotients over an exact step of 1e-7 in
the limit (relax side, tighten side). The engine's derivative must lie between
them, widened by the tolerance, and the two sides must agree to within twice
the tolerance, which proves the row is not dual degenerate at this optimum (a
degenerate row has an interval of correct prices whole dollars wide, and no
single graded answer). The RVP sides differ by about 6e-5: the value of
relief curves in the limit (the index is RVP to a power) and the oracle's index
is a float, so its quotient over a 1e-7 step carries that much. The sulfur and
octane rows are rational throughout and their sides agree to about 1e-8.
The optimum must be unique, or a graded volume would be one of many.

The capstone conditions are read out of crude_fields_capstone.mjs by node and
handed over as JSON, so nothing is retyped here.

A second population: the teaching digest's own OBIGBO export blend, KWALE
valuation and APAPA PMS recipe are run through the same oracles and the
digest's printed figures are checked against them.

Negative control: --plant moves one oracle answer by 1e-3 and the gate must go
red on exactly that field.

The ONNE enumeration takes a minute or two; it is exact, not a simplex.
"""
import json
import os
import subprocess
import sys

WAVE = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('MD_ENGINES', '/root/wt-md-crude-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'downstream'))
import oracle_crudeassay as OC  # noqa: E402
import oracle_productblending as OP  # noqa: E402


def node_json(src):
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', src],
                                     capture_output=True, text=True, check=True).stdout)


def exports(path):
    return node_json(f"""
const K = await import('{path}');
const out = {{}};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function') out[k] = v;
console.log(JSON.stringify(out));""")


K = exports(f'{WAVE}/crude_fields_capstone.mjs')
RULE = {'volume': 'volume', 'mass': 'mass', 'index': 'rvp'}


def spec_tuples(specs):
    out = []
    for s in specs:
        if s['basis'] == 'index' and s['id'] != 'rvp':
            raise SystemExit(f"GATE REFUSES: no oracle rule for index spec {s['id']}")
        out.append((s['id'], RULE[s['basis']], s.get('min'), s.get('max')))
    return out


def lp_case(pool, specs, target):
    comps = [{k: v for k, v in c.items() if k in ('id', 'cost', 'sg', 'minVolume', 'maxVolume', 'ron', 'mon', 'sulfurPpm', 'rvp', 'density', 'cetane', 'viscosityCSt', 'flashPointC')}
             for c in pool]
    return OP.case('capstone', 'oracle_check', comps, None, target, spec_override=specs)


# ------------------------------ IDAMA -------------------------------
idama = K['IDAMA_CRUDES']
barrels = [K['IDAMA_BARRELS'][c['id']] for c in idama]
cargo = OC.blend_cargo(idama, barrels)
cut = K['IDAMA_CUT']
opm = next(c for c in idama if c['id'] == cut['crude'])
abh_i = next(i for i, c in enumerate(idama) if c['id'] == 'abh')

# ------------------------------ OGBELE ------------------------------
og = K['OGBELE_CRUDES']
og_b = [K['OGBELE_SHARES'][c['id']] for c in og]
og_curve = OC.blended_curve(og, og_b)
og_y = {c['id']: OC.cut_yield(og_curve, c['fromF'], c['toF']) for c in K['OGBELE_CUTS']}
ov = K['OGBELE_VALUATION']
og_net = OC.netback_cargo(og_y, ov['prices'], ov['processingCostPerBbl'], ov['freightPerBbl'], ov['lossPercent'])

# ------------------------------- ONNE -------------------------------
onne = lp_case(K['ONNE_POOL'], spec_tuples(K['ONNE_SPECS']), K['ONNE_TARGET'])
if onne['status'] != 'optimal' or not onne['unique']:
    raise SystemExit(f"GATE REFUSES: ONNE is {onne['status']}, unique {onne.get('unique')}")
ids = [c['id'] for c in K['ONNE_POOL']]


def relief(spec_id, bound):
    r = next(x for x in onne['relief'] if x['specId'] == spec_id and x['bound'] == bound)
    return r['relaxSide'], r['tightenSide']


ORACLE = {
    'idama_blend_api': cargo['properties']['api'],
    'idama_blend_sulfur_wtpct': cargo['properties']['sulfurWtPct'],
    'idama_blend_vanadium_ppm': cargo['properties']['vanadiumPpm'],
    'idama_abiteye_mass_share_pct': 100.0 * cargo['massFractions'][abh_i],
    'idama_blend_cii': cargo['cii'],
    'idama_opuama_kerosene_yield_pct': OC.cut_yield(opm['curve'], cut['cut']['fromF'], cut['cut']['toF']),
    'ogbele_blend_t50_f': OC.t_at(og_curve, 50.0),
    'ogbele_blend_kerosene_yield_pct': og_y['kerosene'],
    'ogbele_blend_diesel_yield_pct': og_y['diesel'],
    'ogbele_gross_value_per_bbl': og_net['grossValue'],
    'ogbele_loss_value_per_bbl': og_net['lossValue'],
    'ogbele_netback_per_bbl': og_net['netback'],
    'onne_total_cost_usd': onne['totalCost'],
    'onne_fcc_volume_bbl': onne['volumes'][ids.index('fcc')],
    'onne_butane_volume_bbl': onne['volumes'][ids.index('but')],
    'onne_sulfur_relief_usd_per_ppm': relief('sulfurPpm', 'max'),
    'onne_rvp_relief_usd_per_psi': relief('rvp', 'max'),
    'onne_ron_relief_usd_per_octane': relief('ron', 'min'),
}
if '--plant' in sys.argv:
    ORACLE['ogbele_blend_t50_f'] += 1e-3


def teaching_population():
    """The digest's own figures for three teaching cases, against the oracles."""
    F = exports(f'{WAVE}/crude_fields.mjs')
    digest = open(os.path.join(WAVE, 'digest.txt'), encoding='utf-8').read()
    checks = []
    lib = {c['id']: c for c in F['OBIGBO_LIBRARY']}
    ob = [lib['obl'], lib['egm']]
    ob_cargo = OC.blend_cargo(ob, [F['OBIGBO_BLEND_SHARES']['obl'], F['OBIGBO_BLEND_SHARES']['egm']])
    for label, key in (('API', 'api'), ('sulfur wt%', 'sulfurWtPct'), ('vanadium ppm', 'vanadiumPpm'), ('viscosity cSt', 'viscosityCSt')):
        checks.append((f'OBIGBO {label}', f"| {label} | {ob_cargo['properties'][key]:.4f} |"))
    checks.append(('OBIGBO CII', f"| CII | {ob_cargo['cii']:.4f} |"))
    kw = F['KWALE_CRUDES']
    kw_b = [F['KWALE_SHARES'][c['id']] for c in kw]
    kc = OC.blended_curve(kw, kw_b)
    checks.append(('KWALE T50', f"| blend T50 F (interpolated) | {OC.t_at(kc, 50.0):.4f} |"))
    ky = {c['id']: OC.cut_yield(kc, c['fromF'], c['toF']) for c in F['KWALE_CUTS']}
    kv = F['KWALE_VALUATION']
    kn = OC.netback_cargo(ky, kv['prices'], kv['processingCostPerBbl'], kv['freightPerBbl'], kv['lossPercent'])
    checks.append(('KWALE gross', f"| gross product value $/bbl | {kn['grossValue']:.4f} |"))
    checks.append(('KWALE netback', f"| netback $/bbl | {kn['netback']:.4f} |"))
    pms = lp_case(F['APAPA_PMS_POOL'], [t for t in OP.TEMPLATES['gasoline_50ppm']], F['APAPA_PMS_TARGET'])
    checks.append(('APAPA total cost', f"| total | {F['APAPA_PMS_TARGET']:.4f} | 1.0000 | {pms['totalCost']:.4f} |"))
    for r in pms['relief']:
        if r['relaxSide'] and abs(r['relaxSide']) > 1e-9:
            name = {'sulfurPpm': 'Sulfur maximum', 'rvp': 'RVP maximum'}[r['specId']]
            checks.append((f'APAPA {name} relief', f"| {name} | {r['relaxSide']:.4f} |"))
    bad = [name for name, needle in checks if needle not in digest]
    return len(checks), bad


def main():
    fields = json.load(open(os.path.join(WAVE, 'fields.json')))
    if len(fields) != 18:
        print('  GATE REFUSES: fields.json does not hold eighteen fields')
        return 2
    bad = []
    print(f'  oracle modules: {OC.__name__} ({OC.__file__}), {OP.__name__}')
    for tier, key, value, tol in fields:
        o = ORACLE.get(key)
        if isinstance(o, tuple):
            # The engine's derivative must lie between the oracle's two exact
            # one-sided difference quotients (widened by the tolerance), and the
            # two sides must agree to within twice the tolerance: a dual
            # degenerate row would show a gap of whole dollars.
            lo, hi = min(o), max(o)
            same = None not in o and lo - tol <= value <= hi + tol and hi - lo <= 2 * tol
            shown = f'relax {o[0]!r} tighten {o[1]!r} (sides differ by {hi - lo:.2e})'
        else:
            same = o is not None and abs(o - value) <= tol
            shown = repr(o)
        print(f"  {'OK  ' if same else 'DIFF'} {tier:<13} {key:<34} engine {value!r:<22} oracle {shown}")
        if not same:
            bad.append(key)
    n, teach_bad = teaching_population()
    print(f'  teaching figures checked against the oracles in the digest: {n}, disagreeing: {len(teach_bad)} {teach_bad}')
    print(f'  graded fields the oracle reproduces within tolerance: {18 - len(bad)} of 18')
    return 1 if (bad or teach_bad) else 0


METHOD = {
    'idama_': 'oracle_crudeassay.blend_cargo, the cargo loaded in barrels and pounds',
    'idama_opuama_kerosene_yield_pct': 'oracle_crudeassay.cut_yield by segment overlap on the Opuama Medium curve',
    'ogbele_blend_t50_f': 'oracle_crudeassay.t_at(blended_curve, 50) by bisection',
    'ogbele_blend_kerosene_yield_pct': 'oracle_crudeassay.cut_yield on blended_curve (barrels distilled)',
    'ogbele_blend_diesel_yield_pct': 'oracle_crudeassay.cut_yield on blended_curve (barrels distilled)',
    'ogbele_': 'oracle_crudeassay.netback_cargo, a 100,000 bbl account',
    'onne_': 'oracle_productblending.case, exact rational vertex enumeration on physically built rows',
    'onne_sulfur_relief_usd_per_ppm': 'oracle_productblending.case, exact re-solve with the sulfur limit moved 1e-7 either way',
    'onne_rvp_relief_usd_per_psi': 'oracle_productblending.case, exact re-solve with the RVP limit moved 1e-7 either way',
    'onne_ron_relief_usd_per_octane': 'oracle_productblending.case, exact re-solve with the RON minimum moved 1e-7 either way',
}


def method(key):
    return METHOD.get(key) or next(m for p, m in METHOD.items() if key.startswith(p))


if '--json' in sys.argv:
    # The oracle's eighteen answers and the method each came by, for the
    # go-live's oracle route (gen_golive.py). No comparison, no verdict. A
    # relief carries both exact one-sided quotients (relax, tighten) and their
    # mean as its value.
    out = {}
    for k, v in ORACLE.items():
        if isinstance(v, tuple):
            out[k] = {'method': method(k), 'value': (float(v[0]) + float(v[1])) / 2,
                      'relax': float(v[0]), 'tighten': float(v[1])}
        else:
            out[k] = {'method': method(k), 'value': float(v)}
    print(json.dumps(out))
    sys.exit(0)
sys.exit(main())
