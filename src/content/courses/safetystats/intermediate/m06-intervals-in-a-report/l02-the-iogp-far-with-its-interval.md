# The IOGP fatal accident rate with its interval

{{panel:ss-intervals-explorer}}

IOGP's 2024 observed FAR, with its 95 percent interval:

| case | count | hours | base | rate | lower 95 | upper 95 | upper against golden |
| --- | --- | --- | --- | --- | --- | --- | --- |
| IOGP 2024 FAR | 32 | 4158877000 | 100000000 | 0.769438 | 0.526295 | 1.086218 | 1.02e-15 |

The IOGP 2024 FAR of 0.769438 rests on 32 fatalities, and its interval runs from 0.526295 to 1.086218 per 100,000,000 hours.

## The figure

The Associate tier reproduced IOGP's published 0.77 through `fatalAccidentRate` as 0.769438: 32 fatalities in 4158877000 hours, on the fixed base of 100,000,000 hours. This is an observed FAR. It records what happened across the hours IOGP's members reported. It is a different quantity from a predicted FAR that a risk assessment might compute for a design.

## The interval

The Garwood interval on a count of 32 is computed the same way as on a count of 7, and then scaled by 100,000,000 over the hours. The upper limit agrees with the golden to 1.02e-15. At 95 percent, the true fatality rate behind 2024 could be as low as 0.526295 or as high as 1.086218 per 100,000,000 hours.

That interval is narrow compared with the BLS example's. The upper limit is about twice the lower one, where the BLS upper limit was about five times its lower. The difference is the count: 32 against 7. The hours are billions against hundreds of thousands, but what sets the width relative to the rate is the number of events, and 32 is still a modest number.

## Why a vast exposure still carries an interval

It is tempting to think a figure built on billions of hours must be exact. It is built on billions of hours and on 32 events, and the events are what the Poisson count model draws. A fatality is a rare event even across a whole industry, so the count stays small and the interval stays real. The upper limit of 1.086218 is more than a third above the observed rate.

## A fixed base fixes the scale only

FAR is the one rate with a fixed base. The engine takes no base argument for it, and its `basis.standard` reads "IOGP safety performance indicators, FAR". That settles what the number is per. It settles nothing about how sure the number is. The interval on an observed FAR comes from the count of fatalities exactly as the interval on a recordable rate comes from the count of recordables, and the fixed base only rescales it.

So an observed FAR belongs in a report with its interval, like any other rate. A reader who sees 0.769438 per 100,000,000 hours beside 0.526295 to 1.086218 knows what the figure is per, what it rests on and how far the true rate might sit from it.

## Fatalities and fatal incidents

2024 had 32 fatalities in 21 fatal incidents. The fatal incident rate on the same hours is 0.504944 per 100,000,000. The two counts answer different questions, and each would carry its own interval. Neither interval is in this lesson, and the smaller count would carry the wider one relative to its rate.

## Exercise

Divide the IOGP 2024 upper limit of 1.086218 by the lower limit of 0.526295, and do the same for the BLS limits of 7.211338 and 1.407182. Record both ratios and state which count, 32 or 7, produced the narrower interval relative to its rate. Then write the 2024 observed FAR in the house form the next lesson sets out.
