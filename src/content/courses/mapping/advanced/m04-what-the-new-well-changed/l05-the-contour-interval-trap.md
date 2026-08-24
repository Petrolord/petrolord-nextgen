# The contour interval trap

Adding a well changed the contour interval on the map, and it changed it in the direction nobody expects. This lesson is short, and it is the one most likely to catch a reader out in real work.

## What happened

| Control set | Crest | Deepest | Range | Contour interval | Levels |
| --- | --- | --- | --- | --- | --- |
| Six wells | 1539.7181 | 1590 | 50.28 m | 10 m | 6 |
| Seven wells | 1540.7056 | 1590 | 49.29 m | 5 m | 10 |

The range **shrank by 0.99 m**, from 50.28 m to 49.29 m. The contour interval **halved**, from 10 m to 5 m, and the number of contour lines rose from six to ten.

## Why

The rule that chooses the interval divides the range by ten and rounds **up** to the next nice number, one of 1, 2 or 5 times a power of ten.

Six wells: $50.28 / 10 = 5.028$, which rounds up to **10**.

Seven wells: $49.29 / 10 = 4.929$, which rounds up to **5**.

The range crossed the value 50, and 50 is exactly where the nice-number ladder steps from 5 to 10. A change of 0.99 m in the range, less than two percent, landed on the one threshold in the whole scale that doubles the answer.

## Why it matters

Put the two maps side by side, as they would appear in a report showing the field before and after the appraisal well.

The seven-well map has **almost twice as many contour lines**. It looks more detailed, more resolved and more confident. A reader flicking between the two pages will read the second as a better map.

It is a better map, by one well. It is not nearly twice as resolved, and none of the extra detail in the appearance is real. The additional lines exist because a rounding threshold was crossed.

The effect is the same one the Professional tier met on the isochore, where a 200 m cell produced a **finer** interval than a 100 m cell because its range was smaller. Here it is triggered by data rather than by a setting, which makes it harder to anticipate.

## The defence

**Fix the contour interval by hand whenever two maps are to be compared.** Contour both at 10 m, or both at 5 m, and the comparison shows what changed in the surface rather than what changed in the rounding.

**Quote the interval on every map.** A reader who can see 10 m on one page and 5 m on the other has a chance of noticing. A reader given two unlabelled contour sets has none.

**Be suspicious of an interval change between vintages.** It is more often a rounding threshold than a change in the data, and it is worth checking which before drawing any conclusion from the appearance.

## Worked example

A horizon is remapped after new picks and the interval changes from 20 m to 10 m. What should be checked first?

The range, on both maps. If it fell from just over 200 m to just under, the interval change is entirely the rounding threshold at 200 and nothing about the surface has doubled in detail.

If instead the range fell substantially, say from 200 m to 120 m, then the structure really has flattened and the finer interval is appropriate, but the flattening itself is then the finding and it deserves an explanation.

## Exercise

State the contour interval of the six-well and seven-well maps and the range of each, explain in one sentence why a smaller range produced a finer interval, and give the defence when two maps are to be compared.

As a self-check: the six-well map has a range of 50.28 m contoured at 10 m and the seven-well map a range of 49.29 m contoured at 5 m. A smaller range produced a finer interval because the rule divides the range by ten and rounds up to the next nice number, and the range crossed 50, the exact threshold where a tenth of it falls from just above 5 to just below and the rounding drops from 10 to 5. The defence is to fix the interval by hand for any comparison, so that a difference in appearance reflects a difference in the surface rather than in the rounding.
