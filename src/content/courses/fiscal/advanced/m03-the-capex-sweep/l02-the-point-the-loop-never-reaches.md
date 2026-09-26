# The eighth point and the direct call

The capex sweep is labelled 0.8 to 1.5, and it returns a point at every label. The lesson is how to prove that from the numbers rather than from the axis.

{{panel:ec-comparison-explorer}}

## Eight points from a count of steps

The capex sweep reads a fixed list, `CAPEX_SWEEP_MULTIPLIERS`: eight multipliers, each written as 8 plus the step number over 10, so the labels are 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4 and 1.5 and the last one is exactly 1.5. The engine runs the whole comparison once per multiplier and reports each regime's contractor NPV at each, so the last swept point is the NPV at a 50 percent capex overrun. Because each multiplier is built from an integer step count, no rounding in a running sum can move the last one off 1.5 or drop it from the list.

## The endpoint, checked against a direct call

The golden publishes the last swept point beside the engine called directly at a multiplier of 1.5, on the default project:

| regime | x1.4 | x1.5 | x1.5, called directly | loss over the swept range, 0.8 to 1.5 |
| --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | 291.8238 | 255.8175 | 255.8175 | 243.6525 |
| Ghana - Deepwater | 107.3627 | 85.7833 | 85.7833 | 109.8425 |
| Brazil - Concession | 225.4505 | 203.9903 | 203.9903 | 100.7185 |
| USA - Gulf of Mexico | 228.4023 | 189.4674 | 189.4674 | 267.7301 |
| Angola - Deepwater PSC | 147.4539 | 124.9212 | 124.9212 | 88.6123 |
| Generic Royalty/Tax | 257.3831 | 221.3360 | 221.3360 | 244.0782 |

The two middle columns agree to the last digit on every regime. That agreement is the check, and it is stronger than a tolerance: it says the endpoint is reached exactly. The golden also pins the grid itself, `capexGrid`, so the count and the labels are held.

## What the eighth point carries

The resilience verdict prices the whole axis, a 20 percent underspend against a 50 percent overrun, so the loss it quotes for each regime is the first swept point minus the eighth. On the default project Angola - Deepwater PSC gives up the least at 88.6123 million USD and USA - Gulf of Mexico the most at 267.7301. The last step alone, 1.4 to 1.5, is a much smaller figure for every regime, and a reader who confuses the two quotes a number a fraction of the size the verdict means. Read the step you were asked for, then read the range.

## The mistake

The error is quoting a chart's axis instead of a chart's points. A reader who writes that a regime keeps a certain NPV at a 50 percent cost overrun has to check that a 50 percent point was computed rather than labelled. The habit is worth carrying to any tool: count the points a sweep returns, compare the count with the labels, and confirm the last point against a direct call at the same multiplier. When the two agree to the last printed digit the endpoint is real; when they do not, the sweep is answering a different question from the one on its axis, and no tolerance should be widened until the number looks right.

## What it refuses

The sweep refuses to be reconfigured. The range and the count are written into the engine, no input reaches either, and there is no point beyond 1.5 for a reader to click. The published capex cases run a different range again, nine multipliers from 0.7 to 1.5, on the Designer's sample PSC regime, whose values are illustrative samples, rather than on the six templates.

## Exercise

Count the points the capex sweep returns and name the list they are read from. Then give the loss over the swept range for Brazil - Concession, and say what pins its endpoint as reached exactly.
