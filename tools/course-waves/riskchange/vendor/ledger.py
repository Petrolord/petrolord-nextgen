#!/usr/bin/env python3
"""Ledger the vendored engines/assurance family in packages/engines/VENDOR.json.

The canonical pin (709172f) predates the assurance domain entirely, so every
one of the 51 walked closure paths is "extra" against it: present in the
vendored tree, absent from canonical. Each entry pins the blob now vendored,
so a second drift fails the guard. The text is deliberately course-neutral
and the entries are appended in closure order, because BOTH assurance waves
(riskchange and compliance) vendor this identical set and must produce a
byte-identical VENDOR.json so their two pull requests cannot conflict.

Idempotent: an upsert over the closure.
"""
import json, subprocess, sys

VJ = "/root/wt-as-riskchange-nextgen/packages/engines/VENDOR.json"
CLOSURE = "/root/as-wip-riskchange/vendor/closure.json"
GROUP = "9-assurance-ahead-of-pin"
REASON = ("The engines/assurance family (ten rule modules, their goldens, the ten stdlib "
          "oracles with their FINDINGS records, the ten jest suites and the golden runner "
          "helper) is vendored for the two NextGen Assurance courses, Risk, Change & "
          "Learning and Compliance, Audit & Quality, from engines main 9d5d3b4 (the squash "
          "merge of PR #212, ASC-0, the repairs the two courses found; first vendored at "
          "6b00f43, AS15). The canonical pin 709172f predates the whole domain, so every "
          "path reads as extra. The vendored blob is sha-identical with engines 9d5d3b4, "
          "proved path by path over the WALKED IMPORT CLOSURE (53 paths, including the "
          "oracles' Python imports of one another and every assurance suite the commit "
          "lists) by git blob hash and by md5. It clears when canonical is next advanced.")

d = json.load(open(VJ))
closure = json.load(open(CLOSURE))
if not closure["closure"] or not all(r["identical"] for r in closure["closure"]):
    sys.exit("LEDGER REFUSES: closure.json is empty or not sha-identical; run closure.py first")
# UPSERT, in closure order: an existing entry is re-pinned to the blob now
# vendored and given the current reason; a new path is appended. Any entry in
# the group whose path left the closure is removed, so the ledger cannot keep a
# row for a file that is no longer vendored.
paths = [r["path"] for r in closure["closure"]]
others = [e for e in d["knownDeviations"] if e.get("group") != GROUP]
clash = [e["path"] for e in others if e["path"] in paths]
if clash:
    sys.exit(f"LEDGER REFUSES: already ledgered in another group: {clash}")
old = {e["path"] for e in d["knownDeviations"] if e.get("group") == GROUP}
d["knownDeviations"] = others + [{
    "path": r["path"], "kind": "extra", "group": GROUP,
    "vendoredSha": r["vendoredBlob"], "reason": REASON,
} for r in closure["closure"]]
added = len(set(paths) - old)
repinned = len(set(paths) & old)
removed = len(old - set(paths))
with open(VJ, "w") as fh:
    fh.write(json.dumps(d, indent=2) + "\n")
print(f"group {GROUP}: {added} added, {repinned} re-pinned, {removed} removed, {len(paths)} in all")
