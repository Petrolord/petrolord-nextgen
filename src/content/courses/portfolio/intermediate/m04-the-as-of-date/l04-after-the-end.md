# After the end

Once the as-of date reaches the end of the window, time progress stops at 1 and planned value stops at the budget, so SPI stops saying anything about the calendar.

{{panel:ec-cost-explorer}}

## Two dates at and past the end

| as of | time progress | planned value | earned value | SPI | CPI |
| --- | --- | --- | --- | --- | --- |
| 2027-11-30 | 1.000000 | 27050000 | 15231500 | 0.563087 | 1.009377 |
| 2028-01-10 | 1.000000 | 27050000 | 15231500 | 0.563087 | 1.009377 |

On the end day, 2027-11-30, OFON-1's time progress is already 1.000000 and planned value is the whole budget of 27050000. On 2028-01-10 nothing has moved. SPI is 15231500 over 27050000, which is 0.563087, and it will read 0.563087 on every later date until somebody changes the lines.

## SPI turns into percent complete

With planned value equal to the budget, SPI is earned value over the budget, which is percent complete divided by 100. OFON-1's percent complete is 56.3087 and its SPI after the end is 0.563087. From the end day onward SPI carries nothing that percent complete did not already carry. It no longer measures pace against a plan. It measures how much of the work was ever recorded as done.

The published case on a two-year window agrees. As of 2028-06-30, after its end on 2027-12-31, the engine returns time progress 1.000000 and SPI 0.940000.

## Planned value stops at the budget

Planned value tops out at 27050000 even though OFON-1's EAC is 27600000 and its variance at completion is -550000. The schedule measure is built on the approved budget, and an overrun forecast never enters it, so a late and overrunning AFE is still measured against the smaller number.

## History, and an AFE with no window

Before EC5-0 the AFE wizard asked for no dates, and time progress fell back to 1 on every report. Every OFON-1 report would have read as though the window had closed, with an SPI of 0.563087 on the first day of drilling and on the last. The repaired wizard asks for the window, and the dashboard passes today as the as-of date.

The fallback itself remains in the engine as published. The golden case with no dates returns time progress 1.000000 and SPI 0.250000. An AFE saved without a window reports as though it has ended.

## The mistake

The first mistake is reading 0.563087 after the end as a schedule ratio that time could still improve. The date can no longer move it; only progress entered on the lines can. The second is reading a low SPI on an undated AFE as a late project, when the engine is dividing by the whole budget because it was never given a window. The third is setting planned value against the EAC and calling the overrun a schedule problem.

## Exercise

Write OFON-1's time progress, planned value and SPI as of 2027-11-30 and as of 2028-01-10, and show that the SPI equals percent complete divided by 100. Then say what the published case with no dates returns, and why an SPI from an AFE with no window reads like one from an AFE past its end.
