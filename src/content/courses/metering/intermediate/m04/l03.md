# Equal percentage exists to cancel something

An inherent characteristic is the relationship between how far a valve is open and how much it will pass at a fixed pressure drop. An installed characteristic is what the loop actually sees, with the circuit fighting back. The two are different, and the choice of characteristic exists to make the second one usable.

## Where the recommendation changes

The engine recommends a characteristic off the authority, and the switch is printed: the characteristic recommendation changes at an authority of 0.500000.

On the system whose total drop is 120.000000 psi, the cases at valve drops of 10.000000, 25.000000, 40.000000 and 55.000000 psi, with authorities of 0.083333, 0.208333, 0.333333 and 0.458333, are all recommended `equalPercentage`, labelled equal percentage. The cases at valve drops of 70.000000, 85.000000 and 100.000000 psi, with authorities of 0.583333, 0.708333 and 0.833333, are all recommended `linear`.

## The two reasons, in the engine's own words

For the high authority cases:

> `the valve takes most of the system drop, so its inherent curve is close to its installed curve and linear trim gives even loop gain`

For the low authority cases:

> `the system absorbs most of the drop as flow rises, which flattens the installed curve. Equal-percentage trim is shaped to cancel exactly that and restore something close to linear installed gain`

## Reading the second reason properly

This is the sentence that makes sense of the whole subject. Equal percentage trim is often taught as though it were simply a different curve a designer might prefer. It is a correction. The circuit flattens the installed curve at high flow, because that is where the pipework is taking the pressure away from the valve. Equal percentage trim passes very little near the seat and a great deal near full travel, which is a curve bent in the opposite direction to the distortion the circuit applies.

Put the two together and what the loop sees is something close to a straight line. The trim is chosen to cancel a known distortion, so choosing it for a circuit that does not apply that distortion produces a loop that is bent the other way instead.

That is what the first message is saying about the high authority case. When the valve takes most of the drop there is almost nothing to cancel, so linear trim is the choice that leaves the gain even.

The same reasoning explains why the recommendation is read off the authority rather than off the service. The distortion the trim is chosen to cancel is produced by the circuit around the valve, so the fraction of the drop the circuit takes is precisely the variable that says how much cancelling is needed.

## What this course grades

Nothing here. The characteristic word is a recommendation read off a screen the engine states for itself, and the same applies to the verdict beside it.

## Exercise

Write down the authority at which the characteristic recommendation changes, and the characteristic the engine recommends at authorities of 0.333333 and 0.708333. Then explain in your own words what the equal percentage curve is cancelling, and what happens if it is fitted where there is nothing to cancel.
