# Porosity falls with depth

Sediment arrives at the seabed as a loose framework of grains with water in every gap between them. Freshly deposited mud is mostly water by volume. What happens next is the subject of this whole module, and it is the first physical process a basin model has to get right, because everything else in the model is built on where the layers sat and how thick they were.

Porosity is the fraction of a rock's bulk volume that is pore rather than grain. It is written as a fraction, v/v, so a porosity of 0.63 means 63 percent of the bulk volume is pore. A porosity quoted without a depth attached to it is not a fact about anything, so from here on every porosity in this course arrives with its depth.

## Two mechanisms, in order

Porosity is lost by two different processes and they act at different stages of burial.

The first is mechanical. As sediment is loaded by whatever is deposited on top of it, water is squeezed out of the pores and the grains rearrange into a tighter packing. Rounded grains roll and slide into the gaps between their neighbours. Platy clay flakes, which settle in an open house of cards arrangement, bend and rotate until they lie flat and parallel. Soft grains deform against harder ones. None of this changes the grains chemically. It just packs them better, and it is fast, in the sense that it happens as soon as the load arrives.

The second is chemical, and pressure solution is the dominant form of it. Where two grains press against each other, the stress at the contact raises the solubility of the mineral there, so it dissolves. The dissolved material moves a short distance and reprecipitates in the pore space nearby, where the stress is lower. The grains interpenetrate, the contacts flatten from points into surfaces, and the pore space is filled with the cement that came out of them. This process needs elevated temperature to run at any speed, so it takes over from mechanical compaction as the section gets deeper and hotter.

The practical consequence is that a deeply buried rock has lost porosity in a way that cannot be undone by removing the load. Mechanical compaction is close to irreversible in practice, and chemical compaction is irreversible in principle, because the mineral has moved. A basin model that restores a layer to the surface is restoring geometry on paper, not predicting what would happen if you actually dug the rock up.

## Why the loss is exponential

The natural first guess is that porosity falls by a fixed amount for every kilometre of burial. It does not, and the reason is in the mechanics.

What compacts is the pore space. The grains themselves are nearly incompressible at these stresses, so all of the volume change comes out of the pores. Each increment of load closes a proportion of the pore space that is still there, and as the pore space runs out there is less of it left to close, so the same increment of load takes away less. The rock gets stiffer as it compacts because it is more grain and less void.

Write that sentence as a rate and you get the exponential. The loss of porosity per metre of burial is proportional to the porosity that remains, which gives

$$\frac{d\phi}{dz} = -c\,\phi$$

and the solution to that is a porosity that falls by the same factor for every equal increment of depth. The next lesson names the curve and its two parameters.

Look at what the engine returns for shale down the section:

| depth | shale porosity (v/v) |
|---|---|
| 0 m | 0.63 |
| 500 m | 0.48819739371548104 |
| 1000 m | 0.37831221465172754 |
| 2000 m | 0.22717481230903933 |
| 3000 m | 0.13641747040908445 |
| 4000 m | 0.08191808785340832 |

Divide each of the 1000 m entries by the one above it and you get the same factor every time. That is the signature of an exponential and it is worth confirming with a calculator once, because it is the reason the curve never behaves badly.

Now try the linear story on the same numbers. Take the drop over the first 1000 m and repeat it. A straight line at that rate reaches zero porosity before 3000 m, which would mean a shale with no pore space at all at a depth where the engine still has 0.13641747040908445 and where real wells still produce water. A linear compaction law has a depth at which the rock ceases to exist. An exponential approaches zero and never arrives, which is the behaviour the rocks actually show.

## Why porosity and not density

A basin model could in principle track bulk density instead. It tracks porosity, for three reasons.

Porosity is the variable with the physical meaning in this problem. It is the space, it is what the water and later the hydrocarbons occupy, and it is what is being destroyed. Bulk density is a consequence of it.

Porosity is bounded and dimensionless. It runs from the surface value down towards zero, so a value outside that range is visibly an error. A density can be wrong by a plausible looking amount and stay plausible looking.

Grain density is a property of the lithology and does not change with burial. The engine's library carries one value per rock: 2720 kg/m3 for shale, 2650 for sandstone, 2710 for limestone and 2600 for dolomite. Because that number is fixed, bulk density can always be recovered from porosity and the pore fluid, so tracking porosity loses nothing and keeps the compaction law in the variable it is actually written in.

There is a fourth reason and the next lessons build on it. The complement of porosity, the grain fraction, is what is conserved when a layer is buried or restored. Track porosity and that conservation is one subtraction away.

## Exercise

Using the table above, check whether the fall in porosity between 1000 m and 2000 m is larger or smaller than the fall between 0 m and 1000 m, and say which of the two mechanisms described in this lesson you would expect to be doing most of the work at each of those depth intervals.

Self check: the fall from 0.63 to 0.37831221465172754 over the first kilometre is larger in absolute terms than the fall from 0.37831221465172754 to 0.22717481230903933 over the second, even though both are the same proportional loss, because the second kilometre starts with less pore space to remove. Mechanical rearrangement and dewatering dominate the shallow interval, where the sediment is loose and water rich. Pressure solution and cementation take over deeper, where the section is hot enough for the chemistry to run.
