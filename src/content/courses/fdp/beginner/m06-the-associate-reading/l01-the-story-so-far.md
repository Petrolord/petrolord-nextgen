# The story so far

A field development plan is a set of numbers that have to agree with each other, and the Associate tier is about knowing which number each answer came from.

## What a plan holds, and what it will not guess

One field: its reserves, one or more development concepts, the wells and facilities each concept implies, a schedule, a cost breakdown, a risk register and the economics those imply. The studio holds them together and re-derives none of them: a figure typed into it is only as good as the work behind it, and a figure it does not carry is refused by name. A concept with no capex stops with FdpInputError: "the concept carries no capex: enter a drilling, facilities or subsea capex".

## Reserves, one total per fluid

| fluid | unit | rows | sum of P90 | sum of P50 | sum of P10 |
| --- | --- | --- | --- | --- | --- |
| Oil | MMbbl | 2 | 80.0000 | 130.0000 | 205.0000 |
| Gas | Bcf | 1 | 40.0000 | 70.0000 | 110.0000 |

Oil is 130.0000 MMbbl at P50 and gas is 70.0000 Bcf. Adding them gives 200.0000 of nothing, because the two are different substances measured in different units. Each column is an arithmetic sum within one fluid, and a sum of P90s is not the P90 of the sum: the low cases add only if every reservoir disappoints at once.

## Concepts and their capex

A concept carries drilling, facilities and subsea capex in three separate fields, and the engine reads all three. The FPSO concept holds 520.0000, 1350.0000 and 380.0000, which is 2250.0000 million USD, and over 20.0000 years of operating cost at 95.0000 a year its lifecycle is 4150.0000. The tie-back holds 730.0000 of capex and a lifecycle of 1330.0000. Each concept implies a screening production shape, a plateau at its peak rate and then a decline of 0.900000 a year, and each is dated from its own sanction date.

## What a scenario is worth

At 70.0000 USD a barrel the FPSO concept returns an NPV of 2015.4123 million USD, no rate of return at all at the status multiple-roots, and a payback of 3.8273 years, post royalty and tax, discounted mid year on default terms of 12.5000 percent royalty, 30.0000 percent tax and a 10.0000 percent discount rate. At 18.0000 USD a barrel the same concept returns -1834.1220, never pays back, and has no rate of return at all.

## The plan's own money

Seven cost items total a CAPEX of 2250.0000 and an OPEX of 95.0000 a year, and the ABEX line of 260.0000 sits outside both totals and is charged as the plan's end-of-life cost in production year 20, which is what leaves the case with two rates that zero it and none to report. The plan and the concept agree at 2250.0000 here because the plan was costed against the concept. A complete plan scores 100 percent on 9 of 9 sections; a plan missing its economics scores 89 percent and names what is missing.

## Exercise

State the P50 oil and gas figures with their units and say why they are never added. Then give the FPSO concept's three capex fields and their total, and the NPV, rate of return and payback that total earns at 70.0000 USD a barrel.
