# Unity passes

{{panel:hy-protection-chemicals}}

A mixture index of 1.000000 gives exceeds false. The golden's over-unity case, 1.100000, gives exceeds true. The teaching mixture at 1.059500 exceeds, and the published example at 0.925000 does not. The line sits at exactly one, and one itself is on the passing side.

| index | exceeds |
| --- | --- |
| 0.925000 | false |
| 1.000000 | false |
| 1.059500 | true |
| 1.100000 | true |

## The judgement call, by name

The engine's judgement call J7 reads: a mixture index of exactly 1 passes. The regulation says the index "shall not exceed unity", and an index equal to unity has not exceeded it. The engine reads the words as written: exceeds is true only when the index is strictly greater than 1.

The Associate tier met the same kind of choice at a noise dose threshold, where the engine's call J2 makes the threshold inclusive, so a period sitting exactly on it counts. Both calls read the boundary the way the source's wording implies, and both are stated by name so a reader can check them.

## Why a boundary needs a named rule

The course states J7 and prints no reason for stating it, so read this paragraph as the instructor's. A boundary rule matters only for inputs that land exactly on the boundary, and in field measurement that almost never happens by chance. It happens when figures are rounded, since an index computed from rounded concentrations can land on 1.000000 where the unrounded figures would not, in either direction. Carrying the terms at full precision makes that outcome negligible.

## What the flag does and does not tell you

The flag is a comparison, and this course lists verdict words among the things it never grades. An index of 1.000000 passes by the rule and sits at the very edge of the allowance. An index of 0.925000 also passes and leaves some room. As a matter of practice, a report that writes "passes" for both leaves the reader without the margin, so quote the index to the precision the engine prints and let the reader see it.

The course's capstones are built so that no input sits on a judgement call's boundary, and none lands exactly on unity. You meet J7 here so that you can recognise it in a real survey, where the rule will one day decide a row.

## The other direction

An index above 1 means the mixture has used more than its whole combined allowance under the additive model. It does not tell you which component to control first. For that, go back to the terms, which show where the combined allowance is being spent. On the teaching mixture acetone carries 0.385000, toluene 0.362500 and xylene 0.312000, so no single component explains the excess and any plan to control it has to consider all three.

## Exercise

Open the protection panel's mixture view and enter a mixture whose terms sum to exactly 1.000000. Record the index and the exceeds flag. Then raise one concentration slightly and record both again. Name the judgement call that decides the first result, and write one sentence saying why a report should quote the index beside the flag.
