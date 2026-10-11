# The capstone brief

The Associate capstone runs the feasibility steps of this tier on a case of its own. It is a held-out synthetic case: a patch of traces and one well with its own layers, its own fluids and its own conditions, supplied as a case file. The case is never the Ekene field. Every graded figure is a return value of an engine, read from the feasibility explorer.

## How the case reaches the panel

In the feasibility explorer, set Data to "Paste a case file" and paste the case file into the box that appears. The panel then runs the same engines this tier has used on the Ekene pack, on the case's traces and the case's well. Its stated controls take the values the case states: the net sand cut-off, the cap rock thickness, the conditions, the taper, the shear fit form and level, the block length and the sample depth. Check each control against the case file before reading a figure: a control left at a figure the case does not state answers a different question.

## The six graded figures

| figure | view | what it rests on |
| --- | --- | --- |
| the -6 dB low edge of the case traces' mean spectrum | Seismic QC | the window and the taper |
| the centroid of the same mean spectrum | Seismic QC | the window and the taper |
| the slope of the local shear trend on the case's water-leg net sand | Shear and the local trend | the net sand cut-off, the contact and the form of the fit |
| the AI of the stated sample after substitution to brine | Fluids and substitution | the sample depth and the conditions |
| the Vp/Vs of the same sample after substitution to brine | Fluids and substitution | the sample depth and the conditions |
| the distance of the case's top interface from its own fitted wet trend | Wet trend and distance | the block length, the cut-off, the cap rock thickness and the conditions |

AI is acoustic impedance, Vp times density. Each figure is the one the panel prints in its tile or table at the precision shown.

## What each figure asks of you

The spectrum figures are read off the mean spectrum of all the case traces; the low edge is the lower of the two -6 dB edges and the centroid is the power-weighted mean frequency. The shear slope is c1 of the fit on the case's water-leg net sand, in m/s per km/s, in the form the case states. The two substituted figures belong to one stated sample; read the tiles labelled after substitution to brine. The distance is measured from the case's own fitted wet trend, the fitted line, and its sign matters: negative is the hydrocarbon side.

## Every choice is stated

Every input those six figures depend on is stated in the case file; a figure that depends on a choice the case does not state is never graded. Before you read a tile, confirm the panel shows every choice the case states. The tolerance of each graded field is set by the course in one place, so copy each figure as the panel prints it.

## What is never graded

No figure from a video, no Ekene figure, no verdict, no class name and no usability grade is graded. The Ekene figures in this tier are the method worked once; the case moves every one of them, and the method stays the same.

{{panel:qi-feasibility-explorer}}

## Exercise

Rehearse on the Ekene pack before the capstone. In the feasibility explorer, set Data to "Ekene pack: Ekene-1" and read all six figures in the order of the table above, writing beside each one the controls it depended on and the value each control held. Then change one control in each view, read the figure again, and note which of the six moved. Restore every control before you finish.
