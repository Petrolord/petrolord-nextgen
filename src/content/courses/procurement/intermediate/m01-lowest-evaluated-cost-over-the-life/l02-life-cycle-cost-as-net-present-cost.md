# Life-cycle cost as a net present cost

{{panel:pr-award-calculator}}

A valve is bought once and maintained for years. Two bidders can quote the same price for the valves and very different prices for keeping them working. The life-cycle cost puts those later years into the comparison.

## The rule the engine applies

The engine states its life-cycle rule in its basis, verbatim, for the materials tender:

> net present cost of 5 years of annual costs at 0.1 a year, end-of-year discounting, residual value credited in the last year, through engines/economics/cashflow.ts npv (World Bank Procurement Regulations (7th ed.) Annex X paras 3.7 and 3.8)

That sentence fixes four things: the years, the discount rate as a fraction a year, discounting from the end of each year, and a residual value credited in the final year. The citation is the World Bank Procurement Regulations for IPF Borrowers, Seventh Edition, September 2025, Annex X paras 3.7 and 3.8, read on 2026-09-26.

The result is a net present cost: the sum of the future annual costs, each brought back to the award date. The engine adds it as the last term of the evaluated cost, after the corrected price, the discount, the priced deviations, the omissions and the schedule adjustment.

## The materials tender's life cycle

Each materials bid prices five years of valve maintenance after delivery. The fixture gives each bid a flat annual figure:

| bid | annual valve maintenance, years 1 to 5 | life-cycle cost at 0.1 |
| --- | --- | --- |
| MS3 | 5000.000000 | 18953.933847 |
| MS2 | 5500.000000 | 20849.327232 |
| MS1 | 6000.000000 | 22744.720616 |
| MS4 | 7000.000000 | 26535.507386 |

MS4 has the lowest corrected price among the four responsive bids and the dearest maintenance. MS3 is the other way round. The life cycle narrows the distance between them, and the next lesson shows each discounted year.

## What is discounted and what is not

The award price is paid at the start, so the engine does not discount it. Only the annual costs of years 1 to 5 are discounted. Discounting the purchase price too builds a different figure.

## Why the course imports the discounting

This course does not teach discounting. The engine discounts through the canonical npv function of engines/economics/cashflow.ts, the platform's one discounting function, and it carries no discounting code of its own. The economics courses own the theory of the discount rate; this course states the rate as an input and quotes the result.

## Two refusals

The life cycle is an input with rules, and the engine refuses a bad one by the field it names. A life cycle of zero years:

> lifeCycle.years must be a whole number from 1 to 100

A bid that gives four annual costs for a five-year life cycle:

> bids[0].annualCosts must be an array of 5 finite numbers, one per life-cycle year

The second refusal matters: padding a missing year with zero would lower that bid's evaluated cost for a year the bidder never priced.

## Exercise

Open the award calculator on the view "Evaluated cost with a life-cycle cost". Read the life-cycle cost column for the four materials bids and match it to the table above. Set the life-cycle years to 0 and read the refusal. Put the years back to 5, then delete one entry from MS1's annualCosts and read the refusal the engine returns for that bid. Restore it, and finally change the discount rate from 0.1 to 0.05 and record, in your own notes, which bid's life-cycle cost rises the most and why.
