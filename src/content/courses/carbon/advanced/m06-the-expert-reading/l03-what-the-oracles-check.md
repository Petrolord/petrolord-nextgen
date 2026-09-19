# What the oracles check

A figure is trusted as far as something independent has checked it. SECTION 26 names two oracles in the engines repository that recompute these modules by other routes, and lists the outputs that neither recomputes. This lesson reads that list, because it decides which Expert figures are graded and which are taught as printed.

## The two oracles

Both live in tools/validation/downstream, and their goldens are asserted by the engine test suites.

| oracle | what it computes, and by which route |
| --- | --- |
| oracle_carbonabatement.py | combustion by MASS in exact rationals (kg of carbon times the CO2/C and CH4/C mass ratios, molar masses built from atomic weights); the inventory as a ledger; the cost per tonne LEVELISED from a year-by-year present value ledger where the engine uses a capital recovery factor; the curve by explicit rank; the path as a year ledger |
| oracle_energyefficiency.py | combustion as a species ledger whose mass balance must close; excess air by BISECTION where the engine solves a closed form; efficiency as a loss ledger; the tuning saving as a duty ledger (duty_ledger, exported since MD45-1); the steam trap as an ISENTROPIC NOZZLE with its throat at the larger of the downstream and critical pressures, where the engine uses the choked and subsonic flux formulas; the pinch by the LARGEST HEAT DEFICIT with no cascade; a levelised cost per tonne |

## Another route, the same answer

Each oracle reaches its answer by a route the engine does not take. The engine annualises capital with a capital recovery factor; the carbonAbatement oracle levels the cost per tonne from a year-by-year present value ledger. The oracle builds the curve by explicit rank and keeps the path as a year ledger. The energyEfficiency oracle solves excess air by bisection where the engine solves a closed form, and models the trap as a nozzle with its throat at the larger of the downstream and critical pressures. In practice, two routes that agree on a figure make it unlikely that the figure is an artefact of either one.

For this tier, that covers the costs per tonne of module one, the curve's order and steps in module two, the path of module four, and the levelised cost per tonne of a saving in module five.

## What neither oracle recomputes

SECTION 26: "Not recomputed by either oracle: carbonIntensity, the curve's residual to target and paysForItselfTonnes, compositeCurve and the simple payback. They are taught from the engine and never graded."

Three of those are in this tier. The curve's residual to target prints on each SECTION 21 curve beside the verdict. paysForItselfTonnes prints as 5310.000 t. The simple payback prints as 2.372881 years. Each is the engine's figure, taught as printed. None carries a second route behind it, and none is graded.

## The digest's own count

SECTION 26 closes with a count: this digest has 73 engine answers asserted and 60 refusals asserted before printing. The count is the generator's own: engine answers and refusals it checked before the digest was printed.

## Why the residual is not leaned on

The residual to target sits beside the target verdict on every SECTION 21 curve, and every one of those verdicts is none: each curve carries a claim the engine could not check against its source, or a claim above what its source emits. The residual is not recomputed by an oracle either. So this tier quotes the target, 16830.083 tCO2e, and the curve's total, and reads the programme's shortfall from the path, whose year ledger the oracle does recompute: finalGapTonnes 1370.083 in SECTION 22.

## Reading a figure with its status

Three statuses run through this tier. An engine output an oracle recomputes is checked by a second route. An engine output no oracle recomputes is taught as printed. A figure marked computed here is the digest's own arithmetic on engine figures: the capital against one year, the plain mean, the one-year cost of a saving. The last kind is printed for contrast and is never an engine output.

## Exercise

Read SECTION 26's list of outputs neither oracle recomputes, paysForItselfTonnes on the Agbor curve, and the cost per tonne of Tune the fired heaters. Say what the list shows about the status of each figure, and which of the two is recomputed by a second route.
