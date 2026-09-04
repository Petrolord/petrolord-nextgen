# The story so far

Five modules, one stage, and not a foot of tubing or an amp of current anywhere in them.

## A stage is five points and two fits

The published vendor curve carries five rate and head pairs, 32.0000 ft at 1500 bbl/d, 30.5000 at 2000, 28.0000 at 2500, 24.0000 at 3000 and 19.0000 ft at 3500, with efficiencies of 55.00, 68.00, 74.00, 72.00 and 65.00 percent. Its published range is 1500 to 3500 bbl/d, its reference frequency 60 Hz, its curve specific gravity 1.0.

Head and efficiency each get a least squares cubic. Four coefficients cannot pass through five points, so the head fit misses every one of them, by -0.01428571, 0.05714286, -0.08571429, 0.05714286 and -0.01428571 ft, for a residual of 0.0534522484 ft against a transcription threshold of 0.640000 ft.

## The best efficiency point is scanned, not solved

A 400 step scan of the efficiency fit across the published range, at a spacing of 5.0000 bbl/d, returns 2635.0000 bbl/d, 26.992525 ft and 0.739054805 fraction. The rate is a grid point. The region words come off it: recommended unless the reference rate falls below 0.75 of that rate or rises above 1.25 of it.

## One duty, three readings

At 2500 bbl/d and 60 Hz the stage gives 27.914286 ft and 0.73657143 fraction, and 0.69851755 hp on a 1.00 specific gravity fluid against 0.62866580 hp on a 0.90 one. Head and efficiency do not move with the fluid, and neither moves with speed once the duty rate has been mapped back to the reference speed: 2500 bbl/d at 50 Hz is 3000.000000 bbl/d on the 60 Hz curve, reading 0.7222857143 either way.

## And the edge, which is the point of the tier

At 3500 bbl/d the reading is inside the published data. At 3600 bbl/d it is not, and the head goes 18.98571429 ft then 17.82571429 ft across that line. Nothing else changes. The head fit does not reach zero until 4806.6229 bbl/d, 1306.6229 bbl/d past the end of the data, and every rate in between returns a positive, plausible, unusable number.

The golden set carries its own example: 40 Hz at 3200 bbl/d, 4800.0000 bbl/d on the reference curve, 0.052063492056 ft and 0.004290703685 hp, flagged and answered.

## What this tier does not answer

How many stages, what the well requires of them, and what the motor draws to turn them. There is no intake, no gas, no cable and no clock in any of it.

## Exercise

Write the four things that define this stage from memory: its points, its range, its reference frequency and its curve gravity.

Then write the three numbers they produce at 2500 bbl/d and 60 Hz, and the one rate at which the head fit reaches zero.
