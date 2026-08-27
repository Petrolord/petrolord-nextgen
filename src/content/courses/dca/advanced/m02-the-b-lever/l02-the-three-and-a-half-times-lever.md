# The 3.5x lever

Lesson 1 laid out the table. This lesson is about one number in it and the sentence that has to accompany it.

$$\frac{321875.914758613}{91666.6666666667} = 3.5113736155485027$$

The $b = 1.2$ booking is **3.5113736155485027 times** the exponential booking, and both of them are fitted from the same early data on the same well. Not from different wells, not from different windows, not from a more optimistic view of the reservoir. From the same rows.

{{panel:dca-uncertainty-explorer}}

## The two curves you cannot tell apart

Take the two extreme rows of the table and evaluate the rate they predict, day by day, over the window an analyst would actually have in hand.

| $t$ (days) | $b = 0$ rate | $b = 1.2$ rate | difference | percent |
|---|---|---|---|---|
| 30 | 115.756835218 | 115.844369643 | 0.087534425 | 0.075619228 |
| 90 | 107.715311572 | 108.411996639 | 0.69668507 | 0.64678369 |
| 182 | 96.4564626974 | 98.8421481824 | 2.3856855 | 2.4733288 |
| 365 | 77.4390939429 | 84.3944743801 | 6.9553804 | 8.9817430 |
| 730 | 49.9734439224 | 65.9438915871 | 15.970448 | 31.957869 |
| 1096 | 32.2104760492 | 54.5019190573 | 22.291443 | 69.205568 |

At three months the two models disagree by **0.64678369 percent** on rate. Real monthly production data carries downtime, allocation error, meter drift and workovers; a well whose measured rates scatter by two or three percent contains no information at all capable of separating these two curves over a quarter. At six months they differ by 2.4733288 percent, which is still inside the noise on most fields. Only at two years does the gap become large enough that a human looking at a semilog plot would say the models were different.

So the honest statement of the problem is this. Over the period where the data lives, the difference between the two models is a fraction of the measurement error. Over the period where the reserves live, the difference is a factor of 3.51.

## Where the volume actually is

Make that precise instead of rhetorical. The exponential well reaches its 10 stb/d limit at 2070.75554149000 days. Evaluate the $b = 1.2$ curve on that same day: it is still producing 37.9408492439197 stb/d and has cumulatively delivered 129484.214773766 stb.

Its full booking is 321875.914758613 stb. So the volume booked **after the day the exponential well is already dead** is

$$321875.914758613 - 129484.214773766 = 192391.699984847 \text{ stb}$$

which is **59.7720087659024 percent** of the entire $b = 1.2$ reserve. Nearly sixty percent of that booking sits in a period beyond the economic life of the alternative model, more than two thousand days past the end of any history that could have been observed, and it rests entirely on the extrapolated value of a parameter the data could not see.

That is the shape of the lever. It is not that a high $b$ is optimistic. It is that a high $b$ moves the majority of the reserve into a region where nothing can contradict it.

## The misconception to retire: the fit chose b, so the data supports it

This is the one that survives all the way to reserves committees, usually in the form "we did not pick 1.2, the software picked 1.2".

What the software did was evaluate a fixed set of exponents on a window, compute RMSE for each, and return the smallest. That procedure always returns something. It returns something with the same confidence whether the winning rung beat its neighbours by a factor of 300, as in the Ikoku table of module 1, or by a hair. The fit report tells you which rung won. It does not tell you by how much, and the table above shows that over a short window the margin will be tiny.

The Professional tier taught you to read the ceiling alarm, and the alarm is the extreme case of this: a $b$ that has run out of range. But the everyday case has no alarm at all. A well fitted over eighteen months and returned at $b = 1.15$ raises no flag anywhere in the software, and it books 301134.0243262835 stb where a $b$ one rung higher books 321875.91475861275 stb and one rung lower books less again. The software cannot flag what it cannot distinguish. **The defence of a high $b$ is never the fit statistic. It is the window, the flow regime, and the analog.**

## Obtaining the two numbers the Expert capstone grades

Both values in this lesson are graded fields, so obtain them deliberately at least once rather than copying them off this page.

The direct route is the engine. Call `calculateEUR` with $q_i = 120$, $D_i = 0.0012$ per day, $b = 1.2$, $q_L = 10$ stb/d and the hyperbolic model. It returns **321875.914758613** stb, which is the `b12_eur_stb` field, graded to a tolerance of 2000. Call it again with $b = 0$ and the exponential model, which returns $(120 - 10)/0.0012 = 91666.6666666667$ stb, and divide. The quotient is **3.5113736155485027**, which is the `b_ratio` field, graded to a tolerance of 0.02.

The panel route gives the same two numbers with no code. Leave the fixed parameters at $q_i$ 120, $D_i$ 0.0012 and limit 10, drag the $b$ slider to its top position at 1.2, and read the EUR tile and the ratio tile. The slider steps in 0.05, so 1.2 is a reachable position exactly.

The hand route is four lines and is the one that makes the tolerance of 2000 stb feel generous:

$$\frac{120^{1.2}}{0.0012 \times (1 - 1.2)}\left(120^{-0.2} - 10^{-0.2}\right) = \frac{312.62053016368213}{-0.00023999999999999992} \times \left(0.38385194963737757 - 0.6309573444801932\right)$$

which is $-1302585.542348676 \times -0.24710539484281568 = 321875.91475861275$ stb. Stop and run those four numbers through a calculator. Watch both factors come out negative and the product come out positive, which is the $b > 1$ branch of module 1 lesson 3 doing its job.

## Exercise

Using the rate columns above, decide the question an analyst is really being asked. Suppose your monthly rate data carries a random error of plus or minus three percent, and you have twelve months of history. State how many months of history you would need before the systematic difference between the $b = 0$ and $b = 1.2$ curves exceeds that three percent, using the table rather than a formula, and then state the reserves range you would be forced to report from a twelve-month window if you were honest about what the data could and could not exclude. Express that range as a ratio, not as a volume. One paragraph.
