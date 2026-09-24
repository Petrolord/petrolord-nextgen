#!/usr/bin/env python3
"""THE EIGHTEEN GRADED D3 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone datasets through tools/validation/dataai/oracle_cluster.py (python
standard library only: Fraction means and Decimal(60) standard deviations for
the scalers; PCA eigenvalues by bisection on the inertia of S - xI with
eigenvectors by inverse iteration; mulberry32 in 32-bit integers with the
k-means++ draw compared exactly; Lloyd in Decimal(60); the silhouette row by
row from its definition; agglomerative heights from their DEFINITIONS every
pair every step; kNN by a full sort; CART by re-counting every candidate
split in Fractions; the adjusted Rand index by counting every pair of rows;
one-to-one matching by brute force over every injective map), which was
written independently of the engine from the published definitions, and
requires every graded value to agree to 1e-10 relative AND to a thousandth
of its own grading tolerance absolute, so no graded value rests on float
noise the tolerance could not absorb.

The oracle's ambiguity guard is kept ON: where a float program could branch
differently from the exact one (a distance or merge height at the edge of
the 1e-12 tie band, a k-means++ draw at a boundary, a sign-rule loading near
its band) the oracle raises, and this check REFUSES rather than compare.

    python3 oracle_check.py [--plant]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import json
import os
import subprocess
import sys
import time
from fractions import Fraction as F

HERE = os.environ.get('D3_WAVE_DIR', '/root/dai-wip-facies')
ENG = os.environ.get('D3_ENGINES', '/root/wt-dai-d3-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'dataai'))
try:
    import oracle_cluster as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the oracle could not be imported ({e}).')
    sys.exit(2)

PLANT = '--plant' in sys.argv
T0 = time.time()
fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print(f'REFUSED: fields.json carries {len(fields)} fields')
    sys.exit(2)
graded = {k: (v, tol) for _, k, v, tol in fields}
env = dict(os.environ, D3_ENGINES=ENG)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'd3_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=env).stdout)
IH, NK, OG = inp['IHIALA'], inp['NKWELLE'], inp['OGBUNIKE']
LOGS = ['GR', 'RHOB', 'NPHI', 'PEF']
LOGS_C = LOGS + ['CALI']


def xof(rows, feats=LOGS):
    return [[r[f] for f in feats] for r in rows]


def pick(a, idx):
    return [a[i] for i in idx]


def cored(field):
    return [r for r in field['rows'] if r['FACIES'] is not None]


got = {}
try:
    # ---- IHIALA
    ihS = IH['stated']
    ihR = cored(IH['field'])
    ihX = xof(ihR)
    pca, _ = O.o_pca(ihX, LOGS, 'correlation')
    km, _ = O.o_kmeans(ihX, ihS['k'], seed=ihS['seed'], n_init=10, names=LOGS)
    got['ihiala_gr_scale_gapi'] = km['scaler']['scale'][0]
    got['ihiala_pc1_ratio'] = pca['explainedVarianceRatio'][0]
    got['ihiala_pc1_nphi_loading'] = pca['loadings'][0][2]
    got['ihiala_pc1_score_first_row'] = pca['scores'][0][0]
    got['ihiala_kmeans_inertia'] = km['inertia']
    got['ihiala_row24_cluster_gr_centre_gapi'] = km['centresOriginal'][km['labels'][ihS['centreRow']]][0]

    # ---- NKWELLE
    nkS = NK['stated']
    nkR = cored(NK['field'])
    nkX = xof(nkR)
    nkY = [r['FACIES'] for r in nkR]
    k3, _ = O.o_kmeans(nkX, nkS['k'] - 1, seed=nkS['seed'], n_init=10)
    k4, _ = O.o_kmeans(nkX, nkS['k'], seed=nkS['seed'], n_init=10)
    got['nkwelle_elbow_drop_fraction_k4'] = float((F(k3['inertia']) - F(k4['inertia'])) / F(k3['inertia']))
    ward, _ = O.o_agglomerative(nkX, 'ward', nkS['k'])
    got['nkwelle_ward_silhouette'] = O.o_silhouette(nkX, ward['labels'])['mean']
    got['nkwelle_ward_height_above_cut'] = ward['cutHeights']['above']
    comp, _ = O.o_agglomerative(nkX, 'complete', nkS['k'])
    got['nkwelle_complete_ari'] = float(O.o_ari(nkY, comp['labels']))
    got['nkwelle_one_to_one_macro_f1'] = O.o_match(nkY, k4['labels'])['report']['macro']['f1']
    k6, _ = O.o_kmeans(nkX, nkS['kOver'], seed=nkS['seed'], n_init=10)
    got['nkwelle_majority_accuracy_k6'] = O.o_match(nkY, k6['labels'], 'majority')['report']['accuracy']

    # ---- OGBUNIKE
    ogS = OG['stated']
    ogR = cored(OG['field'])
    ogG = [r['well'] for r in ogR]
    ogX = xof(ogR)
    ogX5 = xof(ogR, LOGS_C)
    ogY = [r['FACIES'] for r in ogR]
    TR = [i for i, g in enumerate(ogG) if g != ogS['heldOut']]
    TE = [i for i, g in enumerate(ogG) if g == ogS['heldOut']]
    kn = O.o_knn(pick(ogX, TR), pick(ogY, TR), pick(ogX, TE), ogS['k'])
    labels = O.label_sort(ogY)
    got['ogbunike_knn_heldout_accuracy'] = O.o_report(pick(ogY, TE), kn['predictions'], labels)['accuracy']
    got['ogbunike_knn_nearest_distance'] = kn['distances'][0][0]
    tree, _ = O.o_cart(ogX5, ogY, LOGS_C)
    got['ogbunike_cart_node2_gini'] = float(tree['nodes'][2]['gini'])
    got['ogbunike_cart_nphi_importance'] = tree['featureImportances'][2]
    t3, pred3 = O.o_cart(pick(ogX5, TR), pick(ogY, TR), LOGS_C, max_depth=ogS['depth'])
    p3 = [pred3(r)['prediction'] for r in pick(ogX5, TE)]
    got['ogbunike_cart_depth3_heldout_accuracy'] = O.o_report(pick(ogY, TE), p3, labels)['accuracy']
    lo = min(F(r[0]) for r in ogX)
    hi = max(F(r[0]) for r in ogX)
    unc = [r for r in OG['field']['rows'] if r['well'] == ogS['uncored']]
    got['ogbunike_uncored_gr_minmax_max'] = float((max(F(r['GR']) for r in unc) - lo) / (hi - lo))
except O.Ambiguous as e:
    print(f'REFUSED: the oracle met an ambiguous case and will not write it ({e}); a graded value there would rest on rounding')
    sys.exit(2)

if set(got) != set(graded):
    print(f'REFUSED: the oracle computed {sorted(set(got))} against {sorted(set(graded))}')
    sys.exit(2)

if PLANT:
    k0 = 'nkwelle_ward_height_above_cut'
    got[k0] = got[k0] + 10 * graded[k0][1]

worst = 0.0
bad = []
print(f'{"field":46s} {"engine (fields.json)":>22s} {"oracle":>22s} {"relative":>10s}  within')
for _, k, v, tol in fields:
    o = got[k]
    rel = abs(o - v) / max(abs(v), 1e-300)
    worst = max(worst, rel)
    ok = rel <= 1e-10 and abs(o - v) <= tol / 1000
    if not ok:
        bad.append(k)
    print(f'{k:46s} {v:22.15g} {o:22.15g} {rel:10.2e}  {"yes" if ok else "NO"}')
print(f'oracle_check: 18 graded values replayed through the stdlib oracle in {time.time() - T0:.0f} s; worst relative difference {worst:.2e}; disagreements: {len(bad)}')
if PLANT:
    print(f'NEGATIVE CONTROL: nkwelle_ward_height_above_cut was moved by ten tolerances; {"caught" if bad == ["nkwelle_ward_height_above_cut"] else "NOT CAUGHT as planted"}')
    sys.exit(1 if bad == ['nkwelle_ward_height_above_cut'] else 2)
sys.exit(1 if bad else 0)
