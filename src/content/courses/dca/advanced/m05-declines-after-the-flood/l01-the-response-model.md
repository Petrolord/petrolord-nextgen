# The response model

Every window you have drawn in this course stops at 2023-01-01. The instruction was always the same: the waterflood changes the reservoir, Arps assumes it does not change, so cut the data at the flood and fit what came before. That was correct for two tiers, and it was also an evasion. Somebody still has to book these wells for the twenty-five years after the flood, and at this tier that somebody is you.

The Ekene fixture makes the problem teachable in a way real data never does, because its flood response is not an emergent property of the numbers. It is a written model with four parameters per well, sitting in the same file as the rates. Open `test-data/ekene-dynamic/rates.json`, find any producer, and read its `flood_response` block.

| Well | lagMonths | lift | btDate | wcMax | ramp_months | post_ramp_decline_per_day |
|---|---|---|---|---|---|---|
| Ekene-1 | 5 | 1.28 | 2025-06-01 | 0.08 | 6 | 0.00035 |
| Ekene-3 | 6 | 1.25 | 2024-09-01 | 0.25 | 6 | 0.00035 |
| Ekene-5 | 9 | 1.15 | null | 0 | 6 | 0.00035 |
| Ekene-6 | 3 | 1.35 | 2024-03-01 | 0.45 | 6 | 0.00035 |

Two of those columns are the same for every well. The ramp is six months everywhere and the post-ramp decline is 0.00035 per day everywhere, because they are properties of the flood, not of the well. Everything that differs between the four producers is either how long the pressure signal took to arrive, how much lift it delivered, or when and how hard the water followed it.

## How a rate is built after 2023-01-01

Before the flood, a producer's rate is its planted Arps curve evaluated at time since its own first oil. From 2023-01-01 the fixture switches to a different construction, and the switch is total. The primary decline is not continued, blended or damped. It is replaced.

The replacement starts from a **frozen base rate**: the value the primary decline had on the flood start date, and only that value. For Ekene-5 the base is 41.390728476821195 stb/d, for Ekene-6 it is 42.698178934617005 stb/d, for Ekene-1 32.210476049246076 stb/d and for Ekene-3 36.18559446659539 stb/d. Those four numbers are the closed-form rates at the flood start you have been quoting since the Associate tier, and after 2023-01-01 they behave as constants.

Let $m$ be whole months since 2023-01-01, $L$ the lag, and $\lambda$ the lift. The gross liquid rate is

$$q_{gross}(m) = q_{base}\left(1 + (\lambda - 1)\,r\right), \qquad r = \text{clamp}_{[0,1]}\!\left(\frac{m - L}{6}\right)$$

while $m < L + 6$, and after that

$$q_{gross} = q_{base}\,\lambda\,e^{-0.00035\,(t - t_{rampEnd})}$$

with $t$ in days. Read the first expression for $m < L$: the clamp makes $r$ zero, so the rate is exactly the base and does not move. That is the lag, and it is worth naming carefully. During the lag the well is not declining slowly. It is not declining at all. The injected water has already arrested depletion by holding pressure up before any of it has travelled far enough to lift the rate.

You can see the flat stretch in the fixture. Ekene-5 reads 41.390728476821195 stb/d on ten consecutive monthly rows from 2023-01-01 through 2023-10-01, byte for byte identical. Ekene-6, with a lag of three months, is flat on four rows to 2023-04-01. In both cases the flat count is the lag plus one, because the flood-start row itself is the first flat row.

Then the ramp: six equal monthly steps of $q_{base}(\lambda - 1)/6$. For Ekene-5 that step is 1.0347682119205293 stb/d, and subtracting the 2023-10-01 row from the 2023-11-01 row in the fixture gives 1.0347682119205288. The ramp ends at $m = L + 6$, at a peak of $q_{base}\lambda$, and from that row the well is a clean exponential at the flood's own decline constant.

## Water cut is a separate curve

The rate above is gross liquid. Oil is what the fixture stores, and oil is gross times $(1 - \text{wc})$. Water cut is zero until the breakthrough date, then rises as a quadratic:

$$\text{wc}(m) = \text{wc}_{max}\left(\frac{m - m_{bt}}{m_{end} - m_{bt}}\right)^2$$

where $m_{end}$ is the last history row, 2025-12-01. So `wcMax` is not a level the well sits at. It is the value reached on the final row and nowhere before it. Ekene-6 breaks through on 2024-03-01, which is 21 months before the end of history, so its water cut runs 0 at breakthrough, 0.004081632653061224 two months later, 0.1020408163265306 on 2025-01-01, 0.2295918367346939 on 2025-06-01 and 0.45 on the last row. Ekene-1 breaks through on 2025-06-01 with only six months of history left, and Ekene-5 never breaks through at all.

## Response order follows distance

The four lags are not arbitrary. Ekene-2 and Ekene-4 became injectors because they found the sand wet below the 1560 m contact, and their positions in the field are fixed by the same well table the geoscience courses use. Compute the separation from each producer to its nearer injector and sort:

| Producer | Nearer injector | Distance (m) | Lag (months) | Breakthrough |
|---|---|---|---|---|
| Ekene-6 | Ekene-2 | 716 | 3 | 2024-03-01 |
| Ekene-1 | Ekene-2 | 1209 | 5 | 2025-06-01 |
| Ekene-3 | Ekene-4 | 1217 | 6 | 2024-09-01 |
| Ekene-5 | Ekene-2 | 1767 | 9 | never |

The exact separations, by Pythagoras on the coordinates, are 715.8910531638176, 1209.3386622447824, 1216.5525060596437 and 1767.0597047072292 metres. The lag order is the distance order, with no exceptions, and so is the water-cut order: the nearest well responds first, gets the biggest lift, and drowns first.

## Worked example: rebuild one row by hand

Take Ekene-6 on 2024-05-01. Its lag is 3 and its ramp is 6, so the ramp ends 9 months after the flood start, on 2023-10-01, at

$$42.698178934617005 \times 1.35 = 57.64254156173296 \text{ stb/d}$$

which is exactly what the 2023-10-01 row reads. From 2023-10-01 to 2024-05-01 is 213 days, so

$$q_{gross} = 57.64254156173296 \times e^{-0.00035 \times 213} = 53.501562756340235 \text{ stb/d}$$

Breakthrough was 2024-03-01, two months earlier, out of 21 months to the end of history, so

$$\text{wc} = 0.45 \times (2/21)^2 = 0.004081632653061224$$

$$q_{oil} = 53.501562756340235 \times (1 - 0.004081632653061224) = 53.28318903080415 \text{ stb/d}$$

The fixture row reads 53.28318903080415. Stop here and run those three lines yourself before going on. Four parameters and two exponentials reproduce any post-flood row in the field, and if you can build the data you can reason about what a fit of it is doing.

## Two misconceptions worth naming

**"The lift is a percentage increase on whatever the well is making."** It is a multiplier on the frozen base rate. If it applied to the current rate the well would have to keep declining underneath the response, and the fixture's peaks would not be exactly 1.35 and 1.15 times the flood-start rates. They are.

**"The plateau after the flood is the flood working."** The flat stretch is the lag, before any lift at all. The flood working is the ramp. Confusing the two moves your window start by the length of the lag, which for Ekene-5 is nine months, and the next lesson prices that mistake.

## Exercise

Rebuild Ekene-1's 2024-05-01 row from the response model alone. Its lag is 5 and its ramp is 6, so find the ramp-end date, multiply the frozen base 32.210476049246076 stb/d by the lift 1.28 to get the peak, count the days from the ramp end to 2024-05-01, apply the post-ramp decline, and decide from the breakthrough date whether any water cut applies. You should land on 39.09332829980664 stb/d, and the fixture row will agree. Then answer in one sentence: given that this well produces at 39 stb/d on that date while its unflooded primary decline would have put it far lower, what exactly would you be measuring if you fitted an Arps curve straight through 2023-01-01?
