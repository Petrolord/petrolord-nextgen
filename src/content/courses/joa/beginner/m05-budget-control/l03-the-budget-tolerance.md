# The budget tolerance, the lower of two

{{panel:joa-account-calculator}}

Item tolerances alone would let every line, and so the whole budget, run over by the item margin, so agreements add a second test on the budget as a whole. The Norwegian joint operating agreement (Attachment A, an unofficial English translation of the 2007 text, cited from its Wayback Machine capture of 26 May 2024) states it as the lower of a percentage and an amount.

## What the Norwegian agreement says

> "None of the budgets may be exceeded by more than the lower of 5% or NOK 75 million during the Accounting year." (Norway JOA Art. 12.5)

The lower of two limits means that on a small budget the percentage binds, and on a large one the fixed amount binds. The 5% and the NOK 75 million are the Norwegian text's figures. The engine holds neither: the budget tolerance is a required object `{ pct, amount }`, with the amount optional.

## The engine's rule

The second half of the rule in the engine's basis:

> an item is inside its tolerance when actual <= approved x (100 + itemTolerancePct) / 100; the budget is inside when the total overrun <= the lower of pct % of the approved total and the stated amount

The allowed overrun is computed on the **approved** total. The engine also reports which of the two limits held it: `pct` or `amount`.

## The Ekene 2027 budget

The Ekene terms state a budget tolerance of the lower of 5.000000 percent and 3000000.000000. The approved total is 76000000.000000. The engine's reason works it:

> the budget: 81950000 against 76000000 approved, an overrun of 5950000; the allowed overrun is the lower of 5% of the approved total (3800000) and 3000000: 3000000; beyond the budget tolerance

The allowed overrun is 3000000.000000, held by the amount. The overrun of 5950000.000000 is beyond it, though four of the five approved lines are inside theirs.

## The Norwegian figures, stated as inputs

Two worked cases state the Norwegian figures in NOK million. On an approved budget of 2000.000000 the percentage gives 100 and the amount 75, so the amount holds, at 75.000000. An overrun of 80.000000 is beyond it:

> the budget: 2080 against 2000 approved, an overrun of 80; the allowed overrun is the lower of 5% of the approved total (100) and 75: 75; beyond the budget tolerance

On an approved budget of 1000.000000 the percentage gives 50, below the amount, so the percentage holds, at 50.000000, and an overrun of exactly 50.000000 is inside.

## What the engine refuses

Leave the budget tolerance out and the engine refuses by name:

> budgetTolerance must be an object { pct, amount } (amount optional; no default); got nothing

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Budget control". Start from "The Ekene 2027 budget" and run it; read the "Allowed overrun" and "Held by" tiles. Clear the control "Budget tolerance amount (optional)", run it, and write down the new allowed overrun and which limit holds it. Then choose the start "The Norwegian figures, in NOK million" and change the approved amount to 1000 and the actual to 1050. Finally, delete the `budgetTolerance` key from the box and read the refusal.
