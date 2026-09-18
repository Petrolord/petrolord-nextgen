#!/usr/bin/env python3
"""Add the assurance family to packages/engines/VENDOR.json as ledgered EXTRA
paths, each pinned to the blob now vendored.

The canonical pin in VENDOR.json stays at 709172f, which predates the whole
engines/assurance domain (engines #207 onwards), so every one of the 51 closure
paths reads as extra against it. This is the shape FC6 used for
FINDINGS-heattransfer.md and FC2 for lib/units/fieldUnits.js: an extra path with
its blob pinned, so a second drift on it still fails the guard, and a reason
that says when it clears. Entries are inserted in path order with a fixed
reason, so running this twice, or in the sibling wave's worktree, yields the
same bytes.
"""
import json, subprocess, sys

WT = sys.argv[1] if len(sys.argv) > 1 else "/root/wt-as-compliance-nextgen"
VJ = f"{WT}/packages/engines/VENDOR.json"
CLOSURE = "/root/as-wip-compliance/vendor/closure.json"

REASON = ("The assurance family (ten engine modules, their goldens, oracles, FINDINGS "
          "records and jest suites, 51 paths as WALKED by the import closure) vendored "
          "for the two NextGen assurance courses, compliance (path_order 60) and "
          "riskchange (path_order 59), at engines 6b00f43, the squash merge of PR #211 "
          "(AS15), which is the commit the Suite pins. The whole domain postdates the "
          "canonical pin 709172f, so every path reads as extra. Sha-identical with "
          "engines 6b00f43 and with the Suite's own vendoring, by git blob hash and md5, "
          "path by path. Both assurance waves vendor the identical set. It clears when "
          "canonical is next advanced to 6b00f43 or later.")
GROUP = "9-assurance-ahead-of-pin"

closure = json.load(open(CLOSURE))["closure"]
assert len(closure) == 51 and all(r["identical"] for r in closure), "closure not proven"
v = json.load(open(VJ))
have = {e["path"] for e in v["knownDeviations"]}
added = 0
for r in closure:
    if r["path"] in have:
        continue
    blob = subprocess.run(["git", "hash-object", f"{WT}/packages/engines/{r['path']}"],
                          capture_output=True, text=True, check=True).stdout.strip()
    assert blob == r["canonicalBlob"], r["path"]
    v["knownDeviations"].append({"path": r["path"], "kind": "extra", "group": GROUP,
                                 "vendoredSha": blob, "reason": REASON})
    added += 1
with open(VJ, "w") as fh:
    fh.write(json.dumps(v, indent=2, ensure_ascii=False) + "\n")
print(f"added {added} extra entries; ledger now {len(v['knownDeviations'])}")
