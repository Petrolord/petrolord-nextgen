# Six published rows

K is the one number in the settling velocity that comes from a table rather than from the stream. The module carries six rows, and every one of them can be overridden.

{{panel:fc-separator-explorer}}

## The table

| id | label | orientation | base K ft/s |
| --- | --- | --- | --- |
| verticalMesh | Vertical, wire mesh pad | vertical | 0.350000 |
| verticalVane | Vertical, vane pack | vertical | 0.420000 |
| verticalNone | Vertical, no mist extractor | vertical | 0.180000 |
| horizontalMesh | Horizontal, wire mesh pad | horizontal | 0.450000 |
| horizontalVane | Horizontal, vane pack | horizontal | 0.550000 |
| horizontalNone | Horizontal, no mist extractor | horizontal | 0.250000 |

Two orientations, three internal arrangements, six rows. The id is what the engine is given and the label is what a reader sees.

## What K carries

K has units of ft/s and it sets the settling velocity directly: double K and the velocity doubles. Everything else in that velocity comes from the fluids, so K is where the hardware enters the sizing.

It is not a physical property. It is an allowable velocity coefficient, a packaging of what a vessel of that arrangement has been observed to tolerate before it carries liquid over with the gas, which makes it the softest number in the chain.

## Horizontal rows sit above vertical rows

Every horizontal row is higher than its vertical counterpart: 0.450000 against 0.350000 with a mesh pad, 0.550000 against 0.420000 with a vane pack, 0.250000 against 0.180000 with nothing. The reason is geometric. In a vertical vessel the gas rises against the falling drop, so the drop has to beat the gas outright. In a horizontal vessel the gas travels along the drum while the drop falls across it, and the two motions are perpendicular, so a faster gas is tolerable.

The ratio is not constant across the three arrangements, which is a reminder that these are fitted allowances rather than a derivation.

## The internals are worth more than the orientation

Within one orientation the spread is wide. A vertical vessel goes from 0.180000 with no mist extractor to 0.350000 with a mesh pad and 0.420000 with a vane pack, so fitting a vane pack more than doubles the allowable velocity, which more than doubles the gas a given diameter can carry.

That is the trade the table describes. A larger empty drum and a smaller drum with internals can carry the same gas, and the choice is about cost, fouling, turndown and what the supplier will warrant.

## The mistake

Reading a vertical K off the horizontal half of the table. Nothing in the arithmetic objects: 0.450000 is a perfectly good number and the vessel it produces will be about a fifth smaller in area than the vertical row allows. The guard against it is the id, which names the orientation in the same string as the arrangement, so verticalMesh and horizontalMesh cannot be confused once they are written down.

## Exercise

Write the six rows with their base K values and say which of the two variables, the orientation or the internals, moves K further within this table. Then explain why a horizontal row is allowed a higher K than the vertical row with the same internals.
