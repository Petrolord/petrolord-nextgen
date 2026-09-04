# The inversion

A section can cost more than another in total and less than it per metre, and the golden well is closer to that than it looks.

{{panel:wc-afe-explorer}}

## The golden sections

At the course pricing of a 50,000 USD bit, 6,000 USD/hr rig and 4 connection hours:

| section | interval, m | ROP, m/hr | USD/m | section total, USD |
|---|---|---|---|---|
| 26in surface | 500 | 25 | 412 | 206,000 |
| 17-1/2in intermediate | 1,500 | 15 | 481.3333333333333 | 722,000 |
| 12-1/4in production | 1,000 | 10 | 746 | 746,000 |

Rank by cost per metre and rank by section total, and both give production, intermediate, surface. The two agree.

They agree by a very small margin. The intermediate section is 0.645218945487042 of the production section per metre, and 0.967828418230563 of it in total. Per metre it is a third cheaper. In total it is three percent cheaper. The two rankings agree on this well, and one of them nearly does not.

## Where they part

Hold the production section fixed at 746 USD/m and 746,000 USD, and sweep the intermediate rate of penetration. The intermediate cost is

    total = 50,000 + 6,000 * (1,500 / ROP + 4 + 8)
    perM  = total / 1,500

Solve each crossing separately.

The per-metre crossing needs total equal to 1,119,000 USD, which puts 1,500 over ROP at 166.1666... hours, so ROP is 9.027081243731192 m/hr.

The total crossing needs total equal to 746,000 USD, which puts 1,500 over ROP at 104 hours, so ROP is 14.423076923076923 m/hr.

Two different crossings, at two different rates of penetration, because one of them divides by 1,500 m and the other does not.

## The disagreement band

| intermediate ROP, m/hr | USD/m | total, USD | rankings |
|---|---|---|---|
| 9 | 748 | 1,122,000 | agree |
| 10 | 681.3333333333334 | 1,022,000 | disagree |
| 12 | 581.3333333333334 | 872,000 | disagree |
| 14.4 | 498 | 747,000 | disagree |
| 15 | 481.3333333333333 | 722,000 | agree |

Between 9.027081243731192 and 14.423076923076923 m/hr the intermediate section costs less per metre than the production section and more in total than it. A longer, faster section outspends a shorter, slower one while beating it on rate.

The golden drills the intermediate hole at 15 m/hr, which is above the upper edge of the band and not far above it. Slow that section by a little more than half a metre per hour and the two rankings would part.

## Why it happens

Cost per metre divides by the interval. Total spend does not. A long interval spreads the bit, the connections and the trip over more metres, so it flatters the rate while adding to the bill. Rate rewards length. Total punishes it.

## Exercise

Reproduce both crossing rates from the two equations above.

Then set the intermediate rate of penetration to 12 m/hr in the panel and write the sentence you would use to defend that section to a manager who has sorted the well by total spend.
