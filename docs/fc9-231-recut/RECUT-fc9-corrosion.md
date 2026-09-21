# RECUT: FC9 Corrosion & Integrity (corrosion), engines #231

Engines: petrolord-engines 16fd6c9 (#231, own-property preset lookups).

## Why

`engines/facilities/corrosion.js` was held at 5cbdca5 (ledger group `2-copy-pass-held`) because the LIVE FC9 course quoted facts about the engine's SOURCE FILE: "a module of 783 lines", "five past-tense comment lines", "roughly one line in 157". #231 moves no corrosion value, but its repair adds a two-line comment, so at 16fd6c9 the file is 785 lines with six such comment lines and those questions became false.

A question keyed on a source file's line count tests nothing about corrosion. The recut therefore removes the count wherever it was incidental, and replaces the one Expert exam question that keyed on it with a question on the engineering the module actually teaches: what the sour flag does and does not tell an engineer about material selection.

## What moved

| tier | questions changed | field edits | keyed answer text changed | answer index changed |
| --- | --- | --- | --- | --- |
| beginner | 1 | 1 | 1 | 0 |
| intermediate | 0 | 0 | 0 | 0 |
| advanced | 5 | 7 | 2 | 0 |
| **total** | **6** | **8** | **3** | **0** |

- beginner `m01-what-this-screen-answers-and-what-it-withdrew` ord 3: options (the keyed option drops "in the 783 lines of").
- advanced `m01-what-this-module-holds-back` ord 2: explanation.
- advanced `m06-what-this-engine-used-to-do` ord 2: explanation; ord 5: options (keyed option).
- advanced final ord 8: one distractor ("a module of 783 lines" becomes "a module that imports nothing").
- advanced final ord 38: prompt, options and explanation rewritten. It asked how many past-tense comment lines the module carries; it now asks what a stream screening above the 0.003500000000 bar H2S threshold tells the engineer about the steel (keyed: sour by the screening comparison and nothing more; material qualification comes from a sour-service assessment outside the module). The answer index stays 0.

One lesson changed (front-end upload, not a database row): advanced `m06/l01-an-invented-curve-wearing-authority.md` drops "783 lines of" from the second of the three proofs of absence.

No ord, module key, scope or row count moves, so every question id survives and learner attempts stay attached. The full OLD and NEW text of every change is in `RECUT-fc9-corrosion.json`; the migrations were generated from the same parse.

## Where OLD comes from

OLD is the text the APPLIED seeds (`migrations/20260925_fc9_corrosion_{beginner,advanced}_deep.sql`, applied 2026-09-19) wrote. `tools/course-waves/corrosion/gen_seeds.sh origin/main` regenerates all five FC9 migrations byte for byte from the committed banks, so OLD is exactly what those files hold. This branch had no production access and did NOT compare OLD with a dump of the live rows; each migration refuses any row that matches neither OLD nor NEW, and the owner's rolled-back production dry run (PR body) is that comparison.

## Proof on a local scratch database

`tools/course-waves/corrosion/scratch_db.sh origin/main`, then the five FC9 migrations at origin/main, then the two recut files:

- first run: beginner 1 of 1 updated, advanced 5 of 5 updated;
- second run: 0 updated, all 6 already recut (idempotent);
- 396 rows before and after, and the md5 of the ordered question ids is unchanged (no row deleted or re-inserted);
- the md5 over every (tier, scope, module_key, ord, prompt, options, answer_index, explanation) after the recut equals the same md5 over the three deep seeds `gen_seeds.sh HEAD` writes from the recut banks (90ea3e38d76a78ada896e9602d6d4d9f): the recut lands exactly the committed banks.

## Graded values

None moved. `make_fields.mjs` against the engine vendored on this branch writes `fields.json` and `precision.json` byte-identical to the committed copies (18 fields). The capstone leak gate, the literal sweep, the typed-literal gate, the copy rule, the claims gate and the collision gate are all clean against the rebuilt digest. The recut touches no capstone row.

## The digest

Rebuilt at 16fd6c9: four lines moved (the engine line count 783 to 785 and provenance 5cbdca5 to 16fd6c9, the absence proof's line count, and the history section's comment count 5 to 6 and ratio 157 to 131). Everything else is byte-identical. `wave.json` and `waves.json` re-pinned.

## Apply order (owner)

1. `migrations/20260926_fc9_recut_corrosion_beginner.sql`
2. `migrations/20260926_fc9_recut_corrosion_advanced.sql`

Either order works (they touch disjoint tiers); both are safe to re-run. The lesson edit ships with the next NextGen upload. Log both in MIGRATIONS.md when applied.
