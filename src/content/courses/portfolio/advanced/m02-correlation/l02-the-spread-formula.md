# The spread formula

The stdDev on the risk summary is a closed form. It adds the funded projects' variances and then adds rho times every cross term, so the spread widens as rho rises and reaches the plain sum of the standard deviations at rho 1.

{{panel:ec-governance-explorer}}

## The formula

stdDev = sqrt(sum var + rho x ((sum sd)^2 - sum var)). Each sd is a project's mixture sd, the square root of its success and failure variance taken together. The bracket (sum sd)^2 - sum var is exactly the sum of sd_i x sd_j over every ordered pair of different projects, so rho multiplies all the cross terms at once.

OKONO's 600.0000 set, OK-1 + OK-2 + OK-4 + OK-5, has mixture sds of 44.3821, 60.6850, 121.9467 and 12.8750. The sum of their variances is 20689.2080, and the square of their summed sds is 57546.6428.

| rho | stdDev | independentStdDev |
| --- | --- | --- |
| 0.000000 | 143.8374 | 143.8374 |
| 0.300000 | 178.1753 | 143.8374 |
| 0.600000 | 206.8905 | 143.8374 |
| 0.900000 | 232.0795 | 143.8374 |
| 1.000000 | 239.8888 | 143.8374 |

## The two ends by hand

At rho 0 the cross terms vanish and stdDev is sqrt(20689.2080) = 143.8374, the independent spread. At rho 1 the variances cancel inside the bracket and stdDev is sqrt(57546.6428) = 239.8888, which is 44.3821 + 60.6850 + 121.9467 + 12.8750 = 239.8888. Perfectly correlated standard deviations add like money; independent ones add like the sides of a right triangle.

In between, at rho 0.300000, the engine adds 0.300000 times the gap between 57546.6428 and 20689.2080 to 20689.2080 and takes the root: 178.1753.

## The shape of the rise

The variance rises in a straight line with rho, and its square root does not. The first step, from 0.000000 to 0.300000, lifts stdDev from 143.8374 to 178.1753; the step of the same size from 0.600000 to 0.900000 lifts it only from 206.8905 to 232.0795. The bracket can never be negative, so a positive rho can only widen the spread. The published pair case shows the same pattern at a smaller scale: stdDev 60.9438 at correlation 0.000000, 74.4364 at 0.500000 and 85.8336 at 1.000000.

independentStdDev stays at 143.8374 on every row. The engine reports it so the cost of the assumption is visible.

## The mistake

The common slip is feeding the formula the wrong sd. OK-4's success spread is 78.0305, but its mixture sd is 121.9467, because the mixture also carries the gap between a success centred on 210.0000 and a failure costing 40.0000. Success spreads leave out the failure lump and understate stdDev at every rho. The other slip is picking an end by habit: adding the sds assumes rho 1, and adding the variances assumes rho 0.

## What it refuses

This stdDev applies rho to the mixture outcomes. The simulation applies rho to the latent drivers, and the correlation that implies between outcomes is lower than rho, so between 0 and 1 the spread of the simulated values is not this stdDev. P(loss), P90 and P10 come from the simulation; stdDev does not.

## Exercise

For OKONO's 600.0000 set, show stdDev at rho 0 and at rho 1 from the sum of variances and the square of the summed sds, and check the rho 1 figure against the four mixture sds added. Then say why using OK-4's success spread in place of its mixture sd would understate the spread.
