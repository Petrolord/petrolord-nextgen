# What the tangential method costs

Twenty-five feet in two thousand, and where those feet went.

{{panel:wd-survey-explorer}}

## The number

On the published Applied Drilling Engineering example, the tangential method puts the bottom of the hole about twenty-five feet SHALLOWER than minimum curvature, and about forty-three feet FURTHER NORTH.

The panel computes both on the same twenty-one stations, so the difference is arithmetic rather than assertion. Read them off it.

## Where those feet go

**Twenty-five feet of TVD** is a real depth error at the bottom of the hole.

A reservoir top picked at that depth is at the wrong depth. A fluid contact mapped through that well is at the wrong depth. A pore pressure gradient computed from a pressure measured there is wrong by the pressure difference over twenty-five feet, which for a normally pressured well is about eleven psi.

Worse, the error is not confined to the bottom: it grows down the build, so the whole reservoir section is systematically shallow.

**Forty-three feet of northing** is a real position error.

That is comparable to a drilling target's radius. A well reported to have hit a target at a position forty-three feet from where it actually is has hit a different piece of rock than the one on the map, and the map gets adjusted to fit.

## The direction is the point

Both errors are one-signed, on every interval, on any build.

TVD too shallow, horizontal displacement too far. A field mapped with tangential surveys has its structure systematically shallow and its wells systematically too far out. Those are correlated errors across every well in the field, which is exactly the kind that does not average away and does show up as a structural map that nobody can quite tie.

## What it does not affect

Measured depth is measured, so it is unaffected. Inclination and azimuth are measured, so they are unaffected. Dogleg severity between two stations is a property of the two attitudes, so it is unaffected.

Only the INTEGRATED quantities move: TVD, north, east, vertical section, closure. Which is to say, all the ones a well plan is judged on.

## When you will meet this

Three situations, all real.

**An old offset well.** Its definitive survey may have been computed by an old method and never recomputed. Before using it for anti-collision, ask what method its position came from.

**A survey from a service provider whose software you do not know.** Ask. It is a one-line question and every provider can answer it.

**A spreadsheet.** Home-made survey calculators are common, and the tangential method is the one somebody writes first because it is the one line of arithmetic that seems obvious.

## The check that catches it

Take the station list and compute it two ways. If the second method is available, use it; if not, compute the balanced tangential by hand, since it is two lines.

If the two answers differ by more than a foot or so over a build section, one of them is a tangential calculation. The panel does exactly this and shows all four side by side.

## The misconception to avoid

"Twenty-five feet is within the survey uncertainty anyway." It is not, and even if it were, it would still be wrong to accept it: the uncertainty model in the Professional tier describes a random error about a correctly computed position. A method bias is a shift of that whole distribution, and it is not in the model at all.

## Exercise

Open the panel's method comparison and read the four TVDs.

Compute the tangential method's TVD error as a fraction of the total depth, then apply that same fraction to a 12000 ft build-and-hold well. State the error in feet, and say what that would do to a mud weight computed from a pore pressure gradient at that depth.
