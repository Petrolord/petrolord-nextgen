# Government take beside government share of net revenue

One result object carries two ratios of the same government cash flow, and they have two names: government take, the headline, and government share of net revenue, the second number.

{{panel:ec-comparison-explorer}}

## Two definitions

Government take is government cash flow divided by the project's pre-take net cash flow, which is revenue less opex less capex, over the project life. It is the figure fiscal comparisons in the literature and in bid rounds quote, and it is what the price sweep plots. Government share of net revenue is government cash flow divided by revenue less opex, so capex is added back to the contractor side, and it is what the summary table's percentage column holds. Both are undiscounted unless a label names a rate; the summary also returns government take discounted at the project rate. At the deck's own first-year price of 70 USD per bbl on the default project:

| regime | government take, undiscounted | government share of net revenue, undiscounted | take minus share, percentage points (derived) | take over share (derived) |
| --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | 39.3855 | 30.6156 | 8.7699 | 1.286453 |
| Generic Royalty/Tax | 43.4694 | 33.7901 | 9.6793 | 1.286453 |
| USA - Gulf of Mexico | 43.8018 | 34.0485 | 9.7533 | 1.286453 |
| Brazil - Concession | 64.2526 | 49.9455 | 14.3071 | 1.286453 |
| Angola - Deepwater PSC | 72.4012 | 56.2797 | 16.1215 | 1.286453 |
| Ghana - Deepwater | 75.4293 | 58.6335 | 16.7958 | 1.286453 |

## Why they differ, exactly

The last column is the whole story. Revenue less opex is 2245.4841 million USD under every regime and capex is 500.0000, so government take is always government share of net revenue times 2245.4841 over 1745.4841, which is 1.286453, whatever the terms. The gap in points is the share times capex over the pre-take net cash flow, so it grows with the share: 8.7699 for Nigeria - PIA (2021), 9.6793 for Generic Royalty/Tax, up to 16.7958 for Ghana - Deepwater. No fixed offset between the two columns exists. A fixed ratio does, and only on one project: on the test project, with capex of 1000.0000, it is 1.240898.

## Where a royalty makes the second number matter

A royalty is charged on gross revenue from year 1, so a royalty-heavy regime collects whether or not the project makes a profit. On the published comparison with capex of 20000 the pre-take net cash flow is negative, and government take has no value for any regime, undiscounted or discounted. Government share of net revenue still reads: 13.5916 for Brazil - Concession, 16.9894 for Generic Royalty/Tax and 25.4842 for USA - Gulf of Mexico, three regimes whose government cash flow is 100.0000 percent royalty. Where profit is thin rather than gone, government take runs past 100 percent instead. On ODIDI, discounted at 12 percent, it reads 106.4788 for Brazil - Concession and 164.2571 for Angola - Deepwater PSC, both flagged exceeds, while the undiscounted government share of net revenue reads 27.5413 and 37.4463.

## The mistake

Treating the two numbers as one rate measured twice, or translating between them with a remembered offset. The gap is 8.7699 points for Nigeria - PIA (2021) and 16.7958 for Ghana - Deepwater on the same project at the same price. Quote each with its name and its basis, and read government take's state before quoting it at all.

## Exercise

Write both definitions. Give both values for Nigeria - PIA (2021) at 70 USD per bbl, the gap and the ratio, and say why Generic Royalty/Tax has the same ratio. Then say which metric still has a value on the comparison with capex of 20000, and why a royalty-heavy regime makes that the useful one.
