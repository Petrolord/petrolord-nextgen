# The decade snap, and why the engine needs it

{{panel:lp-worksheet}}

A rule that says an exact decade belongs to the lower SIL has a problem waiting for it. Real arithmetic rarely lands exactly on a decade. A row whose exact value is a decade can compute to a number a hair above or below it, and the band convention then gives an answer that contradicts the exact arithmetic. The engine's answer is `DECADE_SNAP`, and its value is 1e-9.

## What the snap does

A value within that RELATIVE distance of a power of ten is treated as the power of ten. The snap is applied for the band and for the comparison of a mitigated frequency with the tolerable frequency, so the same tolerance decides both.

## Five rows whose exact value is a decade

Each row below multiplies stated probabilities against a stated tolerable frequency, and in exact arithmetic every one of them gives a risk reduction factor of 100.

| factors, stated | TMEL, stated | the double, seventeen significant digits | decadeOf | outcome with the snap | outcome of a plain comparison with 100, derived |
| --- | --- | --- | --- | --- | --- |
| 0.1 x 0.1 x 0.1 | 1e-5 | 100.00000000000001 | 2 | SIL1 | SIL2 |
| 0.3 x 0.1 | 3e-4 | 100.00000000000000 | 2 | SIL1 | SIL1 |
| 0.2 x 0.5 x 0.1 | 1e-4 | 100.00000000000001 | 2 | SIL1 | SIL2 |
| 0.7 x 0.1 x 0.1 | 7e-5 | 100.00000000000000 | 2 | SIL1 | SIL1 |
| 0.9 x 0.1 | 9e-4 | 100.00000000000001 | 2 | SIL1 | SIL2 |

3 of the 5 products land strictly above 100 in double, at 100.00000000000001. Without the snap each of those would be banded SIL 2 on a risk reduction factor whose exact value is 100, and the convention that says an exact decade belongs to the lower SIL would be broken by the arithmetic that implements it. The snap is what makes the engine honour its own band convention on real numbers.

Notice that nothing about the inputs looks delicate. Three IPL PFDs of 0.1, or a 0.2 and a 0.5 and a 0.1, are the most ordinary entries a worksheet carries.

## How wide the snap is

| RRF, stated | relative distance from 100, derived | decadeOf | outcome |
| --- | --- | --- | --- |
| 100 | 0 | 2 | SIL1 |
| 100.0000001 | 1.00e-9 | 2 | SIL1 |
| 100.000001 | 1.00e-8 | null | SIL2 |
| 100.00001 | 1.00e-7 | null | SIL2 |
| 99.9999999 | 1.00e-9 | 2 | SIL1 |

A risk reduction factor typed one part in a billion above 100 is read as exactly 100. One part in a hundred million is already outside the snap and bands as SIL2. The window is narrow enough that no figure an analyst would deliberately type falls inside it by accident, and wide enough to cover the last bits of a double.

It is worth being clear about what the snap does not do. It does not round results for display, it does not widen any band, and it does not touch a value that is not near a power of ten. It changes the answer only for values within one part in a billion of a decade.

## A chosen tolerance, named as one

The snap is a chosen tolerance and the engine's validation record names it as one. It is not derived from anything and no standard prescribes it. The alternative would have been a plain comparison, which is simpler to read and hands three of the five rows above a band their exact arithmetic denies. The engine takes the tolerance and prints `decadeOf` alongside the outcome, so a reader can see when a row was decided on a decade.

## Exercise

Take the row 0.2 x 0.5 x 0.1 at a tolerable frequency of 1e-4 per year. Multiply the three probabilities out, say what the exact risk reduction factor is, and then state which band it reaches with the snap and which it would reach without. Then decide whether a risk reduction factor of 100.000001 is snapped, and say why.
