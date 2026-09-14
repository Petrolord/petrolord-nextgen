# How each one is derived now

Five verdicts, five derivations. Each prints a rounded copy of a quantity the engine holds at full precision.

{{panel:ec-comparison-explorer}}

## npv, straight off the sort

The summary is sorted by contractor NPV descending, so the contractor verdict reads the first row. On ODIDI it names "Brazil - Concession" at -5.9 million USD with an IRR of 11.4 percent, and the row it read carries -5.8662 and 11.4055. Highest here means least negative: all six ODIDI regimes have a negative NPV at 12 percent.

## payback, the smallest year that exists

The payback verdict takes the smallest `paybackPeriod` that is not null and names another year beside it. On ODIDI it reads "Brazil - Concession" pays back in year 6, against year 8 for "Angola - Deepwater PSC". Those are the extremes of the ODIDI payback column, and three regimes share year 7 in between, so the runner-up in the sentence is the slowest, not the second fastest. Brazil is not alone in year 6 either: Ghana - Deepwater pays back in year 6 too, and the sentence names Brazil because it sits first in the summary.

## government, the largest take

This one reads `govTake` and names the next highest beside it. On ODIDI it names "Angola - Deepwater PSC" as collecting the most, against "Nigeria - PIA (2021)" as the next highest.

## capex, a difference across the sweep

The capex verdict works on contractor NPV given up between the first and last swept point. On ODIDI, Ghana - Deepwater runs 16.4714 down to -134.4307, a loss of 150.9021, and Angola - Deepwater PSC runs 10.9118 down to -204.1957, a loss of 215.1075. The sentence names Ghana as giving up the least at 150.9 million USD and Angola the most at 215.1 million USD.

## price, a climb across the sweep

The price verdict ranks a climb, the share at the last price minus the share at the first, over the longest run of swept prices at which every regime's point is a share. On ODIDI that run is the whole sweep: Ghana - Deepwater goes from 74.9711 to 76.9682, a climb of 1.9971, and the sentence calls it the most progressive, rising 2.0 percentage points. Only Nigeria - PIA (2021) also climbs, by 0.1968, while the climb for USA - Gulf of Mexico is -37.6994. Ghana wins on two percentage points because its lead clears the one point required, though nobody captures upside here.

## What the verdicts refuse

With a single regime the capex and price verdicts are omitted entirely, a ranking of one being no ranking, and the payback and government sentences drop their comparison clause. Only the price sentence ever names its range, and only when that range is shorter than the sweep.

## The mistake

The careful mistake is quoting the sentence's number as the ranked number. Every insight sentence rounds money and rates to one decimal place. On ODIDI the two government totals print as 316.8 and 313.0 million USD while the ranking used 316.7898 and 312.9610, and when two quantities print the same the sentence has told you nothing.

## Exercise

Name the two ODIDI swept endpoints for Ghana - Deepwater, the loss they give, and the rounded figure the sentence prints. Then name the two verdicts that disappear when only one regime is compared.
