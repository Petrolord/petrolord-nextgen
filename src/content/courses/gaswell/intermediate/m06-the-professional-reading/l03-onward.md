# Onward

You can turn a well into a remedy. The next tier asks where the numbers in that remedy came from.

## What the Expert tier adds

**A correlation chosen once and used everywhere.** `recommendCorrelation` reads the wellhead pressure and the answer is then applied at every station, including the one that controls. Turner is Coleman times 1.200000000000, at every station on EBOCHA-5 without exception, so that single choice is worth twenty percent of every critical rate in the study. On that well the two correlations disagree about the verdict at 0.0, 1500.0, 3000.0 and 4500.0 ft.

**The candidate the sizing discarded.** The Coleman pick of 3.476 in reads 1.0022156322 under Coleman and 0.8351796935 under Turner, so the diameter that just clears under one correlation just fails under the other. The pick is a function of a decision made somewhere else and nothing in the returned object says so.

**A rounded constant.** The slug gradient is carried as 0.433 psi/ft per unit specific gravity against an exact 0.4335275040010, a fixed 0.1216771707 percent of whatever slug it sits on. On the published case that is 0.1076108162 psi.

**A requirement that moves the wrong way.** The gas a cycle needs is an expansion averaged at two ends, with nothing checking that the expansion runs the right way. Walk the OGUTA-2 casing from 900.0 psia down to 90.0 psia and the required gas-liquid ratio falls 70.545832 percent, all of it in the flattering direction, on a well that ends the walk unable to move the plunger at all.

**Everything the screen never checks.** OGUTA-2 carries 14.83375148 bbl/d against a well making 194.91525424 bbl/d, and `feasible` never looks.

## Before you go

**Carry the station with every number.** A ratio, a critical rate, a correlation name and a tubing size all belong to one depth, and none of them says which. That habit is what makes the next tier's findings visible rather than surprising.

**Everything from this tier stays in force.** The traverse is still handed in and not solved. The controlling station is still the deepest one that fails. The plunger balance is still static, and its timings are still inputs.

## The one sentence

This tier taught you which station to stand at. The next one asks who chose the constants you read there, and shows you the three places where the answer was decided before you arrived.

## Exercise

Write the five Expert subjects in order and beside each the number that makes it real.

Then say which of them could change a workover recommendation without changing a single measurement on the well.
