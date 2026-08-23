# Sources of Rw

If $R_w$ rules the answer, the Expert's first job is knowing where an $R_w$ can come from and what each source is worth. There are four classic routes. None of them is beyond suspicion on its own, and that is precisely why the professional habit is to run more than one.

## Route 1: a measured water sample

The most direct evidence is formation water in a bottle: produced water from a test, or a sample recovered by a formation tester. The lab measures its resistivity directly in a resistivity cell. Nothing beats a direct measurement for authority, but two caveats travel with it.

First, the lab measures at lab temperature. Resistivity of brine falls steeply as temperature rises, and the formation is far hotter than the bench. A lab value used without temperature correction is not slightly wrong, it is wrong by a large factor; the typewell's sample reads 0.114 ohm.m at 75 degF but only about 0.0499 ohm.m at the 180 degF formation temperature. Module 2 builds this correction.

Second, the sample must actually be formation water. Samples recovered early in a test can be cut with mud filtrate; produced water from a commingled well can mix aquifers. A pristine-looking lab report says nothing about what went into the bottle.

## Route 2: the SP log

The spontaneous potential log responds to the salinity contrast between mud filtrate and formation water. Read the static SP deflection in a clean bed, know the filtrate resistivity, and the deflection converts to an equivalent formation water resistivity. This is an in-situ measurement made against the very water in the pores, which is its great strength: no bottle, no contamination question.

Its weakness is the chain of conversions. The reading needs a clean thick bed, a usable shale baseline, and a quicklook chain that treats equivalent and true resistivities as interchangeable. Each link is an approximation. Module 3 walks the chain and its limits. On the typewell the SP quicklook gives about 0.0498 ohm.m.

## Route 3: the Pickett fit

You built this one in the Professional tier: in a known water leg, Archie collapses to a straight line on log-log axes, and the intercept term is the product $a R_w$. The typewell's six-point fit over 2075 to 2078 m gave $a R_w = 0.0500$ ohm.m with $m = 2.000$.

The Pickett route is also in-situ, and it uses the deep resistivity itself, the same measurement the saturations will be computed from. But it has its own dependencies: you must have a genuine water leg, the fit returns $a R_w$ entangled as one product rather than $R_w$ alone, and a shaly or thin leg bends the line. It validates; it does not originate.

## Route 4: catalogs and offsets

Regional water catalogs, offset-well studies and produced-water databases tell you what $R_w$ tends to be in this aquifer and depth range. This is context, not proof: aquifers vary laterally, and a catalog value settles nothing on its own. Its proper use is as a sanity check. If your three measured routes agree with each other but sit far outside the regional range, something interesting or something wrong is happening, and either way you should find out which.

## Independence is the point

Look at how differently the three measured routes can fail. The lab sample fails by contamination or a skipped temperature correction. The SP fails by a bad baseline or a broken approximation in the chain. The Pickett fails by a misidentified water leg or a wrong $m$. There is no single mistake that breaks all three the same way and leaves them agreeing on the same wrong number.

That is what triangulation buys. On the typewell the three routes will land at 0.0499, 0.0498 and 0.0500 ohm.m, a spread of well under one percent. When independent estimates with independent failure modes agree that closely, the number is no longer an assumption; it is a finding. When they disagree, the pattern of disagreement tells you which route broke, and module 4 teaches that diagnosis.

## Exercise

Classify each route as in-situ or ex-situ, and name its characteristic failure mode: lab sample, SP quicklook, Pickett fit, regional catalog. Self-check: lab is ex-situ (contamination, temperature correction skipped); SP is in-situ (baseline and chain approximations); Pickett is in-situ (wrong water leg, entangled $a R_w$); catalog is neither a measurement of this well at all (lateral aquifer variation). Then state in one sentence why three agreeing routes are stronger evidence than one route measured three times.
