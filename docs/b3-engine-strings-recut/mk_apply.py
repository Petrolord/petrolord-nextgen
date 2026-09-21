#!/usr/bin/env python3
"""Write tools/course-waves/<slug>/apply_b3_recut_<slug>.sh from apply_template.sh,
pinning the sha256 of each recut migration as it is on disk (commit it, then
`apply_b3_recut_<slug>.sh verify` with REF=HEAD proves the object store agrees)."""
import glob, hashlib, os
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
NAMES = {'crude': 'Crude Assay & Blending', 'refinery': 'Refinery Feasibility & Planning',
         'supply': 'Terminals, Depots & Fuel Supply', 'gasvalue': 'Flare Gas to Value & LPG/CNG',
         'carbon': 'Carbon & Energy Efficiency'}
T = open(os.path.join(HERE, 'apply_template.sh'), encoding='utf-8').read()
order = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
for slug, name in NAMES.items():
    files = sorted(glob.glob(os.path.join(REPO, 'migrations', f'20261015_b3_recut_{slug}_*.sql')),
                   key=lambda p: order[p.rsplit('_', 1)[1][:-4]])
    stems = [os.path.basename(p)[:-4] for p in files]
    dig = '\n'.join(f"    {s:40s}) echo {hashlib.sha256(open(p, 'rb').read()).hexdigest()} ;;" for s, p in zip(stems, files))
    out = T.replace('@SLUG@', slug).replace('@NAME@', name).replace('@FILES@', '\n'.join(stems)).replace('@DIGESTS@', dig)
    path = os.path.join(REPO, 'tools', 'course-waves', slug, f'apply_b3_recut_{slug}.sh')
    open(path, 'w', encoding='utf-8').write(out)
    os.chmod(path, 0o755)
    print(path, len(stems), 'files')
