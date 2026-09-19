# Conservative by construction

{{panel:ss-intervals-explorer}}

The 95 percent Garwood interval is supposed to cover the true mean at least 95 times in a hundred. The digest checks that claim through the engine at seven true means:

| true mean | coverage | total probability summed |
| --- | --- | --- |
| 0.500000 | 0.985612 | 1.000000 |
| 1.000000 | 0.981012 | 1.000000 |
| 2.000000 | 0.983436 | 1.000000 |
| 3.500000 | 0.990126 | 1.000000 |
| 5.000000 | 0.979567 | 1.000000 |
| 10.000000 | 0.975386 | 1.000000 |
| 20.000000 | 0.956795 | 1.000000 |

Every coverage in the table is at or above 0.95. None falls short.

## How the coverage is measured

Pick a true mean, mu. The probability of observing k events is Q(k + 1, mu) minus Q(k, mu), using the engine's own `regularizedGammaQ`, with Q(0, mu) taken as 0. For each k, ask whether the engine's interval for k covers mu, which means countLower(k) is at or below mu and countUpper(k) is at or above it. Add up the probabilities of every k whose interval covers mu, and that sum is the coverage. The last column shows that the probabilities summed come to 1.000000 at every mean, so no part of the distribution was left out of the check.

This is a measurement of the interval the engine returns. It asks the plain question of any interval: if the true rate were this, how often would the reported interval contain it?

## Why it cannot be exactly 95

A count is a whole number. At any true mean there is a finite list of counts the site could record, and each one either has an interval that covers the mean or does not. The coverage is a sum over that list, so it moves in steps as the mean changes. No interval built from a whole number count can land on exactly 95 percent at every mean. Something has to give.

## What the Garwood construction chooses

The exact interval is built so that the coverage never falls short. Wherever the steps land, they land at or above 0.95. At a true mean of 3.500000 the coverage is 0.990126. At 20.000000 it is 0.956795. The figure above 0.95 in each row is the price of that guarantee, and it is paid in width: a limit that covers more often than asked is a limit set further out than a perfectly tuned one would be.

That is what conservative means here. A reader who takes the engine's 95 percent interval gets at least what the label promises, and often a good deal more.

## What conservative does not mean

An interval that sometimes covered less than 95 percent would sometimes overstate how sure a rate is, and in safety work that is the costly error. Over-coverage makes a sparse count look a little less certain than a perfectly tuned method would. Under-coverage would make it look more certain than it is. The engine takes the first risk to avoid the second.

## Where the price is highest

In this table the excess over 0.95 is largest at a true mean of 3.500000, stays large at every mean up to 10.000000, and is smallest at 20.000000. Small counts are where the steps are coarse, so small counts are where the guarantee costs the most width. Those are also the counts most sites have.

## Exercise

For each true mean in the table, subtract 0.95 from the coverage. State which mean pays the largest excess and which pays the smallest. Then explain, in two sentences, why the excess at a mean of 20.000000 is smaller than the excess at 3.500000.
