# The vapour pressure of water

The numerator of the saturation division is the vapour pressure of water. It is the whole temperature dependence of the water content and it carries no pressure at all.

{{panel:fc-water-explorer}}

## Four temperatures

| degF | vapour pressure, psia |
| --- | --- |
| 60.000000 | 0.255814 |
| 80.000000 | 0.506169 |
| 104.000000 | 1.069612 |
| 140.000000 | 2.904091 |

Those four figures are the only thing temperature does in the whole water calculation. Everything downstream in this module that moves with temperature moves because one of those numbers moved first.

Read the column rather than any single row. The vapour pressure rises as the temperature rises, and it does so over the whole of this table. That direction is the reason a hot gas is a wet gas and a cooled gas gives water up. Record the four readings and let them show you the direction. Do not form a ratio between any two of them and call it the shape of the curve, because this course prints the figures a ratio would need and does not print the ratio.

## Where those numbers come from

The engine uses a Magnus form fit, and its three coefficients are declared constants: 0.610940, 17.625000 and 243.040000. Declared here means customary, with no publication inside this repository to check them against. They are exported under those names so a reader can see them.

A fit is not the curve. It is a formula chosen to lie close to a measured curve over a stated range of temperature, and outside that range it is an extrapolation of itself. This engine holds two ranges for these coefficients, one it will not answer outside of at all and a narrower one inside which they were actually published. The last lesson of this module reads both.

## Why a vapour pressure and not a chart

Water content in a gas is traditionally read off a chart, and a chart is a measurement. A vapour pressure fit is a calculation, so it costs nothing to evaluate, it reproduces exactly, and it can be pushed to any conditions the guard allows. What it gives up is the real gas behaviour a chart has built into it, because the chart was drawn from gas that was actually measured and the fit was drawn from pure water.

That trade is the whole character of this method. It is fast, it is transparent, it is exactly reproducible, and it is describing an idealisation of the real thing.

## Exercise

Record the vapour pressure of water at all four temperatures the table carries. Then say which of the two figures in the saturation division each one belongs to, and what would have to change about the gas for the vapour pressure at 104.000000 degF to be a different number.
