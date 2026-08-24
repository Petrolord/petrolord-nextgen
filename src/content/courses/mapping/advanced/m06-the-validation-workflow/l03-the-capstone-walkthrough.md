# The capstone walkthrough

The capstone asks for six numbers. This lesson walks the exercise in the order that produces the fewest mistakes.

{{panel:mp-validation-explorer}}

## What is being asked

Cross-validate the TOP_SAND grid by leave-one-out: only wells inside the control hull can be validated, so report how many that is and the residual at Ekene-6. Then blind-test the new appraisal well Ekene-7 at (1500, 1500), actual pick 1549 m: the six-well prediction there, its residual, and the crest and live node count after regridding with Ekene-7 included.

| Field | Unit | Tolerance |
| --- | --- | --- |
| Wells that can be cross-validated | count | 0, exact |
| Leave-one-out residual at Ekene-6 | m | 0.1 |
| Six-well grid prediction at Ekene-7 | m | 0.1 |
| Blind-test residual at Ekene-7 | m | 0.1 |
| Crest depth with Ekene-7 included | m | 0.1 |
| Live nodes with Ekene-7 included | count | 0, exact |

Two of the six are counts and both are graded exactly.

## The order to run it in

**Three panel states, in this order.** The order matters because one of the fields is destroyed by moving on too early.

**State one: all six wells.** Read the prediction at Ekene-7 here, **1543.3271484375 m**, and write it down. This is the only state in which that number exists. Once Ekene-7 is in the control set the map honours 1549 m there and the prediction is gone.

While in this state, also count the interior wells. The hull has five vertices and Ekene-6 is the only well not among them, so the cross-validatable count is **1**.

**State two: without Ekene-6.** Read the prediction at Ekene-6's own location, 1555.8438720703125 m, and subtract the pick:

$$1555.8438720703125 - 1546 = +9.8438720703125\ \mathrm{m}$$

**State three: six plus Ekene-7.** Read the crest, **1540.70556640625 m**, and the live node count, **201**.

**Then the arithmetic.** The blind residual needs no panel state at all:

$$1543.3271484375 - 1549 = -5.6728515625\ \mathrm{m}$$

## The self-consistency checks

$$\text{residual}_{E7} = \text{prediction}_{E7} - 1549$$

The two Ekene-7 fields must be consistent with the pick. If they are not, one was read in the wrong state.

$$1540.7056 > 1539.7181$$

The seven-well crest must be **deeper** than the six-well crest, because the new well constrains an overshoot. A seven-well crest that came out shallower means the wrong panel state was read.

$$\text{live}_{7} = 201 = \text{live}_{6}$$

The live count must be unchanged, because Ekene-7 is interior and adds no hull area. A different number means an exterior well was modelled.

$$\text{residual}_{E6} > 0 > \text{residual}_{E7}$$

The two residuals have opposite signs. Two residuals of the same sign means one was computed with predicted and actual the wrong way round.

## The four ways fields are lost

**Reading the Ekene-7 prediction after adding Ekene-7.** The map then reads 1549 m there and the residual comes out as zero. Zero is not close to $-5.67$ and the tolerance is 0.1 m.

**Reporting the residuals as actual minus predicted.** Both signs flip. Both fields fail, since the tolerance is 0.1 m and the errors are 19.7 m and 11.3 m out.

**Reporting the cross-validatable count as 6.** It is 1. A count with no tolerance, and reporting 6 requires having disabled the hull mask.

**Reading the crest from the six-well state.** It is 1539.7181 m there and 1540.7056 m with Ekene-7, and the 0.99 m difference is ten times the tolerance.

## Worked example

A learner submits 1, $+9.84$, 1549, $0$, 1540.71 and 201. Which two fields are wrong and what happened?

The prediction and the blind residual. They submitted 1549 for the prediction, which is Ekene-7's actual pick, and 0 for the residual, which follows from it.

What happened is that the panel was switched to the seven-well state before the prediction was read, so the map was honouring the new well. Everything else is right, which is why the error is easy to miss: four of six fields pass and the two that fail are exactly the two the blind test consists of.

## Exercise

Write out the six capstone fields with their units and state which one must be read before any other, and why.

As a self-check: the fields are the cross-validatable count of 1, the leave-one-out residual at Ekene-6 of $+9.8438720703125$ m, the six-well prediction at Ekene-7 of 1543.3271484375 m, the blind residual of $-5.6728515625$ m, the seven-well crest of 1540.70556640625 m, and the seven-well live node count of 201. The prediction at Ekene-7 must be read first, in the all-six-wells state, because adding Ekene-7 to the control makes the map honour its pick exactly and the prediction ceases to exist anywhere.
