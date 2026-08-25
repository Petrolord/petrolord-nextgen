# The map mean

The other average in the capstone is taken over the map. This lesson is about what it actually averages, which is not what most people assume.

{{panel:mp-isochore-explorer}}

## The number

The isochore has 201 live nodes at the capstone settings. Add their thickness values and divide by 201:

$$\bar{t}_{map} = 32.25429068038713\ \mathrm{m}$$

The capstone grades it to 0.1 m.

## What is being averaged

Nodes. Not wells, not measurements, not geology. Two hundred and one points on a regular 100 m lattice, most of which are interpolated values at places nobody has drilled.

Because the lattice is regular, every node stands for the same amount of ground: one cell, $100 \times 100 = 10{,}000$ m². Averaging nodes equally is therefore averaging **by area**, and that is the single most important thing to understand about this number.

> A map mean is an area-weighted average. A well mean is a well-weighted average.

They are answers to different questions and there is no reason for them to agree.

## What the area weighting does here

The panel reports the map mean as 32.2543 m against the well mean of 31.1667 m. The map average is 1.0876 m higher, which is 3.5 percent.

Look at the tile below it: **146 of the 201 live nodes are above the well mean**, and only 55 below. That is 73 percent of the mapped area sitting above the average of the wells, which is a strong asymmetry and the direct cause of the gap.

## Why it is a better number for volume

Gross rock volume is thickness integrated over area:

$$V = \sum_{\text{live nodes}} t_i \times A_{cell} = \bar{t}_{map} \times N_{live} \times A_{cell}$$

The mean that belongs in that expression is the area-weighted one, because the sum is over area. Using the well mean instead would compute a volume as though each well's thickness applied to a sixth of the field, which is not what the map says and not what anyone believes.

So for volumetrics the map mean is the correct input and the well mean is the wrong one. That is worth stating plainly, because the well mean feels more trustworthy, being made of measurements, and it is the number a reviewer instinctively reaches for.

## Where it is fragile

Two things move a map mean and neither of them is geology.

**The mask.** The mean is taken over live nodes only. Widening the extrapolation limit adds nodes at the edges of the field, and edge nodes are where the spline is least constrained, so a wider mask changes the mean by adding the least reliable values to it.

**The area itself.** If the mapped area is not the area you intend to book, the mean is over the wrong region. On Ekene the 201 live nodes cover 2.01 km², which is the hull of six wells clipped at 800 m and has no relationship to a licence boundary, a fault block or a hydrocarbon contact.

Both are reasons to quote the mean with its live node count and its mask setting, and the capstone grades that node count exactly for the same reason.

## Worked example

The extrapolation limit is widened from 800 m to 1200 m. Will the map mean go up or down, and is the change informative?

The frame and hull are unchanged, so widening the limit can only add nodes that were previously more than 800 m from every well, all of them near the edges of the hull. On this field the far corners lie toward Ekene-4, the thinnest well, so the added nodes are mostly thin and the mean would fall.

The change is not informative about the reservoir. It is a measurement of how much thin edge the previous mask was excluding, which is a statement about the mask.

## Exercise

State the map mean and the number of live nodes it averages, explain in one sentence why averaging nodes equally amounts to averaging by area, and say which of the two means belongs in a gross rock volume calculation.

As a self-check: the map mean is 32.25429068038713 m over 201 live nodes. Averaging nodes equally is averaging by area because the grid is regular, so every node stands for exactly one cell of 10,000 m² and the node average is the area average of the surface over the live region. The map mean belongs in the volume calculation, because volume is thickness integrated over area and the integral over area is what an area-weighted mean computes.
