# Fitting Ekene-1

Time to run the real thing. This lesson walks the engine through Ekene-1's primary window and reads every number it returns. Nothing here is simulated for teaching: the panel below calls the same fitArpsModel the Suite's DCA app uses, on the same committed monthly rates.

{{panel:dca-fit-explorer}}

## Set it up

In the panel, choose Ekene-1 as the well, Auto-select as the model, and Primary (pre-flood) as the fit window. Leave the rate axis on semilog.

The primary window holds 36 monthly rows, one per month from 2020-01-01 through 2022-12-01. The first row is exactly 120 stb/d. The last is 33.4312717799524 stb/d. Between them the well does nothing but decline on the curve that was planted in the fixture, which is the point: this dataset was built so that truth is recoverable, and you are about to recover it.

## Read the result

The engine returns:

- Fitted model: Exponential
- qi = 120.000000000000 stb/d
- Di = 0.0012 per day
- R2 = 1.00000000000000
- RMSE = 1.42601125915484e-14 stb/d

The planted truth for Ekene-1 is qi = 120, Di = 0.0012, exponential. The fit did not come close to the truth. It landed on it, to the last decimal place the screen can show.

## Why the recovery is exact

Three things line up. The data is noise-free by design. The exponential linearization from the last lesson is exact, not approximate, so exponential data becomes a perfect straight line in log space. And least squares run on a perfect line returns the line itself. The only residual left is floating-point arithmetic, which is what an RMSE of 1.4e-14 stb/d is: about fourteen orders of magnitude below the data. That number is not a quality achievement, it is the sound of a computer rounding.

Auto-Select, meanwhile, tried all three families. The exponential's RMSE of 1.4e-14 beat the alternatives by a margin so wide the choice was never in doubt.

Be clear about what this does and does not mean. It means the tool is honest: given data that follows an Arps curve exactly, it finds that curve exactly, so any misfit you ever see on real data is coming from the data, not the algorithm. It does not mean real fits look like this. A field rate history carries allocation error, downtime, gauge drift and operational noise, and a real R2 lives below 1 for honest reasons. This fixture follows the same teaching doctrine as the geoscience golden wells: plant the truth, so every graded number is checkable by hand.

## Check the fit with a pencil

The engine used 36 points. You can verify its answer with two.

From the previous lesson, the two-point slope between 2020-01-01 and 2020-02-01 gave Di = 0.0012 per day, and the intercept at $t = 0$ is $\ln(120)$, so qi = 120 stb/d. Same answer, two points, one division.

Now push the fitted model forward to the end of the window. The last primary row, 2022-12-01, sits 1065 days after the first. Evaluate:

$$q(1065) = 120 \times e^{-0.0012 \times 1065} = 120 \times e^{-1.278}$$

Work it: $e^{-1.278} = 0.278594$, and $120 \times 0.278594 = 33.4313$ stb/d. The fixture's row for that month reads 33.4312717799524. The model you fitted at the start of the window predicts the end of the window to the barrel, because on this well the model is the truth.

## The clock, one more time

Notice the panel reports qi = 120 and that 120 is also the first row of the data. That is not a coincidence and not a law. qi is the fitted rate at $t = 0$, and $t = 0$ is the first point inside the fitted window. Here the window starts at the well's first-ever month, so qi coincides with the well's opening rate. Fit a window that starts anywhere else and qi will be the model rate at that later start, not the well's day-one rate. When a fitted qi surprises you, check where the clock started before you blame the fit.

## Exercise

Do the full verification yourself, without the panel first. Using qi = 120 and Di = 0.0012, compute the model rate at $t = 182$ days and at $t = 730$ days. Then open the panel and compare with the fixture's rows for 2020-07-01 and 2022-01-01 by hovering the chart or reading the rate table months in the fixture: you should get 96.4564626973622 and 49.9734439224456 stb/d. If your numbers agree to at least four figures, you have both directions of the exponential model under control: data to parameters, and parameters back to data.
