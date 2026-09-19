#!/usr/bin/env python3
"""GATE: a capstone prompt may not hand a learner a graded answer.

A prompt is the one text a learner reads while being graded. For each of the
three draft prompts in capstone.json this refuses:

  1. ANY GRADED VALUE OF ANY TIER, as any number token in the prompt that IS a
     rounding of it (a token with d decimals within half a unit in its d-th
     place of the value, signed or absolute). "1243.63" hands over a heating
     value of 1243.6266 as surely as "1243.6266" does.
  2. ANY INTERMEDIATE THE ENGINE DERIVES on the way to a graded field, read from
     the engine rather than typed: the normalised mole fractions, the carbon per
     mole, the molar mass, the whole gas mass per Mscf, ethane plus, the scf a
     year, the flare's gross CO2e and each species, the Mscf a year, revenue,
     operating cost, margin, the blend's density, latent heat and mass
     fractions, the vaporizer's terms and undesigned duty, the arrival rate,
     the effective positions and the queue's other figures, the absolute
     pressures, Z, the ideal mass, the kg per fill, the delivered and stored
     gas, where the next vehicle stops, the derived CNG consumption and the
     annual saving. A prompt that prints one has done a step of the calculation
     for the learner.
  3. ANY WHOLE-NUMBER INTERMEDIATE (the positions wholly working, the fills
     before recharge) printed as an integer token: the crude wave skipped
     integer tokens because no graded field there was a count; here two
     derived counts exist, so integer tokens are checked against them.

It prints how many prompts, tokens and derived figures it swept, and refuses an
empty sweep. Negative control: --plant appends one graded value rounded to two
decimals, one derived figure and the fills count to a prompt, and the gate must
name all three.

importable: DERIVED and INTEGERS are module-level, for a later go-live sweep.
"""
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
NUM = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w])')

_OUT = json.loads(subprocess.run(['node', '--input-type=module', '-e', f"""
const K = await import('{W}/gasvalue_fields_capstone.mjs');
const {{ components }} = await import('{W}/gasvalue_capstone.mjs');
const E = process.env.ET_ENGINES || '/root/wt-et-gasvalue-nextgen/packages/engines';
const F = await import(E + '/engines/downstream/flareToValue.js');
const L = await import(E + '/engines/downstream/lpgCng.js');
const out = []; const ints = [];
const gasBits = (name, g) => {{
  // A sheet that sums to one normalises to itself: its fractions are the
  // prompt's own inputs, not something the engine derived.
  if (Math.abs(g.rawMoleFractionSum - 1) > 1e-12) g.normalised.forEach((r) => out.push([name + ' normalised ' + r.code, r.moleFraction]));
  if (Math.abs(g.rawMoleFractionSum - 1) > 1e-12) for (const k of ['co2MoleFraction', 'methaneMoleFraction']) out.push([name + ' ' + k, g[k]]);
  for (const k of ['ghvBtuScf', 'inertMoleFraction', 'carbonPerMol', 'hydrocarbonCarbonPerMol', 'molarMassLbLbmol', 'kgPerMscf', 'c3PlusKgPerMscf', 'gpmC2Plus', 'gpmC3Plus']) out.push([name + ' ' + k, g[k]]);
}};
const eg = F.characteriseGas({{ components: components(K.ERIEMU_GAS) }});
gasBits('ERIEMU', eg);
const ef = F.abatement({{ gas: eg, ...K.ERIEMU_FLARE }});
for (const k of ['scfPerYear', 'flareCo2Tonnes', 'flareCh4Tonnes', 'flareCo2eTonnes', 'methaneShareOfFlareCo2e']) out.push(['ERIEMU ' + k, ef[k]]);
const ag = F.characteriseGas({{ components: components(K.ADIBAWA_GAS) }});
gasBits('ADIBAWA', ag);
const {{ id, ...r }} = K.ADIBAWA_ROUTE;
const ae = F.routeEconomics({{ route: F.ROUTE_TEMPLATES.find((t) => t.id === id), gas: ag, volumeMMscfd: K.ADIBAWA_FLARE.volumeMMscfd, onstreamDays: K.ADIBAWA_FLARE.onstreamDays, ...r }});
for (const k of ['mscfPerYear', 'productPerYear', 'revenuePerYear', 'operatingCostPerYear', 'grossMarginPerYear', 'valuePerMscf', 'capitalCost', 'yieldCeilingPerMscf']) out.push(['ADIBAWA ' + k, ae[k]]);
const aa = F.abatement({{ gas: ag, ...K.ADIBAWA_FLARE, recoveryFraction: r.recoveryFraction, ...K.ADIBAWA_COUNTERFACTUAL }});
for (const k of ['scfPerYear', 'flareCo2Tonnes', 'flareCh4Tonnes', 'flareCo2eTonnes', 'avoidedFlareCo2eTonnes', 'netAbatementTonnesCo2ePerYear']) out.push(['ADIBAWA ' + k, aa[k]]);
const cr = F.creditSensitivity({{ netAbatementTonnesCo2ePerYear: aa.netAbatementTonnesCo2ePerYear, grossMarginPerYear: ae.grossMarginPerYear, ...K.ADIBAWA_CREDITS }});
out.push(['ADIBAWA breakeven', cr.breakevenCreditPrice]);
cr.points.forEach((p) => {{ out.push(['ADIBAWA credit revenue at ' + p.creditPrice, p.creditRevenuePerYear]); out.push(['ADIBAWA total margin at ' + p.creditPrice, p.totalMarginPerYear]); }});
const b = L.lpgBlendProperties({{ components: K.ASABA_LPG }});
out.push(['ASABA blend density', b.densityKgM3]); out.push(['ASABA blend latent heat', b.latentHeatKJkg]); out.push(['ASABA blend molar mass', b.molarMassKgKmol]);
b.massFractions.forEach((m) => out.push(['ASABA mass fraction ' + m.code, m.massFraction]));
const st = L.lpgStorageSizing({{ ...K.ASABA_VESSEL, liquidDensityKgM3: b.densityKgM3 }});
for (const k of ['usableM3', 'usableTonnes', 'vapourSpaceM3', 'coverDays', 'reorderAtTonnes', 'ullageAtReorderTonnes']) out.push(['ASABA vessel ' + k, st[k]]);
const v = L.vaporizerDuty({{ ...K.ASABA_VAPORIZER, latentHeatKJkg: b.latentHeatKJkg }});
v.terms.forEach((t) => out.push(['ASABA vaporizer ' + t.label, t.kW]));
out.push(['ASABA vaporizer duty', v.dutyKW]); out.push(['ASABA vaporizer design duty', v.designDutyKW]);
const q = L.bottlingPlant(K.ASABA_BOTTLING);
out.push(['ASABA arrivals per hour', q.arrivalsPerHour]); out.push(['ASABA effective positions', q.effectivePositions]);
for (const k of ['offered', 'utilisation', 'probabilityOfWaiting', 'averageWaitMinutes', 'queueLength']) out.push(['ASABA queue ' + k, q.queue[k]]);
out.push(['ASABA throughput capacity', q.throughputCapacityPerDay]);
ints.push(['ASABA positions wholly working', q.queuePositions]); ints.push(['ASABA minimum positions', q.minimumPositionsForThroughput]);
const atm = K.ASABA_CNG.atmosphereBar;
out.push(['ASABA storage bank bar(a)', K.ASABA_STORAGE_BANK.gaugeBar + atm]);
K.ASABA_CASCADE.banks.forEach((x) => out.push(['ASABA ' + x.label + ' bar(a)', x.gaugeBar + atm]));
out.push(['ASABA vehicle start bar(a)', K.ASABA_CASCADE.vehicleStartGaugeBar + atm]); out.push(['ASABA vehicle target bar(a)', K.ASABA_CASCADE.vehicleTargetGaugeBar + atm]);
const m = L.gasMassInVessel({{ volumeM3: K.ASABA_STORAGE_BANK.volumeM3, pressureBar: K.ASABA_STORAGE_BANK.gaugeBar + atm, temperatureC: K.ASABA_CNG.temperatureC, gasSg: K.ASABA_CNG.gasSg }});
for (const k of ['z', 'ppr', 'tpr', 'massKg', 'idealMassKg', 'realVersusIdeal']) out.push(['ASABA bank ' + k, m[k]]);
const c = L.cascadeFills({{ banks: K.ASABA_CASCADE.banks.map((x) => ({{ label: x.label, volumeM3: x.volumeM3, pressureBar: x.gaugeBar + atm }})), vehicleTankM3: K.ASABA_CASCADE.vehicleTankM3, vehicleStartBar: K.ASABA_CASCADE.vehicleStartGaugeBar + atm, vehicleTargetBar: K.ASABA_CASCADE.vehicleTargetGaugeBar + atm, temperatureC: K.ASABA_CNG.temperatureC, gasSg: K.ASABA_CNG.gasSg }});
for (const k of ['kgPerFill', 'deliveredKg', 'storedKg', 'leftInBanksKg', 'cascadeEfficiency', 'nextVehicleReachesBar']) out.push(['ASABA cascade ' + k, c[k]]);
c.banksAfter.forEach((x) => out.push(['ASABA cascade end ' + x.label, x.endBar]));
ints.push(['ASABA fills before recharge', c.fillsBeforeRecharge]);
const x = L.conversionEconomics(K.ASABA_CONVERSION);
for (const k of ['newFuelConsumptionPer100Km', 'annualSaving', 'savingPerKm', 'simplePaybackYears']) out.push(['ASABA switch ' + k, x[k]]);
for (const s of ['baseFuel', 'newFuel']) for (const k of ['unitsPerYear', 'costPerYear', 'costPerKm']) out.push(['ASABA switch ' + s + ' ' + k, x[s][k]]);
console.log(JSON.stringify({{ derived: out.filter(([, v]) => Number.isFinite(v) && Math.abs(v) > 1e-9), ints }}));
"""], capture_output=True, text=True, check=True).stdout)
DERIVED = _OUT['derived']
INTEGERS = _OUT['ints']


def decimals(tok):
    return len(tok.split('.')[1]) if '.' in tok else 0


def rounds_to(tok, v):
    t = float(tok)
    half = 0.5 * 10 ** -decimals(tok)
    return abs(abs(t) - abs(v)) <= half


def sweep(prompts, fields):
    bad, tokens = [], 0
    for tier, text in prompts.items():
        for tok in NUM.findall(text):
            tokens += 1
            if decimals(tok) == 0:
                # A whole-number token is a stated condition unless it is a
                # derived count. Against a graded value it hands over at most
                # an integer part, which no graded tolerance here accepts.
                for name, v in INTEGERS:
                    if int(tok) == v:
                        bad.append(f'{tier} prompt prints {tok}, the derived count {name}')
                continue
            for t, k, v, _ in fields:
                if rounds_to(tok, v):
                    bad.append(f'{tier} prompt prints {tok}, a rounding of the graded value of {t}.{k} ({v})')
            for name, v in DERIVED:
                if rounds_to(tok, v):
                    bad.append(f'{tier} prompt prints {tok}, a rounding of {name} ({v}), which the engine derives')
    return bad, tokens


def main():
    cap = json.load(open(os.path.join(W, 'capstone.json')))
    fields = json.load(open(os.path.join(W, 'fields.json')))
    prompts = {t: cap['tiers'][t]['prompt'] for t in ('beginner', 'intermediate', 'advanced')}
    if '--plant' in sys.argv:
        fills = [v for n, v in INTEGERS if 'fills' in n][0]
        prompts['advanced'] += f' For reference, the answer is {fields[7][2]:.2f}, the blend density is {DERIVED[0][1]:.3f} and {fills} taxis fill.'
    bad, tokens = sweep(prompts, fields)
    print(f'  prompts swept: {len(prompts)}; number tokens read: {tokens}; graded values: {len(fields)}; engine-derived intermediates: {len(DERIVED)}; derived counts: {len(INTEGERS)}')
    for b in bad:
        print(f'  LEAK {b}')
    if len(prompts) != 3 or tokens < 60 or len(DERIVED) < 60:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
