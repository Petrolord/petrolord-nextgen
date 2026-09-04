# What the column cannot tell you

A converged answer is converged about the model it was handed. On this column the numerical error is measured in thousandths of a psi and the modelling error available is measured in hundreds.

{{panel:pd-column-explorer}}

## The two errors side by side

| Source | Size |
| --- | --- |
| 20 step march against 2000, column 1 | 5.0036e-4 psi |
| 20 step march against 2000, deepHighPressure at its packer | 3.5210e-3 psi |
| 20 step error as a fraction of the lift, deepHighPressure at its packer | 8.6391e-6 |
| flat 0.02 psi/ft rule at 11000 ft on column 2 | -206.539805 psi |
| flat 0.02 psi/ft rule at 4000 ft on column 3 | 26.102397 psi |

Choosing the wrong gradient model costs orders of magnitude more than choosing the wrong step count, and no amount of refinement reaches the bottom rows of that table.

## What the module declines to model

The inflow. There is no IPR anywhere in it, so nothing here says what the reservoir gives.

Multiphase outflow. The flowing production traverse is passed in as a depth and pressure table, so a caller can build it from a validated nodal model rather than have this module invent a gradient.

The unloading and transfer lines, which are straight lines on constant gradients. A real unloading column is neither straight nor constant. The engine does not pretend otherwise, it declares the gradient as an input.

Intermittent lift. Everything here is continuous lift.

## The static column

There is no friction, no velocity and no injection rate in the annulus at all, so the casing pressure the march produces is a shut-in gas column and not a flowing one. That single sentence covers more ground than the step count ever will: it says the 1215.716705320 psia at the bottom of column 1 is what the annulus reads standing still.

## The mistake

Quoting the precision of the march as the accuracy of the design. A spacing answer good to 0.01 ft on a static column with a declared kill fluid gradient of 0.45 psi/ft is exactly as good as that 0.45. Decimal places on a number whose first input was asserted are not accuracy, they are a formatting choice.

## What the column does tell you

At the resolution it runs, the annular pressure at any depth on the declared model, in both directions, with a round trip that closes to -1.930e-10 psi. That is a real capability, and it is the ruler the whole design is laid out against.

## Exercise

Write the largest numerical error the march contributes at 20 steps and the largest error the flat rule of thumb contributes at a packer.

Then name one input to the column that neither of those two numbers can check.
