# The disproportion factor

{{panel:qr-alarp}}

A duty holder need not adopt a measure whose cost is grossly disproportionate to its benefit. "Grossly" is the word that matters: a measure costing somewhat more than its benefit is still reasonably practicable, and the duty to adopt it stands. The disproportion factor, DF, puts a number on "grossly". This lesson sets out the test, what the engine accepts as a DF, and where its guidance comes from.

## The test

The HSE checklist's test: a measure is not reasonably practicable when its costs divided by its benefits are GREATER than the disproportion factor, cost > DF x benefit. The engine returns three things: the cost to benefit ratio, the verdict, and the largest reasonably practicable cost, which is DF times the present value of the benefit.

| DF, stated | cost / benefit | verdict |
| --- | --- | --- |
| 3 | 8.750000 | GROSSLY_DISPROPORTIONATE |
| 10 | 8.750000 | NOT_GROSSLY_DISPROPORTIONATE |

For the EDIKAN firewall undiscounted, the ratio is 8.750000. At DF 3 the firewall is grossly disproportionate and may be rejected on cost. At DF 10 it is reasonably practicable and must be adopted. Same measure, same costs, same benefit; only the stated factor moved.

## What a DF may be

HSE guidance says DFs "vary from upwards of 1", and the checklist's example says a DF above 10 is unlikely. The engine enforces the lower end. A DF below 1 would call a measure grossly disproportionate when it costs less than its benefit, so it is refused:

> disproportionFactor: must be 1 or more: HSE, "DFs that may be considered gross vary from upwards of 1"

The refusal quotes the guidance it rests on, so a reader of the error sees the reason as well as the rule. The upper end the engine leaves to the analyst. A DF above 10 is a stated input like any other, and the note that uses one says why, because the checklist expects it to be rare.

## The DF is an input

The DF has no default. Nothing in the engine derives it from the hazard, the population or the size of the measure. The duty holder states it, the analyst cites the guidance it rests on, and the note shows the verdict at the other defensible values, because for the firewall the verdict turns on it.

The ratio of 8.750000 does not depend on the DF; only the verdict and the largest reasonable cost do. That makes the ratio the natural figure to report first. A note can give the ratio once and let a reviewer read it against any DF the reviewer prefers, and the verdict at the analyst's own DF follows beside it.

## Exercise

The EDIKAN firewall's undiscounted ratio is 8.750000. Read it against a DF of 5 using the rule that a measure is grossly disproportionate only when its ratio is greater than the DF, and write the verdict. Then do the same at DF 10, and write one sentence for an ALARP note explaining which of the two DFs needs the stronger justification, given what the checklist says about factors above 10.
