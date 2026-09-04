# Equivalent length

An equivalent length is not a property of a fitting. It is the sum of K times the bore over the friction factor, and two of those three belong to the pipe rather than to the fitting.

{{panel:pd-trunk-explorer}}

## The published case

Four long radius elbows and two gate valves on a 6.065 in bore at a friction factor of 0.018: the sum of K is 1.500000 and the equivalent length is 42.118056 ft. That is the length of straight 6.065 in pipe, at that friction factor, which costs the same pressure as those six fittings. Move any of the three inputs and the answer moves with it.

## The same six fittings on eight bores

| Bore, in | Equivalent length, ft |
| --- | --- |
| 2.067 | 14.354167 |
| 3.068 | 21.305556 |
| 4.026 | 27.958333 |
| 6.065 | 42.118056 |
| 7.981 | 55.423611 |
| 10.02 | 69.583333 |
| 11.938 | 82.902778 |
| 15 | 104.166667 |

Every row is the same fitting list at the same friction factor of 0.018, across the schedule 40 bores the table publishes. These are sweep points rather than published cases. The length rises with the bore because the bore is the only geometry in the formula, and the fittings entered it only through their K.

## What the length is for

It is added to the measured run, and the total goes to a pressure drop correlation. This module does not own that correlation: the pipe hydraulics are a callback the consumer supplies, so nothing here turns a length into a pressure. Nothing here iterates either, and nothing here knows there is a network. It returns a sum of K and a length in ft, and that is the whole of its output.

## What it refuses

An unknown fitting refuses the entire list rather than dropping the term: `ok = false`, No resistance coefficient for reducer. A missing bore or a missing friction factor refuses too, An equivalent length needs a bore and a friction factor. There is no default bore and no default friction factor anywhere in the file, so a caller who omits either gets a refusal instead of a plausible length.

## The mistake

Carrying an equivalent length from one line to another. The same four elbows and two gate valves are 14.354167 ft on a 2.067 in bore and 104.166667 ft on a 15 in bore, at an identical friction factor of 0.018. A figure written on a datasheet as the equivalent length of an elbow is a figure about one particular pipe, and the fitting is the only part of it that travels.

## Exercise

In the panel, run four long radius elbows and two gate valves on a 4.026 in bore at a friction factor of 0.018, write the length, then run the same list on a 7.981 in bore.

Then say, for two lines of the same measured run length, which one those fittings matter more on.
