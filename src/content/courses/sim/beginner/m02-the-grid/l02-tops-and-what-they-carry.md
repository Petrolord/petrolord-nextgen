# TOPS and what they carry

The grid so far is a box with no depth. TOPS is the keyword that puts it in the ground, and it carries more information than its single line of numbers suggests.

## What the keyword holds

One depth per COLUMN, not per cell. The Ekene grid is 30 by 30, so TOPS holds

$$30 \times 30 = 900 \text{ values}$$

each the depth to the top of layer 1 in that column, in feet. Deeper layers stack conformably beneath it: layer 2 starts where layer 1 ends, and so on down. That is the block-centred rule, and it means the whole structure of the model is in these 900 numbers.

## Natural order

The values are listed in Eclipse natural order: I varies fastest, then J. The first 30 values are the whole southern row of the grid west to east, the next 30 are the row north of it, and so on.

Getting that order wrong transposes the structure. A transposed surface still has the right depth range, the right mean and the right histogram, so nothing about the numbers looks wrong. What changes is where the crest is, and therefore where the oil is. It is a mistake that survives every summary statistic you might check it with.

{{panel:sim-deck-explorer}}

Open the GRID section and find the TOPS block. It is one keyword, a long wrapped list, and a slash.

## The Ekene surface

| quantity | value (ft) |
|---|---|
| shallowest column top (the crest) | 5055.774278215223 |
| deepest column top | 5216.535433070866 |
| mean column top | the grid's own average, which module 4 uses |
| deepest base, after five layers | 5251.120588883762 |

That mean matters later: it is the depth the deck equilibrates at, which module 4 takes up.
Computing it from the 900 values is an Expert exercise, so this tier names it rather than
quoting it.

The range from crest to deepest top is about 161 ft, which is roughly 49 m, and that is the structural relief this field has. Set against a contact at 5118.110236220472 ft, some columns are entirely above the contact and some entirely below it, which is what makes a field rather than a tank.

## Where the surface came from

Six wells found the top of the sand at six depths. A surface was interpolated through them and sampled at the 900 cell centres. That is the whole chain, and every link in it is a choice: which interpolator, which parameters, which cell centres.

The Professional tier opens that chain up. For now the thing to hold on to is that TOPS is DERIVED data, not measured data. Six numbers were measured. Nine hundred are in the deck.

## The convention this deck uses

Layer 1's top is given and every deeper interface follows from the layer thicknesses. An alternative convention gives every cell its own top and bottom explicitly, which allows layers to pinch out to zero thickness and beds to be truncated. This deck's layers are continuous everywhere, so the simpler convention is honest.

If you inherit a deck whose layers pinch out, TOPS alone will not describe it and you should expect corner-point geometry instead.

## The misconception to avoid

"TOPS is the top of the reservoir." It is the top of LAYER 1 of the model, which is the top of the modelled interval. Whether that is the top of the reservoir depends on whether the modeller included everything. A deck that models only the upper half of a sand has a TOPS surface that is perfectly correct and describes something other than the reservoir top.

## Exercise

First, the grid has 900 columns and 4500 cells. Explain in one sentence why TOPS has 900 entries rather than 4500, and what supplies the missing information.

Second, the crest is at 5055.774278215223 ft and the contact at 5118.110236220472 ft. Compute the maximum oil column the structure allows, in feet and in metres.
