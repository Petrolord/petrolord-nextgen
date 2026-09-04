# Volume per stroke

Take the speed out of the rating and one stroke is left. It is the honest unit of a rod pump, and it is a volume of barrel rather than a volume of oil.

{{panel:pd-string-explorer}}

## The barrel the plunger sweeps, once

Over the published 106.687717 in stroke:

| Plunger, in | Swept volume, in3 | Swept volume, bbl |
| --- | --- | --- |
| 1.5000 | 188.532758 | 0.019432360 |
| 1.7500 | 256.614032 | 0.026449601 |
| 2.0000 | 335.169347 | 0.034546418 |
| 2.2500 | 424.198705 | 0.043722810 |
| 2.5000 | 523.702105 | 0.053978778 |

The conversion between the two columns is the engine's IN3_PER_BBL, 9702 in3 per bbl, which is 42 gallons of 231 in3.

## From one stroke to a day

The rating is that volume repeated. A 1.7500 in plunger sweeps 0.026449601 bbl per stroke, and at 10 spm the engine reports a rated displacement of 380.874258458 bbl/d. Nothing happens between those two numbers except counting strokes.

That is worth saying plainly, because it means a rated displacement contains no dynamics whatever. The volume per stroke does not depend on speed. The rating depends on speed only through the count.

## What has to be true for that barrel to be full

Two conditions, and the multiplication assumes both.

The first is that the plunger travels the whole 106.687717 in. That figure is the polished rod's stroke, delivered by the four-bar linkage at the surface. What the plunger travels is a different quantity, and the fluid load that the plunger creates is already stretching the string above it before the plunger has moved: 4690.299657039 lb on the published taper is 17.560655738 in of stretch.

The second is that the barrel fills. A swept volume is a geometric space. Whether liquid arrives to occupy it depends on the inflow, the intake pressure and the free gas, none of which appears anywhere in the product.

## The mistake

Calling the swept volume a production. A 2.5000 in plunger sweeps 0.053978778 bbl of space per stroke whether that space fills with liquid, with gas or with nothing at all, and the number is identical in all three cases. The engine carries a separate fillage input and a separate pump efficiency input precisely because the swept volume cannot express either one.

## What it refuses

It refuses to check its own two conditions. There is no inflow model here to say the barrel fills, and no rod string in the multiplication to say the plunger travelled what the polished rod travelled. The engine will report a swept volume for any diameter and any stroke it is handed.

## Exercise

Read the swept volume in in3 and in bbl for the 1.7500 and 2.5000 in plungers on the published stroke.

Then write the two conditions that would have to hold for a day of those strokes to arrive at the tank.
