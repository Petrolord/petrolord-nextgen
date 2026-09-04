# What a diagnosis cannot tell you

The diagnostic returns a pump card. It does not return why the card has that shape, and it carries one input nobody measured.

{{panel:pd-balance-explorer}}

## It names no cause

Gas interference, a worn plunger, a stuck valve and a partly filled barrel all bend a pump card, and each is recognised by a person reading the shape. The engine names none of them. It returns a plunger stroke, a maximum pump load and a minimum pump load, and stops.

What the package does not model at all runs further: rod buckling and the compression a sinker bar would be sized for, tubing movement, fluid friction on the plunger, valve slippage as anything other than the efficiency a caller types, gas interference, deviated hole side loading, rod on tubing wear, and gearbox and belt and motor losses.

## It carries the damping ratio it was given

Damping is not measurable from a card. It is typed in. The engine refuses only the value 0, because with no damping the string never settles into a repeating stroke, and it says field strings sit between about 0.05 and 0.15 of critical. Read the same ODUMA-4 card back across that range and past it:

| Damping ratio | Plunger stroke, in | Max pump load, lb | Min pump load, lb |
| --- | --- | --- | --- |
| 0.0500 | 100.225350964 | 5968.449585 | -1487.766564 |
| 0.0800 | 99.520506122 | 5422.440570 | -859.728470 |
| 0.1000 | 99.051946680 | 5060.846861 | -474.905243 |
| 0.1200 | 98.826085067 | 4936.432692 | -207.880450 |
| 0.1500 | 98.823142707 | 5286.339486 | 28.644219 |
| 0.2000 | 98.910913848 | 5885.148136 | 40.250811 |

The plunger stroke read back moves 1.402208257 in across that contiguous sweep, on an input nobody measured.

## An answer can change sign on it

The minimum pump load is -1487.766564 lb at a damping ratio of 0.0500 and 40.250811 lb at 0.2000. Whether the plunger goes into compression is a question about the pump, and here it is settled by a number the analyst chose. Anyone quoting a minimum pump load owes the damping ratio beside it.

## And the card it reads was sampled by something else

The surface card handed to it is the decimated one, so a diagnosis is a reading of a reading. It can be no better than the card it was given, however many harmonics it is allowed.

## What it is still good for

It converts a surface measurement into a pump stroke without assuming a fluid load, which the prediction has to assume. On the published card a surface stroke of 64.000000 in gives 79.499400953 in at the plunger, and that is a number led by a measurement rather than by a convention.

## Exercise

Write the plunger stroke and the minimum pump load at damping ratios of 0.0500, 0.1000 and 0.2000.

Then list three things a dynamometer card can show that this diagnosis will not name, and say who names them.
