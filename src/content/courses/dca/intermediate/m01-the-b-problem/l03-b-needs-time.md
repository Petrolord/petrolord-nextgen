# b needs time

The Associate tier finished module 4 with an uncomfortable result: a deliberately wrong exponential, forced on Ekene-3's hyperbolic primary window, came back at R2 0.987334417750128 and sat comfortably in the Excellent band. The conclusion drawn there was correct as far as it went, that R2 does not choose your model. This lesson explains the mechanism underneath, because the mechanism is what tells you how much history is enough.

The short version: $b$ is identifiable only in proportion to how much the loss ratio has travelled, and the loss ratio travels with elapsed time.

## Identifiability is a ratio, not a property

Here is the fact that surprises most people, and it is worth stating before anything else because it prevents a wrong lesson from being learned.

On the Ekene data, which is noise-free by construction, $b$ is recovered exactly from a very short window. Fit Ekene-3 with Auto-Select from 2020-03-01 to 2020-08-01, six monthly rows, and the engine returns Hyperbolic with $q_i$ 150.000000000000, $D_i$ 0.00200000000000000, $b$ 0.49999999999999994 and R2 1.00000000000000. Six rows. Perfect recovery.

So a short window is not intrinsically incapable of determining $b$. Identifiability is not a property of the window alone. It is the ratio between the misfit a wrong $b$ produces and the noise the data already carries. Noise-free data has an infinite ratio, which is why the Ekene fits look magical. Field data does not, and the whole question becomes: how big is the penalty for being wrong about $b$, compared with the scatter?

## Measuring the penalty

That question has a number attached. Take Ekene-3, walk the grid two rungs above its true exponent to $b = 0.6$, and record the RMSE the engine would see, on windows of different lengths.

| window | rows | RMSE at b = 0.60 (stb/d) | RMSE at b = 0.40 (stb/d) |
|---|---|---|---|
| to 2020-08-01 | 6 | 0.0543482785185351 | 0.0539695859992761 |
| to 2021-02-01 | 12 | 0.186060518096245 | 0.181080809106356 |
| to 2022-02-01 | 24 | 0.572730829570854 | 0.528611278774091 |
| to 2022-12-01 | 34 | 0.991015196328253 | 0.872334668495734 |

Being wrong about $b$ by 0.1 costs 0.054 stb/d of RMSE over six months and 0.991 stb/d over thirty-four, a factor of 18.2345278147177. The error you are making is identical in both cases. Only the evidence against it has grown.

Now put a realistic number on field scatter. Allocated monthly oil rates on a well making 40 to 150 stb/d routinely carry half a barrel a day of noise from meter drift, allocation factors and downtime accounting. Take 0.5 stb/d as a working floor and ask which rungs of the grid the data cannot rule out, because their RMSE sits below it.

| window | rows | b rungs the data cannot separate | booked EUR at 10 stb/d across that band |
|---|---|---|---|
| to 2020-08-01 | 6 | 0.05 to 1.35, 26 rungs | 77632.6753339386 to 298835.535826654 stb |
| to 2021-02-01 | 12 | 0.25 to 0.75, 11 rungs | 93166.5399421189 to 137156.626155241 stb |
| to 2022-02-01 | 24 | 0.45 to 0.55, 3 rungs | 108283.543624675 to 114454.677203916 stb |
| to 2022-12-01 | 34 | 0.45 to 0.55, 3 rungs | 108964.254599326 to 113719.588669943 stb |

Read the first row again. On six months of data with ordinary field scatter, the honest statement about Ekene-3 is that $b$ lies somewhere between 0.05 and 1.35 and the well will ultimately deliver somewhere between about 78 and about 299 thousand barrels. That is nearly a factor of four in reserves, from a fit that would have reported a single tidy exponent and an R2 in the high nines.

Read the last two rows as well. Between two years and nearly three years of history the band stops narrowing: both windows leave the same three rungs standing. Information about $b$ arrives fast early and then slows sharply.

{{panel:dca-fit-explorer}}

## Stop and reproduce the effect

Select Ekene-3 in the panel and set a custom window covering only its first six months. Force the Hyperbolic model and note the reported exponent. Now extend the window to the full primary period and note it again. Both read 0.49999999999999994, and the R2 tile reads 1 in both cases, which is exactly the trap: on clean data the fit report looks equally authoritative at six months and at thirty-four. Then look at the RMSE tile in each case. It is the only tile whose scale carries any information about how hard the data was working, and on real data it is the one you compare against your own knowledge of the scatter.

## The misconception to retire: more points means more certainty about b

An analyst with 200 daily rate points over 60 days will often claim a better-determined $b$ than a colleague with 34 monthly points over 1036 days. The opposite is true, and the loss ratio explains why. What determines $b$ is how far $1/D$ has travelled from its intercept, and $1/D$ travels with calendar time, not with sample count. Ekene-3's loss ratio moves from 500 to 1018 days over its primary window. Compressed into 60 days it would move from 500 to 530, and no amount of dense sampling recovers a slope from a baseline that short. Sampling density buys you precision on $q_i$ and $D_i$. Only elapsed time buys you $b$.

A corollary worth carrying into practice: early-life data is exactly the data that fails to determine $b$, and early life is exactly when a booking is most valuable to whoever is asking. That pressure is real, it points one way, and the governance rules the Expert tier covers exist because of it.

## Worked example: what to write instead of a number

Suppose you are handed Ekene-3's first twelve months and asked for a reserves number. The defensible output is not "$b$ = 0.5, EUR = 111 Mstb". It is three lines:

- Best fit on the window: hyperbolic, $b$ 0.5, R2 1.00000000000000 over 12 rows to 2021-02-01.
- Rungs not excluded at a 0.5 stb/d misfit floor: $b$ from 0.25 to 0.75.
- Resulting EUR range at a 10 stb/d limit: 93166.5399421189 to 137156.626155241 stb, a spread of 43990.0862131221 stb around a central case.

The best fit is still reported. What changes is that the number arrives with the width the data actually supports, and the width is derived rather than asserted. That is the whole Professional move.

## Exercise

Run the same experiment on Ekene-6, whose planted exponent is 0.35. Fit it in the panel over its first six monthly rows, then over its full primary window to 2022-12-01, and record the exponent and R2 in both cases. Then, without the panel, answer from the loss ratio alone: Ekene-6 has $D_i$ 0.001 per day, so its loss ratio is $1000 + 0.35t$. How far has that ratio travelled by the end of its 852 day primary window, as a fraction of its intercept, and how does that fraction compare with Ekene-3's travel of 500 to 1018 over 1036 days? Which of the two wells should you expect to have the better determined exponent on field-quality data, and why?
