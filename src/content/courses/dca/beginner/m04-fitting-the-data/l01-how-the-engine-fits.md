# How the engine fits

You have met the three Arps models as formulas you evaluate forward: give me qi, Di and b, and I will tell you the rate at any time. Fitting is the same relationship run backward. The data hands you the rates, and the job is to find the qi, Di and b that reproduce them. This lesson is about how the engine actually does that, because a fit you treat as a black box is a fit you cannot defend.

## The problem, and the trick

None of the three models is a straight line in time. An exponential curves down, a harmonic curves down differently, a hyperbolic sits between them. Fitting a curved function directly is awkward, but each Arps form has an exact change of variables that turns it into a straight line, and straight lines are something least squares solves in one step.

For the exponential, take the natural logarithm of the rate:

$$\ln q = \ln q_i - D_i\,t$$

Plot $\ln q$ against time and exponential data falls on a line whose slope is $-D_i$ and whose intercept is $\ln q_i$.

For the harmonic, take the reciprocal:

$$\frac{1}{q} = \frac{1}{q_i} + \frac{D_i}{q_i}\,t$$

Reciprocal rate against time is a line with intercept $1/q_i$ and slope $D_i/q_i$.

For the hyperbolic, raise the rate to the power $-b$:

$$q^{-b} = q_i^{-b} + b\,D_i\,q_i^{-b}\,t$$

This is also a line, but only if you already know $b$, because $b$ appears in the transform itself. That is the hyperbolic's special difficulty, and the engine meets it head on: it tries $b$ = 0.05, 0.10, 0.15 and so on in steps of 0.05 up to 2, runs the straight-line fit at each candidate, and keeps the $b$ whose fit reproduces the rates best.

In every case the engine fits the transformed variable by ordinary least squares, reads the slope and intercept of the best line, and back-transforms them into qi and Di.

## The clock starts at the first point

One convention matters and is easy to miss. Time in the fit is measured in days from the first data point being fitted, not from any calendar anchor. The first sample sits at $t = 0$, and every Di the engine reports is per day on that clock. Feed the engine a different stretch of data and the clock starts somewhere else. Keep this in mind whenever you compare a fitted qi with a rate table: qi is the model rate at the first fitted point.

## Work one slope by hand

Take Ekene-1, the exponential well. Its first monthly row is 2020-01-01 at exactly 120 stb/d, and its second is 2020-02-01, which is 31 days later, at 115.61801032730659 stb/d.

Take logarithms:

$$\ln(120) = 4.787491742782046$$

$$\ln(115.61801032730659) = 4.750291742782046$$

The drop is 0.037200000000000 over 31 days. Divide:

$$\frac{0.0372}{31} = 0.0012 \text{ per day}$$

That is the planted decline of Ekene-1, recovered from two points with a calculator. The full engine fit uses all the points and a proper regression, but the structure is exactly this: log, difference, divide.

Now do it yourself over a longer baseline before reading on. The rate one year in, at $t = 365$ days, is 77.4390939428753 stb/d. Take its logarithm, subtract from 4.787491742782046, and divide by 365. You should get 0.0012 per day again, because on this data the line is exact everywhere.

## What Auto-Select does

The panel and the capstone let you choose a model family, or leave the choice to Auto-Select. Auto-Select is not clever: it fits all three families and returns the one with the lowest RMSE, the root-mean-square misfit between the fitted curve and the measured rates, in rate units. Lowest misfit wins. On clean data that verdict is emphatic. On scattered field data the margin between families can be thin, which is a story the next two lessons pick up.

## Two things the engine is not doing

**It is not drawing a curve through your points.** It is solving a regression. Every point in the fitted window pulls on the answer, and a point you should not have included pulls just as hard as one you should. In this course the valid window for every Ekene producer is the primary window, the months before the waterflood response begins, and the fits you will defend are fits of that window.

**It is not fitting the rates directly.** It fits the transformed variable, log or reciprocal or power, and what is best in the transformed space is what the regression optimizes. The engine then reports R2 and RMSE back on the original rate scale so you can judge the result in barrels per day. The distinction rarely changes a beginner-level answer, but knowing it is there is part of owning the tool.

## Exercise

Ekene-5 is the harmonic well, with qi = 100 stb/d and Di = 0.0015 per day planted. Its rate at $t = 365$ days is 64.6203554119548 stb/d. Compute the reciprocals of both rates: $1/100 = 0.01$ and $1/64.6203554119548 = 0.0154750$. Confirm the slope of the reciprocal line, $(0.0154750 - 0.01)/365$, times qi = 100, returns 0.0015 per day. You have just run the harmonic linearization by hand, which is everything the engine does with thirty-one points instead of your two.
