# gasvalue KEY TRUTH TASK. The capstones and their answer files.

## What a capstone is here

Three capstones, one a tier, **six engine-derived graded fields each**, eighteen
in the course. A graded field is a RETURN VALUE OF THE ENGINE, computed by
`gasvalue_capstone.mjs` from the capstone records. It is never arithmetic
performed in the generator and never a figure typed by hand. The one step the
generator takes before an engine call is stated where it happens: the ASABA CNG
pressures are read on gauges, and the stated atmosphere is added to each before
the engine (which reads bar(a)) is called. That step is what the Expert capstone
tests.

**THE TOLERANCE IS ONE UNIT IN THE LAST PLACE THE DIGEST PRINTS THE FIELD'S
CLASS** (`CLASSES` and `toleranceOf` in `gasvalue_capstone.mjs`, written to
`precision.json`): 1e-4 for the four-decimal classes (Btu/scf, gal/Mscf,
kg/Mscf, kg a year, dollars per Mscf, dollars per tonne, tonnes of LPG, kW,
minutes, kg in a bank, years); 0.01 for the capital in dollars (the engine
rounds dollars to two); 1e-3 for the kilograms left in the cascade (the engine
rounds to three). ONE EXCEPTION: tonnes a year of a flare or an abatement are
printed to three decimals and graded at TEN units, 0.01 t, because the engine's
`LB_PER_KG` (2.20462262) is the exact reciprocal of 0.45359237 to nine figures
only, and on a flare of 300,000 t/yr the engine and the oracle's exact pound part
by up to about 1.1e-3 t once the engine has rounded (ERIEMU's CO2e: 1.05
thousandths). The rule takes one unit and keeps half in reserve: where the engine itself
rounds at the printed place, a correct reading and the unrounded truth differ by
up to half a unit already. `gradeprecision.py` accepts every one (18 of 18).

**NOTHING HELD IS GRADED.** The flare efficiencies (H1), the GWP and the credit
prices (H4) and the fill limit (H3) are stated in each prompt as the record's
own figures; nothing graded depends on the unlit flare (H2). No compressor power
(FC3) and no NPV, IRR or Monte Carlo figure is graded. No count is graded: an
integer at a tolerance of 0.5 collides with the digest's integers.

## The generator and its inputs

- `gasvalue_fields_capstone.mjs`: the three records, and `FIELD_SOURCES`, the
  engine return behind each graded key.
- `gasvalue_capstone.mjs`: runs them, asserts every value is finite, asserts
  the vaporizer duty is complete, the cascade did not hit its fill limit, the
  vessel is on the water-capacity basis, the route does not stand alone and the
  breakeven sits on no tested price, and writes `fields.json`, `precision.json`
  and `capstone.json` (the draft prompts). The molar masses the flare is worked
  at and the capital exponent are read from the engine, never typed.
- Nothing in `gasvalue_dump.mjs` or `gasvalue_fields.mjs` imports or names any
  of it, and `gate_capstone_leak.py` checks both directions.

## The three records

| tier | record | what it is | graded |
|---|---|---|---|
| Associate | ERIEMU | a Delta State flow station whose laboratory sheet sums to 0.992, flaring 12.4 MMscfd with both flare efficiencies given | heating value, gpm C3+, C3+ kg/Mscf, flare CO2, CH4 and CO2e a year |
| Professional | ADIBAWA | a Rivers State parcel bid as CNG, with a reference plant, costs, a declared diesel counterfactual and credit prices typed out of order | capital, CNG kg a year, value per Mscf, avoided flare CO2e, net abatement, breakeven credit price |
| Expert | ASABA | an Asaba hub: an LPG vessel filled to a filling density on water capacity, a vaporizer, a carousel on the positions wholly working, a CNG bank and cascade read on gauges, a taxi's switch | usable LPG, vaporizer design duty, carousel wait, bank mass, gas left in the cascade, simple payback |

## The gates, and what each one proves

| gate | what it proves | negative control |
|---|---|---|
| `oracle_check.py` | the vendored Python ORACLES (oracle_flaretovalue: characterise, flare, economics, credits; oracle_lpgcng: blend, erlang_c, mass, cascade), called on the capstone records and CHAINED oracle to oracle, reproduce all eighteen within tolerance (largest disagreement 0.435 of a tolerance); the four ledgers the oracles exported in MD45-1 are called (net_abatement, storage, vaporizer, conversion); twelve teaching figures agree with the same oracles | `--plant` moves one oracle answer and the gate names that field |
| `discriminate.mjs` | every field has at least four numeric wrong routes (the MD4-0 defects by name, several by CALLING the pre-repair engine 13f0936, plus the ordinary ones) and none lands inside the tolerance; closest miss 82.5 tolerances (the taxi's payback with the extra maintenance left out) | `--plant` adds an identity route and the sweep reports one WEAK field |
| `gate_collisions.py` | no graded value is within its tolerance of any number token the digest prints (the go-live rule), and no two graded values are within tolerance of each other; the nearest digest token to each field is printed | `--plant` sets one field to a digest number |
| `gate_promptleak.py` | no prompt prints a rounding of a graded value of any tier, or of any of 111 intermediates the engine derives, or a derived count as an integer | `--plant` appends all three kinds |
| `gate_capstone_leak.py` | names stay on their own road; no capstone analysis, blend, vessel, vaporizer, carousel, bank set or switch shares its defining figures with a teaching record, the studio's opening examples or a golden case; no golden number sits within tolerance of a graded value; no graded value prints on the teaching road | `--plant` copies a record and a name across |

## Write the go-live assertions from the engine's OUTPUT

Run the generator, read the number, assert the number. The go-live migration of
every course refuses a graded field within its tolerance of any number the
digest prints; this wave already clears that rule, and `gate_collisions.py` is
the same sweep run early. Re-run every gate above after ANY change to a capstone
condition, a teaching case or the digest: a digest edit can create a collision
without touching the capstone (the taxi's payback sits 9.83 tolerances from a
methane share the digest prints).

## The prompts are drafts

`capstone.json` carries one draft prompt per tier, generated from the conditions
so it cannot drift from them. Each asks for six numbers and states the decimals
it wants for each, which are the printed decimals of the field's class. The
Associate prompt says to scale the sheet to one; the Expert prompt says every
CNG pressure is gauge and gives the atmosphere. The course migration will store
them as `academy_capstones.prompt`; once seeded, run the kit's
`promptleak.py --db` on the stored rows as well.

## Hand back

The eighteen fields with values and tolerances; the output of all five gates
with their counts and their negative controls; the discriminate closest miss;
and every prompt change with the gate re-run after it.
