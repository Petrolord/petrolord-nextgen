# What hydrostatic means

Hydrostatic pressure is the pressure at the bottom of a column of fluid that is standing still and supporting nothing but its own weight. Everything in this module follows from that sentence, so it is worth taking apart word by word before any arithmetic happens.

Depths in this lesson are metres below mudline.

## A connected column, standing to surface

Imagine a pore at 2000 m below mudline. Now imagine that the pore fluid in it is connected, through permeable rock and through every pore between here and the seabed, to the sea above. The fluid path is continuous, and it has been continuous for long enough that nothing is still flowing.

Under those conditions the pressure at the pore is fixed by geometry and density alone. It is the weight of the fluid standing above it, per unit area, and nothing else. The rock around the pore contributes nothing, because the rock is carrying its own weight through grain contacts and the fluid is carrying only the fluid.

Three conditions are hiding in that description and each matters.

**Connected.** There has to be a continuous fluid path. A pore sealed inside an impermeable shale is not part of any column and has no reason to sit at the hydrostatic value.

**Standing to surface.** The column has to reach a free surface at a known level. In a marine well that surface is the sea, and the column has two parts, seawater above the mudline and formation water below it. That two part structure is the subject of the next lesson and the commonest place to go wrong.

**Static.** The fluid has to be at rest. Flowing fluid loses pressure to friction along the way, so a formation that is actively charging or actively draining sits off the hydrostatic value while the flow lasts.

## Why this is the null hypothesis

Hydrostatic is not a measurement of anything. It is a calculation you can perform before you know any geology at all, from a water depth, a fluid density, gravity and a depth.

That is what makes it the right baseline. Every pore pressure statement in this subject is really a statement about a departure from hydrostatic, so the baseline has to be something reproducible that two people will agree on. If the reference itself were an estimate, no departure from it would mean anything.

So the working assumption for any formation, until there is evidence otherwise, is that it is normally pressured. It sits at the hydrostatic value. This is not optimism. It is the correct default, because it is the state that any connected, drained sediment relaxes into given time.

## What normally pressured means physically

A sediment being buried is being loaded. The weight above it increases every time another metre accumulates on top, and that extra load has to be carried by something.

In a normally pressured section it is carried by the grain frame. As the load rises the grains rearrange and pack more tightly, porosity is squeezed out, and the water that occupied the lost pore space is expelled upward through the connected pore network. The fluid pressure never rises above the weight of the water column above it, because any excess drives flow that removes the excess.

The record of that process is the compaction curve. A normally pressured shale gets steadily tighter, denser and faster with depth in a way that module 4 describes with an equation. Normal pressure and normal compaction are the same story told twice, once in terms of pressure and once in terms of porosity.

Overpressure is what happens when the expulsion fails. If burial is fast, or the escape route is sealed, the water cannot leave quickly enough and is forced to take part of the load. Its pressure rises above hydrostatic, the grains are relieved of the load the fluid took, and compaction stalls. That is why an overpressured shale is more porous, less dense and slower than its burial depth would suggest, and why a sonic log carries pressure information at all.

## The hydrostatic curve in the golden well

Here is the baseline for the well this course uses, in 100 m of water with a pore fluid density of 1030 kg/m3.

| z (m below mudline) | hydrostatic (MPa) |
| --- | --- |
| 0 | 1.005182 |
| 500 | 6.055606 |
| 1000 | 11.106031 |
| 2000 | 21.206881 |
| 2500 | 26.257305 |
| 3000 | 31.307730 |
| 3500 | 36.358155 |
| 4000 | 41.408580 |

Two features to notice.

The curve does not start at zero. At the mudline, 0 m below mudline, the hydrostatic pressure is already 1.005182 MPa, because there is 100 m of seawater standing above the seabed. A hydrostatic curve that starts at zero at the mudline has forgotten the water, and in this well that error is worth over a megapascal at every depth in the hole.

The curve is a straight line below the mudline. Each 500 m of sediment adds the same increment of pressure, because the pore fluid density is treated as constant at 1030 kg/m3. That is a modelling choice. Real formation water changes density with salinity, temperature and pressure, and a careful prognosis in a deep well will vary it. At this tier it is constant, which makes the arithmetic exactly checkable.

The value at total depth, 41.408579625 MPa at 4000 m below mudline, is one of the six graded numbers in the capstone. The next lesson has you compute it by hand.

## Exercise

State the three conditions that have to hold for a formation to sit at the hydrostatic pressure, and give a one sentence example of a situation that breaks each one. Then say what the hydrostatic pressure is at the mudline in the golden well and why it is not zero.

Self check: the fluid has to be connected through a continuous pore path, so a pore sealed within an impermeable shale breaks the first condition. The column has to stand to a free surface at a known level, so a fluid system that is not in communication with the sea breaks the second. The fluid has to be static, so a formation that is actively charging or being drained by nearby production breaks the third. At the mudline the hydrostatic pressure in this well is 1.005182 MPa rather than zero, because 100 m of seawater is standing above the seabed and its weight is already acting there.
