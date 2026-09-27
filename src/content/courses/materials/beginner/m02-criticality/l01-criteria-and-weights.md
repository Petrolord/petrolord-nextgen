# Criteria and weights

{{panel:materials-register-calculator}}

Some stockouts are an inconvenience and some shut in a well or put people at risk. Criticality is the question of how bad it is to run out of an item, and a criticality class sorts the register by that answer. The engine computes a class from criteria and weights you state. It holds no criterion list of its own and no scheme to fall back on.

## The criteria are yours

A criterion is one way running out can hurt: through safety, through lost production, through a long wait for a replacement, through having no installed backup. Each criterion has an id, a label and a weight. The Ekene policy states four:

| id | label | weight |
| --- | --- | --- |
| safety | Consequence of failure for people and the environment | 40 |
| production | Consequence of failure for production | 30 |
| leadTime | Replacement lead time | 20 |
| redundancy | Lack of installed redundancy | 10 |

Each item then carries a score on every criterion, out of a stated score scale; the Ekene policy scores out of 5. A 5 on safety says a failure of this item has the worst consequence for people and the environment that the policy recognises; a 1 says the least.

One well-known scheme of this kind is VED, which sorts items into vital, essential and desirable. The course names it only as one example of a stated policy, and the Ekene policy happens to label its classes V, E and D. No licensed maintenance standard is read or taught here, so your criteria and weights stay your own decision.

## Weights are percentages

Each weight is read as a percentage, and the weights must add to 100. Change one and the others must move to keep the sum. Stated weights that miss 100 are refused before any score is computed:

> criteria weights must add to 100; they add to 99

A weight of 0 is refused too, because a criterion that counts for nothing should be left out of the list:

> criteria[0].weight must be a number above 0 and at most 100; got 0

A call can carry at most 20 criteria, one of the caps the engine holds.

## What the weights say

Weights are the policy's statement of what matters most. The Ekene policy puts 40 on safety and 10 on redundancy, which says a safety consequence counts four times as much as the lack of a backup. Another operator with the same register might weigh production more heavily. Neither is the engine's view; both are policies, and each gives its own classes. That is why the course quotes a criticality class with the criteria, weights and minimums it came from.

## Exercise

Open the register calculator, set the View to "Criticality classes" and start from "The Ekene register, its stated criticality policy". Read the four criterion id and weight controls. Lower the criterion 4 weight from 10 to 9 and copy the refusal. Now restore it and try a different policy: set the criterion 1 weight to 30 and the criterion 2 weight to 40, so the sum stays 100. List the items whose class changes, then restore the Ekene weights.
