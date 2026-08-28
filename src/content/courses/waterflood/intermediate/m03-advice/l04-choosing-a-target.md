# Choosing a target

Everything in this module scales toward a target VRR, and every lesson so far has taken the target as given. This one asks where it comes from, because on a field with two elements pulling in opposite directions the target is not one number and choosing it is the actual engineering decision.

## The field target is not the pattern target

Ekene's field plan is 1.05: replace everything and buy a little margin above the bubble point. Applying 1.05 to both elements gives:

| element | current rolling VRR | scale at 1.05 | current Wi (bbl/period) | recommended |
|---|---|---|---|---|
| North | 1.240523853264427 | 0.8464166144302142 | 3320.2225730545156 | 2810.2915494395775 |
| South | 0.6082528252875008 | 1.726255853400599 | 1631.9738070945923 | 2817.2043370935 |

Interesting result: at a common target of 1.05, the two elements converge on almost the same injection rate, about 2810 and 2817 barrels per period. That is a consequence of them producing similar voidage, and it is a useful sanity check that the arithmetic is doing what you think.

The total becomes 5627.495886533077 against a current allocated 4952.196380149108, an increase of 13.64 percent in allocated injection. That percentage is a ratio of two sums, and its digits beyond the fourth depend on the order the sums were accumulated in, so quoting it to sixteen figures would be claiming precision the quantity does not carry.

## Why a common target may be wrong

Three arguments for differentiating.

**The elements have different jobs.** The North element contains the wells that are actually producing the field's oil and responding to the flood. The South element contains a well that has never seen water. Pressure support where the production is may be worth more than pressure support where it might one day be.

**The elements have different deliverability.** Increasing the South element means pushing harder on Ekene-4, which is the well whose injectivity degrades. A target that cannot be delivered is not a target.

**The out-of-zone risk differs.** Ekene-4's row already books 0.15 out of zone, the larger of the two. If the marginal barrel into Ekene-4 goes out of zone at a higher rate than the average barrel, then increasing it buys less than the arithmetic promises.

## Why a common target may be right

Two arguments against differentiating.

**Simplicity is worth something.** A single field target that everyone knows is easier to operate against, easier to audit, and harder to quietly drift.

**Differentiated targets encode a belief about connectivity that the allocation already encodes once.** If you believe the South element is less connected, that belief belongs in the matrix, not in a second adjustment on top of it. Applying it twice double counts it.

That second argument is the stronger one and it generalises: keep each piece of judgement in exactly one place in the calculation.

## The target that is not a VRR

There is a third option worth naming. The target could be a PRESSURE rather than a ratio. "Hold the reservoir above 2100 psia" is an objective with a physical meaning, and the VRR needed to achieve it follows from the material balance rather than being chosen.

That is more defensible in principle, and harder in practice, because it needs a pressure track per element and pattern-level pressure is exactly what a connected sand refuses to give you. The Associate tier's field pressure track is solid; a per-element version of it is not, because pressure equilibrates across pattern boundaries in ways the allocation does not model.

So the VRR target survives as the practical objective, with the pressure track as the check on whether the field-level target is right.

{{panel:wf-pattern-explorer}}

Set the target to 1.05 on each element in turn and confirm the two recommended rates land within a few barrels of each other. Then try 1.0 and watch the agreement PERSIST: 2676.468142323407 against 2683.051749612857. That is not a coincidence of the target. At a common target the recommended injection is the target times the element's produced voidage divided by $B_w$, so two elements producing similar voidage converge on similar rates at every target. The agreement is a fact about the production, not about the plan.

## A defensible position for Ekene

State it as a recommendation and its conditions.

Set both elements to the field target of 1.05, because the differentiation argument belongs in the allocation matrix and is already there. That implies roughly a fifteen percent cut to the North element's injection and roughly a seventy percent increase to the South element's, which nets to a 13.63 percent increase in total allocated injection.

Then condition it: verify Ekene-4 can take the increase, which module 4 addresses; and verify that the North element's cut does not cost production at Ekene-6, which needs the water arrival diagnostics in module 5. Both conditions are checkable with data already in hand, and neither is checked by the recommendation itself.

## The misconception to avoid

"The target is a policy input, so it is not an engineering question." The target is where the engineering enters. Everything downstream of it is arithmetic. Choosing 1.0 rather than 1.05, or differentiating by element, changes the recommendation far more than any refinement of the calculation would, and it is the one number in this module that a reservoir engineer is uniquely qualified to set.

## Exercise

First, verify the two scales in the table from the current rolling VRRs, and confirm the recommended rates. Then show algebraically that at a common target the recommended injection depends only on the element's produced voidage and the target, and use that to explain why the two rates stay close at every target.

Second, write the two-sentence justification you would put in a report for setting both elements to 1.05, including the condition that would make you revisit it.
