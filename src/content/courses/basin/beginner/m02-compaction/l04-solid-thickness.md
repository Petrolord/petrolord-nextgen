# Solid thickness

A layer of sediment is part grain and part pore. The pore part is destroyed by burial. The grain part is not. That one asymmetry is why basin modelling has a quantity called solid thickness, and why it, rather than the thickness you measure on a log, is the number the workflow carries around.

## What solid thickness is

Solid thickness is the thickness the layer would have if you squeezed every pore out of it and left only the grains, stacked with nothing in between.

If a layer runs from depth $z_1$ to depth $z_2$, then at each level the grain fraction is $1 - \phi(z)$, and the solid thickness is that fraction added up over the layer:

$$h_s = \int_{z_1}^{z_2} \left(1 - \phi(z)\right) dz$$

Put the Sclater-Christie curve into that integral and it comes out in closed form, with no numerical work at all:

$$h_s = (z_2 - z_1) - \frac{\phi_0}{c}\left(e^{-c z_1} - e^{-c z_2}\right)$$

Read the right hand side as a sentence. Take the full thickness of the layer, then subtract the pore volume inside it. What is left is grain.

## The worked case

Take 100 m of freshly deposited shale sitting at the surface, so $z_1 = 0$ and $z_2 = 100$, with the shale parameters $\phi_0 = 0.63$ and $c = 0.00051$ per m.

$$h_s = 100 - \frac{0.63}{0.00051}\left(e^{0} - e^{-0.051}\right)$$

The first exponential is 1 exactly, since the top of the layer is at the surface. The engine returns

$$h_s = 38.57953418711555\ \text{m}$$

and that is the first of the six graded numbers, to a tolerance of 0.05 m.

Stop on what it says. A 100 m bed of fresh shale contains less than 40 m of actual mineral. The rest of it is water. Fresh shale is more pore than grain, by a wide margin, and every intuition you have about rock being solid has to be set aside for the shallow part of a section.

## The four lithologies

The same calculation for 100 m of each of the engine's four lithologies, freshly deposited at the surface:

| lithology | solid thickness in 100 m at the surface |
|---|---|
| shale | 38.57953418711555 m |
| sandstone | 51.655586470092686 m |
| limestone | 55.77839233115688 m |
| dolomite | 50.98679894040397 m |

Limestone holds the most grain and shale the least, and the order follows the surface porosities directly, since limestone has the lowest $\phi_0$ at 0.45 and shale the highest at 0.63. Over an interval this thin and this shallow the compaction constant has hardly any room to act, so it is $\phi_0$ that decides the ranking. That will not be true at depth, which is the subject of the next lesson.

Sandstone, limestone and dolomite all come out a little over half grain. Shale is the outlier, and it is the outlier that matters, because source rocks and seals are shales and they are the layers a basin model cares about most.

## Why this is the quantity that matters

Solid thickness is conserved. Bury the layer and its bulk thickness shrinks, its porosity falls, and its top and base depths change. The grain inside it does not go anywhere. There is exactly as much mineral in the layer at 3000 m as there was on the day it was deposited.

That makes solid thickness the only stable description of a layer across time. Thickness is a snapshot property, valid at the depth where you measured it and nowhere else. Solid thickness is a property of the layer itself.

You can see it start to work already. Take the same 100 m of shale, but find it today with its top at 1000 m rather than at the surface. Put those limits into the same formula and the engine returns 63.11728183077296 m of grain.

Compare that with the 38.57953418711555 m in 100 m of surface shale. The buried 100 m holds far more mineral, because its pore space has been squeezed down and the grains have been packed closer together. Two beds of identical measured thickness, at different depths, are not the same amount of rock.

Run that backwards and you have module 3. If you know how much grain is in the layer, you can ask how thick it must have been when that same grain sat at the surface with its original porosity. The answer for this case is 159.79553483785466 m, and the arithmetic that gets you there is the arithmetic above, used in the other direction.

## A note on mass

Solid thickness also gives you mass, which is where the load in a compaction calculation comes from. The engine's library carries a grain density with every lithology: 2720 kg/m3 for shale, 2650 for sandstone, 2710 for limestone and 2600 for dolomite.

Multiply a solid thickness by the grain density of that lithology and you get the mass of mineral standing over each square metre. That is the quantity that presses on everything below, and it is unaffected by how much the layer has compacted, because compaction moves water out and leaves the mineral where it is. Two layers with the same solid thickness and the same lithology apply the same grain load whatever their present thickness.

The panel below reads the solid thickness for any depth and lithology you choose, alongside the compaction curve and the restored thickness.

{{panel:bs-burial-heat-explorer}}

## Exercise

Without computing anything, decide which of the four lithologies holds the most grain in 100 m of freshly deposited sediment at the surface, and say which parameter decided it. Then explain in two sentences why the solid thickness of a 100 m shale found at 1000 m is larger than the solid thickness of a 100 m shale at the surface, when both layers are the same rock and the same measured thickness.

Self check: limestone holds the most, at 55.77839233115688 m of grain in 100 m, and the parameter that decided it is the surface porosity, since limestone starts at 0.45 while shale starts at 0.63 and there is too little depth in this interval for the compaction constants to separate them. The buried layer holds more grain because porosity at 1000 m is far lower than at the surface, so a larger fraction of every metre of that layer is mineral. The engine returns 63.11728183077296 m for the buried case against 38.57953418711555 m at the surface, which says the two beds are not the same amount of rock despite reading the same thickness on a log.
