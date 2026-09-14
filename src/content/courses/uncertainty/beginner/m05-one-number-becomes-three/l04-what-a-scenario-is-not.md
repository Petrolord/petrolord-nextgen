# What a scenario is not

A scenario is one ledger run at chosen multipliers, and it carries no probability. ISIALA's Low scenario is worth -72.1531 million USD, and it is neither a percentile of anything nor a P90.

{{panel:ec-screening-explorer}}

## A corner, with no odds attached

Low sets price and production to 0.8 and capex and fixed opex to 1.2 at the same time. That is four inputs wrong against the project in the same run, a corner of the possible outcomes. How likely that corner is depends on whether low price, low volume and high cost tend to arrive together, and the scenario generator has no way to hold such a view. It answers "what if all of this happens", and never "how often".

## Beside a sampled range

The Scenario Builder also runs a Monte Carlo on ISIALA: 1000 iterations with price, capex and reserves each drawn within plus or minus 20 percent, at seed 20260829. Its NPVs take P-labels under the exceedance meaning, where P90 is the value the outcome meets or exceeds with 90 percent probability.

| reading | NPV |
| --- | --- |
| Low scenario | -72.1531 |
| Low case, P90 | 48.7439 |
| Base scenario | 81.0464 |
| Best case, P50 | 81.1835 |
| High case, P10 | 109.8980 |
| High scenario | 237.8860 |

The two Lows are far apart. The sampled run draws price, capex and reserves independently, one draw per year for each, so a bad draw on one is usually offset by an ordinary draw on the others, and the Low case P90 sits at 48.7439. The scenario forces every input bad at once and lands at -72.1531, well outside even the lowest of the 1000 sampled NPVs, 16.3054. The Base scenario and the Best case P50 are close, 81.0464 and 81.1835, but they are different quantities: one is a single run at the base inputs, the other the middle of a sample.

## The mistake

The careful mistake is to put the scenario table on a slide as "P90, P50, P10". That relabels -72.1531 as a value ISIALA beats nine times in ten, when no probability was ever computed for it. The reverse error has shipped before: the Scenario Builder's results panel once printed the p90 key, 109.8980, under "P90 (Conservative)", so the card called conservative held the larger number. A label needs a definition behind it, and a scenario has none.

## What it refuses

A scenario refuses to weight its cases. It does not model correlation: Low simply assumes every input goes wrong together. It samples nothing, and it never lets variable opex, royalty or tax move. It keeps the engine's other limits too: no economic limit, so Low still produces and charges all twenty years, which is why its payback reads 20.0000.

## Exercise

Write ISIALA's Low scenario NPV and its Low case P90, and explain why they differ. Then say what "P90" means for an NPV, and why it cannot be written on a scenario.
