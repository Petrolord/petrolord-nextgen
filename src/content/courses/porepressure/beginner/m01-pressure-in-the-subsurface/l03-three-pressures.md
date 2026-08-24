# Three pressures

At any depth in a well there are three pressures worth naming, and confusing them is the most common conceptual error in this subject. Two of them are computed. One of them is estimated, and it is the one everybody wants. This lesson defines all three and fixes the order they come in.

Depths here are metres below mudline.

## Hydrostatic pressure

Hydrostatic pressure is the pressure that would exist at a given depth if the pore fluid formed a single connected column standing all the way to sea level, with nothing supporting it but its own weight.

It is a calculation rather than a measurement. You compute it from a fluid density, the acceleration due to gravity and a height, and nothing about the rock enters into it. Two wells at the same depth in the same water depth with the same formation water density have the same hydrostatic pressure.

That is precisely why it is useful. Hydrostatic is the null hypothesis for pore pressure, the reference against which anything interesting is measured. A formation whose pore pressure equals the hydrostatic value is described as normally pressured, and it means the pore fluid has stayed connected to the sea over geological time and has been able to leak off whatever it needed to leak off. Module 2 builds this curve in full.

In the golden well the hydrostatic pressure at 4000 m below mudline is 41.408579625 MPa.

## Overburden stress

Overburden stress, also called total vertical stress, is the total weight per unit area of everything above the point of interest. In a marine well that is the seawater column plus every metre of rock and pore fluid between the mudline and the depth in question.

It is also a calculation, but of a different kind. It is an integral of the bulk density log from the top of the section down, so it depends on the actual rock, and two wells a kilometre apart can have measurably different overburden at the same depth. Module 3 builds this curve, and module 3 also handles the awkward fact that a density log usually does not reach the seabed.

In the golden well the overburden stress at 4000 m below mudline is 91.12306695073282 MPa.

## Pore pressure

Pore pressure is the pressure of the fluid in the pore space of the rock. It is the physical quantity the drilling engineer needs, and it is the only one of the three that is not directly computable from first principles.

The load carried by the sediment is shared. Part of it is carried by grain to grain contact in the rock frame, and part of it is carried by the fluid in the pores. If the fluid can escape as burial proceeds, the grains take more of the load, the rock compacts, and the fluid pressure stays at the hydrostatic value. If the fluid cannot escape, it is forced to carry part of the increasing load, its pressure rises above hydrostatic, and the rock is prevented from compacting as far as it otherwise would.

That is the mechanism the whole subject rests on, and it also explains why a sonic log can be used to estimate a pressure at all. The undercompaction leaves a physical trace, a rock more porous and therefore slower than its burial depth would suggest, and the size of the departure carries information about how much load the fluid is taking.

## Why the order is fixed

In any sane well, at any depth,

$$P_{hydrostatic} \le P_{pore} \le S_{overburden}$$

The lower bound holds because a pore pressure below hydrostatic requires the fluid to be actively drained, which happens in depleted producing fields and is a special case that gets flagged rather than assumed.

The upper bound holds because pore pressure at the overburden means the fluid is carrying the entire weight of the overlying section and the grain contacts are carrying none of it. At that point the rock has no effective stress left and it parts. Nature does not maintain that state, so a computed pore pressure above the overburden curve is a sign of an arithmetic error rather than a discovery.

Read the two computed curves in the golden well and see how much room there is between them.

| z (m below mudline) | hydrostatic (MPa) | overburden (MPa) |
| --- | --- | --- |
| 0 | 1.005182 | 1.005182 |
| 500 | 6.055606 | 10.716908 |
| 1000 | 11.106031 | 21.100398 |
| 2000 | 21.206881 | 43.321164 |
| 2500 | 26.257305 | 54.952589 |
| 3000 | 31.307730 | 66.831143 |
| 3500 | 36.358155 | 78.902159 |
| 4000 | 41.408580 | 91.123067 |

Two features of that table are worth stopping on.

At the mudline the two curves are equal, both at 1.005182 MPa. Above the mudline there is no rock, so both quantities are the same seawater column and there is nothing to distinguish them. The curves separate only once sediment begins to accumulate.

By 4000 m below mudline the overburden of 91.123067 MPa is more than twice the hydrostatic value of 41.408580 MPa. That gap is the room available. Everything the pore pressure can legitimately do at total depth happens between those two numbers, and the entire craft of pressure prediction consists of placing one curve inside that gap with enough confidence to design a well around it.

## The fourth curve

There is a fourth curve, and this tier does not build it.

Fracture pressure is the pressure at which the formation fails in tension and takes fluid from the wellbore. It is not one of the three above. It depends on the pore pressure and on the horizontal stress the rock can support, so it cannot be computed until a pore pressure estimate exists. It sits above pore pressure and below or near the overburden, and together with pore pressure it forms the two walls of the mud weight window from lesson 1.

The Professional tier adds it, once there is a pore pressure curve for it to stand on. At Associate level, three pressures are enough to keep straight.

## Exercise

For each of the three pressures, write one sentence saying what it physically is and one sentence saying whether it is computed or estimated and from what. Then explain why hydrostatic and overburden are identical at the mudline in this well, and give the value they share.

Self check: hydrostatic is the pressure of a connected fluid column standing to sea level and is computed from a fluid density, gravity and a height. Overburden is the total weight per unit area of everything above and is computed by integrating a bulk density log, plus the seawater column. Pore pressure is the actual fluid pressure in the pore space, and it is estimated, usually from the departure of a log from a compaction trend, because it cannot be derived from geometry alone. The two computed curves are equal at the mudline, at 1.005182 MPa, because above the mudline both quantities consist of the same 100 m of seawater and no sediment.
