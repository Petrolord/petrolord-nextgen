# compliance KEY TRUTH TASK. The capstones and their answer files.

## What a capstone is here

Three capstones, one a tier, **six engine-derived graded fields each**, eighteen
in the course. A graded field is a RETURN VALUE OF THE ENGINE, reached through the
same clock gate as the digest (`clockguard.mjs`), at the wave's one as-of date. It
is never arithmetic performed in the generator and never a figure typed by hand.

**EVERY GRADED FIELD IS AN INTEGER, GRADED EXACTLY (tolerance 0).** The academy
grader, `public.academy_submit_capstone`, compares numbers and nothing else, so a
status, a verdict or a date cannot be graded here. A date the engine returns is
graded as the whole number of days `daysUntil` puts between it and the as-of
date, which is itself an engine return. A whole day, a whole percent the engine
has already rounded, or a count has no legitimate reading error, which is why the
tolerance is zero. `gradeprecision.py` states a half-unit floor for rounded
READINGS; it does not apply to a value the engine itself rounds and the learner
reproduces, and this is recorded rather than widened.

## The generator and its inputs

- `compliance_fields_capstone.mjs`: the three records, and `FIELD_SOURCES`, the
  engine return behind each graded key.
- `compliance_capstone.mjs`: runs them, asserts every value is an integer, asserts
  the UTAPATE request log against its expected verdicts, and writes
  `fields.json`, `precision.json` and `capstone.json` (the draft prompts).
- Nothing in `compliance_dump.mjs` or `compliance_fields.mjs` imports or names any
  of it, and `gate_capstone_leak.py` checks both directions.

## The three records

| tier | record | what it is |
|---|---|---|
| Associate | EKPE | a gas plant's four regulatory obligations and two controlled documents |
| Professional | UTAPATE | a manifold replacement's inspection and test plan with six requests put to it, its NCRs, a contractor audit checklist and the audit programme |
| Expert | OBEAKPU | an ISO 45001:2018 register of forty clauses, six audits and three findings ahead of surveillance |

## The gates, and what each one proves

| gate | what it proves | negative control |
|---|---|---|
| `oracle_check.py` | the vendored Python ORACLES, called on the capstone records, reproduce all eighteen fields; no graded percent sits on an exact half (R2); the teaching readiness counts agree with the ISO oracle | `--plant` moves one oracle answer and the gate names that field |
| `discriminate.mjs` | every field has at least three plausible wrong routes, each the engine asked the wrong question, and none lands on the answer | `--plant` adds an identity route and the sweep reports one WEAK field |
| `gate_collisions.py` | no graded value equals the absolute value of any number token the digest prints (the go-live rule), and no two graded values share an absolute value | `--plant` sets one field to a digest number |
| `gate_promptleak.py` | no prompt prints a graded value of any tier, or a date the engine derives on the way to a graded day count | `--plant` appends both |
| `gate_capstone_leak.py` | names and codes stay on their own road, no derived answer date is in the digest, no capstone record shares its dates with a teaching record or a golden case | `--plant` copies a record and a date across |

## What no graded field touches

R1 (programmeProgress against summarise on a reasonless cancellation), R2
(rounding at an exact half), R3 (the expiring flag on a lapsed certificate), R4
(the negative reason on a filed One-off) and R5 (the ISO 9001 citation). The
header of `compliance_fields_capstone.mjs` says how each is avoided, and
`oracle_check.py` enforces the one that could move a value (R2).

## Write the go-live assertions from the engine's OUTPUT

Run the generator, read the number, assert the number. The go-live migration of
every course refuses a graded field within its tolerance of any number the digest
prints; this wave already clears that rule, and `gate_collisions.py` is the same
sweep run early. Re-run every gate above after ANY change to a capstone
condition, a teaching case or the digest: a digest edit can create a collision
without touching the capstone.

## The prompts are drafts

`capstone.json` carries one draft prompt per tier, generated from the conditions
so it cannot drift from them. The course migration will store them as
`academy_capstones.prompt`; once seeded, run the kit's `promptleak.py --db` on
the stored rows as well.

## Hand back

The eighteen fields with values and tolerances; the output of all five gates with
their counts and their negative controls; the discriminate closest miss; and
every prompt change with the gate re-run after it.
