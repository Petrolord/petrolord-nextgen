# Working the capstone

Six numbers from three wells, and the order to take them in.

{{panel:td-string-explorer}}

## What is asked

1. The buoyancy factor in 1500 kg/m3 mud.
2. The vertical well's hookload while tripping out.
3. The slant well's pick-up hookload.
4. The slant well's slack-off hookload.
5. The difference between those two.
6. The horizontal well's slack-off hookload, which is negative.

## The settings

**Every well** uses its own survey, the shared string, friction 0.25 cased and 0.35 open hole, 120 rpm, 0.3 m/s trip speed, 89000 N weight on bit, 2700 N.m bit torque, and the engine's default 10 m step.

**The mud is 1500 kg/m3, not the 1440 the lessons run on.** That single change is deliberate and it runs through the whole capstone at every tier: every graded number here is one you have to produce rather than one a lesson printed. A heavier mud is also a real question somebody asks on a real well, and this is what the answer looks like.

**Pick up** is `trip_out`. **Slack off** is `trip_in`. Neither is on bottom, so the weight on bit and the bit torque do not enter any of fields 2 through 6.

**Field 1** needs no engine run at all. Steel density is 7850 kg/m3.

## The order

Field 1 first, by hand. It is one division and one subtraction, and everything else depends on it.

Field 2 second, because it has a closed form. Compute the string's buoyed weight from the component table, then run the engine and confirm the two agree to nanonewtons. If they do not, something in your setup is wrong and every other field would inherit it.

Fields 3 and 4 next, from the same well, one run each.

Field 5 is the difference of the two you just computed. Take it from the full-precision values rather than from rounded ones.

Field 6 last, and check its sign.

## The traps

**Field 1's tolerance is tight.** It is graded to 5e-7, so four decimals will not pass. Carry the full division, and do it at 1500 rather than at the 1440 the lessons used.

**Field 2 is the free-hanging weight, not the total buoyed weight.** On this well they are the same because the hole is vertical. On any other well they would not be, and answering with the total buoyed weight would be right here for the wrong reason.

**Field 5 is a difference of two full-precision numbers.** Rounding fields 3 and 4 to the nearest newton before subtracting introduces an error of up to a newton, and the tolerance is half of one.

**Field 6 is negative.** A sign dropped here gives a plausible small positive number, and small positive is exactly what someone expects a horizontal slack-off to be.

**Do not use rotate-off-bottom for field 4.** Slack off is tripping IN. Rotating off bottom on the slant well gives a value between the two answers, and it would look entirely reasonable.

## What to notice while you work

The slant well's pick-up hookload exceeds its buoyed string weight and the build-and-hold well's does not. That crossover is the point at which the wall starts carrying more of the string than friction adds, and the heavier mud moves it.

Field 6 is the whole reason the horizontal well is in the fixture set.

## The precision

Full precision, tight tolerances, for the reason every capstone in this series gives: the grader is checking that the calculation was run rather than estimated.

## Exercise

Work fields 1 and 2 by hand from the component table before opening the panel, then compare.

Any disagreement is in the string description or in the buoyancy factor, and it is worth finding, because every number in the next two tiers is built on both.
