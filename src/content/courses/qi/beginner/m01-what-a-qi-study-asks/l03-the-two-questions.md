# The two questions

A feasibility study asks whether this seismic, on this data, can see this fluid. That splits into two questions with numbers under each. Is the data good enough: is the band wide enough at the target, is the signal clean enough, and did the acquisition leave a footprint? Can the seismic see the fluid: how far does the fluid move AI (acoustic impedance, Vp x density) and Vp/Vs, does the top of the reservoir sit off the wet trend, and what reflection should the seismic show? The engines answer each part with a figure. A person writes the verdict.

## The Ekene answer, in outline

The table below is where this tier ends on the Ekene pack. Each row is worked in its own module.

| question | the Ekene figure |
| --- | --- |
| is the band wide enough at the target | -6 dB 14.425434 to 34.787627 Hz, peak 31.374887 Hz (800 to 1600 ms) |
| is the signal clean enough | median 361.155122 (25.576938 dB) |
| is there a footprint | share 0.015148 along the crosslines, no stripe by the rule |
| how far does the fluid move AI | 7.456776 percent, oil to brine |
| how far does it move Vp/Vs | 7.142745 percent |
| does the top sit off the wet trend | -0.072091 in situ against -0.004519 with brine |
| what the seismic should show | normal-incidence R 0.171249 in situ against 0.206058 with brine |

## The data question

The first three rows judge the seismic as a measurement. The -6 dB band says which frequencies carry useful energy at the target. Signal to noise, a power ratio read from how alike neighbouring traces are, says how much of each trace is repeatable. A footprint is a periodic stripe on a slice of RMS amplitude, called one only by a stated rule; if it is there, amplitude maps carry the acquisition pattern as well as the geology. Module three measures all three.

## The fluid question

The last four rows judge the rock. Oil in the Ekene Sand makes it softer than the same rock full of brine; substitution, which swaps one pore fluid for another through the dry rock, measures by how much. The wet trend is the fluid line fitted to the brine-substituted interfaces on a crossplot of intercept against gradient, and the distance of a point from it is signed, negative on the hydrocarbon side. A top that sits further on the hydrocarbon side in situ than with brine says the fluid moves the reflection. Modules four to six work this side.

## What the verdict carries

A number without its choices cannot be checked. Every row above moved with something the study stated: the net sand cut-off and the legs, the fluids and conditions, the taper and the time windows, the block length and the line the distance is read from. The verdict states each of them beside its figure, so a reader can repeat the work and see which choice would change the answer.

The engines never decide whether the study goes ahead. They return spectra, trends, moduli and reflection coefficients; the go or no-go is a judgement written from them.

## What this tier leaves for later

Feasibility is answered from the logs and the stack's own statistics. The Professional tier takes the question to the seismic itself, and the Expert tier to inversion and the decision.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set Data to "Ekene pack: Ekene-1" and View to Seismic QC. Find the tiles that answer the first three rows of the table: the -6 dB edges, the median signal to noise and the footprint table. Then set View to Wet trend and distance and find the table row for the top interface and its distance from the fitted line. For each, write down the controls marked "(stated)" on that view that the figure depends on. Those lists are the first draft of your verdict's statement of choices.
