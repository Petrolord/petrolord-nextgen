# What the stack leaves out

Four fields hold the whole of a regime's tax: a corporate income tax rate, a resource rent tax rate, a minimum tax rate and an uplift percent. Everything a real fiscal code does that those four cannot say is simply absent.

{{panel:ec-instrument-explorer}}

## No loss carryforward

A year whose base is not positive pays nothing and passes nothing on. On "Brazil - Concession" over the Designer's default project, years 1 and 2 have profit oil of 0.0000 and pay 0.0000 in tax, and year 3 is then charged 25.7707 million USD in full on a base of 75.7962. The two loss-making years bought no relief.

## No allowance for capital

There is no depreciation and no capital allowance. Capex reaches the tax computation through one route only, the resource rent tax uplift, and four of the six templates set their resource rent tax rate to 0, so for those four capex touches the tax line nowhere at all. Cost recovery is not the missing deduction either: the total cost recovered on the default project is 941.4436 million USD, and none of it is subtracted in the tax base, because the base is the profit share and recovery has already been settled in cash.

## No other instrument at all

There is no education tax, no levy on gross production, no bonus, no rental and no state participation line. Three things in the model touch gross revenue: the royalty, the minimum tax and, in the "Nigeria - PIA (2021)" template alone, a cost recovery limit taken on the gross value of crude oil and NGL. There is no ring fence and no consolidation, so a group cannot shelter one licence with another. There is no abandonment cost and no valuation date, and the horizon is 25 rows whatever the input.

## The mistake

The tempting repair is to bend a rate until the total looks right. If a real regime carries a production levy the four fields cannot express, raising the corporate income tax rate until total tax matches produces the right total and the wrong shape, because the two have different bases and move differently with price and cost. The evidence is in the templates themselves: on the default project "Nigeria - PIA (2021)" collects 453.4354 million USD of tax inside a government cash flow of 687.4682, while "Generic Royalty/Tax" collects 422.8854 inside a take of 758.7514. A rate tuned to match one of those numbers misses the other completely.

## What the sandbox is for

The engine's own header says it plainly. This is not a second fiscal truth. The module's single source of truth for Nigerian fiscal math is the Petroleum Economics Studio engine, and this model exists to compare the shape of regimes against each other. A comparison of shapes is worth a great deal. A number lifted out of it and quoted as a tax liability is worth nothing.

## Exercise

Name the four tax fields, then list five things a real fiscal code does that none of them can express. For one of them, say what a modeller would do instead and what that ledger would get wrong.
