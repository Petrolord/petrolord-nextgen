# refinery KEY TRUTH TASK. The capstones and their answer files.

## What a capstone is here

Three capstones, one a tier, **six engine-derived graded fields each**, eighteen
in the course. A graded field is a RETURN VALUE OF THE ENGINE, reached through the
same clock gate as the digest (`clockguard.mjs`), with the wave's fixed period
start (2027-03-01) and start year (2027). The only arithmetic in the generator is
the unit change a field's name states (a fraction x 100 for a percent) and the
sum of the engine's own per-year tax for the lifetime tax.

**NO NPV AND NO IRR IS GRADED.** The Economics courses grade them. The two tax
fields are the screening engine's per-year tax as feasibilityEconomics runs it
for a refinery (loss carried forward, royalty 0).

## Tolerances, and why each one

The academy grader, `public.academy_submit_capstone`, applies `abs(got - expected)
<= tol` with `tol` ABSOLUTE in the field's own units. One derivation, `CLASSES` in
`refinery_fields_capstone.mjs`:

| class | fields | digest prints | tolerance | why |
|---|---|---|---|---|
| USD | capital costs, first-year revenue, plan margin, the four variance fields | 2 decimals | 0.5 | graded to the whole dollar, which the prompt asks for; wider than half a unit of what the digest prints, as gradeprecision requires |
| bbl | annual throughput, crude run | 2 decimals | 0.5 | graded to the whole barrel |
| $/bbl | slate value, gross margins, stream values | 4 decimals | 0.005 | graded to the cent |
| percent | crude unit utilisation | 2 decimals | 0.005 | half a unit of the two decimals printed |
| MM | first tax, lifetime tax | 4 decimals | 0.00005 | half a unit of the four decimals the digest prints the screening engine's millions to |

The stored expected value is the engine's figure rounded six places past the
graded place, so float noise never decides a grade and every correct rounding to
the asked precision passes.

## The generator and its inputs

- `refinery_fields_capstone.mjs`: the three records, `FIELD_SOURCES` (the engine
  return behind each graded key) and `CLASSES`.
- `refinery_capstone.mjs`: runs them, refuses a non-finite value, an NPV or IRR
  key, or a tax case where the loss does not reach an operating year, and writes
  `fields.json`, `precision.json` and `capstone.json` (the draft prompts).
- Nothing in `refinery_dump.mjs` or `refinery_fields.mjs` imports or names any of
  it, and `gate_capstone_leak.py` checks both directions.

## The three records

| tier | record | what it is |
|---|---|---|
| Associate | IKARAMA | a conversion modular refinery of 8000 bpd scaled from a 12000 bpd quotation, under tight supply |
| Professional | AMASSOMA | one month's plan: three crudes (one cargo cancelled and typed as 0), crude unit, reformer, diesel hydrotreater, six products |
| Expert | KOLOAMA | one month's plan and actuals (one unplanned sale), and a hydroskimming expansion's tax with its construction losses carried forward |

## The gates, and what each one proves

| gate | what it proves | negative control |
|---|---|---|
| `oracle_check.py` | the vendored Python ORACLES, called on the capstone records, reproduce all eighteen fields at their tolerances; ten teaching figures in the digest agree with the oracles | `--plant` moves one oracle answer and the gate names that field |
| `discriminate.mjs` | every field has at least three plausible wrong routes (the MD2-0 defects asked of the engine, and ordinary slips), and none lands within tolerance | `--plant` adds an identity route and the sweep reports one WEAK field |
| `gate_collisions.py` | no graded value within its tolerance of any number token the digest prints (the go-live rule), and no two graded values within the looser tolerance | `--plant` sets one field to a digest number |
| `gate_promptleak.py` | no prompt prints a graded value of any tier (also read x1e6 and /1e6), or a figure the engine derives on the way to one | `--plant` appends both |
| `gate_capstone_leak.py` | names and crude labels stay on their own road, no derived capstone figure is in the digest, no capstone record shares its defining numbers with a teaching record or a golden case | `--plant` copies a record and a figure across |

## Write the go-live assertions from the engine's OUTPUT

Run the generator, read the number, assert the number. The go-live migration
refuses a graded field within its tolerance of any number the digest prints;
this wave already clears that rule. Re-run every gate above after ANY change to a
capstone condition, a teaching case or the digest.

## The prompts are drafts

`capstone.json` carries one draft prompt per tier, generated from the conditions
so it cannot drift from them. Each asks for its six numbers at the precision its
class is graded to. Once seeded, run the kit's `promptleak.py --db` on the stored
rows as well.

## Hand back

The eighteen fields with values and tolerances; the output of all five gates with
their counts and their negative controls; the discriminate closest miss; and
every prompt change with the gate re-run after it.
