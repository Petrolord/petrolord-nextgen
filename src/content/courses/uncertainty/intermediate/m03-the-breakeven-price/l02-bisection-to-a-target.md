# Bisection to a target

`solveBreakevenPrice` finds the price by halving a bracket from 0 to 500 USD/bbl until the price that meets the target NPV is pinned between its ends.

{{panel:ec-breakeven-explorer}}

## The search

The solver first prices the top of the bracket. If NPV at 500 USD/bbl is below the target, it returns null and stops. Otherwise it sets a low end of 0 and a high end of 500 and repeats one step a fixed number of times: price the midpoint, and if its NPV is below the target the midpoint becomes the new low end, otherwise the new high end. It returns the middle of the final bracket.

For ISIALA at the stated medians the top check reads 1552.6414 million USD, far above a target of 0, so the search runs. The first midpoint is 250. NPV there is positive, because it is already 311.7558 at 150 and only rises with price, so 250 becomes the high end. Each step halves the bracket again, and the answer is 71.6277 USD/bbl.

## Why bisection

Newton's method would need the slope of NPV against price, and that slope changes abruptly at every price where a year starts paying tax. Bisection needs two facts only: NPV never falls as price rises, and the answer lies inside the bracket. Given those, every halving keeps the answer inside and the search cannot overshoot. It spends more NPV evaluations than a cleverer method, each one a full twenty year ledger, and it is never wrong about which side the answer is on.

## The published solves

| case | the case | engine | golden |
| --- | --- | --- | --- |
| solve_base_npv0 | capex 1000, opex 60, efficiency 0.9 | 175.1500 | 175.1500 |
| solve_capex_1300 | capex 1300 | 215.5109 | 215.5109 |
| solve_opex_75 | opex 75 | 185.3034 | 185.3034 |
| solve_efficiency_95 | efficiency 0.95 | 165.9316 | 165.9316 |
| solve_no_fiscal | royalty and tax at zero | 128.0295 | 128.0295 |
| solve_single_year | a one year profile | 50.7937 | 50.7937 |
| solve_free_project_zero | no capex and no opex | 0.0000 | 0.0000 |

The engine matches every closed-form golden price to four decimals. More capex and more opex raise the price; more efficiency lowers it. The free project shows the low end of the bracket at work: NPV at 0 USD/bbl is already non-negative, every midpoint becomes the new high end, and the bracket collapses onto 0.0000.

## What it refuses

It refuses to say how close it got. The result carries no tolerance and no step count, only a price. It refuses to look past 500 USD/bbl. And it trusts that NPV rises with price without ever testing it; it relies on the case being built so that it must.

## The mistake

The mistake is interpolating a breakeven from a price table and blaming the engine for the gap. ISIALA's NPV is -6.5653 at 70 and 33.6477 at 80, and a straight line between those points reads a slightly higher price than the solved 71.6277. The line is not the curve: year 13 starts paying tax at 74.6504, inside that interval, and below that kink the NPV climbs more steeply, so the true crossing comes a little earlier than the line says. The second mistake is reading a returned 0.0000 as a failure. For a project worth something at any price it is the correct answer.

## Exercise

Describe the first step of the search on ISIALA and say why 250 becomes the high end. Give the engine price for solve_capex_1300, solve_opex_75 and solve_efficiency_95, and the direction each moves from 175.1500. Then explain why solve_free_project_zero returns 0.0000 and what that number does not mean.
