# Printed figures and their errata

{{panel:dq-monitor-explorer}}

The engine is anchored to the NIST/SEMATECH e-Handbook's worked examples, and in three places the page prints a figure the engine does not reproduce to the printed digits. Grubbs' G on page 1.3.5.17.1 is printed 2.4687, and the engine reads 2.468765. The EWMA lower limit on page 6.3.2.4 is printed 47.4115, and the engine reads 47.411568. The CUSUM decision interval on page 6.3.2.3 is 4.1959 in the table, and the page's own design formula gives 3.749328, or 4.189476 with alpha halved. Each is a note about a published page.

| page | printed | engine | what differs |
| --- | --- | --- | --- |
| 1.3.5.17.1 Grubbs G | 2.4687 | 2.468765 | truncated rather than rounded; rounded to four decimals the engine reads 2.4688 |
| 6.3.2.4 EWMA lower limit | 47.4115 | 47.411568 | NIST rounds sqrt(0.3 / 1.7) to 0.4201 before multiplying; to four decimals the engine reads 47.4116 |
| 6.3.2.3 CUSUM design h | 4.1959 | 3.749328 or 4.189476, derived | the page's own design formula gives neither; the table is reproduced from the printed k and h |

## Grubbs, truncated

On NIST's uranium isotope example the engine's G is 2.468765, and its critical value 2.031652 against the printed 2.032; the test rejects, as NIST says. The printed 2.4687 is the engine's figure cut off after four decimals. Rounded, it would read 2.4688. The engine's largest |z| on the same eight values is also 2.468765, and NIST prints that as 2.4687 too. Nothing about the test changes: G sits above its critical value, 2.031652, either way. It matters to anyone checking a tool against the page digit by digit.

## EWMA, rounded early

NIST's EWMA example uses lambda 0.3, a target of 50 and s 2.0539. The page rounds the factor sqrt(0.3 / 1.7) to 0.4201 before multiplying it out, and the lower limit it prints, 47.4115, carries that early rounding. The engine keeps full precision and reads 47.411568, which is 47.4116 at four decimals. The upper limit agrees: the engine reads 52.588432 against the printed 52.5884.

## CUSUM, a design line that does not give its own table

The CUSUM page prints a design formula for h, and with the page's own inputs, alpha 0.0027, beta 0.01, delta 1 sigma and the printed k 0.317500, it gives 3.749328 in the data's units, or 4.189476 with alpha halved. The table on the same page uses h 4.195900. The engine reproduces the table from the printed k and h, first upper signal at group 14, and has no design helper.

## A column that is not an engine output

The same page prints a "325 - k - x" column, which shows 0.54 and 0.47 at groups 9 and 12. Derived with the printed k, those entries are -0.542500 and -0.467500. The S_lo the engine returns at those groups is 0.172500 and 0.000000. The derived values carry a minus sign the printed column does not. That column is not an engine output, and nothing in the engine is compared with it.

## Why the course teaches errata

A published page can carry a slip like any source. The engine was checked against a golden written by an independent standard library oracle, and each printed figure is reproduced within a stated allowance. Where the page and the engine disagree in the last digits, the course says why, so a learner can tell a rounding from a result.

## Exercise

Work sqrt(0.3 / 1.7) on a calculator to six decimals. Multiply it by 3 and by 2.0539, subtract the product from 50, and compare with the engine's 47.411568. Repeat with the factor rounded first to 0.4201 and compare with the printed 47.4115. Then, in the monitor panel's EWMA view, enter lambda 0.3, target 50, sigma 2.0539 and L 3 on any series and read the limits the panel draws.
