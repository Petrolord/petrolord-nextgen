# Overburden against hydrostatic

You now have both curves. The hydrostatic came from a two part fluid column, seawater to the mudline and pore fluid below it. The overburden came from the same seawater column plus an integration of bulk density. This lesson puts them on the same axis, because the relationship between them is the frame that the rest of pore pressure work stands on.

## The two curves together

| z (m bml) | hydrostatic (MPa) | overburden (MPa) |
|---|---|---|
|    0 |  1.005182 |  1.005182 |
|  500 |  6.055606 | 10.716908 |
| 1000 | 11.106031 | 21.100398 |
| 2000 | 21.206881 | 43.321164 |
| 2500 | 26.257305 | 54.952589 |
| 3000 | 31.307730 | 66.831143 |
| 3500 | 36.358155 | 78.902159 |
| 4000 | 41.408580 | 91.123067 |

They begin together. At the mudline both are 1.005182 MPa, because above the mudline both are the same 100 m of seawater at 1025 kg/m3 and there is nothing yet to tell them apart.

They diverge immediately below it. The hydrostatic accumulates pore fluid at a fixed 1030 kg/m3 and rises as a straight line. The overburden accumulates bulk rock, which starts at 1900 kg/m3 and compacts to 2505.265301734371 kg/m3 by TD, so it rises faster and steepens as it goes. By TD the well carries 91.123067 MPa of total stress against 41.408580 MPa of hydrostatic pressure, more than twice as much. The two graded values at TD are 41.408579625 MPa for the hydrostatic and 91.12306695073282 MPa for the overburden.

## Every pore pressure lives in the gap

The gap between the two curves at any depth is the only place the pore pressure can be.

The overburden is the ceiling. Pore pressure at the overburden would mean zero effective stress, no load carried by the grains, and a formation that has parted. Real rock fails before that, at a fracture pressure below the overburden, which is where the Advanced tier goes.

The hydrostatic is the practical floor. It is what the pore fluid weighs if the pore system is connected to the seabed and free to equilibrate. A pressure below hydrostatic is possible, and depleted producing fields show it, but in an undrilled clastic section the hydrostatic is where you start.

So the well can be described in one sentence. At every depth there is a floor, a ceiling, and an answer between them. Near the mudline the floor and the ceiling are almost touching and there is nothing much to argue about. Deeper down the gap is wide, and the further down the gap the true pore pressure sits, the more the drilling plan has to change to reach it safely.

## The same picture in mud weight

Drillers do not think in MPa at a depth, they think in the density of mud that would balance that pressure. Converting a pressure to an equivalent mud weight is a division, referenced here to sea level so that the column height includes the water depth:

$$EMW = \frac{P}{g \, (z + D)}$$

Here $z$ is depth below the mudline and $D$ is the water depth, so the column height is measured from sea level.

At TD the two curves convert to these. The hydrostatic gives 1029.878049 kg/m3, which sits just below the 1030 kg/m3 pore fluid density because the seawater part of the column is slightly lighter than the pore fluid part. The overburden gives 2266.333384 kg/m3.

Those two numbers bracket every mud weight this well could conceivably need at TD. That is a useful frame to carry into a well plan even before any pressure prediction has been done, because it says what is physically possible. Narrowing that wide bracket into an actual mud weight window is the work of the tiers above this one.

## What this frame is for

At the mudline the two curves are identical, at 1.005182 MPa. At TD they are 41.408580 and 91.123067 MPa. Everything between those two statements is the frame, and it took nothing but densities, depths, gravity and an integration to build. No compaction model, no trend fitting, no seismic velocities.

That is worth noticing, because it means the frame is the reliable part. If your overburden and your hydrostatic are right, they stay right regardless of what the pressure prediction turns out to be, and they are the two curves you check first when a prognosis looks strange.

The next module builds the third ingredient, the normal compaction trend, which is where the well's own sonic log starts to tell you where inside the gap the answer lies. In this well the departure starts at 2500 m below the mudline. At 2500 m the frame reads 26.257305 MPa of hydrostatic against 54.952589 MPa of overburden, and the question the next tier answers is how far up that interval the pore pressure has climbed.

Use the panel to move a depth marker down the well and watch the two curves separate.

{{panel:pp-frame-explorer}}

## Exercise

State the equivalent mud weight at TD for both the hydrostatic and the overburden of this well, then explain in one sentence what it would mean for a mud weight to sit above the upper figure.

Self check: at TD the hydrostatic converts to 1029.878049 kg/m3 and the overburden converts to 2266.333384 kg/m3, both referenced to sea level over the seawater plus sediment column. A mud weight above 2266.333384 kg/m3 at that depth would put more stress on the formation than the entire weight of everything above it, so the formation could not contain it and the well would be pumping mud into a fracture. In practice the limit is reached at the fracture pressure, which is below the overburden, so the usable window is narrower than this bracket.
