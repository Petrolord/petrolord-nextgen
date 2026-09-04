# What a setting asserts

Every valve setting is two claims, one about opening at a stage and one about being shut when the well is on production, and the second is reported separately because it can fail while the first holds.

{{panel:pd-valve-explorer}}

## The second claim

A valve closes when the pressure on its full bellows area falls back to the dome pressure at valve temperature. The engine turns that dome pressure into an equivalent casing pressure at surface and reports it, then answers a plain question: at the operating surface pressure, is this valve shut.

| westTexasOil valve | Closing surface pressure, psia | Shut at 914.7 psia |
| --- | --- | --- |
| 1 | 970.055863945 | true |
| 2 | 955.145099347 | true |
| 3 | 937.910304601 | true |
| 4 | 918.986491277 | true |
| 5 | 898.798123393 | false |
| 6 | 877.641314876 | false |
| 7 | 855.729763420 | false |

Valves 5 through 7 are not defective. They sit at or below the operating stage, so the operating casing is above their domes and they are supposed to be passing gas or standing by to. The design intends exactly one injection point, and the flags say which valves the operating pressure is holding shut. The bottom orifice at 7500.000000000 ft has no dome, so the published case reports no closing surface pressure for it at all.

## How close the boundary runs

deepHighPressure operates at 1314.7 psia and its closing surface pressures run 1378.504197316, 1347.221790203, 1313.798877081, 1278.876482613, 1242.858225424 and 1206.014139099 psia. Valve 3 is the first reported open and it lands just under the operating pressure. The valve above it clears by tens of psi and the valve below it misses by tens more, but valve 3 sits close enough that a small change in the dome, the temperature profile or the gas gravity would move the flag.

## The mistake

Quoting the rack opening as the assertion. The rack number is what a tester dials with atmosphere on the far side; the assertion is about a pressure at a depth with a live column on both sides. westTexasOil valve 4 opens on a rack setting of 912.433488084 psia and is judged shut downhole by a closing surface pressure of 918.986491277 psia. Those two numbers are close together and they are not the same claim.

## What it refuses

The closing surface pressure is a shut in gas column inverted to surface. There is no friction, no velocity and no injection rate in the annulus, so it is not the casing pressure a gauge reads while gas is moving. The engine also never checks whether the valve can pass what the well needs at that condition, only whether it is open.

## Exercise

Record the closing surface pressure and the shut flag for every valve of westTexasOil and deepHighPressure.

Then say which single valve in the two strings sits closest to its operating pressure, and what that proximity does to the confidence you can place in its flag.
