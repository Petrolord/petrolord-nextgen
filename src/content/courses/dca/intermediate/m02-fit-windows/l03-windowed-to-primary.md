# Windowed to the primary

Module 1 and the last lesson were about what goes wrong. This one is about what goes right, and about the two conventions you have to hold in your head to read a windowed fit correctly. Both conventions are simple. Both are routinely misread, and one of them causes an argument about reserves at least once in every analyst's career.

{{panel:dca-fit-explorer}}

## The clean result

Set the window to Primary and run all four producers on Auto-Select.

| Well | model | qi (stb/d) | Di (per day) | b (raw) | R2 | RMSE (stb/d) |
|---|---|---|---|---|---|---|
| Ekene-1 | Exponential | 120.000000000000 | 0.00120000000000000 | 0 | 1.00000000000000 | 1.42601125915484e-14 |
| Ekene-3 | Hyperbolic | 150.000000000000 | 0.00200000000000000 | 0.49999999999999994 | 1.00000000000000 | 4.14314051144892e-14 |
| Ekene-5 | Harmonic | 100.000000000000 | 0.00150000000000000 | 1 | 1.00000000000000 | 2.13544491258776e-14 |
| Ekene-6 | Hyperbolic | 89.9999999999999 | 0.00100000000000000 | 0.35 | 1.00000000000000 | 4.31997628804008e-14 |

Every planted parameter recovered, every family correctly identified, RMSE at the level of double precision noise. The same engine that produced the ceiling fits of the last lesson produces this. Nothing changed except which rows it was given.

Ekene-6's $D_i$ of 0.00100000000000000 is the value the Professional capstone asks for, graded to a tolerance of 0.00002. It is not a number you estimate or round toward; it is what the engine returns when the window is right, and it is the cleanest demonstration in the course that window discipline is not a matter of taste.

Notice Ekene-6's $q_i$: 89.9999999999999, not 90. The hyperbolic fit round-trips $q_i$ through a power transform and back, and the last digit does not always survive. The right way to judge whether that is a real misfit is the RMSE tile, which reads 4.31997628804008e-14 stb/d. If the misfit were real it would be visible in barrels, not in the fifteenth digit. Judge exactness by RMSE, never by how tidy the digits look.

## Convention one: the end date is inclusive

The engine filters on `time >= startDate` and `time <= endDate`. Both ends are inclusive. Setting the end to 2022-12-01 keeps the December row, which is what you want for the Ekene primary window; the fixture records that window as ending exclusive of 2023-01-01, and the two descriptions mean the same thing.

The trap is one row wide and it matters. Ekene-1 fitted from 2020-01-01 to 2023-01-01 returns $q_i$ 120.000000000000, $D_i$ 0.00120000000000000 and R2 1.00000000000000, identical to the correct window, because the flood-start row still sits exactly on the primary curve. The numbers forgive you. The window statement does not: a window ending 2023-01-01 asserts that primary depletion was the only active drive on the day injection began, and that assertion is false. Get the boundary right for the reason, not for the residual.

## Convention two: t0 is the window start, and qi moves with it

This is the one that causes arguments. The engine measures time from the first row inside the window. Fitted $q_i$ is therefore the model rate on the window's start date, not the well's initial rate.

Fit Ekene-1 from 2021-01-01 to 2022-12-01, 24 monthly rows, and Auto-Select returns Exponential with

- $q_i$ = 77.3462227639957 stb/d
- $D_i$ = 0.00120000000000000 per day
- R2 = 1.00000000000000, RMSE 3.77380032269727e-14 stb/d

$D_i$ did not move by a digit, because the physics did not change. $q_i$ dropped by 42.6537772360043 stb/d, because the window now starts a year later. The fixture's 2021-01-01 row reads 77.34622276399577 stb/d, and the fitted $q_i$ is that rate.

2021-01-01 is 366 days after 2020-01-01, since 2020 was a leap year, and the closed form confirms the fit exactly:

$$q(366) = 120\,e^{-0.0012 \times 366} = 77.3462227639958 \text{ stb/d}$$

## Worked example: the EUR identity

Now book both fits at a 10 stb/d limit and watch them reconcile. The exponential EUR is $(q_i - q_{limit})/D_i$.

From the full primary window:

$$\frac{120 - 10}{0.0012} = 91666.6666666667 \text{ stb}$$

From the 2021-01-01 window:

$$\frac{77.3462227639957 - 10}{0.0012} = 56121.8523033298 \text{ stb}$$

Those are not two competing estimates of the same thing. The second books only the volume still to come after 2021-01-01. Add back what the well had already produced by that date,

$$N_p(366) = \frac{120}{0.0012}\left(1 - e^{-0.0012 \times 366}\right) = 35544.8143633369 \text{ stb}$$

and the two agree:

$$56121.8523033298 + 35544.8143633369 = 91666.6666666667 \text{ stb}$$

which is the whole-life EUR. Run end to end inside the engine, without rounding at the intermediate steps, the identity closes to a residual of about $4 \times 10^{-11}$ stb, which is double precision and nothing else.

Stop and run those three lines on a calculator. The identity is exact for the exponential and it is the check that settles the argument. When somebody says the late window "destroyed value", ask them to add back the produced volume. If the sum does not close, the two fits genuinely disagree and one of them is wrong. If it closes, the two fits agree completely and are answering different questions.

## The misconception to retire: fitted qi is the well's initial rate

It is the model rate at $t = 0$ on the window's clock, and nothing more. Three practical consequences follow.

Comparing fitted $q_i$ values across wells is meaningless unless the windows start at comparable ages. Ekene-1's 120 and the 77.35 above are the same well.

An EUR computed from a mid-life window is a remaining-volume estimate, not an ultimate recovery, and the reserves category you are reporting into cares about the difference. Say which one you have produced.

Type curves, which module 4 builds, exist partly to solve this. Normalising by time and rate is exactly the operation that makes wells with different clocks comparable.

## Exercise

Window Ekene-3 to 2021-06-01 through 2022-12-01, 19 monthly rows, and predict before you fit. Ekene-3's planted parameters are $q_i$ 150 stb/d, $D_i$ 0.002 per day and $b$ 0.5, and 2021-06-01 is 457 days after its first oil on 2020-03-01. Compute the rate at 457 days from the hyperbolic rate equation, and compute the instantaneous decline at 457 days from $D_i/(1 + b D_i t)$. Then run the fit and check both predictions against the reported $q_i$ and $D_i$. Finally, note what the reported $b$ does, and say in one sentence why a window that starts later changes $q_i$ and $D_i$ but leaves $b$ alone.
