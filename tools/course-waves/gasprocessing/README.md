# FC4 Gas Processing. Wave working files.

The in-repo mirror of `/root/fc-wip-gasprocessing`, which is where these run.
The scripts carry absolute paths into that directory, as the FC2 wave's do.

## State

**FOUNDATION COMPLETE. WRITING HELD.** No lesson, bank, capstone answer file,
panel or migration exists yet, and that is deliberate.

The recon found 49 findings in the engine, its validation layer and the Suite
app that composes it. One of them is a live wrong answer on four screens of
a shipped studio at its own default inputs, and the gate that should have
caught it was proven by negative control to be unable to. Repair comes before
a lesson exists, because afterwards it costs a full recut of 78 lessons, 396
questions and three audits.

- `RECON.md` is the map. Read it before anything else.
- `FINDINGS.md` is the classified defect list with its negative controls.
  **Neither is teaching truth.** Both describe the engine as found.
- `digest.txt` is the ONLY source of numbers for a lesson. **Section 14 is
  withheld and prints nothing**, so fourteen Expert lessons and four of six
  Expert capstone fields wait on FC4-0.
- `LESSON_TASK.md`, `BANK_TASK.md`, `KEY_TRUTH_TASK.md` and `PANELS.md` are
  the briefs for the four waves that follow.

## Gates, with the counts they reported

| gate | what it examined | result |
|---|---|---|
| `gate_claims.mjs` | 24 relational claims in `digest.txt`, each re-computed from the engine | all hold. **Caught two false claims in the first draft**, one of them an ordering stated as different that was in fact identical |
| `gate_typed_literals.py` | 293 string literals in `fc4_dump.mjs`, substitutions stripped at source level, 23 numeric literals swept in printed prose | 12 allowed with a reason, all 12 hit, 0 unexplained. Negative control caught a planted figure |
| `gate_capstone_leak.py` | 25 capstone conditions and 18 graded values at three renderings each | 0 leaks. **Caught one real leak**: an earlier capstone temperature pair reproduced a row of the digest's own duty table |
| `gate_copy_rule.py` | the digest, every lesson body and every manifest title: 4 files, 547 lines and titles | 0 violations. **Caught two contrastives in the digest** that an eye sweep had passed |
| `jest` | `__tests__/facilities.gasprocessing.test.js` | 12 of 12. **Read FINDINGS F-O1 and F-O2 before trusting that number** |
| vendoring guard | 551 paths byte for byte against canonical | clean |
| `structure.py` | 78 lessons, 18 modules, every title | 6 modules and 26 lessons a tier, no em dashes, no contrastives |

## Rebuilding the digest

    sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt

Through a temp file, never straight into the file the gates read. Then re-run
all three gates, because a gate holding a stale resolver copy of the digest
is a gate that is not examining your files.
