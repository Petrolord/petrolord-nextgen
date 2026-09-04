# The story so far

A gathering system has one answer, and every well is in it.

## The claim

The rate a well makes is not a property of the well. It belongs to the whole system solved at once, against one boundary pressure, with every other well pushing on the same header. A study that begins by typing in a wellhead pressure has assumed away the question a network asks.

## The anchor

Give the solver linear branch resistances and the network collapses to a weighted graph Laplacian, whose solution is a matrix inverse. Newton and Gaussian elimination share no code, so on the published star they agree at the separator and the first wellhead to 0.0000e+0 psia and at the header to -2.8422e-14 psia. Newton takes 2 iterations, because Newton is exact on a linear system, and `checkConservation` on that answer reports a gap of 7.275958e-12 lb/d. It is the only check with no tolerance in it, and every answer after it is an iterate.

## What an iterate is worth

On the published turbulent tree the engine and an independent bisection referee sharing none of its machinery land on the same header, 936.962342067 psia against 936.962342064 psia, a difference of -3.9037e-9 psia. The referee took 48 sweeps and the engine took 6, and the audit on the engine answer reports a gap of 9.890573e-8 lb/d. Two methods with nothing in common agreeing is evidence about the physics rather than either code.

## What the system takes

Wells fight. On the published ladder the header climbs from 253.813945 psia with one well to 670.128002 psia with three, a rise of 416.314057 psi, and adding two wells bought 5554.405485 lb/d between them. On the teaching network four solo rates add to 15683.052292561 lb/d against a system producing 13300.677150912 lb/d, a cost of 2382.375141650 lb/d, 15.190761959 percent. AGBADA-6 loses 24.162893177 percent of itself and AGBADA-2 loses 12.857585591, so the weak well loses most and the two rankings are different rankings.

## What the answer will not tell you itself

Directions are solved, not drawn: the crosslink returns -589.864625170 lb/d against its arrow. Streams add by rate, so the trunk arrives at a water cut of 33.262507244 percent where averaging the wells gives 42.401682837. And a converged flag is not a result. The engine reports converged = true at a residual of 1.546141e-11 lb/d while `checkConservation`, on the same answer, reports produced = 13300.677150912 lb/d against delivered = 12955.677150912 lb/d, a gap of 345 lb/d, 2.593852900 percent.

## The one sentence

You can solve a whole system, read what it says, and name which of its numbers no single-well method could have produced.

## Exercise

Write the claim in one sentence and beside it the number you would use to defend it.

Then say which number in a network result was checked by something other than the iteration that produced it.
