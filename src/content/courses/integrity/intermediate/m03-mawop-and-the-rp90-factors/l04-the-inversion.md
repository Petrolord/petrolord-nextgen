# The inversion

One piece of steel, one depth, one pair of fluids, and two answers that differ by more than a factor of two. Nothing about the pipe changed. Only the role did.

{{panel:wi-annulus-explorer}}

## The sweep

Hold everything fixed. A limit of 40000000 Pa, a TVD of 1435.457478934607 m, 1200 kg/m3 in the annulus and 1030 kg/m3 behind the wall. Change only the role:

| Role | Factor | Rated limit, Pa | Allowable surface pressure, Pa |
| --- | --- | --- | --- |
| outer-casing-burst | 0.5 | 20000000 | 17606905.05541501 |
| inner-tubing-collapse | 0.75 | 30000000 | 27606905.05541501 |
| inner-casing-burst | 0.8 | 32000000 | 29606905.05541501 |
| shoe-formation | 1.0 | 40000000 | 37606905.05541501 |
| rating | 1.0 | 40000000 | 37606905.05541501 |

The strictest role is outer-casing-burst at 17606905.05541501 Pa. The loosest is shoe-formation at 37606905.05541501 Pa.

## Say the number

The spread across the five roles is exactly 20000000 Pa, which is the difference between the two rated limits, 40000000 Pa taken whole against 20000000 Pa taken at half.

The hydrostatic term is 2393094.944584991 Pa in every one of the five rows. It is the same column of fluid over the same vertical distance, so it cannot know what role you assigned. The factor is therefore the only source of the spread, and it passes into the allowable one Pa for one Pa.

Read as a ratio, the same steel at the same depth allows a little over twice as much surface pressure in its loosest role as in its strictest. That is the inversion. The limit you write on the operating card is a property of the role, not of the pipe.

## The ordering is not intuitive either

Notice that inner-tubing-collapse at 0.75 sits below inner-casing-burst at 0.8. The tubing is the smallest and thinnest string in the well, yet it is trusted more than the outer casing and slightly less than the inner casing.

The hierarchy tracks how well you can see the element and how bad an undetected failure would be. It does not track diameter, wall thickness or nominal strength, all of which are already inside the limit you supplied.

## What this obliges you to do

Assign the role deliberately, in writing, per candidate. A string that was inner casing while an outer annulus was monitored may become the outer string after a tieback, and the same steel then loses 20000000 Pa of rated capacity on paper.

## Exercise

Reproduce the sweep in the panel and confirm the strictest and loosest allowables.

Then reclassify one candidate on the published well from outer-casing-burst to rating, and state what you would have to prove to a regulator to justify that change.
