# The capstone worked

{{panel:fc-sizing-explorer}}

The Associate capstone hands you a plant and asks for sizing answers on it. It runs conditions of its own, on streams you have not met in these lessons, so nothing here can be copied across. What can be carried across is the walk, and this lesson is the walk.

## The seven steps, in order

1. Read the case and write down what the load is and what fluid it is. The load is an input. Nothing in this tier computes one.
2. Convert the set pressure and the overpressure allowance into a relieving pressure. Add the atmospheric constant of 14.700000000000 psia only where the route works in absolute pressures, which means the gas route and the steam route.
3. On a gas case, work the back pressure at the relief valve outlet into a ratio of the relieving pressure, and compare that ratio with the critical pressure ratio the engine returns for the stated isentropic exponent.
4. Take the branch that comparison implies. At or below the critical ratio the case is choked and the coefficient C applies. Above it the case is subcritical and the factor F2 applies instead.
5. On a liquid case, work on the differential between the relieving and the back pressure in gauge, and let the loop find its own correction. Read the convergence report as well as the area.
6. On a steam case, read the correction the engine returned. Do not assume it from the pressure, because it steps at its published threshold and sits below one for an interval above it.
7. Take the required area to the ladder and read off the letter and the margin.

## How to report a reading

Report every figure at the precision this course prints that quantity at. A dimensionless ratio, a coefficient and an area all print to six decimals. A flow prints to four. Rounding a reading to fewer digits than the grader expects turns a correct answer into a wrong one, and adding digits the engine never returned is worse.

Report the branch as a word rather than as a number, and report a correction as the figure returned rather than as the figure you expected. Where a reading is a ratio, say what it is a ratio of, because this module carries several and they are not interchangeable.

## The two mistakes this tier is designed to catch

The first is a back pressure that was changed with nothing happening. On a choked case that is correct behaviour: the required area does not move with the back pressure at all in the choked branch. Check the branch before deciding the tool is broken.

The second is a unit. A liquid rate in gpm and a vapour rate in lb/hr are not interchangeable, a gauge pressure fed to the gas route is wrong by one atmosphere, and a degF temperature fed where degR is wanted produces a finite and badly wrong area.

## Exercise

Write the seven steps out as a checklist in your own words, marking beside each one which figures it needs stated and which it computes. Then say, for each of the three fluids, which single correction you will read off the return rather than assume.
