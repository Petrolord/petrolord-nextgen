# Capital expensed when spent

Capital enters a cash flow once as money spent. It enters the tax calculation a second time, as a deduction against taxable income, and the timing of that deduction decides when tax is paid. This lesson reads how the screening engine deducts ODIOMA's expansion capital, and why the course holds that treatment as a stated limit.

{{panel:refinery-variance-explorer}}

## The capital in the cash flow

The modular scaling law gives the expansion a capital of 117831965.35 dollars. The screen spreads capital evenly over the construction years, and the expansion has 2 of them. In the screening engine's millions:

| year | calendar year | capex (MM) | tax (MM) | net cash flow (MM) |
| --- | --- | --- | --- | --- |
| 0 | 2027 | 58.9160 | 0.0000 | -58.9160 |
| 1 | 2028 | 58.9160 | 0.0000 | -58.9160 |
| 2 | 2029 | 0.0000 | 0.0000 | 38.5879 |

The plant earns nothing in 2027 and 2028. Its net cash flow in each of those years reads -58.9160 million.

## The deduction

feasibilityEconomics passes no capexDepreciationYears, so the screening engine deducts the capital in the year it is spent. Its depreciation column equals the capex column in every year: true.

That is the whole rule. The capital is expensed in the years it is spent, before the plant earns. In each construction year the deduction is 58.9160 million and there is no revenue against it, so the taxable income before relief is -58.9160 million in year 0 and again in year 1. The construction years make a tax loss.

## Why it is held

Many tax regimes recover capital through capital allowances, spread over a number of years, and often starting only when the plant is commissioned and begins to earn. The screening engine offers no capital allowance schedule starting at commissioning.

This is held item H2: the screening engine depreciates capital in the year it is spent and offers no capital allowance schedule starting at commissioning. Carrying the loss forward covers the refinery case. A fuller allowance model belongs to the Economics module.

Held means three things for this course. The treatment is stated as a limit of the engine. It is not presented as the way any particular tax authority works. And nothing is graded that depends on choosing a different treatment. A learner who knows a regime's real allowance schedule should read the ODIOMA tax figures as the screen's answer under this engine's rule, and take the fuller question to the Economics module.

## What rescues the refinery case

Deducting capital when it is spent creates a loss in years with no income. If that loss simply vanished, the deduction would be worth nothing, and the first operating years would be taxed as if the plant had cost nothing to build. The screening engine's lossCarryForward option, which feasibilityEconomics switches on, carries the loss forward so it shelters the first operating years. Module 5 reads that pool year by year.

The two settings work as a pair. Capital expensed when spent makes the loss early. Carrying the loss forward lets it be used when the plant earns. Together they give the refinery a deduction for its capital, in the years it has income to deduct it from.

## Exercise

Read the capex, tax and net cash flow in 2027 and 2028, and the statement that the depreciation column equals the capex column in every year. Say in which years the capital is deducted and why that produces a tax loss. Then state held item H2 in your own words, and say which module of the Academy owns a fuller capital allowance model.
