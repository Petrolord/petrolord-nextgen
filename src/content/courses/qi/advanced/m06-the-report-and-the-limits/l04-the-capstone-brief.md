# The capstone brief

The Expert capstone runs the chain of this tier, from the low-frequency model through inversion and properties to the trap, on a held-out synthetic case. The Ekene field is never used: the members-only videos speak the Ekene answers aloud, so a graded figure on Ekene could be answered by watching. The case arrives as a case file, and the learner pastes it into the inversion explorer and the prospect explorer, which run the engines this tier has used.

## What the case file holds

The case states every input the six figures depend on: its wells and their horizons, the trace positions and the stated samples, the supplied low-frequency model, the wavelet, the weight and the iteration count, the angle wavelets, the calibration samples for the porosity transform and the facies, the stated AI (acoustic impedance, Vp x density) values, and a depth grid in feet. Nothing the grade depends on is left to the learner's choice. If a step seems to need a choice the case does not state, read the case file again: the input is there.

## The six figures

| figure | panel | where this tier taught it |
| --- | --- | --- |
| the LFM ln(AI) at a stated sample of a second trace position, built from the case's wells by inverse distance and their horizons | inversion explorer | the low-frequency model from wells and horizons |
| the model-based AI at a stated sample of the target trace, with the case's supplied low-frequency model, wavelet, weight and iteration count | inversion explorer | model-based least squares |
| the Vp/Vs from the simultaneous inversion at that sample, with the case's angle wavelets | inversion explorer | Fatti's three parameters, angle-dependent wavelets |
| the high end of the 80 percent porosity interval at a stated AI | prospect explorer | a linear transform and its interval |
| the posterior probability of the oil-sand facies at a stated AI | prospect explorer | Bayesian facies on impedance |
| the column from crest to spill on the case's depth grid, in feet | prospect explorer | crest, spill and closure |

Every figure is a return value of an engine on the case, read from the panel. The first comes from the low-frequency model between wells, an engine the course marks as awaiting its independent oracle and grades only once that check lands. The second and third read the case's own low-frequency model and wavelets as inputs. The fifth depends on the case's labels and priors. The sixth reads the case's grid as it stands, and the engine's edge flag tells you whether that column is the map's limit.

## What is graded and what is not

The six figures are graded. Nothing else is: no figure from a video, no Ekene figure, no recommendation, no seismic support word, no class name, and no figure that depends on a choice the case does not state.

## How to work it

State every choice the case states, in your own notes, before reading a figure: the wells, the horizons, the inverse distance power, the positions and samples, the window, the wavelet, the weight, the iterations, the angles, the cut-off, the priors, the interval level and the grid. Then run the chain in order. Check the units: AI in kg/(m2 s), times in milliseconds two-way, depths in feet. A refusal is the engine's own message and means an input is outside what the function accepts; re-read the case file for that input.

{{panel:qi-prospect-explorer}}

## Exercise

Rehearse the capstone on the Ekene pack. In the inversion explorer, write down a trace position, a sample, the window, the wavelet, the weight and the iteration count, then read the low-frequency model, the model-based AI and the simultaneous Vp/Vs there. In the prospect explorer, choose an AI, read the high end of the 80 percent porosity interval and the oil-sand posterior, then read the column from crest to spill on the Ekene Sand top grid. Beside each figure, note every input it read.
