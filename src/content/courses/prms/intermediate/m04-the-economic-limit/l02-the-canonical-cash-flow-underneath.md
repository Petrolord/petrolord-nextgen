# The canonical cash flow underneath

{{panel:prms-reserves-calculator}}

The engine computes no cash flow of its own. Every revenue, royalty, tax, net cash flow and NPV in the economic limit view comes from computeCashFlow in the academy's canonical engines/economics/cashflow.ts, the code the cash flow course teaches. This lesson shows how the prms engine calls it; the ledger, the discounting and the NPV as a subject belong to the cash flow course.

## The call, in the engine's words

The engine states its rule in its basis, verbatim:

> computeCashFlow of engines/economics/cashflow.ts with apply_economic_limit (JV regime at 100%, the stated royalty and tax), checked against PRMS 3.1.3.1

Read it in three parts. The cash flow runs under the JV regime with the stated royalty and tax and no escalation. It runs at 100 percent, and the working interest is applied afterwards. And the canonical economic limit is switched on, so cashflow.ts itself finds the year the project stops paying.

## Proof that it is the same cash flow

Hand the best case of EKN-1 straight to computeCashFlow with the same regime and inputs, and it returns an economic limit year of 2037, 3 years trimmed, an undiscounted net cash flow of 382377266.937500 and an NPV of 318649106.969712. Those are the figures the prms engine reports for its best case. Nothing is recomputed; the numbers are the canonical engine's.

## What goes in, every piece stated

The royalty, the tax and the prices on EKN-1 are synthetic figures chosen for teaching: a 15.000000 percent royalty, tax at 30.000000 percent with 5-year straight-line allowances, loss carry forward true, and a discount rate of 10.000000 percent. They are not the rates of the Petroleum Industry Act 2021; the Petroleum Industry Act course teaches the Nigerian fiscal system. Here each is a stated input with no default.

A missing tax block is refused, verbatim:

> tax must be an object { ratePct, depreciationYears, lossCarryforward }; got nothing

The loss relief choice must be stated too:

> tax.lossCarryforward must be true or false (stated; no default); got nothing

And the royalty form is one of two words:

> royalty.form must be one of "royalty-interest", "production-tax"; got "cash"

## A choice that moves nothing here

The loss relief choice acts on the tax only. On EKN-1 no case has a loss year to carry, so the best undiscounted net cash flow is 382377266.937500 with loss carry forward true and with it false.

## The discount rate and the NPV

The discount rate sets the NPV and nothing else. The economic test is undiscounted, so the rate changes no verdict and no Reserves quantity. An NPV is always quoted with its rate.

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 Ekene Main waterflood, net entitlement". Read the best case's economic limit, trailing years cut, undiscounted net cash flow and NPV, and compare them with the canonical figures above.
2. Start from "EKN-1 with no loss carry forward" and confirm the best undiscounted net cash flow is unchanged.
3. Set "Discount rate, percent (stated)" to 0. Read which columns move and which stay.
4. Set "Loss carry forward (stated)" to not stated and read the refusal. Then set "Royalty form (stated)" to not stated and read the next one.
