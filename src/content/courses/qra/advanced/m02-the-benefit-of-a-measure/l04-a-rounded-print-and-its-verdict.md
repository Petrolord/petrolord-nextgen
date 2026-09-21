# A rounded print and its verdict

{{panel:qr-alarp}}

The checklist's largest reasonable cost is printed as 93000, and the engine computes 92835.00 from the same inputs. The gap looks harmless, since the source meant "in the region of". This lesson shows that a cost weighed at the printed figure lands on the other side of the test, and draws from it the rule every ALARP note in this course follows.

## At exactly the printed figure

| cost | limit it is weighed against | engine verdict |
| --- | --- | --- |
| 93000 | DF 10 times 9283.50, which is 92835.00 | GROSSLY_DISPROPORTIONATE |

Put a cost of exactly 93000 through the engine with the checklist's inputs and a DF of 10. The engine returns GROSSLY_DISPROPORTIONATE, by 165.00. A reader who took the printed 93000 as the limit would expect a cost exactly at it to be reasonably practicable, by the lower band rule. The engine, working from the inputs, finds the cost above the true limit and says so.

## Why the verdict flips

The test is strict: a measure is grossly disproportionate when its cost is greater than the DF times its benefit. The computed limit is 92835.00. A cost of 93000 is 165.00 above it, and the test reports it as above the limit. The verdict is an artefact of the checklist's rounding, and nothing about the measure itself changed. The source meant its 93000 as a figure in the region of the limit, which it is. The engine reads every number it is given as exact, which is what a test on a limit has to do.

## A second slip in the same source

The checklist table also prints a permanent incapacity value as "207,2000". Its own worked example uses 207,200, and so does the golden. Read literally, the table's figure is a different and much larger number; read beside the worked example, it is a misplaced digit in the print. An analyst who copies values out of a published table checks them against the source's own worked example before using them, and records which one was used.

## The rule for an ALARP note

Compute from the inputs, never from a rounded figure. A printed total, a printed limit and a printed value per case are each the source's rounding of a number the inputs define exactly. Carry the inputs, let the engine compute the limit, and quote the printed figure only as a check on the reproduction.

When a verdict lies close to a limit, say how close. Here the margin is 165.00 on a limit of 92835.00, and a reader should see both numbers. A margin that small also invites the question of how the verdict moves with the choices behind it, the DF, the VPF and its year, and the discounting convention, which the judgement module takes up.

## Exercise

Take the engine's limit of 92835.00 and the printed 93000. Subtract to check the margin of 165.00. Then suppose a cost of exactly 92835.00, write the verdict the engine would return by the lower band rule, and write one sentence for an ALARP note explaining why the checklist's printed limit was left out of the calculation.
