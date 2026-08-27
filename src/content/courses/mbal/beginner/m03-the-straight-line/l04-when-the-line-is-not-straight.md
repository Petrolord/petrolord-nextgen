# When the line is not straight

Ekene's plot is straight, and by now that should feel unremarkable. Most tanks you will meet are not. This lesson is about how the plot fails, what the failure means, and what an Associate should do about it.

## The ratio is the test, not the picture

Reading straightness off a chart is a bad habit, because a chart can be scaled to make anything look straight. The honest test is arithmetic: compute $F/E_t$ at every survey and read the column.

| n | F/Et (stb) |
|---|---|
| 1 | 12139208.1074970 |
| 2 | 12139208.1074967 |
| 3 | 12139208.1074967 |
| 4 | 12139208.1074967 |
| 5 | 12139208.1074969 |
| 6 | 12139208.1074968 |

Six numbers that agree to fourteen significant figures, the last wobbling digits being arithmetic rounding and nothing else.

A line through the origin is exactly the statement that $y/x$ is constant. So the constancy of this column IS the straight line, expressed as a number instead of a picture. The diagnostic then writes itself: when the ratio drifts, the line is not straight, and the shape of the drift tells you what is wrong.

## Why a ratio drifts

Go back to the general balance rather than the closed tank special case. A tank that receives water from outside satisfies

$$F = N \, E_t + W_e$$

where $W_e$ is the cumulative water that has crossed into the tank, in reservoir barrels. Divide the whole line by $E_t$:

$$\frac{F}{E_t} = N + \frac{W_e}{E_t}$$

That single line contains the entire diagnostic. The number you compute survey by survey is not the oil in place. It is the oil in place plus an error term, and the error term is whatever came in from outside divided by however much the tank has expanded.

If nothing comes in, $W_e = 0$, the error term vanishes and the column is flat. That is Ekene.

If water does come in and you ignore it, the column climbs, because $W_e$ accumulates while expansion is tied to a pressure drop that grows more slowly as the field ages. A quantity that accumulates divided by a quantity that flattens gives a ratio that rises.

Notice the direction the error runs, because it is the one people get backwards. Ignored water influx makes the apparent oil in place too large, and it grows more wrong as the field ages. Water is doing work that your model attributes to oil, so your model needs more oil to do it.

## Work a drifting tank

Here is Ekene's expansion history with a steady import of water added to it. The influx used is a teaching construction rather than a reservoir model: water crosses the boundary at a rate proportional to the drawdown, 0.1 reservoir barrels per psi per day, and the running total is added to the withdrawal. Real aquifer models belong to the Professional tier.

| n | days | We (rb) | F (rb) | F/Et (stb) | excess over true N |
|---|---|---|---|---|---|
| 1 | 182 | 1476.57728511507 | 48204.4666209654 | 12522800.8442024 | 3.15994860050788 % |
| 2 | 366 | 6806.56212571357 | 126918.418914806 | 12827119.1626538 | 5.66685280510266 % |
| 3 | 547 | 16353.7879231729 | 200043.483468508 | 13219954.8219813 | 8.90294247296892 % |
| 4 | 731 | 29787.1536729069 | 266590.085839709 | 13666184.3744575 | 12.5788787327705 % |
| 5 | 912 | 46041.3672957603 | 326462.541414608 | 14132302.0345626 | 16.4186486417916 % |
| 6 | 1096 | 65156.6316855190 | 383083.474170103 | 14627044.3198556 | 20.4942216191382 % |

The true oil in place in that construction is still $12139208.1074968$ stb, unchanged. Every apparent value in the fifth column is wrong, the first by 3.15994860050788 percent and the last by 20.4942216191382 percent, and the error grows steadily with time.

See what a single division would have done. Work only the latest survey, as an engineer in a hurry does, and you book 14627044.3198556 stb. Work only the first and you book 12522800.8442024 stb. Neither is the tank, and the spread between them is invisible unless you compute the whole column.

Fitting a line through those six points is worse than either, because it returns a slope belonging to no survey at all and an intercept that is not zero, and it reports a respectable $R^2$ while doing it. Points that curve gently still correlate well.

## What an Associate does about it

Three steps, in order.

Compute the $F/E_t$ column before you fit anything. It costs one spreadsheet formula.

If the column drifts, say which way and by how much. "The apparent oil in place rises from 12.5 to 14.6 million stb across six surveys" is a complete and useful finding on its own. Do not fit a line through it and do not average it.

Then hand it on. A rising ratio is the signature of support the model does not contain, and in practice that support is nearly always water arriving from an aquifer. Quantifying it means choosing and fitting an influx model, which is the Professional tier's subject. The Associate's job is to detect the condition and refuse to book a number through it.

## The failure that leaves the line straight

Everything above is about a plot that visibly misbehaves. The nastier case is a plot that does not.

Suppose the rock and connate water term is built with the wrong grouping, $S_{wi}(c_w + c_f)$ instead of $S_{wi} c_w + c_f$, which module 2 warned about. That mistake scales $E_{fw}$ by a constant factor. $E_t$ is then still exactly proportional to drawdown, so the plot is still a perfect straight line, still through the origin, still with $R^2$ of one. Nothing on the chart moves.

The slope does. It comes back $15218421.8713497$ stb instead of $12139208.1074968$ stb, an error of $+25.3658536585366$ percent: three million barrels of oil that do not exist, booked off a plot that looks flawless.

So keep the two questions apart. Straightness asks whether your terms are consistent with your data. It cannot ask whether your terms are right. That second question is answered by checking the inputs one by one, and by the independent route module 5 builds.

## See it in the panel

{{panel:mb-tank-explorer}}

With the aquifer selector on none, read the $F/E_t$ column down the table and confirm it is flat to the digits shown. That flat column is the licence to quote a slope. Then check that no point sits systematically above or below the fitted line at either end, since a pattern at one end is how a gentle curve first announces itself.

## Exercise

Take the drifting table above. Compute the difference between the last apparent value, 14627044.3198556 stb, and the first, 12522800.8442024 stb, and express that difference as a percentage of the true 12139208.1074968 stb.

Then answer in words. If the ratio column on a real field fell steadily instead of rising, the balance would need a negative $W_e$. Water does not flow out of a producing tank into an aquifer under falling pressure, so name one thing in the bookkeeping that could produce that arithmetic anyway, and say what you would check in the data first.
