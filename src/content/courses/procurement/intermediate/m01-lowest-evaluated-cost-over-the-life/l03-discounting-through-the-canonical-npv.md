# Discounting through the canonical NPV

{{panel:pr-award-calculator}}

The life-cycle cost is one figure in the evaluated cost, and it is built from five. This lesson opens it year by year on MS4, the bid with the dearest valve maintenance of the four responsive materials bids, so that you can check the engine's figure with a calculator of your own.

## End-of-year discounting

Each year's cost is discounted to the award date from the end of its year. The factor for year n is 1 / (1 + 0.1) raised to n. MS4 pays 7000.000000 a year for five years:

| year | factor | MS4 valve maintenance | discounted |
| --- | --- | --- | --- |
| 1 | 0.909091 | 7000.000000 | 6363.636364 |
| 2 | 0.826446 | 7000.000000 | 5785.123967 |
| 3 | 0.751315 | 7000.000000 | 5259.203606 |
| 4 | 0.683013 | 7000.000000 | 4781.094188 |
| 5 | 0.620921 | 7000.000000 | 4346.449261 |

The five discounted figures sum to the engine's life-cycle cost for MS4, 26535.507386. The factors in the table are derived arithmetic printed so you can follow the working. The engine itself does not print them; it hands the stream of annual costs to the canonical npv function and returns the sum.

Read the last column from the top. The same 7000.000000 costs less in present terms each year it is pushed back. By year 5 it counts for 4346.449261. That is the whole reason a life cycle is discounted: money paid later is worth less at the award date, at the stated rate.

## Why the end of the year

The engine's basis names the convention in words: "end-of-year discounting". A different convention, mid-year or start-of-year, would give every year a larger factor and a larger life-cycle cost. The course quotes the figure the engine returns, with the convention it states, and a report that quotes a life-cycle cost names the years, the rate and the convention beside it.

## One implementation of discounting

The engine discounts through the npv function of engines/economics/cashflow.ts. It does not carry a second copy of the arithmetic, and neither does this course. The reason is practical. When two parts of a platform each discount a stream in their own code, they can disagree by a convention nobody wrote down, and the disagreement surfaces in front of a tender board. With one function, a life-cycle cost here and a discounted cash flow in the economics courses follow the same rule.

That seam runs both ways. How to choose a discount rate, and what it means for a company's cost of capital, belong to the economics courses. In this course the rate is a stated input, 0.1 on the materials tender, and the evaluation quotes it.

## What the life cycle does to MS4

MS4's corrected price is the lowest of the four responsive bids, and its maintenance is the dearest. Discounted at 0.1, the maintenance adds 26535.507386 to its evaluated cost. MS3, the other extreme, adds 18953.933847. The discounting does not reverse the order on this tender, which the fifth lesson of this module shows; it narrows the gaps.

## Exercise

Open the award calculator on the view "Evaluated cost with a life-cycle cost". In MS4's annualCosts, replace the five entries with 7000 in year 1 and 0 in years 2 to 5, and read MS4's life-cycle cost: it should equal the first row of the table above. Then move the 7000 to year 5 alone and compare with the last row. Put MS4's five costs back to 7000 each, change the years to 5 and the rate to 0, and explain in one sentence why the life-cycle cost is now the plain sum.
