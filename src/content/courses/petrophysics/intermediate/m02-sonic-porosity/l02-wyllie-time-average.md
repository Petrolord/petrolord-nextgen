# The Wyllie time average

The oldest and still the most used sonic porosity transform is the time average published by Wyllie and co-workers in the 1950s. It rests on one idealisation, travels in one line of algebra, and you should be able to derive it from scratch rather than memorise it.

## The series-path assumption

Imagine one metre of rock as two segments laid end to end along the wave path: a fraction $\phi$ of fluid and a fraction $1 - \phi$ of solid matrix. If the wave crosses them in series, the total transit time is simply the sum of the time spent in each segment, weighted by its length:

$$\Delta t = \phi\,\Delta t_{fl} + (1 - \phi)\,\Delta t_{ma}$$

That is the whole physical content of the model: measured transit time is a volume-weighted average of the fluid time and the matrix time. Solve for porosity:

$$\phi_S = \frac{\Delta t - \Delta t_{ma}}{\Delta t_{fl} - \Delta t_{ma}}$$

The structure should look familiar. It is the same two-anchor linear interpolation you used for density porosity and for IGR: a measured value positioned between a matrix end point and a fluid end point. The sonic version simply uses time anchors instead of density anchors.

## Worked example

Take the clean mid SAND_A sample at 2020 m, where DT is 281.54 us/m, with the typewell anchors $\Delta t_{ma} = 182$ and $\Delta t_{fl} = 656$ us/m. Step by step:

1. Numerator: $281.54 - 182 = 99.54$ us/m of excess transit time over pure matrix.
2. Denominator: $656 - 182 = 474$ us/m, the full span from matrix to fluid.
3. Divide: $99.54 / 474 = 0.2100$.

So the Wyllie sonic porosity at 2020 m is 0.2100, or 21.0 porosity units. Now recall the density porosity at the same depth: RHOB is 2.3035 g/cc, and $(2.65 - 2.3035)/(2.65 - 1.0) = 0.2100$ as well. Two tools running on entirely different physics, nuclear scattering and acoustic travel time, land on the same answer in this clean, water-and-oil-filled, well-compacted sand. Agreement of independent methods is the strongest quality control an interpreter has, and this module is built around it.

## Checking the end points

As with every transform in this course, confirm the ends behave. A rock with no porosity is all matrix: set $\Delta t = 182$ and the numerator is zero, so $\phi_S = 0$. A "rock" that is all fluid: set $\Delta t = 656$ and you get $474/474 = 1$. Between the anchors the response is exactly linear: every additional microsecond per metre adds the same increment of computed porosity, $1/474 \approx 0.0021$ per us/m.

## What the model assumes, and where it breaks

The series-path picture is an idealisation, and its errors are systematic rather than random. The equation is trustworthy when the rock is consolidated and compacted, the pores are filled with liquid, and the mineralogy matches the matrix anchor. Each violated assumption has a known direction:

* Undercompaction. In shallow, geologically young, poorly compacted sands the frame itself is slow, so DT is high for reasons unrelated to porosity and the time average reads too high. The classical remedy is a compaction correction: divide the computed porosity by a factor $C_p$ greater than 1, estimated from the transit time of adjacent shales. The typewell section is compacted and needs no correction, so this course runs with $C_p = 1$; you should still recognise the term on log headers and in reports.
* Gas. Replacing liquid with gas slows the rock far beyond the linear prediction, so $\phi_S$ overshoots badly. Sonic porosity in a gas leg is not quantitative without a different model.
* Wrong matrix. Using the sandstone anchor 182 us/m in a limestone or dolomite computes porosity against the wrong baseline, exactly as a wrong $\rho_{ma}$ corrupts density porosity. Matrix values are a lithology decision, made before arithmetic.
* Shale. Clay minerals and bound water slow the rock and inflate $\phi_S$. You will see the size of this effect on the typewell in lesson four, where the 2000 m shale computes a sonic porosity of 0.1200 against a density porosity of 0.0606.

None of this makes the time average a weak tool. It makes it a tool with a documented domain: in the compacted, liquid-filled sands of this course it is accurate to within a porosity unit or two, and it survives hole conditions that ruin the density pad.

## Exercise

Compute Wyllie porosity with the typewell anchors for DT values of 229.4 and 419 us/m. As a self-check: for 229.4, the numerator is $47.4$ and $47.4/474 = 0.1000$ exactly; for 419, the numerator is $237$, which is half of 474, so $\phi_S = 0.5000$. Then state which of the two answers you would refuse to book as effective porosity in a clastic section, and why, in one sentence. Think about what kind of rock, at what state of compaction, could plausibly deliver a transit time of 419 us/m.
