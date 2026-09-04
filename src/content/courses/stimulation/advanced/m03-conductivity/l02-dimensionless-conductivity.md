# Dimensionless conductivity

A conductivity on its own tells you nothing. It only means something next to the rock it has to drain.

{{panel:st-pack-explorer}}

## A contest between two abilities

Dimensionless conductivity is the fracture conductivity divided by the formation permeability times the half-length. Written that way it is a ratio of two flow capacities. The numerator is the fracture's ability to carry fluid along itself, from the tip back to the wellbore. The denominator is the reservoir's ability to deliver fluid into the fracture across its face.

If the ratio is large, the fracture swallows everything the rock can hand it and the pressure drop inside the channel is negligible. The fracture behaves as if it were infinitely conductive. If the ratio is small, fluid queues up inside the fracture, the far half of the length is starved, and the outer tip is doing very little work.

The engine writes it as kfw divided by k times xf. Notice that half-length appears in the denominator. Lengthening a fracture without adding conductivity makes the ratio worse, not better.

## The published job is starved of conductivity

For the published case the retained conductivity is 9.84433461550515e-14 m3, the formation permeability is 1 mD and the half-length is 150 m. The dimensionless conductivity is 0.6649847808507611.

Compare that with the unified design optimum the engine carries, which is 1.6. The published job sits below the optimum, so it is conductivity-starved and not length-starved. The design has bought more length than the pack can feed. Adding another fifty metres of half-length with the same proppant would push the ratio further down, not up.

That is the single most useful reading in this module. Whenever the number is under 1.6, extra length is the wrong purchase.

## The correlation has edges

The engine will compute a pseudo-skin for any positive conductivity, but it only trusts the correlation between 0.1 and 1000. Outside that band it still returns an answer and attaches a warning naming the offending value and the range. Treat a warned result as an indication of direction and nothing more.

## Exercise

In the panel, read the dimensionless conductivity for the published job and state whether the design needs more pack or more length.

Halve the half-length in your head and say what happens to the ratio and in which direction it moves relative to 1.6.

Push the half-length out until the panel raises the correlation range warning, then note the value that triggered it.
