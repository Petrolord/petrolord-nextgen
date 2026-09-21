# B3 recut: engines #232 (petrolord-engines e972ae7) in the LIVE courses

Engines PR #232 recasts engine sentences that broke the owner copy rule ("X, not Y", "rather than", "instead of") and gives the M/M/c queue its facility vocabularies: a CNG forecourt now says "dispensers", a bottling carousel "filling positions", a petrol forecourt "nozzles"; the loading rack keeps "bays". It also adds `BAND_CONVENTION` to engines/hse/lopa.js and a field-named occupancy refusal to engines/hse/qra.js. No graded value moves.

NextGen re-vendors e972ae7 (canonical pin 16fd6c9 -> e972ae7). Five LIVE courses quoted the old sentences in lessons and question banks; this directory records the text-only recut of the banks.

## What moves in the database

29 question rows across five courses, text only. No answer index, option order, ord, module key, scope or row count moves, so every question id and every learner attempt survives. One row's keyed option changed its length rank (reported, not retuned): gasvalue advanced m04-the-cascade ord 15, where the keyed refusal and two distractors now say "dispensers" in place of "bays" (a distractor still saying "bays" beside a keyed "dispensers" would be a give-away). The bank gates pass on every re-emitted bank.

| course | tier | scope | module | ord | fields | keyed text changed | keyed length rank |
| --- | --- | --- | --- | --- | --- | --- | --- |
| crude | beginner | final | (final exam) | 31 | options, explanation | yes | same |
| refinery | intermediate | module | m05-the-schedule | 15 | explanation | no | same |
| supply | intermediate | module | m04-throughput-economics | 7 | options | no | same |
| supply | intermediate | module | m05-the-lane-the-fleet-and-the-station | 5 | explanation | no | same |
| supply | intermediate | final | (final exam) | 37 | explanation | no | same |
| supply | advanced | module | m02-the-landed-cost-walk | 10 | explanation | no | same |
| supply | advanced | module | m02-the-landed-cost-walk | 12 | explanation | no | same |
| supply | advanced | module | m04-from-depot-gate-to-nozzle | 4 | explanation | no | same |
| supply | advanced | module | m05-what-breaks-the-price | 3 | options | no | same |
| supply | advanced | module | m05-what-breaks-the-price | 4 | options | yes | same |
| supply | advanced | final | (final exam) | 5 | explanation | no | same |
| gasvalue | beginner | module | m04-the-flare-by-the-rule | 4 | options, explanation | yes | same |
| gasvalue | intermediate | module | m05-credits-and-the-bid | 10 | options | no | same |
| gasvalue | intermediate | module | m05-credits-and-the-bid | 11 | options, explanation | yes | same |
| gasvalue | intermediate | module | m05-credits-and-the-bid | 12 | options | no | same |
| gasvalue | intermediate | final | (final exam) | 32 | options | no | same |
| gasvalue | advanced | module | m04-the-cascade | 14 | options, explanation | no | same |
| gasvalue | advanced | module | m04-the-cascade | 15 | options, explanation | yes | MOVED 3 to 2 |
| gasvalue | advanced | final | (final exam) | 35 | explanation | no | same |
| carbon | beginner | module | m05-lines-factors-and-provenance | 13 | explanation | no | same |
| carbon | beginner | final | (final exam) | 28 | explanation | no | same |
| carbon | intermediate | module | m04-what-tuning-is-worth | 1 | explanation | no | same |
| carbon | advanced | module | m02-the-marginal-abatement-cost-curve | 8 | explanation | no | same |
| carbon | advanced | module | m03-interactions-and-over-claims | 9 | explanation | no | same |
| carbon | advanced | module | m04-targets-and-the-path | 4 | explanation | no | same |
| carbon | advanced | module | m04-targets-and-the-path | 9 | explanation | no | same |
| carbon | advanced | module | m05-savings-into-the-ledger | 1 | options, explanation | yes | same |
| carbon | advanced | module | m05-savings-into-the-ledger | 13 | explanation | no | same |
| carbon | advanced | final | (final exam) | 21 | explanation | no | same |

The full OLD and NEW text of every row is in `RECUT-<slug>.json`. This row list is the composition contract with the follow-up "digest" wording recut: where a row above also carries "the digest" or "SECTION NN" in a field this recut rewrote, the recut text already drops it; any later text-only recut of these rows must take the NEW text here as its OLD.

## How it was generated and proved

- `gen_recut.py` rebuilds each tier's 132 rows from the banks at origin/main and REQUIRES them to be, byte for byte, the VALUES block of the applied deep seed (`migrations/<date>_<prefix>_<slug>_<tier>_deep.sql`, applied 2026-09-19, not edited). NEW is the banks on this branch. It refuses any moved answer index or option count and writes the migrations and the JSON. `gen_recut.py --check` fails on drift.
- `scratch_proof.sh` (local Postgres per course, no production access): seeds the applied ladder, runs the recut, and proves (1) the rows that moved are exactly the rows listed, ids unchanged, 396 rows before and after; (2) a second run updates nothing; (3) every row after the recut equals the banks on this branch; (4) NEGATIVE CONTROL: a row given a third text makes the recut raise and leaves the tier untouched. All five courses pass.
- `tools/course-waves/<slug>/apply_b3_recut_<slug>.sh` (from `apply_template.sh` by `mk_apply.py`): content-addressed; `verify`, `control` (a flipped byte must be refused; passes), `dry-run` (one transaction, rolled back, against the linked project), `apply`, `pin <ref>`.

## Graded values

None moved. On the re-vendored engines every course's capstone generator writes `fields.json`, `precision.json` and `capstone.json` byte-identical to the committed copies (crude, refinery, supply, gasvalue, carbon: 18 fields each); qra and lopa `make_fields.mjs` likewise. No capstone row is touched.

## Owner apply order

Production is owner-run. For each course, after this PR merges:

```
tools/course-waves/<slug>/apply_b3_recut_<slug>.sh verify     # against origin/main
tools/course-waves/<slug>/apply_b3_recut_<slug>.sh dry-run    # rolled back; every NOTICE says N of N rows updated
tools/course-waves/<slug>/apply_b3_recut_<slug>.sh apply
```

Courses in any order (crude, refinery, supply, gasvalue, carbon); files within a course touch disjoint tiers and are safe to re-run. Log each applied file in MIGRATIONS.md:

- crude: `20261015_b3_recut_crude_beginner.sql`
- refinery: `20261015_b3_recut_refinery_intermediate.sql`
- supply: `20261015_b3_recut_supply_intermediate.sql`, `20261015_b3_recut_supply_advanced.sql`
- gasvalue: `20261015_b3_recut_gasvalue_{beginner,intermediate,advanced}.sql`
- carbon: `20261015_b3_recut_carbon_{beginner,intermediate,advanced}.sql`

The lesson edits ship with the next NextGen upload. Apply the recut together with that upload, since lessons and banks quote the same sentences.

## Held courses (qra, lopa)

Their digests were rebuilt (engine line counts, the lopa golden count 76 -> 77, the `BAND_CONVENTION` export and band sentence). The quoted first sentence of the band convention and the occupancy-fraction refusal the lessons quote are unchanged, so no lesson or bank moves. The two HELD go-lives were regenerated in place (their digest-number sweep moved) and re-pinned in `apply_h5_qra.sh` and `apply_h3_lopa.sh`; both ladders dry-run clean on a local scratch database.
