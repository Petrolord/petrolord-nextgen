# The p over z line

There is one plot in reservoir engineering that a geologist, an accountant and a regulator can all read without help, and this is it. Put cumulative gas production on the horizontal axis and $p/z$ on the vertical. For a volumetric gas tank the points fall on a straight line, and where that line crosses the horizontal axis is the gas originally in place.

No slope to interpret, no units to reconcile, no coefficient to convert. The answer is a place on the $x$ axis, read off in the same units the production was measured in.

## Where the line comes from

Start from the fact that a volumetric tank is a fixed container. The reservoir pore volume available to gas does not change, so the gas that is still in the reservoir occupies exactly the volume that all the gas occupied at the start:

$$G B_{gi} = \left( G - G_p \right) B_g$$

Now use what the real gas law says about a formation volume factor. $B_g$ is a reservoir volume per standard volume, and for a fixed reservoir temperature

$$B_g \propto \frac{z T}{p}$$

so $B_{gi}/B_g = (p/z) \big/ (p_i/z_i)$. Substitute and rearrange:

$$\frac{p}{z} = \frac{p_i}{z_i} \left( 1 - \frac{G_p}{G} \right)$$

That is a straight line in $G_p$. It starts at $p_i/z_i$ when nothing has been produced, and it reaches zero when $G_p = G$, which is the whole point: the $x$ intercept is the gas in place. Its slope is $-(p_i/z_i)/G$, so the steeper the decline of $p/z$ per unit of gas produced, the smaller the tank.

Three properties make this plot unusually trustworthy.

It uses only measured quantities. Cumulative gas comes from meters. Pressure comes from gauges. The compressibility factor $z$ comes from a correlation or a lab, and it is the only piece of PVT in the entire construction. There is no $B_o$, no solution gas ratio, no bubble point.

It has a known anchor. You know one point on the line exactly: at $G_p = 0$ the value is $p_i/z_i$, and both of those come from the initial survey. A fitted line that misses its own anchor is telling you something, and lesson 3 makes use of that.

It fails visibly. A tank that is not volumetric does not produce a slightly worse straight line. It produces a curve, and a curve is something you can see.

## Worked example: the volumetric reference line

Take the Pletcher case. At the initial 6411 psia the compressibility factor is $1.1192$, so

$$\frac{p_i}{z_i} = \frac{6411}{1.1192} = 5728.19871336669 \ \text{psia}$$

The true gas in place is known to be 100.8 Bcf, so a volumetric tank holding that gas would decline along a line of slope

$$\frac{5728.19871336669}{100.8} = 56.8273681881616 \ \text{psia per Bcf}$$

Evaluate that reference line at three points in the production history:

| $G_p$ Bcf | volumetric $p/z$ psia |
|---|---|
| 16.425 | 4794.80919087614 |
| 27.375 | 4172.54950921577 |
| 54.750 | 2616.90030506484 |

Read the last row carefully. If this reservoir were volumetric, then after producing 54.75 Bcf, which is $54.3154761904762$ percent of the gas in place, its $p/z$ would have fallen to $2616.90030506484$ psia. That is a prediction, made from the true gas in place and the initial survey alone, without touching any of the intervening data.

The actual measured $p/z$ at that point is $2803.69858645977$ psia, from a pressure of 2638 psia and a $z$ of $0.9409$.

The tank is $186.798281394931$ psia higher than a volumetric tank would have been. It is not volumetric, and the reference line has just proved it. What that gap does to a gas booking is the subject of the next lesson.

## What the engine does with it

Two honest points about the engine, so you know what you are reading when you run one of these cases.

The engine computes $p/z$ at every timestep and reports it in the per-timestep results as `p_over_z`. That column is the diagnostic plot, and it is there for you to look at.

The engine's own volumetric gas solution does not, however, find the gas in place by extrapolating that plot to the axis. It regresses withdrawal $F$ against total expansion $E_t$ by least squares and reads the slope as $G$, which is the same Havlena and Odeh machinery the oil side uses. The two routes are algebraically the same statement, but they are not numerically identical, because the $F$ against $E_t$ form also carries the rock and connate water term while the classical $p/z$ line assumes it away. On a gas tank that term is worth a couple of percent, as lesson 1 showed, so the two answers sit close together rather than on top of one another.

Use the $p/z$ plot the way it is best used: as the picture that tells you what kind of tank you are looking at, and as a sanity check on whatever the regression returns. Use the regression for the number you put in a report.

## Why the intercept and not the slope

Students who have just come from the oil side sometimes try to read the gas in place off the slope of the $p/z$ line, by analogy with Havlena and Odeh, where the slope was the answer. It is worth being clear about why the analogy breaks.

On the $F$ against $E_t$ plot the axes are chosen so the unknown becomes a slope. On the $p/z$ plot the axes are the raw measurements, chosen for legibility rather than for algebra, so the unknown lands on the $x$ intercept instead. The slope of the $p/z$ line is $(p_i/z_i)/G$, which does contain $G$, but recovering it from the slope requires the initial point as well. Reading the intercept directly uses both pieces of information at once and is less sensitive to an error in either.

## Exercise

The Pletcher history reaches 3610 psia at year seven, where $z$ is $0.9663$ and cumulative production is 38.325 Bcf.

Compute the measured $p/z$ at that point. Then compute what the volumetric reference line predicts at the same cumulative production, using the initial $p/z$ of $5728.19871336669$ psia and the true gas in place of 100.8 Bcf. Report the gap in psia and as a percentage of the reference value.

Then answer this. The gap at year ten is $186.798281394931$ psia and at year seven it is smaller. Does that mean the tank is becoming more volumetric with time, and what would you need to look at before answering?
