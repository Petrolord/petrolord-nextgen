# The point the loop never reaches

The axis promises a multiplier of 1.5 and the sweep stops at 1.4, for a reason that has nothing to do with fiscal terms.

{{panel:ec-comparison-explorer}}

## Seven points where the code says eight

The capex sweep is written as a loop from a multiplier of 0.8 to 1.5 in steps of 0.1, and its axis is labelled 0.8 to 1.5. Adding 0.1 repeatedly to a binary floating point number does not land on 1.5. The accumulated multiplier arrives at 1.5000000000000004, which fails the test that it be less than or equal to 1.5, so the loop exits one iteration early. The engine returns seven labels: 0.8, 0.9, 1.0, 1.1, 1.2, 1.3 and 1.4.

The eighth point is not missing because it is unreachable. Calling the engine directly at a multiplier of 1.5 returns a perfectly ordinary answer, and the golden publishes both:

| regime | x1.4 | x1.5, called directly | loss over the seven swept points | loss over eight points, 0.8 to 1.5 |
| --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | 79.1811 | 58.5739 | 97.7613 | 118.3685 |
| Ghana - Deepwater | 107.3627 | 85.7833 | 88.2631 | 109.8425 |
| Brazil - Concession | 260.5129 | 228.3016 | 108.6653 | 140.8766 |
| USA - Gulf of Mexico | 228.4023 | 189.4674 | 228.7953 | 267.7301 |
| Angola - Deepwater PSC | 147.4539 | 124.9212 | 84.8591 | 107.3918 |
| Generic Royalty/Tax | 257.3831 | 221.3360 | 208.0310 | 244.0782 |

## What the missing point is worth

For Generic Royalty/Tax the sweep reports a loss of 208.0310 million USD across the range the axis claims, and the range the axis claims is worth 244.0782. For USA - Gulf of Mexico the two numbers are 228.7953 and 267.7301. Nigeria - PIA (2021) still returns 58.5739 million USD of contractor NPV at the multiplier nobody swept, against 79.1811 at the last one that was.

The ranking, on this project, survives: Angola - Deepwater PSC gives up the least on seven points at 84.8591 and on eight at 107.3918, and USA - Gulf of Mexico gives up the most in both. So the verdict names the same regime either way. That is worth stating plainly, because it is what makes the defect easy to live with and easy to miss. The winner is unchanged. The quantity attached to the winner is understated, and the range it describes is not the range on the label.

## The mistake

The error is quoting the chart's axis instead of the chart's points. A reader who writes that a regime keeps a certain NPV at a 50 percent cost overrun has read the axis maximum and taken the last plotted value, which is a 40 percent overrun. The verdict sentence carries the same error into words, because it prices the overrun the sweep reached rather than the one the label advertises. The tell is general and worth carrying to any tool: when a chart's last tick label sits one step short of its axis maximum, an accumulating floating point loop is the first suspect. The fix is a count of steps rather than an accumulating sum, and it is never to widen the tolerance until the number looks right.

## What is pinned, and what it refuses

The golden records the seven engine points and the seven engine losses beside the oracle's eight point sweep, so both are held and a silent change to either is caught rather than absorbed. The sweep itself refuses to be reconfigured: the range and the step are written into the loop, there is no input for either, and there is no point beyond 1.4 for any reader to click.

## Exercise

State the multiplier the accumulation reaches instead of 1.5 and why it ends the loop early. Then give both losses for Brazil - Concession and say which one the chart's axis describes.
