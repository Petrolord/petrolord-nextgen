# Lithology changes the curve

Every lithology gets its own pair of compaction parameters, and the pair is what makes a sandstone behave differently from a shale under the same burial. This lesson puts the four lithologies in the engine's library side by side, then works through the result that catches almost everyone the first time they see it.

## The library

| lithology | $\phi_0$ | $c$ (per m) | grain density (kg/m3) |
|---|---|---|---|
| shale | 0.63 | 0.00051 | 2720 |
| sandstone | 0.49 | 0.00027 | 2650 |
| limestone | 0.45 | 0.00035 | 2710 |
| dolomite | 0.50 | 0.00040 | 2600 |

Read the first two columns as a pair, because neither one means much alone.

Shale has the highest surface porosity of the four at 0.63, and it also has the largest compaction constant at 0.00051 per m. Clay flakes settle in an open, water rich framework, so there is a great deal of pore space to begin with, and that framework collapses readily as soon as it is loaded, so the space is lost quickly.

Sandstone is the opposite on both counts. It starts lowest but one, at 0.49, because rounded grains pack reasonably well the moment they come to rest. Its compaction constant is the smallest of the four at 0.00027 per m, because a framework of quartz grains that is already well packed has little left to give by rearrangement. It has to wait for chemistry.

Limestone starts lowest at 0.45 and compacts at 0.00035 per m. Dolomite starts at 0.50 and compacts at 0.00040 per m.

## Porosity by lithology and depth

Now run all four down the same section.

| depth | shale | sandstone | limestone | dolomite |
|---|---|---|---|---|
| 0 m | 0.630000 | 0.490000 | 0.450000 | 0.500000 |
| 1000 m | 0.378312 | 0.374056 | 0.317110 | 0.335160 |
| 2000 m | 0.227175 | 0.285547 | 0.223463 | 0.224664 |
| 3000 m | 0.136417 | 0.217980 | 0.157472 | 0.150597 |

All values are porosity in v/v, at the stated depth.

Read that table row by row and watch the order change.

At the surface, shale is the most porous of the four at 0.630000 and limestone the least at 0.450000. Sandstone is second least at 0.490000.

At 3000 m the ranking has been turned over. Sandstone is now the most porous at 0.217980 and shale is the least at 0.136417. The rock that started with the most pore space ends up with the least, and the rock that started nearly the tightest ends up the most open.

## The crossover

The pair to watch is shale and sandstone, because it is the pair you meet in every reservoir and seal argument.

At the surface shale leads by a wide margin, 0.630000 against 0.490000.

At 1000 m the gap has almost closed. Shale holds 0.378312 and sandstone holds 0.374056. Shale is still ahead, but only just, and a small change in either parameter would swap them.

At 2000 m the order has reversed. Sandstone holds 0.285547 while shale holds 0.227175, and now sandstone is clearly the more porous of the two.

So the crossover for this pair sits between 1000 m, where shale is still slightly ahead, and 2000 m, where it is behind. Below that crossover, the sandstone is the porous rock and the shale is the tight one, for the rest of the section.

The mechanism is entirely in the compaction constants. Shale loses porosity at 0.00051 per m and sandstone at 0.00027 per m, so shale's curve bends down almost twice as hard. Shale starts with a large lead and spends it faster than sandstone spends its smaller stock. Somewhere the two curves have to cross, and they do.

The general statement is worth memorising, because it is the sentence this lesson exists for. The most porous rock at the surface is not the most porous rock at depth. Surface porosity tells you where a curve starts. The compaction constant tells you where it ends up, and at any depth of interest to a petroleum system it is the constant that has had the most say.

## Why this matters beyond the arithmetic

Three consequences follow directly.

The first is that a seal and a reservoir get more different with depth, not less. At the surface the shale is the more porous of the pair, which sounds like nonsense in seal terms until you remember that porosity is not permeability. By 2000 m the shale has closed down past the sandstone and the contrast is working in the direction the trap needs.

The second is that a sand at depth can retain far more porosity than a shale above it, which is why deep reservoirs remain worth drilling long after the shales around them have compacted to almost nothing.

The third belongs to the next module. A layer's solid thickness, and therefore how much it expands when you restore it, depends on which curve it followed. Restore a 100 m shale and a 100 m sandstone from the same depth and they do not grow by the same amount, because they did not lose the same pore space on the way down. A burial history built with the wrong lithology assigned to a layer will have that layer at the wrong depth for the whole of its history, and every temperature computed for it afterwards will be wrong with it.

The panel below draws these curves. Change the lithology while holding the depth fixed and watch the ranking move as you pass through the crossover.

{{panel:bs-burial-heat-explorer}}

## Exercise

Using the table above, name the most porous and the least porous of the four lithologies at 3000 m, with their values. Then explain in two sentences how shale can be the most porous at the surface and the least porous at 3000 m, naming the parameter responsible.

Self check: at 3000 m sandstone is the most porous at 0.217980 v/v and shale is the least at 0.136417 v/v. Shale begins with the highest surface porosity of the four at 0.630000, so it leads at the surface, but it also has the largest compaction constant at 0.00051 per m, so it loses a larger proportion of its remaining pore space with every metre of burial than any of the other three. Sandstone's compaction constant of 0.00027 per m is the smallest in the library, so its curve falls most slowly, and by 2000 m it has already overtaken shale and holds 0.285547 v/v against shale's 0.227175 v/v.
