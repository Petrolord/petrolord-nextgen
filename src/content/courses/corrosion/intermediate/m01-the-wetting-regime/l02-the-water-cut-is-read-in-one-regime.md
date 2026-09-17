# The water cut is read in one regime

{{panel:fc-rate-explorer}}

The water cut box sits on the screen all the time and the engine reads it in
exactly one of the three regimes. In the intermittent regime the water cut
becomes the wetting factor directly. In the water-wet regime the factor is
1.000000 whatever the water cut says, and in the oil-wet regime the factor is
0.000000 whatever it says. A learner who moves the box in the wrong regime and
sees nothing happen has found a real property of the model rather than a fault
in the screen.

| regime | water cut | wetting factor | rate mm/yr |
| --- | --- | --- | --- |
| waterWet | 0.370000 | 1.000000 | 1.676428 |
| intermittent | 0.000000 | 0.000000 | 0.000000 |
| intermittent | 0.370000 | 0.370000 | 0.620278 |
| intermittent | 1.000000 | 1.000000 | 1.676428 |

## Read the first and the last row together

At a water cut of 0.370000 the water-wet regime returns a wetting factor of
1.000000 and a rate of 1.676428 mm/yr, and the intermittent regime at a water
cut of 1.000000 returns the same factor and the same rate. The two regimes meet
at the top of the intermittent range, which is what makes the intermittent
regime an interpolation between the other two rather than a third mechanism.
At a water cut of 0.000000 the intermittent regime gives a wetting factor of
0.000000 and a rate of 0.000000 mm/yr, which lands on the oil-wet answer from
the other end.

## The box is range checked where it is read

Inside the intermittent regime the water cut is checked against nought to one,
which is one of the four range guards this module actually enforces. A water
cut of 5 refuses:

> the water cut fraction must be between 0 and 1: 5 is outside it

A water cut of -0.1 refuses with the same message shape, and a water cut that
is not a finite number refuses as well:

> the intermittent regime needs a finite water cut fraction

## One absent input still reaches a default

The water cut argument carries a default parameter of one in the engine
signature. An argument that is genuinely missing, rather than not-a-number,
therefore becomes a water cut of one hundred percent in the intermittent
regime. Measured with the key omitted, the wetting factor is 1.000000 and the
rate is 1.676428 mm/yr, which is the water-wet answer. A water cut typed as
not-a-number refuses, and not-a-number is what the studio layer produces from a
blank box, so the live app does not reach the default. A direct caller that
leaves the key out does.

The direction of that default is conservative, because a wetting factor of
1.000000 is the most limiting value the regime can take. That is why it is
recorded as a property worth knowing rather than treated as a fault. Knowing
which way a default points is the useful habit here, and this module has one
default pointing each way.

## Exercise

Set the regime to intermittent and record the wetting factor and the rate at
water cuts of 0.000000, 0.370000 and 1.000000. Then switch to water wet and
record the factor and the rate at a water cut of 0.370000. State which of your
water-wet figures matches one of your intermittent figures, and say which water
cut it matches at.
