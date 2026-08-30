# Annular slurry

The cement that does the job, and the only volume that spans two capacities.

{{panel:cm-volume-explorer}}

## The definition

    annular slurry = volume between the top of cement and the shoe

summed over the capacity rows.

## On the slant well, in two pieces

**Inside the previous casing**, 1200 to 1400 m at 0.013356688045922537 square metres:

    200 x 0.013356688045922537 = 2.6713376091845076 cubic metres

**In the open hole**, 1400 to 3000 m at 0.013548091222369345 square metres:

    1600 x 0.013548091222369345 = 21.676945955790952 cubic metres

**Total:** 24.34828356497546 cubic metres.

## The two wells give the same answer

The horizontal well's top of cement is 1000 m, its previous shoe is 1200 and its casing shoe is 2800. So it also has 200 m of cased annulus and 1600 m of open hole, and its annular slurry is 24.34828356497546 cubic metres as well, to the last digit.

Two different wells, two different total depths, two different trajectories, one annular slurry volume. Nothing about the volume calculation knows the difference between them, because the volume calculation reads only measured depths and capacities.

## What that tells you about the calculation

That it is a measured-depth calculation throughout. Inclination enters nowhere. A 1600 m horizontal lateral holds exactly as much cement as 1600 m of vertical hole of the same size.

The inclination comes back the moment the job is simulated rather than ordered, because pressure depends on vertical height. But the volume sheet does not care.

## The piece that responds to the excess

Only the open hole part. On this job that is 21.676945955790952 of the 24.34828356497546, so about 89 percent of the annular slurry is exposed to the excess assumption.

At the bit size the same interval would have been 18.849518222426916, and the annular slurry 21.520855831611424.

## Why it is quoted separately from the shoe track

Because they do different jobs. The annular slurry is the barrier. The shoe track is a sacrificial buffer that never leaves the casing. Adding them and quoting one number would hide the fact that part of the cement ordered is not part of the barrier.

## Exercise

Compute the horizontal well's annular slurry from its own depths, and confirm it matches the slant well's.

Then change the top of cement on the slant well to 900 m and compute the new annular slurry, using the cased capacity for the extra 300 m.
