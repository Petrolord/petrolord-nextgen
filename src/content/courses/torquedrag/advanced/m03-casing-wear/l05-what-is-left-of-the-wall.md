# What is left of the wall

The output that matters, and the joint it applies to.

{{panel:td-buckling-explorer}}

## The profile

The engine walks the casing in 30 m intervals from surface to the shoe. For each it takes the side force at the midpoint, computes the wear volume over that length, converts to an area and then to a depth, and reports what is left of the wall.

## The bottom five intervals

| interval | side force | wear depth | wall loss |
|---|---|---|---|
| 1050 to 1080 m | 9.560276823952945 kN | 2.3274141344562405 mm | 19.41323680815628 percent |
| 1080 to 1110 m | 11.608530969694288 kN | 2.6585199168740026 mm | 22.175029334662373 percent |
| 1110 to 1140 m | 13.51780249337791 kN | 2.951863222303518 mm | 24.62184057039502 percent |
| 1140 to 1170 m | 15.250929596559546 kN | 3.20781152762479 mm | 26.75673568351119 percent |
| 1170 to 1200 m | 16.774178931578604 kN | 3.4259056218767463 mm | 28.575884341024505 percent |

The side force rises steadily toward the shoe, and the wear follows it, though not proportionally: the side force rises 75 percent across these five intervals and the depth rises 47 percent, because of the crescent.

## Why the shoe joint is worst

Because the casing shoe on this well is at 1200 m, which is where the build below it begins. The side force in the cased section is the tension-times-curvature term ramping up as the hole starts to turn.

That is the general case. Wear concentrates just above the shoe, and just below any dogleg inside the casing.

## The number to report

Wall loss as a percentage, not depth in millimetres.

A 3 mm groove in a 12 mm wall and a 3 mm groove in a 20 mm wall are entirely different situations, and the percentage carries the comparison the depth does not.

## The threshold

Industry practice varies, and a common trigger for concern is around 10 percent wall loss, with 20 percent as a level requiring evaluation.

The case here reaches 28.575884341024505 percent, which would be a finding rather than a routine result. It comes from 50 hours of rotation with a high side force in the casing, which is a demanding but not unrealistic scenario.

## What the loss does

**Burst.** Roughly proportional to wall thickness, so a 28 percent wall loss is roughly a 28 percent burst derating.

**Collapse.** Much more than proportional: collapse resistance falls faster than wall thickness because it depends on the diameter-to-thickness ratio.

**Fatigue.** A groove is a stress concentration.

The engine reports a derated burst if a burst rating is supplied, and it does not attempt collapse, which needs a different formula.

## Exercise

Compute the ratio of side force to wear depth for the first and last of the five intervals above.

They are not equal. Explain why using the crescent, and say which of the two ratios would be the right one to extrapolate a deeper interval with.
