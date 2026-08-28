# The well that misses the lattice

Five wells came back exactly. The sixth did not, and the reason has nothing to do with kriging.

## Ekene-2

Its map position is (2200, 1150). The northing is not a multiple of 100 m, so it does not sit on the cell-centre lattice.

The deck places it in cell (23, 13), whose centre is at a northing of 1200 m. That is 50 m north of the well. And the depth the deck carries there is

$$1564.3183173003902 \text{ m}$$

against a mapped top of 1565 m. The deck's well is 0.68 m SHALLOWER than the well that was drilled.

{{panel:sim-structure-explorer}}

Ekene-2 is highlighted. Compare its row against the other five in the table beneath the map.

## Whose fault this is

Not the interpolator's. Kriging did pass exactly through (2200, 1150); the surface is correct at the well.

The deck simply does not sample the surface there. It samples at cell centres, and no cell centre is at (2200, 1150). The nearest is 50 m away, and 50 m of lateral offset on this structure is 0.68 m of depth.

So this is a GRIDDING loss, not an interpolation loss, and the distinction matters because the fixes are different. A finer grid reduces it; a better interpolator does not.

## Is 0.68 m a problem

It depends entirely on what the well is for.

For volumetrics, no. One column out of 900, off by 0.68 m out of a 34.6 ft net pay, is well below every other uncertainty in the model.

For a well model, possibly. Ekene-2 is an injector, and its completion is defined against the model's layers. If the model puts the top of the sand 0.68 m shallow at that location, every layer interface below it is 0.68 m shallow too, and a completion picked from the model rather than from the well's own log will be offset.

For a history match, it can matter more than it looks. A well whose modelled depth is wrong is a well whose modelled pressure is wrong by the fluid gradient over that depth, systematically, for the whole run.

## What to do about it

Three options, in increasing cost.

**Record it.** Note that Ekene-2 sits half a cell off the lattice and that the model's depth there differs from the log by 0.68 m. That costs a sentence and it means nobody discovers it during a history match.

**Move the well to the cell centre in the model.** Wells are already idealised as points in a cell, so this is a small extra idealisation, and it makes the deck's geometry self-consistent.

**Refine the grid locally.** Expensive, and it only reduces the offset rather than removing it, since a finer lattice still has centres.

Most studies take the first option, and the ones that get bitten are the ones that took it implicitly by not noticing.

## The general shape of this

A grid can only honour what it can represent. Any quantity defined at a point that is not a cell centre gets moved to the nearest one, and the error is the local gradient times the distance moved.

That applies to wells, to seismic picks, to core plugs and to pressure gauges. It is the same arithmetic every time, and the fix is always to know the gradient and the offset rather than to hope they are small.

## The misconception to avoid

"The well is in the right cell, so the model has it right." Being in the right cell is the coarsest possible statement of position. Within that cell the model has exactly one depth, one pressure and one saturation, and the well is at none of them in particular. A cell is 100 m across, and the well is a point somewhere inside it.

## Exercise

First, Ekene-2's cell centre is 50 m north of the well and the deck's depth there is 0.68 m shallower than the mapped top. Estimate the local structural dip in metres per kilometre, and say whether that is consistent with a field with 49 m of relief across 2 km.

Second, name the three responses to this offset and say which one you would choose for an injector, with a reason.
