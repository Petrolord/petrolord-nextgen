# crude KEY TRUTH TASK. The capstones and their answer files.

## What a capstone is here

Three capstones, one a tier, **six engine-derived graded fields each**, eighteen
in the course. A graded field is a RETURN VALUE OF THE ENGINE, computed by
`crude_capstone.mjs` from the capstone records. It is never arithmetic performed
in the generator (the one exception, a mass fraction times 100 so the learner
types a percent, is stated where it happens) and never a figure typed by hand.

**EVERY GRADED FIELD IS A FOUR-DECIMAL FIGURE, GRADED AT 5e-5.** The academy
grader, `public.academy_submit_capstone`, compares numbers and nothing else, so
no basis word, band, verdict or status is graded here. The digest prints every
computed figure to four decimals and every graded field is graded at half a unit
in that fourth place, which accepts a correctly rounded four-decimal reading of
the engine's value and nothing coarser. That is the tightest band
`gradeprecision.py` allows for a four-decimal class. It is wide against the
engines' own error (the LP's objective agrees with the oracle's exact rational
optimum to about 1e-9 relative; every graded relief sits between the oracle's
two exact one-sided quotients) and narrow against every wrong route: the closest
miss is 14 tolerances (SECTION "discriminate" below). The one derivation is
`DECIMALS` and `TOLERANCE` in `crude_capstone.mjs`.

**NOTHING HELD IS GRADED.** Refutas viscosity (C12, the index basis) and Watson K
(C13, the boiling-point basis) are taught as limits and are not graded, and the
LP is graded only on a barrel-scale problem, the regime L4's absolute
tolerances are right for.

## The generator and its inputs

- `crude_fields_capstone.mjs`: the three records, and `FIELD_SOURCES`, the
  engine return behind each graded key.
- `crude_capstone.mjs`: runs them, asserts every value is finite, asserts every
  graded relief is on a binding specification, and writes `fields.json`,
  `precision.json` and `capstone.json` (the draft prompts).
- Nothing in `crude_dump.mjs` or `crude_fields.mjs` imports or names any of it,
  and `gate_capstone_leak.py` checks both directions.

## The three records

| tier | record | what it is |
|---|---|---|
| Associate | IDAMA | a Bayelsa export terminal commingling three crudes by barrels; graded: API, sulfur wt%, vanadium ppm, one crude's mass share, the CII, one crude's kerosene yield |
| Professional | OGBELE | a Rivers State topping refinery valuing a two-crude blend on its own cut set; graded: the blend's T50, two blend cut yields, gross value, loss value and netback per bbl |
| Expert | ONNE | a 10,000 bbl PMS cargo from five components, the alkylate tank typed as 0 bbl; graded: least total cost, two recipe volumes, and the value of relief on the sulfur, RVP and RON limits |

## The gates, and what each one proves

| gate | what it proves | negative control |
|---|---|---|
| `oracle_check.py` | the vendored Python ORACLES (oracle_crudeassay, oracle_productblending on exact rational vertex enumeration), called on the capstone records, reproduce all eighteen fields within tolerance; every relief lies between the oracle's two exact one-sided quotients and the two sides agree, so no graded row is dual degenerate; the optimum is unique; eleven teaching figures in the digest agree with the same oracles | `--plant` moves one oracle answer and the gate names that field |
| `discriminate.mjs` | every field has at least three numeric wrong routes (the MD1-0 defects by name, plus the ordinary ones) and none lands inside the tolerance; a route with no recipe is printed and never counted | `--plant` adds an identity route and the sweep reports one more WEAK field |
| `gate_collisions.py` | no graded value is within its tolerance of any number token the digest prints (the go-live rule), and no two graded values are within tolerance of each other; the nearest digest token to each field is printed | `--plant` sets one field to a digest number |
| `gate_promptleak.py` | no prompt prints a rounding of a graded value of any tier, or of any intermediate the engine derives on the way to one (64 read from the engine) | `--plant` appends both |
| `gate_capstone_leak.py` | names stay on their own road; no capstone crude, component or cut set shares its defining figures with a teaching record or a golden case; no golden number sits within tolerance of a graded value; no graded value prints on the teaching road | `--plant` copies a record and a name across |

## Write the go-live assertions from the engine's OUTPUT

Run the generator, read the number, assert the number. The go-live migration of
every course refuses a graded field within its tolerance of any number the digest
prints; this wave already clears that rule, and `gate_collisions.py` is the same
sweep run early. Re-run every gate above after ANY change to a capstone
condition, a teaching case or the digest: a digest edit can create a collision
without touching the capstone.

## The prompts are drafts

`capstone.json` carries one draft prompt per tier, generated from the conditions
so it cannot drift from them. Each asks for six numbers to four decimals. The
Expert prompt asks for the value of relief "at the margin", because a whole unit
of relief re-solved is a different number (SECTION 23 of the digest prints both
on the teaching pool, and discriminate models it as a wrong route). The course
migration will store them as `academy_capstones.prompt`; once seeded, run the
kit's `promptleak.py --db` on the stored rows as well.

## Hand back

The eighteen fields with values and tolerances; the output of all five gates with
their counts and their negative controls; the discriminate closest miss; and
every prompt change with the gate re-run after it.
