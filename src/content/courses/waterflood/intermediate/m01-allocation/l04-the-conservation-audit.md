# The conservation audit

The allocation matrix is a hypothesis. The conservation audit is not: it is arithmetic, it either holds or it does not, and it is the one place in this tier where you get a completely objective check. This lesson runs it, reports that the residual is exactly zero, and then explains carefully what that zero does and does not prove.

## The identity

For the whole record, every injected barrel must end up in exactly one of two places:

$$\sum_{\text{producers}} W_{i,\text{allocated}} + W_{i,\text{out of zone}} = \sum_{\text{rows}} W_i$$

Run it on Ekene:

| destination | barrels |
|---|---|
| Ekene-6 | 92239.92509099872 |
| Ekene-3 | 56243.85676280411 |
| Ekene-1 | 40495.57686921897 |
| Ekene-5 | 8999.01708204866 |
| out of zone | 26997.051246145966 |
| **total allocated** | **197978.37580507048** |
| **total injected** | **224975.42705121645** |

and

$$224975.42705121645 - (197978.37580507048 + 26997.051246145966) = 0$$

Exactly zero. Not $10^{-9}$, not a value that rounds to zero: the floating point difference is the literal value 0.

## Why exactly zero and not nearly zero

Because of how the sum is built. For each row the engine takes the injected volume, multiplies it by each allocation fraction, adds those products to the per-producer totals, and then adds $W_i \times (1 - \sum \text{fractions})$ to the out-of-zone total. Summing the same set of products in a different order can lose the last bit, and often does.

Here it does not, and the reason is that the accumulation order happens to work out identically on both sides for this data. That is a property of this record, not a guarantee of the algorithm.

You can demonstrate that yourself in thirty seconds. Take the five totals as printed in the table and add them up in the order they are written. You will not get exactly the total injected; you will get a residual of about $2.9 \times 10^{-11}$ barrels. Nothing changed except the order the additions happened in. Floating point addition is not associative, and the engine's internal order and your reading order are different orders.

The lesson to take is therefore not "the residual is always exactly zero" but "check the residual, and know what magnitude counts as clean". A residual of 500 barrels is a bug, and it means a real allocation is missing. A residual of $10^{-11}$ barrels is 29 femtolitres and it is arithmetic. Anyone who does not check cannot tell the two apart, and anyone who insists on exact zero will chase the second one forever.

## What the audit proves

That the allocation arithmetic conserves volume. Nothing has been created, nothing lost, no injector has been double counted, no producer's share has been dropped.

That is worth having. The most common allocation bug is a typo in a well name: a fraction pointing at "Ekene-06" instead of "Ekene-6" silently allocates nothing, and the barrels quietly land in the out-of-zone bucket. Conservation still holds, and the out-of-zone total jumps. So the audit does catch that class of bug, but only if you look at the out-of-zone number as well as the residual.

## What the audit does not prove

That the split is right. Conservation holds for every possible matrix, including one that sends all the water to the wrong producer. The audit is a check on the code, not on the geology.

This distinction gets blurred in practice, because a report showing a clean conservation table looks authoritative. It is authoritative about exactly one thing.

{{panel:wf-pattern-explorer}}

The stacked bar shows where every injected barrel went under the current matrix. Read the segment widths against the table above. The grey out-of-zone segment is twelve percent of the bar, and the whole point of drawing it is that it is impossible to forget.

## Reading the per-producer totals

The four producer totals are worth a look on their own. Ekene-6 receives 92239.92509099872 barrels, more than twice Ekene-1's 40495.57686921897 and more than ten times Ekene-5's 8999.01708204866.

That ordering follows directly from the matrix, which follows from the distances, which follow from where the wells happen to be. Ekene-6 sits in the middle of the field and takes support from both injectors; Ekene-5 sits in the far west and takes a token share from one. If the matrix is broadly right, Ekene-5 is barely being flooded at all, and any expectation of a flood response there should be low.

That is a genuinely useful conclusion and it rests entirely on the matrix.

## The misconception to avoid

"Conservation is trivial so the audit is a formality." It is trivial when it holds and extremely informative when it does not. A nonzero residual means one of: a row summing above one that slipped past validation, a producer name mismatch, a row processed twice, or a filter applied to one side of the sum and not the other. Every one of those is a real bug that produces a plausible-looking report. Run the audit, look at the residual, and look at the out-of-zone total.

## Exercise

First, add the four producer totals and the out-of-zone total as printed and compare against the total injected. Report the residual you get, compare it with the exactly-zero residual the engine reports, and explain in one sentence why the two differ without either being wrong.

Second, suppose a typo pointed 0.30 of Ekene-2's water at a producer name that does not exist. State what would happen to the residual, to the out-of-zone total, and to the North element's pattern VRR, and which of the three you would notice first.
