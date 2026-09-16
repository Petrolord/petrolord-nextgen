# The units it works in

Liquid rates arrive in bpd, bores in inches, lengths in FEET, pressures in psia, densities in lb/ft3 and viscosities in cp. Every conversion between them happens inside the engine.

{{panel:fc-liquid-explorer}}

## The units and what carries them

| quantity | unit | on OGBIA |
| --- | --- | --- |
| liquid rate | bpd | 12000.000000 |
| bore | in | 7.981000 |
| length | ft | 26400.000000 |
| density | lb/ft3 | 54.500000 |
| viscosity | cp | 2.500000 |
| velocity | ft/s | 2.244621 |
| pressure | psi | 25.660631 |

## Constants measured out of the engine

These are not typed into a teaching file. Each is recovered by asking the engine a question whose answer isolates it.

gc is 32.174000 lbm ft per lbf s2, recovered from the engine's own velocity of 2.244621 ft/s and its fittings loss at a resistance sum of one. One centipoise is 6.7197000000e-4 lbm per ft per s, recovered from that same velocity against the Reynolds number of 48431.2523. One barrel is 5.6145833333333 cubic feet, recovered from the flow area and the length against the line volume. And a day is 86400.000000 seconds, which is what turns a daily rate into a velocity.

## Feet here, miles elsewhere

Liquid work in this engine is stated in feet, and the OGBIA line is 26400.000000 ft long. Gas work is stated in miles, because that is the unit the published transmission forms are written in.

The engine knows the difference exactly. Asked for the largest rise it will accept on a gas line one mile long, it accepts 5280.000000000 ft and refuses the next representable value above it. The mile is a measured boundary in the code rather than a comment beside it.

## Why a rate is not yet a velocity

A rate in bpd is a volume per day. A velocity is a length per second. Getting from one to the other needs the barrel, the day and the area, and the area needs the bore in feet rather than inches, which is where the 144 square inches in a square foot enter.

Miss any one of those and the number still looks like a velocity. It prints in ft/s, it is positive, and it feeds a Reynolds number that feeds a friction factor that feeds a pressure drop. Nothing downstream is in a position to object.

## The mistake

Handing the engine a length in miles where it asked for feet. Both are lengths, both are ordinary numbers, and the loss scales directly with the length, so the answer comes back wrong by whatever the confusion was worth and with nothing in it looking unusual.

## Exercise

Name the unit the engine wants for a liquid line's length, and the unit gas work is stated in. Then give gc and the cubic feet in a barrel as the engine measures them, and say what else besides the barrel and the day a rate in bpd needs before it is a velocity.
