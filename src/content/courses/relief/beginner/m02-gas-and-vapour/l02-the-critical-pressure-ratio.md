# The critical pressure ratio

{{panel:fc-sizing-explorer}}

The critical pressure ratio is the single number that decides which of the two gas equations runs. Like the coefficient C beside it, it is a function of the isentropic exponent alone, and the engine computes it on every call.

## The ratio across the range

| k (stated) | critical pressure ratio |
| --- | --- |
| 1.050000 | 0.595386 |
| 1.100000 | 0.584679 |
| 1.200000 | 0.564474 |
| 1.300000 | 0.545728 |
| 1.400000 | 0.528282 |
| 1.500000 | 0.512000 |
| 1.600000 | 0.496765 |
| 1.800000 | 0.469042 |

The direction runs the opposite way to C. A larger exponent gives a smaller critical pressure ratio, so a stiffer gas stays choked down to a lower outlet pressure. As always, read the direction and do not form a quotient of two rows, because the course prints no ratio between them.

## How the decision is actually made

The engine takes the back pressure at the relief valve outlet as a fraction of the relieving pressure and compares that fraction with the critical ratio. At or below the critical ratio the flow through the valve is choked and the critical equation runs. Above it the flow is subcritical and the other equation runs.

ORUBIRI states an isentropic exponent of 1.270000, and at that exponent the engine returns a critical ratio of 0.551208. Its back pressure ratio, worked out in the opening module, is 0.104258. That sits well below the critical ratio, and the engine reports the branch as critical. Nothing was assumed there: the label on the row is asserted against what the call actually did, so a row calling itself critical came from a call the engine reported as critical.

## A name that collides

Bare critical flow is a phrase with another owner. Critical flow through an injection port is taught in the gas lift course, and a critical flowing pressure means something different again in sand management. So this course writes either choked or critical flow through the valve, and never the bare phrase.

The gas lift treatment is worth reading beside this one, because it answers a different question with the same physics. There the quantity of interest is a throughput through a port of known size. Here the port size is the unknown and the throughput is given, so what comes back is an area. The two are the same nozzle relation rearranged, and knowing which unknown you are solving for is most of the skill. API 520 also brings its own coefficient C and its own back pressure factor, neither of which appears in the gas lift form.

## What checks the ratio

The oracle does not restate the closed form. It takes the argmax of the isentropic nozzle mass flux over the throat pressure ratio by golden section search, which recovers the same ratio from a completely different construction. The critical ratio is the ratio at which the flux through the throat is greatest, and searching for that maximum numerically is a real check on the formula rather than a repetition of it.

## Exercise

Write down the critical ratio at the two extremes of the table and say which gas stays choked to a lower outlet pressure. Then take the ORUBIRI ratio of 0.104258 against its critical ratio of 0.551208 and state which branch runs and why.
