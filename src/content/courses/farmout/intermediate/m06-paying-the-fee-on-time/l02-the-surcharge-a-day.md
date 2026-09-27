# The surcharge a day

{{panel:farmout-deal-calculator}}

After the 90 days and the 30 more, the fee is late. The regulation then charges a surcharge every day, as a straight line on the fee, for up to 90 days. This lesson counts the surcharge days and computes the surcharge on the Ekene fee of 392000.000000.

## The text

> "shall impose a surcharge of 0.01% of the stipulated amount per day on a straight-line basis for 90 days failing which the consent is deemed withdrawn." (AOI Regulations 2024 reg. 19(9))

The engine holds the rate and the day counts as its gazetted constants, each cited: 90 days to pay under reg. 19(7), 30 more under reg. 19(8), and a surcharge of 0.01 percent of the fee a day for 90 surcharge days under reg. 19(9). They are the only rule figures the engine carries; every figure of a deal is stated.

## Counting the surcharge days

The first surcharge day is day 121 after the notification. The surcharge days are the days past the 90 + 30, so day 121 is surcharge day 1 and day 210 is surcharge day 90.

| case | notified | paid | days | status | surcharge days | surcharge | total paid |
| --- | --- | --- | --- | --- | --- | --- | --- |
| day 120 | 2027-01-01 | 2027-05-01 | 120 | within-grace | 0 | 0.000000 | 392000.000000 |
| day 121 | 2027-01-01 | 2027-05-02 | 121 | surcharge | 1 | 39.200000 | 392039.200000 |
| day 210 | 2027-01-01 | 2027-07-30 | 210 | surcharge | 90 | 3528.000000 | 395528.000000 |

The engine's reasons:

> paid 121 days after the notification: 1 day after the 90 + 30 days; surcharge 0.01% of 392000 x 1 day = 39.2 (reg. 19(9), straight line)

> paid 210 days after the notification: 90 days after the 90 + 30 days; surcharge 0.01% of 392000 x 90 days = 3528 (reg. 19(9), straight line)

## A straight line on the fee alone

The surcharge is 0.01 percent of the fee for each surcharge day. One day costs 39.200000 on the Ekene fee, and ninety days cost 3528.000000, ninety times as much. Nothing compounds: the surcharge of one day never enters the base of the next. And the base is the fee alone, 392000.000000, whatever the value of the transaction.

After the ninetieth surcharge day the regulation puts the consent itself at stake, which the next lesson reads.

## What the fee view reports

The fee view prints five payment tiles when both dates are stated: the days from the notification, the payment status, the surcharge days, the surcharge and the total paid. Under the stated basis the payment timing does not apply, and dates are refused:

> payment must be left out under basis "stated" (the payment timing is reg. 19(7) to (9)); got {"notifiedOn":"2027-05-03","paidOn":"2027-07-30"}

## Exercise

Work in the course's own deal calculator.

1. Open the view "The consent fee and its day rules" and start from "Paid on day 121". Read the five payment tiles and the reason.
2. Start from "Paid on day 210". Check the surcharge against the reason, and divide it by the one-day surcharge.
3. On the day 210 start, change "Value of the transaction (stated)" to 10000000. Read the new fee and surcharge, and check that the surcharge is still 0.01 percent of the fee for each surcharge day.
