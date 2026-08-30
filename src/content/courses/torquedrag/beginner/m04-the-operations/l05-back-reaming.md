# Back reaming

Pulling out while rotating, and what it buys.

## What it is

Coming out of the hole with the string turning and usually with the pumps on. It is done to work the string through tight spots, to clean cuttings out of a section, and to keep a hole open that would otherwise pack off.

In the model: axial velocity up, rpm 120, bit free.

    va = 0.3,  vt = 2 pi (0.0841375) (120) / 60 = 1.0572... m/s

Both velocities are nonzero, so both direction cosines are nonzero, and the friction is SHARED between the axial and tangential directions.

## The sharing

    fa = va / hypot(va, vt),  ft = vt / hypot(va, vt),  fa^2 + ft^2 = 1

At 0.3 m/s axial and about 1.06 m/s tangential, `fa` is about 0.27 and `ft` is about 0.96. So roughly a quarter of the friction acts axially and almost all of it acts tangentially.

That is the mechanism. Rotating does not reduce the friction; it redirects most of it into the rotational direction, where the top drive pays for it instead of the drawworks.

## The numbers

On the build-and-hold well:

| operation | hookload | torque |
|---|---|---|
| pick up (no rotation) | 1063113.0483217717 N | 0 |
| back ream (rotating) | 755998.6171861527 N | 27066.488567454348 N.m |
| rotate off bottom | 665057.129179305 N | 26357.98350914472 N.m |

Back reaming took 307114.43113561894 N off the pick-up hookload and added 708.5050583096299 N.m to the off-bottom torque.

That is a very good trade if the derrick is the constraint and a bad one if the top drive is.

## Why the torque barely moved

Because the tangential direction cosine was already near one when rotating off bottom, and back reaming only takes it from 1.00 to about 0.96. Almost all the friction was already going into torque.

Meanwhile the axial cosine went from 0 to 0.27, which is a large relative change, so the hookload moved a lot. The asymmetry is entirely because the tool joint's surface speed at 120 rpm is three and a half times the trip speed.

## The trade in one sentence

Rotating while tripping converts drag into torque at a rate set by the ratio of surface speed to trip speed, and that ratio is something the driller controls.

## What the model does not tell you

Back reaming has real risks that are outside this calculation entirely: it can pack off the annulus with cuttings it has stirred up, it wears casing at a rate the Expert tier computes, and it can damage the hole wall in soft formations.

So a back-reaming hookload that looks comfortable is not by itself a reason to back ream.

## Exercise

Compute `fa` and `ft` for the back-reaming case in this lesson from the two velocities.

Then recompute them for a trip speed of 0.1 m/s and for 0.6 m/s, and say what that implies about how fast you should pull while back reaming if the aim is to minimise drag.
