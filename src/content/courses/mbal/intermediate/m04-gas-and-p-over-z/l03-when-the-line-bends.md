# When the line bends

A volumetric gas tank gives a straight $p/z$ line. A gas tank with an aquifer does not, and the way it fails is worth studying in detail, because the failure is gentle, the plot still looks convincing, and the answer it hands you is too big.

## The mechanism

Water entering the reservoir occupies pore space that gas used to occupy. The gas is therefore confined to a smaller volume than a volumetric tank would give it, and a gas confined more tightly is a gas at higher pressure. The reservoir pressure does not fall as far per unit of gas produced as it otherwise would.

So $p/z$ stays high, and stays higher as the years pass, and the points curve away from the volumetric line in the upward direction. The curvature is upward, meaning the trend is shallower than it should be, meaning the extrapolation to the axis travels further before it gets there, meaning the apparent gas in place is too large.

Every step of that chain runs the same way. Water influx makes a gas reservoir look bigger than it is. There is no version of this error that is conservative.

## The published case, measured against its own truth

Here is the actual $p/z$ history of the Pletcher reservoir beside the volumetric reference line built from the true 100.8 Bcf and the initial $p/z$ of $5728.19871336669$ psia.

| year | $G_p$ Bcf | actual $p/z$ | volumetric $p/z$ | held up by | percent |
|---|---|---|---|---|---|
| 0 | 0.000 | 5728.19871336669 | 5728.19871336669 | 0 | 0 |
| 2 | 10.950 | 5188.35938971558 | 5105.93903170632 | 82.4203580092553 | 1.61420568278333 |
| 4 | 21.900 | 4624.85230405672 | 4483.67935004595 | 141.172954010764 | 3.14859611915194 |
| 6 | 32.850 | 4037.34312825222 | 3861.41966838558 | 175.923459866638 | 4.55592696403781 |
| 8 | 43.800 | 3430.00732907549 | 3239.15998672521 | 190.847342350277 | 5.89187762050691 |
| 10 | 54.750 | 2803.69858645977 | 2616.90030506484 | 186.798281394931 | 7.13815046883500 |

The gap in psia grows quickly and then flattens, but the gap as a percentage of where the tank should be climbs the whole way, from nothing to $7.13815046883500$ percent. That is the curvature, and it is monotone.

## What a straight line through the curve tells you

Now do what an engineer with no simulator and no truth value would do. Fit a straight line to the eleven measured points and extrapolate to the axis.

**All eleven points.** Least squares gives a slope of $-53.4643621104832$ psia per Bcf and an intercept of $5770.10623677492$ psia, so the $x$ intercept is

$$\frac{5770.10623677492}{53.4643621104832} = 107.924344535358 \ \text{Bcf}$$

Against the true 100.8 Bcf that is $7.06780211841055$ percent too high. The $R^2$ of that fit is $0.999329425941439$.

Sit with that $R^2$ for a moment. A fit that agrees with its data to better than a part in a thousand has just overstated the gas in place by seven percent. Nobody looking at the plot would call it curved. It is curved.

**The early points only, years 0 to 3.** These are the points a team would have during appraisal, before much water has arrived. The fit gives an $x$ intercept of $114.976909090015$ Bcf, $14.0643939385072$ percent too high, with an $R^2$ of $0.999907270407081$.

**The late points only, years 7 to 10.** The fit gives $104.192263819490$ Bcf, $3.36534109076404$ percent too high, with an $R^2$ of $0.999951627453454$.

Line those three up and the pattern is the opposite of reassuring:

| points used | apparent OGIP Bcf | error | $R^2$ |
|---|---|---|---|
| years 0 to 3 | 114.976909090015 | +14.0643939385072 % | 0.999907270407081 |
| all eleven | 107.924344535358 | +7.06780211841055 % | 0.999329425941439 |
| years 7 to 10 | 104.192263819490 | +3.36534109076404 % | 0.999951627453454 |

The two fits with the highest $R^2$ are the two with the largest and the smallest errors. $R^2$ carries no information at all about which of these three answers is closest to 100.8 Bcf. It measures how well a line describes the points you gave it, and every short arc of a gentle curve is described beautifully by a line.

The Associate tier made this point on the oil side: a straight line does not validate your constants. Here it is again in a different fluid system. Straightness tests internal consistency and nothing else.

## The diagnostic that does work

The $p/z$ plot has an anchor the fit does not know about. At $G_p = 0$ the line must pass through $p_i/z_i$, and you measured that: $5728.19871336669$ psia.

The eleven point fit returns an intercept of $5770.10623677492$ psia. It misses the known initial point by $41.9075234082293$ psia, upward.

That is a genuine, model-independent warning, available with no aquifer model, no simulator and no truth value. A volumetric tank's fitted line runs through its own initial condition. When the fitted intercept sits above the measured $p_i/z_i$, the trend through your later points is too shallow for the tank to be closed, and something is holding the pressure up. Check the intercept against the anchor on every gas plot you fit. It costs one subtraction.

The other diagnostics from module 1 apply unchanged: a drifting $F/E_t$ ratio, a rising water cut, and any independent geological evidence of a water leg.

## What it costs

Follow the seven percent through to a reserves statement.

At year ten this reservoir has produced 54.75 Bcf. If the gas in place is the true 100.8 Bcf, the gas still to be recovered from the tank is $46.05$ Bcf. If you booked the naive line's $107.924344535358$ Bcf, you would claim $53.1743445353578$ Bcf remaining.

The overstatement in the gas in place is 7.07 percent. The overstatement in the remaining reserves is $15.4708893275957$ percent, because the error lands entirely on the part you have not produced yet. Booking errors always concentrate in the remainder, and the further into depletion you are when you make one, the worse the concentration.

And that is from an aquifer carrying only 3.3 percent of the drive, as lesson 1 showed. A weak aquifer is not a small problem. It is a small term with a large lever, because it acts on the slope of an extrapolation rather than on the size of the answer directly.

## Exercise

Take the four measured points for years 4 to 7: $p/z$ values of $4624.85230405672$, $4333.73469797311$, $4037.34312825222$ and $3735.89982407120$ psia at cumulative production of 21.900, 27.375, 32.850 and 38.325 Bcf.

Fit a straight line to those four points by least squares, extrapolate to the $x$ axis, and report the apparent gas in place and its error against the true 100.8 Bcf. Then compare your fitted intercept against the measured $p_i/z_i$ of $5728.19871336669$ psia and report the miss.

Then answer two questions in words. First, where does your four point answer fall relative to the early window and the late window in the table above, and what does that tell you about how the apparent gas in place moves as more history accumulates? Second, a colleague argues that since the late window gives the smallest error, the right practice is to always fit the most recent four points. Give the strongest argument you can against that rule.
