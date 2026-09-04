# Onward

Two curves, and the three questions that follow: where they cross, how many times, and whether the crossing holds.

## What the Expert tier adds

**Where they cross.** BONNY-7 is the well behaved case: one crossing, 1355.714057 stb/d at 2062.142971 psia, sitting 728.644315 stb/d to the right of the tubing minimum on the rising friction limb. That position is what makes it a state the well can hold.

**How many times.** FORCADOS-3's dead column stands at 4310 psia, 590 psi above a reservoir at 3720 psia, so the difference between what the reservoir offers and what the tubing demands starts positive, crosses zero going down and crosses back going up. Two crossings: 234.488087 stb/d at 3570.828888 psia, and the operating point at 2125.009203 stb/d and 2366.909222 psia, a stable window 1890.521117 stb/d wide. The lower one is the heading branch, and a solver returning the first intersection it finds returns exactly that.

**Whether it holds.** Partly a question about the well, settled by comparing two slopes rather than two pressures. Partly one about the instrument: the node solver scans a grid of rates for a change of sign, at a documented default of 40 points, and sees a crossing pair only if one interval straddles the dip. The golden pinched case has a true window of 20.000000 stb/d, and reads dead at 40 points, dead at 100, flowing with two crossings at 110.

A finer scan is not a better scan either. FORCADOS-3 choked to 1469.15 psia at the wellhead has a true window of 57.851719 stb/d: a grid of 40 finds it, 50 loses it, 60 finds it again.

## Before you go

**Read the residual, not the picture.** A crossing is a zero of one number, the difference between what the inflow offers and what the outflow demands, and a sign is easier to read than an intersection.

**Everything from this tier stays in force.** The curve is still J shaped for the same reason, the minimum is still a reduction over samples, the ends still depend on the range, and the injection column still needs its step count stated.

## The one sentence

You can build an outflow curve and say what every reading off it depends on. The next tier adds a second curve, an intersection, and a working distrust of any instrument that reports a verdict without its residual.

## Exercise

Write the three questions of the next tier in order, and beside each the teaching well that demonstrates it and the number that makes the point.

Then explain how raising a scan from 40 grid points to 50 can turn a flowing well into a dead one, and say what you would check instead.
