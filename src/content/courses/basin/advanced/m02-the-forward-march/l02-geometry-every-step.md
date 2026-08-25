# Geometry every step

At every step, the model rebuilds the basin's geometry from scratch: whichever layers exist are stacked top down, each decompacted against its current top depth from its invariant solid thickness. This lesson works the mechanics once by hand and establishes the properties the rest of the tier leans on.

## The per-step stack

The algorithm is the Associate tier's decompaction run in a loop. Start at depth zero. Take the youngest existing layer, find the thickness H whose solid content matches its stored solid thickness when its top sits here, place its bottom at top plus H, and continue downward with the next layer. The engine solves each layer's H by Newton iteration on the Associate tier's analytic integral; the independent oracle inverts the same integral by bisection, a deliberately different method agreeing to about 1e-4 m.

Two properties follow immediately. Geometry is a pure function of which layers exist: no memory, no rates, no history inside a step. And a layer's thickness depends on its burial: the same solid thickness makes a thick shallow layer or a thin deep one.

## The source through time

Track the source layer's bottom depth across its life. Deposited at 140 Ma, it sits at the surface, 0 to 728.8203220981025 m: the same 345.33834344581027 m of grain that today fits in 400 m of rock then occupied 729, at surface porosities. At 120 Ma the Mid Sand lands on it: top 1467.7117658564923. At 80 Ma the Upper Shale arrives: top 2800, bottom 3200, its present position and thickness, because from here to the phantom decade its overburden is today's. During 20 to 11 Ma the phantom section deepens it to 3519.372263771036. At 10 Ma it returns to 2800 to 3200 and stays.

That 728.82-to-400 compaction is worth a pause: the layer lost 45 percent of its thickness while losing none of its grain, and every intermediate state is recoverable from one stored number. The Associate tier called solid thickness the conserved currency of burial; here you watch the currency hold its value across 140 million years of transactions.

## Where the thicknesses come from, again

Module 1 fixed this and it matters enough to repeat: the stored solid thicknesses were derived once, from the present stack. So the model's present-day geometry is exact by construction, and every historical geometry is a prediction obtained by re-stacking conserved grain under different overburdens. If a real basin's source were at a different depth today, the entire history would rescale from that one anchor.

The re-stacking is also where lithology enters geometry: each layer decompacts on its own curve, sandstone at 0.49 and 0.00027 per m, shale at 0.63 and 0.00051. The sands above and below the source are stiffer, shallower-compacting rock; the deep Base Sand still holds most of its thickness at 4700 m where a shale would have thinned far more.

## Worked example

Verify the source's freshly deposited thickness by the Associate tier's own arithmetic. A surface shale layer with solid thickness 345.33834344581027 m: solve $H + (0.63/0.00051)(e^{-0.00051 H} - 1) = 345.33834344581027$. Try H = 728.82: the left side gives $728.82 + 1235.294 \times (e^{-0.371698} - 1) = 728.82 - 383.484 = 345.336$, within iteration tolerance of the target. The engine's Newton loop lands on 728.8203220981025 m, and you have just checked a forward-model geometry with a calculator.

## Exercise

State the two properties of per-step geometry named above, and the one number per layer that survives between steps. Then answer in one sentence: why must the model re-derive thicknesses every step instead of storing them?

As a self check: geometry is a pure, memoryless function of the existing layers, and thickness varies with burial at fixed grain; the surviving number is the solid thickness. Thicknesses cannot be stored because they are not conserved: every deposition or erosion above a layer changes its burial and hence its compacted thickness, so only the grain content is carried and the geometry is recomputed from it against each step's overburden.
