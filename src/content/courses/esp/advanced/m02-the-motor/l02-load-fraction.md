# Load fraction

A load fraction is one division: shaft power over a rating. The current is built from it, and three separate warnings are decided by comparing it against a threshold.

{{panel:pd-power-explorer}}

## The division, and the current that comes out of it

Golden electrical case 1 runs 125.00 hp of shaft on a 250 hp, 2400 V, 67 A plate. The electrical load fraction is 0.5000000000, and the motor current is the nameplate current scaled by it: 33.500000 A.

Golden electrical case 2 runs 78.00 hp on a 100 hp, 1300 V, 49 A plate. The fraction is 0.7800000000 and the current 38.220000 A. Across both cases the largest relative deviation between engine and recorded golden is 0.00000000000064.

There is no motor efficiency and no power factor in that step. A nameplate is amps at full load, so amps at part load is the plate scaled by the part.

## Three thresholds watch the same number

Sizing raises motorOverloaded above a selection load fraction of 1 and motorUnderloaded below 0.5. The current estimate is separately flagged weak below a load fraction of 0.5.

The teaching well IBENO-2 crosses the underloaded boundary on the derate alone. At no derate its selection fraction is 0.4962380648 and it raises motorUnderloaded. At a 5 percent derate it reads 0.5223558577 and raises nothing. The motor did not change and the pump did not change.

## Below half load the linear scaling stops being trusted

At a fifth of plate the fraction is 0.2000 and the current comes back as 9.8000 A with the estimate flagged weak. The reason is physical: below about half load the real current flattens toward the magnetising current, while a straight scaling of the plate keeps falling toward zero.

Golden electrical case 1 sits at exactly 0.5000000000 and is not flagged. The band is below half load, not at it.

## What it refuses

It refuses to produce a fraction without a plate behind it. Motor current with a nameplate power of zero is NaN, and with a nameplate current of zero is NaN.

It refuses to correct the low load estimate. The 9.8000 A figure is still returned, still linear, still wrong in the direction the flag describes. The flag is the whole response.

## The mistake

Treating the flag as an error and the absence of a flag as an endorsement. Golden electrical case 1 at 0.5000000000 carries no flag while sitting on the boundary, and the teaching well IBENO-2 loses its underloaded warning by moving from 0.4962380648 to 0.5223558577 for a reason that has nothing to do with the well. A threshold says which side of a line a number fell on, and nothing about how far.

## Exercise

Read the load fraction and the current for both golden electrical cases and confirm each against its nameplate current.

Then read the teaching well IBENO-2 at 0 and 5 percent derate, and write down which warning appears, which disappears, and what actually changed.
