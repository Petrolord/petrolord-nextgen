# The panels and their refusals

Every practical in this course runs in the course's own explorer panels, which call the same vendored engines the lessons quote. A Suite user will find the same steps in QI Studio, in the Suite's Geoscience module, with Rock Physics Studio beside it for the elastic logs, fluids and substitution. No exercise needs a Suite seat. The Associate tier works in the feasibility explorer, on a well of the Ekene pack or on a case a learner pastes.

## Seven views, one engine set

The feasibility explorer has a View selector with seven views: Data inventory, Seismic QC, Shear and the local trend, The elastic set, Fluids and substitution, Wet trend and distance, and Modelled AVO. The Data selector picks an Ekene pack well or "Paste a case file". Every input a figure depends on has a control marked "(stated)", and every measured figure prints to six decimals.

## When an engine refuses

An engine that cannot answer throws, and the panel prints its message unchanged. Each row below was produced by calling the function with the input shown.

| function | input |
| --- | --- |
| amplitudeSpectrum | a trace of 5 samples |
| snrFromCoherency | one trace |
| fitVsRegression | three measured pairs, linear |
| predictVs | an interval level of 1.2 |
| brine | a pressure of 0 MPa |
| fitFluidLine | two interfaces |

In the same order, the engines' own words:

> A spectrum needs at least 8 samples.

> Signal-to-noise needs at least two neighbouring traces.

> Need at least 5 samples with measured Vp and Vs (got 3).

> The interval level must be between 0 and 1.

> Temperature (degC) and positive pressure (MPa) required.

> A fluid line needs at least three interfaces.

The Associate engines make 21 refusals across 14 functions in all; the later modules meet the rest where they arise. Two more messages in gassmann.js refuse an implied saturated modulus that is not positive and an inverse Gassmann dry modulus that is not positive. The course names those two by what they refuse and does not print them.

## A result is no refusal

The elastic set with Vs above Vp does not throw: elasticPoint returns every field as NaN, AI (acoustic impedance) NaN and Vp/Vs NaN, and the panel shows the gap. A NaN field is a result, and a reader notices the gap before reasoning with the row.

## What is graded

The tier ends on a capstone of six numeric fields. Each is a return value of an engine on a held-out synthetic case, a case file the learner pastes into the feasibility explorer; the case is never the Ekene field. No video figure, Ekene figure, verdict, class name or usability grade is graded, nor any figure that depends on a choice the case does not state.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set Data to "Ekene pack: Ekene-1" and View to Seismic QC. Set both "Window start, ms (stated)" and "Window end, ms (stated)" to 800 and read the refusal; restore the window to 800 to 1600. Set View to Shear and the local trend and type 1.2 into "Prediction interval level (stated)"; read the refusal and restore a level between 0 and 1. Set View to Fluids and substitution and type 0 into "Pressure, psia (stated)"; read the refusal, restore 3200, then type a salinity of 0.6 into "Brine salinity, weight fraction (stated)". For each refusal, write which control it points to.
