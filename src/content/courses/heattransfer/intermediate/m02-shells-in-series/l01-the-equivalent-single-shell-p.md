# The equivalent single-shell P

Shells in series are not handled by a second closed form. They are handled by a conversion. The whole unit P is converted into the P that a single shell inside the train would see, and then the same one shell closed form is read at that smaller value. The engine reports the converted number on the answer, on a key of its own, so the value the closed form was actually read at is visible rather than implied.

## The conversion itself

For N shells in series at a whole unit P and R, the engine first forms

    S = ((1 - P R) / (1 - P))^(1/N)

and then takes the equivalent single-shell P as

    P1 = (S - 1) / (S - R)

Where R is 1 that quotient has no value, and the limit is used instead: P1 = P / (N - P (N - 1)). Both are one line in a spreadsheet, and either one reproduces the equivalent single-shell P column of the two tables below from its P, R and shell count.

## One duty bought with more shells

At a P of 0.720000 and an R of 0.850000, one shell pass is refused outright. From two shells upward the same duty is reachable, and this is what the conversion does to it.

| shells in series | equivalent single-shell P | F |
| --- | --- | --- |
| 2 | 0.541514 | 0.800677 |
| 3 | 0.433686 | 0.920456 |
| 4 | 0.361625 | 0.956604 |
| 5 | 0.310086 | 0.972592 |
| 6 | 0.271401 | 0.981100 |

Read the middle column downward first. The equivalent P falls as shells are added, and that is the whole mechanism: each shell in a longer train is asked to do less of the total temperature change, so each one sits lower on the correction curve, where the factor is nearer one. The third column then follows from the second by the same closed form the first module of this tier read.

Read the last column downward second, and read it for direction only. The factor rises as shells are added. The engine computes no ratio between any two of those rows, so a reader who divides one by another has produced a figure that nothing in this module stands behind. What the column is entitled to say is the direction: more shells in series buy more driving force out of the same four temperatures.

{{panel:fc-coefficient-explorer}}

## The published cases, at an R away from one

| P | R | shells | equivalent single-shell P | F | golden F |
| --- | --- | --- | --- | --- | --- |
| 0.600000 | 1.000000 | 2 | 0.428571 | 0.897945 | 0.897945 |
| 0.750000 | 1.000000 | 3 | 0.500000 | 0.802278 | 0.802278 |
| 0.700000 | 0.500000 | 2 | 0.485576 | 0.947601 | 0.947601 |
| 0.450000 | 1.500000 | 2 | 0.316280 | 0.926208 | 0.926208 |
| 0.800000 | 0.600000 | 3 | 0.483917 | 0.932636 | 0.932636 |
| 0.300000 | 2.500000 | 2 | 0.211516 | 0.948089 | 0.948089 |
| 0.550000 | 0.800000 | 4 | 0.219343 | 0.989954 | 0.989954 |

Five of those seven sit at an R away from one, which is deliberate. The conversion is algebraically easiest to get wrong away from R equal to one, and a case set that only carried the R equal to one branch would leave the general one unexercised. Notice also that the shell counts in the table are not all the same. Two, three and four shell trains all appear, so the conversion is exercised at more than one count as well as at more than one R.

The golden column is the evidence in that table. It is written by the oracle, which marches the shells in series and recovers the whole unit P from the march rather than converting anything, so it never evaluates the conversion at all. Two routes meeting on all seven rows is the reason this conversion can be trusted.

## What to carry away

The number to quote about a multi-shell train is always a pair. The whole unit P, which is a property of the duty and the four temperatures, and the equivalent single-shell P, which is a property of the train that was chosen to deliver it. Quoting one of those and calling it the other is exactly the mistake this key exists to prevent, and it is an easy mistake to make because both are called P.

## Exercise

Record the equivalent single-shell P and the factor at two, four and six shells from the first table, with the P and R they were computed at. Then take two rows of the published table and say what the agreement between the engine and the golden column is evidence of.
