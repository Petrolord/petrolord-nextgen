#!/usr/bin/env python3
"""Generate the FC7 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction, so
the file verifies what it shipped rather than what a generator remembered. The
capstone conditions are read out of fc7_fields_capstone.mjs by node, the
declared constants out of the vendored engine by node, the numbers a learner is
handed are parsed out of the shipped prompts BY POSTGRES, and the published
figures a graded value may not collide with are every numeric literal the
teaching digest prints.

SEVENTEEN OF THE EIGHTEEN ARE REPRODUCED BY CLOSED FORM IN SQL, and the
eighteenth by the equation it is a root of. That is a measurement. The fluid
properties, the Stokes rise, both gravity cuts, the whole liner bank and the bed
cut are closed forms. The Expert's train is closed too, once one looks: the
error function the engine integrates against is the five-term rational form of
Abramowitz and Stegun, built from exp alone, so the whole sixty-bin quadrature,
every stage, both medians and the outlet run here in plpgsql on the capstone's
own stated conditions. The one field that is not closed is the IZOMBE bubble
rise, which the engine finds by a damped iteration on the Schiller-Naumann drag
coefficient. It is asserted as a ROOT of that drag balance rather than by
restating the iteration, which would validate nothing.

AND TEN OF THE EIGHTEEN ARE ASSERTED A SECOND TIME, BY A ROUTE WITH NOTHING IN
COMMON WITH THE FIRST:

  * the Stokes rise, by recovering STANDARD GRAVITY out of it and the three
    graded fluid properties, which reads four graded fields at once;
  * the basin cut and the plate cut FORWARD, as the rise velocity of the graded
    cut droplet against the design rise it was inverted from;
  * the shear penalty from the GRADED turndown rather than the flow;
  * the liner cut FORWARD, as the migration of the ideal droplet across the
    travel in the residence time;
  * the holdup from the GRADED bubble rise;
  * the bed cut FORWARD, as the filter coefficient of the graded droplet times
    the depth, which must be the log of two;
  * the train outlet as the PRODUCT of the stage survivals, with the third
    stage's own removal inferred from the graded figures and checked;
  * and the Reynolds number back to the Stokes velocity it came from.

WHAT IT REFUSES TO WRITE, as FC6's does: a division with a bare integer
denominator, a malformed numeric literal, a refusal that reads a graded value
and does not name it, a graded value that collides at its own shipped tolerance
with a prompt number, a digest number or a held quantity, and an em or en dash.

Usage: python3 gen_golive.py
   FC7_WAVE        the wave directory (default /root/fc-wip-producedwater)
   FC7_REPO        the nextgen clone   (default /root/wt-fc7-nextgen)
   FC7_ENGINE      the vendored engine module (default in FC7_REPO)
   FC7_COURSE_SQL  the course migration this ladder emits, for the prompt sweep
   FC7_GOLIVE_OUT  where to write
"""
import json
import math
import os
import re
import subprocess
import sys

W = os.environ.get('FC7_WAVE', '/root/fc-wip-producedwater')
REPO = os.environ.get('FC7_REPO', '/root/wt-fc7-nextgen')
ENGINE = os.environ.get(
    'FC7_ENGINE', f'{REPO}/packages/engines/engines/facilities/producedWater.js')
COURSE = os.environ.get(
    'FC7_COURSE_SQL', f'{REPO}/migrations/20260925_fc7_producedwater_course.sql')
OUT = os.environ.get(
    'FC7_GOLIVE_OUT', f'{REPO}/migrations/20260925_fc7_producedwater_go_live.sql')
SLUG = 'producedwater'
PATH_ORDER = 45

fields = json.load(open(f'{W}/fields.json'))
assert len(fields) == 18, f'{len(fields)} graded fields'
F = {(t, k): (v, tol) for t, k, v, tol in fields}
assert len({k for _t, k, _v, _tol in fields}) == 18, 'two graded fields share a key'
V = {(t, k): f'v_g_{k}' for t, k, _v, _tol in fields}
assert len(set(V.values())) == 18, 'two graded fields would share one SQL variable'


def node_json(src):
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', src],
                                     capture_output=True, text=True, check=True).stdout)


C = node_json(f"import * as M from '{W}/fc7_fields_capstone.mjs';"
              "const o={};for(const[k,v]of Object.entries(M))if(typeof v!=='function')o[k]=v;"
              "process.stdout.write(JSON.stringify(o));")
D = node_json(f"import {{ DECLARED_CONSTANTS as D }} from '{ENGINE}';"
              "process.stdout.write(JSON.stringify(D));")
API421 = node_json(f"import {{ API_421 as A }} from '{ENGINE}';"
                   "process.stdout.write(JSON.stringify(A));")
G = 9.80665
GRAVITY_IN_ENGINE = node_json(
    "import fs from 'fs';const s=fs.readFileSync(process.argv[1],'utf8');"
    "const m=/const G = ([0-9.]+);/.exec(s);process.stdout.write(JSON.stringify(Number(m[1])));"
    .replace('process.argv[1]', repr(ENGINE)))
assert GRAVITY_IN_ENGINE == G, f'the engine states G = {GRAVITY_IN_ENGINE}'


def f17(x):
    """A float literal SQL will read back as this exact double."""
    return repr(float(x))


def g(t, k):
    return F[(t, k)][0]


# ------------------------------------------------ the engine's own arithmetic
# Written ONCE here for the pre-emission check, in the engine's own order of
# operations, and emitted a second time as SQL below. The two share no code, so
# a slip in either shows up as a disagreement before anything is written.
def mu_w(w):
    return (D['vogelA'] * 10 ** (D['vogelB'] / (w['tC'] + 273.15 - D['vogelC']))
            * (1 + D['salinityViscosityMultiplier'] * (w['tdsPpm'] / 1e6)))


def rho_w(w):
    t = w['tC']
    rho0 = 1000 * (1 - ((t + 288.9414) / (508929.2 * (t + 68.12963))) * (t - 3.9863) ** 2)
    return rho0 + D['brineDensitySlopeKgM3'] * (w['tdsPpm'] / 1e6)


def rho_o(o):
    sg60 = 141.5 / (131.5 + o['apiGravity'])
    return sg60 * D['crudeReferenceWaterKgM3'] * (1 - D['crudeThermalExpansionPerC'] * (o['tC'] - 15.56))


def cut_from_rise(v, mu, rw, ro):
    return math.sqrt((18 * mu * v) / (G * (rw - ro))) * 1e6


def q_of(bwpd):
    return (bwpd * C['BARREL_M3']) / 86400


def cyclone(q, L, mu, rw, ro):
    per = q / L['nLiners']
    t = per / L['designFlowPerLinerM3S']
    ft = min(t, D['overloadTurndown'])
    gf = L['gFieldAtDesign'] * ft * ft
    r = L['linerDiameterM'] / 2
    travel = r * math.sqrt(0.5) - r * L['coreRadiusFraction']
    res = (math.pi * r * r * L['linerLengthM']) / per
    req = travel / res
    d_ideal = math.sqrt((18 * mu * req) / (gf * G * (rw - ro)))
    pen = math.sqrt(t / D['overloadTurndown']) if t > D['overloadTurndown'] else 1
    return dict(turndown=t, penalty=pen, cut=d_ideal * 1e6 * pen, ideal=d_ideal * 1e6,
                gfield=gf, travel=travel, residence=res)


def bed_cut(q, B):
    load = (q / B['areaM2']) * 3600
    lam = (B['filterCoefficientPerM'] * (D['filterReferenceMediaMicron'] / B['mediaMicron']) ** 3
           * (D['filterReferenceLoadingMHr'] / load) ** D['filterLoadingExponent'])
    return B['referenceDropletMicron'] * math.sqrt(math.log(2) / (lam * B['bedDepthM'])), lam


def erf_as(x):
    s = -1 if x < 0 else 1
    a = abs(x)
    t = 1 / (1 + 0.3275911 * a)
    y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t
              - 0.284496736) * t + 0.254829592) * t * math.exp(-a * a)
    return s * y


def train(inlet, grid, stages):
    d50, sig = inlet['d50Micron'], inlet['sigma']
    cdf = lambda d: 0.5 * (1 + erf_as(math.log(d / d50) / (sig * math.sqrt(2))))  # noqa: E731
    lnlo = math.log(d50) - grid['spanSigma'] * sig
    lnhi = math.log(d50) + grid['spanSigma'] * sig
    step = (lnhi - lnlo) / grid['nBins']
    below = cdf(math.exp(lnlo))
    bins = []
    for i in range(grid['nBins']):
        lna = lnlo + step * i
        lnb = lna + step
        cb = cdf(math.exp(lnb))
        bins.append([math.exp((lna + lnb) / 2), math.exp(lna), math.exp(lnb), cb - below])
        below = cb
    tot = sum(b[3] for b in bins)
    bins = [[b[0], b[1], b[2], b[3] / tot] for b in bins]

    def median(bs):
        total = sum(b[3] for b in bs)
        acc = 0.0
        for b in bs:
            f = b[3] / total
            if acc + f >= 0.5:
                within = (0.5 - acc) / f
                return math.exp(math.log(b[1]) + within * math.log(b[2] / b[1]))
            acc += f
        raise AssertionError('no median')

    oiw = inlet['oiwPpm']
    out = []
    for dc, m in stages:
        removed = 0.0
        nb = []
        for b in bins:
            r = (b[0] / dc) ** m
            eff = r / (1 + r)
            removed += b[3] * eff
            nb.append([b[0], b[1], b[2], b[3] * (1 - eff)])
        surv = sum(b[3] for b in nb)
        bins = [[b[0], b[1], b[2], b[3] / surv] for b in nb]
        oiw *= 1 - removed
        out.append(dict(removal=removed * 100, oiw=oiw, median=median(bins)))
    return out


def terminal_rise(dmic, rh, rl, mu):
    d = dmic * 1e-6
    dr = rh - rl
    v = (G * d * d * dr) / (18 * mu)
    for _ in range(300):
        re_ = (rh * v * d) / mu
        cd = 1e12 if re_ < 1e-12 else (0.44 if re_ > 1000 else (24 / re_) * (1 + 0.15 * re_ ** 0.687))
        vb = math.sqrt((4 * G * d * dr) / (3 * cd * rh))
        nxt = 0.5 * (v + vb)
        moved = abs(nxt - v) / max(nxt, 1e-30)
        v = nxt
        if moved <= 1e-13:
            return v
    raise AssertionError('no convergence')


def drag_residual(v, dmic, rh, rl, mu):
    """|v - vBalance(v)| / v: zero at the terminal velocity, which is what defines it."""
    d = dmic * 1e-6
    re_ = (rh * v * d) / mu
    cd = (24 / re_) * (1 + 0.15 * re_ ** 0.687)
    vb = math.sqrt((4 * G * d * (rh - rl)) / (3 * cd * rh))
    return abs(v - vb) / v


# --------------------------------------------------------------- the inputs
OGW, OGO, OGI = C['OGULAGHA_WATER'], C['OGULAGHA_OIL'], C['OGULAGHA_INLET']
OGB, OGP = C['OGULAGHA_BASIN'], C['OGULAGHA_PLATES']
IZW, IZO = C['IZOMBE_WATER'], C['IZOMBE_OIL']
IZL, IZF, IZB = C['IZOMBE_LINERS'], C['IZOMBE_FLOTATION'], C['IZOMBE_FILTER']
TUW, TUO, TUI, TUG = C['TUNU_WATER'], C['TUNU_OIL'], C['TUNU_INLET'], C['TUNU_GRID']
TUP, TUL, TUF = C['TUNU_PLATES'], C['TUNU_LINERS'], C['TUNU_FILTER']
TU_COARSE = C['TUNU_COARSE_DROPLET_MICRON']
OG_Q, IZ_Q, TU_Q = q_of(C['OGULAGHA_BWPD']), q_of(C['IZOMBE_BWPD']), q_of(C['TUNU_BWPD'])

# THE QUANTITIES HELD FOR THE LITERATURE, with the label each is refused under.
HELD = sorted({
    (D['attachmentEfficiency'], 'the attachment efficiency, the one calibration in this module'),
    (3.0, 'the held inverse-cube grain size exponent of the bed'),
})

PRODUCES = {
    'ogulagha_water_viscosity_pas': 'waterViscosityPaS.muPaS',
    'ogulagha_water_density_kgm3': 'waterDensityKgM3.rhoKgM3',
    'ogulagha_oil_density_kgm3': 'oilDensityKgM3.rhoKgM3',
    'ogulagha_droplet_rise_ms': 'stokesRiseMS.vMS',
    'ogulagha_basin_cut_micron': 'apiSeparator.d50cMicron',
    'ogulagha_plate_cut_micron': 'plateInterceptor.d50cMicron',
    'izombe_liner_turndown_ratio': 'hydrocyclone.turndownRatio',
    'izombe_cyclone_shear_penalty': 'hydrocyclone.shearPenalty',
    'izombe_cyclone_cut_micron': 'hydrocyclone.d50cMicron',
    'izombe_bubble_rise_ms': 'flotation.bubbleRiseMS',
    'izombe_gas_holdup_ratio': 'flotation.gasHoldup',
    'izombe_filter_cut_micron': 'mediaFilter.d50cMicron',
    'tunu_plate_stage_removal_pct': 'treatmentTrain.stages[0].removalPct',
    'tunu_cyclone_stage_removal_pct': 'treatmentTrain.stages[1].removalPct',
    'tunu_cyclone_stage_median_micron': 'treatmentTrain.stages[1].outletMedianMicron',
    'tunu_train_outlet_ppm': 'treatmentTrain.outletOiwPpm',
    'tunu_train_outlet_median_micron': 'treatmentTrain.outletMedianMicron',
    'tunu_coarse_droplet_reynolds': 'stokesRiseMS.reynolds',
}
assert set(PRODUCES) == {k for _t, k, _v, _tol in fields}, 'PRODUCES and fields.json disagree'

# THE KEY FRAGMENTS THAT NAME A HELD PATH, deliberately specific, and proved to
# discriminate on a planted key below.
FORBIDDEN_KEY_FRAGMENTS = [
    'flotation_cut', 'attachment', 'floor', 'dissolved', 'spec', 'margin', 'meets',
    'verdict', 'grain_exponent', 'velocity_rule',
]
FORBIDDEN_LABEL_FRAGMENTS = [
    'flotation cut', 'attachment', 'dissolved oil floor', 'discharge', 'specification',
    'margin', 'verdict', 'grain size exponent', 'velocity rule',
]

refused = []
for tier, key, val, tol in fields:
    for frag in FORBIDDEN_KEY_FRAGMENTS:
        if frag in key:
            refused.append(f'{tier}.{key} names a held path through "{frag}"')
    for h, label in HELD:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {h} ({label}), which is HELD')
if not [frag for frag in FORBIDDEN_KEY_FRAGMENTS if frag in 'izombe_flotation_cut_micron']:
    refused.append('the forbidden-key sweep does not catch a planted flotation_cut key')
if any(frag in 'izombe_gas_holdup_ratio' or frag in 'tunu_train_outlet_ppm'
       for frag in FORBIDDEN_KEY_FRAGMENTS):
    refused.append('the forbidden-key sweep fires on a graded key that reads nothing held')

# ---------------------------------------------------------------------------
# THE ARITHMETIC IS CHECKED HERE BEFORE IT IS EMITTED.
# ---------------------------------------------------------------------------
checks = []


def same(what, a, b, rel=1e-12):
    diff = abs(a - b) / max(abs(b), 1e-300)
    checks.append((what, diff, rel))
    if not diff <= rel:
        refused.append(f'{what}: {a} against {b}, relative difference {diff} exceeds {rel}')


og_mu, og_rw, og_ro = mu_w(OGW), rho_w(OGW), rho_o(OGO)
same('OGULAGHA viscosity', og_mu, g('beginner', 'ogulagha_water_viscosity_pas'))
same('OGULAGHA brine density', og_rw, g('beginner', 'ogulagha_water_density_kgm3'))
same('OGULAGHA crude density', og_ro, g('beginner', 'ogulagha_oil_density_kgm3'))
og_d = OGI['d50Micron'] * 1e-6
og_v = (G * og_d * og_d * (og_rw - og_ro)) / (18 * og_mu)
same('OGULAGHA Stokes rise', og_v, g('beginner', 'ogulagha_droplet_rise_ms'))
same('OGULAGHA standard gravity recovered from the four graded fluid fields',
     18 * g('beginner', 'ogulagha_water_viscosity_pas') * g('beginner', 'ogulagha_droplet_rise_ms')
     / (og_d * og_d * (g('beginner', 'ogulagha_water_density_kgm3') - g('beginner', 'ogulagha_oil_density_kgm3'))),
     G)
og_design = (OG_Q / (OGB['lengthM'] * OGB['widthM'])) * OGB['shortCircuitF']
same('OGULAGHA basin cut', cut_from_rise(og_design, og_mu, og_rw, og_ro), g('beginner', 'ogulagha_basin_cut_micron'))
og_pdesign = OG_Q / (OGP['plateAreaM2'] * OGP['nPlates'] * OGP['efficiencyFactor'])
same('OGULAGHA plate cut', cut_from_rise(og_pdesign, og_mu, og_rw, og_ro), g('beginner', 'ogulagha_plate_cut_micron'))
if not OG_Q / (OGB['widthM'] * OGB['depthM']) < API421['horizontalVelocityLimitMS']:
    refused.append('the OGULAGHA basin is over the fixed horizontal velocity limit')
if API421['velocityRuleComplete'] is not False:
    refused.append('API_421 no longer says its velocity rule is incomplete, so the held half needs rereading')

iz_mu, iz_rw, iz_ro = mu_w(IZW), rho_w(IZW), rho_o(IZO)
iz = cyclone(IZ_Q, IZL, iz_mu, iz_rw, iz_ro)
same('IZOMBE turndown', iz['turndown'], g('intermediate', 'izombe_liner_turndown_ratio'))
same('IZOMBE shear penalty', iz['penalty'], g('intermediate', 'izombe_cyclone_shear_penalty'))
same('IZOMBE liner cut', iz['cut'], g('intermediate', 'izombe_cyclone_cut_micron'))
if not (D['overloadTurndown'] < iz['turndown'] <= D['maxTurndown']):
    refused.append('the IZOMBE bank is not on the overloaded branch the tier teaches')
iz_rise = terminal_rise(IZF['bubbleMicron'], iz_rw, IZF['gasDensityKgM3'], iz_mu)
same('IZOMBE bubble rise, by the engine iteration replayed', iz_rise, g('intermediate', 'izombe_bubble_rise_ms'))
iz_res = drag_residual(g('intermediate', 'izombe_bubble_rise_ms'), IZF['bubbleMicron'], iz_rw,
                       IZF['gasDensityKgM3'], iz_mu)
checks.append(('IZOMBE bubble rise as a ROOT of the drag balance', iz_res, 1e-12))
if not iz_res <= 1e-12:
    refused.append(f'the IZOMBE bubble rise leaves a drag residual of {iz_res}')
iz_jg = (IZF['gasRatio'] * IZ_Q) / (IZF['cellVolumeM3'] / IZF['cellDepthM'])
same('IZOMBE holdup from the graded rise', iz_jg / g('intermediate', 'izombe_bubble_rise_ms'),
     g('intermediate', 'izombe_gas_holdup_ratio'))
iz_bed, iz_lam = bed_cut(IZ_Q, IZB)
same('IZOMBE bed cut', iz_bed, g('intermediate', 'izombe_filter_cut_micron'))

tu_mu, tu_rw, tu_ro = mu_w(TUW), rho_w(TUW), rho_o(TUO)
tu_plate = cut_from_rise(TU_Q / (TUP['plateAreaM2'] * TUP['nPlates'] * TUP['efficiencyFactor']), tu_mu, tu_rw, tu_ro)
tu_cyc = cyclone(TU_Q, TUL, tu_mu, tu_rw, tu_ro)
tu_bed, _ = bed_cut(TU_Q, TUF)
tu = train(TUI, TUG, [(tu_plate, D['defaultSharpness']), (tu_cyc['cut'], D['defaultSharpness']),
                      (tu_bed, D['interceptionSharpness'])])
same('TUNU plate stage removal', tu[0]['removal'], g('advanced', 'tunu_plate_stage_removal_pct'), 1e-11)
same('TUNU liner stage removal', tu[1]['removal'], g('advanced', 'tunu_cyclone_stage_removal_pct'), 1e-11)
same('TUNU liner stage median', tu[1]['median'], g('advanced', 'tunu_cyclone_stage_median_micron'), 1e-11)
same('TUNU train outlet', tu[2]['oiw'], g('advanced', 'tunu_train_outlet_ppm'), 1e-11)
same('TUNU train outlet median', tu[2]['median'], g('advanced', 'tunu_train_outlet_median_micron'), 1e-11)
tu_cd = TU_COARSE * 1e-6
tu_cv = (G * tu_cd * tu_cd * (tu_rw - tu_ro)) / (18 * tu_mu)
same('TUNU coarse droplet Reynolds', (tu_rw * tu_cv * tu_cd) / tu_mu, g('advanced', 'tunu_coarse_droplet_reynolds'))
if tu_cyc['penalty'] != 1:
    refused.append('the TUNU bank carries a shear penalty, so the Expert train is not the sized bank')

# EVERY NUMBER THE DIGEST PRINTS, emitted into the SQL so the DATABASE runs the
# sweep rather than a generator promising it did.
NUM = re.compile(r'-?\d+\.?\d*')
published = set()
for tok in NUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read()):
    try:
        published.add(abs(float(tok)))
    except ValueError:
        pass
for tier, key, val, tol in fields:
    for dd in published:
        if abs(abs(val) - dd) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {dd}, which the digest prints')
course_sql = '\n'.join(
    ln for ln in open(COURSE, encoding='utf-8').read().splitlines()
    if not ln.lstrip().startswith('--'))
handed = set()
for m in re.finditer(r"'((?:[^']|'')*)'", course_sql):
    if 'Report six values' in m.group(1):
        for tok in NUM.findall(m.group(1)):
            try:
                handed.add(abs(float(tok)))
            except ValueError:
                pass
if len(handed) < 20:
    refused.append(f'only {len(handed)} numbers were parsed out of the shipped prompts, '
                   'so the handed-value sweep is reading the wrong thing')
for tier, key, val, tol in fields:
    for h in handed:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {h}, handed in a prompt')


# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = """-- ============================================================================
-- FC7 GO-LIVE (HELD): Produced Water Treatment flips to 'available'. The
-- SEVENTH Facilities course, above FC6 heattransfer at path_order 44, FC5 at
-- 43, FC4 gasprocessing at 42, FC3 rotating at 41, FC2 linesizing at 40 and
-- FC1 separation at 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/producedwater. The 78 lessons, the teaching lab
-- (producedWaterLab.js) and its three explorer panels (the water, the device
-- and the train) ship in the ZIP and NOT in this database, so a flip before the
-- upload puts a live catalogue tile in front of a route that does not exist.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and this ladder divides a flow by a liner COUNT and a
-- bin span by a bin COUNT. The generator refuses to emit a division with a bare
-- integer denominator, and refuses a malformed numeric literal.
--
-- SEVENTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED BY CLOSED FORM, and
-- the eighteenth by the equation it is a root of. The Expert's train is closed
-- too: the engine's error function is the five-term rational form of Abramowitz
-- and Stegun, built from exp alone, so the whole sixty-bin quadrature, every
-- stage, both medians and the outlet are recomputed below from the capstone's
-- own stated conditions. The IZOMBE bubble rise comes out of a damped iteration
-- on the Schiller-Naumann drag coefficient, so it is asserted as a ROOT of that
-- drag balance rather than by replaying the iteration.
--
-- AND TEN OF THE EIGHTEEN ARE ASSERTED A SECOND TIME, BY A ROUTE WITH NOTHING
-- IN COMMON WITH THE FIRST:
--
--   * the Stokes rise, by recovering standard gravity out of it and the three
--     graded fluid properties, one assertion reading four graded fields;
--   * the basin cut and the plate cut FORWARD, as the rise of the graded cut
--     droplet against the design rise it was inverted from;
--   * the shear penalty from the GRADED turndown rather than the flow;
--   * the liner cut FORWARD, as the ideal droplet's migration across the travel
--     in the residence time;
--   * the holdup from the GRADED bubble rise;
--   * the bed cut FORWARD, where the graded droplet's filter coefficient times
--     the depth must be the log of two;
--   * the train outlet as the PRODUCT of the stage survivals, with the third
--     stage's removal inferred from the graded figures;
--   * and the Reynolds number back to the Stokes velocity it came from.
--
-- EVERY REFUSAL NAMES THE GRADED FIELD IT READ, condition included.
-- ============================================================================"""

body = []
A = body.append

A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int;')
A('  v_names text;')
A('  v_mu double precision; v_rw double precision; v_ro double precision;')
A('  v_q double precision; v_d double precision; v_v double precision;')
A('  v_design double precision; v_per double precision; v_t double precision;')
A('  v_ft double precision; v_gf double precision; v_r double precision;')
A('  v_travel double precision; v_res double precision; v_req double precision;')
A('  v_ideal double precision; v_pen double precision; v_re double precision;')
A('  v_cd double precision; v_vb double precision; v_load double precision;')
A('  v_lam double precision; v_jg double precision;')
A('  v_cut_plate double precision; v_cut_cyc double precision; v_cut_bed double precision;')
A('  v_lnlo double precision; v_lnhi double precision; v_step double precision;')
A('  v_lna double precision; v_lnb double precision; v_below double precision;')
A('  v_cdfb double precision; v_x double precision; v_a double precision;')
A('  v_tt double precision; v_y double precision; v_tot double precision;')
A('  v_rr double precision; v_eff double precision; v_removed double precision;')
A('  v_surv double precision; v_oiw double precision; v_acc double precision;')
A('  v_f double precision; v_med double precision;')
A('  v_dm double precision[]; v_dlo double precision[]; v_dhi double precision[];')
A('  v_vf double precision[];')
A('  v_stage_removal double precision[]; v_stage_median double precision[];')
A('  v_stage_cut double precision[]; v_stage_m double precision[];')
A('  v_i int; v_s int;')
for (t, k) in V:
    A(f'  {V[(t, k)]} double precision;')
A('begin')

A('''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'FC7 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'FC7 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'FC7 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC7 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'FC7 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_graded from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = '{SLUG}' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'FC7 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = 'facilities'
                    and path_order = {PO} and prereq_slug is null) then
    raise exception 'FC7 go-live refused: the {SLUG} catalogue row is not facilities at path_order {PO} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps
              where path_order = {PO} and slug <> '{SLUG}') then
    raise exception 'FC7 go-live refused: another course already holds path_order {PO}';
  end if;
'''.replace('{SLUG}', SLUG).replace('{PO}', str(PATH_ORDER)))

HELD_VALUES = ', '.join(f17(v) for v, _l in HELD)
HELD_LABELS = ', '.join("'" + lab.replace("'", "''") + "'" for _v, lab in HELD)
FORBIDDEN_SQL = ', '.join("'" + f + "'" for f in FORBIDDEN_KEY_FRAGMENTS)
FORBIDDEN_LABEL_SQL = ', '.join("'" + f + "'" for f in FORBIDDEN_LABEL_FRAGMENTS)
PUBLISHED_SQL = ', '.join(f17(v) for v in sorted(published))

A(f'''
  -- ------------------------------------------- the held-for-literature gates
  -- A FRAGMENT IS MATCHED AS A LITERAL SUBSTRING WITH strpos, NEVER WITH LIKE.
  -- In LIKE an underscore is a one-character wildcard, so the fragment grain_exponent
  -- would also match a key with any other character in that place. The
  -- generator's own Python guard tests a literal substring, and strpos is
  -- the same test. FC5's dry run caught the LIKE form refusing a field that
  -- names no held quantity (its kw_ against a kwm).
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{FORBIDDEN_SQL}]) frag
   where c.app_slug = '{SLUG}' and strpos(f->>'key', frag) > 0;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % graded field(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{FORBIDDEN_LABEL_SQL}]) frag
   where c.app_slug = '{SLUG}' and strpos(lower(f->>'label'), frag) > 0;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % graded field label(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' on ' || h.lab, ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{HELD_VALUES}], array[{HELD_LABELS}]) as h(val, lab)
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::double precision) - h.val) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % graded field(s) land on a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ---------------------------------------------------- the collision sweeps
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{PUBLISHED_SQL}]) pub
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::double precision) - pub) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes: %', v_graded, v_names;
  end if;

  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt, '[0-9]+\\.?[0-9]*', 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::double precision) - (m[1])::double precision)
         <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % graded field(s) land on a number the learner is handed in a prompt: %', v_graded, v_names;
  end if;

  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_graded, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_graded, v_names;
  end if;

  select count(*), string_agg(distinct c.tier || ' states ' || gg.owner || '/' || gg.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = '{SLUG}') gg
   where c.app_slug = '{SLUG}' and c.tier <> gg.owner and c.prompt like '%' || gg.e || '%';
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;
''')

A('\n  -- --------------------------------------- the eighteen graded values')
for (t, k), var in V.items():
    A(f"""  select (f->>'expected')::double precision into {var}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{t}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{v} is null' for v in V.values()) + ' then')
A("    raise exception 'FC7 go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')


def VB(k):
    return V[('beginner', k)]


def VI(k):
    return V[('intermediate', k)]


def VE(k):
    return V[('advanced', k)]


def rel(a, b, eps='1e-12'):
    """|a - b| over |b|, as SQL. Relative, so one epsilon serves a viscosity of
    5e-4 and a removal of 94 alike, and a move of one part in 1e7 is caught on
    any field."""
    return f'abs(({a}) - ({b})) > {eps} * abs({b})'


def mu_sql(w):
    return (f"{f17(D['vogelA'])} * power(10.0, {f17(D['vogelB'])} / ({f17(w['tC'])} + 273.15 - {f17(D['vogelC'])}))"
            f" * (1.0 + {f17(D['salinityViscosityMultiplier'])} * ({f17(w['tdsPpm'])} / 1000000.0))")


def rw_sql(w):
    t = f17(w['tC'])
    return (f"1000.0 * (1.0 - (({t} + 288.9414) / (508929.2 * ({t} + 68.12963))) * power({t} - 3.9863, 2.0))"
            f" + {f17(D['brineDensitySlopeKgM3'])} * ({f17(w['tdsPpm'])} / 1000000.0)")


def ro_sql(o):
    return (f"(141.5 / (131.5 + {f17(o['apiGravity'])})) * {f17(D['crudeReferenceWaterKgM3'])}"
            f" * (1.0 - {f17(D['crudeThermalExpansionPerC'])} * ({f17(o['tC'])} - 15.56))")


def q_sql(bwpd):
    return f"({f17(bwpd)} * {f17(C['BARREL_M3'])}) / 86400.0"


A(f'''
  -- ----------------------------------------------- the Associate, OGULAGHA
  -- The three fluid properties, off the module's own declared fits.
  if {rel(VB('ogulagha_water_viscosity_pas'), mu_sql(OGW))} then
    raise exception 'FC7 go-live refused: the water viscosity of % Pa.s is not the declared fit at % C and % ppm', {VB('ogulagha_water_viscosity_pas')}, {f17(OGW['tC'])}, {f17(OGW['tdsPpm'])};
  end if;
  if {rel(VB('ogulagha_water_density_kgm3'), rw_sql(OGW))} then
    raise exception 'FC7 go-live refused: the brine density of % kg/m3 is not the declared fit at % C and % ppm', {VB('ogulagha_water_density_kgm3')}, {f17(OGW['tC'])}, {f17(OGW['tdsPpm'])};
  end if;
  if {rel(VB('ogulagha_oil_density_kgm3'), ro_sql(OGO))} then
    raise exception 'FC7 go-live refused: the crude density of % kg/m3 is not the declared chain from % API at % C', {VB('ogulagha_oil_density_kgm3')}, {f17(OGO['apiGravity'])}, {f17(OGO['tC'])};
  end if;
  if not ({VB('ogulagha_water_density_kgm3')} > {VB('ogulagha_oil_density_kgm3')}) then
    raise exception 'FC7 go-live refused: the graded crude at % kg/m3 is not lighter than the graded brine at %', {VB('ogulagha_oil_density_kgm3')}, {VB('ogulagha_water_density_kgm3')};
  end if;

  -- The Stokes rise of the volume median droplet, off the three GRADED properties.
  v_d := {f17(OGI['d50Micron'])} * 0.000001;
  if {rel(VB('ogulagha_droplet_rise_ms'), f"({f17(G)} * v_d * v_d * ({VB('ogulagha_water_density_kgm3')} - {VB('ogulagha_oil_density_kgm3')})) / (18.0 * {VB('ogulagha_water_viscosity_pas')})")} then
    raise exception 'FC7 go-live refused: the rise velocity of % m/s is not Stokes on the graded properties at % micron', {VB('ogulagha_droplet_rise_ms')}, {f17(OGI['d50Micron'])};
  end if;
  -- AND STANDARD GRAVITY RECOVERED OUT OF IT, which is the digest's own check on
  -- the 18 and reads all four graded fields at once. A slip in any one of the four
  -- moves the planet.
  if abs(18.0 * {VB('ogulagha_water_viscosity_pas')} * {VB('ogulagha_droplet_rise_ms')}
         / (v_d * v_d * ({VB('ogulagha_water_density_kgm3')} - {VB('ogulagha_oil_density_kgm3')})) - {f17(G)}) > 1e-12 * {f17(G)} then
    raise exception 'FC7 go-live refused: gravity recovered from the graded viscosity, rise and densities is %, not %', 18.0 * {VB('ogulagha_water_viscosity_pas')} * {VB('ogulagha_droplet_rise_ms')} / (v_d * v_d * ({VB('ogulagha_water_density_kgm3')} - {VB('ogulagha_oil_density_kgm3')})), {f17(G)};
  end if;

  -- The basin: the surface loading times the allowance, inverted through Stokes.
  v_q := {q_sql(C['OGULAGHA_BWPD'])};
  v_design := (v_q / ({f17(OGB['lengthM'])} * {f17(OGB['widthM'])})) * {f17(OGB['shortCircuitF'])};
  if {rel(VB('ogulagha_basin_cut_micron'), f"sqrt((18.0 * {VB('ogulagha_water_viscosity_pas')} * v_design) / ({f17(G)} * ({VB('ogulagha_water_density_kgm3')} - {VB('ogulagha_oil_density_kgm3')}))) * 1000000.0")} then
    raise exception 'FC7 go-live refused: the basin cut of % micron is not Stokes inverted at the design rise of % m/s', {VB('ogulagha_basin_cut_micron')}, v_design;
  end if;
  -- AND FORWARD. The graded cut droplet must rise at exactly the design rise.
  v_d := {VB('ogulagha_basin_cut_micron')} * 0.000001;
  if {rel(f"({f17(G)} * v_d * v_d * ({VB('ogulagha_water_density_kgm3')} - {VB('ogulagha_oil_density_kgm3')})) / (18.0 * {VB('ogulagha_water_viscosity_pas')})", 'v_design')} then
    raise exception 'FC7 go-live refused: the graded basin cut of % micron rises at a speed other than the design rise of % m/s', {VB('ogulagha_basin_cut_micron')}, v_design;
  end if;
  -- The fixed horizontal velocity half of API 421 is the only half here, so the
  -- capstone basin sits UNDER it and the missing half decides nothing.
  if not (v_q / ({f17(OGB['widthM'])} * {f17(OGB['depthM'])}) < {f17(API421['horizontalVelocityLimitMS'])}) then
    raise exception 'FC7 go-live refused: the capstone basin runs over the fixed horizontal velocity limit, so the held half of the rule could decide it [graded field: beginner.ogulagha_basin_cut_micron]';
  end if;

  -- The plate pack, the same balance over the effective area.
  v_design := v_q / ({f17(OGP['plateAreaM2'])} * {f17(OGP['nPlates'])} * {f17(OGP['efficiencyFactor'])});
  if {rel(VB('ogulagha_plate_cut_micron'), f"sqrt((18.0 * {VB('ogulagha_water_viscosity_pas')} * v_design) / ({f17(G)} * ({VB('ogulagha_water_density_kgm3')} - {VB('ogulagha_oil_density_kgm3')}))) * 1000000.0")} then
    raise exception 'FC7 go-live refused: the plate cut of % micron is not Stokes inverted at the design rise of % m/s', {VB('ogulagha_plate_cut_micron')}, v_design;
  end if;
  v_d := {VB('ogulagha_plate_cut_micron')} * 0.000001;
  if {rel(f"({f17(G)} * v_d * v_d * ({VB('ogulagha_water_density_kgm3')} - {VB('ogulagha_oil_density_kgm3')})) / (18.0 * {VB('ogulagha_water_viscosity_pas')})", 'v_design')} then
    raise exception 'FC7 go-live refused: the graded plate cut of % micron rises at a speed other than the design rise of % m/s', {VB('ogulagha_plate_cut_micron')}, v_design;
  end if;
  if not ({VB('ogulagha_plate_cut_micron')} < {VB('ogulagha_basin_cut_micron')}) then
    raise exception 'FC7 go-live refused: the plate pack at % micron does not cut finer than the basin at %', {VB('ogulagha_plate_cut_micron')}, {VB('ogulagha_basin_cut_micron')};
  end if;
''')

A(f'''
  -- --------------------------------------------- the Professional, IZOMBE
  v_mu := {mu_sql(IZW)};
  v_rw := {rw_sql(IZW)};
  v_ro := {ro_sql(IZO)};
  v_q := {q_sql(C['IZOMBE_BWPD'])};

  -- The turndown, and the branch the tier is built on.
  v_per := v_q / {f17(IZL['nLiners'])};
  if {rel(VI('izombe_liner_turndown_ratio'), f"v_per / {f17(IZL['designFlowPerLinerM3S'])}")} then
    raise exception 'FC7 go-live refused: the turndown of % is not the flow per liner % over the rated %', {VI('izombe_liner_turndown_ratio')}, v_per, {f17(IZL['designFlowPerLinerM3S'])};
  end if;
  if not ({VI('izombe_liner_turndown_ratio')} > {f17(D['overloadTurndown'])} and {VI('izombe_liner_turndown_ratio')} <= {f17(D['maxTurndown'])}) then
    raise exception 'FC7 go-live refused: the turndown of % is not between the envelope top of % and the refusal at %, so the ceiling and the penalty the tier teaches are not on this case', {VI('izombe_liner_turndown_ratio')}, {f17(D['overloadTurndown'])}, {f17(D['maxTurndown'])};
  end if;

  -- The shear penalty FROM THE GRADED TURNDOWN.
  if {rel(VI('izombe_cyclone_shear_penalty'), f"sqrt({VI('izombe_liner_turndown_ratio')} / {f17(D['overloadTurndown'])})")} then
    raise exception 'FC7 go-live refused: the shear penalty of % is not the root of the graded turndown % over the envelope top', {VI('izombe_cyclone_shear_penalty')}, {VI('izombe_liner_turndown_ratio')};
  end if;

  -- The liner cut: a capped field, a travel from the half-area radius to the
  -- core, a residence of one liner volume over one liner flow.
  v_ft := least(v_per / {f17(IZL['designFlowPerLinerM3S'])}, {f17(D['overloadTurndown'])});
  v_gf := {f17(IZL['gFieldAtDesign'])} * v_ft * v_ft;
  v_r := {f17(IZL['linerDiameterM'])} / 2.0;
  v_travel := v_r * sqrt(0.5) - v_r * {f17(IZL['coreRadiusFraction'])};
  v_res := (pi() * v_r * v_r * {f17(IZL['linerLengthM'])}) / v_per;
  v_req := v_travel / v_res;
  v_ideal := sqrt((18.0 * v_mu * v_req) / (v_gf * {f17(G)} * (v_rw - v_ro))) * 1000000.0;
  if {rel(VI('izombe_cyclone_cut_micron'), f"v_ideal * {VI('izombe_cyclone_shear_penalty')}")} then
    raise exception 'FC7 go-live refused: the liner cut of % micron is not the ideal % micron times the graded penalty %', {VI('izombe_cyclone_cut_micron')}, v_ideal, {VI('izombe_cyclone_shear_penalty')};
  end if;
  -- AND FORWARD. The ideal droplet, the graded cut over the graded penalty, must
  -- migrate across exactly the travel in exactly the residence time.
  v_d := ({VI('izombe_cyclone_cut_micron')} / {VI('izombe_cyclone_shear_penalty')}) * 0.000001;
  if {rel(f"((v_gf * {f17(G)} * v_d * v_d * (v_rw - v_ro)) / (18.0 * v_mu)) * v_res", 'v_travel')} then
    raise exception 'FC7 go-live refused: the graded liner cut of % micron over the penalty % does not cross the % m travel in the % s residence', {VI('izombe_cyclone_cut_micron')}, {VI('izombe_cyclone_shear_penalty')}, v_travel, v_res;
  end if;

  -- The bubble rise, as a ROOT of the Schiller-Naumann drag balance. Restating
  -- the engine's damped iteration would validate nothing; the terminal velocity
  -- is DEFINED as the one where the balance returns the velocity it was given.
  v_d := {f17(IZF['bubbleMicron'])} * 0.000001;
  v_re := (v_rw * {VI('izombe_bubble_rise_ms')} * v_d) / v_mu;
  v_cd := (24.0 / v_re) * (1.0 + 0.15 * power(v_re, 0.687));
  v_vb := sqrt((4.0 * {f17(G)} * v_d * (v_rw - {f17(IZF['gasDensityKgM3'])})) / (3.0 * v_cd * v_rw));
  if {rel(VI('izombe_bubble_rise_ms'), 'v_vb')} then
    raise exception 'FC7 go-live refused: the bubble rise of % m/s is not a root of the drag balance, which returns % m/s at Reynolds %', {VI('izombe_bubble_rise_ms')}, v_vb, v_re;
  end if;
  -- And it is outside creeping flow, which is why it is the balance and not Stokes.
  if not (v_re > {f17(D['stokesReynoldsLimit'])}) then
    raise exception 'FC7 go-live refused: the graded bubble rises at Reynolds %, inside creeping flow, so the full drag balance teaches nothing here', v_re;
  end if;

  -- The holdup, FROM THE GRADED RISE.
  v_jg := ({f17(IZF['gasRatio'])} * v_q) / ({f17(IZF['cellVolumeM3'])} / {f17(IZF['cellDepthM'])});
  if {rel(VI('izombe_gas_holdup_ratio'), f"v_jg / {VI('izombe_bubble_rise_ms')}")} then
    raise exception 'FC7 go-live refused: the holdup of % is not the superficial gas velocity % over the graded rise %', {VI('izombe_gas_holdup_ratio')}, v_jg, {VI('izombe_bubble_rise_ms')};
  end if;
  if not ({VI('izombe_gas_holdup_ratio')} < {f17(D['gasHoldupWarn'])}) then
    raise exception 'FC7 go-live refused: the holdup of % is past the swarm limit, so the graded cell is not the independent swarm the model describes', {VI('izombe_gas_holdup_ratio')};
  end if;

  -- The bed, at the reference grain so the held exponent multiplies by one.
  if {f17(IZB['mediaMicron'])} <> {f17(D['filterReferenceMediaMicron'])} then
    raise exception 'FC7 go-live refused: the graded bed is not at the reference grain, so the held exponent reaches its cut [graded field: intermediate.izombe_filter_cut_micron]';
  end if;
  v_load := (v_q / {f17(IZB['areaM2'])}) * 3600.0;
  v_lam := {f17(IZB['filterCoefficientPerM'])} * power({f17(D['filterReferenceMediaMicron'])} / {f17(IZB['mediaMicron'])}, 3.0)
           * power({f17(D['filterReferenceLoadingMHr'])} / v_load, {f17(D['filterLoadingExponent'])});
  if {rel(VI('izombe_filter_cut_micron'), f"{f17(IZB['referenceDropletMicron'])} * sqrt(ln(2.0) / (v_lam * {f17(IZB['bedDepthM'])}))")} then
    raise exception 'FC7 go-live refused: the bed cut of % micron is not depth filtration inverted at a filter coefficient of % per m', {VI('izombe_filter_cut_micron')}, v_lam;
  end if;
  -- AND FORWARD. The graded droplet's own filter coefficient times the depth is
  -- the log of two, which is what makes it the droplet the bed removes half of.
  if {rel(f"v_lam * power({VI('izombe_filter_cut_micron')} / {f17(IZB['referenceDropletMicron'])}, 2.0) * {f17(IZB['bedDepthM'])}", 'ln(2.0)')} then
    raise exception 'FC7 go-live refused: the graded bed cut of % micron does not put the filter coefficient times the depth at the log of two', {VI('izombe_filter_cut_micron')};
  end if;
''')

ERF = ("v_a := abs(v_x);\n"
       "      v_tt := 1.0 / (1.0 + 0.3275911 * v_a);\n"
       "      v_y := 1.0 - (((((1.061405429 * v_tt - 1.453152027) * v_tt) + 1.421413741) * v_tt\n"
       "             - 0.284496736) * v_tt + 0.254829592) * v_tt * exp(-v_a * v_a);\n"
       "      if v_x < 0.0 then v_y := -v_y; end if;")

A(f'''
  -- ---------------------------------------------------- the Expert, TUNU
  v_mu := {mu_sql(TUW)};
  v_rw := {rw_sql(TUW)};
  v_ro := {ro_sql(TUO)};
  v_q := {q_sql(C['TUNU_BWPD'])};

  -- The three cut sizes, each the engine's own for its device.
  v_design := v_q / ({f17(TUP['plateAreaM2'])} * {f17(TUP['nPlates'])} * {f17(TUP['efficiencyFactor'])});
  v_cut_plate := sqrt((18.0 * v_mu * v_design) / ({f17(G)} * (v_rw - v_ro))) * 1000000.0;
  v_per := v_q / {f17(TUL['nLiners'])};
  v_t := v_per / {f17(TUL['designFlowPerLinerM3S'])};
  if not (v_t > {f17(D['starvedTurndown'])} and v_t <= {f17(D['overloadTurndown'])}) then
    raise exception 'FC7 go-live refused: the TUNU bank runs at a turndown of %, outside the envelope, so the Expert train is not the sized bank [graded field: advanced.tunu_cyclone_stage_removal_pct]', v_t;
  end if;
  v_gf := {f17(TUL['gFieldAtDesign'])} * v_t * v_t;
  v_r := {f17(TUL['linerDiameterM'])} / 2.0;
  v_travel := v_r * sqrt(0.5) - v_r * {f17(TUL['coreRadiusFraction'])};
  v_res := (pi() * v_r * v_r * {f17(TUL['linerLengthM'])}) / v_per;
  v_req := v_travel / v_res;
  v_cut_cyc := sqrt((18.0 * v_mu * v_req) / (v_gf * {f17(G)} * (v_rw - v_ro))) * 1000000.0;
  v_load := (v_q / {f17(TUF['areaM2'])}) * 3600.0;
  v_lam := {f17(TUF['filterCoefficientPerM'])} * power({f17(D['filterReferenceMediaMicron'])} / {f17(TUF['mediaMicron'])}, 3.0)
           * power({f17(D['filterReferenceLoadingMHr'])} / v_load, {f17(D['filterLoadingExponent'])});
  v_cut_bed := {f17(TUF['referenceDropletMicron'])} * sqrt(ln(2.0) / (v_lam * {f17(TUF['bedDepthM'])}));
  v_stage_cut := array[v_cut_plate, v_cut_cyc, v_cut_bed];
  v_stage_m := array[{f17(D['defaultSharpness'])}, {f17(D['defaultSharpness'])}, {f17(D['interceptionSharpness'])}];

  -- The inlet grid: log-normal in volume, {int(TUG['nBins'])} bins over {TUG['spanSigma']} sigma
  -- either side, the cdf through the engine's own five-term error function.
  v_lnlo := ln({f17(TUI['d50Micron'])}) - {f17(TUG['spanSigma'])} * {f17(TUI['sigma'])};
  v_lnhi := ln({f17(TUI['d50Micron'])}) + {f17(TUG['spanSigma'])} * {f17(TUI['sigma'])};
  v_step := (v_lnhi - v_lnlo) / {f17(TUG['nBins'])};
  v_x := ln(exp(v_lnlo) / {f17(TUI['d50Micron'])}) / ({f17(TUI['sigma'])} * sqrt(2.0));
  {ERF}
  v_below := 0.5 * (1.0 + v_y);
  v_dm := array[]::double precision[]; v_dlo := array[]::double precision[];
  v_dhi := array[]::double precision[]; v_vf := array[]::double precision[];
  for v_i in 0..{int(TUG['nBins']) - 1} loop
    v_lna := v_lnlo + v_step * v_i;
    v_lnb := v_lna + v_step;
    v_x := ln(exp(v_lnb) / {f17(TUI['d50Micron'])}) / ({f17(TUI['sigma'])} * sqrt(2.0));
      {ERF}
    v_cdfb := 0.5 * (1.0 + v_y);
    v_dm := v_dm || exp((v_lna + v_lnb) / 2.0);
    v_dlo := v_dlo || exp(v_lna);
    v_dhi := v_dhi || exp(v_lnb);
    v_vf := v_vf || (v_cdfb - v_below);
    v_below := v_cdfb;
  end loop;
  v_tot := 0.0;
  for v_i in 1..array_length(v_vf, 1) loop v_tot := v_tot + v_vf[v_i]; end loop;
  for v_i in 1..array_length(v_vf, 1) loop v_vf[v_i] := v_vf[v_i] / v_tot; end loop;

  -- The three stages in order, each carrying the OUTLET distribution forward.
  v_oiw := {f17(TUI['oiwPpm'])};
  v_stage_removal := array[]::double precision[];
  v_stage_median := array[]::double precision[];
  for v_s in 1..3 loop
    v_removed := 0.0;
    for v_i in 1..array_length(v_vf, 1) loop
      v_rr := power(v_dm[v_i] / v_stage_cut[v_s], v_stage_m[v_s]);
      v_eff := v_rr / (1.0 + v_rr);
      v_removed := v_removed + v_vf[v_i] * v_eff;
      v_vf[v_i] := v_vf[v_i] * (1.0 - v_eff);
    end loop;
    v_surv := 0.0;
    for v_i in 1..array_length(v_vf, 1) loop v_surv := v_surv + v_vf[v_i]; end loop;
    for v_i in 1..array_length(v_vf, 1) loop v_vf[v_i] := v_vf[v_i] / v_surv; end loop;
    v_oiw := v_oiw * (1.0 - v_removed);
    -- The volume median, interpolated in log diameter across its bin.
    v_tot := 0.0;
    for v_i in 1..array_length(v_vf, 1) loop v_tot := v_tot + v_vf[v_i]; end loop;
    v_acc := 0.0; v_med := null;
    for v_i in 1..array_length(v_vf, 1) loop
      v_f := v_vf[v_i] / v_tot;
      if v_acc + v_f >= 0.5 then
        v_med := exp(ln(v_dlo[v_i]) + ((0.5 - v_acc) / v_f) * ln(v_dhi[v_i] / v_dlo[v_i]));
        exit;
      end if;
      v_acc := v_acc + v_f;
    end loop;
    v_stage_removal := v_stage_removal || (v_removed * 100.0);
    v_stage_median := v_stage_median || v_med;
  end loop;

  -- THE TRAIN IS ASSERTED AT 1e-9 RELATIVE, NOT 1e-12. Postgres's exp and ln
  -- are the host libm's, not V8's, and across sixty bins and three stages they
  -- land within 3e-11 of the engine on the scratch server. 1e-9 leaves thirty
  -- times that for a production libm and is still a hundred times tighter than
  -- the one part in 1e7 the negative control moves a field by.
  if {rel(VE('tunu_plate_stage_removal_pct'), 'v_stage_removal[1]', '1e-9')} then
    raise exception 'FC7 go-live refused: the plate stage removal of % percent is not the quadrature over the stated inlet, which gives %', {VE('tunu_plate_stage_removal_pct')}, v_stage_removal[1];
  end if;
  if {rel(VE('tunu_cyclone_stage_removal_pct'), 'v_stage_removal[2]', '1e-9')} then
    raise exception 'FC7 go-live refused: the liner stage removal of % percent is not the quadrature over the plate stage outlet, which gives %', {VE('tunu_cyclone_stage_removal_pct')}, v_stage_removal[2];
  end if;
  if {rel(VE('tunu_cyclone_stage_median_micron'), 'v_stage_median[2]', '1e-9')} then
    raise exception 'FC7 go-live refused: the liner stage median of % micron is not the interpolated median of that outlet, which is %', {VE('tunu_cyclone_stage_median_micron')}, v_stage_median[2];
  end if;
  if {rel(VE('tunu_train_outlet_ppm'), 'v_oiw', '1e-9')} then
    raise exception 'FC7 go-live refused: the train outlet of % ppm is not the stated inlet carried through all three stages, which gives %', {VE('tunu_train_outlet_ppm')}, v_oiw;
  end if;
  if {rel(VE('tunu_train_outlet_median_micron'), 'v_stage_median[3]', '1e-9')} then
    raise exception 'FC7 go-live refused: the train outlet median of % micron is not the interpolated median at the bed outlet, which is %', {VE('tunu_train_outlet_median_micron')}, v_stage_median[3];
  end if;

  -- AND THE OUTLET AS A PRODUCT OF SURVIVALS, read off the graded figures alone.
  -- The third stage's removal is inferred from them, and it must be a real
  -- removal and the one the quadrature found.
  v_eff := 1.0 - {VE('tunu_train_outlet_ppm')}
           / ({f17(TUI['oiwPpm'])} * (1.0 - {VE('tunu_plate_stage_removal_pct')} / 100.0)
              * (1.0 - {VE('tunu_cyclone_stage_removal_pct')} / 100.0));
  if not (v_eff > 0.0 and v_eff < 1.0) or {rel('v_eff * 100.0', 'v_stage_removal[3]', '1e-8')} then
    raise exception 'FC7 go-live refused: the graded outlet and stage removals imply a bed removal of % percent, against the % percent the quadrature finds', v_eff * 100.0, v_stage_removal[3];
  end if;
  -- Every stage works on finer water than the one before it.
  if not ({VE('tunu_train_outlet_median_micron')} < {VE('tunu_cyclone_stage_median_micron')}
          and {VE('tunu_cyclone_stage_median_micron')} < {f17(TUI['d50Micron'])}) then
    raise exception 'FC7 go-live refused: the medians % and % micron do not fall stage by stage below the inlet median of %', {VE('tunu_cyclone_stage_median_micron')}, {VE('tunu_train_outlet_median_micron')}, {f17(TUI['d50Micron'])};
  end if;

  -- The coarse droplet: Stokes and the Reynolds number it reports beside it.
  v_d := {f17(TU_COARSE)} * 0.000001;
  v_v := ({f17(G)} * v_d * v_d * (v_rw - v_ro)) / (18.0 * v_mu);
  if {rel(VE('tunu_coarse_droplet_reynolds'), '(v_rw * v_v * v_d) / v_mu')} then
    raise exception 'FC7 go-live refused: the Reynolds number of % is not the one Stokes reports for a % micron droplet in this water', {VE('tunu_coarse_droplet_reynolds')}, {f17(TU_COARSE)};
  end if;
  -- AND BACK. The velocity the graded Reynolds number implies is Stokes.
  if {rel(f"{VE('tunu_coarse_droplet_reynolds')} * v_mu / (v_rw * v_d)", 'v_v')} then
    raise exception 'FC7 go-live refused: the graded Reynolds number of % implies a rise other than Stokes', {VE('tunu_coarse_droplet_reynolds')};
  end if;
  if not ({VE('tunu_coarse_droplet_reynolds')} > {f17(D['stokesReynoldsLimit'])}) then
    raise exception 'FC7 go-live refused: the graded Reynolds number of % is inside the band, so the coarse droplet teaches nothing', {VE('tunu_coarse_droplet_reynolds')};
  end if;
''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and status = 'available') then
    raise exception 'FC7 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC7 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;''')

sql = HEADER + '\n\n' + '\n'.join(body) + '\n'

# ------------------------------- EVERY REFUSAL NAMES THE FIELD IT IS ABOUT
BY_VAR = {v: f'{t}.{k}' for (t, k), v in V.items()}
RAISE = re.compile(r"raise exception '((?:[^']|'')*)'((?:[^;']|'(?:[^']|'')*')*);", re.S)


def name_the_field(m):
    """Append every graded field THE WHOLE GUARD READS, condition included."""
    start = m.start()
    head = sql_draft.rfind('\n  if ', 0, start)
    for opener in ('\n  elsif ', '\n  if not ', '\n  v_'):
        head = max(head, sql_draft.rfind(opener, 0, start))
    scope = sql_draft[head:m.end()] if head >= 0 else m.group(0)
    msg, args = m.group(1), m.group(2)
    if '[graded field:' in msg:
        return m.group(0)
    keys = []
    for tok in re.findall(r'\bv_[A-Za-z0-9_]+\b', scope):
        if tok in BY_VAR and BY_VAR[tok] not in keys:
            keys.append(BY_VAR[tok])
    if not keys:
        return m.group(0)
    return f"raise exception '{msg} [graded field: {', '.join(keys)}]'{args};"


sql_draft = sql
sql = RAISE.sub(name_the_field, sql)

named = set()
for m in RAISE.finditer(sql):
    gm = re.search(r'\[graded field: ([^\]]*)\]', m.group(1))
    if gm:
        named.update(x.strip() for x in gm.group(1).split(','))
unnamed = [f'{t}.{k} is graded and no refusal in this file names it'
           for (t, k) in V if f'{t}.{k}' not in named]
for m in RAISE.finditer(sql):
    head = max(sql.rfind('\n  if ', 0, m.start()), sql.rfind('\n  elsif ', 0, m.start()),
               sql.rfind('\n  if not ', 0, m.start()))
    scope = sql[head:m.end()] if head >= 0 else m.group(0)
    reads = [t for t in re.findall(r'\bv_[A-Za-z0-9_]+\b', scope) if t in BY_VAR]
    if reads and 'graded field:' not in m.group(1):
        unnamed.append(f'a refusal reads {reads} and names no graded field: {m.group(1)[:80]}')
    named_here = re.search(r'\[graded field: ([^\]]*)\]', m.group(1))
    if reads and named_here:
        want = {BY_VAR[t] for t in reads}
        got = {x.strip() for x in named_here.group(1).split(',')}
        if want - got:
            unnamed.append('a refusal reads ' + ', '.join(sorted(want - got))
                           + f' and does not name it: {m.group(1)[:80]}')

intdiv = []
for i, line in enumerate(sql.splitlines(), 1):
    code = '' if line.lstrip().startswith('--') else line.split('--', 1)[0]
    for m in re.finditer(r'/\s*(\d+)(?![\d.eE])', code):
        intdiv.append(f'line {i}: "/ {m.group(1)}" has a bare integer denominator -> {line.strip()[:90]}')

malformed = []
for i, line in enumerate(sql.splitlines(), 1):
    code = '' if line.lstrip().startswith('--') else line.split('--', 1)[0]
    for m in re.finditer(r'\d+\.\d+\.\d', code):
        malformed.append(f'line {i}: malformed numeric literal "{m.group(0)}" -> {line.strip()[:90]}')

odd = [i for i, ln in enumerate(sql.splitlines(), 1)
       if not ln.lstrip().startswith('--') and ln.split('--', 1)[0].count("'") % 2]

dashes = len(re.findall('[–—]', sql))
if refused or intdiv or malformed or unnamed or dashes or odd:
    print('REFUSED, nothing written:')
    for b in refused + intdiv + malformed + unnamed:
        print('  ', b)
    if dashes:
        print('   en/em dashes:', dashes)
    if odd:
        print('   odd-quote code lines:', odd)
    sys.exit(1)

open(OUT, 'w').write(sql)
print(f'wrote {OUT}: {len(sql.splitlines())} lines')
print(f'integer-division guard: 0 bare integer denominators in {sql.count("/")} divisions')
print(f'malformed-literal guard: 0 in {len(sql.splitlines())} lines')
print('odd-quote guard: 0 code lines with an unbalanced quote')
print(f'digest literals swept: {len(published)} | handed-in-prompt values: {len(handed)} '
      f'| held quantities: {len(HELD)}')
print('graded fields colliding with any of those three lists, at their SHIPPED tolerance: 0')
print(f'refusals that read a graded value: '
      f'{sum(1 for m in RAISE.finditer(sql) if "[graded field:" in m.group(1))}, '
      'every one of them naming the field by key')
print(f'graded fields named by at least one refusal: {len(named)} of 18')
print(f'IZOMBE bubble rise drag residual: {iz_res!r} | turndown {iz["turndown"]!r}')
print('every identity this file asserts, checked here first (relative):')
for what, diff, eps in checks:
    print(f'  {diff:.3e} <= {eps:.0e}  {what}')
