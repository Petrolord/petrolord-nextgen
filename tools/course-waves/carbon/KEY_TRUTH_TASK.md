# carbon KEY TRUTH TASK. The capstones and their answer files.

## What a capstone is here

Three capstones, one a tier, **six engine-derived graded fields each**,
eighteen in the course. A graded field is a RETURN VALUE OF THE ENGINE, stored
at the engine's full precision. It is never arithmetic performed in the
generator and never a figure typed by hand. The generator does one thing
itself: it carries an engine return into the next engine call the way the live
apps do (a combustion result into inventory lines through a factor of one, two
stack efficiencies into excessAirSaving, the gauge pressure plus the stated
atmosphere into steamTrapLoss, the inventory total into the path as its
baseline with a straight-line target, the costed measures into the curve).

**THE GRADER IS NUMERIC ONLY.** `public.academy_submit_capstone` compares a
numeric answer with a numeric expected value within a numeric tolerance, so no
verdict (reportable, meetsTarget, paysForItself, thresholdProblem) is graded.

**TOLERANCE: ONE UNIT IN THE LAST PLACE THE PROMPT ASKS FOR.** The prompt names
the decimals for every field. The one derivation is `CLASSES` in
`carbon_capstone.mjs`; `precision.json` is written from it.

| class | decimals asked | tolerance | fields |
|---|---|---|---|
| tonnes | 2 | 0.01 | the six OWAZA figures, the IGRITA trap loss a year, the IKORODU gap |
| percent | 4 | 0.0001 | IGRITA excess air and LHV efficiency |
| GJ | 0 | 1 | IGRITA fuel saved by tuning (a ratio of two efficiencies the engine rounds to six decimals; read from four-decimal efficiencies it lands up to about half a GJ away) |
| kW | 2 | 0.01 | IGRITA hot and cold utility |
| USD per tonne | 2 | 0.01 | IKORODU boiler tuning, waste heat, curve weighted average, economiser |
| USD | 2 | 0.01 | IKORODU flare gas recovery net annual cost |

## The GWP set is stated in the prompt

Every capstone inventory is computed on "IPCC AR6 GWP100, fossil methane"
(methane 29.8, nitrous oxide 273), and the prompt says so with the report and
the horizon. No field grades a choice of set (held item H1).

## The generator and its inputs

- `carbon_fields_capstone.mjs`: the three records, and `FIELD_SOURCES`, the
  engine return behind each graded key.
- `carbon_capstone.mjs`: runs them, asserts every value is a finite number the
  engine returned, and writes `fields.json`, `precision.json` and
  `capstone.json` (the draft prompts). `--json` prints the fields and the
  engine-derived intermediates the leak gates read.
- Nothing in `carbon_dump.mjs` or `carbon_fields.mjs` imports or names any of
  it, and `gate_capstone_leak.py` checks both directions.

## The three records

| tier | record | what it is |
|---|---|---|
| Associate | OWAZA | a flow station's heaters at 0.995 and flare at 0.97 destruction efficiency, its vented methane and its purchased power |
| Professional | IGRITA | a fired heater on a fuel gas carrying CO2 and N2, a failed trap read on a gauge, four streams at a 12 C approach |
| Expert | IKORODU | six measures at a 0.09 rate (one with no start year), an inventory baseline, a straight-line 35 percent target to 2034, and one priced saving |

## The gates, and what each one proves

| gate | what it proves | negative control |
|---|---|---|
| `oracle_check.py` | the vendored Python oracles, called on the capstone records, reproduce all eighteen fields within each field's tolerance; it names the one computation it transcribes from an oracle's main() (the tuning saving's duty ledger) | `--plant` moves one oracle answer by two tolerances and the gate names that field |
| `discriminate.mjs` | every field has at least three plausible wrong routes, each the engine asked the wrong question, and none lands inside the tolerance; it prints the closest miss in tolerances | `--plant` adds an identity route and the sweep reports one WEAK field |
| `gate_collisions.py` | no graded value is within its tolerance of any number token the digest prints (the go-live rule), and no two graded values share one | `--plant` sets one field to a digest number |
| `gate_promptleak.py` | no prompt prints a graded value of any tier, or an engine-derived intermediate, in any rounding | `--plant` appends both |
| `gate_capstone_leak.py` | names stay on their own road, no capstone figure is in the digest, no capstone record shares its inputs with a teaching record or a golden case (the goldens carry the Suite pages' defaults) | `--plant` copies a record and a figure across |

## The wrong routes discriminate models

The defects MD5-0 repaired and the ordinary ones: a blank destruction
efficiency read as 100 percent, escaped carbon weighed as carbon or as CO2,
44/12 for the molar mass ratio, the carbon per kilomole ignored, AR5 or
non-fossil methane for the stated set, methane tonnes read as CO2e, a line or a
scope left out; the 20.9 shortcut for excess air, air at 21 percent oxygen,
oxygen read on the wet flue gas, CO2 in the fuel gas treated as fuel, argon
carried at the nitrogen molar mass, HHV for LHV, latent heat counted on LHV,
radiation left out; the percentage-point shortcut, the saving over the current
efficiency, tuning to the floor; the superheated exponent, a gauge pressure
read as absolute, a full year of hours, a discharge coefficient of 1; no
temperature shift, the full approach on both sides, the energy balance alone;
capital against one year, straight line at a rate of 0, interest only,
savings or running cost left out, a plain mean for the weighted average, an
unscheduled measure counted, a target on a partial inventory, the curve
residual read as the path gap, a factor read per tonne instead of per kg.

## Write the go-live assertions from the engine's OUTPUT

Run the generator, read the number, assert the number. The go-live migration of
every course refuses a graded field within its tolerance of any number the
digest prints; this wave already clears that rule, and `gate_collisions.py` is
the same sweep run early. Re-run every gate above after ANY change to a
capstone condition, a teaching case or the digest.

## The prompts are drafts

`capstone.json` carries one draft prompt per tier, generated from the
conditions so it cannot drift from them. The course migration will store them
as `academy_capstones.prompt`; once seeded, run the kit's `promptleak.py --db`
on the stored rows as well.

## Hand back

The eighteen fields with values and tolerances; the output of all five gates
with their counts and their negative controls; the discriminate closest miss;
and every prompt change with the gate re-run after it.
