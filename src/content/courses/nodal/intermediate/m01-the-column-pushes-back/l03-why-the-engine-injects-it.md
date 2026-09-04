# Why the engine injects it

The module will not compute your oil well's outflow. That is not a gap in the code, it is a decision.

{{panel:pd-vlp-explorer}}

## What is injected

The node solver takes both curves as FUNCTIONS and never asks what produced either. Only the dry gas column is built in; every oil well is supplied by the caller. The engine's header gives the reason: Cullender and Smith needs nothing but a z-factor and is therefore honestly self-contained, while a black oil traverse belongs to whoever owns the PVT stack.

## Why the gas column is self-contained

Its inputs are measurements and hardware: 8000 ft vertical, 2.441 in, 0.0006 in roughness, gas gravity 0.65, 800 psia wellhead, 100 degF to 200 degF. Only z is a model.

| Pressure, psia | Temperature, degF | Gas gravity | z factor |
| --- | --- | --- | --- |
| 150 | 90 | 0.6 | 0.98086541 |
| 800 | 120 | 0.65 | 0.90756402 |
| 2500 | 180 | 0.65 | 0.88010263 |
| 4500 | 220 | 0.7 | 0.97569737 |

It closes its own defining integral: 97501.5914 psi units against 97500.0000 for the static case at 952.982971 psia, 157499.8411 against 157500.0000 for the deviated case at 1399.082259 psia. Even z is injectable, so a consumer on another correlation is not contradicted.

## Why a black oil traverse is not

It needs PVT correlations, viscosities, a flow pattern map and a holdup correlation. The Suite marches Beggs and Brill, Hagedorn and Brown, Gray or Fancher and Brown depending on the well: four defensible methods for one job. Hardcoding one asserts an invisible choice the module cannot defend, then disagrees with the consumer's own traverse while presenting both with equal confidence.

This is a module refusing to pretend it knows something.

## What injection buys

An injected curve can be an instrument, so the solver is checkable by arithmetic. The golden whose residual is an exact parabola, on an open flow of 2000.000000 stb/d, reads 770.000000 psi at 100.0000 stb/d, 210.000000 at 500.0000, -40.000000 at 1000.0000, 210.000000 at 1500.0000 and 770.000000 at 1900.0000. That symmetry is unavailable to a module that generates its own physics.

The teaching wells are instruments too: BONNY-7 at 420 psia, 2150 psi, 375 stb/d and 0.00064 psi per (stb/d) squared, FORCADOS-3 at 960 psia, 3350 psi, 820 stb/d and 0.000105. Right shape, not traverses.

## What it costs

You must bring an outflow, and nothing checks it: a curve computed in psig or on the wrong flow regime is solved as confidently as a correct one, and two consumers can disagree about one well while both stay internally consistent. The module quantifies its own column's limits, the golden static case reading 952.972591 psia published against 952.982971 converged, a truncation of -0.010380 psi. It can say nothing about your traverse.

The commonest misreading is that injected means unimportant. The second is running an oil well through the dry gas column, which has no lightening term and rises from 952.986300 psia at 13.2893 Mscf/d to 1842.190804 psia at 13289.2963 Mscf/d with no bend anywhere.

## Exercise

In the panel, read the golden static column's converged pressure and its defining integral against 97500.0000.

Then name what the module would have had to assume to compute BONNY-7's outflow, and what you lose if it assumes wrong silently.
