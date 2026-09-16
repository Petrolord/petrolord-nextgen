# Working the capstone

A graded question hands you a line and asks for a number about it. The method is to run the chain in order, write the unit beside every figure, and let the stated conditions be conditions rather than things to look up.

{{panel:fc-liquid-explorer}}

## Step one: settle the inputs before any arithmetic

Write down the rate in bpd, the bore in inches, the length in FEET, the density in lb/ft3, the viscosity in cp and the roughness in inches. On OGBIA that is 12000.000000 bpd, 7.981000 in, 26400.000000 ft, 54.500000 lb/ft3, 2.500000 cp and 0.001800 in.

Check the length's unit first. Liquid work here is in feet, and the loss scales directly with it.

## Step two: area, then velocity

The bore gives the flow area, 0.347410 ft2 on OGBIA, and the rate divided by that area gives 2.244621 ft/s. The barrel, the day and the 144 square inches in a square foot all live in this step, and a velocity that comes out absurd is nearly always one of them.

## Step three: the Reynolds number, then the regime

The density, the velocity, the bore and the viscosity give 48431.2523, which the engine reports as turbulent. Read the regime it reports before using the friction factor, because the two branches are different laws and the band between them is labelled rather than correlated.

## Step four: the friction factor

The roughness over the bore gives a relative roughness of 0.0002255356, and with the Reynolds number that gives 0.0218149625. This is the one step that iterates, and it is the step to quote to the digits the engine gives.

## Step five: the losses, kept apart

| term | on OGBIA |
| --- | --- |
| friction | 25.660631 psi |
| fittings at a resistance sum of 4.500000 | 0.133351 psi |
| elevation at zero rise | 0.000000 psi |
| total | 25.660631 psi |

Report the total and the terms behind it. A question asking for friction and a question asking for the total are different questions whenever a hill or a fitting list is in play.

## Step six: the erosional check, at the stated c factor

The c factor is always stated in a graded question here. With it and the density the ceiling follows, 13.545709 ft/s at c 100.000000, and the line velocity is measured against it at 0.165707.

## A check to run at the end

Three quick tests catch most errors. A velocity that is wildly large usually means the barrel, the day or the 144 went missing. A friction factor above one means the line is laminar, so the regime is worth re-reading. And a total that differs from the friction means a hill or a fitting list is in play, which the question will have stated.

## The mistake

Answering the erosional part with a remembered c factor. The question states one because the course holds those figures for the literature, and an answer computed at a different c factor is a correct calculation of something nobody asked for.

## Exercise

Run the six steps on OGBIA and state the friction loss and the total, each with its unit. Then name the step that iterates, and say what a graded question always states before asking for an erosional velocity.
