# The NPV profile

The profile is the same ledger read at seven rates, plus one point at the applied rate that the engine evaluates slightly wrong.

{{panel:ec-time-explorer}}

## What it shows

| rate, percent | AKATA | multiyear_jv_real |
| --- | --- | --- |
| 0 | 117362408.71 | 127186476.88 |
| 5 | 83023565.60 | 97123771.48 |
| 8 | 65968275.69 | 82498878.86 |
| 10 | 55805775.02 | 73886720.50 |
| 12 | 46487466.07 | 66059329.47 |
| 15 | 33900281.71 | 55594686.82 |
| 20 | 16026160.80 | 40957498.08 |

The profile is evaluated on the flows the basis selects. Both fields are on the real basis, so the 0 percent point is the total real net cash flow: 117362408.71 for AKATA, and 127186476.88 for multiyear_jv_real, which is also the last value of its cumulative cash flow. A conventional project falls monotonically along the profile, and the rate at which it would reach zero is its IRR. AKATA is still 16026160.80 at 20 percent, and its IRR is 29.2361 percent, beyond the last sampled point.

The profile is the reader's sensitivity to the discount rate in one glance. From 5 to 10 percent AKATA falls from 83023565.60 to 55805775.02; from 15 to 20 it falls from 33900281.71 to 16026160.80. The steps shrink because the rows most exposed to the rate have already been reduced.

## The applied point

The engine adds one point at the applied rate, and its header says that point always equals the headline NPV. On a nominal basis it does. jv_analytic_decision_kpis has an applied rate of 10.000000 percent, a profile point labelled 10 percent of 21590909.09 and a headline of 21590909.09, gap 0.00. multiyear_pia_nominal reads 203250580.21 at both, gap 0.00.

On a real basis it does not. The engine labels and evaluates the point at the applied rate rounded to two decimals. AKATA's applied rate is 6.796117 percent; the profile point is labelled 6.8 and reads 72513070.98; the headline is 72534830.66. The gap is minus 21759.68 USD. The engine's own npv() at the exact 6.796117 percent on the same flows returns 72534830.66, so the headline is right and the profile point is the one at the wrong rate.

| case | point labelled 6.8 | headline at 6.796117 | gap |
| --- | --- | --- | --- |
| AKATA | 72513070.98 | 72534830.66 | -21759.68 |
| multiyear_pia_real | 203209583.79 | 203250580.21 | -40996.42 |
| multiyear_jv_real | 88086010.81 | 88104639.00 | -18628.18 |
| multiyear_pia_midyear_real | 196633975.59 | 196677221.27 | -43245.68 |
| pia_loss_relief | -5480342.37 | -5475212.04 | -5130.33 |
| allowance_cap_midyear | 2405993.72 | 2406447.46 | -453.74 |

The gap is always negative, because rounding 6.796117 up to 6.8 discounts harder, and it scales with the size of the field.

## The mistake

A careful analyst reconciles the profile against the headline, finds 21759.68 USD unexplained on AKATA, and spends an afternoon looking for the error in their own spreadsheet. There is none. A second, worse reading takes the profile point as the more precise figure because it is on the chart. It is the less precise one. Report the headline, and if the profile is charted, know that its applied-rate marker sits a few thousandths of a percent to the right of where it claims to be.

## What the profile refuses

It refuses to sample anywhere but 0, 5, 8, 10, 12, 15 and 20 percent plus the applied rate, so the IRR is never a sampled point and a curve that turns between samples is not seen. It refuses to be on the nominal flows when the basis is real, which is why the 10 percent point of AKATA, 55805775.02, is not the configured 10 percent nominal answer. And it refuses to flag its own rounding.

## Exercise

Read the profile point at the applied rate and the headline NPV and write the gap with its sign. Then say which of the two the engine's npv() agrees with at the exact rate.
