# Neat, and lead and tail

Two ways to place the same volume of cement, and they are not equivalent.

{{panel:cm-placement-explorer}}

## The two programmes

**Neat.** One slurry at the tail density, 1900 kg/m3, for the whole job. Two fluids pumped: the slurry and the displacement.

**Lead and tail.** A 4 cubic metre spacer at 1500, then 2.6713376091845076 of lead at 1560, then 22.452043333781734 of tail at 1900, then the displacement. Four fluids.

## What they have in common

The same total slurry volume, 25.123380942966243 cubic metres. The same target top of cement. The same rate, the same geometry, the same casing.

Both reach the same achieved top of cement: 1200 m on the slant well and 1000 on the horizontal one, to a rounding error.

## What differs

The DENSITY PROFILE of the column, and therefore every pressure in the job.

| quantity | slant, lead and tail | slant, neat |
|---|---|---|
| end pump pressure (Pa) | 13712451.13169735 | 14397110.807469234 |
| float differential (Pa) | 5714040.2699640095 | 6081982.155976057 |
| peak ECD at previous shoe | 1657.6738234800569 | 1712.1218125074865 |
| free fall | no | no |

| quantity | horizontal, lead and tail | horizontal, neat |
|---|---|---|
| end pump pressure (Pa) | 8195680.348860014 | 8910825.387773193 |
| float differential (Pa) | 570815.1577260531 | 969242.4068793952 |
| peak ECD at previous shoe | 1652.9521977452723 | 1715.156233904509 |
| free fall | no | YES |

## Every difference goes the same way

The neat programme is worse on every measure, on both wells: more pump pressure, more float differential, more circulating density at the weak point, and on one well a free-fall period the other does not have.

## Where the difference comes from

Two places, and they are the same 200 m.

The lead occupies the annulus from the top of cement to the previous shoe: 1200 to 1400 m on the slant well. Under the neat programme that same 200 m is filled with 1900 kg/m3 tail instead of 1560 lead.

And the spacer occupies 4 cubic metres of annulus above the top of cement at 1500 rather than the mud's 1440.

So the two programmes differ by 340 kg/m3 over 200 m of annulus, plus the spacer's contribution.

## Which is small, and does a lot

340 kg/m3 over 200 m of measured depth, which on the slant well is 153.2 m of vertical, is about half a megapascal of extra annular head.

That half megapascal is the difference between free falling and not, on the horizontal well.

## Exercise

Compute the extra annular head from 340 kg/m3 over 153.2 m of vertical height.

Compare it against the horizontal well's worst free-fall deficit of 104394.27505085245 Pa, and say whether the lead can plausibly be what prevents it.
