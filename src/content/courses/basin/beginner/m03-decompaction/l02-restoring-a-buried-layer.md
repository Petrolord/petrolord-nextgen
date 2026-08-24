# Restoring a buried layer

This lesson works one restoration all the way through, on the fixture the capstone grades. Take 100 m of shale whose top sits at 1000 m today, and put it back at the surface as it was on the day it finished being deposited.

## Step one: how much grain is in it

The layer is shale, so the compaction parameters are the library values, surface porosity $\phi_0 = 0.63$ and compaction constant $c = 0.00051$ per m. Solid thickness is the integral of the grain fraction through the layer:

$$H_s = \int_{z_t}^{z_t + H} \left(1 - \phi_0 e^{-cz}\right) dz$$

which the engine evaluates in closed form rather than numerically. For 100 m of shale with its top at 1000 m the answer is

**63.11728183077296 m of solid grain.**

Read that against a number from module 2. The same 100 m of shale sitting at the surface would contain only 38.57953418711555 m of grain, because at the surface the rock is 63 percent pore at the top and still very open at its base. At 1000 m the pores have closed enough that the same total thickness holds a good deal more rock. Two intervals of identical logged thickness in identical lithology are different amounts of rock if they sit at different depths, and solid thickness is how you compare them.

## Step two: where that grain sits at the surface

Now hold the 63.11728183077296 m of grain fixed and ask a different question. If the top of this layer were at 0 m rather than 1000 m, how thick would the layer be?

You cannot answer it by dividing, because porosity is not constant inside the layer. The layer's own base is deeper than its own top, so the deeper part of it is always slightly tighter than the shallower part, and the thicker you make the layer the more that matters. The unknown thickness appears inside the integral as well as outside it.

So the engine solves for it. It takes the same closed-form expression for solid thickness, with the top depth now set to 0, and searches for the thickness $H$ that makes it equal 63.11728183077296. That is a Newton-Raphson iteration on a smooth, monotonic function, and it converges in a handful of passes. The independent Python oracle inverts the same integral by bisection, which is a deliberately different method, and the two agree to about 1e-4 m.

The answer is

**159.79553483785466 m.**

That is the graded value. The layer that logs 100 m today was 159.79553483785466 m thick when it was deposited.

## Step three: read what that means

The layer has lost

$$159.79553483785466 - 100 = 59.79553483785466 \text{ m}$$

of thickness, which is **37.42 percent** of its original thickness. Just over a third of the original interval has been squeezed out of it as water, and none of the rock has gone anywhere.

Notice the denominator. The 37.42 percent is a share of the original 159.79553483785466 m rather than of the present 100 m. Compaction loss is conventionally quoted against the original thickness, and the same loss set against the present-day thickness gives a much larger number for the same event. When you read a compaction figure, check which denominator it uses.

## The same layer restored from four depths

The engine will restore 100 m of shale from any depth. Here are four, all from the same fixture:

| found at | solid thickness | restored thickness | thickness lost | lost as a share of original |
|---|---|---|---|---|
| 500 m | 52.404268 m | 134.010303 m | 34.010303 m | 25.3789 percent |
| 1000 m | 63.117282 m | 159.795535 m | 59.795535 m | 37.4200 percent |
| 2000 m | 77.852091 m | 194.513330 m | 94.513330 m | 48.5896 percent |
| 3000 m | 86.700278 m | 214.973300 m | 114.973300 m | 53.4826 percent |

The values in the middle row are the ones worked above, shown here rounded to six decimals, and the last column is on the original-thickness basis discussed above.

Read the table down and the pattern is clear. The deeper you find a 100 m layer, the more grain it contains, and the more it grows when you restore it. A 100 m shale found at 500 m was 134.010303 m when it was laid down. The same 100 m shale found at 3000 m was 214.973300 m, which is more than twice its present thickness.

The reason is the shape of the porosity curve. At 3000 m a shale holds porosity 0.13641747040908445, so a 100 m interval there is packed with grain, and putting that much grain back at the surface, where the rock starts at porosity 0.63, takes a great deal of room. At 500 m the layer is still fairly open, holds less grain per metre, and grows less on restoration.

The last column says the same thing as a share. A shale found at 500 m has given up 25.3789 percent of what it started as, and one found at 3000 m has given up 53.4826 percent, which is more than half.

There is a second reading of the same table that matters for burial history. The growth is not proportional to depth. Going from 500 m to 1000 m adds more to the restored thickness than going from 2000 m to 3000 m does, and the second of those is twice the depth interval of the first. The porosity curve flattens at depth, so most of the compaction that a layer will ever undergo happens in its first kilometre or so of burial. Layers that are already deep move very little as they go deeper still.

Use the panel to walk the curve yourself. Set a depth and a lithology and it reads the porosity, the solid thickness in place and the restored thickness at the surface.

{{panel:bs-burial-heat-explorer}}

## Exercise

A report says that a shale interval found at 2000 m has lost nearly half its thickness to compaction. Using the table, identify the figure the report is quoting, state which denominator makes that statement true, and explain why the same loss would sound far worse if it were quoted the other way round.

Self check: the figure is 48.5896 percent, and it is a share of the original restored thickness of 194.513330 m rather than of the present-day 100 m. The layer lost 94.513330 m of thickness, and setting that against the present 100 m instead would produce a figure close to the whole of the present thickness, which describes the same physical event and sounds like a different one. Compaction loss is meaningless until the denominator is stated, so quote it against the original thickness and say so. The 48.5896 percent is also larger than the 37.4200 percent at 1000 m, which it has to be: the deeper layer's present 100 m holds 77.852091 m of grain against 63.117282 m at 1000 m, so more of its original pore volume has already been driven out.
