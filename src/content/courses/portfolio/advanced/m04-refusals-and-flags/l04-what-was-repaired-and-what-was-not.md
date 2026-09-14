# What was repaired and what was not

EC5-0 repaired the portfolio and AFE engines and the Suite apps that call them. It left five engine findings and two app items as they were, and those are properties of the tools as published, to be read around on every answer.

{{panel:ec-governance-explorer}}

## Repaired, with what each now returns

| repaired in EC5-0 | what the engine now returns |
| --- | --- |
| risk summary | a seeded Monte Carlo, seed 20260829, 10000 iterations by default |
| overshoot flag | gridOvershoot: overLimit true, overLimitBy 2.0000 |
| negative capex | PortfolioInputError naming the project |
| as-of date | OFON-1 SPI 0.872063 as of 2027-08-15 |
| SPI null | null on 2027-01-15 and on the start day 2027-02-01 |
| S-curve bounded | 10 points, Feb 27 to Nov 27 |
| one forecast rule | OFON-1 EAC 27600000, variance -550000 |
| negative progress | AfeInputError naming the line |
| negative working interest | valid false, the engine note |

The Suite repair removed the invented partners and integrations, added the AFE dates, put one EAC rule on every screen, and shows the grid resolution and the overshoot.

The risk summary is the largest repair. Before EC5-0 it used a normal approximation. On the published single wildcat that approximation gave a loss probability of 0.365832 against an exact 0.700000, and a P90 of -150.5560, below the worst possible outcome of -50.0000. The simulation returns 0.696100 and a P90 of -50.0000. The approximation is now history, and the seed is shown with every answer.

## Left in the portfolio engine

The grid undershoot (finding D4) is not flagged: gridUndershoot funds X + Y + Z at 660.0000 where the exact optimum is 860.0000. A free project is still charged one cell (finding D2). At a limit of 0.0000 a project with capex 0.0000 and EMV 10.0000 is not funded. At a limit of 100.0000 beside a project costing 100.0000 it is dropped, a gap of -10.0000, and only at 101.0000 does it fit. Both bite where rounding or a zero capex meets a tight limit, and neither says so on the result.

## Left in the AFE engine

CPI reads 1.000000 whenever actuals are 0: OFON-1 with every actual set to 0 still earns 15231500 and reports CPI 1.000000, the number an AFE exactly on budget would show. An invoice with a null date counts from 1970 and so sits in every bucket: in the published case an invoice of 200 with a null date puts an Actual of 200 on the first point. The S-curve plan stops short: OFON-1's last Planned point is 24452483 against a budget of 27050000, 2597517 short.

## Left in the Suite app

The correlation slider stops at 0.9, while the engine accepts 1. OKONO's 600.0000 set reads a stdDev of 239.8888 and a P(loss) of 0.059000 at rho 1.000000, against 232.0795 and 0.049500 at rho 0.900000, so the most correlated case cannot be set from the screen. Read the slider's top value as the app's limit, never as the engine's. The app's risk score is unused: no number the engine returns depends on it, and changing it changes nothing.

## The mistake

The mistake is hearing "repaired" as "trustworthy". The repairs make the engines state their conditions: a seed, a date, a rule, a flag. They remove none of the findings left, and a result can carry every repair and still hide D2, D4, a CPI of 1.000000 before spend, an invoice dated 1970 or a plan that ends short. The other mistake is working around a finding silently. Put it in the answer, for example: overLimit false, and D4 is not flagged on this grid.

## Exercise

List four repairs with the number or message each now returns. Then name the five engine findings left and the two app items, and give one published number that shows each engine finding.
