# The worst element wins

The rollup rule, in full, and the vocabulary change that comes with it.

{{panel:wi-envelope-explorer}}

## The rule

The engine decides an envelope's verdict in this order:

1. No elements at all, the envelope is **empty**.
2. Any element failed, the envelope is **failed**.
3. Any element degraded or not-verified, the envelope is **degraded**.
4. Otherwise the envelope is **intact**.

That is the whole of it. First match wins, so failed beats everything and a single degradation beats any number of verified elements.

## The matrix

Two elements, every combination of statuses, 16 cases:

| First / second | verified | degraded | failed | not-verified |
| --- | --- | --- | --- | --- |
| **verified** | intact | degraded | failed | degraded |
| **degraded** | degraded | degraded | failed | degraded |
| **failed** | failed | failed | failed | failed |
| **not-verified** | degraded | degraded | failed | degraded |

The table is symmetric about its diagonal, and the engine run confirms it. Order does not matter, only the worst status present. Note also that the degraded row and the not-verified row are identical, which is the rule from the previous module in grid form.

## The vocabulary shift

Read the top left cell again. Two verified elements give an **intact** envelope, not a "verified" one.

This is deliberate. An element is verified, degraded, failed or not-verified. An envelope is intact, degraded, failed or empty. Two words overlap and two do not, and the two that do not are exactly the ones that would let you confuse a part with a whole.

## The defect this caught

`wellCategory` takes two ENVELOPE statuses and returns the traffic light. It used to accept any string, and anything it did not recognise fell through to the final branch, which returns **green**.

So `wellCategory({ primary: 'not-verified', secondary: 'intact' })` answered green. That is an element status in an envelope slot, an easy slip given how adjacent the two vocabularies are, and the answer was a clean bill of health for a well whose primary envelope nobody had checked.

Its sibling, the rollup, had always thrown on an unknown element status. So the two halves of one boundary disagreed about whether to trust their caller, and the trusting half failed in the one direction an integrity function must never fail in.

Both refuse now, and the error message names the other vocabulary and tells you to roll your elements up first. Petrolord engines PR #105.

## Exercise

1. Reproduce four cells of the matrix in the panel, including both diagonal corners.
2. Say out loud which four words describe an element and which four describe an envelope.
3. Explain why "verified" is not an available answer for an envelope.
