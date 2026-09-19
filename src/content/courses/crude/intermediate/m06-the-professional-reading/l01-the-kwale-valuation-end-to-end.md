# The Kwale valuation end to end

Every module in this tier built one piece of a single valuation. Here it is in one place, read from the crudes to the marker.

{{panel:crude-valuation-explorer}}

## The whole chain

| figure | value |
| --- | --- |
| blend API | 33.1219 |
| blend T50 F (interpolated) | 587.3184 |
| Watson K at T50 (screening) | 11.8135 |
| LPG / Light ends yield volume percent | 0.7174 |
| Naphtha yield volume percent | 20.5591 |
| Kerosene / DPK yield volume percent | 16.2860 |
| Diesel / AGO yield volume percent | 19.3849 |
| Atmospheric residue yield volume percent | 43.0526 |
| gross product value $/bbl | 74.2412 |
| loss value $/bbl | 0.5939 |
| netback $/bbl | 64.9473 |
| differential against the marker $/bbl | -7.5527 |

## Reading it in order

Start with the offer: Kwale Light and Ughelli Medium, 55 and 45 by volume, to an invented topping refinery in Delta State.

The blend API, 33.1219, is the Associate tier's figure, computed from the volume-blended specific gravity, never averaged directly.

Module 1 built the blend's own curve at every temperature either crude measured, 14 points. It weights volume percents on volume and does not average temperatures.

Module 2 read that curve: T50 interpolated is 587.3184 F. Watson K at T50 is 11.8135, labelled screening, because T50 stands in for the mean average boiling point the studio does not compute. That is held item C13, a stated limit.

Module 3 cut the curve on Kwale's own cut set, ending at atmospheric residue because Kwale has no vacuum unit. The five yields close, and each matches the volume-weighted crude yields with a printed difference of 0.0000.

Module 4 priced them. The gross is 74.2412 $/bbl. The loss at 0.8 percent comes off on the product side, before the costs, as a named term of 0.5939 $/bbl. Processing and freight come off per barrel of crude. The netback is 64.9473 $/bbl, complete, with nothing assumed zero.

Module 5 set it against Kwale's marker of 72.5 $/bbl. The differential, this crude's netback minus the marker's, is -7.5527 $/bbl. And the blend's netback minus the volume-weighted mean of the two crudes' netbacks is 0.0000: the blend is worth what its barrels are worth.

## Four checks on the chain

The engine's reports make each step checkable. Do the yields close? Here they do. Is the valuation complete, with nothing assumed zero? Here it is. Was the loss taken on the product side, before the costs? The loss appears as its own term directly after gross. Does the blend's netback match the volume-weighted netbacks of its crudes? The digest prints 0.0000.

## What the studio shows with nothing typed

The Crude Assay & Blending Studio opens on a default pair, 60 and 40, on its default cuts and default valuation. The digest prints what it shows:

| figure | value |
| --- | --- |
| blend API | 30.6451 |
| blend sulfur wt% (basis: mass) | 1.0050 |
| blend T50 F (interpolated) | 617.1429 |
| Watson K at T50 (screening) | 11.7452 |
| LPG / Light ends yield volume percent | 0.4615 |
| Naphtha yield volume percent | 20.1987 |
| Kerosene / Jet yield volume percent | 16.1124 |
| Diesel / Gasoil yield volume percent | 16.7449 |
| Vacuum gasoil yield volume percent | 27.7681 |
| Vacuum residue yield volume percent | 18.7143 |
| gross product value $/bbl | 76.6165 |
| netback $/bbl | 69.7334 |
| stability screen basis | api-contrast |

Its cut set is the vacuum refinery's, so its yields run to vacuum gasoil and vacuum residue. Its sulfur carries the basis the engine names for it, mass. Its stability screen basis reads api-contrast, and the digest says why: "Crudes in the default pair that carry a SARA analysis: none." With no SARA, the screen falls back to the gravity rule of thumb the Associate tier taught, which can raise a flag and cannot clear one.

A learner who opens the studio sees this table first. The digest's caption names what it rests on: the default pair, 60 and 40, on the default cuts and the default valuation. Before reading any figure on the page, read which pair, which cut set and which prices it rests on.

## Exercise

Read the Kwale table from blend API to differential. For each of these five figures, the T50, the Naphtha yield, the gross product value, the loss value and the differential, name the module that built it and the basis or rule it was built on. Then quote the digest's line on which crudes in the default pair carry SARA, and say what it explains in the default table.
