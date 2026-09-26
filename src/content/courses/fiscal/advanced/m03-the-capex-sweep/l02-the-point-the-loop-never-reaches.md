# The point the loop never reaches

The axis promised a multiplier of 1.5 and the sweep stopped at 1.4. The eighth point is on the chart now, and how it went missing is the lesson.

{{panel:ec-comparison-explorer}}

## Eight points where the code once gave seven

The capex sweep runs an integer step count, `CAPEX_SWEEP_MULTIPLIERS`, eight multipliers each written as 8 plus the step number over 10, so the labels are 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4 and 1.5 and the last one is exactly 1.5. The loop it replaces started at 0.8 and added 0.1 in floating point. Adding a tenth repeatedly to a binary floating point number does not land on 1.5: the accumulated multiplier arrived at 1.5000000000000004, failed its own test that it be no greater than 1.5, and exited one iteration early. Seven points came back under an axis labelled to eight.

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

The two middle columns agree to the last digit on every regime. That agreement is the check, stronger than a tolerance: it says the endpoint is reached rather than approached. The golden also pins the grid itself, `capexGrid`, so the count and the labels cannot drift back.

## What the missing point was worth

While the loop stopped short, the resilience verdict priced a 20 percent underspend against a 40 percent overrun under a label that promised 50, so every resilience figure published with it was understated and the range the sentence described was not the range on the axis. The names it printed were right. On the default project Angola - Deepwater PSC gives up the least at 88.6123 million USD and USA - Gulf of Mexico the most at 267.7301, and the short sweep named the same pair. That is what made the defect easy to live with and easy to miss: the winner was unchanged, and only the quantity attached to the winner moved.

## The mistake

The error is quoting a chart's axis instead of a chart's points. A reader who writes that a regime keeps a certain NPV at a 50 percent cost overrun has to check that a 50 percent point was computed rather than labelled. The tell is general and worth carrying to any tool: when a chart's last tick label sits one step short of its axis maximum, an accumulating floating point loop is the first suspect. The fix is a count of steps rather than an accumulating sum, and it is never to widen the tolerance until the number looks right.

## What it refuses

The sweep still refuses to be reconfigured. The range and the count are written into the engine, no input reaches either, and there is no point beyond 1.5 for a reader to click. The published capex cases run a different range again, nine multipliers from 0.7 to 1.5, on the Designer's sample PSC regime, whose values are illustrative samples, rather than on the six templates.

## Exercise

State the multiplier the retired accumulation reached instead of 1.5 and why it ended the loop early. Then give the loss over the swept range for Brazil - Concession, and say what pins its endpoint as reached rather than approached.
