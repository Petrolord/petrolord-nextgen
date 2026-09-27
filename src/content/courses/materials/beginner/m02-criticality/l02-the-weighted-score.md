# The weighted score

{{panel:materials-register-calculator}}

With criteria, weights and scores stated, the engine turns each item into one number: the weighted score. This lesson works that number by hand for a few Ekene items, so the calculator's figure is never a mystery.

## One criterion's contribution

A criterion contributes its weight times the item's score, divided by the score scale. On the Ekene policy the scale is 5. The ESP motor scores 3 on safety, so safety contributes 40 times 3 over 5, which is 24.000000. It scores 5 on production, 5 on lead time and 4 on redundancy, so those contribute 30.000000, 20.000000 and 8.000000. The weighted score is the sum of the contributions: 82.000000.

Because each weight is a percentage and each score is divided by the scale, the weighted score runs from 0 to 100. An item scoring the maximum on every criterion reaches 100; one scoring 0 on every criterion stays at 0.

| id | safety | production | lead time | redundancy | weighted score |
| --- | --- | --- | --- | --- | --- |
| ESP-MTR | 24.000000 | 30.000000 | 20.000000 | 8.000000 | 82.000000 |
| WH-MV | 40.000000 | 24.000000 | 16.000000 | 6.000000 | 86.000000 |
| CHK-BEAN | 16.000000 | 24.000000 | 8.000000 | 6.000000 | 54.000000 |
| CSG-958 | 16.000000 | 12.000000 | 12.000000 | 2.000000 | 42.000000 |
| BARYTE | 8.000000 | 12.000000 | 8.000000 | 2.000000 | 30.000000 |

The contributions tell you why an item lands where it does. The wellhead master valve tops the register at 86.000000, and 40.000000 of that comes from its safety score alone. Baryte scores low everywhere, and its largest contribution is production at 12.000000.

## The rule in the engine's words

The engine states the rule in its basis, verbatim:

> weighted score = sum of weight x score / 5 over 4 criteria; classes V at or above 70, E at or above 44, D at or above 0; compared at 12 significant digits

The last clause matters. A computer holds decimal figures in binary, so a sum that should be exactly 70 can come out a hair below it. The engine therefore compares figures at 12 significant digits: two figures that agree to 12 significant digits tie. That is a stated choice of the engine; the alternative is an exact comparison of the stored numbers. On a stated case with three weights of 33.3, 33.3 and 33.4 and a score of 7 out of 10 on each, the stored sum falls a hair short of 70, reads as 70, and the item is class V. The engine's reason, verbatim:

> T: weighted score 70 is at or above 70, the minimum for class V

## Scores inside the scale

Every score must lie from 0 to the stated scale, and every criterion must be scored. On a stated case scored out of 10, a score of 11 is refused:

> items[0].scores.s must be a number from 0 to scoreMax 10; got 11

A missing score is refused the same way, with the value printed as undefined:

> items[0].scores.p must be a number from 0 to scoreMax 10; got undefined

A score under a key the policy does not name is refused on that key, with the stated criteria listed:

> items[0].scores.q is not a criterion; the criteria are s, p

## Exercise

Open the register calculator in "Criticality classes" on the Ekene start. Work the weighted scores of GL-VALVE and COMP-RP by hand from the scores in the box, criterion by criterion, then check both against the contributions the panel prints. Next, start from "Twelve significant digits" and read the item's score and reason. Last, return to the Ekene start, change one of BARYTE's scores in the box to 6, and copy the refusal.
