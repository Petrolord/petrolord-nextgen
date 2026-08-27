# What an interval measures

Every fit you have run so far reported a single set of parameters. The engine also reports something else, quietly, on the same object: a `confidenceIntervals` block with a half-width for $q_i$, one for $D_i$, and one for $b$. Reserves reports quote those half-widths. Approval committees read them as a statement of how sure the evaluator is. This module is about what that block actually contains, and the answer is narrower than almost everyone assumes.

A regression confidence interval measures **scatter about the fitted line**. It is a statement about the internal consistency of your points under the model you chose. It is not, and cannot be, a statement about the distance between your fitted parameters and the truth.

## The demonstration that settles it

The Ekene data is noise free by design. Every monthly row lies exactly on the planted decline. Fit Ekene-1 over its primary window, 36 rows from 2020-01-01 to 2022-12-01, and the engine recovers $q_i = 120.000000000000$ stb/d and $D_i = 0.00120000000000000$ per day at $R^2 = 1.00000000000000$ and an RMSE of 1.42601125915484e-14.

Now read the interval block. It reports `hasIntervals: true`, with

- $q_i$ half-width 2.74326145200774e-14 stb/d, which is 2.28605121000645e-14 percent of $q_i$
- $D_i$ half-width 3.69199091999372e-19 per day, which is 3.07665909999477e-14 percent of $D_i$

Those are not small intervals. They are zero, dressed in the last few bits of double precision. The engine is reporting that it can pin $q_i$ to fourteen decimal places.

It is right to report that, and the reason is worth stating precisely. The interval is built from the residual variance of the linearised regression. On Ekene-1's primary window the sum of squared residuals in log space is 4.33873497871556e-30, so the residual variance is 1.27609852315164e-31, so the standard error of the slope is 1.88366883673149e-19. Multiply by 1.96 and you get the reported $D_i$ half-width exactly. There is no scatter, so there is no interval. Lesson 2 walks that chain of arithmetic in full.

## The sting

A near-zero interval means the data are self consistent. It does not mean the booking is right, because the interval never sees the choice that matters most: which family you fitted.

Force an exponential onto Ekene-3, which is a planted hyperbolic with $b = 0.5$. The fit returns $q_i = 137.390666611994$ stb/d and $D_i = 0.00136416266227741$ per day at $R^2 = 0.987334417750128$, which the engine's own quality bands still call Excellent. Its interval block is tight:

| Parameter | Fitted | Half-width | Reported interval |
|---|---|---|---|
| $q_i$ (stb/d) | 137.390666611994 | 3.49600471256765 | 133.894661899426 to 140.886671324561 |
| $D_i$ (1/d) | 0.00136416266227741 | 0.0000435124771665498 | 0.00132065018511086 to 0.00140767513944396 |

The truth is $q_i = 150$ stb/d and $D_i = 0.002$ per day. Neither is inside. The $q_i$ truth sits 3.60678386464336 half-widths outside the reported band and the $D_i$ truth sits 14.6127588941636 half-widths outside it. The interval is not merely optimistic here, it excludes the right answer by a wide margin while looking like a careful piece of statistics.

Nothing is broken. The interval answered the question it was asked, which was: given that this well declines exponentially, how tightly do these 34 monthly rows pin the two exponential parameters? The answer is: very tightly. The premise was false, and the interval has no way to know that.

{{panel:dca-fit-explorer}}

## Stop and check it yourself

Open the panel above, select Ekene-3, set the window to the primary window and the model selector to Auto. Read the $q_i$, $D_i$, $b$ and RMSE tiles. Now change the model selector to Exponential without touching anything else. The RMSE tile jumps from 4.14314051144892e-14 to 3.58830309063897, the parameters move to the values in the table, and the fit is still reported with the same confidence machinery. Do the same on Ekene-5 with the model forced to Hyperbolic: the grid lands on $b = 0.950000000000000$ with $q_i = 99.5106353922532$ and $D_i = 0.00145598551378382$, and the half-widths come back at 0.156388833969675 and 0.00000721768663816306, which is 0.157157909155356 percent and 0.495725168268036 percent. Sub-one-percent intervals on a fit with the wrong $b$.

## The misconception to retire: a tight interval is a reliable booking

The habit runs like this. The interval is narrow, therefore the parameters are well determined, therefore the EUR built from them is well determined, therefore the booking is defensible. Each arrow in that chain is wrong in the same way: the interval propagates only one source of error, the vertical scatter of your points about your chosen curve, and reserves estimates are dominated by sources it never touches. Family choice. Window boundaries. The economic limit. The assumption that tomorrow's drive mechanism resembles yesterday's.

There is a second habit worth naming now and dismantling in lesson 4. Because the block reports a half-width for $b$ as well, evaluators read all three the same way. They are not the same. Two of them come from the regression and one of them does not, and the one that does not is the parameter with the most leverage over reserves.

## Exercise

Take the Ekene-5 forced-hyperbolic fit above: $q_i = 99.5106353922532$ stb/d with half-width 0.156388833969675, $D_i = 0.00145598551378382$ per day with half-width 0.00000721768663816306, $b = 0.950000000000000$. The planted truth is $q_i = 100$, $D_i = 0.0015$, $b = 1$.

For $q_i$ and for $D_i$, compute how many half-widths the truth sits outside the reported interval, the same way the Ekene-3 table did it. Then write one sentence explaining why the $q_i$ result and the $D_i$ result differ so much in size, given that both parameters came from the same 31 monthly rows of the same well. Keep your answer: lesson 4 asks you to turn it into the sentence a reserves committee is entitled to hear.
