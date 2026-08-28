# Normalized curves

Two core plugs from the same sand rarely hand you the same table. One was cut where the rock is cleaner and drains to a connate water of 0.32; the other holds 0.38. Their endpoint permeabilities differ too, because endpoint kr is a property of the pore network each plug happens to sample. Lay the raw curves on one plot and they disagree everywhere, and you cannot tell whether the disagreement is physics or just frames. Normalization removes the frames so that only the physics is left to compare.

## The transform

`normalizeKrTable` maps a validated table onto the normalized saturation axis

$$S_{wn} = \frac{S_w - S_{wc}}{1 - S_{wc} - S_{or}}$$

and rescales each curve by its own endpoint value: $k_{rw,N} = k_{rw} / k_{rw}(1 - S_{or})$ and $k_{ro,N} = k_{ro} / k_{ro}(S_{wc})$. The endpoints come from the table itself unless you pass them explicitly. Every normalized table starts at $(0, 0, 1)$ and ends at $(1, 1, 0)$ by construction: the frame has been divided out, and what remains is pure shape.

Run the Ekene 13-row lab grid through it and the endpoints come back exactly as the design planted them:

| quantity | value |
| --- | --- |
| $S_{wc}$ | 0.35 |
| $S_{or}$ | 0.25 |
| $k_{rw,max}$ | 0.3 |
| $k_{ro,max}$ | 0.9 |

and the middle row of the normalized table reads

| $S_{wn}$ | $k_{rw,N}$ | $k_{ro,N}$ |
| --- | --- | --- |
| 0.5000000000000001 | 0.17677669529663698 | 0.2499999999999999 |

## Why the exponent survives

Look at what those normalized values are. For a Corey curve, $k_{rw} = k_{rw,max} S_{wn}^{n_w}$, so dividing by the endpoint leaves $k_{rw,N} = S_{wn}^{n_w}$ with nothing else in it. At the midpoint the water value is $0.5^{2.5}$ and the oil value is $0.5^{2}$: the Ekene exponents $n_w = 2.5$ and $n_o = 2$ pass through normalization untouched, while $k_{rw,max}$ 0.3 and $k_{ro,max}$ 0.9 vanish entirely. Normalization is a filter that keeps curvature and discards frame.

The digits carry a small honesty lesson. A calculator gives $0.5^{2.5}$ as 0.17677669529663687, while the engine's normalized row reads 0.17677669529663698. Both are right. The grid row at $S_w$ 0.55 was computed through $S_{wn} = (0.55 - 0.35)/0.4$, which lands at 0.5000000000000001 in floating point rather than exactly one half, and the division by 0.3 rounds once more. The disagreement lives in the sixteenth digit, far below anything a laboratory could measure, but it is the same lesson the Associate tier taught at $S_w$ 0.55: name the arithmetic path a number came from, because two legitimate paths can disagree in the last digit.

## Reading a normalized table

Two more rows anchor the shape. At $S_{wn}$ 0.25000000000000006 the normalized pair is $k_{rw,N}$ 0.031250000000000014 and $k_{ro,N}$ 0.5625, and at $S_{wn}$ 0.7499999999999998 it is 0.4871392896287463 and 0.06250000000000011. Check them against the exponents: $0.25^{2.5} = 0.03125$, $0.75^{2} = 0.5625$, $0.75^{2.5} \approx 0.4871$, $0.25^{2} = 0.0625$. Every row of a normalized Corey table is a bare power of $S_{wn}$, which is exactly why plotting $\log k_{r,N}$ against $\log S_{wn}$ turns the water curve into a straight line of slope $n_w$. That log-log read is the fastest exponent estimate there is, and module 1 showed you the rigorous version of the same idea.

The function refuses tables it cannot normalize: a mobile window of zero width ($S_{wc} + S_{or} \geq 1$) or an endpoint kr of zero returns an error instead of a table full of division artifacts. Those guards are the same validation philosophy you met in the Associate tier, applied one transform later.

## The misconception to avoid

Normalized curves are not comparable curves in every sense. Dividing by the endpoints does not mean the plugs would flow alike, because the endpoints you divided out are precisely where the plugs differ most in practice. Two rocks with identical exponents but endpoint ratios of 0.3 and 0.6 have the same normalized plot and very different floods. Normalization answers one question only, whether the shapes agree. The frame you removed still has to be put back before any flow calculation, and choosing whose frame to put back is the transfer problem of the next lesson.

## Exercise

First, using only the exponents $n_w = 2.5$ and $n_o = 2$, write down the normalized pair $(k_{rw,N}, k_{ro,N})$ you expect at $S_{wn} = 0.25$, then compare against the engine row quoted above and account for any digits that differ.

Second, a colleague normalizes a plug whose table still reads $k_{ro}$ of 0.02 at its highest saturation instead of a hard zero, so the normalized oil curve ends near 0.022 instead of 0. State which rule of `validateKrTable` from the Associate tier this table already broke, and what a nonzero oil value at the top row does to the $S_{or}$ the table implies.
