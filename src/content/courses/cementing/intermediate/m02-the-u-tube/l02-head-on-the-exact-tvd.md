# Head on the exact TVD

Density times gravity times a vertical height, summed over segments.

{{panel:cm-placement-explorer}}

## The sum

    head = sum over segments of density x g x (TVD at the bottom - TVD at the top)

with g at 9.80665 and the true vertical depths taken from the minimum-curvature survey.

## Why segments

Because the column is not one fluid. On the slant well's job at the end, the annulus holds mud from surface to 900.5245622082865 m, spacer to 1200, lead to 1400 and tail to 3000. Each contributes its own density times its own vertical height.

## The exact TVD, not an average inclination

The engine calls `tvdAt(stations, md)` for each segment end, which interpolates the minimum-curvature trajectory. It does not take an average inclination over the segment and multiply.

That matters on a building section. On the slant well the interval from 1200 to 1400 m of measured depth covers 1129.0397016870152 to 1282.248590310811 of true vertical depth, which is 153.2 m of vertical for 200 m of hole. An average-angle approximation over the same interval would be close but not exact, and the errors would accumulate over 3000 m.

## What the horizontal well does to it

Its shoe is at 2800 m of measured depth and 1214.859173174059 m of true vertical depth, and its true vertical depth at 2000 m of measured depth is the SAME 1214.859173174059.

So the last 800 m of that well contributes exactly zero head. A cement column 800 m long, weighing nothing.

That single fact is why the horizontal well's float differential at the end of the job is 570815.1577260531 Pa against the slant well's 5714040.2699640095, a factor of ten, on the same volumes and the same densities.

## The two heads

The engine computes the same sum twice, once over the inside segments and once over the annulus segments, and subtracts.

Both legs cover the same 3000 m of casing, so both run from a true vertical depth of zero to the same shoe TVD. When the two columns are the same fluid, the heads are identical and cancel exactly. When they are not, the difference is the U-tube.

## The one thing it does not include

Any pressure at surface. The annulus is open to the atmosphere during a cement job and the inside is open to the pump. Both heads are gauge, and a closed annulus would be a different calculation.

## Exercise

The slant well's shoe is at 2507.9196993011733 m of true vertical depth.

Compute the hydrostatic head of a full column of 1440 kg/m3 mud from surface to the shoe, and then of a full column of 1900 kg/m3 tail cement, and say what the difference is worth in megapascals.
