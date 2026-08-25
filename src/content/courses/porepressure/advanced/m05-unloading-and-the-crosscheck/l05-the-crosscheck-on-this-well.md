# The cross-check on this well

Every piece is on the table: an Eaton prognosis three tiers deep, a Bowers system two curves wide, and one well they can both be pointed at. This lesson runs the comparison, reads the result at two depths, and closes the argument the whole course has been building.

{{panel:pp-window-explorer}}

## The comparison at TD

Eaton's route: trend, ratio, cube, budget. Pore pressure at TD 47.408579625 MPa, effective stress $91.12306695073282 - 47.408579625 = 43.714487325732826$.

Bowers' route: velocity, loading inversion. The TD sample's 3691.0906301457703 m/s inverts to 43.752391704220855 MPa of effective stress, so pore pressure $91.12306695073282 - 43.752391704220855 = 47.37067524651197$ MPa.

The gap: $47.408579625 - 47.37067524651197 = 0.03790437848802725$ MPa. Thirty-eight thousandths of a megapascal, on a 47 MPa quantity, between two methods that share no trend, no exponent, and no calibration constants beyond the frame. In mud units at TD: under one kilogram per cubic metre, 0.94, against capstone tolerances of 0.5 and mud-program margins of tens.

The panel's final tile carries this number permanently, and the Note under the tiles states its meaning: the well's overpressure sits on the loading curve, undercompaction, exactly the mechanism Eaton assumes, confirmed by machinery that does not assume it.

## Why the agreement is not exact

An honest cross-check explains its own residual. The golden Bowers coefficients were fitted to this well's synthetic velocity-stress relationship, but the well was BUILT through Eaton, not through Bowers: the loading curve is a fitted description of the encoding, not the encoding itself. The 1.408 m/s by which the TD velocity sits off the fitted curve, module 4's forward residual, converts through the inversion's 0.0269 MPa per m/s gain into almost exactly the 0.038 MPa observed. The residual is the fit quality of A and B, nothing deeper, and tracing a cross-check's residual to its source like this is part of running one properly.

## The comparison mid-ramp, and what drift means

Module 4's worked inversion found a bigger gap at 3000 m: Bowers reads 35.03240464731723 MPa of effective stress against Eaton's 33.52341241843904, so pore pressures of 31.79873789612181 against 33.307730125, a gap of 1.509 MPa, forty times the TD residual, with Bowers reading LESS pressure.

Same well, same methods; why does the agreement degrade shallower? Because a two-parameter power law cannot hug the encoded relationship equally well at every stress: A and B were pinned where the fixture pinned them, and the curve strays in between. The drift profile, near-zero at the anchor points, growing between them, is the classic signature of comparing one model to another model rather than to truth. On a real well the same pattern appears where the Bowers calibration was fitted at scattered pressure points: trust the cross-check most at calibration anchors, and read mid-span disagreement as fit geometry before reading it as geology.

That reading discipline is the final skill of the module: a cross-check is not a verdict machine. Agreement within the residual budget confirms; disagreement is a QUESTION, whose first three candidate answers are always fit quality, screening, and mechanism, in that order of likelihood.

## The course's argument, closed

Assemble what has now been shown about this one well, tier by tier. The frame is arithmetic: hydrostatic 41.409, overburden 91.123 MPa at TD. The prognosis on the defended trend recovers the encoded ramp exactly: 6 MPa of overpressure, onset detected at 2520 m. The window in the driller's units: floor 1179.10, ceiling 1903.92, room 724.82 kg/m3. The calibration alternative is computed, priced at 87 kg/m3, and rejected on this well by the closed loop. And an independent method agrees to 0.038 MPa at the deepest point, certifying the mechanism. That is what a finished pressure argument looks like: every number derived, every choice defended, every uncertainty priced, and a second method in agreement. The capstone asks for six of these numbers; the standard it is really examining is the argument.

## Worked example

Convert the cross-check into the sentence a well plan would carry, with the numbers in place. Draft: "Pore pressure at TD is 47.41 MPa (Eaton n 3, well-header NCT, ramp-recovery QC passed); an independent Bowers loading inversion of the same sonic gives 47.37 MPa, agreement 0.04 MPa, supporting undercompaction as the mechanism; no velocity reversal or sonic-density divergence is observed, so no unloading correction is applied; floor at TD 1179 kg/m3 EMW, sea-level datum." Four clauses: value with provenance, cross-check with size, mechanism with evidence, mud units with datum. Every clause is auditable back to a lesson in this course, which is the definition of a defensible sentence.

## Exercise

Suppose the TD comparison had instead come out 3 MPa apart, Bowers below Eaton, with everything else as observed. Using the reading discipline, list the first three checks you would run, in order, each with the lesson that armed it.

Self check: first, fit quality at the anchors: evaluate the loading curve at every depth where pressure is known and inspect the residual profile, module 4's forward QC, since a 3 MPa mid-fit stray is the most common cause. Second, screening: confirm the TD sample is trend-shale in good hole for BOTH methods' inputs, the shared discipline from the Professional tier's blind spots, since one bad interval can move one method more than the other. Third, mechanism: check for velocity reversal and sonic-density divergence, this module's lesson 3, because Bowers-below-Eaton with a clean fit is the signature of the loading curve mis-reading rock that has begun to unload. Only after those three would the disagreement be allowed to mean the prognosis itself is wrong, and by then the checks have usually named the repair.
