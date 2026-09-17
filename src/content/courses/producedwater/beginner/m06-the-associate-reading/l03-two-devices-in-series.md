# Two devices in series

A train is the point of this engine, and a train of two is enough to show why the arithmetic of trains is not the arithmetic people expect.

## The answer first

Put the UZERE stream through the basin and then the plate pack. The train leaves 567.644189 ppm out of the 650 ppm that arrived, which is 12.670125 percent of the oil removed, and the droplet median falls from 26.000000 micron to 23.018983 micron.

## The second device does not see the first device's water

The reason this needs thinking about is in that median. The basin did not remove a uniform slice of the oil. It removed the coarse end of the population, because that is what a cut size does. The water reaching the plate pack therefore has a finer droplet distribution than the water that reached the basin, and a finer distribution is a harder duty for any device.

So the plate pack is working on worse water than the basin was, and it is working on that water at its own cut size of 86.549597 micron. The engine handles this by carrying the outlet bin distribution of each stage into the next one as its inlet, normalised by the volume that survived. The distribution is the state passed down the train, and the concentration is only a scaling on it.

## Why removals cannot be added or multiplied

Two consequences follow, and both of them are mistakes people make with real trains.

The first is that stage removals are not additive. Each figure is a percentage of what arrived at that stage rather than of what entered the train, so adding them counts oil that was gone before the second device saw it.

The second is subtler and it is the reason coupling matters at all. Even treating the stages as independent fractions and multiplying them is wrong, because independence is exactly what the coupling destroys. The second device is not applying its performance to an unchanged population. It is applying it to the residue of the first device, which is finer by construction. Multiplying two fractions measured on the raw stream would credit the second device with performance it can only reach on water the first device has not already picked over.

## Reading the pair honestly

The honest way to report this train is the way the engine does. Give the outlet concentration, give the overall removal, and give the inlet and outlet droplet medians on the same basis, so that a reader can see what the train did to the population as well as what it did to the mass. The two halves answer different questions and a report carrying only the first is the report that gets a third device bought for the wrong reason. Both medians here are the volume median of the same bin set, and the module says so on its own return, which is what makes 26.000000 and 23.018983 comparable numbers rather than two different kinds of measurement.

{{panel:pw-train-explorer}}

## Exercise

Explain why the plate pack faces a harder duty in the train than it would on the raw stream. Then say why adding the two stage removals together overstates what the train achieved, and what the engine passes between stages instead of a single concentration.
