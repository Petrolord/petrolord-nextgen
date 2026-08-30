# Two correlations

Both published, both lithology-specific, and both screening tools.

{{panel:gm-stress-explorer}}

## Horsrud, for shale

    UCS in MPa = 0.77 x Vp^3.2

with Vp the compressional velocity in km/s. Horsrud 2001, calibrated on North Sea shales.

## McNally, for sandstone

    UCS in MPa = 1200 x exp(-0.036 x dt)

with dt the sonic slowness in microseconds per FOOT. McNally 1987, calibrated on Gulf Coast sandstones.

## The unit trap

The engine takes slowness in microseconds per METRE at its interface, and converts internally: it turns dt into a velocity for Horsrud and multiplies by 0.3048 for McNally.

That conversion is a place errors live. A slowness of 250 us/m is 76.2 us/ft, and the two numbers put into the wrong correlation differ by orders of magnitude.

## What they give at a few readings

| sonic (us/m) | Horsrud | McNally |
|---|---|---|
| 200 us/m | 132798979.91564198 Pa | 133689084.0636776 Pa |
| 250 us/m | 65025349.84288824 Pa | 77236862.43711382 Pa |
| 300 us/m | 36282960.0050123 Pa | 44622438.40557839 Pa |
| 380 us/m | 17028767.50224198 Pa | 18548943.546789635 Pa |
| 450 us/m | 9913127.251139838 Pa | 8604771.16264168 Pa |

## Reading that table

McNally is higher at 250, 300 and 380. Horsrud is higher at 450. At 200 they are within one percent of each other.

So there is no rule about which reads higher. The next lesson is exactly that point, and it is the most useful thing in this module.

## The functional forms

A power law and an exponential. They behave differently: a power law falls off polynomially and an exponential falls off faster at large argument and slower at small.

Two curves of those shapes cross at most twice, and both crossings are inside this profile's sonic range.

## Which one to use

The lithology one. Horsrud in shale and McNally in sandstone, which is what they were calibrated for.

If the lithology is unknown, running both and taking the range is more honest than picking one, and treating the lower as conservative is wrong more often than people expect.

## The provenance string

The engine returns the correlation's citation alongside every result rather than a bare number. That is a small thing and it is the right behaviour: a strength quoted without saying which correlation produced it cannot be audited.

## Exercise

Convert 250, 300 and 450 microseconds per metre into microseconds per foot and into kilometres per second.

Then evaluate both correlations at 300 us/m by hand and check against the table.
