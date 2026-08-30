# Two wells, one slurry volume

A slant well and a horizontal well that need exactly the same amount of cement.

{{panel:cm-volume-explorer}}

## The coincidence, which is not one

| quantity | slant | horizontal |
|---|---|---|
| annular slurry | 24.34828356497546 | 24.34828356497546 |
| shoe track | 0.7750973779907808 | 0.7750973779907808 |
| total slurry | 25.123380942966243 | 25.123380942966243 |
| lead | 2.6713376091845076 | 2.6713376091845076 |
| tail | 22.452043333781734 | 22.452043333781734 |
| sacks | 657.6801293970221 | 657.6801293970221 |
| displacement | 57.357205971317775 | 53.48171908136387 |
| TVD at the shoe | 2507.9196993011733 | 1214.859173174059 |

Every slurry number is identical and the displacement is not.

## Why

Because the two wells have the same LENGTHS in the same sizes.

Slant: 200 m of cased annulus above the shoe, 1600 m of open hole, 40 m of shoe track.

Horizontal: 200 m of cased annulus above the shoe, 1600 m of open hole, 40 m of shoe track.

Their shoes are at 3000 and 2800 m, their previous shoes at 1400 and 1200, their tops of cement at 1200 and 1000. Every interval is the same length; only the absolute depths differ.

## And the displacement differs because the float collars do

    (2960 - 2760) x 0.01937743444976952 = 3.875486889953905

which is exactly the difference between the two displacement volumes.

## The point

The volume sheet is a function of LENGTHS and DIAMETERS, and of nothing else. Not depth, not inclination, not true vertical depth, not the trajectory.

That is worth stating plainly, because the two wells could not be more different in every other respect. Their true vertical depths at the shoe differ by nearly 1300 m. One of them has a 1600 m lateral at constant vertical depth. The volume sheet cannot tell them apart.

## Where the difference reappears

Immediately, the moment the job is simulated.

The slant well's shoe is at 2507.9196993011733 m of true vertical depth and the horizontal well's at 1214.859173174059. So the same annular column exerts less than half the hydrostatic pressure on the horizontal well, and the float differential at the end of the job differs by a factor of ten between them.

The Professional tier opens on exactly that.

## The habit

A volume sheet that looks right is not evidence that the job will work. It is evidence that the arithmetic on the lengths was done correctly, which is a much smaller claim.

## Exercise

Both wells have 1600 m of open hole. The slant well's open hole spans 1400 to 3000 m of measured depth and the horizontal well's 1200 to 2800.

Using the true vertical depths of 1282.248590310811 at 1400 m on the slant well and 1172.343525979085 at 1200 m on the horizontal, compute how much VERTICAL height each open hole section covers, and say what that does to the weight of the cement column in each.
