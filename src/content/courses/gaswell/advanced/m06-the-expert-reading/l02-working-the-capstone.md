# Working the capstone

There is a right order for this work. Most of what goes wrong in a deliquification study comes from doing the steps in the wrong one.

{{panel:pd-remedy-explorer}}

## Fix the station before anything else

Write down the depth of every pressure you are about to use, because no function downstream will do it for you. `sizeTubingForRate` records the correlation on every row and the depth on none. `recommendCorrelation` takes one pressure and cannot see which station it came from. The controlling point on a profile already carries pPsia, tempR, z, idIn and depthFt together, so keeping them together costs nothing and losing them costs a tubing size.

## Choose the correlation, and record the choice

The switch is strict at 1000.00 psia: below it coleman, at it and above it turner. Take the returned correlation field rather than the sentence, because the sentence rounds. At 999.96 psia the reason prints the pressure as 1000.0 and the limit is also 1000.0, while the branch still returns coleman, and one decimal narrows that collision rather than closing it. Then say in your own report which correlation you used and at which pressure you chose it.

## Walk the profile, do not point check

Report the controlling station and its margin, not the gauge. A ratio at one station is a verdict about that station only, and the deepest station carries the highest critical rate on a normal traverse.

## On a plunger, subtract before you read

The order here is the whole finding. Take the casing pressure, subtract the required lift pressure, and look at the sign. Only then read the required gas-liquid ratio and `glrOk`. If the sign is negative the gas number is an artefact of an average and the flag is meaningless, and nothing in the returned object will say so. If `maxSlugLengthFt` comes back at zero or at the tubing depth exactly, it clamped, and the answer to quote is the shortfall in psi.

## Then check the liquid, because nothing else does

Divide the well gas rate by its gas-liquid ratio to get the liquid it makes, and set `liquidPerDayBbl` against it. `feasible` is `pressureOk` and `glrOk`, and the liquid comparison is in neither.

| Check | What passing looks like |
| --- | --- |
| Station | Every pressure carries its depth |
| Correlation | Named, with the pressure it was chosen at |
| Loading | Controlling station reported, not the wellhead |
| Casing less lift | Positive, and written down, before any gas number |
| Slug length | Not zero, not the tubing depth |
| Liquid | Cycle capacity set against the well liquid make |

Then the units: psia for pressure, Mscf/d for gas, bbl/d and bbl for liquid, scf/bbl for the ratio, ft/s for velocity, ft for depth, in for tubing, degR where the loading module asks for it.

## Exercise

Work a plunger screen through this order and write one line for each step: the station, the correlation and its pressure, the controlling station, the sign of casing less lift, the gas verdict, the slug length and whether it clamped, and the liquid comparison.

Then name the single step that, done out of order, would leave every later number defensible on its own and the conclusion wrong.
