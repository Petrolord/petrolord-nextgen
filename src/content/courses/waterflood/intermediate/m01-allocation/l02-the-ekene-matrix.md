# The Ekene matrix

This lesson builds Ekene's allocation matrix from the well map, states the judgement in it explicitly, and then flags the parts of the resulting analysis that are conclusions and the parts that are assumptions wearing a conclusion's clothes.

## The distances

From the mapped well coordinates, straight-line distances in metres:

| from | Ekene-1 | Ekene-3 | Ekene-5 | Ekene-6 |
|---|---|---|---|---|
| Ekene-2 | 1209.3386622447824 | 1400.89257261219 | 1767.0597047072292 | 715.8910531638176 |
| Ekene-4 | 2193.171219946131 | 1216.5525060596437 | 2088.06130178211 | 989.9494936611666 |

Both injectors are on the east side of the field, because both were drilled into the down-dip wet part of the sand. Ekene-6, in the middle, is the nearest producer to both. Ekene-5, in the far west, is the furthest from both.

## The matrix

Weighting by inverse distance and rounding to the nearest 0.05:

$$\text{Ekene-2} \rightarrow \{\text{Ekene-6}: 0.45,\ \text{Ekene-1}: 0.30,\ \text{Ekene-3}: 0.15\}, \quad \text{sum } 0.90$$
$$\text{Ekene-4} \rightarrow \{\text{Ekene-3}: 0.40,\ \text{Ekene-6}: 0.35,\ \text{Ekene-5}: 0.10\}, \quad \text{sum } 0.85$$

Three decisions are embedded there and each deserves a sentence.

**Ekene-2 sends nothing to Ekene-5.** At 1767 m, across the whole field and past two other producers, the connection is weak enough to round to zero. That is a choice; a pure inverse-distance weighting would give it a small nonzero share.

**Ekene-4 sends only 0.10 to Ekene-5.** Even further, 2088 m, but kept nonzero because Ekene-5 is the only producer in the west and giving it nothing asserts more confidence than the data supports.

**Neither row sums to one.** Ekene-2 keeps 0.10 out of zone and Ekene-4 keeps 0.15. Both injectors are down-dip and completed below the oil water contact, so some of their water is expected to go into the aquifer leg rather than into the oil column. The next lesson is entirely about that shortfall.

## The rounding is not innocent

Rounding to 0.05 is a signal that these numbers are judgement, and it is a good habit. A matrix printed to three decimals invites the reader to believe there is a measurement behind the third one. Round to the precision you can defend.

It does have a cost. The rounded fractions no longer sum to the values a strict inverse-distance weighting would give, so if someone re-derives your matrix from the stated method they will not reproduce your numbers exactly. State the method AND the matrix, and treat the matrix as authoritative.

## Two patterns

With the matrix in hand, the producers are grouped into two flood elements:

$$\text{North (Ekene-2 element)}: \{\text{Ekene-1}, \text{Ekene-6}\}$$
$$\text{South (Ekene-4 element)}: \{\text{Ekene-3}, \text{Ekene-5}\}$$

Note that the names are labels, not a claim that each element is fed by one injector. Both injectors send water to both elements: Ekene-2 sends 0.75 of its water north and 0.15 south, while Ekene-4 sends 0.35 north and 0.50 south. Cross-feeding between elements is normal and the engine handles it directly; a pattern's injection is the allocation-weighted share of EVERY injector, not just its namesake.

## What this buys and what it costs

It buys a per-element voidage ledger, which is the whole point of the tier and which the next module reads.

It costs the objectivity the Associate tier had. Every number downstream now depends on eight fractions that came from a map and a judgement call. When the next module reports that one element is at 1.20 and the other at 0.61, the correct reading is "on this allocation, the field splits into an over-injected and a starved half", and the size of the split does depend on the fractions.

What does not depend much on the fractions is the DIRECTION. Both injectors are in the east; the eastern producers get more water than the western ones under any sane matrix. That robustness is worth checking explicitly, and the exercise below asks you to.

## The misconception to avoid

"Distance-weighted allocation is objective because distances are measured." The distances are measured; the decision to weight by them, the choice of exponent, the rounding, and the row sums are all judgement. A method built on measured inputs is not thereby a measurement. What distance-weighting gives you is a defensible starting point that everyone can reproduce, which is genuinely valuable and is not the same as being right.

## Exercise

First, build an alternative matrix by weighting on inverse distance SQUARED instead of inverse distance, keeping the same row sums of 0.90 and 0.85 and rounding to 0.05. Compare it with the matrix above and say which fractions moved most.

Second, using your alternative matrix, predict whether the North element would still come out more heavily injected than the South. State how confident you are and what would change your mind.
