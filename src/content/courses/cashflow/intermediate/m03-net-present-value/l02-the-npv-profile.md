# The NPV profile

The profile is the same ledger read at seven rates, plus one point at the applied rate that lands exactly on the headline.

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

The engine adds one point at the applied rate, and its header says that point always equals the headline NPV. It does. The point is labelled at the applied rate rounded to two decimals and evaluated at the exact rate, so only the label is rounded.

AKATA's applied rate is 6.796117 percent. The point is labelled 6.8 and reads 72534830.66, which is the headline, so the gap is 0.00. The engine's own npv() at the exact rate on the same flows returns 72534830.66 as well.

| case | point labelled 6.8 | headline at 6.796117 | gap |
| --- | --- | --- | --- |
| AKATA | 72534830.66 | 72534830.66 | 0.00 |
| multiyear_pia_real | 219158380.04 | 219158380.04 | 0.00 |
| multiyear_jv_real | 88104639.00 | 88104639.00 | 0.00 |
| pia_loss_relief | 4985473.45 | 4985473.45 | 0.00 |
| multiyear_pia_midyear_real | 212070544.45 | 212070544.45 | 0.00 |

## Why the label and the rate part

On a nominal basis the applied rate is the configured one, 10 percent on multiyear_pia_nominal, and label and rate agree to the digit: its 10 percent point reads 219158380.04, the headline. On a real basis the Fisher rate is rarely round, so the printed label and the rate behind it differ in the third decimal. A point computed at the printed 6.8 would discount a little harder than 6.796117 and land a little below the headline, by an amount that grows with the size of the field. Evaluated at the exact rate, every case in the table closes to 0.00.

## The mistake

The careful mistake is to read the label as the rate. A marker printed at 6.8 on a chart was evaluated at 6.796117, so a reader who recomputes at 6.8 to check it finds a difference the engine never made. The second mistake follows from the first: recomputing at the label, finding a small shortfall and reporting it as an engine error, when the shortfall is the reader's own rounding.

## What the profile refuses

It refuses to sample anywhere but 0, 5, 8, 10, 12, 15 and 20 percent plus the applied rate, so the IRR is never a sampled point and a curve that turns between samples is not seen. It refuses to be on the nominal flows when the basis is real, which is why the 10 percent point of AKATA, 55805775.02, is not the configured 10 percent nominal answer.

## Exercise

Read the profile point at the applied rate and the headline NPV and confirm the gap is 0.00. Then say why the point is still labelled 6.8 when the rate it was evaluated at is 6.796117.
