# Three numbers to distrust

The engine reports each of these with the same confidence as everything else. A reader who knows where they come from can use them; one who does not will be wrong in a way that looks careful.

{{panel:ec-fiscal-explorer}}

## The profile point at the applied rate

The NPV profile is reported at 0, 5, 8, 10, 12, 15 and 20 percent plus the applied rate, and the header says the applied point always passes through the headline NPV. On the nominal basis it does: jv_analytic_decision_kpis reads 21590909.09 at 10 percent against a headline of 21590909.09, gap 0.00. On the real basis the applied rate is the Fisher rate, 6.796117 percent, and the profile point is evaluated at that rate rounded to two decimals, 6.8.

| Case | Profile point at 6.8 | Headline at 6.796117 | Gap |
| --- | --- | --- | --- |
| AKATA | 72513070.98 | 72534830.66 | -21759.68 |
| multiyear_pia_real | 203209583.79 | 203250580.21 | -40996.42 |
| multiyear_jv_real | 88086010.81 | 88104639.00 | -18628.18 |
| allowance_cap_midyear | 2405993.72 | 2406447.46 | -453.74 |

The engine's own npv() at the exact rate returns the headline, 72534830.66 on AKATA, so the flows are right and only the labelled point is off. The gap is always negative, because 6.8 sits past 6.796117 and NPV falls with rate. Distrust the point; trust the headline.

## The IRR of a profile with two roots

The vector [-100, 208, -108.12] has an NPV of -0.120000 at 0 percent, -0.000000 at 2, 0.036982 at 4, 0.000000 at 6 and -0.102881 at 8. Two rates zero it. The engine reports 6.0000 percent; the oracle reports 2.0000. Both answer the question, and the header does not say which root is returned when there are several. The method statement does: Newton from 10 percent, so the root nearer 10 is found.

Terminal negatives are where this shape comes from. AKATA with a 60000000 lump sum in 2035 has flows ending in -29598201.95 and reports 23.2570 percent; with 200000000 the last flow is -169598201.95, the engine reports null, and the NPV is -40359955.35 at the applied rate and -58362170.82 at 0 percent, negative at every sampled rate. A kept uneconomic tail does the same on a smaller scale: elt_off_tail_kept ends on -9200000.00. Distrust an IRR whose vector changes sign more than once; read the profile instead.

## The sinking fund and the working interest

| Case | WI | Contributions | total_abandonment_cost | Unit technical cost |
| --- | --- | --- | --- | --- |
| pia_sinking_fund | 100 | 30000000.00 | 30000000.00 | 28.082192 |
| pia_sinking_fund_wi_50 | 50 | 15000000.00 | 30000000.00 | 29.726027 |
| jv_abandonment_wi_60 | 60 | not reported | 10000000.00 | 40.000000 |

The fund contribution is scaled by working interest and the lump sum is not: 15000000.00 collected against 30000000.00 reported on the fund, 10000000.00 charged in full against 60 percent flows on the lump sum. Distrust total_abandonment_cost as a statement of what the share paid. Under a fund the share paid the contributions; under a lump sum it paid the whole number.

## The mistake

The careful mistake is to reconcile. A reader who sees 72513070.98 on the profile and 72534830.66 in the headline assumes one is stale and reruns; one who can show that 2.0000 zeroes the NPV as well as 6.0000 assumes a broken root finder; one who sees 15000000.00 and 30000000.00 on one row assumes the fund was underfunded. Each number is exactly what its method produces. The method is the thing to distrust, and it is not printed beside the number.

## What the engine refuses

It refuses to evaluate the profile at the unrounded rate, to say which root it reported, and to reconcile the fund with the cost. None of those refusals is announced.

## Exercise

For each of the three numbers, write the one question that must be answered before the number can be used, and the row or KPI that answers it.
