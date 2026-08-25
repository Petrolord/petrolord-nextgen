# The workflow end to end

The whole tier in one sequence, with the failure mode attached to each step.

## The seven steps

**One. Collect the property values.** One per well, each already an average over the reservoir interval with its own uncertainty. Record how they were derived, because a porosity from a density log with an assumed matrix density is a different animal from one from core.

**Two. Look at them before modelling them.** Their range, their spatial arrangement, and whether any pattern is visible without fitting. At Ekene six values from 0.17 to 0.23 with the low ones in the east.

**Three. Choose a population method and justify it.** Constant, trend or krige. The justification is about the data density and the geology, not about which is most sophisticated. Six wells do not support a fitted variogram.

**Four. Fit and inspect the residuals.** At every control point, model minus measured. Look at their size against the property's own uncertainty, and at their pattern for structure the model cannot express.

**Five. Run the chain.** The geometry is untouched, so only the pore volume and below can move.

**Six. Decompose the change.** Against the previous constant, and split into the better constant part and the spatial part. Two extra runs, one subtraction.

**Seven. Report the model, not just the number.** Method, residuals, the three means, the decomposition, and the resolution the map can actually support.

## The failure at each step

Step one fails when property values of different provenance are pooled without comment, so a core porosity and a log porosity carry equal weight in the same fit.

Step two fails by omission. Fitting first and looking afterwards means the model shapes what you see.

Step three fails when the method is chosen by availability. Kriging with a guessed variogram looks like the careful choice and is the one whose assumptions are hardest to state.

Step four is the step most often skipped entirely, and it is the one that would have told you the Ekene model misses four of six wells by more than 8 percent.

Step five fails when something else moves at the same time, so the comparison measures more than the property model. The geometry rows are the guard.

Step six is rarely done at all, which is why property models are routinely credited with uplift that came from correcting a constant.

Step seven fails when a map is published without its misfit, and the map is then used at a resolution it cannot support.

## What this tier changed about the earlier steps

Two things you were taught earlier now need restating.

The quality control check that the chain multiplies out no longer applies below the pore volume. With a property grid, net volume times any quoted average porosity does not give the pore volume unless the average quoted is the volume weighted one. The check becomes: divide pore by net and confirm it equals the average you are reporting.

And an average porosity in a report is now an ambiguous quantity. Say which one.

## Worked example

The whole sequence on Ekene, one line per step.

One: six porosities, 0.22, 0.19, 0.23, 0.17, 0.21, 0.22. Two: range 0.06, low values east, no northward pattern. Three: trend, because six wells support a gradient and not a variogram. Four: residuals from minus 0.019309 to plus 0.017348, alternating in sign, largest 8.4 percent of its measured value. Five: 169 cells, gross 22.269036 and net 17.815229 unchanged, pore 3.755847, STOIIP 12.796077. Six: plus 0.656868 in total, of which 0.404640 is a better constant and 0.252229 is spatial. Seven: report the plane's gradient of 0.020437 per kilometre westward, the residuals, the three means and the decomposition.

## Exercise

A colleague's property model report gives the method, the map and the resulting STOIIP. List what you would ask for before accepting the number, in order of how much it would change your view.

Self check: ask for the residuals at the control points first, since they decide whether the map means anything locally; then the decomposition against a constant booking, since it separates the robust part of the uplift from the modelled part; then the effective porosity, recoverable as pore over net, so the average being quoted can be checked against the one the booking used; then the method parameters, which for kriging decide the answer and are usually chosen rather than fitted.
