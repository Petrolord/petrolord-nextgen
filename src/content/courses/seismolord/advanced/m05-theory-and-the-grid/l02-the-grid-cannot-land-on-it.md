# The grid cannot land on it

Theory says 15.593936 ms. The model says 16 ms. Both are correct, they are graded as separate fields, and a learner who reports the theoretical value as the model's answer fails a field that has no tolerance at all. This lesson is about the gap between them.

{{panel:sl-wedge-explorer}}

## The size of the gap

| Frequency | Theory | Model | Overshoot | Overshoot as a fraction |
| --- | --- | --- | --- | --- |
| 25 Hz | 15.593936 ms | 16 ms | 0.406064 ms | 2.60 percent |
| 40 Hz | 9.746210 ms | 10 ms | 0.253790 ms | 2.60 percent |

The two overshoots are different in milliseconds and identical as fractions, and the reason is the product rule from module 4. Both runs land on a product of 400 where the ideal product is 389.8484, and $400/389.8484 = 1.0260$ at both frequencies.

The panel has a tile for this, labelled grid overshoot. It is the model's honesty about its own resolution.

## Why the model cannot do better

The model only builds traces at thicknesses that are whole numbers of samples. At a 2 ms sample rate the available thicknesses are 0, 2, 4 and so on. There is no trace at 15.593936 ms because there is no such sample.

The argmax therefore reports the best available candidate rather than the true maximum. At 25 Hz the candidates either side of the theoretical value are 14 ms and 16 ms, and the model correctly picks the one with the larger amplitude. That is not an approximation error in any process; it is a limit on what the question can be asked at.

Module 4's check with a 1 ms grid is worth recalling: at 25 Hz, refining the sample rate does not change the answer, because 16 ms is still nearer to 15.594 ms than 15 ms is. The grid limits the precision of the answer, and refining it only helps when the true value happens to fall nearer a newly available sample.

## What the gap costs in amplitude

Very little, and it is worth knowing how little.

The ideal peak amplitude is $0.08 \times 1.4462603 = 0.11570083$. The model reports 0.11559476. The shortfall is 0.00010607, which is **0.09 percent**.

That asymmetry is a general property of a maximum. Near the top of a smooth curve the slope is zero, so a 2.6 percent error in position costs only about a tenth of a percent in height. It is why the amplitude fields can be graded to 0.002, a comfortable 1.7 percent, while the thickness fields have to be graded exactly: the amplitude is insensitive to small positional errors and the thickness is the position.

## The three numbers and what each is

At 25 Hz there are three closely related figures in play and they are not interchangeable.

**15.593936024673521 ms** is the theoretical tuning thickness. Calculated, not measured. This is a capstone field.

**16 ms** is the modelled tuning thickness on a 2 ms grid. Measured by argmax over 31 traces. This is a different capstone field.

**15.384615 ms** is the $1/(2.6f)$ rule of thumb. Neither of the above, and outside the tolerance of the theoretical field.

The capstone asks for two of the three and grades them separately. Reporting 15.594 where 16 is asked for is the single most likely way to lose a zero tolerance field on this exercise, and it happens because the theoretical value looks more precise and therefore feels more correct.

## How to report a gridded measurement

The professional form quotes the measurement, the grid it was made on, and the theoretical value it was checked against. For example: *the modelled tuning thickness is 16 ms on a 2 ms grid, against a theoretical value of 15.59 ms for a 25 Hz Ricker, an overshoot of 2.6 percent that is a consequence of the sample interval.*

That sentence cannot be misread. A bare 16 ms invites the reader to assume a precision the grid does not support, and a bare 15.59 ms invites them to assume a measurement that was never made.

## Worked example

A wedge is run at 30 Hz on a 2 ms grid. Predict the modelled tuning thickness, the overshoot, and whether the overshoot fraction will match the 2.6 percent seen at 25 and 40 Hz.

Theory gives $389.8484/30 = 12.9949$ ms. The grid candidates are 12 ms and 14 ms. The model chooses the one whose product is closer to 389.8484: 12 ms gives 360 and 14 ms gives 420, so the distances are 29.85 and 30.15 and 12 ms is marginally closer. In fact the model reports 14 ms, because closeness in the product is not quite the same test as closeness in amplitude on an asymmetric curve, and the amplitude at 14 ms is the larger of the two. The overshoot is therefore 1.005 ms, or 7.7 percent, three times the fraction seen at the capstone frequencies. Thirty hertz is simply a worse fit to a 2 ms grid.

## Exercise

State which of 15.593936 ms and 16 ms is the answer to the capstone field labelled tuning thickness at 25 Hz, and give the reason in one sentence. Then explain why an overshoot of 2.6 percent in thickness produces a shortfall of only 0.09 percent in amplitude.

As a self-check: the answer is 16 ms, because that field is a reading off the model and the model can only report thicknesses that exist on its 2 ms grid, while 15.593936 ms is the separately graded theoretical field. The amplitude shortfall is so much smaller because the curve is at a maximum there and its slope is zero, so to first order the height does not change with small displacements and the loss only appears in the second order term.
