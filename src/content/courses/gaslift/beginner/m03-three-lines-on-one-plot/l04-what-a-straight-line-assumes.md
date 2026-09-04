# What a straight line assumes

Of the three lines a gas lift design is drawn with, one is computed from gas properties and two are asserted. Only the computed one has ever been priced.

{{panel:pd-column-explorer}}

## One line is measured

The injection line is a marched real gas column and it is not straight. Its local gradient runs from 0.025405143 to 0.024893071 psi/ft on the 1014.7 psia column, and from 0.039871956 to 0.037917316 psi/ft on the 1414.7 psia one. Curvature that small still matters, because it acts over thousands of feet.

## Two lines are declared

The unloading and transfer lines are constant gradients supplied as inputs.

| Case | Kill fluid, psi/ft | Lifted, psi/ft |
| --- | --- | --- |
| westTexasOil | 0.45 | 0.1 |
| deepHighPressure | 0.5 | 0.12 |
| constantPressurePPO | 0.42 | 0.08 |
| midDecrementKnifeEdge | 0.46 | 0.09 |

No march, no compressibility factor, no temperature. The engine is explicit that a real unloading column is neither straight nor constant, and it declines to pretend otherwise by making the gradient an input rather than a result.

## What a flat gradient costs where it can be checked

The 0.02 psi/ft rule of thumb is the injection line treated the way the other two are treated, and there is a marched column to price it against. It misses by -41.016705 psi at 8000 ft, which is 20.4046 percent of that column's lift, by -206.539805 psi at 11000 ft, 48.4222 percent, and by 26.102397 psi at 4000 ft, 48.4296 percent. The sign changes between the high pressure column and the low pressure one.

That is the cost of one flat gradient on the one line where a reference exists.

## The mistake

Concluding that the two declared lines must be cheaper because no error is reported for them. Nothing has measured them. A kill fluid gradient of 0.45 psi/ft and a lifted gradient of 0.1 psi/ft carry whatever error they carry, silently, into every valve depth in the string, and the design reports valve 1 at 2119.249994721 ft with nine decimal places either way. Precision in an output is a property of the arithmetic, not of the assumption it started from.

## What it refuses

It refuses to invent the production side. The flowing traverse used to find the deepest injection point is passed in as a depth and pressure table, so the module never claims a gradient it has not been given.

## Exercise

Write the three rule of thumb errors with their signs and the percentage of lift each represents.

Then name the two gradients in your own design that have no error figure at all, and say what you would have to measure to give them one.
