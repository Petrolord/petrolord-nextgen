# Per-injector deltas

A pattern-level recommendation says "this element needs more water". An operator needs to know which valve to turn. This lesson is about the step from one to the other, and about a subtlety in it that is easy to miss.

## The breakdown

Having computed a scale for a pattern, the engine works out how much of that pattern's recent injection came from each injector, and scales each one by the same factor.

For the South element at target 1.0, scale 1.644053193714856:

| injector | current (bbl/period) | recommended | delta |
|---|---|---|---|
| Ekene-4 | 1125.4991773066156 | 1850.3805169743844 | +724.8813396677687 |
| Ekene-2 | 506.4746297879769 | 832.6712326384727 | +326.1966028504958 |

and for the North element at scale 0.8061110613621087:

| injector | current (bbl/period) | recommended | delta |
|---|---|---|---|
| Ekene-2 | 2532.3731489398847 | 2041.3740068568359 | -490.99914208304875 |
| Ekene-4 | 787.8494241146308 | 635.0941354665712 | -152.7552886480596 |

The lists are sorted by current contribution, largest first, which is usually the order of operational relevance.

## The subtlety

Look at Ekene-2. It appears in both tables. The South element wants 326.1966028504958 more barrels per period from it; the North element wants 490.99914208304875 fewer.

Those are not two separate valves. Ekene-2 is one well with one injection rate, and the two recommendations are about the same water. What the engine has produced is the ALLOCATED share of Ekene-2 that each element wants, and turning the actual valve changes both shares simultaneously in the same direction.

So you cannot simply apply both recommendations. Netting them for Ekene-2 gives $326.1966028504958 - 490.99914208304875 = -164.80253923255293$ barrels per period, a reduction, and for Ekene-4 $724.8813396677687 - 152.7552886480596 = +572.126051019709$, an increase.

That net answer is worth computing, and it happens to be a sensible operational recommendation: take some water off Ekene-2 and put more into Ekene-4, which shifts the field's injection westward and southward, which is exactly what the imbalance calls for. But it emerged from combining two per-pattern answers, not from either of them alone.

## Why the engine does not net it for you

Because netting requires deciding how to weight the two patterns' claims, and that is a judgement the engine has no basis for. Should the starved element's claim count equally with the over-injected element's? Should the element producing more oil get priority? Those are field development questions.

What the engine gives you is each pattern's requirement, correctly computed. The reconciliation is yours, and it should be visible in the report as a reconciliation rather than folded into a single number.

{{panel:wf-pattern-explorer}}

Switch between the two elements at a target of 1.0 and read the per-injector lines under the tiles. Ekene-2 appears in both, with opposite signs. That is the reconciliation problem in one screen.

## The rebalance is nearly free

Add the two net deltas: $-164.80253923255293 + 572.126051019709 = +407.3235117871561$ barrels per period of extra total injection, against a current ALLOCATED injection into the two elements of $3320.2225730545156 + 1631.9738070945923 = 4952.196380149108$ barrels per period. So a change that moves both elements substantially toward target costs 8.225108225108226 percent more water, and the rest of the correction is redistribution.

That is the general shape and it is the reason pattern analysis pays. Most of the correction is redistribution, which is cheap, rather than volume, which is not.

## What the deltas do not account for

**Injectivity limits.** Ekene-4 is asked for the larger increase, and Ekene-4 is the well whose injectivity degrades partway through the record. The next module measures that; the recommendation here does not know about it.

**Fracture pressure.** Pushing a well harder raises its injection pressure, and above the parting pressure the water opens fractures. A recommendation that cannot be delivered within the pressure limit is not a recommendation.

**Response time.** The delta is a monthly rate change. The pattern VRR responds immediately in the bookkeeping and the reservoir responds over months. Do not re-tune every month against a signal that has not arrived yet.

## The misconception to avoid

"Apply every pattern's recommendation and the field will be balanced." The recommendations are computed independently and share injectors, so applying them literally double counts every shared well. Reconcile first, and check the reconciled total against the field-level requirement before doing anything.

## Exercise

First, reproduce both net deltas for Ekene-2 and Ekene-4 from the four table rows, and confirm the total change in field injection.

Second, suppose Ekene-4 cannot take any increase at all. Recompute what would have to happen to Ekene-2 to give the South element its required increment, and state what that would do to the North element.
