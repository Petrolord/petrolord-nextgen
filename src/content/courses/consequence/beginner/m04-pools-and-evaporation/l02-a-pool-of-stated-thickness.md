# A pool of stated thickness

{{panel:cq-release}}

Not every spill lands in a bund. A release onto open ground, a road or a deck spreads until something stops it: surface roughness, a kerb, evaporation, soaking into the ground. Modelling that spreading well is hard, and this engine does not attempt it. It asks instead for a pool thickness, which the analyst states, and computes the pool from that. This is the fifth declared choice: no spreading model, a pool is a bund floor or a STATED thickness.

## The model, in the engine's words

The basis reads, verbatim: "A = V / delta with the stated thickness; D = sqrt(4 V / (pi delta))". The area is the volume divided by the thickness delta, and the equivalent diameter is the circle of that area.

## The same spill at four thicknesses

The 30 m3 spill, unconfined, at four stated thicknesses:

| thickness m, stated | containment | area m2 | equivalent diameter m |
| --- | --- | --- | --- |
| 0.005 | UNCONFINED_STATED_THICKNESS | 6000.000000 | 87.403874 |
| 0.01 | UNCONFINED_STATED_THICKNESS | 3000.000000 | 61.803872 |
| 0.02 | UNCONFINED_STATED_THICKNESS | 1500.000000 | 43.701937 |
| 0.05 | UNCONFINED_STATED_THICKNESS | 600.000000 | 27.639532 |

The containment flag names the choice: UNCONFINED_STATED_THICKNESS. It is written into every result so that nobody downstream mistakes a stated thickness for a modelled one.

The diameter goes as one over the square root of the thickness. Halving it from 0.01 to 0.005 m raises the diameter by, derived, 1.414214, and doubles the area. That sensitivity is the reason the thickness must be stated and recorded. It is a judgement, and it moves every result built on the pool. A thinner pool is a wider pool, and a wider pool evaporates faster and would burn as a larger fire. A study that is unsure should run more than one thickness, report each, and say which surface each one represents: a smooth deck, rough gravel or soft ground.

## The published pool

The Yellow Book works an unconfined pool: a volume of 28.3 m3 at a thickness of 0.02 m, printed as a diameter of 42.445 m and an area of 1415 m2. The engine gives a diameter of 42.445659 m and an area of 1415.000000 m2. The book prints its values truncated, which is why the last digits differ. This published case is the check behind the pool of stated thickness, and it is one of the quantities a capstone grades.

## When there is neither

A spill with no bund and no thickness has no pool the engine can compute, and it refuses:

> bundAreaM2: a bund area (confined pool) or a pool thickness (unconfined pool) is required: no spreading model is implemented

The refusal names the bund field and offers both routes. It tells the analyst exactly what is missing and why the engine will not guess it.

## Exercise

On the pool view, type a pool thickness of 0.02 m, which replaces the bund, for the default 30 m3 spill, and confirm the area and diameter against the table. Then enter the Yellow Book case, 28.3 m3 at 0.02 m, and compare the engine's diameter with the printed 42.445 m. Write one sentence on how the thickness you type would have to be justified in a study.
