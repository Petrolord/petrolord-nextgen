# The fitted-trend prognosis

Time to run the experiment this module exists for. Same log, same density column, same exponent, same threshold; only the trend changes, from the well's own to the fitted one. Every number below is the engine's.

{{panel:pp-eaton-explorer}}

## The damage, item by item

Switch the panel's trend control to the fitted setting and read the tiles against the capstone values.

Pore pressure at TD: 53.83775710501359 MPa, against the true 47.408579625. Overpressure at TD: 12.429177480013587 MPa, against the true 6. The trend choice more than doubled the overpressure; the error, 6.43 MPa, is larger than the entire true anomaly. If a rig crew planned kill mud for this number they would be carrying more than twice the needed overbalance at TD.

Pore pressure at 3000 m: 39.558174653726525 MPa, against the true 33.307730125. The overpressure there reads 8.25 MPa against a true 2.0: at mid-ramp the error factor is worse than four, exactly as last lesson's proportional argument predicted, because the proportional trend error peaks shallower than TD.

Fracture pressure at TD: 78.69463033549309 MPa, against 76.55157117548856. Even the ceiling moved, by a third of the pore pressure error, through the coefficient form.

And the onset: 120 m. Not 2520. The prognosis claims the well leaves hydrostatic twelve samples below the seabed and never comes back. The first five flagged samples are 120, 130, 140, 150, 160 m.

## The onset is the tell

Dwell on that 120 m, because it is the diagnostic gift of the whole disaster. The fitted trend sits below the header trend from the mudline down, so the log reads slow against it EVERYWHERE, not just in the ramp. Near the surface the budget is tiny, so the phantom pressure per sample is small, but by 120 m the budget has grown enough for the phantom to clear the 0.05 MPa threshold, and the flag fires.

An onset at 120 m below the mudline fails every sanity check a frame provides. There is no mechanism there, no seal, no burial rate to argue about; sediments a hundred metres down, in a normally pressured basin, with overpressure that then grows monotonically for four kilometres, is not geology, it is a low trend. The Associate tier's habit, check the frame before believing anything built on it, catches in one glance what no amount of downstream care would.

That is the general shape of trend-error detection: the errors concentrate where the true signal should be absent. Deep in the ramp, phantom and real pressure blend; in the shallow section, everything the prognosis shows is phantom, pure and legible.

## The loop, formally opened

The QC tile completes the story: the worst gap to the encoded ramp reads 6.497 MPa, at 3640 m, where on the correct trend the tile read a hundred-millionth of a pascal. The worst sample is not at TD: the phantom pressure peaks where the proportional trend error and the budget trade off, in the same way the raw trend gap peaked at 1400 m. And just above the ramp top, where the true overpressure is zero, the fitted-trend run reports 5.697 MPa: nearly the whole true TD anomaly, invented at a depth with nothing to invent. Since the two runs differ only in the trend, every one of those megapascals is attributable, no ambiguity. On a synthetic well the attribution is a printout. On a real well it is an argument, which is why the next lesson is about why the lever is this long and the last about how to defend a trend in the absence of an answer key.

## The numbers to carry

Not all sixteen digits, but the shape: a trend error of six percent produced a pressure error of a hundred percent at TD and over three hundred percent at mid-ramp, plus a spurious onset 2400 m too shallow. One line summarises the module so far: in Eaton's method, the trend is not an input among inputs, it is the definition of zero, and errors in the zero point are amplified, systematic and smooth.

## Worked example

Reproduce the fitted-trend pore pressure at 3000 m by hand, the same five steps as module 2. Frame: budget 35.523412418439044 MPa, hydrostatic 31.307730125. Trend: fitted, 272.65626414878216 us/m from last lesson. Log: 297.76677602422825. Ratio: $272.65626414878216 / 297.76677602422825 = 0.9156705384975423$. Cubed: 0.7677462842943549. Fraction: 0.2322537157056451. Overpressure: $35.523412418439044 \times 0.2322537157056451 = 8.250444528726526$ MPa. Pore pressure: $31.307730125 + 8.250444528726526 = 39.558174653726525$ MPa, matching the engine to the last digit.

The chain is identical to module 2's; only the trend value changed. Precision is not protection: every digit of this wrong answer is correct arithmetic.

## Exercise

Using the worked example's fraction, state what percentage of the stress budget at 3000 m the fitted-trend prognosis hands to the fluid, compare it with the true handover from module 2, and give the ratio of the two.

Self check: the fitted-trend run hands over 23.23 percent of the budget; the true handover at 3000 m is 5.63 percent. The ratio is 4.125: at this depth the trend error has quadrupled the fluid's claimed share. The error factor falls with depth as the proportional trend gap narrows, which is why TD shows a factor of 2.07 rather than 4; a single error factor quoted for a whole well is always wrong somewhere.
