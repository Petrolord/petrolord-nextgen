# The capstone walkthrough

The capstone gives you a well set of its own, a prospect, a named interior well to cross-validate and an appraisal well with its actual pick. It asks for six numbers. This lesson walks the exercise in the order that produces the fewest mistakes, worked on the Ekene teaching wells, where Ekene-6 is the interior well and Ekene-7 the appraisal well. None of the Ekene numbers is a capstone answer.

{{panel:mp-validation-explorer}}

## What is being asked

Cross-validate the TOP_SAND grid by leave-one-out: only wells inside the control hull can be validated, so report how many that is and the residual at the named well. Then blind-test the appraisal well: the grid's prediction there before it was drilled, its residual, and the crest and the depth at the prospect after regridding with it included.

| Field | Unit |
| --- | --- |
| Wells that can be cross-validated | count, exact |
| Leave-one-out residual at the named well | m |
| Grid prediction at the appraisal well | m |
| Blind-test residual at the appraisal well | m |
| Crest depth with the appraisal well included | m |
| Depth at the prospect with the appraisal well included | m |

## The order to run it in

**Type the case first.** Choose "Type a well set", replace the Ekene lines with the brief's wells, and type the prospect and the appraisal well's position and actual pick. The control-set list then names the brief's wells.

**State one: all the brief's wells.** Read the cross-validatable count, and read the prediction at the appraisal well: it is on the tile when the appraisal set is selected, labelled as the prediction before it was drilled. On Ekene the count is **1** (the hull has five vertices and Ekene-6 is the only well not among them) and the prediction at Ekene-7 is **1543.3271484375 m**.

**State two: without the named well.** Read the prediction at that well's own location and subtract its pick. On Ekene, without Ekene-6:

$$1555.8438720703125 - 1546 = +9.8438720703125\ \mathrm{m}$$

**State three: all plus the appraisal well.** Read the crest and the depth at the prospect. On Ekene the crest is **1540.70556640625 m**.

**Then the arithmetic.** The blind residual is the prediction minus the actual pick. On Ekene:

$$1543.3271484375 - 1549 = -5.6728515625\ \mathrm{m}$$

## The self-consistency checks

$$\text{residual} = \text{prediction} - \text{actual}$$

The two appraisal fields must agree with the pick. If they do not, one was read in the wrong state.

Adding an interior well usually corrects an overshoot, so the crest with the new well included sits at or below the crest without it. On Ekene, $1540.7056 > 1539.7181$. A crest that came out shallower deserves a second look at the panel state.

The live count does not change when the new well is interior, because it adds no hull area.

## The four ways fields are lost

**Reading the appraisal prediction after adding the appraisal well to the map.** The map then honours its pick there and the residual comes out as zero.

**Reporting the residuals as actual minus predicted.** Both signs flip and both fields fail.

**Reporting the cross-validatable count as the number of wells.** Only interior wells can be predicted once withheld; reporting every well requires having disabled the hull mask.

**Reading the crest from the state without the appraisal well.**

## Exercise

Write out the six capstone fields with their units and state which one must be read in which panel state, and why.
