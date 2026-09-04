# Working the capstone

One stage, read in a fixed order. Every step is a check on the step before it, and skipping one hides the failure of the others.

{{panel:pd-stage-explorer}}

## Step one: establish the curve before reading anything from it

Four things define it: the points, the published rate range, the reference frequency and the curve specific gravity. The published golden curve is five points from 1500 to 3500 bbl/d at 60 Hz on a 1.0 gravity fluid. Below three points there is no curve at all: the fit returns ok false, no head fit, and the message that a stage curve needs at least three points from the vendor curve.

## Step two: check the fit against its own threshold

The transcription warning fires when the head fit residual exceeds two percent of the tallest published head point. On this curve that threshold is 0.640000 ft and the residual is 0.0534522484 ft. A residual of 0.58797473 ft would still be under it, and would still shift the reading at 2500 bbl/d from 27.914286 ft to 26.942857 ft. Read the residual as a number against a threshold, never as a warning count.

## Step three: find the best efficiency point

2635.0000 bbl/d, 26.992525 ft, 0.739054805 fraction, off a 400 step scan at 5.0000 bbl/d spacing. Every region word later in the work is graded against that rate at 0.75 and 1.25 of it.

## Step four: map the duty rate back to the reference speed

Do this before reading, and by hand. At 50 Hz, 2500 bbl/d is 3000.000000 bbl/d on the 60 Hz curve. At 40 Hz, 3200 bbl/d is 4800.0000 bbl/d. The frequency you set is never the rate the curve is read at.

## Step five: compare that equivalent rate against the published range yourself

Not against the flag. The published high is 3500 bbl/d, so 4800.0000 bbl/d is 1300.0000 bbl/d outside it. The flag will say false and stop there; the distance is the number that decides whether the reading is worth anything.

## Step six: read the three, then check the third against the first two

Head off the head cubic, efficiency off the efficiency cubic, brake power built from head, efficiency, rate and gravity through 135635.80083124. Power is the only one that carries both other errors, so it is checked last and trusted least.

## The traps

**Reading the duty rate on the reference curve.** At 50 Hz that gives 27.9142857143 ft where the stage makes 16.70634921 ft.

**Taking the range flag as a gate.** It reads the same 100 bbl/d past the data and 1300.0000 bbl/d past it.

**Taking zero warnings as clean.** A design at 40 Hz can return 445 stages against 264 with no warning at all.

**Quoting the peak efficiency at a duty.** 0.739054805 sits at 2635.0000 bbl/d, not at 2500 bbl/d where the reading is 0.73657143.

**Mixed units.** bbl/d, ft of head, hp, Hz, and psia rather than the gauge form.

## Exercise

Work one duty in that order, writing each step down before taking the next.

Then repeat it at a rate outside the published data and mark the first step at which you had to make a judgement the engine did not make for you.
