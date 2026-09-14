# What a portfolio model cannot tell you

A portfolio model answers the question it was built for: which whole projects, under one limit, maximise risked value, and how widely that value could fall under one average correlation. Everything else about the projects lies outside its answers, however carefully it is run.

{{panel:ec-governance-explorer}}

## Whole projects, one period

Projects are funded whole. At a limit of 750.0000, OKONO funds OK-1 + OK-2 + OK-3 + OK-4 + OK-5 for 690.0000 and leaves 60.0000 unspent, because OK-6 costs 310.0000 and cannot be taken in part. A farm-down or a phased start does not exist for the engine.

Capex is spent in one period and never phased. There is no time value beyond the NPVs entered: a quick payback and a slow one are compared only through the NPV typed for each.

## One correlation, one shape

Correlation is one average number. OKONO's 600.0000 set reads P(loss) 0.001800 at rho 0.000000 and 0.059000 at rho 1.000000, as its stdDev widens from 143.8374 to 239.8888. Every pair of projects carries the same rho, so two that share a facility look like two that share nothing.

The success spread is normal. OK-3 is entered with an npv_p10 of 700.0000 and an npv_p90 of 210.0000 around 420.0000, lopsided upward, and the engine replaces them with one symmetric spread of 191.1747.

## The AFE's own limits

The AFE plan is a straight line. OFON-1's Planned line climbs by the calendar alone, 2507947 at Mar 27 and 5284603 at Apr 27, whatever the rig and the crews actually do.

Earned value is only as good as the progress typed in. OFON-1 earns 15231500 because someone typed 72.0000 percent for DRL-01 and 55.0000 percent for CMT-03. Its CPI of 1.009377 and SPI of 0.872063 inherit those entries, and nothing in the engine checks them.

## What its numbers do say

OKONO's 450.0000 set reports a P(loss) of 0.123600 and a Low case P90 of -18.3574 at seed 20260829 and 10000 iterations. That is the share of this model's draws that lose money, under whole funding, one correlation and a normal spread. Whether the company loses money depends on whether those assumptions hold, and the model has no way to test any of them.

## The mistake

The mistake is turning a model property into a conclusion. A set with a P(loss) of 0.001800 is safe only under a correlation of 0, and the same set reads 0.059000 when its projects move together. A CPI above 1 measures spending against progress someone typed. Name the assumption beside every number that depends on it.

## Exercise

Name the seven properties of the portfolio and AFE models that no run can change. Then pick two OKONO numbers and one OFON-1 number, and write beside each the assumption it depends on.
