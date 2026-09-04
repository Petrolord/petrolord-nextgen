# The wormhole radius

The formula is not a wormhole model. It is the sandstone volume balance read backwards.

{{panel:st-acid-explorer}}

## The balance

The engine computes the wormhole radius as the square root of the wellbore radius squared plus the pumped volume divided by the product of pi, the interval height, the porosity and the pore volumes to breakthrough.

Rearrange it and the meaning appears. The pumped volume equals the pore volumes to breakthrough, times pi, times the annular area between the wellbore and the wormhole radius, times the height, times the porosity.

In words: to wormhole out to some radius, you must supply the pore space of everything inside that radius, a set number of times over.

## The same equation twice

Compare that with the sandstone planning volume from the previous module. Volume equals the pore-volume factor times the annular pore space. It is the identical expression, with the pore volumes to breakthrough standing where the pore-volume factor stood.

The only difference is which end you hold fixed. In sandstone you choose a radius and the engine returns the volume. In carbonate you choose the volume and the engine returns the radius. One volumetric balance, two directions.

## Checking the published case

Take 8 m3 into the 100 m interval at porosity 0.18, with pore volumes to breakthrough of 1 and a wellbore radius of 0.108 m. The engine returns an effective wormhole radius of 0.39 m.

Because the radius sits under a square root, it grows as the square root of the volume, which is the reason carbonate jobs have a natural size. The wellbore term matters least when the job is large. At 2 m3 the squared wellbore radius is a visible part of the total; by 32 m3 it is almost lost in it.

## What the radius is not

It is not the tip of a wormhole. Real wormholes are a sparse, branching set of channels with untouched rock between them. What the engine returns is the radius of an EQUIVALENT cylinder that has been fully stimulated, which is the fiction that lets a skin be written down at all.

## What it refuses

The pumped volume must be positive, the pore volumes to breakthrough must be positive, the porosity must lie strictly between 0 and 1, and the wellbore radius must be positive. Each guard exists because a zero or a negative there would produce a radius with no physical reading.

## Exercise

First, rearrange the engine formula on paper until you can write the pumped volume as a pore volume times a factor.

Second, in the panel, halve the interval height and predict, before you look, whether the wormhole radius rises or falls.
