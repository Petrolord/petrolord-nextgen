#!/usr/bin/env python3
"""WALK THE IMPORT CLOSURE of the whole engines/assurance family at engines
REV (default ab3ce6a, ASC-1; run before at 6b00f43 and 9d5d3b4), then prove the vendored NextGen copy is sha-identical PATH BY PATH.

Adapted from FC6's vendor/closure.py. Two differences, both forced by this
family:

1. The engines checkout's local branch head is 3035f2d, not the squash merge
   6b00f43 the Suite pins. The two have identical assurance trees, but this
   walker must not depend on that, so it never reads the working tree. It
   reads an `git archive 6b00f43` export (SRC) and takes every canonical blob
   hash from `git rev-parse 6b00f43:<path>`, so the proof is against the
   pinned commit and nothing else.
2. The oracles import one another (oracle_risk, oracle_compliance and
   oracle_documents import oracle_calendar; oracle_audit imports oracle_iso),
   so the walker also reads Python `import oracle_x` / `from oracle_x import`
   edges and resolves them in the importing file's own directory.

It REFUSES if a seed is missing, if an edge resolves to nothing, or if it
resolved nothing at all. Both assurance waves (riskchange, compliance) vendor
this identical set so their two pull requests cannot conflict.
"""
import json, os, re, subprocess, sys  # noqa: E401

ENGINES_GIT = "/root/petrolord-engines"
REV = os.environ.get("RC_ENGINES_REV", "ab3ce6a")
# The pinned tree, exported fresh on every run into a temporary directory, so
# nothing stale in the wave directory can stand in for the commit.
import atexit, shutil, tempfile
SRC = tempfile.mkdtemp(prefix=f"engines-{REV}-")
atexit.register(shutil.rmtree, SRC, True)
_arch = subprocess.run(["git", "-C", "/root/petrolord-engines", "archive", REV,
                        "engines/assurance", "test-data/assurance", "__tests__", "tools/validation/assurance"],
                       capture_output=True, check=True).stdout
subprocess.run(["tar", "-x", "-C", SRC], input=_arch, check=True)
VENDOR = "/root/wt-as-riskchange-nextgen/packages/engines"
OUT = "/root/as-wip-riskchange/vendor/closure.json"
MODULES = ["auditManagement", "calendar", "complianceStatus", "documentControl",
           "isoCompliance", "lessonsLearned", "managementOfChange", "peerReview",
           "qualityAssurance", "riskScoring"]
ORACLES = ["audit", "calendar", "compliance", "documents", "iso", "lessons", "moc",
           "peer_review", "quality", "risk"]
FINDINGS = ["audit", "calendar", "compliance", "documents", "iso", "lessons", "moc",
            "peer-review", "quality", "risk"]
# The suites are SEEDED BY LISTING the commit, never by a typed list: ASC-0 added
# assurance.copy and assurance.instants, which nothing else imports, so a typed
# list would have silently left them behind.
SUITES = sorted(re.match(r"__tests__/assurance\.(\w+)\.test\.js$", p).group(1)
                for p in subprocess.run(["git", "-C", "/root/petrolord-engines", "ls-tree", "-r", "--name-only", REV,
                                         "__tests__/"], capture_output=True, text=True, check=True).stdout.split()
                if re.match(r"__tests__/assurance\.(\w+)\.test\.js$", p))
SEEDS = ([f"engines/assurance/{m}.js" for m in MODULES]
         + [f"test-data/assurance/goldens/{m}_cases.json" for m in MODULES]
         + [f"tools/validation/assurance/oracle_{o}.py" for o in ORACLES]
         + [f"tools/validation/assurance/FINDINGS-{f}.md" for f in FINDINGS]
         + [f"__tests__/assurance.{s}.test.js" for s in SUITES])

IMP = re.compile(r"""(?:^|\n)\s*(?:import\s+(?:[\w*{}\s,]+\s+from\s+)?|export\s+[\w*{}\s,]+\s+from\s+)['"]([^'"]+)['"]""")
REQ = re.compile(r"""require\(\s*['"]([^'"]+)['"]\s*\)""")
DYN = re.compile(r"""import\(\s*[`'"]([^`'"$]+)[`'"]\s*\)""")
JOIN = re.compile(r"""path\.join\(\s*__dirname\s*,\s*((?:['"][^'"]+['"]\s*,?\s*)+)\)""")
PYIMP = re.compile(r"""^\s*(?:from\s+(oracle_\w+)\s+import|import\s+(oracle_\w+))""", re.M)


def read(rel):
    with open(os.path.join(SRC, rel), encoding="utf8", errors="replace") as fh:
        return fh.read()


def resolve(base_rel, spec):
    if not spec.startswith("."):
        return None
    cand = os.path.normpath(os.path.join(os.path.dirname(base_rel), spec))
    for c in (cand, cand + ".js", os.path.join(cand, "index.js")):
        if os.path.isfile(os.path.join(SRC, c)):
            return c
    raise SystemExit(f"CLOSURE REFUSES: {base_rel} imports {spec}, which resolves to nothing at {REV}")


def py_edges(rel, src):
    out = []
    for m in PYIMP.finditer(src):
        name = m.group(1) or m.group(2)
        cand = os.path.normpath(os.path.join(os.path.dirname(rel), name + ".py"))
        if not os.path.isfile(os.path.join(SRC, cand)):
            raise SystemExit(f"CLOSURE REFUSES: {rel} imports {name}, which resolves to nothing at {REV}")
        out.append(cand)
    return out


def data_edges(rel, src):
    out = []
    for m in JOIN.finditer(src):
        parts = re.findall(r"""['"]([^'"]+)['"]""", m.group(1))
        cand = os.path.normpath(os.path.join(os.path.dirname(rel), *parts))
        if os.path.isfile(os.path.join(SRC, cand)):
            out.append(cand)
    return out


missing = [s for s in SEEDS if not os.path.isfile(os.path.join(SRC, s))]
if missing:
    raise SystemExit(f"CLOSURE REFUSES: seed path(s) absent at {REV}: {missing}")

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

full = subprocess.run(["git", "-C", ENGINES_GIT, "rev-parse", REV],
                      capture_output=True, text=True, check=True).stdout.strip()
print(f"engines {full[:7]}  seeds {len(SEEDS)}  CLOSURE {len(closure)} path(s)")
print(f"import/read edges walked: {len(edges)}")
for a, b in edges:
    print(f"   {a} -> {b}")

rows, bad = [], []
for rel in closure:
    can = subprocess.run(["git", "-C", ENGINES_GIT, "rev-parse", f"{REV}:{rel}"],
                         capture_output=True, text=True)
    canonical = can.stdout.strip() if can.returncode == 0 else "NOT-TRACKED"
    vp = os.path.join(VENDOR, rel)
    if os.path.isfile(vp):
        vend = subprocess.run(["git", "hash-object", vp], capture_output=True, text=True, check=True).stdout.strip()
        md5v = subprocess.run(["md5sum", vp], capture_output=True, text=True, check=True).stdout.split()[0]
    else:
        vend, md5v = "ABSENT", "ABSENT"
    md5c = subprocess.run(["md5sum", os.path.join(SRC, rel)], capture_output=True, text=True, check=True).stdout.split()[0]
    same = canonical == vend and md5c == md5v
    rows.append({"path": rel, "canonicalBlob": canonical, "vendoredBlob": vend,
                 "canonicalMd5": md5c, "vendoredMd5": md5v, "identical": same})
    if not same:
        bad.append(rel)
    print(f"{'OK  ' if same else 'DIFF'} blob {canonical[:12]} {vend[:12]}  md5 {md5c[:12]} {md5v[:12]}  {rel}")

with open(OUT, "w") as fh:
    json.dump({"engines": full, "closure": rows, "edges": edges}, fh, indent=1)
print(f"\n{len(closure) - len(bad)} of {len(closure)} closure paths are SHA-IDENTICAL with engines {full[:7]}")
if bad:
    print("NOT identical: " + ", ".join(bad))
    sys.exit(1)
