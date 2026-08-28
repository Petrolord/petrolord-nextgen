# What a grid cannot honour

Ekene-2 is one example of a general limit. This lesson generalises it, because the same arithmetic decides several things a deck reader should expect to be wrong.

## The rule

A block-centred grid represents everything at cell centres. Anything defined elsewhere is moved to the nearest centre, and the error is

$$\text{error} \approx \text{local gradient} \times \text{distance moved}$$

Distance moved is at most half a cell in each direction. So the error is bounded by the gradient times half a cell, and you can compute that bound before you build anything.

## What it applies to

**Well positions.** As Ekene-2 showed. The bound is half a cell laterally, which on this grid is 50 m, times the structural dip.

**Contacts.** The oil-water contact is a plane at 5118.110236220472 ft. Cells are assigned to oil or water by their centre, so the modelled contact is a staircase whose tread is a cell and whose riser is a layer thickness. Module 2 measures what that costs in volume.

**Layer boundaries.** The five layers are continuous surfaces in the model, but the properties are constant within a layer. A real bed boundary that cuts across a model layer cannot be represented at all.

**Faults.** This grid has none, and it could not represent one without corner-point geometry. A fault inside a cell is invisible; a fault along a cell face can be approximated by a transmissibility multiplier, which is a different kind of model.

**Anything thinner than a layer.** A 2 ft shale inside a 7 ft layer does not exist. It can be smeared into the layer's vertical permeability, which is a way of representing its EFFECT without representing it.

## The thing this makes clear

A grid is a resolution, and a resolution is a statement about what you have decided not to model.

That is worth being explicit about because the alternative framing, that the grid is an approximation to the truth which gets better as it refines, is only half right. Refining resolves smaller features, and it does not conjure the data to populate them. A 25 m grid built from six wells knows exactly as much geology as a 100 m grid built from the same six wells; it simply spreads it more thinly.

## The questions this raises for a deck reader

When you inherit a deck, three questions follow directly:

**What is the cell size, and what does that make invisible?** If the field's known heterogeneity is at 20 m scale and the cells are 100 m, the model is carrying an average and the study should say what averaging rule it used.

**Where are the wells relative to the lattice?** One line of arithmetic per well, and it tells you which wells the model has moved and how far.

**How many layers span the interval, and what is the thinnest feature that matters?** Five layers over 34.6 ft is about 7 ft per layer, so nothing thinner than 7 ft is in this model.

## What a grid CAN honour

Volume, if you let it. The reconciliation in module 2 shows that a coarse grid can reproduce a booked hydrocarbon volume to within a tenth of a percent, because volume is an integral and integrals are forgiving of resolution.

Rates and breakthrough times are much less forgiving, because they depend on gradients and on the smallest connected path, both of which are resolution-sensitive.

So a coarse model can be trusted for volumes long before it can be trusted for timing, and a study that quotes both with the same confidence has not thought about it.

## The misconception to avoid

"The model has all the wells in it." It has a well in the cell nearest each well's surface location, coupled to the model through a well index that assumes radial flow into a 100 m cell. That is a model of a well, and its relationship to the steel in the ground is worth stating rather than assuming.

## Exercise

First, this grid has 100 m cells and layers of about 7 ft. List three features of a real reservoir that this model cannot represent, and for each say whether a finer grid would fix it.

Second, explain in two sentences why a coarse grid can reproduce a booked volume accurately while getting a breakthrough time badly wrong.
