# FC9 Corrosion & Integrity: the panel author's task

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course; `RECON.md`, `FINDINGS.md`, the engine's source
comments and the vendored repair record are PROVENANCE.

## WHAT IS ALREADY SHIPPED

Two files under `src/components/course/panels/corrosion/` in the NextGen
repository:

* `gradedTolerance.js`. **The only place a grading tolerance is made.** It holds
  the quantity class and the stated tolerance of each of the 18 graded fields and
  derives the rest as `max(stated, half a unit in the last place the course prints
  that class)`. `fields.json` and `precision.json` are both written out of this
  one derivation. **Never type a tolerance anywhere else.** Three sibling waves
  shipped a stale third copy of a tolerance and one of them removed the class
  rather than the instance; this file is that repair carried forward.
* `gradedAnswerGuard.js`. Every string shape a graded answer can reach a learner
  as, four of them, derived from the value rather than listed. A sibling wave's
  guard matched at nine significant digits only and a full double went straight
  past it.

Two test files gate them and both must keep passing: `panelCapstoneGuard.test.js`
and `waveMirror.test.js`. Together they are 33 tests. **Neither names a path under
`/root`, and each asserts that of itself**, because the course gates had never once
run in CI until the wave inputs were committed.

## THE THREE PANELS THIS WAVE NEEDS

`structure.py` declares the ids and tags every lesson that uses one. All three
read ONE teaching lab.

### `fc-chemistry-explorer`

**What it shows.** The total pressure and the two mole fractions as inputs; the
CO2 partial pressure, the fugacity coefficient and the fugacity as outputs, side
by side and LABELLED so a reader can see which drives the rate. The H2S partial
pressure in bar and in psia against the screening threshold, with the decades
above it. The H2S to CO2 ratio and the regime word.

**What it must NOT show.** No severity region. No material guidance. Not a hint of
either, because both are WITHDRAWN and the whole point of section 2 is that the
absence is declared. It must print the engine's own `regionProvided` and
`materialGuidanceProvided` as false rather than leaving the rows out.

**What it must SAY.** That the threshold VALUE and both ratio boundaries are held.
That the fugacity cap is reported and what the correlation does above it is held.
That no fugacity correction is applied to H2S at all, which the engine declares in
a field.

### `fc-rate-explorer`

**What it shows.** The reaction term, the mass-transfer term and the combined
rate, with the combined always below both. The controlling word and its margin.
The protective-film factor and the **computed** onset, which moves with fugacity.
The pH factor and the pH reference. The wetting regime and its factor.

**What it must NOT show.** No round film onset temperature. The computed onset at
the shipped fugacity of 1.344240 bar is 80.984504 C, and across the swept
fugacities the onset moves by 96.443771 degrees Celsius, so a fixed number on the
panel would be wrong at every fugacity but one. No category word presented as a
measurement.

**What it must SAY.** That every de Waard-Milliams constant is held. That whether
the scale factor multiplies the reaction term or the combined rate is UNRESOLVED,
and that this module multiplies the combined rate. That below the pH reference the
engine refuses.

### `fc-inhibitor-integrity-explorer`

**What it shows.** Efficiency and availability as SEPARATE inputs, the effective
protection they give, the shortfall in percentage points and the metal-loss ratio
against the datasheet figure. The wall shear, its film-risk word, and the rate
WITH and WITHOUT the corrosion inhibitor credit. The allowance, the consumed
depth, the remaining allowance, the remaining life, the allowance the design life
demands and the shortfall. The binding constraint.

**What it must NOT show.** No inspection interval. No minimum or retirement
thickness. No fitness-for-service verdict. All four are NOT PROVIDED and the panel
must list them as absent rather than being silent about them. No unbounded life
from a zero rate, and no passing verdict off one.

**What it must SAY.** That both wall shear thresholds and both Blasius constants
are held. That the branch switch is a discontinuity of a factor of 2.189815 in the
shear across two ten-thousandths of the Reynolds number. That the rate category
bands are held. That the word integrity here means one arithmetic: an allowance
divided by a rate.

## THE RULES FOR EVERY PANEL

1. **No graded capstone answer, in any of four shapes.** The guard holds the full
   double, twelve significant digits, nine, and the printed precision, and the
   test plants and catches each. A panel that writes `${value}` prints the full
   double, which is the shape a nine-only matcher misses.
2. **No capstone plant name** outside a graded field key.
3. **No path under `/root`**, and no clock and no random number.
4. **The copy rule.** No em dashes, no en dashes, no "X, not Y" contrastive. When
   a panel surfaces an engine message, surface it verbatim.
5. **The three vocabulary collisions.** Every panel label that says "inhibitor"
   says "corrosion inhibitor". Every friction factor and Reynolds number is
   labelled as this module's, with the note that the line sizing course computes
   its own. "Erosion" appears nowhere, because the module has no erosional model.
6. **Extend `EXPECTED_SOURCES`** in `panelCapstoneGuard.test.js` in the same
   commit that adds a file. The inventory is declared so a rename cannot quietly
   empty the sweep, and a listing that does not match fails.
