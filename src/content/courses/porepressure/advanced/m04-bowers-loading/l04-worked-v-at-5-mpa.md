# Worked: velocity at 5 MPa

One graded field, walked end to end at exam pace, with the checks that protect it and the readings that give the bare number its meaning. This is the shortest capstone field in the whole ladder, five operations, and the lesson uses the spare room to teach what the number is FOR.

## The computation

The capstone asks: the loading velocity at 5 MPa effective stress, coefficients A 10, B 0.75. Tolerance 0.5 m/s.

Step 1, stress to the published domain: $5 \times 10^6\ \mathrm{Pa} / 6894.757293168361 = 725.1886886510462$ psi.

Step 2, the power: $725.1886886510462^{0.75} = 139.74563970950388$.

Step 3, the coefficient: $\times\,10 = 1397.4563970950388$ ft/s.

Step 4, the mudline offset: $+\,5000 = 6397.4563970950385$ ft/s.

Step 5, back to SI: $\times\,0.3048 = 1949.944709834568$ m/s.

Report 1949.94 or 1949.9; both clear the 0.5 tolerance. The engine's bowersVLoading performs these five steps and nothing else.

## The two checks worth running

Scale check: the answer must land between the mudline 1524 and the sonic's observed range, roughly 3700 m/s at this well's TD. A value below 1524 means the offset was dropped; one in the millions means the psi conversion was; near 6397, the final conversion. Each error has a characteristic magnitude, which is why the scale check identifies the slip as well as detecting it.

Consistency check: in the normal section effective stress equals the budget, and the budget passes 5 MPa a little above 550 m on this well (it is 4.661301302131412 MPa at 500 m).  A loading velocity of 1950 m/s at half a kilometre of burial is a sensible shale velocity, sitting far above mudline ooze and far below cemented rock. The graded point is physically ordinary, which is what a calibration point should be.

## What this point is for

Why does the capstone grade the FORWARD direction, when prediction runs backward? Because the forward evaluation is how a Bowers calibration is used in anger: against every depth where pressure is known, evaluate the curve and compare with the log. The 5 MPa point is a stand-in for that workflow.

On this well the known-pressure depth is everywhere, so module 5 will run the comparison at TD and close the loop. On a real well the known depths are the few with measured pressures, and the forward residuals at those depths are the evidence that A and B fit the basin, exactly as measured pressures were the evidence for Eaton's n in module 3. The two methods have the same calibration epistemology; they differ in what they parameterise, a depth trend against a stress law, which is why their errors decorrelate and their agreement means something.

## The point on the curve

Place 1949.944709834568 among its neighbours from lesson 2's table: 1524 at zero stress, 1949.94 at 5 MPa, 2240.35 at 10. The first 5 MPa of grain load added 426 m/s; the second added 290. The curve is at its steepest exactly where shallow, low-stress rock lives, and that steepness cuts both ways: velocity is most informative about stress there, and velocity ERROR is most consequential there too, foreshadowing lesson 5's amplification arithmetic.

## Worked example

The same five steps at a second stress, 10 MPa, for practice and to see the curve flatten. Convert: $10^7 / 6894.757293168361 = 1450.3773773020923$ psi. Power: $1450.3773773020923^{0.75} = 235.02321495811793$. Coefficient: 2350.2321495811793 ft/s. Offset: 7350.2321495811793. Convert: $\times 0.3048 = 2240.3507591923435$ m/s, the engine's value to the last digit. Doubling the stress from 5 to 10 MPa raised the velocity by 290.4 m/s against the first 5 MPa's 425.9: the same flattening lesson 2's table showed, now produced by your own hand.

## Exercise

Invert your own result: from 1949.944709834568 m/s, run the five steps backward and confirm you recover 5 MPa, stating each intermediate.

Self check: to ft/s, $1949.944709834568 / 0.3048 = 6397.4563970950385$; less mudline, 1397.4563970950388; over A, 139.74563970950388; to the power $1/0.75 = 4/3$, $139.74563970950388^{4/3} = 725.1886886510462$ psi; to SI, $\times\,6894.757293168361 = 4999999.999999996$ Pa. Five megapascals to within a few billionths of a pascal of arithmetic residue: the loading curve inverts exactly, which is why the engine can offer both directions from one pair of coefficients, and why round-tripping your own arithmetic is the cheapest full-chain check available in this module.
