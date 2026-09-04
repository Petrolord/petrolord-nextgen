# Working the capstone

The order of work, and the checks that catch the mistakes people make.

{{panel:pd-vlp-explorer}}

## The method

A graded outflow problem runs on its own conditions. What carries across is the order: each step needs the one before it. No node is asked for: every reading belongs to the tubing and the string.

**One. Sort the conditions into two models.** The tubing curve takes four constants and a rate range. The gas column takes its own list, including both depths and a step count. They share nothing, and sorting first is how you notice that one of those rates is in MMscf/d and the other in stb/d.

**Two. Build the curve over a range you can defend.** The upper bound is the absolute open flow, a rate the reservoir cannot exceed. The lower bound is just off zero, where these models are singular. Then fix a sample count and write it down.

**Three. Locate the minimum, and know which one you reported.** BONNY-7 at 37 points reads 604.341111 stb/d and 1477.003621 psia; refined at 20001, 627.069742 stb/d and 1476.243252 psia, a gap of 22.728631 stb/d and 0.76036884 psi. The rate error is by far the larger: the bowl is flat at the bottom.

**Four. Read both ends, labelled by rate.** BONNY-7 reads 2545.501142 psia loaded and 12560.087474 psia at the friction end. FORCADOS-3 reads higher at its loaded end than at its friction end, so never use one end to check the other.

**Five. March the column at a stated step count.** The two station default is the published method, and its error is a friction error: 0.01833744 psi on BONNY-7's gravity only column against 7.54108245 psi on FORCADOS-3's, which reads 2600.819216 rather than 2608.360298 psia. They settle at sixteen and twenty four sub-intervals. Take the midpoint at half the measured depth, never by interpolation.

## The checks

**The defining integral against its target**, 18.75 times the gas gravity times the measured depth, values you typed yourself. BONNY-7 achieves 76633.1434 psi units against 76631.2500.

**The two tubing terms against each other near the minimum.** They are comparable at the bottom of a J: BONNY-7's cross at 968.379388 stb/d against a minimum at 627.069742. A minimum far from its crossover means a constant is wrong.

**The loaded end against the dead column.** It sits a little under it, the smallest flow having already lightened the column: 2545.501142 psia under 2570 psia.

## The failures to expect

Swapping measured and true vertical depth. The integral check cannot catch it: the target is built from measured depth and agrees either way. Mixing MMscf/d and Mscf/d between the marching column and the closed form. Reporting the closed form as the answer: it reads high on any column carrying rate, by 18.010269 psi on FORCADOS-3. Being unclear which minimum you reported, or leaving the step count off.

And solving a node: an intersection is not one of the readings, and such a well can have two crossings with only one held.

## Exercise

Take either teaching well in the panel and work it in order: curve at a stated sample count, minimum, both ends, then the column at a stated step count with both its pressures.

Write the choice that produced each beside it, and say which would move most if you doubled the sample count.
