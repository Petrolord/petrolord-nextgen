# A thin wall is a flat plate

A cylindrical wall resistance carries the outside diameter times the logarithm of the diameter ratio, over twice the conductivity. A flat plate resistance is the thickness over the conductivity and nothing else. As the wall gets thin the first expression has to collapse onto the second, because a thin enough curved wall is a flat one. That is a known truth and it needs no publication behind it.

## Measured rather than asserted

The limit was taken out of the engine rather than argued for on paper, and the measurement technique is worth understanding because it is reusable. Both film coefficients were made negligible, which leaves the total resistance equal to the wall term alone, so the quantity under test is the only thing left in the answer. The outside diameter was held at 1.000000 inches throughout and only the wall thickness moved, so nothing but the variable of interest changed between rows.

That is how to isolate one term inside a sum of five. Make the other four vanish, and the answer becomes a reading of the term you care about rather than a coefficient you then have to unpick. The same trick works on any of the five.

| wall thickness, inches | wall at k 9 | wall at k 26 | wall at k 64 | plate at k 9 | plate at k 26 | plate at k 64 |
| --- | --- | --- | --- | --- | --- | --- |
| 0.109000 | 0.001138428 | 0.000394071 | 0.000160091 | 0.001009259 | 0.000349359 | 0.000141927 |
| 0.035000 | 0.000335975 | 0.000116299 | 0.000047247 | 0.000324074 | 0.000112179 | 0.000045573 |
| 0.010000 | 0.000093531 | 0.000032376 | 0.000013153 | 0.000092593 | 0.000032051 | 0.000013021 |
| 0.002000 | 0.000018556 | 0.000006423 | 0.000002609 | 0.000018519 | 0.000006410 | 0.000002604 |

Read the left half against the right half row by row, at any one of the three conductivities. At the thickest wall the two are clearly different numbers. By the thinnest they have all but met, and the ratio table below says by how much: 1.002005 at the middle conductivity. The convergence is orderly all the way down in all three pairs.

{{panel:fc-coefficient-explorer}}

## The ratio says how fast

| wall thickness, inches | wall resistance over flat plate |
| --- | --- |
| 0.109000 | 1.127984 |
| 0.035000 | 1.036724 |
| 0.010000 | 1.010135 |
| 0.002000 | 1.002005 |

That column is the evidence. It approaches one from above, which is the correct side, and it does so smoothly. A cylindrical wall always carries slightly more resistance than the flat plate of the same thickness, because the heat has to spread as it crosses outward, and the ratio above never drops below one at any thickness.

An expression with a wrong factor of two in it would not do that. It would approach two, or it would approach one half, and it would do so just as smoothly and just as convincingly. The value the ratio converges to is the whole content of this check.

## What this limit is for

It fixes a factor. The twice in the denominator of the cylindrical expression is the kind of thing that gets dropped or doubled once and then lives for years, and nothing about a resistance term carrying two percent of a stack makes an error of that size visible in the coefficient the stack produces.

The limit makes it visible immediately, because it changes the number the ratio column converges to. So the check is not a comparison against a published exchanger, and it does not need one. It is a comparison against a statement about geometry that cannot be wrong, and it can be run at any time on any machine without a single citation in hand.

## Exercise

Record the four thicknesses with the wall resistance and the flat plate value at the middle conductivity. Then record the four ratios, say which value they approach and from which side, and state what a wrong factor of two in the wall expression would do to that column.
