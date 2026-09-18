#!/usr/bin/env python3
"""Ledger the vendored engines/assurance family in packages/engines/VENDOR.json.

The canonical pin (709172f) predates the assurance domain entirely, so every
one of the 51 walked closure paths is "extra" against it: present in the
vendored tree, absent from canonical. Each entry pins the blob now vendored,
so a second drift fails the guard. The text is deliberately course-neutral
and the entries are appended in closure order, because BOTH assurance waves
(riskchange and compliance) vendor this identical set and must produce a
byte-identical VENDOR.json so their two pull requests cannot conflict.

Idempotent: refuses to add a path that is already ledgered.
"""
import json, subprocess, sys

VJ = "/root/wt-as-riskchange-nextgen/packages/engines/VENDOR.json"
CLOSURE = "/root/as-wip-riskchange/vendor/closure.json"
GROUP = "9-assurance-ahead-of-pin"
REASON = ("The engines/assurance family (ten rule modules, their goldens, the ten stdlib "
          "oracles with their FINDINGS records, the ten jest suites and the golden runner "
          "helper) is vendored for the two NextGen Assurance courses, Risk, Change & "
          "Learning and Compliance, Audit & Quality, from engines main 6b00f43 (the squash "
          "merge of PR #211, AS15), which is the pin the Suite vendors. The canonical pin "
          "709172f predates the whole domain, so every path reads as extra. The vendored "
          "blob is sha-identical with engines 6b00f43, proved path by path over the WALKED "
          "IMPORT CLOSURE (51 paths, including the oracles' Python imports of one another) "
          "and byte-compared against the Suite's own vendoring at the same pin. It clears "
          "when canonical is next advanced.")

d = json.load(open(VJ))
closure = json.load(open(CLOSURE))
if not closure["closure"] or not all(r["identical"] for r in closure["closure"]):
    sys.exit("LEDGER REFUSES: closure.json is empty or not sha-identical; run closure.py first")
have = {e["path"] for e in d["knownDeviations"]}
added = 0
for r in closure["closure"]:
    if r["path"] in have:
        sys.exit(f"LEDGER REFUSES: {r['path']} is already ledgered")
    d["knownDeviations"].append({
        "path": r["path"], "kind": "extra", "group": GROUP,
        "vendoredSha": r["vendoredBlob"], "reason": REASON,
    })
    added += 1
with open(VJ, "w") as fh:
    fh.write(json.dumps(d, indent=2) + "\n")
print(f"ledgered {added} extra path(s) in group {GROUP}")
