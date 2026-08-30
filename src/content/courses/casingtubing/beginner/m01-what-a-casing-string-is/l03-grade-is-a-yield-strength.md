# Grade is a yield strength

The letter is a manufacturing route. The number is the only thing the formulas see.

{{panel:ct-rating-explorer}}

## The naming

An API casing grade is a letter and a number, such as L-80 or P-110. The number is the minimum yield strength in thousands of pounds per square inch. The letter carries the manufacturing route and the chemistry, and with it the impact toughness, the sulphide stress cracking resistance and the maximum hardness.

## The ten grades in this catalog

| grade | yield (ksi) | yield (Pa) |
|---|---|---|
| H-40 | 40 | 275790280 |
| J-55 | 55 | 379211635 |
| K-55 | 55 | 379211635 |
| M-65 | 65 | 448159205 |
| L-80 | 80 | 551580560 |
| N-80 | 80 | 551580560 |
| C-90 | 90 | 620528130 |
| T-95 | 95 | 655001915 |
| P-110 | 110 | 758423270 |
| Q-125 | 125 | 861844625 |

## Three pairs that share a number

J-55 and K-55 both yield at 55 ksi. L-80 and N-80 both yield at 80 ksi. To this engine they are the same pipe, because the only property it reads is the yield strength.

They are not the same pipe to a metallurgist. L-80 is a controlled-hardness grade qualified for sour service and N-80 is not. Choosing N-80 where L-80 was specified is a real error that no rating calculation in this course will catch, because the difference does not appear in any of the four formulas.

## What the engine does with the grade

One lookup, `casingGradeYieldPa`, which returns a number of pascals or null. That number then goes into all four ratings. There is no other place a grade name enters the calculation.

## Minimum, not typical

The published yield is a MINIMUM. Real pipe from the mill runs above it, often well above. Every rating in this course is therefore a lower bound on what the joint will actually do, which is the right direction for a design number to be wrong in.

## Exercise

Open the panel on the 9-5/8 inch 47 lb/ft row and step through H-40, L-80 and Q-125, writing down the burst each time.

Divide each burst by the yield in pascals from the table above. You should get the same answer three times. Say what that constant is made of.
