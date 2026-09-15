# Working the capstone

A graded question hands you a stream and asks for a number about a vessel. The method is to run the chain in order, write the units beside every figure, and let the engine's refusals be answers rather than obstacles.

{{panel:fc-separator-explorer}}

## Step one: settle the conditions before anything else

Write down the gauge pressure, the absolute pressure, the temperature in degF and in degR, and the gas gravity. Every number after this point is conditional on those four, and the two pressures are both live: the absolute one feeds the reduced pressure and the gas law, and the gauge one feeds the K lookup.

On ABANA-1 that is 600.000000 psig, 614.700000 psia, 95.000000 degF, 554.670000 degR and 0.680000. Half the wrong answers in this subject are right answers computed at the wrong pressure.

## Step two: get the gas properties, and check the range

The gravity gives the pseudo-criticals, those give Ppr and Tpr, and those give z. Check the pair against the range before trusting the answer: Tpr from 1.0 to 3.0 and Ppr up to 30, with a note rather than a refusal below Ppr 0.2.

If the question puts a stream outside that range, the answer is the refusal and its reason. A z factor at Tpr 3.176 or at Ppr 37.306 does not exist, and inventing one is worse than reporting that it does not.

## Step three: two rates and two densities

| quantity | unit | on ABANA-1 |
| --- | --- | --- |
| gas at standard conditions | MMscfd | 18.000000 |
| gas at vessel conditions | ft3/s | 4.825708 |
| liquid mixture | lb/ft3 | 55.171463 |
| gas | lb/ft3 | 2.239712 |

The vessel is sized on the second row and never on the first. The mixture is weighted by the two liquid rates, so it is never the average of the two densities and never one of them on its own.

## Step four: K, with its label

Read the base K from the six rows by the id that names both the orientation and the internals. Then apply the pressure rule and record what it did: derated, floored, or neither. A floored K is a bound rather than a result, and a question that lands on one is asking about the limit of the method.

Where a vendor figure is given, it wins outright and reports its source as typed, with no derating and no floor.

## Step five: size, then judge

Divide the actual gas rate by the settling velocity for the area, take the diameter from the area, and round it up to an offered size. Then build the liquid depth from the retention volume and add the allowance.

Finish with the two verdicts. A margin below 1 means the vessel does not carry its gas whatever its other numbers look like, and a slenderness is a shape to be reasonable about.

## Step six: check the chain backwards

Three checks catch most errors. An absolute pressure that does not sit 14.7 above its gauge pressure has skipped a step. A margin of exactly 1.000000 means the diameter came from the gas rather than from a list. And a mixture density outside the range between the oil and the water is arithmetically impossible.

## Exercise

Run the six steps on ABANA-1 and state the diameter the gas demands, with its unit. Then name the three backward checks and say what each one would catch, and say what to write when a question puts a stream outside the correlation's range.
