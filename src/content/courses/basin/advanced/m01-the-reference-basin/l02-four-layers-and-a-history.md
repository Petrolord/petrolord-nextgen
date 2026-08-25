# Four layers and a history

A forward model's input is a description of a basin, and the golden reference basin is small enough to hold in your head entirely. This lesson commits it to memory: four layers, their ages, and the present-day stack the model must honour.

## The stratigraphy

In deposition order, oldest first:

| layer | lithology | deposited (Ma) | present thickness |
|---|---|---|---|
| Base Sand | sandstone | 150 to 140 | 1500 m |
| Source Shale | shale, Type II source | 140 to 120 | 400 m |
| Mid Sand | sandstone | 120 to 80 | 1200 m |
| Upper Shale | shale | 80 to 20 | 1600 m |

The source carries TOC 4 percent and hydrogen index 500, the Type II library spectrum from the Professional tier, and it is the only source layer. The basin's settings put the surface at 15 degC. On top of the stratigraphy sits one erosion event, 600 m removed at 10 Ma, which module 3 owns entirely.

## Thicknesses are present-day

The thicknesses in the table are what a well would measure today. The engine's first act is to convert them into what is conserved: solid thickness, by exactly the Associate tier's integral, stacking the layers top down at their present depths. The results, which module 4 will reuse:

| layer | present depths | solid thickness |
|---|---|---|
| Upper Shale | 0 to 1600 | 910.9491232281101 |
| Mid Sand | 1600 to 2800 | 873.9348761305532 |
| Source Shale | 2800 to 3200 | 345.33834344581027 |
| Base Sand | 3200 to 4700 | 1245.2721916761686 |

From then on the solid thicknesses are invariant, and every past geometry is derived from them: at any date, the model stacks whichever layers exist, top down, decompacting each against its current top depth. The Associate tier ran this arithmetic on single layers; here it runs on the stack, every million years, automatically.

Notice what "present-day thickness in, solid thickness derived" buys: the model is guaranteed to reproduce today's observed geometry exactly, because it was anchored there. Its predictions about the past are where the physics lives.

## Reading the ages

The age columns carry more information than they appear to. Deposition windows say when a layer exists: at 130 Ma the basin contains Base Sand and Source Shale only; at 75 Ma, everything but the not-yet-eroded phantom. Gaps in deposition, like 20 Ma to present after Upper Shale, are quiet intervals where geometry sits still and only temperature and kinetics move. And the source's window, 140 to 120, means the layer whose maturity the capstone grades has experienced all but the first ten million years of the basin's history.

One convention to absorb now, because module 2 makes it consequential: the model deposits each layer instantaneously at its ageStart. The 1600 m Upper Shale appears in full at 80 Ma. The consequences of that simplification, a burial staircase rather than a ramp, are a lesson of their own.

## The source's position

Fix the source's present position: 2800 to 3200 m, centre 3000 m, under 2800 m of overburden of which 1600 m arrived in one model step at 80 Ma. Its graded final temperature, 149.76037539670858 degC at that 3000 m centre, and everything else on the capstone follow from how that position came to be occupied through time. The whole tier is, in one sentence, the biography of this one layer.

## Exercise

From memory: the four layers with lithologies and deposition windows, the source's TOC, HI and kerogen type, and the surface temperature. Then answer in one sentence: why does the engine derive solid thickness from the present stack rather than asking for depositional thicknesses?

As a self check: Base Sand, sandstone, 150 to 140; Source Shale, shale, Type II with TOC 4 and HI 500, 140 to 120; Mid Sand, sandstone, 120 to 80; Upper Shale, shale, 80 to 20; surface 15 degC. Solid thickness is derived from the present stack because present thicknesses are the observable a well provides, and anchoring there makes the model exactly honour today's geometry while the conserved grain lets it reconstruct every earlier one.
