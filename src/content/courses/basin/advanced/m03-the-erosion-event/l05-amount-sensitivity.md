# Amount sensitivity

One event, four amounts: 0, 300, 600 and 900 m, all removed at 10 Ma. The panel runs them; this lesson tabulates them and extracts the two facts the capstone examiner wants you to own: the signature grows faster than linearly, and the reason lives in the Arrhenius exponent.

{{panel:bs-charge-explorer}}

## The table

| amount (m) | final Ro | signature | expelled (kg/m2) |
|---|---|---|---|
| 0 | 1.6151780693528823 | 0 | 8790.335784168848 |
| 300 | 1.6295732164506467 | 0.0143951470977644 | 9258.598763497212 |
| 600 | 1.6718288798752388 | 0.05665081052235643 | 10048.985378825158 |
| 900 | 1.7681223140036129 | 0.1529442446507306 | 11219.679224563748 |

Doubling the amount from 300 to 600 multiplied the signature by 3.94. From 600 to 900, a further factor of 2.70 for fifty percent more section. Per metre: the first 300 m are worth 0.000048 of Ro each, the second 300 m 0.00014, the third 0.00032. Erosion signatures are convex in the amount.

## The mechanism

Each additional slab of phantom section deepens the hot decade further, and temperature's effect on the drain rate is exponential. The Professional tier's factor-of-five per ten degrees applies directly: 300 m of extra section is roughly 5 degrees of extra decade temperature under the local gradient, so each 300 m increment multiplies the decade's differential reaction rate by about 2.2, and the increments compound. Linear thinking about erosion amounts is wrong in the direction that matters for exploration: large vanished sections are disproportionately visible, small ones disproportionately invisible.

The expelled column has its own arithmetic, module 4's, but note its shape here: also convex, and never zero even at amount zero, because expulsion happens with or without the event. The event's charge contribution, the difference from 8790.335784168848, more than doubles from 300 to 600.

## The inverse problem's error bars

Convexity is good news for inverting big events and bad news for small ones. Suppose measured maturity constrains the signature to 0.057 plus or minus 0.01, laboratory scatter. Reading the table's curve, the amount recovers as 600 m with roughly plus or minus 50 m: the steep local slope, about 0.0002 of Ro per metre around 600, converts modest Ro precision into tight section estimates. The same 0.01 of Ro uncertainty around a 300 m event, where the slope is 0.00009 per metre, spans well over 100 m of amount. And below roughly 150 m this fixture's signature sinks under scatter entirely: sections that small are kinetically invisible here, and honest studies say so rather than reporting a number.

One more inversion caveat, inherited from the previous lesson: the curve is conditional on the event's date and the basin's history. This table inverts amounts for events at 10 Ma in this basin; an earlier event needs its own table, which is one more reason the panel runs live rather than memorising curves.

## Worked example

Interpolate the signature for a 450 m event, respecting convexity, then bound your error. Linear interpolation between 300 and 600 gives 0.0355; convexity says the true curve sags below its chords, so expect somewhat less, perhaps 0.030 to 0.033. For grading purposes the method is the answer: interpolate on the curve, correct in the direction convexity demands, and state the correction's sign. A learner who reports 0.0355 with no comment has read the table but not the module.

## Exercise

Compute the two signature growth factors from the table, and the per-metre worth of the third 300 m increment. Then answer in one sentence: why are small erosion events harder to recover from maturity than large ones, beyond mere measurement scatter?

As a self check: $0.05665081052235643 / 0.0143951470977644 = 3.94$ and $0.1529442446507306 / 0.05665081052235643 = 2.70$; the third increment is worth $(0.1529442446507306 - 0.05665081052235643)/300 = 0.00032$ of Ro per metre. Small events are structurally harder because the signature's slope shrinks with amount, so near zero the maturity response per metre is smallest, and the exponential mechanism that makes big sections loud makes small ones quiet.
