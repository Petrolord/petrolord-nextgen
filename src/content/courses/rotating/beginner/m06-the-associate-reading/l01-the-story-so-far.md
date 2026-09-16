# The story so far

Five modules, one machine and one station. This lesson puts them back together in the order the engine runs them, because the chain is the argument.

## The chain

A catalogue gives four readings. Least squares turns them into a quadratic, and the fit reports on itself: coefficients, a shutoff head, an R squared, a condition number and a droops flag. A friction head at a stated flow gives a system curve, and the engine works out the coefficient that implies. The two curves cross at one flow, and the crossing is solved by bisection that reports the halvings, the bracket, the residual and a convergence flag. Power, discharge pressure and the operating region are then all asked at that one solved flow.

On OKONO the chain reads: four catalogue points, a fit with c0 = 540.203016 and a droops flag of true, a system stated as 210.000000 ft of static head and 165.000000 ft of friction at 1100.000000 gpm, a duty of 1234.452969 gpm at 417.801018 ft, 183.041884 hp at the shaft, 188.100891 psi at the discharge, and a region of "preferred" at 107.343736 percent of best efficiency flow.

## What the tier was really about

Three ideas run through all of it.

The first is that a machine has no operating point until it is connected to something. Everything after the duty point in that chain is a consequence of where the duty landed, so everything after it moves when the station moves. The same OKONO pump gives 1234.452969 gpm into one station and 804.694816 gpm into another.

The second is that a return is more than an answer. The fit reports its own conditioning, the solve reports the bracket and the residual it finished on, and the region carries a note. Each of those fields exists because somebody asked what could go wrong and made it visible in the return.

The third is that a flag is only worth what its false case is worth. The converged flag has a case that makes it false, and the tier ran it. The droops flag has one, and the tier ran that too. A flag with no reachable false case is decoration.

## What the tier deliberately did not do

It did not go near the suction side, which is where selections actually fail. It did not change the machine, by speed or by trim, and it did not put a second one beside it. It did not touch a compressor at all. Those are the next two tiers.

## The mistake, one more time

Every mistake in this tier has been a version of one mistake: taking a number out of the middle of that chain and treating it as a property of something it is not a property of.

## Exercise

Write the OKONO chain end to end, from four catalogue points to the operating region, naming what each step consumes from the step before it. Then name the two flags in the chain that have a reachable false case, and say what input produces it in each.
