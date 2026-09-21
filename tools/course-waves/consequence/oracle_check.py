#!/root/hseenv/bin/python3
"""THE EIGHTEEN GRADED H4 ANSWERS, RECOMPUTED BY THE VENDORED PYTHON ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone scenarios through tools/validation/hse/oracle_consequence.py, which
was written independently of the engine (numpy and scipy in /root/hseenv; it
never calls the JavaScript), and requires every graded value to agree:

  * closed forms at 1e-10 relative (the oracle's own route A tolerance);
  * the two root searches (the plume far distance, the blast distance) by
    scipy brentq at 1e-9 relative;
  * the four lethality probabilities at 2e-7 ABSOLUTE, because the oracle
    uses scipy.stats.norm and the engine the Abramowitz and Stegun 7.1.26 erf
    (|error| <= 1.5e-7); and every one must still ROUND to the same six
    decimals, which is what a learner types.

It also runs the SECOND ROUTES where the oracle has one: the choked riser
through the isentropic nozzle maximisation, the plume's mass flux integral
for the receptor's release, and the view factor by 400 x 400 Gauss-Legendre.

    /root/hseenv/bin/python3 oracle_check.py [--plant]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import json
import math
import os
import subprocess
import sys

HERE = os.environ.get('H4_WAVE_DIR', '/root/hse-wip-consequence')
ENG = os.environ.get('H4_ENGINES', '/root/wt-h4-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'hse'))
try:
    import oracle_consequence as O  # noqa: E402
    from scipy import optimize  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the oracle could not be imported from {ENG} ({e}); run with /root/hseenv/bin/python3')
    sys.exit(2)

PLANT = '--plant' in sys.argv
fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print(f'REFUSED: fields.json carries {len(fields)} fields')
    sys.exit(2)
graded = {k: (v, tol) for _, k, v, tol in fields}
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'h4_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True).stdout)
OK, YO, PE = inp['OKAN'], inp['YOKRI'], inp['PENNINGTON']
ATM = O.ATM
PSI = 6894.757293168361

# ------------------------------------------------------------ OKAN
c = OK['condensate']
liq = O.liquid(c['dischargeCoefficient'], c['holeDiameterM'], c['liquidDensityKgM3'], c['liquidHeadM'],
               c['pressureAboveLiquidPa'])


def gas(s):
    return O.gas_yb(s['dischargeCoefficient'], s['holeDiameterM'], s['upstreamPressurePa'],
                    s['upstreamTemperatureK'], s['molarMassKgMol'], s['heatCapacityRatio'])


riser, riser_choked, _ = gas(OK['riser'])
vent, vent_choked, vent_psi = gas(OK['vent'])
r = OK['riser']
riser_b = O.gas_nozzle(r['dischargeCoefficient'], r['holeDiameterM'], r['upstreamPressurePa'],
                       r['upstreamTemperatureK'], r['molarMassKgMol'], r['heatCapacityRatio'])
sp = OK['spill']
pool_d = math.sqrt(4 * (sp['spillVolumeM3'] / sp['poolThicknessM']) / math.pi)
pl = OK['plume']
sy, sz = O.sig(pl['stabilityClass'], pl['downwindDistanceM'])
ckg = O.plume(pl['massRateKgS'], pl['windSpeedMS'], sy, sz, pl['crosswindDistanceM'], pl['receptorHeightM'],
              pl['releaseHeightM'])
ppm = ckg * 1e6 * (O.R * 298.15 / ATM * 1000) / pl['molarMassGMol']
flux_b = O.plume_mass_flux(pl['massRateKgS'], pl['windSpeedMS'], sy, sz, pl['releaseHeightM'])
rc = OK['reach']


def conc(x):
    a, b = O.sig(rc['stabilityClass'], x)
    return 1e6 * O.plume(rc['massRateKgS'], rc['windSpeedMS'], a, b, 0, rc['receptorHeightM'], rc['releaseHeightM'])


pk = optimize.minimize_scalar(lambda lx: -conc(math.exp(lx)), bounds=(0, math.log(1e5)), method='bounded',
                              options={'xatol': 1e-12})
peak_x = math.exp(pk.x)
far = optimize.brentq(lambda x: conc(x) - rc['targetConcentrationMgM3'], peak_x, 1e5, xtol=1e-13, rtol=1e-15)

# ------------------------------------------------------------ YOKRI
D = YO['poolDiameterM']
m = 0.039 * (1 - math.exp(-3.5 * D))            # YB Table 6.5 kerosene, eq. 6.66
ld, _, _ = O.thomas_wind(D, m, YO['windSpeed10mMS'], YO['airDensityKgM3'])
L = ld * D
tilt_deg = O.tilt(D, YO['windSpeed10mMS'], YO['airKinematicViscosityM2S'])[0]
e = math.exp(-0.12 * D)
sep_mudan = 140e3 * e + 20e3 * (1 - e)
sep_max = YO['radiativeFraction'] * m * YO['heatOfCombustionJKg'] / (1 + 4 * L / D)
sep_act = sep_max * (1 - YO['sootFraction']) + 20e3 * YO['sootFraction']
a_, b_, t_ = L / (D / 2), YO['targetDistanceFromCentreM'] / (D / 2), math.radians(tilt_deg)
fv, fh = O.mudan_tilted(a_, b_, t_)
fv_b, fh_b = O.vf_numeric(a_, b_, t_)
fmax = math.hypot(fv, fh)
q = sep_act * fmax * YO['transmissivity']

# ------------------------------------------------------------ PENNINGTON
W = PE['tntMassKg']
z = PE['distanceM'] / W ** (1 / 3)
blast = O.kg_ratio(z) * ATM
zt = optimize.brentq(lambda zz: O.kg_ratio(zz) - PE['targetOverpressurePa'] / ATM, 0.05, 40, xtol=1e-14, rtol=1e-15)
dist = zt * W ** (1 / 3)
p_over = O.P(1.47 + 1.37 * math.log(PE['buildingOverpressurePa'] / PSI))
th = PE['thermal']
y_th = -14.9 + 2.56 * math.log(th['exposureTimeS'] * (th['heatFluxWM2'] / 1000) ** (4 / 3))
tx = PE['toxic']
p_tox = O.P(-8.29 + 0.92 * math.log(tx['concentrationPpm'] ** 2 * tx['exposureMinutes']))
nh = PE['ammonia']
ppm_nh3 = nh['concentrationMgM3'] * (O.R * nh['temperatureK'] / ATM * 1000) / nh['molarMassGMol']
p_nh3 = O.P(-35.9 + 1.85 * math.log(ppm_nh3 ** 2 * nh['exposureMinutes']))

ORACLE = {
    'okan_condensate_leak_mass_rate_kg_s': (liq, 'rel', 1e-10),
    'okan_gas_riser_choked_mass_rate_kg_s': (riser, 'rel', 1e-10),
    'okan_vent_subsonic_mass_rate_kg_s': (vent, 'rel', 1e-10),
    'okan_deck_spill_equivalent_diameter_m': (pool_d, 'rel', 1e-10),
    'okan_plume_receptor_concentration_ppm': (ppm, 'rel', 1e-10),
    'okan_plume_far_distance_m': (far, 'rel', 1e-9),
    'yokri_flame_length_with_wind_m': (L, 'rel', 1e-10),
    'yokri_flame_tilt_deg': (tilt_deg, 'rel', 1e-10),
    'yokri_surface_emissive_power_mudan_w_m2': (sep_mudan, 'rel', 1e-10),
    'yokri_surface_emissive_power_actual_w_m2': (sep_act, 'rel', 1e-10),
    'yokri_view_factor_max': (fmax, 'rel', 1e-10),
    'yokri_solid_flame_heat_flux_w_m2': (q, 'rel', 1e-10),
    'pennington_blast_overpressure_pa': (blast, 'rel', 1e-10),
    'pennington_blast_distance_for_overpressure_m': (dist, 'rel', 1e-9),
    'pennington_overpressure_fatality_probability': (p_over, 'abs', 2e-7),
    'pennington_thermal_lethality_probability': (O.P(y_th), 'abs', 2e-7),
    'pennington_toxic_lethality_probability': (p_tox, 'abs', 2e-7),
    'pennington_ammonia_lethality_probability': (p_nh3, 'abs', 2e-7),
}

problems = []
worst = 0.0
if set(ORACLE) != set(graded):
    print(f'REFUSED: the oracle keys and fields.json disagree: {sorted(set(ORACLE) ^ set(graded))}')
    sys.exit(2)
planted = 'yokri_view_factor_max'
for k, (ov, mode, tol) in ORACLE.items():
    ev, gtol = graded[k]
    if PLANT and k == planted:
        ev = ev + 10 * gtol
    d = abs(ev - ov) if mode == 'abs' else abs(ev - ov) / abs(ov)
    if mode == 'rel':
        worst = max(worst, d)
    if d > tol:
        problems.append(f'{k}: engine {ev!r} oracle {ov!r} ({mode} {d:.3e} > {tol})')
    if mode == 'abs' and round(ev, 6) != round(ov, 6):
        problems.append(f'{k}: engine and exact CDF round to different six decimals ({ev!r} {ov!r})')

DECISIONS = [
    ('the riser is choked', riser_choked),
    ('the vent is subsonic, with psi below one', (not vent_choked) and vent_psi < 1),
    ('the choked riser matches the isentropic nozzle maximisation (route B) to 1e-9',
     abs(riser_b / riser - 1) < 1e-9),
    ('the plume mass flux integral returns the release rate (route B) to 1e-9',
     abs(flux_b / pl['massRateKgS'] - 1) < 1e-9),
    ('the view factor closed form matches the Gauss-Legendre surface integral (route B) to 1e-9 absolute',
     abs(fv - fv_b) < 1e-9 and abs(fh - fh_b) < 1e-9),
    ('the flame does not overhang the target', 1 + a_ * math.sin(t_) < b_),
    ('the far root lies beyond the peak', far > peak_x),
    ('the blast point is inside the Kinney and Graham range', 0.05 < z < 40),
]
for claim, ok in DECISIONS:
    if not ok:
        problems.append(f'DECISION FAILED: {claim}')

print(f'oracle_check: 18 graded fields replayed through the vendored oracle, worst relative difference '
      f'{worst:.2e} on the closed forms and roots; 4 probabilities within 2e-7 absolute and identical at six '
      f'decimals; {len(DECISIONS)} decisions and second routes checked; {len(problems)} problem(s)')
for p in problems:
    print(f'  {p}')
if PLANT:
    caught = [p for p in problems if p.startswith(planted)]
    print(f'NEGATIVE CONTROL: {planted} perturbed by ten tolerances; caught {len(caught)}')
    sys.exit(1 if caught else 2)
sys.exit(1 if problems else 0)
