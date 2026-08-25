# The jackknife at the prospect

The tier has two residuals and no way to turn them into an uncertainty. This lesson changes the question, and the new question has an answer.

{{panel:mp-validation-explorer}}

## The change of question

Leave-one-out asks: *how wrong was the map at the well I removed?* That gives one residual per removable well, and on this control set only one well is removable.

The jackknife asks a different question: *how much does the answer at the location I care about depend on which wells I have?* That gives one value per well removed, at a **fixed** location, and every well can be removed because the location being sampled is P-1 rather than the withheld well.

The hull limitation disappears. Removing Ekene-1 puts Ekene-1's own site outside the mask, but P-1 at (1600, 1600) is deep in the interior and stays live under every removal.

## The six runs

Grid five wells, sample at P-1, repeat six times.

| Control set | Depth at P-1 | Change from the full map |
| --- | --- | --- |
| Without Ekene-2 | 1541.939208984375 | $-0.68$ |
| Without Ekene-5 | 1542.193603515625 | $-0.43$ |
| **All six wells** | **1542.619873046875** | |
| Without Ekene-1 | 1543.0888671875 | $+0.47$ |
| Without Ekene-3 | 1543.8074951171875 | $+1.19$ |
| Without Ekene-4 | 1547.210205078125 | $+4.59$ |
| Without Ekene-6 | 1549.7083740234375 | $+7.09$ |

Six numbers at one location, all produced from data already in hand, none of them requiring a new well.

## Reading the table

**Every removal moves the answer.** The smallest change is 0.43 m and the largest is 7.09 m.

**Two wells dominate.** Removing Ekene-6 moves P-1 by 7.09 m and removing Ekene-4 by 4.59 m. The other four move it by about a metre or less between them.

**Ekene-6 dominates for a reason already established.** The Professional tier showed that Ekene-6, the only interior well, is the nearest control for a third of the map. P-1 is 361 m from it, closer than to anything else. Take it away and the map at P-1 loses its principal constraint.

**Ekene-4 dominates for the opposite reason.** It is the deepest well by 25 m and it sits alone in the northeast corner. Removing it removes the entire deep anchor on that side, and the surface everywhere lifts or sags in response. Its influence at P-1 is large despite being 1345 m away.

**Removals can move the answer either way.** Two of the six make P-1 shallower and four make it deeper. That is not a bias; it depends on whether the removed well was pulling the surface up or down at that location.

## Why this is honest

The obvious objection is that a five-well map is worse than a six-well map, so these six values are all inferior estimates and their spread overstates the uncertainty of the map in use.

That objection is correct in direction and it does not undermine the method. The spread of the jackknife is a **pessimistic** estimate for the same reason a leave-one-out residual is, and pessimistic is the right way for an error estimate to be wrong.

More usefully, the spread measures something specific and defensible: how much the answer at this location depends on the presence of any single well. If the answer swings by seven metres when one of six wells is removed, the answer is not tightly determined by six wells, and that is a fact about the map rather than an assumption about the geology.

## Worked example

Which two wells would you expect to matter most at a location in the far southwest of the field, near (700, 1200)?

Ekene-5 at (600, 1900) and Ekene-1 at (1000, 1000), the two nearest wells, at about 700 m and 360 m respectively. A jackknife at that location would show large moves on removing either and small moves on removing Ekene-2 or Ekene-4 in the east.

The general pattern is that the dominant wells are the nearest ones plus any well that anchors an extreme, which on this field is Ekene-4 at 1590 m. Both categories matter and only the first is obvious.

## Exercise

Run the jackknife at P-1 and state which single removal moves it most and by how much, then explain in two sentences why that well dominates and why the jackknife can be run for all six wells while leave-one-out could not.

As a self-check: removing Ekene-6 moves P-1 from 1542.6199 m to 1549.7084 m, a change of 7.09 m. Ekene-6 dominates because it is the only interior well and the nearest control to P-1 at 361 m, so it is the principal constraint on the surface there. The jackknife runs for all six wells because it samples a fixed interior location that stays inside the mask under every removal, whereas leave-one-out samples the removed well's own site, which falls outside the reduced hull whenever that well was a hull vertex.
