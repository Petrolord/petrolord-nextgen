# The story so far

Every number this tier examined came out of one solved card. The tier is about the distance between that card and the report of it.

## Two samplings of one march

At the shipped defaults the ODUMA-4 march runs 6110 steps in a cycle and keeps 186 of them, 3.044190 percent, into the card the loads are read off. The tension envelope is accumulated over all 6110 steps at all 120 interior nodes, and both live in one return object. The envelope implies a peak polished rod load of 19851.465785541 lb where `prlPeakLb` reports 19545.877783339 lb, a disagreement of 1.563440 percent inside one call. The Goodman check reads the first and the structural rating reads the second.

## What converges and what does not

Take the ODUMA-4 node count from 60 to 1920 and the plunger stroke moves 0.044644 percent while the peak load moves 1.683064 percent and the minimum load moves 10.864298 percent of the smallest. Every quantity proportional to the plunger stroke survives the grid, and the two load extremes do not. The `notPeriodic` flag is not monotone either: at 11 spm and a damping ratio of 0.05 it reads false, false, false, true, false, true down those six node counts.

## A dip smaller than the noise

Sweeping the speed, the loading dips at 10.6 spm: three contiguous rows of 89.649462, 88.179235 and 97.785820 percent, a dip 1.470226 percentage points deep. Changing only the node count moves the same number 4.283675 percentage points at 10.4 spm and 6.553883 percentage points at 10.8 spm. The dip is 0.343216 times the first spread and 0.224329 times the second. It is not an optimum. It is the solver.

## The balance, and inputs that go nowhere

Balanced off the default 186 point card the peak gearbox torque is 450016.096192 in-lb; off the full 6110 point march card it is 461403.140996 in-lb, 2.467917 percent higher, so the reported value reads low. And the design function accepts a structural unbalance, a crank offset and a kinematics object and reads none of them: ten outputs come back strictly equal whether they are passed or not.

## Conventions, measurements, artefacts

The service factor is a convention, and on ODUMA-4 it decides the verdict at 0.828733084, where a loading of 100.000000000 percent has nothing to do with the steel. The 0.85 fillage threshold is a convention. The subsample and the node count are artefacts. The plunger stroke, which converges, and a diagnosed stroke of 98.826085067 in against the march's 98.526653100 in, are as close to measurements as this engine gets.

Sorting a design sheet into those three piles is what the tier was for.

## Exercise

Name the three numbers in a rod pump design you would call artefacts of sampling, with the figure that shows each one moving.

Then name one convention and one quantity that survives the grid, and say how you would defend each on a design sheet.
