# When nothing pays back

`paybackPeriod` is the first year cumulative contractor net cash flow rises above zero, and it is null when that never happens. A null is not a large number, and the verdict that reads it changes shape rather than reporting one.

{{panel:ec-comparison-explorer}}

## The sentence that changes

On `insights_never_pays_back` every `paybackPeriod` is null, and the payback verdict drops its heading from "Fastest capital recovery" to "Capital recovery" and reads: no regime pays back within the project life on these inputs. One sentence, with no year and no null rendered onto a screen as a blank.

The other four verdicts still fire. The contractor verdict still names "Alpha" at 150.0 million USD with an IRR of 22.0 percent, and the government verdict "Beta" at 900.0 million USD against 400.0 for "Alpha". Losing money does not stop a comparison being a comparison.

## The same shape on real templates

`cmp_never_recovers` puts capex 20000 against the TEST project's production, 30000 bbl/d of oil declining 12 percent with no gas and no NGL. Every `paybackPeriod` is null, every `rFactorPayoutYear` is null, and every IRR is null with the status no-root:

| rank | regime | npv | irr | paybackPeriod | govTake | effectiveTaxRate |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Brazil - Concession | -15354.6816 | null | null | 700.1194 | 13.5916 |
| 2 | Ghana - Deepwater | -15361.7226 | null | null | 712.5465 | 13.8328 |
| 3 | Generic Royalty/Tax | -15453.8510 | null | null | 875.1492 | 16.9894 |
| 4 | USA - Gulf of Mexico | -15701.7744 | null | null | 1312.7238 | 25.4842 |
| 5 | Nigeria - PIA (2021) | -15768.8129 | null | null | 1431.0440 | 27.7811 |
| 6 | Angola - Deepwater PSC | -15900.1132 | null | null | 1662.7835 | 32.2800 |

The contractor verdict names "Brazil - Concession" at -15,354.7 million USD, with no IRR because no rate from -99 to 1000 percent brings its NPV to zero, under a heading that reads best for the contractor. The government verdict names "Angola - Deepwater PSC" collecting the most, 1,662.8 million USD against 1,431.0 million USD for the next highest, "Nigeria - PIA (2021)". Both sentences are correct and both describe a catastrophe.

## What the government still collects

A project that never pays back is not a project the government walks away from. `never_recovers_huge_capex` runs capex 20000 on the test project and shows why: total revenue 7001.1938, total royalty 875.1492, total cost recovered 6126.0445, total profit oil 0.0000, total tax 0.0000 and total government cash flow 875.1492, against a total contractor net cash flow of -15724.0151. Profit oil never appears, so the tax stack never charges anything, and every dollar the government takes is royalty off the top.

## The null that is not a zero

Every IRR on that comparison is null, and `calculateIRRResult` says why: no rate from -99 to 1000 percent brings the NPV to zero, the status no-root. These cases printed 0.0000 percent until the 2026-09-15 repair, and a reader who took 0 for breaking even had it backwards. The published `irr_negative_root_reported` case has flows of -100 then 90 and reports the negative root itself, -10.0000 percent.

## What the engine refuses

It refuses to name a rate outside the band from -99 to 1000 percent, and it refuses to invent a payback year that never arrived. A negative rate inside the band it will report. Every refusal carries a status word, and the status is the part to read.

## The mistake

The careful mistake is sorting a comparison on IRR when every IRR is null, or reading a payback column of nulls as fast recovery. The sort here was by contractor NPV, and what it ranks is six ways of losing money.

## Exercise

From `never_recovers_huge_capex`, state total profit oil, total tax and total government cash flow, and say which single instrument produced the take. Then say what heading the payback verdict carries when no regime pays back.
