# Dome, bellows and port

One force balance at the instant the stem lifts off the seat produces every number on a valve sheet.

{{panel:pd-valve-explorer}}

## The balance

Nitrogen in the dome pushes on the whole bellows area. Against it, one fluid pushes on the bellows area less the port area and the other pushes on the port area. For an injection pressure operated valve the casing gets the large area and the tubing gets the port; for a production pressure operated valve the two roles swap. That is the only difference between the families, and it is why one pair of helpers covers both.

Closing is simpler than opening: the valve shuts when the pressure acting on the full bellows area falls back to the dome pressure, so the closing pressure at depth is the dome pressure at valve temperature.

## Two published valves

| Quantity | westTexasOil valve 1 | deepHighPressure valve 1 |
| --- | --- | --- |
| Depth, ft | 2119.249994721 | 2606.192995401 |
| Bellows, in2 | 0.77 | 0.31 |
| Port, in | 0.25 | 0.125 |
| R | 0.063749851 | 0.039586601 |
| Injection at depth, psia | 1068.362497529 | 1517.796497793 |
| Production at depth, psia | 326.624999472 | 527.443159448 |
| Dome at valve temperature, psia | 1021.076842603 | 1478.591775361 |

Both are IPO valves, so both domes sit just below the injection pressure at depth. The gap is not arbitrary: it is the port area's share of the difference between the two fluids, so it grows with R and with how far apart the casing and the tubing are at that depth. Neither valve's dome is a round number, and neither could be chosen without knowing where the valve sits.

## The mistake

Treating the dome charge as a spring rating that belongs to the valve, the way a relief valve setting belongs to a relief valve. It belongs to a depth, a stage pressure and a temperature. westTexasOil valve 1 wants 1021.076842603 psia and valve 5, the same hardware with the same 0.25 in port and the same R of 0.063749851, wants 1042.530383853 psia at 6530.440469862 ft. Order the second valve with the first valve's charge and it is not a slightly wrong valve, it is a valve that opens at the wrong stage.

## What it refuses

The balance is static. There is no friction, no velocity and no injection rate in the annulus, so the casing pressure it balances against is a shut in gas column and not a flowing one. It also treats the stem as either seated or lifted: the module has no model of a valve part way open, which is why every throughput it reports is an upper bound rather than a prediction.

## Exercise

Read R, the injection pressure at depth, the production pressure at depth and the dome at valve temperature for westTexasOil valves 1 and 5 in the panel.

Then say which two of those four numbers changed because the valve moved and which changed because the stage pressure fell.
