# Averaging windows and lags

{{panel:gsa-ledger-calculator}}

An indexed price rarely reads one month of its index. It reads an average over a stated number of months, the window, and the window closes a stated number of months before the month being priced, the lag. The average smooths a volatile index; the lag gives the parties a published figure before the invoice is due. Both are contract terms, and each moves every price the formula returns.

## The rule

The engine states it in its basis, here for the export feed agreement: "index averaged over 6 months ending 1 month before the delivery month". In general, X for delivery month t is the arithmetic mean of `averagingMonths` months of the index, ending `lagMonths` months before t. A lag of 0 ends the window at the delivery month itself. The lag is a whole number of months, at or above zero:

> lagMonths must be an integer at or above 0; got -1

## Three timings on one index

The three golden cases below share one synthetic index, rising by 2 each month from 60 in 2025-01, and one formula, 1 + 0.1 x oil. Only the timing differs.

| timing | priced month | window | oil average | price |
| --- | --- | --- | --- | --- |
| 3 months, lag 0 | 2025-03 | 2025-01 to 2025-03 | 62.000000 | 7.200000 |
| 3 months, lag 0 | 2025-04 | 2025-02 to 2025-04 | 64.000000 | 7.400000 |
| 1 month, lag 3 | 2025-04 | 2025-01 to 2025-01 | 60.000000 | 7.000000 |
| 1 month, lag 3 | 2025-05 | 2025-02 to 2025-02 | 62.000000 | 7.200000 |
| 6 months, lag 1 | 2025-08 | 2025-02 to 2025-07 | 67.000000 | 7.700000 |

On a rising index a longer lag prices each month lower, because it reads older oil: April 2025 prices 7.400000 on the three-month window with no lag and 7.000000 on one month lagged three. On a falling index the order reverses. Averaging trims the swings on both sides.

## The window must be covered

A window reaching back before the first month of the series cannot be averaged, and the engine refuses the call, naming the months it lacks:

> months must cover the averaging window 2024-09 to 2025-02 for the price of 2025-03; got no value for 2024-09, 2024-10, 2024-11, 2024-12

A series with a hole in it is refused the same way, at the first month out of step:

> months[1].month must be 2025-02, the month after 2025-01 (the series is consecutive); got "2025-03"

The engine never fills a gap by assumption. A missing index month is a question for the parties, and the fix belongs in the series.

## The export feed window

For January 2027 the export feed agreement (synthetic) averages July to December 2026 and reads 76.925000. For April 2027 it averages October 2026 to March 2027 and reads 71.461667, as oil fell into 2027. Each window closes a full month before the month it prices. The window moves with each reset, the subject of the next lesson.

## Exercise

Work in the course's own ledger calculator, on the view "Contract prices month by month", which starts with the export feed price.

1. Read the windows and oil averages of 2027-01 and 2027-04. Check the first against the fixture's 2026 oil index by hand.
2. Change `averagingMonths` to 3 and `lagMonths` to 0. Write the new 2027-01 window, average and price, and the 2027 annual average.
3. Restore them and set `from` to "2025-03". Read the refusal and name the months the series lacks.
4. Delete one month from the middle of `months` and read the refusal.
