# The studio case end to end

This is the case the Heat Exchanger & Cooling Studio opens with. Every figure below is on that screen, which makes it the one case in this course you can check against a live application rather than against a page. Work it once in order and the tier is done.

{{panel:fc-exchanger-explorer}}

## The chain, in order

| quantity | value |
| --- | --- |
| hot capacity rate, Btu an hour per degF | 27500.0000 |
| cold capacity rate, Btu an hour per degF | 80000.0000 |
| duty, Btu an hour | 2750000.0000 |
| cold outlet, degF | 134.375000 |
| log mean driving force, degF | 130.064846 |
| U dirty, Btu an hour per ft2 per degF | 92.110348 |
| area required, ft2 | 229.543151 |
| tubes | 74 |
| tubes a pass | 37 |
| actual area, ft2 | 232.477856 |
| area overshoot, percent | 1.278498 |

Read it downwards and each line is a door you have opened already. Two capacity rates from two mass flows and two heat capacities. A duty and a cold outlet from a stated hot outlet. A log mean from four terminals under the counter arrangement. A surface from the duty, the coefficient and that log mean, with the correction factor at one. A count from the surface and the surface of one tube, rounded up twice. Then the actual surface and its margin.

## What else is on the screen

The studio reports more than the chain above, and the rest belongs to the tiers after this one. It shows P at 0.171875 and R at 2.909091, which are the two dimensionless temperature groups a correction factor is written in. It shows a tube-side Reynolds number of 44051.846000, a Prandtl number of 15.119375, a regime of turbulent and an inside film coefficient of 547.762384. It shows U clean at 134.459410 beside U dirty, a fouling penalty of 31.495796 percent, a controlling resistance named as outsideFilm with insideFouling as its runner up, and the margin between those two at 51.612903 percent.

Those are real answers and none is needed to follow the chain. They are listed so the screen is not a surprise, and so you can see where the next two tiers pick the story up.

## The self-consistency check

The chain can be closed on itself, and this is the check that catches a loop which has not settled. Multiply the coefficient by the area required, by the correction factor, by the log mean. On this case that gives 2750000.0000 Btu an hour, against a duty of 2750000.0000 Btu an hour.

That is not a new result. It is the same equation the area came out of, run backwards. Which is exactly why it is useful: if the four figures on a screen do not reproduce the duty, one of them has been left behind by an input that moved, and the screen is showing you a state that never existed.

One caution. Use the area required rather than the actual area. The actual area is larger, because the count was rounded up, so multiplying it through gives more than the duty. That is the overshoot arriving where you may not expect it.

## Which number came from where

Every figure on that table was computed. The chosen figures sit behind it: the two inlets, the two mass flows, the two heat capacities, the hot outlet, the tube geometry, the passes, and the films and fouling allowances behind the coefficient. The correction factor is one because the arrangement is counter, and that is the engine deciding rather than anybody typing.

## Exercise

Work the whole table from the inputs, in the order the lines are printed, without looking at any value until you have produced it. Then run the self-consistency check. Finally, name the chosen figures the whole table was worked from.
