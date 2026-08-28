# Order is permeability, not depth

The Ekene layer table is given in depth order, top to base. The fastest layer is the second from the top. A reader who assumes the flood proceeds down the column in the order the table is written will be wrong about which layer breaks through first, second and third. The engine is not confused; the reader might be.

## What the engine does

Before any analysis, the layer list is normalised: rows with non-positive thickness or permeability are dropped, and the survivors are sorted by permeability, descending.

The Ekene column enters as

| position | thickness (ft) | permeability (md) |
|---|---|---|
| L1 top | 18 | 173.81198701129736 |
| L2 | 22 | 607.7507038307907 |
| L3 | 16 | 250 |
| L4 | 14 | 102.8382190362731 |
| L5 base | 14 | 359.5839451276606 |

and comes out of normalisation as

| flood order | thickness (ft) | permeability (md) | was |
|---|---|---|---|
| 1st | 22 | 607.7507038307907 | L2 |
| 2nd | 14 | 359.5839451276606 | L5 |
| 3rd | 16 | 250 | L3 |
| 4th | 18 | 173.81198701129736 | L1 |
| 5th | 14 | 102.8382190362731 | L4 |

The thickness column has been shuffled from 18, 22, 16, 14, 14 to 22, 14, 16, 18, 14. Every subsequent stage table is indexed in the second order, and the labels L1 to L5 do not appear in it at all.

## Why depth order is the wrong order

Because gravity is not what drives the front. In these methods the front velocity in a layer is set by its permeability and the pressure gradient, both of which are the same for every layer in a horizontal, non-communicating system. Depth enters nowhere.

Real floods do have a depth dependence, through gravity segregation: water is denser than oil and tends to slump to the base of the interval. That effect exists, it can dominate in thick high-permeability intervals, and neither Dykstra-Parsons nor Stiles models it at all. The SCAL course's gravity number is the screening tool for it.

So the sorting is correct within the model, and the model is missing a mechanism that would reintroduce a depth dependence. Both facts belong in your reading.

## Why this matters practically

Three ways it bites.

**Reading a stage table.** A stage table row says "the layer with 607.75 md broke through". If you are matching that against a well log, you have to go back to the original column to find that this is the interval 18 to 40 feet from the top. The engine does not carry the label through.

**Conformance planning.** If the stage table says the first breakthrough carries away half the water, and you want to shut that interval off, you need to know WHERE it is. Second from the top means a selective completion or a straddle packer, not simply avoiding the base of the sand.

**Communicating the result.** "The fast layer" is ambiguous. Say "the 607 md interval" or give its depth, never "the first layer", because first means different things in the two orderings.

## A general habit

Any routine that sorts its input silently is a routine whose output indices do not refer to your input indices. That is common and it is not a defect, but it means you cannot join the output back to the input by position.

The defence is to carry a key. If the layer objects had names attached, the stage table could report them and the ambiguity would disappear. Where the tool does not do that for you, do it yourself: sort your own table by permeability before you feed it in, so that your indices and the engine's agree.

## Checking you have it right

The quickest check is thickness. The Ekene stage table's first row corresponds to a 22 foot layer. There is exactly one 22 foot layer in the input, and it is L2. If your reading of a stage table implies a thickness that no input layer has, you have mismatched the ordering.

## The misconception to avoid

"The layers flood from the top down." Nothing in these methods says anything about top or bottom. Water enters every layer at once and advances fastest where the permeability is highest, wherever that layer happens to sit. The visual intuition of a flood front sweeping down a column comes from gravity-dominated displacement, which is a different regime and a different model.

## Exercise

First, using the normalised table, state the depth interval, measured from the top of the sand, occupied by the layer that breaks through third. Then state which two layers are still unswept at that moment and their combined thickness.

Second, an engineer reports "we will shut off the first layer to control water". Write the two-sentence reply that resolves the ambiguity and names the interval you think they mean.
