# A layer has a history

## A depth is a snapshot

Open a well report and the source rock has one depth. It is at 2000 m. That single figure is the end of a long story and it tells you nothing about the story. The layer was not always at 2000 m. It was laid down at the surface, it was buried under everything that arrived after it, and it passed through every depth in between on the way down.

The same is true of its temperature. A layer at 2000 m today has one temperature today. On the way down it was cooler, because it was shallower, and the rock above it was thinner. A basin model exists because the present depth and the present temperature are the least interesting facts about a source rock. What matters is the sequence.

The two previous modules built the two halves of that sequence separately. This module puts them together.

## Decompaction gives the depth track

The first half is geometry. A layer's thickness is not a constant, so you cannot reconstruct where its top sat in the past by stacking present thicknesses. Compaction has already removed part of every layer above it.

What survives burial is grain. Take 100 m of shale whose top sits at 1000 m. Its solid thickness in place is 63.11728183077296 m, and that grain is the invariant. Restore the same grain to the surface and it occupies 159.79553483785466 m. The layer has lost 59.79553483785466 m of thickness to compaction, which is 37.42 percent of its original thickness. Read that percentage with its denominator, since it is a share of the restored 159.79553483785466 m and not of the present 100 m.

Doing that for every layer in a column, one at a time, is what produces the depth track. Strip the youngest layer, restore what is left, and read where each older layer's top now sits. Repeat.

| a 100 m shale found at | solid thickness | restored thickness at the surface |
| --- | --- | --- |
| 500 m | 52.404268 m | 134.010303 m |
| 1000 m | 63.117282 m | 159.795535 m |
| 2000 m | 77.852091 m | 194.513330 m |
| 3000 m | 86.700278 m | 214.973300 m |

Read the table as one statement. The deeper a layer is found, the more of it has been squeezed away, so the more it grows on restoration. A depth track built without that correction puts every old layer too shallow in the past, and a layer placed too shallow in the past is placed too cool.

## The heat column gives a temperature at each depth

The second half is heat. The golden fixture is a two layer column: surface temperature 10 degC, basal heat flow 0.06 W/m2 which is 60 mW/m2, an upper layer 1000 m thick with conductivity $k = 1.8$ over a lower layer 1000 m thick with $k = 3.5$, ten 100 m cells in each layer so the cell centres sit at 50, 150 and so on to 1950 m.

In steady state with no internal heat production the answer is exactly

$$T = T_s + \frac{Q z}{k}$$

applied layer by layer. At 50 m that gives 11.666666666666671 degC. At 950 m, the base of the low conductivity layer, it gives 41.66666666666673 degC. At the 1000 m boundary it gives 43.333333333333336 degC, and from there the second layer's own conductivity takes over, so the deepest cell at 1950 m sits at 59.619047619047684 degC.

The gradient is 33.333333333333336 degC per km in the $k = 1.8$ layer and 17.142857142857142 degC per km in the $k = 3.5$ layer, with no change in heat flow at all.

## Together they give a temperature history

Neither half is an answer on its own. Decompaction tells you the depths a layer occupied and says nothing about heat. The column tells you the temperature at a depth and says nothing about which layer was there. Put one into the other and you get the thing a basin model is for: a temperature at each stage of a layer's burial.

Two depths in this fixture line up exactly on both sides, so quote those.

| depth | shale porosity there | temperature there |
| --- | --- | --- |
| 0 m | 0.63 | 10 degC |
| 1000 m | 0.37831221465172754 | 43.333333333333336 degC |

At the surface the shale is 0.63 porosity and the rock is at the surface temperature of 10 degC. By 1000 m it has lost most of its pore space, holding 0.37831221465172754, and it sits at 43.333333333333336 degC. Both changes happened to the same rock, driven by the same burial.

Notice what happens when you reach further. Shale porosity at 2000 m is 0.22717481230903933, and that value is available because the compaction curve is continuous. The temperature at 2000 m is not available in this fixture, because the deepest cell centre is 1950 m at 59.619047619047684 degC and the column ends there. Read values at the depths the model actually has, and say which depth every number belongs to.

## What the pair is for

Once a layer carries a list of depths and a temperature at each one, it can be asked the question the higher tiers ask. Did this rock spend enough time hot enough to make oil. That question needs the whole track, and the following lessons explain why it needs the whole track rather than the deepest point on it.

## Exercise

Write the burial story of a single 100 m shale layer found at 1000 m today. Give its solid thickness in place, its restored thickness at the surface, the thickness it has lost, its porosity at the surface and at 1000 m, and its temperature at both of those depths. Then answer in one sentence: why can you not quote its temperature at 2000 m from this fixture?

As a self check: the layer's solid thickness in place is 63.11728183077296 m, it restores to 159.79553483785466 m at the surface, it has lost 59.79553483785466 m which is 37.42 percent of its original thickness, its porosity runs from 0.63 at the surface to 0.37831221465172754 at 1000 m, and it sits at the surface temperature of 10 degC when it is at the surface and at 43.333333333333336 degC at the 1000 m boundary. You cannot quote a temperature at 2000 m because the golden column's deepest cell centre is 1950 m, where the temperature is 59.619047619047684 degC, so 2000 m is outside the depths the fixture reports.
