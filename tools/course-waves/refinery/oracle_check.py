#!/usr/bin/env python3
"""GATE: an INDEPENDENT ORACLE computes every one of the eighteen graded fields.

Rule 4 of the brief: do not grade an output no oracle checks. The engines repo
carries two stdlib Python oracles for this course's modules, written from the
rules rather than from the JavaScript (MD2-0):

  oracle_refineryplanning.py  the plan by an exact rational simplex accepted
                              only with a duality certificate (exact_simplex),
                              stream values by exact re-solve, the variance
                              from explicit ledgers signed by margin;
  oracle_modularrefinery.py   annual accounts in barrels and dollars and a
                              DATED tax-loss ledger used oldest first.

Its goldens show each graded EXPORT is covered. That is not yet proof the
oracle reaches the same answer on THESE records, so this gate imports the
vendored oracles themselves and computes each graded field from the capstone
conditions with the oracle's own functions, then compares with fields.json at
the field's own tolerance.

TWO ORACLE FUNCTIONS ARE NOT PARAMETRISED, and are driven here without
restating their arithmetic:
  * oracle_modularrefinery.accounts() reads the module-level PRICES table.
    The gate sets PRICES to the record's prices before each call.
  * oracle_refineryplanning.variance_case() writes its two ledgers as dict
    literals inside the function. The gate re-compiles the function's own
    source with those two assignments pointed at the record's ledgers (an AST
    edit of the two right-hand sides only), so every line of its variance
    arithmetic is the oracle's. The plan ledger it is given is built from the
    ORACLE's exact plan, never from the engine's.

It also runs the teaching digest's ABUA plan and ODIOMA expansion through the
oracles and compares the figures the digest prints, as a second population.

Negative control: --plant moves one oracle answer by ten tolerances and the
gate must go red on exactly that field.
"""
import ast
import inspect
import json
import os
import subprocess
import sys

WAVE = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('MD_ENGINES', '/root/wt-md-refinery-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'downstream'))
import oracle_refineryplanning as ORP  # noqa: E402
import oracle_modularrefinery as OMR  # noqa: E402


def node_json(module, names):
    src = f"""
const M = await import('{WAVE}/{module}');
const out = {{}};
for (const k of {json.dumps(names)}) out[k] = M[k];
console.log(JSON.stringify(out));
"""
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', src],
                                     capture_output=True, text=True, check=True).stdout)


K = node_json('refinery_fields_capstone.mjs', ['IKARAMA', 'AMASSOMA', 'KOLOAMA', 'PERIOD_START', 'PERIOD_DAYS'])
T = node_json('refinery_fields.mjs', ['ABUA', 'ODIOMA'])
STICK_EXPONENT = 0.6  # the oracle's own stick-built exponent (scale_cases); H1, pinned in the engines gate


def plan_of(c):
    return ORP.plan({'streams': c['streams'], 'crudes': c['crudes'], 'units': c['units'], 'products': c['products']})


def feas_inputs(c):
    keys = ['configurationId', 'capacityBpd', 'onstreamDays', 'scenarioId', 'crudeCostPerBbl', 'baseCost',
            'baseCapacity', 'fixedOpexPerYear', 'variableOpexPerBbl', 'projectLife', 'constructionYears', 'taxRate']
    inp = {k: c[k] for k in keys if k in c}
    inp['modularExponent'] = c.get('modularExponent', OMR.DEFAULTS['modularExponent'])
    return inp


def accounts(c, **over):
    OMR.PRICES = dict(c['prices'])
    return OMR.accounts(dict(feas_inputs(c), **over))


def variance(plan_ledger, actual_ledger):
    """Run the oracle's own variance_case with its two ledgers replaced."""
    tree = ast.parse(inspect.getsource(ORP.variance_case))
    swapped = 0
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            name = node.targets[0].id
            if name in ('plan_ledger', 'actual'):
                node.value = ast.Name(id={'plan_ledger': '__PLAN__', 'actual': '__ACTUAL__'}[name], ctx=ast.Load())
                swapped += 1
    if swapped != 2:
        raise SystemExit(f'  GATE REFUSES: expected to redirect 2 ledger literals in variance_case, found {swapped}')
    ast.fix_missing_locations(tree)
    ns = dict(vars(ORP))
    ns['__PLAN__'] = plan_ledger
    ns['__ACTUAL__'] = actual_ledger
    exec(compile(tree, '<oracle variance_case>', 'exec'), ns)
    return ns['variance_case']()


def plan_ledger_of(c, res):
    led = {}
    for x, v in zip(c['crudes'], res['crudeRuns']):
        if v > 0:
            led[(x['id'], 'receipt')] = (v, v * x['cost'])
    for u, v in zip(c['units'], res['unitRuns']):
        if v > 0:
            led[(u['id'], 'unit_run')] = (v, v * u['opex'])
    for p, v in zip(c['products'], res['productMakes']):
        if v > 0:
            led[(p['id'], 'delivery')] = (v, v * p['price'])
    return led


def oracle_fields():
    O = {}
    # IKARAMA
    I = K['IKARAMA']
    rows, capex, value = accounts(I)
    _, stick, _ = accounts(I, modularExponent=STICK_EXPONENT)
    y = rows[I['constructionYears']]
    O['ikarama_modular_capex_usd'] = capex
    O['ikarama_stick_built_capex_usd'] = stick
    O['ikarama_gross_value_per_bbl'] = value
    O['ikarama_annual_throughput_bbl'] = y['bbl']
    O['ikarama_gross_margin_per_bbl'] = (y['revenue'] - y['crude'] - y['variable']) / y['bbl']
    O['ikarama_first_year_revenue_usd'] = y['revenue']
    # AMASSOMA
    A = K['AMASSOMA']
    r = plan_of(A)
    assert r['status'] == 'optimal', r['status']
    total = sum(r['crudeRuns'])
    cdu = next(i for i, u in enumerate(A['units']) if not u['feed'])
    mv = {s['id']: s['marginalValue'] for s in r['streamBalance']}
    O['amassoma_crude_run_bbl'] = total
    O['amassoma_cdu_utilisation_pct'] = r['unitRuns'][cdu] / A['units'][cdu]['capacity'] * 100
    O['amassoma_plan_margin_usd'] = r['margin']
    O['amassoma_gross_margin_per_bbl'] = r['margin'] / total
    O['amassoma_naphtha_value_per_bbl'] = mv['naphtha']
    O['amassoma_gasoil_value_per_bbl'] = mv['gasoil']
    # KOLOAMA
    KO = K['KOLOAMA']
    r = plan_of(KO)
    assert r['status'] == 'optimal', r['status']
    led = plan_ledger_of(KO, r)
    act = {(a['materialId'], a['type']): (a['quantity'], a['cost']) for a in KO['actuals']}
    v = variance(led, act)
    line = {(l['materialId'], l['type']): l for l in v['lines']}
    O['koloama_usan_price_variance_usd'] = line[('usan', 'receipt')]['priceVariance']
    O['koloama_diesel_volume_variance_usd'] = line[('diesel', 'delivery')]['volumeVariance']
    O['koloama_margin_variance_usd'] = v['marginEffect']
    O['koloama_cost_variance_usd'] = v['costTotal']
    X = KO['expansion']
    rows, _, _ = accounts(X)
    tax = OMR.tax_with_ledger(rows, X['taxRate'])
    first = next(t for t in tax if t > 0)
    O['koloama_first_tax_mm'] = first / 1e6
    O['koloama_lifetime_tax_mm'] = sum(tax) / 1e6
    return O


def second_population():
    """The teaching digest's ABUA plan and ODIOMA expansion, through the oracles."""
    digest = open(os.path.join(WAVE, 'digest.txt'), encoding='utf-8').read()
    checks = []
    A = T['ABUA']
    r = plan_of(A)
    checks.append(('ABUA margin', f"{r['margin']:.2f}", f"| margin | {r['margin']:.2f} |"))
    checks.append(('ABUA total crude', f"{sum(r['crudeRuns']):.2f}", f"| total crude (bbl) | {sum(r['crudeRuns']):.2f} |"))
    for s in r['streamBalance']:
        val = 0.0 if abs(s['marginalValue']) < 5e-5 else s['marginalValue']
        checks.append((f"ABUA {s['id']} value", f"{val:.4f}", f"| marginal value of {s['id']} ($/bbl) | {val:.4f} |"))
    X = T['ODIOMA']['expansion']
    rows, _, _ = accounts(X)
    tax = OMR.tax_with_ledger(rows, X['taxRate'])
    checks.append(('ODIOMA lifetime tax', f"{sum(tax) / 1e6:.4f}", f"total tax over the life: {sum(tax) / 1e6:.4f} MM with the loss carried forward"))
    bad = [(n, v) for n, v, needle in checks if needle not in digest]
    return len(checks), bad


def main():
    fields = json.load(open(os.path.join(WAVE, 'fields.json')))
    O = oracle_fields()
    if '--plant' in sys.argv:
        O['amassoma_plan_margin_usd'] += 5
    bad = []
    print(f'  oracle modules: {ORP.__name__} (on exact_simplex), {OMR.__name__}')
    for tier, key, value, tol in fields:
        o = O.get(key)
        same = o is not None and abs(o - value) <= tol
        print(f"  {'OK  ' if same else 'DIFF'} {tier:<13} {key:<36} engine {value:>20}  oracle {o!r}")
        if not same:
            bad.append(key)
    n, teach_bad = second_population()
    print(f'  teaching figures checked against the oracles: {n}, disagreeing with the digest: {len(teach_bad)} {teach_bad}')
    if len(fields) != 18 or len(O) != 18:
        print('  GATE REFUSES: eighteen fields and eighteen oracle answers expected')
        return 2
    print(f'  graded fields the oracle reproduces: {18 - len(bad)} of 18')
    return 1 if (bad or teach_bad) else 0


sys.exit(main())
