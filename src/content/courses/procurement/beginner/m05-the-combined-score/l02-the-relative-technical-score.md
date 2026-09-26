# The relative technical score

{{panel:pr-envelope-calculator}}

The commercial score gives 100 to the lowest evaluated cost. The relative technical score does the same from the other side: it gives 100 to the best technical proposal and scales every other bid against it. This lesson reads the rule, works it for the four responsive well services bids, and names the alternative.

## The rule

The engine's basis for the well services tender reads:

> St = 100 x T / Thigh with Thigh = 85

T is the bid's technical percentage from module 2, and Thigh is the highest technical percentage among the bids being scored. WS3, at 85.000000, sets Thigh and scores St of 100.000000. This is the technical term of the combined evaluation formula in the World Bank Standard Procurement Document, Request for Bids, Works, two-envelope (September 2025), Section III.

| bid | technicalPercent T | St = 100 x T / Thigh |
| --- | --- | --- |
| WS3 | 85.000000 | 100.000000 |
| WS1 | 82.500000 | 97.058824 |
| WS2 | 75.000000 | 88.235294 |
| WS5 | 70.000000 | 82.352941 |

Take WS5: 70.000000 divided by 85.000000, times 100, is 82.352941. Only the ratio to the best bid matters. Had every technical percentage been multiplied by the same factor, every St would be unchanged.

## Relative or absolute

The engine offers two technical methods and holds no default:

> technicalMethod must be 'relative' (100 x T / Thigh) or 'absolute' (T as scored); there is no default

The absolute method uses the technical percentage as scored. The relative method rescales so the best proposal reaches 100, which puts the technical and commercial scores on the same footing, since the lowest evaluated cost also scores 100. The well services tender states relative, and this tier works with it.

## Two refusals on the technical score

A technical percentage above 100 is refused, since no proposal can earn more than the whole available score:

> bids[0].technicalPercent must be a number from 0 to 100

If every bid scores zero technically, the relative method has nothing to divide by, and the engine says exactly that:

> bids all score 0 technically, so Thigh is 0 and the 'relative' technical score is undefined

## Only responsive bids are scored

Thigh is taken over the bids being ranked, which are the responsive ones. WS6's proposal was never scored and WS4's price was never opened, so neither is in the combined score and neither can set Thigh. Had WS6 signed its bid form, its stronger proposal would have moved Thigh, and every other bid's St with it. The relative score always depends on who else is in the evaluation.

## Exercise

In the envelope calculator choose "The combined score". Read the Thigh tile and the St column, and check WS1's St by hand. Then add ten points to every bid's technicalPercent, which is no common factor, and see which St figures change. Restore them. Switch the technical method to absolute and compare the St column with the technical percentages. Finally, set every technicalPercent to 0 with the relative method and read the refusal.
