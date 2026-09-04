# What a valve needs

A valve at depth sees a pressure on its annulus side, and the gas column is the only thing that can tell you what it is.

{{panel:pd-vlp-explorer}}

## The working question

Gas enters the annulus at surface at a known pressure. A valve sits at a known depth. What pressure does its annulus side see.

That is the question Cullender and Smith was built for. Everything downstream is a comparison against it: whether gas can enter the tubing at all, how deep the injection point can go, whether a compressor discharge setting is adequate thousands of feet below the wellhead.

## Two columns

BONNY-7, static: 6700 ft measured and true vertical, gas gravity 0.61, 640 psia and 84 degF at surface, 176 degF at the shoe. Converged, 735.995592 psia. At the sixteen sub-intervals it runs at, 735.995265 psia with a midpoint of 688.588305 psia. Gradient 0.01432765 psi/ft.

FORCADOS-3, flowing: 11200 ft measured and 9750 ft true vertical, gas gravity 0.66, 1080 psia and 78 degF at surface, 232 degF at the shoe, 10.5 MMscf/d through 2.125 in at roughness 0.00040000. Converged, 2608.360298 psia. At twenty four sub-intervals, 2608.264008 psia with a midpoint of 1886.588368 psia. Gradient 0.15674503 psi/ft.

One gains under a hundred psi over its whole length. The other more than doubles its surface pressure.

## Where the difference comes from

Depth accounts for part of it, 9750 ft against 6700 ft of true vertical. Temperature works the other way, since FORCADOS-3's 78 degF to 232 degF is the wider profile and hotter gas is lighter.

Friction accounts for the rest and dominates. BONNY-7 has no rate and no friction group. FORCADOS-3's is 0.02721909, at Reynolds 4321814.73 and a Moody factor of 0.01603851. Depth and gravity cannot explain an order of magnitude. Friction can, so a psi/ft on an injection column means nothing until you know the rate.

## What it settles, and what it does not

It settles the annulus side, from published physics with a defining integral you can audit.

It does not settle whether the valve opens. That needs a dome charge, its temperature correction at depth, a port to bellows area ratio and the tubing pressure at the same depth. The column supplies one of those.

BONNY-7 shows the shape of the problem: an annulus reaching 735.995592 psia at 6700 ft, against a tubing standing at 2570 psia dead and flowing at 2062.142971 psia. The gas column barely gains with depth and the liquid column gains a great deal, so there is a depth below which the annulus loses the race.

## The mistake

Applying the surface pressure at depth understates what is available, conservatively but undeclared.

Applying a borrowed psi/ft is worse. Take FORCADOS-3's 0.15674503 psi/ft to a static annulus and you invent hundreds of psi that do not exist, because most of that figure is friction at 10.5 MMscf/d. Optimistic errors on injection pressure produce designs that do not unload.

## Exercise

Record the surface pressure, converged bottomhole pressure and gradient for both injection columns. Using only the inputs each was given, say why the two gradients differ by an order of magnitude.
