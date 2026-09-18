# Two medians on one basis

A train report hands a reader two droplet medians, one for the inlet and one for the outlet, and it does so knowing perfectly well that the reader is going to subtract them. That comparison only means anything if both numbers were measured the same way.

{{panel:pw-train-explorer}}

## What the engine guarantees

Both medians are the volume median of the same bin set, interpolated in LOG diameter across the bin the median falls in. The engine does not leave that to be inferred. It states it on every return, in its own words: both medians are the volume median of the same bin set, interpolated across the bin the median falls in, so they are comparable with each other.

That sentence is doing real work. It is a declaration of BASIS, and a basis is what makes a difference between two figures a measurement rather than a coincidence.

## The typed number and the measured one

There is a typed d50 in the inputs, and there is a median measured off the bins. They are not the same kind of number, and the module keeps them apart on purpose.

On the OGBOTOBO train the inlet median comes back as 14.000000 micron against a typed d50 of 14, reproducing it to 1.19e-9 relative. The typed figure is kept beside it on the return as `inletD50Micron`, so a reader can see both and can see that they agree.

That agreement is not decoration. It is an identity: the volume median of a log-normal IS its own d50, so a bin set that fails to reproduce the typed figure has described the distribution wrongly. The module checks itself against its own input and shows you the result.

## Why a reported basis beats a correct answer

Suppose the engine did the interpolation correctly and said nothing about it. Every number would be right, and a reader comparing an inlet median from one run with an outlet median from another would still have no way of knowing the two were commensurable.

The basis strings in this module answer that. They appear beside the cyclone, flotation and bed cut sizes, the concentrations and the medians, and each says what the number is a number OF. A figure with a stated basis can be argued with. A figure without one can only be believed.

## What the pair actually tells you

The fall from 14.000000 micron to 3.185598 micron on the OGBOTOBO train is a statement about the surviving distribution. The water leaving the plant is finer than the water entering it, so the remaining oil is harder to remove than the oil already taken out. That is the sentence a designer needs before proposing another vessel.

## Exercise

Run any train in the panel and read the inlet median, the typed d50 beside it and the outlet median. Confirm the first two agree.

Then change the number of bins and check whether the inlet median moves. Say what your answer implies about the grid.
