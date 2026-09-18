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

## promptleak HAS RUN, AND IT IS GREEN. 2026-09-18, on the capstone migration.

    python3 /root/dc-wavekit/promptleak.py --sql migrations/20260925_fc8_metering_course.sql
    swept 3 prompt(s) across 1 course(s): 47 numbers against 18 graded fields, 3 unit shiftings
    own-field leaks: 0   cross-tier leaks: 0   self leaks: 0   near misses: 0

Its selftest passes, and a scratch copy of the migration with the Associate's
own gross volume (4604.5016 bbl) planted in its prompt reports SELF LEAK 1.
The `--db --course metering` run is owed after the owner seeds.

## The seed ladder, proved. 2026-09-18.

- gen_course.py refuses a prompt that omits any constant fc8_capstone.mjs
  passes to the engine (47 constants). Control: dropping the corrosion
  allowance from the Expert prompt REFUSED by name.
- gen_seeds.sh from the committed tree: all five migrations regenerate byte for
  byte (AGREE).
- verify_sql.py: 4752 fields, banks against SQL, both from the object store,
  AGREE; the one-character canary DISAGREES and exits 2.
- THE DRY RUN RAN AGAINST A SCRATCH POSTGRES AND NEVER AGAINST PRODUCTION.
  FC6's dryrun ran its rolled-back ladder on the linked project, which is
  NextGen production (txcsbtvcdaqmkjjbhbeg). scratch_db.sh builds the four
  academy tables from the repository's own DDL in a local postgres:16 container
  and loads every committed Facilities course row, so path_order and slug
  collisions are exercised against real neighbours. Clean at HEAD, go-live
  NOTICE reached, before/after snapshot and md5 digests identical.
- Negative controls, one part in 1e7 on the graded value, each REFUSED by name:
  saghara_bottom_course_required_in (the smallest field, a move of about
  3.4e-8, a fourteenth of its own tolerance), saghara_vacuum_governing_draw_bblhr,
  utonana_cavitation_sigma, krakama_flow_turndown_ratio.
- apply_fc8_metering.sh pinned to the five committed digests; `verify` ok.

What the scratch run cannot prove: that production's rows match the
repository's. The go-live re-runs every assertion against production inside the
flip's own transaction, so a production-only collision refuses there.
