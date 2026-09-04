# What makes a crossing hold

Nudge the rate. If the well comes back, the crossing holds.

{{panel:pd-node-explorer}}

## The mechanism

At any rate, a positive residual means the tubing wants more than the reservoir has, so the well slows. A negative residual means surplus, so the well speeds up. The residual's sign at a rate tells you which way the well moves from there.

A crossing holds when the movement is back towards it from both sides.

## The crossing that holds

FORCADOS-3's operating point is 2125.009203 stb/d at 2366.909222 psia.

Just above it the residual is on its way to +3284.465003 psi, so the well slows back. Just below it the residual is negative, heading for a minimum of -509.628610 psi at 985.078572 stb/d, so the well speeds up. Both departures decay.

BONNY-7's single crossing at 1355.714057 stb/d behaves the same way: negative below, reaching -989.578610 psi at 477.119848 stb/d, and climbing to +12517.903995 psi beyond.

## The crossing that does not

FORCADOS-3's other crossing is 234.488087 stb/d at 3570.828888 psia.

Below it the residual is positive, rising to +575.820837 psi at 4.135950 stb/d, so the well slows further, with nothing beneath to catch it. Above it the residual is negative, so the well runs up to 2125.009203 stb/d. Both departures grow.

## The rule, and why it is always this way

Reading with increasing rate: negative below and positive above, the crossing holds, because the residual is increasing through zero. Positive below and negative above, it does not.

The residual is zero at both kinds, which is why nothing measured at the crossing can settle it. The verdict lives entirely in the neighbourhood.

A dip descends through its first root and ascends through its second, so on any two crossing well the lower crossing fails and the upper holds, every time. The goldens carry it: compositeTwoCrossings at 44.984487 stb/d marked stable no and 1787.246675 stb/d marked stable yes, analyticResidualWide at 800.000000 and 1200.000000 stb/d, analyticResidualPinched at 990.000000 and 1010.000000 stb/d. In the parabola cases both roots and both signs are exact algebra with no search anywhere in the oracle.

## Three ways to get it wrong

Checking which side of the tubing minimum the well is on. Both teaching wells are to the right, both are stable, and the correlation is not the test.

Checking the size of the residual. FORCADOS-3's -509.628610 psi describes the middle of the window, not either crossing.

Testing a neighbourhood that contains both crossings. FORCADOS-3 reads +575.820837 psi at 4.135950 stb/d and +3284.465003 psi at the top: same sign, no crossing detected, on a well with two.

## What it does not cover

Small is doing work. FORCADOS-3's upper crossing is stable against disturbances that leave the well inside its window of 1890.521117 stb/d and against nothing larger. A shut-in is outside every window there is.

There is no time in it, so no rate of decay and no settling period.

## Exercise

Read the residual just below and just above each of FORCADOS-3's crossings and write the four signs in order of increasing rate.

Then say which crossing the well returns to from inside the window, and what it does below the lower one.
