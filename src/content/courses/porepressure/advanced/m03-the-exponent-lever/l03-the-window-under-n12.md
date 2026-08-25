# The window under n 1.2

Two calibrations, two windows. This lesson puts them side by side as a planner would, runs the mud-program ledger under both, and extracts the decision rule for when the difference matters. It is the shortest bridge in the course between a model parameter and a rig decision.

{{panel:pp-window-explorer}}

## The two windows at TD

At n 3: floor 1179.1048116553065, ceiling 1903.9238599165737, window 724.8190482612672 kg/m3. At n 1.2: floor 1091.881030400315, ceiling 1874.84926616491, window 782.968235764595.

Both walls moved DOWN under the low calibration, the floor by 87.22 and the ceiling by 29.07, a third of it through the mixture; the window WIDENED by the other two thirds, 58.15 kg/m3. That two-thirds relation is the coefficient form's usual bookkeeping: the window is $K(S - PP)$, so its change is $-K$ times the floor's change, and a floor DROP of 87.22378125499152 kg/m3 widens the window by $\tfrac{2}{3} \times 87.22378125499152 = 58.14918750332768$, matching the tiles' difference of 58.1491875033278 to ten decimals. The algebra and the panel agree, as they must.

## The ledger, twice

Module 2's mud program, run under each calibration with the same margins, 50 kg/m3 kick-and-trip above the floor, 100 total dynamic allowance under the shoe ceiling of 1780.090931942938.

Under n 3: practical interval 1229.10 to 1680.09, width 451 kg/m3. A 1250 kg/m3 mud carries 70.9 above the static floor.

Under n 1.2: practical interval 1141.88 to 1680.09, width 538. The same 1250 mud carries 158.1 above the static floor.

The recommendation, 1250, survives both. What changed is the MEANING of the margin: under n 3 the mud is comfortably but not extravagantly overbalanced; under n 1.2 it is carrying 158 kg/m3 of overbalance, which a driller might trim toward 1200 to gain penetration rate and reduce differential-sticking exposure. The calibration argument, on this well, is an argument about optimisation, not feasibility.

## When it becomes feasibility

Squeeze the well mentally, as module 2 did: suppose margins and dynamic effects consumed 300 kg/m3 and the shoe ceiling sat at 1350 rather than 1780. Then under n 3 the practical interval is 1229.10 to 1250: ten-ish kg/m3 of room, marginal. Under n 1.2 it is 1141.88 to 1250: comfortable. Now the calibrations disagree about whether the section is drillable as designed, and the disagreement cannot be split by averaging, because mud is pumped at one density. Somebody must decide, and the next lesson is about deciding honestly.

The threshold is statable: the exponent matters operationally when its floor throw, 87.22 kg/m3 at TD here, is comparable to the slack between the practical interval's width and zero. Wide slack: optimise within the band. Thin slack: the exponent IS the well design question.

## The floor throw is depth-dependent

One planning subtlety from lesson 2's table, restated because ledgers hide it: the 87.22 is a TD number. At 3000 m the throw is 39.01, at the shoe zero. A section whose deepest exposure is 3200 m carries a much smaller calibration risk than the TD ledger suggests. Matching the throw profile to the section boundaries, rather than quoting one number, is the difference between pricing the uncertainty and merely gesturing at it.

## Worked example

Price a measurement against the throw. A wireline pressure point at 3800 m would read the true pore pressure there. Under n 3 the predicted floor at 3800 m is, running the machinery, hydrostatic $9.80665 \times (1025 \times 100 + 1030 \times 3800)$ Pa $= 39.388409725$ MPa plus ramp overpressure $5.2$ MPa, total $44.588409725$ MPa, EMW over 3900 m: $44588409.725 / (9.80665 \times 3900) = 1165.8339566021853$ kg/m3. Under n 1.2 the same machinery predicts less; the measured point would land near one prediction and away from the other, and 87-ish kg/m3 of mud-floor ambiguity at TD collapses to whichever calibration the data endorses. Against the cost of a wireline run, that is normally a purchase, and this arithmetic is how it is justified in a program review.

## Exercise

The measured point at 3800 m comes back at 42.0 MPa. Which calibration does it endorse, and what does the answer do to the TD floor?

Self check: the n 3 prediction at 3800 m is 44.588409725 MPa; the n 1.2 prediction, from the engine, is 41.5421230499105 MPa. The measurement of 42.0 sits 0.46 MPa over the n 1.2 curve and 2.59 MPa under the n 3 curve, endorsing the low calibration on this hypothetical data. The TD floor drops toward 1091.88 kg/m3, the mud program gains 87 kg/m3 of room, and, crucially, the endorsement is local evidence, one point, one depth; standard practice is to refit n to the measurement rather than snap to a preset, which is exactly what calibration means and what the next lesson formalises.
