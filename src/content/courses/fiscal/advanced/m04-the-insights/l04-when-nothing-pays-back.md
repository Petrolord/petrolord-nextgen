# When nothing pays back

`paybackPeriod` is the first year cumulative contractor net cash flow rises above zero, and it is null when that never happens. A null is not a large number, and the verdict that reads it changes shape rather than reporting one.

{{panel:ec-comparison-explorer}}

## The sentence that changes

On `insights_never_pays_back` every `paybackPeriod` is null, and the payback verdict drops its heading from "Fastest capital recovery" to "Capital recovery" and reads: no regime pays back within the project life on these inputs. One sentence, no year, no runner-up, and no null rendered onto a screen as a blank or a zero.

The other four verdicts still fire. The contractor verdict still names "Alpha" at 150.0 million USD with an IRR of 22.0 percent, and the government verdict still names "Beta" collecting 900.0 million USD against 400.0 million USD for "Alpha". Losing money does not stop a comparison being a comparison.

## The same shape on real templates

`cmp_never_recovers` puts capex 20000 against the TEST project's production, 30000 bbl/d of oil declining 12 percent with no gas and no NGL. Every `paybackPeriod` is null, every `rFactorPayoutYear` is null, and every IRR reads 0.0000:

| rank | regime | npv | irr | paybackPeriod | govTake | effectiveTaxRate |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Brazil - Concession | -15354.6816 | 0.0000 | null | 700.1194 | 13.5916 |
| 2 | Ghana - Deepwater | -15361.7226 | 0.0000 | null | 712.5465 | 13.8328 |
| 3 | Generic Royalty/Tax | -15453.8510 | 0.0000 | null | 875.1492 | 16.9894 |
| 4 | USA - Gulf of Mexico | -15701.7744 | 0.0000 | null | 1312.7238 | 25.4842 |
| 5 | Nigeria - PIA (2021) | -15768.8129 | 0.0000 | null | 1431.0440 | 27.7811 |
| 6 | Angola - Deepwater PSC | -15900.1132 | 0.0000 | null | 1662.7835 | 32.2800 |

The contractor verdict names "Brazil - Concession" at -15354.7 million USD with an IRR of 0.0 percent, under a heading that reads best for the contractor. The government verdict names "Angola - Deepwater PSC" collecting the most, 1662.8 million USD against 1431.0 million USD for the next highest, "Nigeria - PIA (2021)". Both sentences are correct and both describe a catastrophe.

## What the government still collects

A project that never pays back is not a project the government walks away from. `never_recovers_huge_capex` runs capex 20000 on the test project and shows why: total revenue 7001.1938, total royalty 875.1492, total cost recovered 6126.0445, total profit oil 0.0000, total tax 0.0000 and total government cash flow 875.1492, against a total contractor net cash flow of -15724.0151 and a closing unrecovered pool of 15724.0151. Profit oil never appears, so the tax stack never charges anything, and every dollar the government takes is royalty off the top.

## The zero that is not a rate

Every IRR on that comparison reads 0.0000, and `calculateIRR` returns 0 for two different reasons: the flows never change sign, or the NPV at a rate of zero is not above zero. The published `irr_npv0_negative` case has flows of -100 then 90, loses money at every rate, and reports 0.0000 percent with an NPV at 10 percent of -16.5289. A reader who takes 0 for breaking even exactly has it backwards.

## What the engine refuses

It refuses to report a negative internal rate of return, and it refuses to invent a payback year that never arrived. Both refusals are honest, and both look like small numbers on a chart axis that starts at zero.

## The mistake

The careful mistake is sorting a comparison on IRR when every IRR is 0.0000, or reading a payback column of nulls as fast recovery. The sort here was by contractor NPV, and what it ranks is six ways of losing money.

## Exercise

From `never_recovers_huge_capex`, state total profit oil, total tax and total government cash flow, and say which single instrument produced the take. Then say what heading the payback verdict carries when no regime pays back.
