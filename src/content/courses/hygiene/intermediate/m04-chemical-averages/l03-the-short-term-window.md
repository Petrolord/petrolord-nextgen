# The short-term window

{{panel:hy-protection-chemicals}}

A full fifteen-minute record of 240.000000 ppm for 5.000000 minutes and 110.000000 ppm for 10.000000 minutes has a STEL of 153.333333 ppm. A short record of 180.000000 ppm for 4.000000 minutes and 95.000000 ppm for 7.000000 minutes covers 11.000000 minutes, and its STEL is 92.333333 ppm, with one warning.

| record | samples, ppm for minutes | minutes covered | STEL, ppm | warnings |
| --- | --- | --- | --- | --- |
| full window | 240.000000 for 5.000000; 110.000000 for 10.000000 | 15.000000 | 153.333333 | 0 |
| short record | 180.000000 for 4.000000; 95.000000 for 7.000000 | 11.000000 | 92.333333 | 1 |

## A fifteen-minute time weighted average

The STEL is sum(C t) / 15, with t in minutes. It is the same arithmetic as the 8-hour TWA over a window of fifteen minutes. The engine measures the divisor as 15.000000000000 minutes by asking for the STEL of 10 ppm for one minute. Its only constant is the length of its window, so there is nothing to transcribe beyond the averaging itself. The door is `chemicalStel15Min`, and it takes periods of concentration and minutes.

## The short record counts the rest as zero

The short record covers 11.000000 minutes and is still divided by 15, so the unsampled minutes enter as zero. The judgement call J6 names it: the STEL divides by 15. The engine warns, in its own words:

> the periods cover 11 min of 15: the remainder counts as zero exposure

This is the chemical TWA's unsampled-time question at a smaller scale. A hygienist who knows the remaining minutes were clean may accept 92.333333 ppm. One who does not has a record that cannot say, and the honest report states the minutes covered beside the figure.

## Why the window is short

The digest prints the STEL as a fifteen-minute time weighted average and gives no reason for the window's length, so take the reason offered here as background: a substance can harm in minutes at a concentration that an eight-hour average dilutes away. What the printed figures do show is the scale of the difference. The full-window record carries a five-minute peak of 240.000000 ppm inside a STEL of 153.333333 ppm, and averaged into a shift those five minutes would barely register. The short-term window keeps them visible, and the STEL and the 8-hour TWA are reported side by side and compared with their own limits.

## Choosing the window

The engine does not search a long record for the worst fifteen minutes. It averages the periods it is given. Choosing which fifteen minutes to sample is the hygienist's decision, and it belongs to the task: the transfer, the opening of the hatch, the sampling of the line. A STEL taken over a quiet window says nothing about the peak it missed, and no arithmetic afterwards can recover it.

## Exercise

Open the protection panel's averages view and find the two STEL records. For the full window, multiply each concentration by its minutes, add the products, divide by 15 and check your answer against 153.333333 ppm. Repeat the arithmetic for the short record and check it against 92.333333 ppm. Then state the minutes the short record covers and copy the warning the engine gives it.
