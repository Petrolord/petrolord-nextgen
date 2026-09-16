# FC4 Gas Processing. Wave working files.

The in-repo mirror of `/root/fc-wip-gasprocessing`, which is where these run.
The scripts carry absolute paths into that directory, as the FC2 wave's do.

## State

**FOUNDATION COMPLETE AND RE-VENDORED AT THE REPAIR. ALL 78 LESSONS ARE
WRITABLE.** No lesson, bank, capstone answer file, panel or migration exists
yet.

The recon found 49 findings. FC4-0 repaired them (engines `82ec6d4`) and this
wave is re-vendored against it. **Digest Section 14 was WITHHELD and printed
NOTHING while the Joule-Thomson chain was under repair, rather than printing
behind a banner a writer would learn to ignore. It is built now, and no
lesson ever took a wrong coefficient.** That is what the withholding bought.

The vendoring closure was TEN paths, not four: the repaired engine imports
the DAK validity band from `separatorSizing.js`, which carries FC1's engine,
golden, oracle and suite with it, plus two findings records. Proven
sha-identical three independent ways and walked as an import closure inside
the vendored tree.

Fourteen of the eighteen graded capstone fields moved. `gate_movement.mjs`
measures every one against the pre-vendoring engine and requires a NAMED
cause for each. Four held.

## Repair history

**FRAMED HISTORY IS CURRICULUM. UNFRAMED HISTORY IS A DEFECT.** Digest
**Section 20** is the one section whose subject is what this engine used to
do. It says so in its title and its first line, it is placed last so nothing
above it can be read as history by accident, and `Expert m05 l01`, "What was
repaired, and what was not", owns it with the frame in its heading.

Everything else in the digest describes the engine as it is. The kit gate
reports Section 20's four sentences as warnings for a human read, and they
are re-read on every rebuild rather than cleared, because clearing them would
make the one place carrying history the one place nobody checks.

**Engine source comments are provenance.** Section 20 counts them by reading
the source and states the rule it counted with. A sentence lifted out of a
comment arrives with no frame around it, and a writer cannot frame what they
did not know was history.

## Files

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
| `gate_copy_rule.py` | the digest, every lesson body and every manifest title: 4 files, 795 lines and titles | 0 violations. **Caught two contrastives in the digest** that an eye sweep had passed |
| `digestprose.mjs` (the kit gate) with `digest_prose.rules.mjs` | 721 digest lines, 20 section titles and 25 in-body markers against their own blocks, 30 history framings, **33 pinned engine fragments** | 0 failing, 4 warned. **Caught a stale section title on the rebuild**, naming a contract exception the repaired engine no longer has, and **caught a repair-history sentence in this wave's own new prose** |
| `gate_movement.mjs` | all 18 graded fields against the pre-vendoring engine | 0 findings. **Caught a stability claim that was reasoned rather than measured** |
| `harvest_truth.py` | the digest, into `truth-gasprocessing.json` | 1365 numbers, 597 distinct. numsweep now builds a resolver of **769 derived values from 2 sources** and resolved 63 of 63 on a probe run |
| `jest` | the vendored gas processing and separator suites | **110 of 110** (47 + 63), up from 12 |
| vendoring guard | 551 paths byte for byte against canonical | clean |
| `structure.py` | 78 lessons, 18 modules, every title | 6 modules and 26 lessons a tier, no em dashes, no contrastives |

## Rebuilding the digest

    sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt

Through a temp file, never straight into the file the gates read. Then
re-run `harvest_truth.py`, because the resolver numsweep reads is built from
the digest, and then every gate, because a gate holding a stale copy of the
digest is a gate that is not examining your files.

    node /root/dc-wavekit/digestprose.mjs digest.txt --rules /root/fc-wip-gasprocessing
