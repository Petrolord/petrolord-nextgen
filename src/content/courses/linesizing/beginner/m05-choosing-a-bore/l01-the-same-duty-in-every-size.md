# The same duty in every size

Put one duty through every bore the schedule carries and the sizing question answers itself. The OGBIA crude runs from 38.027872 ft/s in the smallest bore to 0.635441 ft/s in the largest.

{{panel:fc-liquid-explorer}}

## Twelve bores, one duty

| nominal | schedule | bore in | velocity ft/s | total psi | ratio | inside the limit |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | 40 | 2.067000 | 33.463911 | 20803.315944 | 2.470444 | false |
| 2 | 80 | 1.939000 | 38.027872 | 28841.350797 | 2.807374 | false |
| 3 | 40 | 3.068000 | 15.189621 | 2820.384450 | 1.121360 | false |
| 4 | 40 | 4.026000 | 8.820843 | 728.175700 | 0.651191 | true |
| 4 | 80 | 3.826000 | 9.767147 | 937.455844 | 0.721051 | true |
| 6 | 40 | 6.065000 | 3.886834 | 97.306913 | 0.286942 | true |
| 6 | 80 | 5.761000 | 4.307863 | 125.058374 | 0.318024 | true |
| 8 | 40 | 7.981000 | 2.244621 | 25.660631 | 0.165707 | true |
| 8 | 80 | 7.625000 | 2.459110 | 32.002404 | 0.181542 | true |
| 10 | 40 | 10.020000 | 1.424040 | 8.561327 | 0.105128 | true |
| 12 | 40 | 11.938000 | 1.003216 | 3.689918 | 0.074062 | true |
| 16 | 40 | 15.000000 | 0.635441 | 1.236026 | 0.046911 | true |

## What the sweep holds still

Every row carries the same 12000.000000 bpd of the same crude at the same viscosity over the same 26400.000000 ft of the same roughness. The bore is the only thing that moves, so every difference down the table is the bore's doing.

That is what makes the sweep readable. A designer looking at 20803.315944 psi against 1.236026 psi is looking at one decision rather than at several tangled together.

## The pressure drop collapses and the velocity with it

Both columns fall steeply as the bore opens, and they fall together, because the velocity is what the friction is working on. The extremes of the sweep stand at 28841.350797 psi in the smallest bore and 1.236026 psi in the largest, which is the ordinary behaviour of pipe: a small increase in bore buys a large reduction in cost.

## Where the sweep stops being useful

At the wide end the returns are already small in absolute terms. Moving from 8.561327 psi to 3.689918 psi to 1.236026 psi saves real pressure, and each step is a heavier, more expensive pipe buying less than the step before it. Nothing in this table prices that, so the sweep narrows the field rather than choosing from it.

## Nine rows pass the erosional check

The last column is a boolean and it reads true on nine of the twelve rows. The three that fail are the smallest bores, at ratios of 2.470444, 2.807374 and 1.121360, and no pressure budget rescues them.

## What the ratio column is

The ratio is the row's velocity divided by the erosional ceiling of 13.545709 ft/s, which is the same on every row because it depends on the density and the c factor rather than on the bore. So the ratio column is the velocity column rescaled, and it is the form in which a velocity becomes a verdict.

Reading the two together is the habit worth building. The velocity says how fast, the ratio says how close to the limit, and the boolean says which side of it the row is on.

## The mistake

Reading the sweep as a recommendation. It is twelve answers to one question, and the question it answered was what each bore costs. Which of them to build needs the erosional verdict, a view on velocity, and a price the table does not carry.

## Exercise

Name everything the sweep holds fixed across its twelve rows. Then give the velocity and the total pressure at the smallest and the largest bore, and say what the sweep cannot decide on its own.
