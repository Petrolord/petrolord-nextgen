# Why the survey interval matters

The assumption between stations is only as good as the distance it has to cover.

## The trade

Minimum curvature assumes a circular arc between stations. Real hole is not a perfect arc: the assembly's build rate varies, the formation pushes it, the driller alternates sliding and rotating.

Over thirty metres those departures are small. Over three hundred metres they are not, because a lot can happen in three hundred metres and the calculation has no way to know that it did.

So the survey interval sets how much of the well's shape is measured and how much is assumed.

## What a longer interval loses

**Dogleg severity.** A dogleg computed between two stations is the AVERAGE angle change over the interval. If the hole turned sharply in the middle and then straightened, a long interval reports a gentle dogleg and the sharp one is invisible.

That matters, because dogleg severity is what the drill pipe feels in fatigue, what casing has to bend through, and what a torque and drag model uses as its input. A dogleg averaged away is a real one that nobody accounts for.

**Position.** The arc through two distant stations may miss the real hole by metres in the middle, even though it hits both ends exactly.

**Regime changes.** A sliding interval followed by a rotating one is two different curvatures, and one arc through both is neither.

## What a shorter interval costs

Rig time, at every survey. Continuous surveying while drilling reduces that cost and is now common, and it produces station lists an order of magnitude denser than the classical thirty metres.

Denser surveys do not make the calculation better in principle. They make the ASSUMPTION cover less ground, which is the same thing in practice.

## The resample trap

Software will happily interpolate a station list onto a finer grid. The engine has a resample function that does exactly this, using exact attitude interpolation along the minimum-curvature arc.

That does not add information. It produces more rows, all of them on the arc the calculation already assumed, and the resampled listing is exactly as uncertain as the one it came from. Its use is presentation and depth alignment, not accuracy.

Anyone reading a 1 m survey listing should ask whether it was measured or interpolated, and the answer is almost always interpolated.

## Where the interval is chosen for you

In the build section, surveys are taken at every connection because the driller needs them for steering, so the interval is the stand length.

In a long tangent, surveys are sometimes skipped, because nothing is changing. That is defensible and it is where the assumption is most nearly true.

Through a critical section, such as passing an offset well, surveys are taken more often deliberately, and the anti-collision scan in the Expert tier is computed at every reference station, so more stations means a finer scan.

## The honest statement

A survey listing should carry its interval, and a dogleg severity should be quoted with the interval it was computed over. A dogleg of 3 degrees per 30 m from 30 m stations and one from 90 m stations are not the same claim.

## The misconception to avoid

"Interpolating the survey to 1 m makes the well path more accurate." It makes the listing denser. Every interpolated point lies on the arc the original two stations implied, so the interpolation cannot disagree with the assumption and cannot detect that the assumption was wrong. Only more MEASUREMENTS do that.

## Exercise

A build section is surveyed at 30 m and shows a uniform dogleg of 2.5 degrees per 30 m.

Suppose the hole actually built at 4 degrees per 30 m over the first half of each interval and 1 degree over the second half. State what the 30 m survey would report, what a 15 m survey would report, and which of the two a torque and drag model should be given.
