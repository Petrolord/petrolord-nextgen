# The number it refuses to give

The model returns null for the formation volume factor, and the refusal is the most informative thing in the run.

{{panel:fluid-study-explorer}}

## What happens

Ask the untuned model for Bo at the study's stated reservoir conditions of 220 F and 2634.65 psia, and it returns nothing. Not zero, not an approximation, null.

## Why

Because on THIS model the fluid is not a single-phase oil at those conditions.

The model's saturation pressure is 2791.100735294379 psia. The stated reservoir pressure is 2634.65 psia. The stated pressure is BELOW the model's saturation pressure, so the model says the fluid there is two phase.

A formation volume factor is reservoir volume of single-phase oil per stock tank barrel. If the fluid at those conditions is not a single-phase oil, there is no volume to measure and the quantity is undefined.

## The engine's choice

Return null and say why, rather than return a number.

The alternatives are all worse. Reporting the liquid-phase volume only would answer a different question and label it Bo. Reporting the total two-phase volume would be nonsense. Extrapolating the undersaturated branch below the saturation pressure would be inventing data.

A null with a documented reason is the only honest output, and it is the sort of decision worth noticing in a library: most software returns something.

## Why the two pressures disagree in the first place

The laboratory says the fluid is AT its bubble point at 2634.65 psia. That is what the study found: the sample was saturated at reservoir conditions.

The untuned model puts the bubble point six percent higher. So the model and the laboratory disagree about which side of the phase boundary the reservoir sits on, and everything about the fluid's state there follows from that disagreement.

This is the saturation pressure bias, arriving somewhere that matters. Six percent sounded like a modest error two lessons ago. Here it removes a quantity entirely.

## What to do about it

**Tune the model.** After tuning, the saturation pressure lands within a tenth of a percent of the measurement, the fluid is single phase at the stated conditions again, and Bo comes back. The Expert tier does exactly this.

**Or compare at the model's own saturation pressure.** The engine's harness does this as a documented fallback when the untuned saturation pressure exceeds the stated reservoir pressure: compare the model's Bo at ITS bubble point against the laboratory's Bo at THEIRS, which is comparing like with like on the quantity both are anchored to.

Both are legitimate. The second is what you do when you cannot tune, and it has to be stated because it is a different comparison.

## The general lesson

A model refusing to answer is information. It is telling you that the question assumed something the model does not agree with.

The instinct is to work around it, and the work-around usually consists of asking a slightly different question and reporting the answer as though it were the original one. That is how a study acquires a number that nobody can trace.

## The misconception to avoid

"The model failed to compute Bo." It computed that Bo does not exist under its own view of the fluid, which is a successful calculation with a null result. A model that had returned 1.4 there would have been less correct and more comfortable.

## Exercise

First, state the model's saturation pressure and the study's reservoir pressure, and explain in two sentences why the formation volume factor is undefined for the model at those conditions.

Second, name the two ways to obtain a comparable Bo anyway, and say what each one has to state in the report.
