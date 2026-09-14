# The IRR that reports its clamp

The screening engine solves IRR by Newton iteration from 10 percent and clamps the guess at 1000 percent. When the iteration runs to the clamp, the engine as published reports the clamp as the rate (finding S1), including on a project that loses money.

{{panel:ec-risk-explorer}}

## Two fields, one rate

| field | npv | irr percent | payback | maxExposure |
| --- | --- | --- | --- | --- |
| NTEJE | -123.9923 | 1000.0000 | 20.0000 | -169.0209 |
| OKPOMA | 167.4389 | 1000.0000 | 0.0000 | -2.2287 |
| ISIALA | 81.0464 | 53.7148 | 3.2746 | -44.6035 |

NTEJE loses 123.9923 million USD at 12 percent, its cumulative ends at -154.5906, it never pays back, and its payback reports the project life of 20. OKPOMA is worth 167.4389. Both report 1000.0000 percent. The same rate stands on a project that destroys value and on one that creates it, and it makes the NPV of neither zero.

## Why the guard lets it through

The engine looks for an IRR only when the cash flow has at least one negative year and one positive year, and otherwise reports 0. OKPOMA earns 9.2498 in 2027, loses 11.4786 in 2028 and earns 57.8806 in 2029; NTEJE's cash flow changes sign too. Both pass the guard, Newton wanders to the clamp, and nothing checks that the last guess makes NPV zero. The guard asks whether the years differ in sign, never whether the NPV changes sign across the rates Newton visits, and for NTEJE no rate makes the NPV zero at all.

## The published clamp cases

| case | engine irr | what the golden records |
| --- | --- | --- |
| `irr_beyond_clamp`, ncf -1 then 100 | 1000.0000 | a root at 9900 |
| `tr_hand_2yr_depr2`, ncf -2.5 then 47.5 | 1000.0000 | a root at 1800 |
| `fdp_never_pays_back` | 1000.0000 | npv -92616.5020, never pays back |

The first two are the gentle form: a real root exists past the clamp. The third is the serious form, a project losing 92616.5020 million USD that reports the same rate, and NTEJE is that form on a teaching field.

## Round numbers are return codes

Three IRRs from this engine are what the solver hands back when it did not solve. 1000.0000 is the clamp. 10.0000 is the starting guess, returned when the derivative guard fires on tiny cash flows (finding S2, `irr_tiny_cash_flows_derivative_guard`, whose golden root is 21). 0.0000 is the answer with no sign change, which ISIALA's High scenario reports on an NPV of 237.8860 because none of its years is negative.

## The payback on the same field

OKPOMA carries a second defect, the payback re-crossing (finding EC3-1). Its cumulative is 9.2498 after 2027, so payback reads 0.0000; then the second capex half takes the cumulative to -2.2287 in 2028, and the payback is never revisited. A project under water in its second year reports that it paid back at once.

## The mistake

The careful mistake is a magnitude check. A reader who rejects 1000.0000 as absurd has caught it; a reader who ranks projects by IRR has put NTEJE at the top, and an IRR screen at any hurdle passes it. Read the NPV, the final cumulative and the sign of every year before the IRR, and treat 1000.0000, 10.0000 and 0.0000 as flags.

## Exercise

For NTEJE and OKPOMA, state the NPV, IRR and payback, and say for each whether the IRR is a rate its cash flow earns. Then explain from OKPOMA's first two cumulative values why its payback reads 0.0000.
