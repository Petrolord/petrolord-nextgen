# FC8 `metering` wave notes

## The two gates the 2026-09-17 repair said were fixed, proved to run and to discriminate. 2026-09-18.

The gate repair commit (FC8 `fix(fc8): repair three FC8 gates that were passing
without ever testing the wave`) said `leakage.mjs` had never run on this wave
(wave.json declared leakScales as numbers where the gate filters by label) and
`numsweep.mjs` had resolved nothing (no truth file). Both were re-run and given a
negative control before the audit trusted either.

- **leakage.mjs.** Run on the committed banks: 21 files, 0 fatal, 0 same-tier.
  A scratch copy of the banks had `36628.073221` (the Expert working capacity)
  and `0.785998` (the Professional valve authority) planted in an Associate
  explanation: exit 1, two FATAL lines naming the file, the question and both
  fields. A rounded `36628.07` planted alone was NOT flagged, correctly: it sits
  outside the grader's own 5e-5 tolerance, so a learner copying it would be
  marked wrong. The gate tests at the grader's tolerance by design.
- **numsweep.mjs.** 838 derived values from 3 sources resolve every 7+ significant
  figure literal in the lessons (311) and the banks (per tier 86/47/169).
  Negative control: a scratch copy of the lessons with one literal changed in its
  last digit (5.614583333333333 to ...336): unresolved 0 became unresolved 1.
  A first control that changed 0.900000 to 0.900003 did not register, because
  that literal has six significant figures and the sweep's floor is seven; that
  is the documented scope, not a hole.

Note for any later worker: `banks/` in this directory is a SYMLINK to the
committed Associate bank directory. Copying other tiers' banks "into banks/"
writes them into the repository's `beginner/`. Gates that default to `banks/`
(`bankleak.py`, `litsweep.py`) must be given `--banks <tier dir>` per tier.

## promptleak

Recorded with the seed ladder, below.
