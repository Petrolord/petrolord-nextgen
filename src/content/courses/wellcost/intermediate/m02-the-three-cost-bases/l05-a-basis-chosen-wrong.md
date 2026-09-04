# A basis chosen wrong

A line on the wrong basis prices correctly today and reprices wrongly the moment anything moves.

{{panel:wc-afe-explorer}}

## The same money, calibrated three ways

Take 1,800,000 USD and put it on each basis in turn, calibrated so that all three agree on the golden's base case of 18 days and 3,000 m.

Per day that is 100,000 USD per day. Per metre it is 600 USD per metre. As a lump it is 1,800,000 USD. On the base case all three return 1,800,000 USD, to the dollar. Nothing on the AFE would tell you which one you chose.

## Then the schedule slips

Now hold the hole at 3,000 m and stretch elapsed time.

| Elapsed days | Per day USD | Per metre USD | Lump USD |
| --- | --- | --- | --- |
| 16 | 1,600,000 | 1,800,000 | 1,800,000 |
| 18 | 1,800,000 | 1,800,000 | 1,800,000 |
| 20 | 2,000,000 | 1,800,000 | 1,800,000 |
| 24 | 2,400,000 | 1,800,000 | 1,800,000 |

At 24 days the per-day line has become 2,400,000 USD and the other two have not moved at all. Elasticity to elapsed days measures out at 0.9999999999999978 for per-day and exactly 0 for the other two, which is 1, 0 and 0 to floating point.

## What that means on the golden

Of the golden's 5,380,000 USD base, 2,880,000 USD is per-day exposed. That is 53.53 percent of the well, against 8.36 percent per metre and 38.10 percent lump.

The two per-day rates add to 160,000 USD per day, so one extra elapsed day costs 160,000 USD and there is no conversation to be had about it once the well is spudded. Over half this AFE is a bet on the schedule.

## The mirror case

Deepening the hole inverts the ranking. Take the well to 4,000 m and the per-metre calibration bills 2,400,000 USD while the per-day calibration bills only 2,303,125 USD.

Per metre moves faster because extra metres add drilling hours only, while the day count also carries flat time that does not grow with depth. So the day count rises more slowly than the footage does, and a line put on per-day to look cheap under a slip has quietly become the cheap one under a deepening.

## Exercise

Reproduce the four rows of the slip table in the panel and confirm which columns are flat.

Then compute what a three day slip costs the golden AFE at 160,000 USD per day, and say which of the eight lines pay it.
