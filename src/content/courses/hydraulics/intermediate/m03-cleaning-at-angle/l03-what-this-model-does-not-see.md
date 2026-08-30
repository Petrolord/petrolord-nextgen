# What this model does not see

Six omissions, stated plainly.

## Inclination

The largest one, and the subject of the last two lessons. There is no angle term anywhere in the transport calculation.

## Pipe rotation

The annulus is treated as concentric with a stationary inner pipe. A rotating pipe changes the flow structure completely: it introduces a tangential component, it can make a laminar annulus turbulent at a much lower axial velocity, and it stirs any bed present.

Rotation would lower the computed pressure loss in some conditions and raise it in others, and it would improve the cleaning substantially in a deviated hole.

## Eccentricity

The pipe is assumed to be in the centre of the hole. In an inclined hole it lies on the low side, which makes the annulus a crescent: a wide gap on the high side and almost nothing on the low side.

Flow takes the wide path. So the low side, where the cuttings are, sees the LEAST flow, which is precisely the wrong distribution.

An eccentric annulus has a lower pressure loss than a concentric one at the same flow rate, and much worse cleaning.

## Particle size distribution

One diameter, 6 mm, for every cutting. Real cuttings range from dust to centimetre chips, and the fines behave completely differently from the coarse fraction.

## Cuttings interaction

The slip velocity is computed for a single isolated particle. At high concentration particles hinder each other's settling, which slows the slip and helps, and they also form beds, which does not.

## Time

Everything here is a steady state. A hole is cleaned over hours, beds build and are removed on a timescale, and the model computes a snapshot with no history.

## What is left

A transport calculation valid for a vertical or near-vertical hole, at moderate concentration, with a stationary concentric string and uniform cuttings.

That is a real and useful calculation. It is not a hole cleaning model for a deviated well, and the difference matters most on exactly the wells where hole cleaning is hardest.

## Why state it this bluntly

Because the engine will happily return a number for a horizontal well, and the number looks reasonable.

A model that refuses to run outside its scope would be safer and less useful. A model that runs and says nothing about its scope is dangerous. This course chooses the third option: run it, and say what it means.

## Exercise

Rank the six omissions by how much you would expect each to matter on a 3000 m horizontal well.

Then rank them again for a 3000 m vertical well, and note how different the two rankings are.
