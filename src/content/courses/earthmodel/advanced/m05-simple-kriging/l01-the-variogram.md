# The variogram

Kriging's entire personality comes from one function: how correlated two porosity values are as a function of the distance between them. This lesson fixes that function's shape, its two assumed numbers, and what the engine does with it.

{{panel:em-population-explorer}}

## Correlation with distance

The engine's spherical model, with range $R$:

$$\rho(h) = 1 - 1.5\frac{h}{R} + 0.5\left(\frac{h}{R}\right)^3 \quad (h < R), \qquad \rho(h) = 0 \quad (h \ge R)$$

At $h = 0$, correlation 1. It falls steeply at first, 0.834 at 100 m with the golden range of 900, then 0.519 at 300 m, 0.313 at 450, 0.148 at 600, and reaches EXACTLY ZERO at 900 m, staying zero beyond. The hard zero is the spherical model's signature: beyond the range, two locations are unrelated, full stop. The engine also offers an exponential model, $\rho = e^{-3h/R}$, which decays to 5 percent at the range but never touches zero; module five's probe comparisons will show what that tail is worth.

## From correlation to covariance

The kriging system runs on covariances, built from the correlation with two more numbers, the sill and the nugget:

$$C(0) = \mathrm{sill}, \qquad C(h > 0) = (\mathrm{sill} - \mathrm{nugget}) \, \rho(h)$$

Golden parameters: sill 0.0025, nugget 0.00025, range 900. The sill is the variance scale; the nugget is same-site noise, the variance you would see re-measuring at zero separation. Note carefully WHERE the nugget acts: it reduces every covariance at $h > 0$ but leaves $C(0)$ at the full sill. That asymmetry, covariance dropping discontinuously the moment you step off a data point, is the "honor the data" construction, and the whole of lesson two hangs on it. The engine validates the triple: range positive, sill positive, nugget at least zero and STRICTLY below the sill, refusing to run otherwise.

## Where the numbers came from, honestly

Nothing in four control points can estimate a variogram. A real variogram is fitted from dozens of wells' worth of pairwise differences, binned by distance; with four points there are six pairs, spanning 320 to 890 m, and no fit worth the name. The golden parameters are ASSUMED, chosen sensible for the setting, and the panel exposes range and nugget as controls precisely because they are the least-constrained inputs in the entire tier. The Expert posture toward an assumed variogram is not apology but sensitivity: run the range at 300, 900, 1800; run the nugget at 0 and at 0.002; report which conclusions survive the sweep. The panel makes each sweep one click, and the graded probe's swing across the full range sweep, about 0.002 of porosity, is itself a finding: on THIS data geometry, the range assumption is worth little, because the probe stands close to a dominant data point either way.

## Worked example

Verify one covariance by hand, W2's control point to the graded probe location (1500, 2500). Distance: $\sqrt{(1610.8719179395334 - 1500)^2 + (2200 - 2500)^2} = \sqrt{110.87^2 + 300^2} = 319.83$ m. Correlation: $u = 319.83/900 = 0.35537$; $\rho = 1 - 1.5(0.35537) + 0.5(0.35537)^3 = 1 - 0.53306 + 0.02244 = 0.48938$. Covariance: $(0.0025 - 0.00025) \times 0.48938 = 0.0011011$. That single number is most of the reason the probe's kriged value will lean toward W2's 0.2936: at 320 m, W2 retains about half its correlation with the probe, while W3 and W4, at 447 and 652 m, retain 32 and 10 percent.

## Exercise

Using the spherical formula with the golden range, compute the correlation at the three inter-well distances in block 0: W2 to W3 at 577.6 m, W2 to W4 at 442.0 m, W3 to W4 at 570.1 m (distances given, so this is three evaluations of the formula). Rank the three pairs by how strongly the kriging system will couple them, and state what happens to all three correlations if the range is dropped to 300 m.
