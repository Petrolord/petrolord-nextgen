# A distribution in droplet volume

The last module produced two fluids. This one produces the thing being treated: the oil, described as a population of droplets rather than as a lump of concentration.

## Two inputs describe the whole population

This module takes the droplet population as log-normal in droplet volume, described by a median diameter d50 and a log standard deviation sigma. Two numbers, and from them the engine can say what fraction of the oil volume sits at any size. That is a strong assumption and it is a conventional one for dispersed oil in water, where a small number of large droplets carry a great deal of the volume and a very large number of small ones carry very little.

## Volume, which is what a treating answer is about

Notice which quantity the distribution is written in. It is droplet volume rather than droplet count, and that is the right basis for this work, because a removal percentage is a fraction of the oil and the oil is a volume. A distribution in counts would be dominated by the finest droplets, which between them carry almost none of the oil. The engine names the basis of each figure it reports, so a reader never has to guess which kind of number is being compared with which.

## Discretised so an integral can be done exactly

The engine does not keep the distribution as an algebraic curve. It cuts it into volume bins, so that a device grade efficiency can be multiplied against it bin by bin and summed. That is why a later lesson can print what a device removes from this water to six decimals: the integral is a finite sum over a grid the engine reports back.

## The UZERE inlet, on the module's own grid

The UZERE stream carries droplets at a median of 26 micron with a sigma of 0.8. Laid out on the module default grid of 60 bins spanning 4 sigma either side of the median, the coarsest bin reaches 637.845785 micron and the finest begins at 1.059817303438 micron. Between those two limits sits essentially all of the oil in the stream.

## The identity that proves the grid is honest

Ask the bin set for its own volume median and it returns 26.000000 micron against a typed 26. That is not a coincidence and it is not a calibration. The volume median of a log-normal distribution is its own d50, so a bin set that reproduces the number it was built from has passed a check that needs no published data at all. An identity is the cheapest evidence in engineering: either it holds or the implementation is wrong.

{{panel:pw-water-explorer}}

## Exercise

Explain why a distribution written in droplet volume is the right basis for a removal percentage. Then say what the engine would have to get wrong for the bin set to return something other than 26.000000 micron on this stream.
