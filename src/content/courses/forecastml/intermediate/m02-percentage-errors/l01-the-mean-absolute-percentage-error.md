# The mean absolute percentage error

{{panel:pf-backtest-explorer}}

An error in bbl/d means one thing on a well making a thousand bbl/d and another on a well making twenty. The percentage errors divide each error by a rate, so the answer reads the same on a well of any size. The first of them is the mean absolute percentage error, MAPE.

## The definition

The basis reads: "100 x mean |e / actual| (percent); null when any actual is 0". Each error is divided by the actual of its own month, the sign is dropped, the results are averaged and multiplied by 100. The answer is in percent.

On the teaching hold-out, each method fitted on EKENE-P1 months 0 to 35 and scored on months 36 to 47:

| method | MAE (bbl/d) | MAPE (percent) |
| --- | --- | --- |
| ses | 51.683333 | 22.550260 |
| holt | 6.783515 | 2.781120 |
| damped | 14.978829 | 6.462737 |

Holt's typical miss of 6.783515 bbl/d is 2.781120 percent of the rates it was scored on. Here the order of the three methods by MAPE is the same as by MAE.

## The actual is the denominator

MAPE divides by the actual, and only by the actual. So the same miss costs more on a low month than on a high one. On a declining well, the late months are the low months, and a forecast scored on a late hold-out pays for its misses at a higher rate than the same misses early in the life of the well.

The size of the miss is all that counts in the numerator. With an actual of 100, a forecast of 150 and a forecast of 50 both miss by 50, and MAPE is 50.000000 for each. The forecast itself never enters the denominator. That symmetry is worth holding on to, because the next percentage measure in this module does not have it.

## The rule for a zero actual

Divide by an actual of 0 and there is no number. If any actual is 0, MAPE is returned as null with its reason in `notes`, and every other metric is still returned. A shut-in month is where production data meets this rule, and the next lesson works one through.

This is a declared choice. The alternatives in common use are to drop the month, or to divide by a tiny number in its place. The engine takes neither, because a shut-in month is real and dropping it changes the metric; the reason in `notes` tells the reader exactly which actual was 0.

## When MAPE helps

MAPE is easy to read aloud: holt missed EKENE-P1 by 2.781120 percent on average over months 36 to 47 is a sentence any reader follows. It is a fair scale when the actuals stay well above zero, and a poor one when rates approach zero, where a small miss in bbl/d becomes a large percentage. Keep the months with the number every time: a MAPE is always the MAPE of one method on named months.

## Exercise

In the backtest explorer, hold out the last 12 months of EKENE-P1 and read the MAPE of each method. Then, in the scoring view, enter one actual of 100 with a forecast of 150, and run it; then change the forecast to 50 and run it again. Say whether MAPE changed and why. Finally, set the actual to 0 and read what comes back for MAPE and where its reason is.
