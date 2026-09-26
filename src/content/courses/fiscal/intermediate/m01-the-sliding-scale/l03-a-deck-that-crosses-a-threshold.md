# A deck that crosses a threshold

A deck that steps moves the price in one year and not the next, so the royalty rate changes inside the life of one field, and the year it changes need not be the year the deck steps.

{{panel:ec-instrument-explorer}}

## One field, two rates

The teaching field ODIDI holds 45 USD per bbl through year 5 and steps to 65 at year 6. Under the tiered teaching regime's royalty, whose tiers are 0 USD/bbl at 7.5 percent and 50 USD/bbl at 10 percent, the deck step carries the price across the 50 threshold:

| year | grossRevenue | royalty | implied rate |
| --- | --- | --- | --- |
| 4 | 88.6543 | 6.6491 | 0.075000 |
| 5 | 76.1939 | 5.7145 | 0.075000 |
| 6 | 93.9859 | 9.3986 | 0.100000 |
| 7 | 80.7830 | 8.0783 | 0.100000 |
| 8 | 69.4353 | 6.9435 | 0.100000 |

Two things move in year 6 and they compound. Gross revenue rises from 76.1939 to 93.9859 million USD even though the oil volume is falling, because the deck lifted the price, and the rate rises from 0.075000 to 0.100000. The royalty rises from 5.7145 to 9.3986, more than the revenue move alone would give. From year 7 the volume decline takes over again, revenue falls to 80.7830 and then to 69.4353, and the rate holds at 0.100000 in both years. The rate applies to the whole of gross revenue, gas and NGL included, though only the oil price chose it.

The "Nigeria - PIA (2021)" template moves in year 6 as well, for another reason. Its implied rate is 0.050000 in year 5 and 0.052163 in year 6, because a royalty by price starts once 65 USD passes that year's low benchmark of 62.17 USD, read on the Regulations (2021) base, the engine default.

## When the deck steps and the royalty does not

`sliding_royalty_price_deck_crossing` makes the point sharply. The Designer's three-point deck runs 70 USD per bbl, 75 from year 5 and 80 from year 10, against the Designer's sample PSC regime, whose values are illustrative samples: royalty 60 USD/bbl at 12.5 percent and 80 USD/bbl at 15 percent.

| year | grossRevenue | royalty | implied rate |
| --- | --- | --- | --- |
| 4 | 197.5024 | 24.6878 | 0.125000 |
| 5 | 191.1513 | 23.8939 | 0.125000 |
| 6 | 171.8074 | 21.4759 | 0.125000 |
| 7 | 154.4254 | 19.3032 | 0.125000 |
| 8 | 138.8057 | 17.3507 | 0.125000 |

The deck steps at year 5, from 70 to 75, and the rate does not move, because 75 has not reached 80. The rate holds at 12.5 percent until year 9 and becomes 15 percent from year 10, when the deck reaches 80. Over the life the case charges 360.1731 million USD of royalty and closes with contractor net cash flow of 475.9901, government cash flow of 1269.4940 and an NPV of 169.7176 at 10 percent, with payback in year 4.

## The mistake

The plausible wrong reading is that the royalty steps whenever the deck steps. It steps when the applied price reaches a threshold, and a deck can step twice between two thresholds. On the published case the deck has three points and the royalty has two rates, and only one of the deck's two steps moves anything. The test is cheap: divide royalty by gross revenue either side of the step and read both ratios against the thresholds.

## What it refuses

The deck is a step function held by `getPriceForYear`, and it never interpolates and never escalates past its last point. ODIDI's deck reaches 85 at year 12 and holds 85 through year 25. Neither carries an inflation term, and neither can be told to change on a date.

## Exercise

Name the year ODIDI's implied rate changes and say why it is also a deck year. Then name the year the published crossing case changes rate, and say why it is not year 5.
