# Gas has weight

Injection gas is not a pressure applied at the wellhead. It is a column, and by the time it reaches a valve it is worth more than it was at surface.

{{panel:pd-column-explorer}}

## What a gas column weighs, as a gradient

The static gas gradient is density over 144, and the published gas property cases show how far that number travels.

| Gas gravity | Pressure, psia | Temperature, degF | z | Gradient, psi/ft |
| --- | --- | --- | --- | --- |
| 0.6 | 100.0 | 80.0 | 0.986397962 | 0.002112418 |
| 0.65 | 500.0 | 100.0 | 0.932572676 | 0.011670185 |
| 0.65 | 1500.0 | 180.0 | 0.896752731 | 0.031855542 |
| 0.7 | 2500.0 | 220.0 | 0.894419892 | 0.053952003 |
| 0.8 | 3500.0 | 250.0 | 0.916168222 | 0.080711504 |

From 0.002112418 to 0.080711504 psi/ft across five ordinary injection gases. Any sentence that begins "the gas gradient is" and ends in a single number has already lost most of the range. Density rises with pressure and falls with temperature, so the gradient belongs to a place in a well rather than to a gas: the same 0.65 gravity gas reads 0.011670185 psi/ft at 500.0 psia and 100.0 degF and 0.031855542 psi/ft at 1500.0 psia and 180.0 degF.

## What it adds up to over a well

Three published columns, each marched from its surface injection pressure to its packer.

| Column | Surface, psia | Depth, ft | Total lift, psi | Average gradient, psi/ft |
| --- | --- | --- | --- | --- |
| 1 | 1014.7 | 8000 | 201.016705 | 0.025127088 |
| 2 | 1414.7 | 11000 | 426.539804 | 0.038776346 |
| 3 | 614.7 | 4000 | 53.897603 | 0.013474401 |

## The mistake

Using the surface injection pressure as the pressure at the valve. Column 2 is the injection column of a design that spends its surface pressure 40.00 psi at a time, and treating the gas as weightless throws away 426.539804 psi of it in one line. It always errs the same way, in the direction of a shallower and more pessimistic string, so it never announces itself as a blunder. It simply produces a design that stops higher than it needed to.

## What the gradient refuses to tell you

It is a static gradient. It carries no friction, no velocity and no injection gas rate, so it is the weight of a standing column and nothing about a flowing one. It also says nothing about whether the gradient at the top of a well and the gradient at the bottom are the same number, which they are not.

## Exercise

Read the gradient for each of the five published gas property cases and write the largest and the smallest.

Then take column 3, with 53.897603 psi of lift over 4000 ft, and column 2, with 426.539804 psi over 11000 ft, and say in one sentence which input separates them most.
