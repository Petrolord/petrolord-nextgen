# Confidence read in one place

`screenTreatments` reads `diagnosis.confidence` inside the channelling branch and nowhere else, so the caveat is attached to the verdict that spends money and not to the one that refuses to.

{{panel:pd-candidate-explorer}}

## Where the caveat appears

On the teaching well ELELENWO-4 at the engine default `lateFraction` of 0.5, the derivative fit over the late window opening at t = 250.242976 days returns a slope of 1.442132492 at a fit quality of 0.998513658 as a fraction, and the diagnosis is channelling at confidence low, ambiguous true.

The water shutoff comes back candidate with three reasons, and the third is "The reading is low confidence, so confirm it with a production log before committing to a squeeze." The confidence was read, and it earned a sentence.

## Where it does not

The same 38 samples read at `lateFraction` 0.9, a window opening at t = 23.392754 days, give a derivative slope of 1.254360095 at a fit quality of 0.995286721 as a fraction. The diagnosis is displacement, still confidence low and still ambiguous true.

The water shutoff comes back blocked, blocked = true, with one reason, "Water cut is 75 percent and the derivative is flat.", and the block reason "The diagnostic says ordinary displacement. The water is arriving because the reservoir is swept, which is not a well problem."

Confidence low and ambiguous true were carried into that call and neither was read.

| Window fraction | Mechanism | Confidence | Ambiguous | Water shutoff | Reasons |
| --- | --- | --- | --- | --- | --- |
| 0.5 | channelling | low | true | candidate | 3 |
| 0.9 | displacement | low | true | blocked | 1 |

## The blocks that are read on the published cases

Run the classifier over the four published histories and the coning and displacement readings both come back at confidence high with ambiguous false, and both block the water shutoff. The flat history returns displacement at confidence n/a and blocks it too. A high-confidence block and a low-confidence block are written identically, because the branch that issues them never opens the field.

## What it refuses

The one refusal that says how sure it is comes from handing the screening no diagnosis at all. The water shutoff blocks with "The mechanism has not been established. A shutoff squeeze on a coning well is money down a hole, and this history does not say which it is. Get more production history, or a production log, before spending anything."

That is the module getting it right, and a refusal naming its own uncertainty is the shape the other blocks are missing.

The mistake is reading a block as more certain than a candidate. Both readings here carry confidence low and ambiguous true, and only the candidate says so in print. A block still costs money: the oil the well would have made.

## Exercise

Record the mechanism, the confidence, the ambiguous flag and the water shutoff reason count at both window fractions. Then write the sentence the block would carry if the displacement branch read confidence the way the channelling branch does.
