# F against Et

The plot is simple enough to draw by hand on graph paper, and drawing it by hand once is worth an hour of reading about it. Withdrawal up the vertical axis, expansion along the horizontal, one point per survey.

## The six points

Here are the Ekene coordinates, taken straight from the per survey table the engine produces:

| n | date | x = Et (rb/stb) | y = F (rb) |
|---|---|---|---|
| 0 | 2020-01-01 | 0.00000000000000 | 0.00000000000000 |
| 1 | 2020-07-01 | 0.00384933588106068 | 46727.8893358510 |
| 2 | 2021-01-01 | 0.00989453807245586 | 120111.856789091 |
| 3 | 2021-07-01 | 0.0151319339712031 | 183689.695545334 |
| 4 | 2022-01-01 | 0.0195072800523586 | 236802.932166801 |
| 5 | 2022-07-01 | 0.0231004503453291 | 280421.174118849 |
| 6 | 2023-01-01 | 0.0261900809071921 | 317926.842484584 |

Three things about this table deserve a moment each.

Both coordinates are cumulative. $F$ counts everything withdrawn since first oil and $E_t$ counts the expansion since initial pressure. Neither can go backwards while the field is producing and the pressure is falling, so the points march steadily outward from the origin in survey order. A material balance plot has an arrow of time built into it, and that is unusual and useful: if a point sits inboard of an earlier one, you have a data problem, not a reservoir.

The axis ranges are wildly different. The $x$ values live between zero and about 0.026, the $y$ values between zero and about three hundred thousand. That is not a defect, it is the unit system: expansion is quoted per stock tank barrel of original oil, so it is a small number, and the slope that connects the two is twelve million. Any plotting tool will scale the axes for you. Do not be tempted to rescale the physics to make the numbers look comfortable.

Row 0 is the origin exactly, and the engine excludes it from the regression. It carries no information, because $F = 0$ and $E_t = 0$ is true of every tank ever drilled regardless of how much oil it holds. It is also undefined as a ratio, since you cannot divide by zero expansion. The fit therefore runs on six points, and the engine reports $n = 6$.

## What the plot looks like

Six points in a line from the bottom left to the top right, with no visible thickness to the line at all. The spacing between them is not even. The surveys are six months apart in time, but the pressure lost in each of those six month periods runs 162.261240122535, 254.823698080854, 220.772200660553, 184.434173330160, 151.463079794490 and 130.237345344412 psi, rising once and then falling away as the production rate declines. Uneven spacing along a straight line is normal and means nothing at all about the tank. The line does not care how fast you walk along it, only where you end up.

## Work one point against the fit

The fitted slope on Ekene is $N = 12139208.1074968$ stb. Use it to predict where survey 4 should have landed, then compare with where it did land.

Predicted withdrawal at survey 4:

$$F_{\text{pred}} = N \, E_t = 12139208.1074968 \times 0.0195072800523586 = 236802.932166802 \ \text{rb}$$

Observed withdrawal at survey 4: $236802.932166801$ rb.

Residual, which is observed minus predicted:

$$-1.74622982740402 \times 10^{-9} \ \text{rb}$$

Under two billionths of a reservoir barrel out of two hundred and thirty six thousand. There is no physical way to describe a miss that small, because no gauge, meter or allocation system in the industry resolves anything close to it. It is not a small error, it is the absence of one.

The other five residuals are the same size and alternate in sign: $+6.98491930961609 \times 10^{-10}$, $-1.65891833603382 \times 10^{-9}$, $-1.39698386192322 \times 10^{-9}$, $-1.74622982740402 \times 10^{-9}$, $+9.89530235528946 \times 10^{-10}$ and $-4.07453626394272 \times 10^{-10}$ rb. Alternating signs at the last representable digit is the signature of rounding in the arithmetic itself, not of any misfit. This is teaching data with no measurement noise in it, and it is built that way on purpose so that when you meet a real plot you know exactly what perfection looks like and can measure your departure from it.

## See it in the panel

{{panel:mb-tank-explorer}}

Leave the aquifer selector on none, which is the setting the Ekene data calls for. The table gives you the six rows above with $F$, $E_o$, $E_{fw}$, $E_t$ and the ratio $F/E_t$ per survey. The scatter plot puts the six points on the $F$ against $E_t$ axes with the fitted line drawn through them.

Do three things with it. Hover each point and read its coordinates against the table above. Notice that the fitted line, extended back to the left, arrives at the origin rather than crossing an axis somewhere else. Then check the tile that reports the number of points in the fit and confirm it says six, not seven, and that you can say why.

## Reading a plot you did not make

When someone hands you an $F$ against $E_t$ plot, read it in this order before you read any number off it.

How many points, and over what pressure range? Two points near each other define a line but test nothing. Ekene's six points span 1104 psi of drawdown, which is a real lever arm.

Do the points curve? A straight run of points supports the closed tank model. A run that bends upward as it goes out does not, and lesson 4 is about that shape.

Does the trend aim at the origin? If the points are straight but the line they define would cross the $y$ axis well above zero, then some withdrawal is being explained by something other than expansion, and the model in front of you is not the model the data wants.

Only after those three questions should you write down a slope.

## Exercise

Predict $F$ at survey 1 by multiplying $N = 12139208.1074968$ stb by that survey's $E_t = 0.00384933588106068$ rb/stb. Compare your answer against the observed $46727.8893358510$ rb and state the residual in reservoir barrels.

Then do the same at survey 6 and compare the two residuals. Survey 6 has almost seven times the withdrawal of survey 1. Is its residual seven times larger? Explain in one sentence what that tells you about where the error in this dataset comes from.
