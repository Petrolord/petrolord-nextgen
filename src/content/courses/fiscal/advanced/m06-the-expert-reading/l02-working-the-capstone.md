# Working the capstone

A graded comparison is worked from the outside in: the project, then the instruments, then the summary, then each sweep at the range it actually ran, and only then the verdicts. Most wrong answers start at the verdicts.

{{panel:ec-comparison-explorer}}

## The project and the rate first

Write down the three streams with their declines, the capex lines, both halves of opex, the discount rate and every deck point before any regime is chosen. On ODIDI that is oil 8000 bbl/d declining 14 percent a year, gas 40 Mscf/d declining 9 percent and NGL 900 bbl/d declining 15 percent; capex of 260, 120 and 40 million USD; fixed opex 12 million USD a year and variable opex 4 USD per boe; a discount rate of 12 percent; and a deck of 45, 3 and 25 in year 1 stepping at year 6 and again at year 12. Every regime run on that project shares one total revenue, so any difference in the answers is the regime.

## The four instruments

Four fields and nothing else: the royalty, flat with a rate or sliding on the oil price; the cost recovery limit as a percent of revenue after royalty; the profit split, flat or tiered on the R factor; and the tax block holding CIT, RRT, the minimum tax and an `rrtUpliftPct` that defaults to 20 when the field is absent. A missing uplift is not a zero uplift, and the difference between those two readings is 1638.5664 against 2607.5549 of total tax on the published pair.

## Run it, then read the sort

The summary is sorted by contractor NPV descending and by nothing else. On ODIDI:

| rank | regime | npv | paybackPeriod | govTake | effectiveTaxRate |
| --- | --- | --- | --- | --- | --- |
| 1 | Brazil - Concession | -5.8662 | 6 | 232.9950 | 27.5413 |
| 2 | Generic Royalty/Tax | -13.3840 | 7 | 242.1194 | 28.6198 |
| 3 | Ghana - Deepwater | -27.4074 | 6 | 308.8447 | 36.5071 |
| 4 | USA - Gulf of Mexico | -37.3123 | 7 | 277.6679 | 32.8219 |
| 5 | Nigeria - PIA (2021) | -43.7842 | 7 | 312.9610 | 36.9937 |
| 6 | Angola - Deepwater PSC | -58.1813 | 8 | 316.7898 | 37.4463 |

Government cash flow does not follow that order: Angola - Deepwater PSC collects the most while sitting last, and government share of net revenue does not either, since Ghana - Deepwater reads 36.5071 in third place against 32.8219 for USA - Gulf of Mexico in fourth.

## Take each sweep at its real range

The price sweep is nine oil prices from 40 to 120 USD per bbl and it scales oil only. The capex sweep is seven points ending at 1.4, whatever its axis says. Quote the range you actually have: ODIDI's capex losses of 150.9021 for Ghana and 215.1075 for Angola are losses to a 40 percent overrun.

## Check every denominator

Before quoting any government take, read its state and the regime's total government cash flow and total contractor net cash flow. A negative contractor total means exceeds, and a sum that is not positive means null and undefined.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Project | Streams, declines, capex, both opex halves, rate, full deck |
| Instruments | Four fields per regime, uplift stated even when absent |
| Sort | Contractor NPV only; cash flow and both ratios read from their columns |
| Sweeps | Nine prices, oil only; seven capex points ending at 1.4 |
| Shares | State and two totals read under every plotted point |
| Verdicts | Ranked quantity quoted beside the rounded sentence |

Then the units: USD, bbl, Mscf, boe at 6000 scf per barrel, percent as a word, money as million USD, and years numbered 1 to 25.

## The mistake

The careful mistake is checking the instruments and skipping the ranges. Every rate on ODIDI can be read correctly and the resilience answer still be wrong, because the chart promised a multiplier the loop never reached. Ranges and definitions are where the marks are lost, not rates.

## Exercise

Work ODIDI in the order given: project, instruments, summary sort, both sweeps, then the verdicts. Name the regime with the highest contractor NPV and the one with the largest government cash flow, and say why they are not the same row.
