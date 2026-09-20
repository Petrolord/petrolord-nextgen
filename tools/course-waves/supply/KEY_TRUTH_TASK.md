# supply KEY TRUTH TASK. The capstones and their answer files.

## What a capstone is here

Three capstones, one a tier, **six engine-derived graded fields each**,
eighteen in the course. A graded field is a RETURN VALUE OF THE ENGINE, stored
at the engine's full precision. It is never arithmetic performed in the
generator and never a figure typed by hand. The generator does one thing
itself: it carries an engine return into the next engine call the way the live
apps do (the two tanks' standard volumes into the day's closing dip, the lane's
trips a truck a day into fleetSizing, the landed cost per litre into
buildPumpPrice).

**THE GRADER IS NUMERIC ONLY.** `public.academy_submit_capstone` compares a
numeric answer with a numeric expected value within a numeric tolerance, so no
verdict, direction word or refusal is graded here.

**TOLERANCE: ONE UNIT IN THE LAST PLACE THE PROMPT ASKS FOR** (0.5 for the one
whole number). The prompt names the decimals for every field. The engine
itself rounds CIF and the landed total to the cent and the landed and pump
prices to four decimals, so a correct reading can sit half a unit from the
stored value on the engine's side and half a unit on the learner's; one unit
admits both. Every tolerance clears `gradeprecision.py` (half a unit in the
declared place, `precision.json`). The one derivation is `CLASSES` in
`supply_capstone.mjs`.

| class | decimals asked | tolerance | fields |
|---|---|---|---|
| m3 | 2 | 0.01 | the six OKOMU volumes, OGWASHI pumpable stock |
| probability | 4 | 0.0001 | OGWASHI probability of waiting |
| minutes | 2 | 0.01 | OGWASHI mean wait |
| days | 2 | 0.01 | OGWASHI days of cover |
| naira a litre | 4 | 0.0001 | OGWASHI lane cost, ORON landed, pump and government share |
| US dollars | 2 | 0.01 | ORON CIF and landed total |
| exchange rate | 2 | 0.01 | ORON breakeven |
| count | 0 | 0.5 | OGWASHI trucks |

## The generator and its inputs

- `supply_fields_capstone.mjs`: the three records, and `FIELD_SOURCES`, the
  engine return behind each graded key.
- `supply_capstone.mjs`: runs them, asserts every value is a finite number the
  engine returned, and writes `fields.json`, `precision.json` and
  `capstone.json` (the draft prompts). `--json` prints the fields and the
  engine-derived intermediates the leak gates read.
- Nothing in `supply_dump.mjs` or `supply_fields.mjs` imports or names any of
  it, and `gate_capstone_leak.py` checks both directions.

## The three records

| tier | record | what it is |
|---|---|---|
| Associate | OKOMU | a vertical AGO tank and a horizontal PMS bullet dipped one morning, and the day closed on them |
| Professional | OGWASHI | a seven-bay rack, a three-tank farm with one tank below its heel, a truck lane and its fleet |
| Expert | ORON | an AGO cargo with insurance quoted on CIF, landed, priced to the nozzle and swept against a cap |

## The gates, and what each one proves

| gate | what it proves | negative control |
|---|---|---|
| `oracle_check.py` | the vendored Python oracles, called on the capstone records, reproduce all eighteen fields within each field's tolerance; it names the three computations it transcribes from the oracles' main() because no function exports them | `--plant` moves one oracle answer by two tolerances and the gate names that field |
| `discriminate.mjs` | every field has at least three plausible wrong routes, each the engine asked the wrong question, and none lands inside the tolerance; it prints the closest miss in tolerances | `--plant` adds an identity route and the sweep reports one WEAK field |
| `gate_collisions.py` | no graded value is within its tolerance of any number token the digest prints (the go-live rule), and no two graded values share one | `--plant` sets one field to a digest number |
| `gate_promptleak.py` | no prompt prints a graded value of any tier, or an engine-derived intermediate, in any rounding | `--plant` appends both |
| `gate_capstone_leak.py` | names stay on their own road, no capstone figure is in the digest, no capstone record shares its inputs with a teaching record or a golden case | `--plant` copies a record and a figure across |

## The wrong routes discriminate models

The defects MD3-0 repaired and the ordinary ones: an opening stock taken from
today's dip, a missing opening read as zero, water subtracted as a height, the
VCF divided, tolerance on stock, Erlang B for Erlang C, utilisation read as the
probability, heel netted across the farm, cover on receipts plus liftings, the
loss added to the payload, depreciation left out, trips rounded down,
insurance on FOB or on C&F, duty on FOB, the ocean loss added instead of
divided, VAT on the landed cost only, the whole price scaled with the rate.

## Write the go-live assertions from the engine's OUTPUT

Run the generator, read the number, assert the number. The go-live migration of
every course refuses a graded field within its tolerance of any number the
digest prints; this wave already clears that rule, and `gate_collisions.py` is
the same sweep run early. Re-run every gate above after ANY change to a
capstone condition, a teaching case or the digest: a digest edit can create a
collision without touching the capstone.

## The prompts are drafts

`capstone.json` carries one draft prompt per tier, generated from the
conditions so it cannot drift from them. The course migration will store them
as `academy_capstones.prompt`; once seeded, run the kit's `promptleak.py --db`
on the stored rows as well.

## Hand back

The eighteen fields with values and tolerances; the output of all five gates
with their counts and their negative controls; the discriminate closest miss;
and every prompt change with the gate re-run after it.
