# Quality control

The workflow ran once, cleanly. This lesson is the inspection pass: every check this course has accumulated, gathered into one page, each with the number it produces on this well and the failure it exists to catch. The habit being installed is that QC is a list you run, not a feeling you have.

{{panel:pp-eaton-explorer}}

## The frame checks, inherited

From the Associate tier, unchanged, run before anything downstream: hydrostatic and overburden meet at the mudline, 1.005182 MPa here; overburden above hydrostatic everywhere below; both monotonic; equivalent mud weights at TD bracketing everything, 1029.878049 to 2266.333384 kg/m3. Failure caught: unit slips and integration errors, the class of mistake that survives arithmetic because every subsequent step is arithmetic on it.

## The ordering checks

At every depth, four pressures in fixed order: hydrostatic, then pore pressure at or above it, then fracture pressure, then overburden. On this well at TD: 41.409, 47.409, 76.552, 91.123 MPa. Failure caught: inverted Eaton ratios, negative handovers, K outside its interval. Ten seconds, catches catastrophes.

## The quiet-section check

The prognosis must return approximately hydrostatic wherever the well is known normal. Here: exactly hydrostatic above 2500 m, to floating-point residue. The fitted trend fails this check at 120 m, which is the single most valuable QC result in the course. Failure caught: trend bias, the largest error source the method has.

## The slope check

Pressure-curve slopes, read in kPa per metre, must be physically tellable: 10.1 for the pore fluid's hydrostatic, 14.1 below this well's onset, hydrostatic plus a mechanism rate. A pore pressure slope exceeding the local overburden gradient, about 24.6 kPa per metre at TD here where the bottom density is 2505 kg/m3, would mean pressure accumulating faster than load, sustainable only across a seal, never along a ramp. Failure caught: artefacts at trend joins and log splices that look like pressure but have impossible gradients.

## The consistency identities

Three internal identities, costless to verify. Pore pressure minus hydrostatic equals the quoted overpressure, 47.408579625 minus 41.408579625 is 6 exactly. Fracture pressure sits at the K-mixture of overburden and pore pressure, two thirds and one third here. And the window splits as K to 1 minus K, 29.143 to 14.571 MPa at TD, a two-to-one ratio. Failure caught: transcription errors between tables and text, the dullest and most common failure in reports.

## The loop check, at whatever strength the well affords

Here, the encoded ramp: worst disagreement $2.24 \times 10^{-8}$ Pa across all 401 samples. On a real well, agreement with measured pressures within their tolerance, and consistency of onset with drilling events, gas trends, and the mechanism argument. Failure caught: everything at once, which is why it is last and strongest, and why the number it produces belongs in the report rather than in a drawer.

## The sensitivity declarations

Not checks that pass or fail, but numbers a defensible prognosis states. The trend spread: 47.41 to 53.84 MPa at TD under this well's two candidate trends. The exponent's leverage: 2.09 to 9.59 MPa of TD overpressure across n from 1 to 5. K's leverage on the ceiling: 2.19 MPa per five points at TD. Stating them is what converts a single curve into an honest object; a prognosis quoted without sensitivities claims a precision its inputs do not have.

## What QC cannot do

Two honest limits, so this page is not oversold. QC catches inconsistency, not shared error: if the density log is biased, the overburden, the budget, the pressures and the fracture curve are all biased together, every internal check passes, and only external measurement catches it. And QC on this well benefits from a truth the field never supplies; the checks are the same out there, but the quiet-section and loop checks weaken to the strength of whatever ground truth exists. The discipline is to know, at each check, what would have caught the error this check cannot.

## Worked example

Run the full list against the fitted-trend prognosis and score it. Frame checks: pass, the frame is shared. Ordering: pass, all four pressures ordered at every depth. Quiet section: FAIL, 1.589 MPa of overpressure at 1000 m in known-normal section. Slope: marginal, the pore pressure slope is elevated from 120 m with no mechanism. Identities: pass, the wrong numbers are internally consistent. Loop: FAIL, 6.497 MPa worst gap to the ramp. Score: two hard failures, both pointing at the trend, neither visible in the curve's smoothness or the report's precision. That is QC doing exactly its job: locating the error class, not just declaring wrongness.

## Exercise

A prognosis passes every check on this page except the loop check, which shows a uniform 1.5 MPa over-recovery of overpressure at every depth below the onset, growing with neither depth nor budget. Which single input does that signature point at, and why?

Self check: a constant offset in recovered overpressure, flat in depth, cannot be the trend, whose error grows and shrinks with the exponential gap, and cannot be the exponent, whose error scales with the anomaly. It points at the hydrostatic reference, and specifically at its datum: a wrong water depth or datum shifts the hydrostatic by a constant column of pressure at every depth, moving every sample's overpressure together by the same amount, whereas a wrong fluid density would produce an offset that grows with depth. The frame checks should have caught it first, which is why they run first; a loop residual with structure is a map of where to look.
