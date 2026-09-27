# Unbudgeted items and the allowance

{{panel:joa-account-calculator}}

Not every cost fits a line the committee approved. A survey nobody foresaw, a small study, a regulator's request: the operator may need to spend on work outside the programme and the budgets. An agreement can allow a small amount of such spending each year without a fresh approval. This lesson computes that allowance.

## What the Norwegian agreement says

The Norwegian joint operating agreement (Attachment A, an unofficial English translation of the 2007 text, cited from its Wayback Machine capture of 26 May 2024) allows work outside the programme and the budgets:

> "up to an aggregate amount for each budget of NOK 3 million during the Accounting year." (Norway JOA Art. 12.5)

The NOK 3 million is the Norwegian text's figure. The engine holds no allowance of its own: `unbudgetedAllowance` is an optional input, and the engine tests unbudgeted items against it only when you state it.

## What counts as unbudgeted

An item with an approved amount of zero is unbudgeted. Its overrun is its whole actual spending, and its overrun percent and item limit are none, because no percentage of zero approved can be computed. The engine sums every unbudgeted item and tests the sum against the allowance: the allowance is an aggregate, as the Norwegian text says.

## The Ekene survey

The Ekene 2027 budget holds one unbudgeted item, an environmental baseline survey that spent 250000.000000. The fixture states an allowance of 500000.000000. The engine's reason:

> environmental baseline survey: 250000 spent with no approved budget, inside the unbudgeted allowance 500000 with the other unbudgeted items (250000 in all)

| the unbudgeted items (engine) | value |
| --- | --- |
| unbudgeted total | 250000.000000 |
| unbudgeted allowance | 500000.000000 |
| inside the allowance | true |

## With no allowance, and with too small a one

Two worked cases change only the allowance. With none stated, the survey has no allowance to fall inside:

> environmental baseline survey: 250000 spent with no approved budget: outside the approved budget

With an allowance stated one dollar short of the survey, it is above the allowance:

> environmental baseline survey: 250000 spent with no approved budget: the unbudgeted items total 250000, above the allowance 249999

In both cases the engine lists the survey among the items outside their tolerance, beside exploration drilling.

## The allowance and the budget total

An unbudgeted item is still spending on the joint account. Its actual is part of the budget's actual total of 81950000.000000, and its overrun is part of the overrun of 5950000.000000 that the budget tolerance tests. The allowance decides only whether the unbudgeted spending itself was permitted; it does not take that spending out of the budget total.

## Reading the result

The budget control view prints two tiles for this lesson: "Unbudgeted total" and "Inside the unbudgeted allowance". The second reads none when no allowance is stated. Read the reason for each unbudgeted item beside them, since the reason says which of the three outcomes applied.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Budget control". Start from "The Ekene 2027 budget" and run it; read the two unbudgeted tiles and the survey's reason. Clear the control "Unbudgeted allowance (optional)" and run it again. Then type 249999 into that control and run it once more. For each of the three runs, write down the survey's reason and what its "inside its tolerance" column reads.
