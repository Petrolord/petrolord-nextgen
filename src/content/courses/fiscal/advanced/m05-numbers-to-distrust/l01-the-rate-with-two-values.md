# Two names for two ratios

One result object holds two different ratios of the same government cash flow. Each carries its own name, definition and basis, and the two are easy to confuse.

{{panel:ec-comparison-explorer}}

## The two formulas

Government take divides government cash flow by revenue less opex less capex, which on the ledger is government cash flow plus contractor net cash flow. It is the headline, and the price sweep plots it. Government share of net revenue divides the same government cash flow by revenue less opex, with TOTAL CAPEX ADDED BACK to the contractor side, and the summary table shows it second. Both come back from one call to `runFiscalComparison`, both undiscounted by default. The summary's legacy key, `effectiveTaxRate`, still spells the second one as a tax rate.

At the deck's own first-year price of 70 USD per bbl on `cmp_all_templates_default_project`:

| regime | government take | government share of net revenue | difference, percentage points (derived) |
| --- | --- | --- | --- |
| Nigeria - PIA (2021) | 39.3855 | 30.6156 | 8.7699 |
| Generic Royalty/Tax | 43.4694 | 33.7901 | 9.6793 |
| USA - Gulf of Mexico | 43.8018 | 34.0485 | 9.7533 |
| Brazil - Concession | 64.2526 | 49.9455 | 14.3071 |
| Angola - Deepwater PSC | 72.4012 | 56.2797 | 16.1215 |
| Ghana - Deepwater | 75.4293 | 58.6335 | 16.7958 |

On the Designer's own two defaults, Concessionary (Royalty/Tax) reads 59.6210 as government take and 46.3452 as government share of net revenue, a difference of 13.2758, and the Designer's sample PSC regime, which the engine names "Nigerian PIA (PSC)" and whose values are illustrative samples, reads 72.7302 against 56.5354, a difference of 16.1948.

Neither number is wrong. They answer different questions, and the danger lies in reading one as the other.

## Government take's second problem

Government share of net revenue keeps capex in its denominator and stays positive on these cases. Government take has nothing added back, so its denominator can reach zero and go through it. Every government take point therefore carries a state: share, exceeds above 100 percent, or undefined with a null value where the pre-take net cash flow is not positive. Zero is never returned as a fallback.

On `cmp_never_recovers` every template is undefined at all nine prices, while the same run records government cash flow of 1021.2611 for Nigeria - PIA (2021) and 1662.7835 for Angola - Deepwater PSC, and government share of net revenue of 19.8259 and 32.2800.

Run the Angola template on the default project with every capex line multiplied by three: null, then 2223.0766, then 144.0692, then 85.6015 at the first four prices. Those are undefined, exceeds twice and an ordinary government take, in that order, each point flagged. Discounted at 10 percent the same regime's government take has no value, while its government share of net revenue reads 28.4191.

## The mistake

The careful mistake is treating the difference between the two numbers as movement. It is neither a change with price, a modelling error nor rounding. Both describe the same 25 years of the same ledger, and 8.7699 percentage points separate them for Nigeria - PIA (2021) because one keeps capex in the denominator and the other takes it out.

## What to do

Quote each number with its name and its basis, and before believing a government take read its state and the two totals underneath it. If lifetime contractor net cash flow is negative, the point is above 100 percent or has no value.

## Exercise

For Nigeria - PIA (2021) on `cmp_all_templates_default_project`, state government take and government share of net revenue at 70 USD per bbl and the difference, and say which keeps capex in its denominator. Then say what government take returns for that regime on `cmp_never_recovers`, with its state, and what government share of net revenue still reads there.
