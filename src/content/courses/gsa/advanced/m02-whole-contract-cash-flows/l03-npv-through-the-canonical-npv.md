# Present value through the canonical NPV

{{panel:gsa-contract-calculator}}

A gas sales agreement runs for years, and money in its tenth year is worth less today than money in its first. `gsaCashFlows` returns two present values: the NPV of the seller revenue and the NPV of the net after royalty. It computes neither itself. Both come from the canonical `npv` of `cashflow.ts` in the engines library, which this course imports and never restates.

## The convention

The engine's basis on the power plant states it:

> canonical npv from engines/economics/cashflow.ts, year-end flows discounted to 2026 at 0.1

Two terms set every NPV: the discount rate and the base year. Each year's flow is taken at the end of that year and discounted back to the base year. An NPV quoted without both terms says nothing, so the course quotes them beside every present value.

| agreement | discount rate and base year | NPV of the seller revenue | NPV of the net after royalty |
| --- | --- | --- | --- |
| Ekene power plant (synthetic) | 0.1 to 2026 | 81993119.091889 | 79963756.225663 |
| Ekene export feed (synthetic) | 0.1 to 2026 | 1,157,367,784.116539 | 1,099,781,259.486489 |

The export feed figures carry sixteen or more significant digits, so the course prints them with their thousands grouped by commas. The power plant figures rest on the fixture's held price of 2.18 US$ per MMBtu, the reported 2026 domestic base price held flat as a stated planning assumption, so its NPV is a statement about that assumption.

## A check at a rate of zero

At a discount rate of zero every discount factor is one, so the NPV is the plain sum of the rows. The course's golden small case (deep offshore, 40 percent in-country) shows it: the NPV of the seller revenue is 8400.000000, which is the plain sum of its rows, 8400.000000. That is the quickest check a reader can run on any NPV: set the rate to zero and add the column.

## What the NPV does not say

An NPV is a present value of the stated flows at a stated rate. It is no forecast and no valuation of the gas field. The flows are what the stated clauses produce on stated takes; the export feed price follows a stated formula on a synthetic oil index. Change the takes, the index or the rate and the NPV moves. The cash flow course teaches discounting, the choice of rate and the reading of a present value as subjects; this lesson only names the terms the engine takes.

## A refusal on the rate

A discount rate of minus one would divide by zero in every discount factor. The engine refuses it by name:

> discountRate must be a finite number above -1; got -1

## Exercise

Open the contract calculator on "The whole contract in money". It starts on the Ekene export feed at 0.1 to 2026. Read both NPV tiles. Set discountRate to 0 and check that the NPV of the seller revenue equals the sum of the seller revenue column. Restore 0.1 and move baseYear to 2027, and explain in one sentence why the NPV rises by the factor it does. Finally enter -1 and read the refusal.
