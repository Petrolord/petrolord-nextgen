# The royalty a template chooses

Five of the six templates use a flat royalty and one uses a sliding scale keyed on the oil price. The published totals show what each choice actually collected.

{{panel:ec-regime-explorer}}

## Five flat rates and one slider

The flat rates are Angola at 0 percent, Ghana at 5 percent, Brazil at 10 percent, the Generic template at 12.5 percent and the Gulf of Mexico at 18.75 percent. "Nigeria - PIA (2021)" slides on price, with tiers of 0 USD/bbl to 7.5 percent and 50 USD/bbl to 10 percent.

## What each collected

Total royalty over the life, on total revenue of 2686.9277 million USD for the default project and 7001.1938 million USD for the test project:

| template | default project | test project |
| --- | --- | --- |
| Nigeria - PIA (2021) | 268.6928 | 700.1194 |
| Ghana - Deepwater | 134.3464 | 350.0597 |
| Brazil - Concession | 268.6928 | 700.1194 |
| USA - Gulf of Mexico | 503.7989 | 1312.7238 |
| Angola - Deepwater PSC | 0.0000 | 0.0000 |
| Generic Royalty/Tax | 335.8660 | 875.1492 |

## The row worth staring at

The PIA line and the Brazil line are identical on both projects: 268.6928 million USD each on the default project and 700.1194 million USD each on the test project. Brazil is a flat 10 percent. The PIA slider has a top tier of 10 percent that applies from 50 USD per bbl upward.

The default project's deck prices oil at 70, 75 and 80 USD per bbl, and the test project's deck prices it at 80 USD per bbl. Every applied price in both fields is above the 50 USD per bbl threshold, so the slider sits in its top tier in every year of both projects and behaves exactly like a flat 10 percent. A sliding instrument that never slides is a flat one.

## The mistake

The careful reader sees `sliding_price` in a template and assumes the royalty must move. On these two published projects it never does, and a reader who tries to explain the PIA and Brazil results by their royalty difference is explaining a difference that does not exist. Contractor net cash flow on the default project is 406.2057 million USD under the PIA template and 912.1029 million USD under Brazil, and since both paid 268.6928 million USD of royalty, the whole of that gap comes from the other three fields.

Whether a slider slides is a property of the deck, not of the template. The only way to know is to read the applied price in each year against the tier thresholds.

## What the slider refuses

It keys on the oil price alone. Not the gas price, not the NGL price, not the production rate, not cumulative volume, not the R factor. And it reads the applied price for the year, so anything that changes the price changes the tier as well as the revenue.

## Exercise

Say which two templates collected the same total royalty on both published projects and explain why. Then name the one template whose royalty column is 0.0000 in every year and say what makes it the harsher regime for a contractor anyway.
