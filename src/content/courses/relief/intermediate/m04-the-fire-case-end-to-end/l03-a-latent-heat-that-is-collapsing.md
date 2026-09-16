# A latent heat that is collapsing

{{panel:fc-fire-drum-explorer}}

The relief load is the duty divided by a latent heat, and near the critical point a latent heat goes to zero. Divide by something approaching zero and the load goes to infinity, which is the arithmetic telling you the method has stopped describing the physics. This engine notices, and it warns rather than refusing.

## The edge, bisected

| the edge | value |
| --- | --- |
| the latent heat below which the warning fires, Btu/lb | 50.000000000000 |

That figure is bisected out of the engine's own behaviour rather than read off a constant. The question asked is where the returned warning appears, and the answer is the edge.

## The latent heat walked, at a fixed duty

| latent heat Btu/lb | relief load lb/hr | warning |
| --- | --- | --- |
| 300.000000 | 14780.3842 | no |
| 200.000000 | 22170.5763 | no |
| 150.000000 | 29560.7684 | no |
| 128.000000 | 34641.5255 | no |
| 100.000000 | 44341.1526 | no |
| 60.000000 | 73901.9210 | no |
| 49.000000 | 90492.1482 | yes |
| 30.000000 | 147803.8420 | yes |

The duty is fixed all the way down the table, so every movement in the load column comes from the divisor. The direction is clear: a smaller latent heat gives a larger load, and the growth accelerates as the divisor shrinks.

Do not form a ratio between two of those rows. The table prints loads at latent heats and prints no relationship between them, and a quotient you assemble from two rows is a number this engine never produced.

## Why a warning and not a refusal

The choice matters, and it is the right one. A refusal would stop a calculation that is still the best available screening estimate. Near-critical relief is a real problem that has to be sized somehow, and the standards themselves acknowledge the latent-heat method is breaking down there rather than forbidding it.

So the engine returns the load and attaches a warning saying the fluid is near critical and the method is degrading. The load is still the load the relation gives. What the warning adds is the information that the relation is outside the range where you should trust it without a second method.

That shape generalises. A refusal says the answer would be meaningless. A warning says the answer is the one you asked for and the question has become questionable.

## Where the number comes from

The latent heat is a stated input, so the real question is which one. A boiling liquid's latent heat depends on the pressure it boils at, and a fire case boils at the relieving pressure rather than at operating pressure. Looking the property up at the wrong pressure is the commonest way this step goes wrong, and nothing in the return can detect it.

## What it does to the letter

At a latent heat of 90 Btu/lb the teaching chain gives a relief load of 49267.9473 lb/hr, a required area of 2.244651 in2 and orifice L, where the stated case at 128.000000 Btu/lb gives orifice K. A single property lookup, one letter of difference, and no warning on either of them because both latent heats are well above the edge.

Most of the risk sits far above the edge, in a latent heat looked up at the wrong pressure, where nothing fires at all.

## Exercise

State the latent heat edge at the precision the course prints it and how it was found. Then say why the engine warns rather than refusing there, and give the load, the required area and the letter the chain reaches at a latent heat of 90 Btu/lb.
