# Quality control

An interpretation that has not been quality controlled is a guess with extra arithmetic. The habits in this lesson take a few minutes per well and catch the large majority of blunders before anyone books reserves against them. Make them automatic: run the checks first, then trust the numbers.

## Check the raw curves before computing anything

Every log curve has a physically plausible range, and readings outside it mean tool trouble, unit trouble or data-loading trouble. On the typewell the sensible windows are:

- **Gamma ray** between 0 and 200 API. On this well the curve actually spans 20 API in the cleanest sand to 120 API in the shale, matching the clean and clay lines.
- **Bulk density** roughly between 1.9 and 2.9 g/cc in sedimentary section. The typewell reads about 2.30 g/cc in porous sand and 2.55 g/cc in shale. A value of 1.0 g/cc means the tool read mud; a value like 23.0 means a decimal or unit slip.
- **Deep resistivity** must be positive and finite. Zeros, negatives or absurd spikes will poison the Archie equation, which divides by nothing gracefully.

A one-minute scan of minimum and maximum per curve, plus a look at the plotted logs, covers this.

## Look for bad hole

The density tool is a pad device and needs contact with the borehole wall. Where the hole is washed out the pad reads mud and the density drops sharply, which the workflow would happily convert into fake porosity. The standard tell is the caliper curve reading far over bit size, accompanied by a density spike toward low values. Where you see that signature, treat the density porosity as suspect and exclude or repair the interval rather than let it inflate a zone average.

## Use the water leg as a built-in calibration

The typewell has a known water leg between 2075 and 2078 m, a porous sand interval that is fully water saturated. A correct parameter set must compute $S_w \approx 1$ there. Run the check: with $R_w = 0.05$ ohm.m and the standard Archie constants, the water leg on this well does come out at saturations near 1.0. That single observation validates the given $R_w$ better than any assumption could. If your water leg computed $S_w = 0.6$, the honest conclusion is that an input is wrong, and $R_w$ is the first suspect.

## Worked example: the shale as a second calibration point

Known lithologies are calibration points, and the shale at the top of the log is the easiest one. At 2000 m the typewell reads $GR = 120$ API, $\rho_b = 2.55$ g/cc and $R_t = 2$ ohm.m. Check what the workflow makes of it:

$$IGR = \frac{120 - 20}{120 - 20} = 1 \quad\Rightarrow\quad V_{sh} = 0.083\,(2^{3.7} - 1) \approx 0.996$$

$$\phi_D = \frac{2.65 - 2.55}{1.65} = 0.0606$$

Shale volume near 1 and apparent porosity near 6 percent are exactly what a shale should produce. The cutoffs then reject the sample twice over, on $V_{sh}$ and on $\phi$. If your shale interval were computing $V_{sh} = 0.5$, your clay line is set too high and every shale volume in the well is understated.

## Cross-check the summaries by eye

After the zone summaries are computed, hold them against the log picture. SAND_A is a thick, clean, low-resistivity-contrast sand and its summary says net-to-gross 0.878 with porosity 0.208. That agrees with what the curves show. SAND_B is gross 30.5 m but only 5.5 m net, and a glance at the logs shows why: much of the zone has porosity below the 0.08 cutoff and saturations near the 0.6 limit. If a summary surprises you, the log display is the arbiter; find the samples that drove the number before accepting or rejecting it.

## The reusable checklist

1. Curve ranges plausible: GR, density and resistivity all inside physical windows.
2. Bad hole identified: caliper over gauge with density spikes flagged and excluded.
3. Water leg computes $S_w \approx 1$, validating $R_w$.
4. Shale computes $V_{sh} \approx 1$ and low $\phi_D$, validating the clay line.
5. Clean sand computes $V_{sh} \approx 0$, validating the clean line.
6. Zone summaries agree with the visual log character.

Only after all six pass should the numbers leave your desk.

## Exercise

A colleague hands you an interpretation of the typewell in which the water leg at 2075 to 2078 m computes an average $S_w$ of 0.71. List the checklist items this fails, name the most likely mis-set parameter, and state the direction of the error (is their $R_w$ too high or too low?). Check yourself: computed water-leg saturation below 1 with everything else fixed means the $R_w$ they used is too low.
