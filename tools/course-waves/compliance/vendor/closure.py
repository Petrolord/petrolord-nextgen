#!/usr/bin/env python3
"""WALK THE IMPORT CLOSURE of the ASSURANCE family in the engines repository at
the pinned commit, then prove the vendored NextGen copy is sha-identical PATH BY
PATH.

Adapted from FC6's vendor/closure.py. Two changes, both forced by this wave:

1. THE PIN IS NOT HEAD. The engines clone's local branch head is 3035f2d, which
   carries an identical assurance tree, but the Suite pins the squash merge of
   PR #211, 6b00f43. So the canonical side is read from `git archive 6b00f43`
   extracted to engines-6b00f43/, and every canonical blob is `git rev-parse
   6b00f43:<path>` rather than `HEAD:<path>`.
2. THE SEEDS ARE THE WHOLE FAMILY. Both assurance waves (compliance and
   riskchange) vendor the identical set so their two PRs cannot conflict: all
   ten engine modules, their ten goldens, ten oracles, ten FINDINGS records and
   every jest suite that names an assurance module. The seeds are DISCOVERED
   from the canonical tree by path pattern, not typed, and the walker then adds
   anything they reach.

It reads every ES import, CommonJS require, dynamic import, relative data read
(path.join(__dirname, ...)) and Python module-level path read out of each file,
and keeps going until nothing new appears. It REFUSES if a seed is missing, if
an edge resolves to nothing, or if it resolved nothing at all.
"""
import json, os, re, subprocess, sys

ENGINES_GIT = "/root/petrolord-engines"
PIN = "6b00f4370e2090bcda4973626949c2dd458501d0"
TREE = "/root/as-wip-compliance/engines-6b00f43"
VENDOR = sys.argv[1] if len(sys.argv) > 1 else "/root/wt-as-compliance-nextgen/packages/engines"
OUT = "/root/as-wip-compliance/vendor/closure.json"

ls = subprocess.run(["git", "-C", ENGINES_GIT, "ls-tree", "-r", "--name-only", PIN],
                    capture_output=True, text=True, check=True).stdout.split("\n")
SEED_PAT = re.compile(r"^(engines/assurance/[^/]+\.js"
                      r"|test-data/assurance/goldens/[^/]+\.json"
                      r"|tools/validation/assurance/[^/]+\.(py|md)"
                      r"|__tests__/assurance\.[^/]+\.test\.js)$")
SEEDS = sorted(p for p in ls if SEED_PAT.match(p))

IMP = re.compile(r"""(?:^|\n)\s*(?:import\s+(?:[\w*{}\s,]+\s+from\s+)?|export\s+[\w*{}\s,]+\s+from\s+)['"]([^'"]+)['"]""")
REQ = re.compile(r"""require\(\s*['"]([^'"]+)['"]\s*\)""")
DYN = re.compile(r"""import\(\s*[`'"]([^`'"$]+)[`'"]\s*\)""")
JOIN = re.compile(r"""path\.join\(\s*__dirname\s*,\s*((?:['"][^'"]+['"]\s*,?\s*)+)\)""")
PYFROM = re.compile(r"""^\s*(?:from\s+([\w.]+)\s+import|import\s+([\w.]+))""", re.M)


def read(rel):
    with open(os.path.join(TREE, rel), encoding="utf8", errors="replace") as fh:
        return fh.read()


def resolve(base_rel, spec):
    if not spec.startswith("."):
        return None                      # a bare package name: not in this repo
    cand = os.path.normpath(os.path.join(os.path.dirname(base_rel), spec))
    for c in (cand, cand + ".js", os.path.join(cand, "index.js")):
        if os.path.isfile(os.path.join(TREE, c)):
            return c
    raise SystemExit(f"CLOSURE REFUSES: {base_rel} imports {spec}, which resolves to nothing at {PIN[:7]}")


def data_edges(rel, src):
    out = []
    for m in JOIN.finditer(src):
        parts = re.findall(r"""['"]([^'"]+)['"]""", m.group(1))
        cand = os.path.normpath(os.path.join(os.path.dirname(rel), *parts))
        if os.path.isfile(os.path.join(TREE, cand)):
            out.append(cand)
        elif os.path.isdir(os.path.join(TREE, cand)):
            # a directory read (the goldens gate reads every *.json in it, and
            # loads every engine module by name): every file in it is an edge
            for f in sorted(os.listdir(os.path.join(TREE, cand))):
                p = os.path.join(cand, f)
                if os.path.isfile(os.path.join(TREE, p)):
                    out.append(p)
    return out


def py_edges(rel, src):
    """A sibling oracle imported by name (oracle_audit imports oracle_iso)."""
    out = []
    for m in PYFROM.finditer(src):
        mod = (m.group(1) or m.group(2)).split(".")[0]
        cand = os.path.join(os.path.dirname(rel), mod + ".py")
        if os.path.isfile(os.path.join(TREE, cand)):
            out.append(cand)
    return out


missing = [s for s in SEEDS if not os.path.isfile(os.path.join(TREE, s))]
if missing or not SEEDS:
    raise SystemExit(f"CLOSURE REFUSES: seed path(s) absent or none discovered: {missing}")

seen, queue, edges = set(), list(SEEDS), []
while queue:
    rel = queue.pop(0)
    if rel in seen:
        continue
    seen.add(rel)
    if rel.endswith((".json", ".md")):
        continue
    src = read(rel)
    found = set()
    if rel.endswith(".py"):
        found.update(py_edges(rel, src))
    else:
        for pat in (IMP, REQ, DYN):
            for m in pat.finditer(src):
                r = resolve(rel, m.group(1))
                if r:
                    found.add(r)
        found.update(data_edges(rel, src))
    for f in sorted(found):
        edges.append((rel, f))
        if f not in seen:
            queue.append(f)

closure = sorted(seen)
if not closure:
    raise SystemExit("CLOSURE REFUSES: resolved nothing at all")

print(f"engines pin {PIN[:7]}  seeds {len(SEEDS)}  CLOSURE {len(closure)} path(s)")
extra = sorted(set(closure) - set(SEEDS))
print(f"reached beyond the seeds: {len(extra)} {extra}")
print(f"import/read edges walked: {len(edges)}")

rows, bad = [], []
for rel in closure:
    can = subprocess.run(["git", "-C", ENGINES_GIT, "rev-parse", f"{PIN}:{rel}"],
                         capture_output=True, text=True)
    canonical = can.stdout.strip() if can.returncode == 0 else "NOT-TRACKED"
    vp = os.path.join(VENDOR, rel)
    if os.path.isfile(vp):
        vend = subprocess.run(["git", "hash-object", vp],
                              capture_output=True, text=True, check=True).stdout.strip()
        md5v = subprocess.run(["md5sum", vp], capture_output=True, text=True, check=True).stdout.split()[0]
    else:
        vend, md5v = "ABSENT", "ABSENT"
    md5c = subprocess.run(["md5sum", os.path.join(TREE, rel)],
                          capture_output=True, text=True, check=True).stdout.split()[0]
    same = canonical == vend and md5c == md5v
    rows.append({"path": rel, "canonicalBlob": canonical, "vendoredBlob": vend,
                 "canonicalMd5": md5c, "vendoredMd5": md5v, "identical": same})
    if not same:
        bad.append(rel)
    print(f"{'OK  ' if same else 'DIFF'} blob {canonical[:12]} {vend[:12]}  md5 {md5c[:12]} {md5v[:12]}  {rel}")

if VENDOR.startswith("/root/wt-as-compliance-nextgen"):
    json.dump({"enginesPin": PIN, "seeds": SEEDS, "closure": rows, "edges": edges},
              open(OUT, "w"), indent=1)
print(f"\n{len(closure) - len(bad)} of {len(closure)} closure paths are SHA-IDENTICAL with engines {PIN[:7]} in {VENDOR}")
if bad:
    print("NOT identical: " + ", ".join(bad))
    sys.exit(1)
