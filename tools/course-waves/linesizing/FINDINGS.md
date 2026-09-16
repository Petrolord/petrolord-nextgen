# FC2 findings. Line Sizing & Hydraulics, foundation phase, 2026-09-16.

Engine `packages/engines/engines/facilities/lineHydraulics.js` at engines main
`709172f`, with `engines/production/chokePerformance.js` and
`engines/production/pipeSchedule.js`. Found by reading the source, by direct
probes, and by the independent oracle `oracle_linesizing.py` (Colebrook by its
Lambert-W closed form, the General Flow and Weymouth constants derived from
first principles, the outlet pressure inverted in closed form, and a 33 case
refusal sweep).

**NOTHING HERE IS FIXED IN THIS PHASE.** The course may need to teach around
these, and a fix moves goldens. Each item says whether it **FAILS OPEN** (a
wrong number presented confidently), **FAILS SILENT** (a non-number returned
with no `error`, so a caller checking `if (r.error)` is told nothing is
wrong), or is a **CONVENTION** (a rounded packaging, real but not a bug).

The honest positive first, because it bounds what follows: **the Colebrook
solve and the Barlow, pigging and erosional-velocity arithmetic are exact.**
Across 13 friction cases spanning Re 1500 to 1e8 and relative roughness 0 to
0.05, the engine's fixed point and the oracle's closed form agree to between
0 and 1.5e-13. Barlow wall and MAOP agree to 1.6e-16 on nine cases. Line
volume, swept volume, run hours and the pigging interval agree to 2.8e-16 on
nine cases, and the interval's overfull-catcher refusal fires correctly.
Erosional velocity agrees exactly on fifteen cases.

---

## A. FAILS OPEN. Ten of them.

### D1. The outlet-pressure solve cannot return an outlet above its inlet, and returns the inlet instead of refusing

`gasOutletPressure` brackets its bisection at `[14.7, rest.p1Psia]`. On a
DESCENDING line the elevation term makes `es` less than one, so the true
outlet pressure can legitimately exceed the inlet: the column recovers more
head than the friction spends. That answer is outside the bracket, and rather
than refusing, the search converges on the top of its own bracket and reports
a drop of zero.

Isolated from every constant question by running the closed-form inverse on
the ENGINE'S OWN 0.0375 coefficient, so the only difference left is the
solver:

| dz ft | outlet the rate really implies | engine | gap |
| --- | --- | --- | --- |
| 0 | 700.000000000 | 700.000000000 | -2.3e-13 |
| +800 | 700.000000000 | 700.000000000 | -1.1e-13 |
| -800 | 700.000000000 | 700.000000000 | 0 |
| -3000 | 700.000000000 | 700.000000000 | +1.1e-13 |
| **-3000** | **1010.000000000** | **1000.000000000** | **-10 psi** |
| **-3000** | **1050.000000000** | **1000.000000000** | **-50 psi** |
| -950 | 840.000000000 | 840.000000000 | -1.1e-13 |

Exact inputs for the failing row: `gasOutletPressure({ equation: 'weymouth',
qScfd: 16691325.997501064, p1Psia: 1000, idIn: 8, lengthMi: 25, sg: 0.65,
tAvgR: 540, zAvg: 0.87, elevChangeFt: -3000 })` returns
`{ p2Psia: 1000, dpPsi: 0 }`. The correct answer is `p2Psia: 1010`.
The same input through `panhandleB` gives the same 1000 against 1010.

**Fails open, and it is the worst thing in this engine.** A terminal at the
bottom of a 3000 ft descent is told its arrival pressure is the departure
pressure and that the line costs nothing, when the line in fact ARRIVES
HIGHER than it left. The studio's `gasLineTraverse` marches this function
segment by segment, so a descending profile accumulates the error at every
station. The bisection itself is sound: it is the bracket that is wrong.

### D2. A negative resistance sum is accepted and makes the fittings give pressure back

`liquidLineDrop({ qBpd: 5000, idIn: 6.065, lengthFt: 15000, rhoLbFt3: 53,
muCp: 3, sumK: -5 })` returns `dpFittingsPsi: -0.07500978443073472` and a
total 0.075 psi BELOW the friction-only answer. `sumK` is never validated.

### D3. A negative roughness is accepted and makes the pipe smoother than smooth

Same line with `roughnessIn: -0.01` returns `f: 0.021054394569679426` against
the correct `0.026087889047304295`, and `dpFrictionPsi` 9.374160185933434
against 11.615249730071548. **A 19.3 percent friction factor error and a 19.3
percent pressure drop error, reported without a flag.** The relative roughness
goes negative into the Colebrook logarithm and the solve converges happily.

### D4. An elevation change longer than the line is accepted

`liquidLineDrop({ qBpd: 5000, idIn: 6.065, lengthFt: 100, elevChangeFt: 9000,
rhoLbFt3: 53, muCp: 3 })` returns `dpElevationPsi: 3312.5` and a gradient of
33.125774349982 psi per foot for a line that would have to be vertical and
ninety times its own length. The Suite's own `multiphaseLine` DOES guard this
(`elevation change cannot exceed line length`); the engine underneath does not.

### D5 and D6. The efficiency factor is unbounded in both directions

`weymouthQ` with `efficiency: 3` returns 211770661.76089892 scfd, three times
the E = 1 rate, from a multiplier that is physically at most 1. With
`efficiency: -1` it returns **-70590220.5869663 scfd, a negative flow**, and
still no error. E is also a HELD item (section D below), so an unsourced
multiplier is also an unguarded one.

### D7. General Flow with no gas viscosity returns a rate

`generalFlowQ({ ..., muCp: 0 })` returns
`{ qScfd: 80148539.46294856, fDarcy: 0.010840371366815423 }`. The Reynolds
number goes to infinity, Colebrook returns its fully-rough asymptote, and the
answer looks like a slightly optimistic version of the real one (the correct
rate is 78870925.08811851, so the fake is 1.6 percent high). **A plausible
wrong number is worse than an absurd one.**

### D8. A negative corrosion allowance thins the wall

`requiredWallIn({ designPsig: 1000, odIn: 8.625, smysPsi: 42000,
corrosionAllowanceIn: -0.5 })` returns `tRequiredIn: -0.357390873015873`, a
NEGATIVE required wall, with `tPressureIn` correct at 0.14260912698412698.
A specification built from that is a pipe with no wall.

### D9. A negative swept volume buys pigging time

`piggingInterval({ maxSlugBbl: 100, dropoutBpd: 25, sweptBbl: -500 })` returns
`{ intervalDays: 24 }`. The correct behaviour is a refusal; instead the
negative sweep is added to the catcher's room and the operator is told to pig
six times less often than the four days the real sweep allows.

### D10. A traverse marches straight through zero absolute pressure

`liquidLineTraverse({ p1Psia: 100, qBpd: 20000, idIn: 2.067, rhoLbFt3: 56,
muCp: 8, profile: [{ lengthFt: 20000 }] })` returns
`p2Psia: -47328.563501624376` and a total drop of 47428.563501624376 psi.
There is no check that a station pressure stays above zero, or above the
fluid's vapour pressure, or above atmospheric. **A line that has cavitated,
or that physically cannot pass the rate, comes back as a number.**

---

## B. FAILS SILENT. Ten inputs, three functions, one shape.

Each returns an object with **no `error` key** and a non-finite number inside,
so a caller that branches on `if (result.error)` proceeds as though the answer
were good. The platform's own rule covers this: a function that returns a
verdict for an input it could not read has survived and said nothing.

| function | input | returns |
| --- | --- | --- |
| `weymouthQ` | `lengthMi: 0` | `{ qScfd: Infinity }` |
| `weymouthQ` | `lengthMi: -50` | `{ qScfd: NaN }` |
| `weymouthQ` | `idIn: -12` | `{ qScfd: NaN }` |
| `weymouthQ` | `zAvg: 0` | `{ qScfd: NaN }` |
| `weymouthQ` | `tAvgR: 0` | `{ qScfd: NaN }` |
| `panhandleAQ` | `sg: 0` | `{ qScfd: Infinity }` |
| `requiredWallIn` | `tempDerate: 0` | `{ designFactor: 0.72, tPressureIn: Infinity, tRequiredIn: Infinity }` |
| `requiredWallIn` | `jointFactor: 0` | same |
| `sweptLiquidBbl` | `idIn: 0` | `{ sweptBbl: NaN }` |
| `sweptLiquidBbl` | `lengthFt: -100` | `{ sweptBbl: NaN }` |

`sweptLiquidBbl` is the sharpest of these because it DOES validate one of its
three inputs: it refuses a holdup above 1 with a proper message, and then
passes the bore and the length straight into `lineVolumeBbl`, which returns
`NaN` by contract. One third of the input set is guarded and the guard's
existence is what makes the other two look checked.

`requiredWallIn` is the same shape: it validates `designPsig`, `odIn` and
`smysPsi`, refuses an unknown code and refuses a location class that does not
exist, and then divides by an unvalidated `jointFactor * tempDerate`.

---

## C. CONVENTIONS AND ONE CROSS-MODULE DIVERGENCE

### F1. Two different barrels in one product. **This one is a defect.**

`lineHydraulics.js` defines the barrel exactly, `(42 * 231) / 1728`, and
`chokePerformance.js` writes the same constant truncated to seven figures.
Measured out of the two modules:

| module | ft3 per barrel |
| --- | --- |
| `lineHydraulics.lineVolumeBbl` | 5.6145833333333 |
| `chokePerformance.erosionalRateBpd` | 5.6145830000000 |
| exact | 5.6145833333333 |

A ratio of 1.0000000593692, so an erosional rate limit is 5.9e-8 low against
the line volume computed one import away. It is small, and it is nonetheless
two values of one constant inside the single chain the Pipeline & Line Sizing
Studio composes: `sizeSweep` reads bores through `pipeSchedule`, pressure
drops through `lineHydraulics` and the erosional verdict through
`chokePerformance`. **The fix belongs in the engines repo: import the barrel
from one place.** Every oracle case shows it, all fifteen erosional rates, in
the same direction.

### F2. The centipoise conversion is rounded, and it moves every Reynolds number

`CP_TO_LBM_FT_S = 6.7197e-4` against the exact `1e-3 * 0.3048 / 0.45359237 =
6.7196897514e-4`, a ratio of 0.999998474842. Every Reynolds number the engine
returns is 1.525e-6 high, and the error carries into `f` and into every
pressure drop, always in the same direction. Measured on all eleven oracle
liquid cases at exactly 1.525e-6.

### F3. `gc` is rounded, and it moves every velocity head

`GC = 32.174` against the exact `9.80665 / 0.3048 = 32.1740485564`, a ratio of
1.000001509182. Every fittings loss is 1.509e-6 low. Measured identically on
every case that carries a `sumK`.

### F4. The gas elevation coefficient is rounded at four parts in ten thousand, and it sits inside an exponential

The published `0.0375` against the value derived from `M_air g / R` in field
units, `0.0374863356`: a ratio of 0.999635615. Because the coefficient enters
as `e^s`, the error is amplified by the height:

| line | rate gap between the derived and the published coefficient |
| --- | --- |
| 8 in, 25 mi, +/-800 ft | 8.3e-6 and 7.7e-6 |
| 11.938 in, 32 mi, +/-1500 ft | 2.7e-5 and 2.1e-5 |

**This is the reason FC2's inclined-line tolerances cannot be tighter than
about 1e-4**, and it is why the +/-800 ft outlet-pressure rows first looked
like a solver defect and were not. Every FLAT gas case agrees to 0.

### F5. The published leading constants, measured against first principles

The General Flow constant is derivable from the isothermal compressible pipe
equation with nothing quoted, and Weymouth is that same equation closed with
its own fully-rough friction assumption `f = 0.032 / d^(1/3)`:

| constant | derived | engine | ratio |
| --- | --- | --- | --- |
| General Flow leading | 77.564841 | 77.54 | 1.000320366 |
| Weymouth leading | 433.600644 | 433.5 | 1.000232165 |
| Weymouth diameter exponent | 2.666666666667 | 2.666666666667 | exact |

**The Weymouth diameter exponent 8/3 falls out of the derivation exactly**
(2.5 from the General Flow form plus 1/6 from the `d^(-1/3)` friction
assumption), which is a real result and a good teaching one: Weymouth is not a
separate correlation, it is General Flow with a fully rough pipe assumed.

Against their published SI twins on the same physical line, the field forms
sit at ratios of 0.999230 (Weymouth), 0.999999 (Panhandle A) and 0.999989
(Panhandle B). **Weymouth's field constant is the loosest-packaged of the
three, by three orders of magnitude.**

Panhandle A and B are purely empirical and nothing derives them, so their only
independent check is the SI twin, which is the same route the engine's own
oracle takes. **Agreement there is weaker evidence than for Weymouth and
General Flow, and no lesson should claim otherwise.**

---

## D. HELD FOR LITERATURE. Taught as limits, never graded.

1. **The API RP 14E c factors.** 100 and 125 are the recommended practice's
   own conservative figures; the third row, 175, is labelled "Clean, inhibited
   service (operator practice)" and has no publication behind it at all.
2. **The transmission-form efficiency E.** An unsourced multiplier on all four
   forms, and unguarded in both directions (D5/D6).
3. **The transition band, Re 2100 to 4000.** No honest correlation exists
   there. See G1.
4. **The Weymouth fully-rough friction assumption**, now quantified in F5 but
   not sourced to a publication.
5. **All 37 published goldens are synthetic**, written by an SI oracle. No
   measured pipeline is in this course.

**No graded capstone value touches any of these.** Every c factor, efficiency,
roughness, resistance sum, location class and holdup in `fields.json` is a
STATED condition of its tier, every capstone Reynolds number is above 20000,
and no graded field reads the RP 14E rows, the pipe schedule, the roughness
table or the fitting K table.

---

## E. STRUCTURAL, NOT NUMERIC

### G1. A 60 percent discontinuity, labelled `transitional`

At the OGBIA relative roughness the friction factor jumps from 0.0304761905 at
Re 2099.9999999 to 0.0489100331 at Re 2100: **60.4860 percent across one unit
of Reynolds number.** On a smooth pipe it is 59.7266 percent. The engine's own
header is honest that the band has no correlation, and it then labels the
2100-to-4000 range `transitional` while computing it on the turbulent branch,
so the word and the arithmetic say different things. This is teaching material
rather than a repair, but any lesson quoting a friction factor in that band
has to say which branch produced it.

### G2. Neither iteration reports whether it converged

`frictionFactor` runs 60 fixed-point passes and `generalFlowQ` runs 50, and
both return the last iterate whatever happened. Neither return carries a
`converged` flag. They do in fact converge everywhere the oracle looked
(1.5e-13 worst case), which is exactly why the absence is easy to miss.

### G3. Colebrook is evaluated far past its published roughness range

Colebrook-White is published for relative roughness up to about 0.05. The
engine will return `f: 0.101673133200682` at 0.1 and `0.3308894262569174` at
0.5, with no note. Nothing in `pipeSchedule.ROUGHNESS_IN` gets near 0.05 on a
real bore, so this is reachable only through a typed roughness.

### G4. `FT_PER_MILE` is declared and never used

`const FT_PER_MILE = 5280;` at line 34 of `lineHydraulics.js` has no reference
anywhere in the module. Dead. It matters to this wave because the FC1 rule
says every digest number is an engine return, and an unexported constant has
to be MEASURED by asking the engine a question about itself. Four of the five
unexported constants can be measured that way; this one cannot, because
nothing consumes it.

### G5. `liquidLineTraverse` has no `sumK` parameter

A line sized WITH its fittings and then marched loses them silently. The
engine's own jest gate works around it ("fittings are per-line, not
per-segment, so compare without them") rather than treating it as a gap.

### G6. `erosionalC` resolves an unknown id to the first row

`erosionalC('sandLaden')` returns `{ id: 'continuous', label: 'RP 14E
continuous service', c: 100 }`. A caller who names a service the table does
not carry is given the continuous-service figure under its own label, with no
signal. Compare `pipeSchedule.fittingK`, `roughnessOf` and `gradeYield`, which
all return `NaN` for an unknown id, and `scheduleRow`, which returns `null`
rather than a nearby size. **Three modules, two philosophies.**

### G7. `maopPsig` silently over-rates a line if the caller drops the allowance

On the QUA IBOE wall, the MAOP of the required wall WITH its 0.0625 in
allowance is 1450.000000 psig, and the same call with the allowance omitted
returns 1676.640625 psig, **1.156304 times higher**. Both calls are legal and
neither warns. The allowance is an argument of `maopPsig` itself, so forgetting
it is a one-word mistake that raises a rating by 15.6 percent.

---

## S. THE SUITE COMPOSITION LAYER

`src/utils/facilities/lineSizing.js` is app code, not a vendored engine, so
none of these can be a digest number. All four were reproduced by replicating
the layer's own logic over the vendored engine.

### S1. `sizeSweep` recommends the first passing row in TABLE order, not the smallest passing bore

`const recommended = rows.find((r) => r.pass) || null;` walks
`PIPE_SCHEDULE`, which is ordered by nominal size and then by schedule, and
**that order is not monotonic in bore**: 2.067, 1.939, 3.068, 4.026, 3.826,
6.065, 5.761, 7.981, 7.625, 10.02, 11.938, 15. A heavier schedule is a smaller
bore at the same nominal size, and it sits AFTER the lighter one. On a
12000 bpd, 55 lb/ft3, 3 cp line over 10000 ft:

| velocity cap ft/s | first passing in table order | smallest passing bore |
| --- | --- | --- |
| 10 | 4 in sch 40, bore 4.026 | **4 in sch 80, bore 3.826** |
| 8 | 4 in sch 40, bore 4.026 | **4 in sch 80, bore 3.826** |
| 5 | 6 in sch 40, bore 6.065 | **6 in sch 80, bore 5.761** |
| 4 | 6 in sch 40, bore 6.065 | **6 in sch 80, bore 5.761** |
| 3 | 6 in sch 40, bore 6.065 | **6 in sch 80, bore 5.761** |

Seven of the ten caps swept disagree. The Suite's own gate asserts
`sweep.recommended.idIn === Math.min(...passes.map((r) => r.idIn))` and passes
only because its one case happens not to straddle a schedule pair. **Fails
open: the studio recommends a line that is not the smallest one that works,
and says it is.**

### S2. The gas sweep invents a density of 1 lb/ft3 when the z solve fails

`const gas = gasDensityLbFt3({ ... })` is followed by
`gas.z || 1` and `gas.rhoLbFt3 || 1`. If the density call returns its error
object, both fall back to 1 and the row still reports a velocity and an RP 14E
verdict, computed against a gas density that is a placeholder. Fails open.

### S3. `gasDensityLbFt3` throws away the z solver's own convergence flag

`naturalGasZ` returns `dakZ({...}).z` and discards `converged`; the Suite
layer then only checks `z > 0`. This is FC1's D7 appearing in a second app:
FC1 found the separator returning a "converged" z of 1.218 at Tpr 0.75, and
the line sizing studio has no range guard of any kind. Fails open.

### S4. `multiphaseLine` applies the inlet gradient to the whole line

`dpTotalPsi: grad.dpdz * lengthFt` uses a single gradient evaluated at the
INLET pressure across the entire length, with no marching, while the
single-phase liquid path next to it has a proper `liquidLineTraverse`. On a
long line where the gas expands, the gradient rises along the pipe and the
one-shot answer is low. The function also returns `p2Psia` without checking
that it stayed positive.

---

## Ranked for a repair wave (FC2-0), if the lead wants one

1. **D1**, the outlet-pressure bracket. Wrong by 10 to 50 psi on a real
   descending line, and it propagates through the studio's gas traverse.
2. **S1**, the sweep recommendation. It is the one number the studio exists to
   produce.
3. **D3** and **D7**, the two fails-open that return plausible wrong numbers.
4. **F1**, one barrel constant for the package.
5. The rest of section A and all of section B, as one input-guard pass.

**Everything in A, B and S would move a number somewhere. Nothing here is
fixed in this phase, and the digest and the goldens are built on the engine as
it stands at 709172f.**
