# Writing the verdict

The engines return spectra, trends, moduli and reflection coefficients; they do not decide whether a QI study should go ahead. The verdict is written by the interpreter: a short statement that answers the two questions, is the data good enough and can the seismic see the fluid, with the numbers that support each answer and the choices each number depends on.

## The Ekene figures, question by question

| question | the Ekene figure |
| --- | --- |
| is the band wide enough at the target | -6 dB 14.425434 to 34.787627 Hz, peak 31.374887 Hz (800 to 1600 ms) |
| is the signal clean enough | median signal to noise 361.155122 (25.576938 dB) |
| is there a footprint | share 0.015148 along the crosslines, no stripe by the rule |
| how far does the fluid move AI | 7.456776 percent, oil to brine |
| how far does it move Vp/Vs | 7.142745 percent |
| does the top sit off the wet trend | -0.072091 in situ against -0.004519 with brine |
| what the seismic should show | top Ekene class I in situ and with brine; normal-incidence R 0.171249 against 0.206058 |

The first three rows answer the first question; the last four answer the second. AI is acoustic impedance throughout.

## The data question

The band is read over the window holding the Ekene Sand, on the mean spectrum of the 120 spread traces. The signal to noise is a power ratio from neighbouring traces along the inline through Ekene-1. The RMS slice shows no footprint by the stated rule. Each figure is a measurement on stated traces, and the verdict says what it measured them on.

## The fluid question

Taking the oil leg to brine moves its mean AI by 7.456776 percent and its mean Vp/Vs by 7.142745 percent. At the top of the sand, the in situ interface sits at -0.072091 from the well's own wet trend while the same rock with brine sits at -0.004519, so the oil moves the top off the background towards the hydrocarbon side. The modelled reflection is dimmer with oil at every angle. The class is I either way, so the verdict rests on the figures beneath the label.

## What a verdict states beside its numbers

Every figure above moves when a choice moves, so the verdict lists them:

- the selections: the net sand cut-off, the oil and water legs, the cap rock thickness;
- the fluids and the conditions that set them;
- the taper and the windows of the spectrum and the signal to noise;
- the block length of the wet trend;
- the line the distance is read from.

A verdict without them cannot be checked or repeated.

## A verdict, written

A feasibility verdict for Ekene-1 could read: the band and the signal to noise at the target are measured on stated traces with a stated taper and window, and no footprint is found by the stated rule; the oil moves AI and Vp/Vs by the figures above, and it moves the top of the Ekene Sand off the fitted wet trend at a block length of 16 ft, while the same rock with brine sits on it; the modelled top dims with oil at every angle, and both cases are class I, so the class does not separate them. Every one of those clauses carries a number and a choice.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set Data to "Ekene pack: Ekene-3" and collect one figure for each row of the table: the -6 dB edges and the signal to noise from "Seismic QC", the two means from "Fluids and substitution", the two distances from "Wet trend and distance" and the coefficients from "Modelled AVO". Write a verdict of four sentences in the shape above, listing every choice you left at the course's Ekene settings.
