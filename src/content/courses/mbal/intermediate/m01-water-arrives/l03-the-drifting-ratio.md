# The drifting ratio

Lesson 2 left the ratio column able to see a level it cannot check, and blind to an aquifer that delivers in step with the pressure drop. This lesson is about the case where the column earns its reputation, which is also the ordinary case in the field: an aquifer that takes time.

## Why time makes the column move

A real aquifer is rock, and water has to flow through rock. When the reservoir pressure falls the water leg does not arrive at once: a pressure signal propagates outward, water begins to move, and the volume delivered depends on how long the drawdown has been applied as well as on how large it is.

That changes the shape of the contamination term. Instead of tracking the drawdown, $W_e$ accumulates something like the drawdown multiplied by elapsed time, so it keeps growing even while the pressure is barely moving. Meanwhile $E_t$ is tied to the drawdown alone, and the drawdown flattens as the field ages. A quantity that keeps accumulating, divided by a quantity that is flattening, gives a ratio that climbs. That is the drift, and its direction is always upward.

## Two tanks, two magnitudes

Take the constructed tank of lesson 1, oil in place 12000000 stb, and let water cross the boundary at a rate proportional to the drawdown rather than instantaneously, with a constant $k$ in reservoir barrels per psi per day. It is a teaching construction, not an aquifer model. Here are a weak aquifer, $k = 0.05$, and a stronger one, $k = 0.25$, both read as closed tanks:

| n | days | $F/E_t$ at $k=0.05$ | excess | $F/E_t$ at $k=0.25$ | excess |
|---|---|---|---|---|---|
| 1 | 182 | 12191683.0179475 | 1.59735848289620 % | 12958415.0897377 | 7.98679241448102 % |
| 2 | 366 | 12343432.9700957 | 2.86194141746376 % | 13717164.8504783 | 14.3097070873188 % |
| 3 | 547 | 12539117.7363188 | 4.49264780265633 % | 14695588.6815938 | 22.4632390132817 % |
| 4 | 731 | 12761200.9689826 | 6.34334140818827 % | 15806004.8449130 | 31.7167070409413 % |
| 5 | 912 | 12993011.5543191 | 8.27509628599288 % | 16965057.7715957 | 41.3754814299644 % |
| 6 | 1096 | 13238914.6524684 | 10.3242887705698 % | 18194573.2623418 | 51.6214438528487 % |

Neither column ever falls, neither pauses, and both start above the truth at the very first survey.

## Reading a magnitude

Three numbers turn a drift into a statement you can write down.

**The span.** First apparent value to last, as a percentage of the first. The weak tank spans 8.58972164039356 percent, the strong one 40.4073965553924 percent. Anything above about one percent on pressures you trust is a drift rather than scatter, because measurement scatter moves a column in both directions.

**The shape.** A monotonic climb that steepens is influx. A single step is usually a data event: a new well, a reallocation, a datum correction. Read the increments, not the values. The weak tank's excess grows 1.26, 1.63, 1.85, 1.93 and 2.05 percentage points across its five steps; the strong tank's grows 6.32, 8.15, 9.25, 9.66 and 10.25.

**The share.** At the last survey the weak tank's influx is 32578.3158427595 rb out of a withdrawal of 348128.535007751 rb, or 9.36 percent. The strong tank's is 162891.579213797 out of 478441.798378789 rb, or 34.05 percent. That fraction is the water drive index in all but name.

Note how little it takes: a tenth of the drive produced a 10.3 percent error at the last survey, and a third of the drive produced a 51.6 percent overstatement.

## Two companion tests, one of which misleads

Fit the closed tank line to the strong drifting tank and the slope is 18902832.9476124 stb with an R-squared of 0.985917190048564. At 40 percent of drift the fit statistic is 0.986, because points that curve gently still correlate well. No fit statistic is going to save you.

The subset test does much better. On the weak tank the early three and late three surveys give slopes of 12651897.2678978 and 14617574.5298762 stb, a gap of 15.5366204795710 percent. On the strong tank, 15259486.3394888 and 25087872.6493813 stb, a gap of 64.4083692677021 percent. Half the data against the other half, unmissable in both cases, including the one whose R-squared was 0.9989. Run it on every water drive candidate.

The intercept is the one that will mislead you. Withdrawal is being explained by something the expansion terms do not contain, so the instinct says the fitted line should cross the withdrawal axis above zero. It does not. The weak tank returns $-8741.16069060488$ rb and the strong one $-43705.8034530246$ rb, both negative.

The reason is geometry rather than physics. Drifting data curves upward, a least squares line through upward curving points is steeper than the ray from the origin through the middle of them, and a steeper line that still passes near those points crosses the vertical axis below zero. The sign follows the curvature, not the mechanism. Use a non zero intercept as a flag, as the Associate tier taught, and do not read a direction out of its sign.

## See it in the panel

{{panel:mb-tank-explorer}}

Leave the selector on "None (the truth)" and use Ekene as the control. Compute the span of its $F/E_t$ column the way you computed the spans above. You should get a number of order $10^{-14}$, which is arithmetic and nothing else. Then run the subset test by eye: check that no group of points at either end of the fitted line sits systematically off it, because a systematic offset at one end is what a 15 percent subset gap looks like before anyone computes it.

## Worked example

A field hands you five surveys and this ratio column, in stock tank barrels: 8420000, 8910000, 9560000, 10380000, 11390000. The volumetric booking is 8100000 stb.

The span is 35.27 percent, so this is drift rather than scatter. The increments are 490000, 650000, 820000 and 1010000, growing every step, which is the accelerating shape of influx rather than the single jump of a data event. The first survey already sits 3.95 percent above the booking, because influx started before the first survey, as it always does. A least squares slope through such a column would land near ten million stb, belonging to no survey and to no reservoir.

The finding writes itself, and contains no aquifer model at all: "apparent oil in place rises monotonically from 8.42 to 11.39 million stb across five surveys, a span of 35 percent, with accelerating increments, against a volumetric booking of 8.1 million stb. This is water influx, and no closed tank oil in place should be quoted from these surveys." Complete, defensible, and available on the day the data arrives.

## Exercise

Compute the span of the weak tank's column from 12191683.0179475 and 13238914.6524684 and confirm 8.58972164039356 percent. Do the same for the strong tank against 40.4073965553924 percent.

Now the part that matters. The strong tank's influx constant is five times the weak tank's, and its overstatement at every individual survey is exactly five times larger, but its span is only 4.7 times larger. Explain in two sentences why, using the fact that the apparent value is $N + W_e/E_t$ and that the span is a percentage of a first value which has itself moved.
