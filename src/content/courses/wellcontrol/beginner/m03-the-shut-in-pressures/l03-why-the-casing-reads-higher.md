# Why the casing reads higher

The difference between the two gauges, and what it contains.

{{panel:wc-killsheet-explorer}}

## The observation

The shut-in casing pressure is always higher than the shut-in drill pipe pressure, when there is an influx in the annulus.

## Why

Both gauges are connected to the same formation pressure at the bottom of the hole. The difference is what is between the gauge and the bottom.

The drill pipe has a full mud column. The annulus has a mud column with a section of INFLUX at its base, and the influx weighs less than the mud it replaced.

So the annulus provides less hydrostatic pressure, and the surface gauge has to make up the difference.

## The expression

    SICP - SIDPP = (mud density - influx density) x g x influx height

The whole difference is the weight the influx is not providing.

## The two published scenarios

| scenario | SIDPP | SICP | difference |
|---|---|---|---|
| moderate | 2000000 Pa | 2900000 Pa | 900000 Pa |
| small | 800000 Pa | 900000 Pa | 100000 Pa |

A 0.9 MPa difference on the first and 0.1 MPa on the second, from pit gains of 3.0 and 1.5 m3.

## What that says about the influx

Rearrange:

    influx density = mud density - (SICP - SIDPP) / (g x influx height)

with the height being the pit gain over the annulus capacity at the bit.

That is how the influx density is obtained, and it is an inference rather than a measurement. The next tier is about what it is worth.

## The practical reading

**A large difference** means a light influx, a tall influx, or both. Gas.

**A small difference** means a heavy influx or a short one. Water or oil.

That is a genuinely useful field diagnosis and it takes two gauge readings and a pit gain.

## The case where they are equal

No influx. If the well is shut in and both gauges read the same, the annulus and the string have the same fluid in them, and whatever raised the pressure was not a kick.

That happens: a trapped pressure from the pumps, or a thermal effect. Bleeding a small volume and watching whether the pressure returns is how it is distinguished.

## Exercise

For each of the two scenarios above, compute the influx density from the difference and the influx height.

Compare against what the panel reports, and say which of the two influxes you would call gas from the numbers alone.
