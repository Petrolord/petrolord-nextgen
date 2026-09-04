# The scan fails before the slope test

The clever part of the routine is not the part that breaks. The plain part in front of it is.

{{panel:pd-node-explorer}}

## Two stages

Detection walks a grid and finds intervals where the residual changes sign. Classification refines each bracket and asks whether the crossing holds: negative to positive as rate rises is stable, because a nudge upward makes the tubing want more than the reservoir gives. Positive to negative is the heading branch, where a well cannot rest.

## Classification resolves 20 stb/d without difficulty

`analyticResidualWide` has a parabolic residual, so both crossings and both stability signs are exact algebra with no search anywhere in the oracle: 800.000000 and 1200.000000 stb/d, 400 stb/d apart, correctly labelled unstable and stable. Pull them to 20 stb/d apart in `analyticResidualPinched` and the labels come out as cleanly: 990.000000 stb/d at 2037.856191 psia unstable, 1010.000000 stb/d at 2014.429848 psia stable.

## Detection gives way at 51.179487 stb/d

On that same instrument the default 40 point scan has a spacing of 51.179487 stb/d and returns dead with zero crossings. At 100 grid points, spacing 20.161616 stb/d, still dead. Only at 110, spacing 18.311927 stb/d, does it report flowing with an operating rate of 1010.000000 stb/d. Classification would have handled that separation at any count, and was never given the chance.

## The reversal is a signature

Choked FORCADOS-3, window 57.851719 stb/d, is found at nGrid 40 with a spacing of 105.837892 stb/d, lost at 50 with 84.238322 stb/d, found again at 60 with 69.960640 stb/d. No classification rule behaves like that: a stability criterion inspects the residual around the root and gives the same label whichever grid delivered it. Only an alignment test can be non monotone in the count, so a verdict that flips back and forth under refinement identifies its own culprit.

## Find the fragile stage first

A pipeline is as reliable as its weakest stage. Here that is a sign change test, the least sophisticated thing in the routine, and tightening the stability criterion would not change a single dead verdict. Hardening the stage you understand best is the expensive general mistake, because it is the one you have already thought hardest about.

An independent check costs one comparison: a stable crossing must sit right of the tubing minimum. BONNY-7's sits 728.644315 stb/d right and 585.899719 psi above a minimum at 627.069742 stb/d and 1476.243252 psia; FORCADOS-3's sits 281.389786 stb/d right and 18.717814 psi above one at 1843.619418 stb/d and 2348.191408 psia. Both on the friction limb, one of them barely, which the stable label does not say.

## Exercise

Put the pinched instrument at 40 grid points and record the status, then at 400 and record both crossing rates and labels.

Name the stage that changed its answer and the stage that did not, giving the separation in stb/d the second one resolved without difficulty.
