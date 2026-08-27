# Gravity-stable screening

Push the rate low enough on an updip flood and the arithmetic of the dip term does something qualitatively new: the corrected numerator $1 - G k_{ro}$ goes negative where the oil curve is strong, the engine clamps the result to zero, and over part of the saturation range water simply does not flow. The model is telling you the displacement has left the viscous regime altogether. This lesson is about what that signal means, when it appears, and how far to trust it.

## Where the clamp lives

The engine computes the corrected fractional flow and clamps it to the physical interval: a strong gravity assist can drive raw $f_w$ negative, and negative water flow in a one dimensional displacement model is meaningless, so the code floors it at zero. When any sampled point of the curve above connate sits at exactly zero, the analysis attaches a warning with this exact text:

"Gravity assist is strong enough to hold fw at zero over part of the saturation range (gravity-stable displacement)."

The clamp condition is readable straight off the formula. Water stops flowing where $G k_{ro}(S_w) \ge 1$. The oil curve is strongest just above connate water, where $k_{ro}$ approaches its endpoint 0.9, so the zero region always opens at the low saturation toe and grows upward as $G$ grows.

## Finding the threshold on the designed case

On the designed geometry $G$ scales with rate as pure arithmetic: at qt 2000 it is 0.019367108489507776, so at any rate it is that value times 2000 over qt. The clamp needs $G$ of order one, which is fifty times the designed value, which means rates around fifty times lower. Run the engine down the ladder and watch:

| qt (rb/d) | G | warning issued | Swf | EDbt |
| --- | --- | --- | --- | --- |
| 50 | 0.774684339580311 | no | 0.6564000000000001 | 0.5336418897834565 |
| 35 | 1.1066919136861587 | no | 0.6639999999999999 | 0.542119740228474 |
| 30 | 1.2911405659671851 | yes | 0.6679999999999999 | 0.5463129226348631 |

Two things deserve attention. First, the warning does not fire the moment $G$ passes 1. The curve is sampled at 102 points, the first sample above connate sits at Sw 0.35396039603960394 where $k_{ro}$ is 0.8822664444662288, and the clamp must reach that sampled point: the threshold is $G \ge 1/0.8822664444662288 = 1.1334444444444445$, which the designed geometry crosses at a rate of about 34 rb/d. At qt 35 the flood is a whisker below the line and stays silent; at 30 it speaks. A warning built on sampled curves inherits the sampling, and a case sitting just under a threshold is not certified stable by the silence.

Second, look at what the efficiencies are doing as the rate collapses: EDbt at qt 30 is 0.5463129226348631, a genuine seven saturation points above the field-rate flood. The physics being gestured at is real. Gravity-stable displacement, most familiar from crestal gas injection and steeply dipping waterfloods, is among the most efficient recovery processes known, precisely because the front is stabilized by density rather than sharpened by viscosity.

## What the warning is, and is not

It is a screening flag. It says: in this one dimensional, two phase, sharp interface world, your inputs have crossed into a regime where gravity dominates the flux. That is worth knowing, and it is the honest limit of what it says. Behind the warning there is no segregated flow model, no Dietz stability analysis, no tongue or underrun geometry, no vertical equilibrium calculation, no critical rate correlation. The thin-real lock that keeps this engine trustworthy inside its domain also means the regime beyond the warning is described, not modelled. A rate of 30 rb/d through a 20000 square foot face is also, on its face, not an operating point anyone would run; the screening value is in the direction of the boundary, not in planning to live beyond it.

If a real prospect screens gravity-stable, the next tool is not this engine at a lower rate; it is a proper displacement study with vertical resolution. Report the finding as "the screening model exits its viscous regime near 34 rb/d for this geometry" and hand it on.

## The misconception: reading a clamp as a prediction

The zero region of the clamped curve is not a forecast that water will never be produced below some saturation. It is the model refusing to transport water against the combined gradient, within assumptions that have already expired at that operating point. Treating clamped output as quantitative prediction is the same category of error as reading the Associate tier's 3837 pore volume tail as a plan: the number is a boundary marker, not a schedule.

## Exercise

First, using the 1/qt scaling from the designed value at 2000 rb/d, verify the G column of the table above at qt 50 and qt 30, and confirm the threshold rate implied by $G = 1.1334444444444445$ lands between 35 and 30.

Second, in two sentences, explain why the warning threshold depends on the curve sampling density, and what would happen to the qt 35 row if the engine sampled the curve ten times more finely near connate water.
