# Oil versus gross

Four wells. One reservoir. One flood. One designed post-ramp decline of 0.00035 per day, which the last lesson recovered four separate times from four separate windows. Now fit the same model family on the same window on all four, and read the decline constants.

| Well | wcMax | Rows with water | qi (stb/d) | Di (per day) | R2 | Quality | Di / 0.00035 |
|---|---|---|---|---|---|---|---|
| Ekene-5 | 0 | 0 of 20 | 47.10215945583964 | 0.00035000000000000043 | 1.00000000000000 | Excellent | 1.0000000000000013 |
| Ekene-1 | 0.08 | 6 of 20 | 39.665342015203535 | 0.00043602810153168224 | 0.9612773701829425 | Excellent | 1.2457945758048063 |
| Ekene-3 | 0.25 | 15 of 20 | 45.98862681275064 | 0.0008129392458294835 | 0.9345348502683186 | Good | 2.3226835595128104 |
| Ekene-6 | 0.45 | 20 of 20 | 58.134557068111256 | 0.0013275893489185155 | 0.9477350438026422 | Good | 3.793112425481473 |

The window is 2024-05-01 to 2025-12-01 for all four, twenty monthly rows each, model Exponential. Auto-select picks Exponential on all four of these windows unaided, so the family is not a forcing artefact.

Ekene-6's oil is falling 3.793112425481473 times faster than Ekene-5's. They share a tank, a flood, a start date and a window. Nothing about the reservoir distinguishes them on that window. The entire spread in that last column is water cut.

{{panel:dca-fit-explorer}}

## Proving it is water and nothing else

The claim is easy to test because water cut is a known curve in this fixture. Divide each monthly oil rate by $(1 - \text{wc})$ to recover the gross liquid rate, and refit the same window.

Ekene-3's gross stream: $q_i$ 43.35641388183768 stb/d, $D_i$ 0.00035000000000000005 per day, R2 1.00000000000000.

Ekene-6's gross stream: $q_i$ 53.50156275634024 stb/d, $D_i$ 0.0003500000000000002 per day, R2 1.00000000000000.

Both collapse onto the field constant, perfectly, on the window where their oil fits returned 2.32 and 3.79 times it. The reservoir was behaving identically the whole time. The oil stream was not, because the oil stream is the reservoir's behaviour multiplied by a second curve that has nothing to do with drive mechanism.

Check one row of that by hand. Ekene-6's last history row reads 24.02809722062498 stb/d of oil at a water cut of 0.45, so the gross was

$$24.02809722062498 / 0.55 = 43.68744949204541 \text{ stb/d}$$

and the gross fit predicts, 579 days after 2024-05-01,

$$53.50156275634024 \times e^{-0.00035 \times 579} = 43.68744949204542 \text{ stb/d}$$

Stop and run that division before continuing. It takes ten seconds and it is the whole lesson: one number that looked like a steep decline turns into the field's gentle decline the moment you divide out the water.

## Two symptoms you already know how to read

The Professional workflow told you to read every fitted parameter before looking at R2, and to be suspicious of a $q_i$ that sits above the first recorded rate in the window. Ekene-6's oil fit reports $q_i$ 58.134557068111256 stb/d. The well's actual oil rate on 2024-05-01, the first row of the window, is 53.28318903080415 stb/d. The fitted curve starts about nine percent above data that it is supposed to pass through.

That is the exponential straining. An exponential is a straight line on a semilog rate axis, and this oil stream is not: it steepens, because water cut is a quadratic in time and takes a bigger bite each month. To cover a curve that steepens, the best straight line starts high, crosses the data, and finishes low. It finishes low too. At day 579 the fit predicts 26.952769057741932 stb/d against an actual 24.02809722062498.

The second symptom is the quality tier, doing the same disservice it did in the last lesson. Ekene-1's oil fit is certified **Excellent** at R2 0.9612773701829425 while reporting a decline 24.57945758048064 percent above the reservoir's. Ekene-6, whose fit is wrong by a factor of nearly four, is certified **Good**. A fit statistic measures agreement between a curve and the rows you handed it. Both of those curves do agree with their rows, reasonably well. Neither row set is the reservoir.

## What it is worth

Book Ekene-6's post-flood life from its oil fit at a 10 stb/d limit and you get 36257.11302016905 stb, reached 1325.8431016402847 days after 2024-05-01, about 3.63 years. Book the same well from its gross fit and the volume is 124290.17930382918 stb over 4791.787916800519 days, about 13.12 years. The gap is 88033.06628366013 stb, a factor of 3.428021950746306.

Be careful with both of those numbers, because neither is a booking. The gross figure is a liquid volume, not oil, and no oil booking follows from it without a water-cut forecast to convert it. The oil figure is worse than incomplete: it is an extrapolation that silently assumes water cut goes on accelerating along the same quadratic forever, for another eleven years past the last row anybody has seen. Nobody wrote that assumption down. It came in through the fitted decline constant.

That is the real charge against fitting oil directly through a rising water cut. It is not that the answer is too low. It is that a claim about future water production has been made, has changed the volume by a factor of three and a half, and appears nowhere in the submission.

## The defensible construction

Fit the gross stream, which is the one the reservoir controls and the one that behaves like Arps. Forecast water cut separately, on its own physics and its own evidence, which is displacement and sweep work rather than decline work. Multiply. Then the water-cut assumption is a visible line in the model with a name on it, and a reviewer can disagree with that line without having to reverse-engineer it out of a decline constant.

The practical payoff is that when the water-cut forecast turns out to be wrong, which it will, you revise it without refitting the decline, because the decline was never carrying it.

## Misconceptions to retire

**"The oil decline is the reservoir's decline."** It is the reservoir's decline times a stream-mixing factor. On these four wells that factor ranges from 1.00 to 3.79 across wells that are otherwise identical in every respect the analysis can see.

**"Rising water cut means use a higher b."** The curvature in a watering-out oil stream is not hyperbolic curvature and does not come from the drive mechanism. Absorbing it into b converts a water-handling problem into a reserves-inflation lever, and the b lever is the one thing in this tier under formal governance. If you find yourself raising b to fit a well with climbing water cut, you are fitting the wrong stream.

**"Ekene-1 looks fine, so water cut is a late-life problem."** Ekene-1 has water on six of its twenty rows and a wcMax of 0.08, and its decline still reads a quarter high. The distortion starts with the first barrel of water, and it scales with how much of the window is contaminated and how fast the cut is climbing, not with whether the well feels wet.

## Exercise

Repeat the gross-stream reconstruction on Ekene-3. Its breakthrough is 2024-09-01 and its wcMax is 0.25 over the 15 months to the end of history, so build its water cut on each row of the window from 2024-05-01, divide the oil rate by $(1 - \text{wc})$, and fit the result. Check your last row first: the oil rate on 2025-12-01 is 26.552464694985037 stb/d at a water cut of 0.25, so the gross should be 35.40328625998005 stb/d, and the gross fit's own prediction at 579 days is 35.40328625998004.

Then write down what you would do instead if the field's water rates were metered only at the separator on a monthly well test. This reconstruction is trivial here because the fixture is honest about its water. Getting a trustworthy gross stream on a real asset is usually the hardest part of the job, and it is a data problem rather than a curve-fitting one.
