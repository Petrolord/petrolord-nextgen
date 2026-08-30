# Pressure, and equivalent mud weight

The same quantity in two units, and why both are used.

{{panel:gm-stress-explorer}}

## The conversion

An equivalent mud weight is the density of a static mud column that would produce the given pressure at the given true vertical depth:

    EMW = P / (g x TVD)

with g at 9.80665 m/s2. It is one division and it needs a depth.

## Why the depth matters

Because the same pressure is a different mud weight at a different depth. A pressure with no depth attached cannot be converted, and an equivalent mud weight with no depth attached cannot be converted back.

That is the commonest error in reading a geomechanics report: comparing an equivalent mud weight quoted at one depth against a pressure at another.

## The profile in both units

At 2000 m of true vertical depth:

| quantity | pressure | equivalent mud weight |
|---|---|---|
| overburden | 45110590 Pa | 2300 kg/m3 |
| SHmax | 39894755.652777776 Pa | 2034.0664575965175 kg/m3 |
| Shmin | 35988505.652777776 Pa | 1834.903134749266 kg/m3 |
| pore pressure | 22015929.25 Pa | 1122.5 kg/m3 |

## Why equivalent mud weight is the working unit

Because the answer is a mud weight. The whole point of the calculation is to say what to put in the hole, and the driller orders mud by density.

A window quoted as "between 1400 and 1900 kg/m3" is directly actionable. The same window quoted as "between 27.5 and 37.3 MPa at 2000 m" is the same information and needs a conversion before anybody can act on it.

## Why pressure is the calculating unit

Because the physics is in pressures. Every stress is a pressure, the failure criteria compare pressures, and dividing by depth partway through a calculation only introduces a place to make a mistake.

The engine works in pascals throughout and converts once at the end.

## The overburden gradient in this profile

Exactly 2300 kg/m3 at every depth. That is a modelling choice rather than a measurement, and the next module says what it hides.

## A useful habit

Quote both. "The fracture initiation pressure at 2500 m is 57.4 MPa, which is 2339 kg/m3" is unambiguous and takes one extra clause.

## Exercise

Convert the four stresses at 2600 m from pascals into equivalent mud weights by hand, then check against the panel.

Then convert the 2000 m Shmin value into an equivalent mud weight AT 2500 m, and say what that number means physically.
