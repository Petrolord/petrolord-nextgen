# FC2 findings. Line Sizing & Hydraulics, foundation phase, 2026-09-16.

Engine `packages/engines/engines/facilities/lineHydraulics.js` at engines main
`709172f`, with `engines/production/chokePerformance.js` and
`engines/production/pipeSchedule.js`. Found by reading the source, by direct
probes, and by the independent oracle `oracle_linesizing.py` (Colebrook by its
Lambert-W closed form, the General Flow and Weymouth constants derived from
first principles, the outlet pressure inverted in closed form, and a 33 case
refusal sweep).

**THE FIRST PHASE FIXED NOTHING. THE FC2-0 REPAIR WAVE, 2026-09-16, FIXED
TWENTY-ONE OF THESE, AND PART 2 AT THE FOOT OF THIS FILE CARRIES A RESOLUTION
FOR EVERY ITEM, INCLUDING THE ONES DELIBERATELY LEFT ALONE.** Read the
sections below as the record of what the engine did at `709172f`, and Part 2
as what it does now. Each item says whether it **FAILS OPEN** (a wrong number
presented confidently), **FAILS SILENT** (a non-number returned with no
`error`, so a caller checking `if (r.error)` is told nothing is wrong), or is
a **CONVENTION** (a rounded packaging, real but not a bug).

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

**Everything in A, B and S would move a number somewhere.** Items 1, 3, 4 and
5 of that ranking were taken in FC2-0 (engines PR #196) together with the
whole of A and B; item 2 is the Suite layer and belongs to the Suite repair.
Part 2 records each resolution.

---

# FC2-0 SUITE REPAIR, 2026-09-16

All four section S defects are FIXED in the Suite composition layer
`src/utils/facilities/lineSizing.js` (branch
`fix/facilities-line-sizing-repairs`, PR against Suite `main`). The
engine `lineHydraulics.js` was NOT touched: sections A, B, C, D and E
above are untouched and remain open, including D1, which is being
repaired separately in the engines repo.

Every repair keeps the refusal rule: a function returns a usable answer
or an object with a populated `error` key. No bare NaN, no placeholder.

### S1 FIXED. The sweep recommends the smallest passing bore.

`rows.find((r) => r.pass)` became a sort on bore ascending over the
PASSING rows only. Ties break on bore, then the thinner wall, then the
smaller outside diameter, then table order; at equal bore the two lines
are hydraulically identical, the lighter pipe is the cheaper one, and
whether that wall is thick enough is the Wall tab's question, not the
sweep's. **No tie is reachable in the vendored table** (no two rows
share a bore), so the tie rule is documented and gated by a test that
asserts the bores are unique, which is the condition that keeps it
unreachable.

Confirmed on the FINDINGS duty (12000 bpd, 55 lb/ft3, 3 cp, 10000 ft):
7 of the 10 velocity caps swept changed their recommendation, e.g. at
cap 8 from **6 in sch 40 (6.065 in) to 6 in sch 80 (5.761 in)**.

The gate is written to fail against the old logic: it asserts that the
first passing row in TABLE order is 6 in sch 40 and that the
recommendation is a different, smaller row. A negative control at cap 4,
where the first passing row IS the smallest, pins that the fix does not
over-correct.

The app claimed "the smallest bore that passes every stated limit" in
two places while doing something else; both now say what the rule is and
why the first passing row you read is not always it.

### S2 FIXED. No density is invented.

`gas.z || 1` and `gas.rhoLbFt3 || 1` are gone. `gasDensityLbFt3` now
validates pressure, temperature and gravity at its door and returns a
named refusal; a zero gas gravity (reachable by typing 0 in the studio)
used to give rho = 0, fall through `|| 1` to 1 lb/ft3, and produce an
erosional limit of 100 ft/s with twelve passing rows.

Because the density depends on the gas and the conditions and not on the
bore, the gas sweep now asks for it ONCE up front and refuses the sweep
by name, rather than repeating one row note twelve times. Per-row
refusals still degrade to a failing row carrying the reason.

### S3 FIXED. The z solver's own verdict is read, and so is its window.

The layer now calls `dakZ` directly instead of `naturalGasZ` (which
discards the flag), refuses on `converged === false`, and additionally
refuses OUTSIDE the DAK validity window, `1.0 <= Tpr <= 3.0`, `Ppr <=
30`. The window matters more than the flag here: **DAK reports
`converged: true` at Tpr 0.711 with z = 0.293 and at Ppr 74.6 with z =
5.32**, so reading the flag alone would have caught neither. The fit's
published LOWER pressure edge (Ppr 0.2) is deliberately not a refusal:
below it the gas is near-ideal, z tends to 1, and a 100 psia line is
ordinary.

The non-convergence branch is gated by mocking `dakZ` to report
`converged: false`, since no reachable input makes the real solver fail.

The layer also stopped carrying its own copies of 28.9625 and 10.7316
and imports `AIR_MW` and `R_UNIVERSAL` from the engine that owns them,
which is F1's lesson applied one module over.

### S4 FIXED BY MARCHING, deliberately, rather than by disclosure.

`grad.dpdz * lengthFt` became an explicit Euler march in steps sized so
no step moves the pressure by more than 0.25 percent of the inlet
pressure (8 to 500 steps, `marchSteps` overridable). Cost is about 46 ms
for a whole 12-bore sweep, which is invisible in a studio that
recomputes as you type.

The judgement turned on one case. The error from the simplification
alone would have been defensible to disclose:

| line | one-shot dp | marched dp | gap |
| --- | --- | --- | --- |
| 5000 ft | 10.953 | 11.027 | +0.68 % |
| 15000 ft | 32.860 | 33.612 | +2.29 % |
| 50000 ft | 109.534 | 119.677 | +9.26 % |

But a gassy 40000 ft line (2000 bpd, 10 pct wct, 20 MMscfd, 600 psia,
6.065 in) was reported by the one-shot form as **arriving at 55.0 psia
with a 545 psi drop**, and marched, its pressure reaches atmospheric
about **20659 ft along the 40000 ft run**. A simplification that turns
an undeliverable line into a deliverable-looking one cannot be made safe
by stating it, so it is computed. Step convergence is gated: four times
the steps moves a long-line answer by under 0.1 percent.

An undeliverable line now refuses with `code: 'infeasible'` and names
the distance, instead of returning a positive-looking `p2Psia`. A bad
input refuses with `code: 'input'`. The sweep uses the distinction: an
undeliverable BORE stays in the table as a failing row with its reason
(it is a fact about that bore), while a bad line refuses the sweep once.

Returns are labelled by where they hold: `pattern`, `holdup`, `vm` stay
INLET values with their previous meaning, `outlet*` are the far-end
values, `gradientPsiPerFt` is now the whole-line average, and
`avgHoldup` is the length-weighted holdup. Pigging swept volume now
reads `avgHoldup`, because the liquid a pig pushes is the holdup along
the line and not the value at the inlet.

### Results that move for users

Sweep recommendations (S1) on any duty where a heavier schedule of the
same nominal size also passes; every multiphase pressure drop (S4),
upward, by under 1 percent on short lines and by several percent on long
gassy ones; pigging swept volume and interval, slightly, via
`avgHoldup`; and cold, very high pressure or zero-gravity gas cases,
which now refuse where they previously answered.

### Observed during the repair, NOT fixed, worth a later look

**The RP 14E check in the sweep is made at the INLET mixture velocity,
and the fastest point of a gas-carrying line is the OUTLET.** Marching
made the gap measurable: on the 50000 ft case the mixture velocity rises
from 4.84 ft/s at the inlet to 6.02 ft/s at the outlet, so a row can
pass an erosional check its own far end would fail. `maxVmFtS` and
`outletVmFtS` are now returned and available to a caller, but the pass
logic was deliberately left on the inlet velocity rather than silently
moving more results in a repair wave scoped to four named defects.


---

# PART 2. THE FC2-0 REPAIR WAVE, 2026-09-16

Engines PR **#196**, branch `fix/fc2-0-linehydraulics`, three commits on top of
`709172f`. Every defect above has a resolution here. The standing rules the
choices were made under: **a refusal must be a named refusal and never a NaN**,
a guard that returns a non-finite number without an `error` key is worse than
no guard because it defeats the caller's own check, and where an input is
physically meaningful but mishandled the answer is to compute it correctly
rather than to refuse it.

**Evidence the repair moved nothing it should not have.** No published golden
case moved: `linehydraulics_cases.json` went from 37 cases to 45 and every one
of the original 37 is byte-identical, because no valid-input arithmetic changed
anywhere in this wave. The engine suite went from 5750 passing to 5764 (179
suites, 1 todo, 0 failures). The line-hydraulics gates went from 15 to 28. The
FC2 oracle's refusal sweep went from **18 inputs it says must be refused and
the engine does not, to 0**, over 45 cases rather than 33. FC2's own goldens
went from 183 cases to **201**: outlet 7 -> 13, refusals 33 -> 45, and the
traverse block's three rows gained the die-out fields; nothing else moved.
(The commit message on the foundation rebuild says 202. It is 201; the count
is recorded here because a pushed branch is not worth rewriting for a digit,
and because a figure quoted from arithmetic rather than from the count is
exactly what this programme keeps catching.) All 18 graded
capstone fields are unchanged, verified by re-running the capstone generator
against the repaired engine and diffing `fields.json`, not by assuming.

## A. THE TEN THAT FAILED OPEN

### D1 — the outlet bracket. **COMPUTED CORRECTLY, not refused.**

A descending line's outlet is a real, reachable, useful answer; refusing it
would refuse the physics. The bracket was the defect, exactly as the finding
said, and it is now `[14.7, p1 / sqrt(es)]`, the second endpoint being the
outlet pressure at which the driving group `p1^2 - es p2^2` vanishes. On a
descent that ceiling is above the inlet; the exact inputs in the finding now
return `{ p2Psia: 1010, dpPsi: -10 }` and the 1050 case returns
`{ p2Psia: 1050, dpPsi: -50 }`, through Weymouth, Panhandle A, Panhandle B and
General Flow alike. **A negative `dpPsi` is the answer, not an error state:**
the line arrives higher than it left.

**THE FINDING WAS INCOMPLETE, AND THE HALF IT MISSED IS THE COMMONER ONE.** On
an ASCENT the ceiling sits BELOW the inlet, and `p2` above it makes the driving
group negative, which the forms refuse. The old loop read that refusal as
"still too much flow" (`if (Number.isNaN(fm) || fm > 0) lo = mid`) and walked
its LOWER bound up through the ceiling, so EVERY rate a climbing line could
carry to its ceiling came back as the inlet with `dpPsi: 0`. On the same 8 in,
25 mi line up 3000 ft at 1e6 scfd the engine returned 1000 psia where the truth
is 924.879401 psia: **75 psi, worse than the descent's 10 to 50, and on an
ordinary uphill gathering line rather than an unusual one.** A refusal at the
midpoint now searches DOWN, which is the only thing it can mean inside this
bracket.

A climb whose static column alone spends the inlet is refused by name rather
than answered: at 15.5 psia up 3000 ft the ceiling is below atmospheric and
there is no outlet at any rate.

**The bisection was never at fault.** Running the closed-form inverse on the
ENGINE'S OWN 0.0375 coefficient, so that only the solver differs, the two agree
to between 0 and 3.2e-16 across nine cases spanning both signs of elevation,
including both descents above the inlet. The residual 1.1e-5 to 3.9e-5 against
the SI oracle is F4's elevation coefficient and nothing else.

### D2 — a negative resistance sum. **REFUSED.**
A resistance sum is a sum of non-negative K values. A negative one is a pump,
not a fitting. `a fitting resistance sum cannot be negative: fittings spend
pressure, they do not return it`. Zero, a line with no fittings, is legal and
is the default.

### D3 — a negative roughness. **REFUSED.**
Absolute roughness is a length. Zero means hydraulically smooth and is a real
pipe; below zero is not a pipe. `absolute roughness is a length and cannot be
negative`, in `liquidLineDrop` and in `generalFlowQ`, and `frictionFactor`
returns its existing `regime: 'invalid'` sentinel for a negative relative
roughness rather than solving Colebrook on it.

### D4 — an elevation change longer than the line. **REFUSED.**
The Suite's `multiphaseLine` already refused this with `elevation change cannot
exceed line length`; the engine underneath now refuses it with the same words,
so the layer and the engine say one thing. **Extended to the four gas forms**,
which had the same hole: a gas line cannot rise further than its own length
either. A line exactly as tall as it is long is vertical and is accepted.

### D5 and D6 — the efficiency factor. **REFUSED outside (0, 1].**
E is a derating multiplier on an ideal. Above one it claims a pipe better than
the equation's own ideal; at or below zero it is not a multiplier. `transmission
efficiency must be greater than 0 and at most 1`. E = 1 is accepted exactly.
E remains a HELD item for literature: guarding a number is not sourcing it.

### D7 — General Flow at zero viscosity. **REFUSED.**
`General Flow needs a positive gas viscosity`. The old answer was 1.6 percent
high and looked like a slightly optimistic version of the right one, which is
the worst kind of wrong number.

### D8 — a negative corrosion allowance. **REFUSED.**
An allowance is metal ADDED to the wall. `a corrosion allowance is metal added
to the wall and cannot be negative`, in `requiredWallIn` and in `maopPsig`,
where a negative allowance would have inflated the net wall and the rating with
it.

### D9 — a negative swept volume. **REFUSED.**
`a swept volume cannot be negative`. Zero, a dry line, is legal.

### D10 — a traverse marching past zero absolute. **REFUSED, WITH THE EVIDENCE.**
A bare refusal would have thrown away the diagnosis, so the return carries the
stations it can stand behind, `diedAtFt`, and `diedAtPsia`, the unphysical
value the arithmetic produced. A caller branching on `error` is stopped; a
caller that wants to draw the march up to the failure still can. **Zero
absolute is the bound this module can honestly defend**: a liquid will have
cavitated at its own vapour pressure well above it, and a vapour pressure is
fluid knowledge `lineHydraulics` does not hold. The single `liquidLineDrop`
call underneath still answers, because a DROP is not a PRESSURE and nothing
about it is unphysical.

## B. THE TEN THAT FAILED SILENT. **ALL REFUSED BY NAME.**

One shared validator now guards every published gas form (`p1Psia`, `p2Psia`,
`idIn`, `lengthMi`, `sg`, `tAvgR`, `zAvg`, `efficiency`, the elevation against
the length, and the base conditions), so `lengthMi` 0 and -50, `idIn` -12,
`zAvg` 0, `tAvgR` 0 and `sg` 0 all return `{ error }` instead of
`{ qScfd: NaN }` or `{ qScfd: Infinity }`. `requiredWallIn` guards the two
factors in its denominator, both to `(0, 1]`. `sweptLiquidBbl` guards the bore
and the length it used to hand straight to `lineVolumeBbl`'s NaN contract.

**An eleventh, not in the original list, found while repairing the tenth:**
`liquidLineTraverse` had no `p1Psia` guard at all. Called without one it
returned a station list whose pressures were all NaN, a NaN `p2Psia` and a NaN
`dpTotalPsi`, with **no error** — the same defect class as the ten, in the
function the studio's profile chart reads. Now `a traverse needs a positive
absolute inlet pressure`.

`reynoldsNumber` and `lineVolumeBbl` keep their NaN contract. They return bare
numbers and have nowhere to put a message; every function that wraps them now
refuses in words, which is where a caller's check actually lives. The digest
says so out loud rather than leaving the reader to infer it.

## C. THE CROSS-MODULE DIVERGENCE

### F1 — two barrels in one chain. **FIXED: one definition, the EXACT one.**

Both modules now import `CUFT_PER_BBL` from the new `lib/units/fieldUnits.js`.
The choice of value was not a preference. The barrel is exact by definition
(42 US gallons of 231 cubic inches, over 1728 cubic inches to the cubic foot)
and the truncated 5.614583 had no provenance beyond being a rounding of it.
**Decisively: both modules' own Python oracles already worked from the SI
barrel 0.158987294928 m3, which is the exact value to the last bit, so the
committed goldens had already ruled.** The engine moved ONTO its goldens, from
5.94e-8 to about 1e-16; no golden value moved. The two choke gates that crossed
the conversion passed at 1e-6, which is how a truncated constant hid in a
committed golden for a year; they are at 1e-12 now, and the FC2 oracle's
erosional-rate comparison went from 1e-6 to 1e-12 for the same reason.

**Consequences, quantified rather than waved at.** Nothing graded anywhere
moves: no NextGen capstone field in any course is an erosional rate. Three
pieces of LIVE prose in the shipped PD1 `nodal` course now quote a rate the
engine no longer returns, at the eighth significant figure: the lesson
`intermediate/m03-what-moves-the-curve/l02-tubing-size.md` (22365.2719 and
6330.9209 bbl/d), the lesson `intermediate/m02-the-j-shape/l05` (9620.5002,
12025.6252, 16835.8753 and 16500.5690 bbl/d), and the explanation of question
14 in the APPLIED migration `20260904_pd1_nodal_intermediate_deep.sql` (the
same three figures). **They are not repaired here**: the migration is applied
to production and cannot be edited, editing the two lessons without the bank
explanation would make the course inconsistent with itself, and the error is
one part in seventeen million in prose that carries no graded value. Recorded
for whoever next recuts that course. The `nodalLab.test.js` comment that
explained the 5.94e-8 gap has been rewritten, because vendoring this repair is
exactly what makes it false; its 155 tests still pass.

### F2, F3, F4, F5 — the rounded constants. **KEPT, and they are why the
tolerances are what they are.**
`CP_TO_LBM_FT_S` 6.7197e-4, `GC` 32.174 and the elevation coefficient 0.0375
are the published field forms, the goldens pin them, and every consumer of this
engine expects the field-unit answer. They account for the entire residual
against an SI oracle: 1.525e-6 on every Reynolds number, 1.509e-6 on every
fittings loss, and 1.1e-5 to 3.9e-5 on an inclined outlet solve, always in the
same direction and exactly zero on every flat case. **Causes, not tolerance
problems**, and the reason the inclined-line tolerances cannot be tighter than
about 1e-4.

## E. STRUCTURAL. WHAT WAS DELIBERATELY NOT REPAIRED, AND WHY

- **G1, the 60 percent discontinuity at Re 2100 and the `transitional` label.**
  No repair: there is no honest correlation in the band, and inventing one is
  the opposite of this programme's rules. It stays a HELD item and Section 15
  of the digest measures the step out of the engine.
- **G2, neither iteration reports convergence.** No repair. Both converge
  everywhere either oracle has looked, worst case 1.5e-13, so no wrong number
  follows; and adding a `converged` flag changes the return shape of two
  functions for no numeric gain. Recorded as a shape gap, not a defect.
- **G3, Colebrook past its published roughness.** No repair. Refusing above
  0.05 would refuse a legitimate typed roughness and delete the teaching case;
  only a negative relative roughness is refused.
- **G4, `FT_PER_MILE` declared and never used. RESOLVED AS A SIDE EFFECT.** The
  new gas elevation guard compares a rise against `lengthMi * FT_PER_MILE`, so
  the constant is live, and the digest now MEASURES it by finding where that
  refusal begins: 5280.000000000 ft accepted on a one-mile line, refused one
  representable value above.
- **G5, `liquidLineTraverse` has no `sumK`.** No repair: adding a parameter is
  a signature change with callers in two repositories, and the engine's own
  gate works around it. Recorded; the digest still prints the gap.
- **G6, `erosionalC` resolves an unknown id to the first row.** No repair, and
  this is the one I most considered taking. It is a genuine fail-open, but it
  belongs to `chokePerformance`'s RP 14E table, which PD1 `nodal` and the
  wellhead studio both read, so changing what an unknown service returns is a
  decision for that table and its consumers rather than for this line-sizing
  chain. Digest Section 16 teaches it as the one catalogue that answers under a
  label it was not asked for.
- **G7, `maopPsig` over-rates if the caller omits the allowance.** No repair.
  Both calls are legal and each is correct for what it was asked; the factor is
  the gross wall over the net. A guard cannot fix a question that was fully
  formed and simply wrong.

## S. THE SUITE LAYER

S1 to S4 are out of this wave's scope by instruction and belong to the Suite
repair. Nothing in this wave touched `src/utils/facilities/lineSizing.js`.
**One note for whoever takes them:** S1's `sizeSweep` gas branch calls
`gasOutletPressure` per bore, so its rows now carry the corrected outlet on
every inclined line, and on a descent `dpPsi` can be negative. A sweep that
sorts or ranks on `dpPsi` should be read again with that in mind.

## WHAT THIS WAVE FOUND THAT THE FOUNDATION PHASE DID NOT

1. **D1 fires on ascents as well as descents**, by 75 psi at 1e6 scfd on the
   findings' own line, through the NaN branch rather than the bracket's top.
   The finding said descents only.
2. **`liquidLineTraverse` had no inlet-pressure guard**, returning NaN stations
   with no error: an eleventh fail-silent.
3. **The brief's "33 line-hydraulics tests" is 15.** The line-hydraulics suite
   was 15 tests; 33 is that suite plus `production.choke.test.js`'s 18, which
   is the pair this repair touches. They are 46 now.
4. **`fiscalConventions.js` is NOT missing from the NextGen vendored tree**, as
   the brief had it; it is present but stale (it matches engines `ab93fdd9`).
   `irrContract.js` IS missing from NextGen. BOTH are missing from the Suite's
   vendored tree.

## WHAT THE COURSE PLAN NOW HAS TO ABSORB

Not repaired here because it is the lead's call, but the writers must not start
on it as it stands. **`structure.py` plans an Expert m04 titled "What It
Accepts and Should Not" whose five lessons are the defects this wave repaired**
(`l01 a refusal is not a NaN`, `l02 the inputs nobody guards`, `l03 a wall of
infinite thickness`, `l04 a sweep that comes back empty`, `l05 pressures below
the vacuum`). Four of those five now describe behaviour that no longer exists.
Digest Section 16 gives the module a real subject in its place: what a refusal
IS, the twenty-four messages, the boundary either side of every guard, and the
two things the engine still accepts and should not. **Professional m04's `l02
the bracket it searches` and `l04 downhill past the inlet` also change**: the
bracket is now correct and the descent is now computed, so the lesson is the
ceiling and why it is not the inlet, which Section 10 prints as a table.
`RECON.md` likewise still describes the engine at `709172f`.
