#!/usr/bin/env python3
"""Independent oracle for the ODUMA case: re-reads the six case files with lasio
(the reader the engine's LAS parser is validated against) and prints every
parser-level graded count and the GR mean, for comparison with fields.json.

  python3 -m venv /tmp/lasenv && /tmp/lasenv/bin/pip install lasio numpy
  /tmp/lasenv/bin/python docs/graded-field-audit/w5c/welldata/oracle_lasio.py

Checked 2026-09-22 with lasio 0.32: every count and the GR mean
(float32 samples, float64 nanmean) equal fields.json exactly. The gate itself
is src/components/course/panels/welldata/w5cRecase.test.js, which regenerates
the keys through the engine; this script is the second opinion.
"""
import glob, json, os
import lasio
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
CASE = os.path.join(HERE, '..', '..', '..', '..', 'src', 'content', 'capstone-cases', 'welldata')
F = json.load(open(os.path.join(HERE, 'fields.json')))
v = {f['key']: f['expected'] for t in F.values() for f in t}


def read(name):
    return lasio.read(os.path.join(CASE, name), engine='normal')


main = read('oduma2_main.las')
feet = read('oduma3_feet.las')
irr = read('oduma4_irregular.las')
nul = read('oduma5_nulls.las')
wrp = read('oduma1_wrapped.las')
got = {
    'oduma2_n_samples': len(main.index),
    'oduma2_gr_nulls': int(np.isnan(main['GR']).sum()),
    'oduma2_gr_mean': float(np.nanmean(main['GR'].astype(np.float32).astype(np.float64))),
    'oduma5_pef_nulls': int(np.isnan(nul['PEF']).sum()),
    'oduma1_n_samples': len(wrp.index),
    'oduma1_wrapped_samples': len(wrp.index),
    'oduma4_n_samples': len(irr.index),
    'oduma5_flagged_nulls': int(sum(np.isnan(c.data).sum() for c in nul.curves[1:])),
    'oduma_campaign_curves': sum(len(read(os.path.basename(p)).curves) - 1 for p in glob.glob(os.path.join(CASE, '*.las'))),
    'oduma3_converted_curves': sum(1 for c in feet.curves if c.unit in ('F', 'US/F')),
}
bad = 0
for k, x in got.items():
    ok = abs(x - v[k]) <= 1e-12
    bad += not ok
    print(f"{'ok ' if ok else 'BAD'} {k}: lasio {x!r}  fields.json {v[k]!r}")
raise SystemExit(1 if bad else 0)
