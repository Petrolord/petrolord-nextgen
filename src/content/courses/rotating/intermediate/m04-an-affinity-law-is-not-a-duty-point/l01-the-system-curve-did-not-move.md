# The system curve did not move

A duty point is where two curves cross. Change the pump and one of those curves moves. The other one is the piping, and it does not know anything happened.

{{panel:fc-suction-explorer}}

## The cleanest case there is

Take a trim ratio of 0.950000, where the shortfall model contributes nothing at all: its shortfall percent is 0, so the real columns and the ideal columns of a trim agree exactly.

Re-solve the duty on the scaled curve and the answer is 1131.756344 gpm at 384.664421 ft. Apply the same scaling to the old duty point and the answer is 1172.730321 gpm at 377.065419 ft. The flow quotient between them is 1.036203885.

That gap is not the shortfall model. There is no shortfall on this row. It is that the system curve did not move when the machine changed, so the machine meets it somewhere else, and an affinity law applied to the old duty point does not know that.

## Why the old point cannot know

The affinity laws take a point on a machine and say where that point goes when the machine is scaled. They are a statement about the machine alone, and nothing in them refers to a static head, a friction head or a flow the piping was rated at.

A duty point is a property of the machine and the system together, and it exists only because the two curves meet. Scaling one of its coordinates carries it along with the machine and leaves it wherever that lands.

## Two questions, and the studio labels them as two

The Pump Station Designer draws its chart and its duty headline from a scaled curve re-intersected with the system. It also shows where the old duty point lands on that new curve, in a card headed "What a change would buy".

Those are different questions with different answers. The crossing is the operating point, where the pump will run after the change. The affinity map is where the machine you had ends up on the machine you now have. Neither substitutes for the other.

## The mistake

The mistake is scaling a duty point and reporting the result as the new duty. At a trim ratio of 0.950000 that reports 1172.730321 gpm when the pump will run at 1131.756344 gpm, and the error survives every sanity check a reader is likely to run, because the figure is a real number produced by a correct application of a correct law.

The second mistake is blaming the gap on the shortfall. It is the obvious suspect in a trim, and this row rules it out by construction: the shortfall percent is 0 and the gap is still there.

The third is assuming the distinction is academic because the two answers agree at a ratio of 1.000000. They agree there because nothing changed.

## Exercise

Give the re-solved and the one-point flow and head at a trim ratio of 0.950000, and the flow quotient between them. Then say why the shortfall model cannot account for that gap on this particular row, and name which of the two answers is the flow the pump will run at.
