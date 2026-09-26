# Contingency and the partner split

{{panel:pr-contract-calculator}}

The base of the should-cost is what the programme costs if the stated rates and the stated NPT hold. Two more steps turn it into the figure a joint venture works with: a contingency for what the base does not foresee, and a split of the total among the partners who will pay it. The engine takes both from the platform's existing engines.

## Contingency on the base

The fixture states a contingency of 0.1 of the base. On the Ekene job the engine returns:

| figure | value |
| --- | --- |
| base | 813964.583333 |
| contingency | 81396.458333 |
| estimate | 895361.041667 |

The estimate is the base plus the contingency. Contingency is a fraction the company chooses, and the engine applies it to the whole base, per-day items and lump items alike. A report that quotes the should-cost names the fraction beside it, because a different company policy moves the estimate and every ratio built on it.

## How NPT moves the estimate

The should-cost runs at one stated NPT fraction, so a sensitivity is one more call. At a stated NPT fraction of 0.25 the engine returns 15.071181 days and an estimate of 935148.958333. The rise, 39787.916667, is exactly the extra days, 1.205694, times the per-day rates of 30000.000000 a day, times one plus the contingency. The lump items do not move at all, because they are valued as lumps whatever the duration. On a job where most of the cost is per day, NPT is the assumption to test first.

## The partner split

The Ekene licence is shared. The engine passes the estimate to the platform's `engines/economics/afe.js`, whose basis reads, verbatim:

> engines/economics/afe.js calculatePartnerCosts: each partner pays its working interest; the operator carries 100 less the partner total

| party | working interest | share of the estimate |
| --- | --- | --- |
| Partner EK-B (synthetic) | 40% | 358144.416667 |
| Partner EK-C (synthetic) | 15% | 134304.156250 |
| operator | 45% | 402912.468750 |

The operator is not listed among the partners. Its share is whatever the partners leave, 100 less their total. The partners, like everything else in these tenders, are synthetic.

## Why the split belongs in a tender file

Each partner approves its share of the spend through the AFE, so a should-cost that arrives already split lets the operator show each partner what the tender will cost it before the award. It also shows the partners that the estimate came from the programme and the company's own rates, which is the point of an independent estimate.

The engine checks the shape of the partner list and refuses anything else, naming the field:

> partners must be an array of { name, working_interest } when given

Leaving the partners out is allowed: the estimate is returned with no split.

## Exercise

Open the contract calculator on the view "Should-cost and the screening band". Read the tiles "Contingency", "Estimate" and "Operator share" and check them against the tables. Change `nptFrac` to 0.25 and confirm the total days and the estimate above. Put 0.15 back, then delete the second partner from `partners` and read the operator's share again: say what the operator now carries and why the first partner's share did not move. Finally type `partners` as a piece of text in quotation marks and read the refusal.
