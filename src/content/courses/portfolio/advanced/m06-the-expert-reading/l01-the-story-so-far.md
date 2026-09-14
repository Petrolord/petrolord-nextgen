# The story so far

This tier makes one argument: a portfolio's risk and an AFE's shares become decisions only when the simulation is seeded, the refusals and flags are read, and the numbers that cannot be trusted are known by name.

## Risk by simulation

Before EC5-0 the risk summary used a normal approximation, and on small risked portfolios it failed:

| case | exact P(loss) | normal approximation P(loss) | engine P(loss) | exact P90 outcome | normal P90 | engine P90 |
| --- | --- | --- | --- | --- | --- | --- |
| singleWildcat | 0.700000 | 0.365832 | 0.696100 | -50.0000 | -150.5560 | -50.0000 |
| identical6 | 0.117649 | 0.200464 | 0.118100 | -300.0000 | -173.5074 | -300.0000 |

The single wildcat's normal P90 of -150.5560 lay below its worst possible outcome of -50.0000, a low case no portfolio could reach. The engine now draws success and failure at seed 20260829 and 10000 iterations by default, and its Low case P90 is an outcome that can happen.

## Correlation

One average correlation widens the spread and never moves the mean. OKONO's 600.0000 set has a stdDev of 143.8374 at rho 0.000000 and 239.8888 at rho 1.000000, an emv of 402.7500 throughout, and a P(loss) that climbs from 0.001800 to 0.059000. The Suite slider stops at 0.9.

## Shares

OFON-1's partners hold 75.0000 percent: Ofon Energy 40.0000, Enang Petroleum 22.5000 and Mfem Resources 12.5000. The operator carries the remaining 25.0000 percent, a share of 6762500 of the 27050000 budget. A negative interest, or a total over the whole, returns valid false with the engine note, and the allocation is still shown.

## Refusals and flags

A negative capex throws PortfolioInputError and negative progress throws AfeInputError, each naming the item, and an as-of date that is not a real date is refused as well. The grid overshoot is flagged: gridOvershoot funds 6002.0000 against 6000.0000 and reports overLimitBy 2.0000. The undershoot (D4) and the free project charged a cell (D2) are not flagged.

## Numbers to distrust

CPI reads 1.000000 whenever actuals are 0. An invoice with a null date counts from 1970. OFON-1's plan ends at 24452483, 2597517 short of its budget. OKONO's 450.0000 set reads P(loss) 0.123600 at 10000 iterations on the default seed and 0.119100 to 0.128500 across seeds 1 to 3: a seed is reproducibility, iterations are precision, and neither is truth.

Under all of it sit the properties no run changes. Projects are funded whole, capex is never phased, correlation is one number, the success spread is normal, the AFE plan is a straight line, and earned value is only as good as the progress typed in.

## Exercise

Give the single wildcat's exact, approximated and simulated P(loss), and say what was wrong with the old P90. Then state the stdDev of OKONO's 600.0000 set at rho 0 and at rho 1 with its emv, give OFON-1's operator share, and name one number for each of the five engine findings left unrepaired.
