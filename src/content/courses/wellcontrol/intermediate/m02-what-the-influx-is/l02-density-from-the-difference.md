# Density from the difference

The second inference, and what it rests on.

{{panel:wc-killsheet-explorer}}

## The expression

    influx density = mud density - (SICP - SIDPP) / (g x influx height)

The two shut-in gauges differ by the weight the influx is not providing. Divide by the height and you have the density deficit.

## The numbers

Mud 1440 kg/m3, both wells:

| scenario | SICP less SIDPP | height | influx density |
|---|---|---|---|
| moderate | 900000 Pa | 221.8482706948928 m | 1026.3187985168897 kg/m3 |
| small | 100000 Pa | 110.9241353474464 m | 1348.0708441148645 kg/m3 |

## What is measured and what is inferred

**Measured:** the two gauge pressures, and the pit gain.

**Inferred:** the height, from the pit gain and an assumed capacity. And then the density, from the height.

So the density is two inferences deep, and every error in the pit gain propagates into it.

## The sensitivity

The density depends on the height, which depends on the pit gain, both linearly and in the denominator.

A pit gain twenty percent too low gives a height twenty percent too low, which makes the pressure difference divide by a smaller number, which makes the density deficit larger, which makes the influx look LIGHTER.

On the small scenario, a pit gain error from 1.5 to 1.2 m3 would move the computed density from 1348 to about 1325.

## Why it matters more than it looks

Because the classification into gas, liquid or mixed follows directly from this number, and the classification is what a well control team uses to decide how bad the situation is.

An influx classified as gas because the pit gain was under-read is a different operational decision from the same influx classified as water.

## What would measure it directly

Nothing available at the time. The influx's composition is known when it reaches surface and goes across the gas detector, which is at the end of the operation rather than the beginning.

So the inference is what there is, and the honest position is to treat it as an estimate with a wide band.

## The engine's warnings

It flags an influx density above the mud density, which is impossible, and one below zero, which is also impossible. Both indicate that the gauge readings or the pit gain are inconsistent.

Those are consistency checks rather than accuracy checks, and passing them says only that the inputs are not self-contradictory.

## Exercise

For the small scenario, recompute the influx density with the pit gain 20 percent low and 20 percent high.

Report the range and say whether it crosses either of the two classification thresholds.
