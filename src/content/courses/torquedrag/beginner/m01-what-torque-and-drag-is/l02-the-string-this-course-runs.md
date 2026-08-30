# The string this course runs

One string, one mud, five holes.

{{panel:td-string-explorer}}

## The string

Three components, from the bit up:

| component | length | OD | ID | weight |
|---|---|---|---|---|
| drill collars | 150 m | 0.17145 m | 0.05715 m | 160.87051759 kg/m |
| heavy weight drill pipe | 150 m | 0.127 m | 0.0762 m | 73.36648027 kg/m |
| drill pipe | to surface | 0.127 m | 0.1086104 m | 33.126528414 kg/m |

The heavy weight and the drill pipe carry tool joints, 0.1651 m and 0.168275 m in diameter. Those are the parts that actually touch the wall, and the Expert tier's casing wear is entirely about what they do to it.

The drill pipe has a yield strength of 930792195 Pa. The collars and the heavy weight do not carry a yield in this fixture, so the utilization check runs on the drill pipe only, which is the right answer anyway: the drill pipe is the weak link in tension and in torsion.

## The mud

1440 kg/m3 throughout, which is about 12 pounds per gallon.

## The hole

Two sections in every well: cased to the shoe with a friction factor of 0.25, then open hole below it at 0.35. The cased section is 0.2204974 m in diameter and the open hole is 0.2159 m.

## The operating parameters

120 rpm, 0.3 m/s trip speed, 89000 N weight on bit, 2700 N.m of bit torque, and a 10 m integration step.

## The five wells

| well | stations | total depth | maximum inclination | shoe |
|---|---|---|---|---|
| vertical | 68 | 2000 m | 0 degrees | 1200 m |
| slant | 102 | 3000 m | 40 degrees | 1400 m |
| build and hold | 119 | 3500 m | 65 degrees | 1800 m |
| horizontal | 96 | 2800 m | 90 degrees | 1200 m |
| three-dimensional turn | 62 | 1800 m | 60 degrees | 900 m |

Everything above is identical between them. The only thing that changes is the shape of the hole, and the shape of the hole is the whole subject.

## Why one string

Because a course that changes the string, the mud and the geometry at once teaches nothing. Holding four things fixed and moving one is the only way a difference in the answer means anything.

It also makes the numbers comparable across the whole course. A hookload you learn on the vertical well is directly comparable with a hookload on the horizontal one, because the same steel is hanging in both.

## Exercise

Open the panel on the string view and read the air weight of each well's string. The vertical well's is 896824.4970405255 N and the build-and-hold well's is 1384114.9018472552 N.

Confirm the difference is entirely the extra drill pipe: 1500 m of it at 33.126528414 kg/m under standard gravity. Do it with a calculator before reading the tile.
