# Boundaries to the month

This is the sharpest fact in the module, and it is worth remembering after the arithmetic has faded. Moving a window boundary by four months on one Ekene well is the difference between a fit at R2 0.889141114126678 that recovers nothing and a fit at R2 1.00000000000000 that recovers the designed decline exactly. Same well, same data, same engine, same model family. Four rows.

{{panel:dca-fit-explorer}}

## The setup

Ekene-5 is the easiest well in the field to fit after the flood, because it never breaks through to water. Its oil stream and its gross liquid stream are the same series forever, so there is exactly one thing to get right: where the flood ramp ends.

Its response lag is 9 months, the longest of the four producers, and the ramp is 6 months. The flood starts 2023-01-01, so the ramp ends 15 months later, on **2024-04-01**. From that date the well is a clean exponential at the flood's own decline constant, with an initial rate of its frozen base multiplied by its lift factor of 1.15.

Both of those are hand-checkable. The base rate on 2023-01-01 is 41.3907284768212 stb/d, so

$$41.3907284768212 \times 1.15 = 47.5993377483444 \text{ stb/d}$$

and the fixture's 2024-04-01 row reads 47.59933774834437 stb/d. Then step one month, 30 days, at the flood decline:

$$47.59933774834437 \times e^{-0.00035 \times 30} = 47.1021594558396 \text{ stb/d}$$

and the 2024-05-01 row reads 47.102159455839576 stb/d. Stop and run both lines now. Two multiplications and one exponential reproduce the entire post-ramp regime.

## The boundary walk

Now the experiment. Force the Exponential model, hold the end date at 2025-12-01, and walk the start date forward one month at a time.

| start | rows | qi (stb/d) | Di (per day) | R2 | tier |
|---|---|---|---|---|---|
| 2023-10-01 | 27 | 46.4032062233578 | 0.000189859517828727 | 0.518381876708355 | Poor |
| 2024-01-01 | 24 | 47.7053192302168 | 0.000288860363611005 | 0.889141114126678 | Fair |
| 2024-02-01 | 23 | 47.8553172416638 | 0.000315990703997829 | 0.953962147180947 | Excellent |
| 2024-03-01 | 22 | 47.8500989705790 | 0.000337189490814305 | 0.988676698925396 | Excellent |
| 2024-04-01 | 21 | 47.5993377483444 | 0.000350000000000000 | 1.00000000000000 | Excellent |
| 2024-05-01 | 20 | 47.1021594558396 | 0.000350000000000000 | 1.00000000000000 | Excellent |

Read the 2024-01-01 row first, because it is the one an analyst produces. January is where people start windows: a year boundary, comfortably clear of the flood start, and it delivers an R2 of 0.889141114126678 which looks like an honest, slightly noisy field fit. Its fitted decline of 0.000288860363611005 per day is 17.4684675397127 percent below the true post-ramp constant of 0.00035 per day. The window still contains three months of ramp, and the ramp is rising while the model is falling, so the fit flattens the decline to compromise.

Now read the 2024-02-01 row, which is the dangerous one. R2 has climbed to 0.953962147180947 and the quality tier has flipped to **Excellent**. The decline is still 9.71694171490599 percent low. A fit certified Excellent, on a window still contaminated by ramp, reporting a decline constant that is wrong by nearly ten percent.

Then watch 2024-04-01. R2 goes to exactly 1, RMSE falls to 6.75860953841821e-15 stb/d, and the fitted decline lands on the designed post-ramp constant to fifteen digits. Take one more month and you get the same decline again with a $q_i$ one month further down the curve, exactly as the last lesson's $t_0$ convention predicts.

## The plateau, not the threshold, is the signal

The practical procedure is in that table. You will not usually know the lag and the ramp, but you can always walk the start date forward and watch the fit statistics.

R2 climbs 0.518, 0.889, 0.954, 0.989, then stops at 1 and stays there. The decline constant climbs 0.000190, 0.000289, 0.000316, 0.000337, then stops at 0.00035 and stays there. **The boundary is the first start date after which the answer stops changing.** Not the first date that crosses a quality threshold, which arrives two months early here, and not the date the fit "looks good", which arrives three months early.

Trim one month past a suspected boundary and refit. If the parameters move, you were still inside the transition.

## What the four months are worth

Book both windows at a 10 stb/d limit through the exponential closed form.

From the 2024-01-01 window: 130531.301556460 stb. From the 2024-05-01 window: 106006.169873827 stb. The four-month boundary move is worth 24525.1316826323 stb, 23.1355700444824 percent of the correct booking.

The time to the limit moves too, since $t = \ln(q_i/q_{limit})/D_i$. The January window gives 5409.04191011611 days, about 14.82 years. The May window gives 4427.81072941896 days, about 12.13 years. Nearly three years of well life, created by a boundary choice that felt like a formatting decision.

The Expert tier books this well's post-ramp decline formally. At this tier the point is the principle: window boundaries are worth twenty-three percent, so they get the same scrutiny as the fit itself.

## Windows have two ends

Ekene-5 is the easy case because it never waters out. Ekene-6 shows the general shape. Its lag is 3 months, so its ramp ends on 2023-10-01, and its water breakthrough begins on 2024-03-01, after which the oil stream falls away from the gross.

Fitted Exponential from 2023-10-01 to 2024-03-01, six rows, Ekene-6 returns $q_i$ 57.6425415617330 stb/d, $D_i$ 0.000350000000000003 per day and R2 1.00000000000000. The same clean post-ramp constant. Extend the right-hand boundary to 2024-06-01 and it degrades to $D_i$ 0.000378043475439145 at R2 0.995623703316064. Extend it all the way to 2025-12-01 and you get $D_i$ 0.00102764413565850 at R2 0.900378682826474, nearly three times the true gross decline, because by then the oil rate is falling under a rising water cut while the gross behaves perfectly.

Two lessons in one well. A window is bounded on both sides, and the right-hand boundary is often set by a stream change rather than a drive change. And a fit of the oil stream through a rising water cut reports a decline that belongs to neither the flood nor the reservoir. Fit the stream you book, and know what is driving it.

## The misconception to retire: R2 above 0.95 means the window is right

Ekene-5 from 2024-02-01 is the counterexample, and it is worth keeping by name. R2 0.953962147180947, quality Excellent, decline constant 9.7 percent wrong, window still full of ramp. Fit quality measures how well one curve tracks the rows you gave it. It has no way to know that those rows span two regimes, and when the contaminated portion is small it will not notice at all.

The check that does work is stability. A correct window is one whose answer does not depend on exactly where you put the edge.

## Exercise

Quantify the cost of stopping one month early. Take the 2024-03-01 window's parameters, $q_i$ 47.8500989705790 stb/d and $D_i$ 0.000337189490814305 per day, and compute the time to a 10 stb/d limit from $\ln(q_i/10)/D_i$. You should get 4642.75469995468 days. Do the same for the correct 2024-04-01 window, $q_i$ 47.5993377483444 and $D_i$ 0.000350000000000000, and you should get 4457.81072941895 days. Then answer in one sentence: the 2024-03-01 fit reported R2 0.988676698925396, which most reviewers would accept without comment, so what would you have to have done, other than reading the statistics, to know that it was still wrong?
