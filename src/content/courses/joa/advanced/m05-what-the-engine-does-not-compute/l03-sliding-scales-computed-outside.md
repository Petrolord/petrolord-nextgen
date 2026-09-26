# Sliding scales computed outside

{{panel:joa-recovery-calculator}}

{{panel:joa-agreement-calculator}}

Many production sharing contracts do not give the contractor one profit share for the life of the field. The share slides with a measure of the field's performance: a daily rate of production, or an R-factor that compares what the contractor has received with what it has spent. The engine computes no such scale. It takes the share each year as stated, and the scale that sets it is worked outside.

## Where the scales come from

The IMF's Fiscal Analysis of Resource Industries (FARI) Methodology, TNM/16/01 (February 2016, read from the Wayback capture of 12 October 2025 on 2026-09-26) sets out a PSC with a daily-rate scale in its Table 11 and prints the resulting profit sharing year by year in Table 13. The course reads those tables for their figures and teaches the scale itself by concept only.

## A share per year

The engine's `pscCostRecovery` takes one stated contractor share for the contract, and lets any year state its own. Its basis says so:

> contractorProfitSharePct applies to every year that does not state its own (a year's own figure carries a sliding scale, e.g. by daily rate or R-factor, computed outside)

The golden case built on the IMF tables states a share for each producing year, read from Table 13:

| year | stated share |
| --- | --- |
| 2003 | 60 |
| 2004 | 56 |
| 2005 | 42 |
| 2006 | 46 |
| 2007 | 49 |
| 2008 | 52 |
| 2009 | 55 |
| 2010 | 56 |
| 2011 | 58 |

With those shares the engine reproduces the printed profit split within the printed precision: the largest difference is 1.560000, because Table 13 prints the government share as a whole percent.

## What the engine checks

A stated share must be a percentage. A year that states 120 is refused by name:

> years[0].contractorProfitSharePct must be a number from 0 to 100; got 120

The engine does not check that a year's share follows from any scale. That link is the contract's, and whoever computes the scale owns it. A report that quotes a PSC figure from a year with its own share names the scale and the measure that set it.

## Why the scale stays outside

A daily-rate scale needs the rate of production by day; an R-factor scale needs cumulative receipts and costs, which depend on the profit shares of earlier years. Each contract defines its own tranches, its own measure and its own timing. Computing them inside the engine would mean choosing among those definitions, and the engine makes no choice a contract does not state. Fiscal regime design, including why a regime uses a sliding scale at all, belongs to the fiscal regime course.

## Exercise

Open the recovery calculator on the view "PSC cost recovery" and start from "IMF FARI Tables 12 and 13". Read the contractor share column for each year and compare it with the table above. Read the basis note on the share. Then open the agreement calculator on the view "PSC cost recovery", start from "The Ekene PSC variant", and in the box add `"contractorProfitSharePct": 50` to the 2033 year. Read the 2033 row: which lines changed, and which stayed the same. Then state 120 for that year and read the refusal, which names the year's position in the list.
