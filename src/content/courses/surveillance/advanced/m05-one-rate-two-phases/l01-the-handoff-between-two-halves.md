# The handoff between two halves

`liftScreening` documents its `targetRate` as bbl/d of liquid. `liftAdvisor` takes the identical field as the oil design rate and receives the water cut separately. The shipped studio passes one number to both.

{{panel:pd-reading-explorer}}

## Where the two modules disagree

`screenLift` runs a rules matrix whose rate bands were written against a liquid duty: what a pump, a plunger or a jet has to move. `runDesignPass` compares the same input against the inflow's oil absolute open flow and hands it to each design chain as an oil rate, with the water cut supplied as a separate condition. Neither return carries a field naming which phase it read.

## The published seam

A golden case, at an oil rate of 300.000000000 bbl/d and a water cut of 70.000000 per cent, which is a liquid rate of 1000.000000000000 bbl/d. Water cut is a per cent in both lift modules and a fraction in surveillance and allocation.

| Method | Read as oil | Read as liquid |
| --- | --- | --- |
| gasLift | 100 | 100 |
| esp | 85 | 100 |
| jetPump | 80 | 80 |
| rodPump | 80 | 40 |
| pcp | 35 | 35 |
| plunger | 0 | 0 |

The recommended set is `gasLift esp` on both readings. The order is not: `gasLift esp rodPump jetPump pcp plunger` one way and `gasLift esp jetPump rodPump pcp plunger` the other, because the rod pump moves forty points and changes places with the jet pump.

## What the golden did with it

`lift_screening_cases.seams` commits the disagreement as a measurement rather than committing one reading as the expected answer. The screening oracle is independent of the module: it re-expresses every rule as a declarative penalty ledger walked by one generic scorer with no branch on a method anywhere. It gates what the matrix returns on a given input, and it cannot gate which phase the caller meant.

## The handoff on the teaching field

OGUTA is invented for this course. Its lift well sits at 9200 ft with a bottomhole temperature of 232.000000 degF and an inflow absolute open flow of 2480 stb/d. The number handed to the lift half is 310.547186969, the allocated oil for OGUTA-6 on the last allocated day, which is a volume over one calendar day being read as a rate in bbl/d. The water cut of 27.095464888 per cent and the gas-oil ratio of 653.977879649 scf/stb come off the seven day field KPIs.

Read as oil, the liquid that method must actually move is 425.964155029 bbl/d, which is 1.371656781651 times the number handed over, and the gas-liquid ratio a plunger cycle would see is 476.779532895585 scf/bbl.

## The mistake

Carrying one figure across the handoff and letting the second module name the phase. The two answers differ by the water cut, and the water cut is exactly the thing an allocated volume has already been split by.

## Exercise

Take the teaching well's duty and write down the oil rate and the liquid rate it implies.

Then say which of the two the rod pump's rate band was written against, and what you would have to add to the return for a reader to tell.
