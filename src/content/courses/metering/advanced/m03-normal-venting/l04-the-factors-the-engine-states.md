# The factors the engine states and does not cite

The venting numbers in this module rest on a handful of factors, and every one of them is the engine's own stated choice. It says so. Reading a venting result means knowing which parts of it are relations and which parts are somebody's judgement.

## What the engine states about its own factors

> 1 scfh of air per barrel of capacity for an uninsulated tank at a latitude factor of 1, with the low-volatility outbreathing at 0.6 of it. These factors are this engine's stated choices and are not cited to a document in this repository

The two the engine returns alongside the result are the thermal rate per barrel of capacity, at 1.000000, and the latitude factor, at 1.000000. They are returned rather than hidden so a reader can see the basis of the inbreathing figure in the same result that carries it.

## The insulation credit

Insulation reduces the thermal term, and the size of the reduction is again the engine's own choice:

| RELATION: the thermal inbreathing of this tank, insulated against uninsulated | value |
| --- | --- |
| uninsulated, scfh | 19608.4845 |
| insulated at the engine's stated credit, scfh | 4902.1211 |
| difference (first less second) | 14706.3634 |
| ratio (first over second) | 4.000000 |

A ratio of 4.000000, quoted from that relation line. The engine explains the basis:

> insulation cuts the thermal rate substantially and the credit applied here is 0.25, which is this engine's stated choice rather than a value read from the standard; the standard allows a calculated credit for a documented insulation system

The last clause is the useful one for a designer. A credit of this size is worth having and the route to it is a calculation over a documented insulation system, which means the insulation has to be specified, installed and maintained as designed before the credit is real.

## Where the proportionality stops

The thermal rate here is proportional to capacity, and that proportionality has an end. Above a stated capacity of 20000.0000 bbl the engine stops claiming it and says so:

> this tank holds 250,000 bbl, above the 20,000 bbl at which this package stops claiming the thermal rate is proportional to capacity. The published table above that capacity is not carried here, so this inbreathing figure is an extrapolation and must be checked against API 2000 before a vent is bought

That is the right behaviour at an edge. The engine still returns a figure, so a study is not blocked, and it labels the figure an extrapolation, so nobody buys a vent on it. A silent extrapolation on a large tank is the same class of error as a silent table lookup outside a table.

## What this means in practice

When a venting figure matters, write down which factors were applied and where each came from. The relation is the easy half and the factors are the half a reviewer will challenge.

## Exercise

Find the two stated thermal factors the engine returns in digest SECTION 27 and say what the thermal inbreathing of this tank would be keyed to if both were left at the values shown. Then name the one figure in SECTION 25 they are applied to.
