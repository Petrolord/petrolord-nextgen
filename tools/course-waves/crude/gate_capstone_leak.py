#!/usr/bin/env python3
"""GATE: the capstone and the teaching cases are two separate roads.

Four checks, each printing what it examined:

  1. NAMES. No capstone record or stream name (IDAMA, OGBELE, ONNE and their
     crudes) appears in digest.txt, crude_dump.mjs or crude_fields.mjs; no
     teaching record or stream name (OBIGBO, KWALE, APAPA and theirs) appears in
     crude_fields_capstone.mjs or in a capstone prompt.
  2. CONDITION SETS. No capstone crude carries a teaching crude's defining
     figures (its API together with its TBP curve), no capstone component a
     teaching component's (cost, SG and RON together), and no capstone cut set
     is a teaching cut set: a shared record is a shared answer, whatever it is
     called.
  3. THE GOLDENS. No golden case in the vendored downstream goldens carries a
     capstone crude's API and curve or a capstone component's cost and SG, in
     either direction (FC4's repair once took a capstone's exact conditions for
     a golden row, and the published file handed back a graded answer); and no
     number the goldens print is within tolerance of a graded value.
  4. THE ANSWERS. No graded value, to four decimals, is printed by the digest or
     the teaching case file.

Negative control: --plant copies one capstone crude into the teaching library in
memory and one capstone name into the digest text, and the gate must name both.
"""
import glob
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('MD_ENGINES', '/root/wt-md-crude-nextgen/packages/engines')


def exports(path):
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', f"""
const K = await import('{path}');
const out = {{}};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function') out[k] = v;
console.log(JSON.stringify(out));"""], capture_output=True, text=True, check=True).stdout)


K = exports(f'{W}/crude_fields_capstone.mjs')
F = exports(f'{W}/crude_fields.mjs')
read = lambda p: open(os.path.join(W, p), encoding='utf-8').read()


def crudes(d):
    out = []
    for v in d.values():
        if isinstance(v, list):
            out += [x for x in v if isinstance(x, dict) and 'curve' in x and 'api' in x]
        elif isinstance(v, dict) and 'curve' in v and 'api' in v:
            out.append(v)
    return out


def components(d):
    out = []
    for v in d.values():
        if isinstance(v, list):
            out += [x for x in v if isinstance(x, dict) and 'cost' in x and 'sg' in x]
    return out


def sig_crude(c):
    return (float(c['api']), tuple((float(p['volumePercent']), float(p['temperatureF'])) for p in c['curve']))


def sig_comp(c):
    return (float(c['cost']), float(c['sg']), float(c.get('ron', c.get('cetane', -1))))


def cutsets(d):
    return [tuple((c.get('fromF'), c.get('toF')) for c in v) for v in d.values()
            if isinstance(v, list) and v and isinstance(v[0], dict) and 'fromF' in v[0]]


def main():
    plant = '--plant' in sys.argv
    digest = read('digest.txt')
    teach_src = read('crude_dump.mjs') + read('crude_fields.mjs')
    cap = json.load(open(os.path.join(W, 'capstone.json')))
    prompts = ' '.join(v['prompt'] for v in cap['tiers'].values())
    cap_src = read('crude_fields_capstone.mjs')
    t_crudes, k_crudes = crudes(F), crudes(K)
    t_comps, k_comps = components(F), components(K)
    if plant:
        t_crudes.append(k_crudes[0])
        digest += '\nOGBELE'
    bad = []
    cap_names = ['IDAMA', 'OGBELE', 'ONNE'] + [c['name'] for c in k_crudes]
    teach_names = ['OBIGBO', 'KWALE', 'APAPA', 'EBOCHA'] + [c['name'] for c in t_crudes if c not in k_crudes]
    for n in cap_names:
        for label, text in (('digest.txt', digest), ('crude_dump.mjs + crude_fields.mjs', teach_src)):
            if re.search(rf'\b{re.escape(n)}\b', text, re.I):
                bad.append(f'capstone name {n!r} appears in {label}')
    for n in teach_names:
        for label, text in (('crude_fields_capstone.mjs', cap_src), ('a capstone prompt', prompts)):
            if re.search(rf'\b{re.escape(n)}\b', text, re.I):
                bad.append(f'teaching name {n!r} appears in {label}')
    print(f'  1. names: {len(cap_names)} capstone names against the teaching road, {len(teach_names)} teaching names against the capstone road')
    ts = {sig_crude(c) for c in t_crudes}
    for c in k_crudes:
        if sig_crude(c) in ts or any(float(c['api']) == t[0] or sig_crude(c)[1] == t[1] for t in ts):
            bad.append(f'capstone crude {c["name"]} shares its API or its curve with a teaching crude')
    tc = {sig_comp(c) for c in t_comps}
    for c in k_comps:
        if sig_comp(c) in tc:
            bad.append(f'capstone component {c["name"]} shares cost, SG and octane with a teaching component')
    t_cuts = set(cutsets(F))
    for cs in cutsets(K):
        if cs in t_cuts:
            bad.append(f'a capstone cut set {cs} is a teaching cut set')
    print(f'  2. condition sets: {len(k_crudes)} capstone crudes against {len(t_crudes)} teaching crudes, {len(k_comps)} components against {len(t_comps)}, {len(cutsets(K))} cut sets against {len(t_cuts)}')
    goldens = sorted(glob.glob(os.path.join(ENG, 'test-data', 'downstream', 'goldens', '*.json')))
    gtext = ''
    for g in goldens:
        gtext += open(g, encoding='utf-8').read()
    gold_crudes, gold_comps = [], []

    def walk(o):
        if isinstance(o, dict):
            if isinstance(o.get('curve'), list) and o['curve'] and isinstance(o['curve'][0], dict):
                gold_crudes.append(o)
            if 'cost' in o and 'sg' in o:
                gold_comps.append(o)
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    for g in goldens:
        walk(json.load(open(g)))
    gs = {tuple((float(p['volumePercent']), float(p['temperatureF'])) for p in c['curve']) for c in gold_crudes}
    gapi = {float(x) for x in re.findall(r'"api": (-?\d+(?:\.\d+)?)', gtext)}
    for c in k_crudes:
        if sig_crude(c)[1] in gs or float(c['api']) in gapi:
            bad.append(f'capstone crude {c["name"]} carries a golden curve or a golden API')
    gc = {(float(c['cost']), float(c['sg'])) for c in gold_comps}
    for c in k_comps:
        if (float(c['cost']), float(c['sg'])) in gc:
            bad.append(f'capstone component {c["name"]} carries a golden cost and SG')
    fields = json.load(open(os.path.join(W, 'fields.json')))
    gnums = {abs(float(x)) for x in re.findall(r'-?\d+\.\d+(?:[eE][-+]?\d+)?', gtext)}
    for t, k, v, tol in fields:
        if any(abs(abs(v) - g) <= tol for g in gnums):
            bad.append(f'{t}.{k} = {v} is within tolerance of a number the goldens print')
    print(f'  3. goldens: {len(goldens)} files, {len(gold_crudes)} golden crudes, {len(gold_comps)} golden components, {len(gnums)} golden decimals against 18 graded values')
    for t, k, v, tol in fields:
        s = f'{v:.4f}'
        if s in digest or s in read('crude_fields.mjs'):
            bad.append(f'{t}.{k} prints as {s} on the teaching road')
    print('  4. answers: 18 graded values at four decimals against digest.txt and crude_fields.mjs')
    for b in bad:
        print(f'  LEAK {b}')
    if len(goldens) < 7 or not k_crudes or not t_crudes or not k_comps or not t_comps:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


sys.exit(main())
