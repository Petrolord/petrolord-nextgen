# What a real fault would do

This tier's fault is a vertical plane at a known easting that seals perfectly. Every one of those four properties is a simplification. This lesson names what each one hides, so that you can say what the model is worth rather than only what it computes.

## It is vertical

Faults dip. A normal fault at reservoir depth typically dips between 50 and 70 degrees, so its trace at the top of the reservoir and its trace at the base are at different map positions.

At Ekene the reservoir is about 30 m thick. A fault dipping 60 degrees moves sideways by $30 / \tan 60° = 17$ m between top and base, which is a fifth of a cell and genuinely negligible here.

The same fault through a 300 m reservoir would move 173 m, nearly two cells, and the partition would then need to know whether it is dividing the top surface or the base. A vertical fault is a good approximation for thin reservoirs and a poor one for thick ones, and the test is the ratio of reservoir thickness to cell size.

## It has no displacement

The model's fault separates two blocks without moving either one. Real sealing faults usually seal because they have moved.

Displacement matters twice. It changes the mapped depths on each side, which the previous lessons covered. It also decides whether the fault seals at all, because sealing by juxtaposition depends on how far the sand has been shifted relative to the shale above and below it.

There is an uncomfortable circularity in this. A fault with no displacement probably does not seal, so a model that assumes a sealing fault with no displacement is assuming two things that tend to exclude each other. The model is still useful, because it isolates the partition arithmetic from the mapping question, and it is not a picture of a real fault.

## Its position is exact

The fault easting is given as 1800 m with no uncertainty attached. A fault interpreted from seismic at this depth carries a position uncertainty of tens of metres at best, and more where the imaging is poor, which is often exactly at the fault.

Module two priced that: 100 m of position uncertainty is worth about 0.9 MMstb on the west block, roughly 10 percent of it. The east block, being smaller, carries the same absolute uncertainty as a much larger fraction of itself, around 40 percent.

## It seals completely

Sealing is treated here as binary. Real fault seal is a capacity rather than a switch: a fault can support a certain height of oil column before the buoyancy pressure exceeds what the fault rock can hold, and above that it leaks.

That has a specific consequence for compartment contacts. A partially sealing fault can hold different contacts on its two sides up to some difference and no further, which means the contact difference is itself bounded by the seal capacity. Module five treats the two contacts as free to differ, which is the simple case.

## What to do about all this

The honest response is not to stop computing. It is to report the partition with its assumptions attached, and to be specific about which ones the answer is sensitive to.

For Ekene the ranking is clear from what you have already measured. The map's ignorance of the fault is worth about 2 MMstb on the west block. The fault position is worth about 0.9 MMstb. The tie break convention is worth another 0.9 MMstb. The dip is worth almost nothing at this reservoir thickness.

A report that states the block volumes to six figures and mentions none of those four is quoting a precision it has not earned.

## Worked example

Estimate the combined effect of the two largest simplifications on the west block, treating them as independent.

The cross fault control is worth about 1.99 MMstb, in the sense that removing the eastern well's influence entirely takes the west block from 9.855617 to 7.865728 MMstb. Treat that as a one sided downside, since adding fault awareness can only remove eastern influence, not add more.

The fault position at plus or minus 100 m is worth plus 0.90 and minus 1.05 MMstb.

A defensible statement of the west block is therefore something like 9.9 MMstb with a range from about 6.8 to 10.8, which is asymmetric and wide. That range is honest and it is far more useful than 9.855617, because it tells the reader that the compartment is large under every assumption and that its exact size is not yet knowable.

## Exercise

For a reservoir 250 m thick on a 100 m grid, cut by a fault dipping 55 degrees, compute the map distance between the fault trace at the top and at the base of the reservoir, and say whether a vertical fault approximation is defensible.

Self check: the horizontal offset is $250 / \tan 55° = 175$ m, which is nearly two grid cells. A vertical approximation would misassign up to two columns of cells somewhere between the top and base of the reservoir, so it is not defensible; the partition would need to be defined against a specific surface, or the fault modelled with its dip.
