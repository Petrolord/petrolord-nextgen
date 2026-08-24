# Gardner when density is missing

The overburden integration wants a bulk density at every sample. Real wells rarely provide one. Density tools are run over the reservoir section and not always over the shallow hole, the top hole is often logged with sonic only, and any interval with bad hole conditions produces density readings that should be thrown away rather than integrated.

That leaves a gap in the column, and a gap cannot be skipped. The running sum carries every slice above the point of interest, so a missing interval shifts the overburden at every depth below it. You need a density value for the missing samples, and the standard way to get one is Gardner's transform.

## The relation

Gardner and co authors published the fit in 1974, from a large set of laboratory and log measurements across common sedimentary lithologies. In the metric form the engine uses, with velocity in m/s and density in kg/m3:

$$\rho = 310 \, v^{0.25}$$

The coefficient 310 pairs with metres per second. The version you will meet in older literature, $\rho = 0.23 v^{0.25}$ in g/cm3, pairs with feet per second. Mixing the two is a factor of several error that no downstream sanity check will forgive, so check which units a published coefficient belongs to before you use it.

The sonic log gives transit time rather than velocity, and the conversion is a reciprocal. Velocity in m/s is $10^6$ divided by the transit time in us/m, which is the step the engine takes before every Gardner call.

## What it returns

Four velocities through the transform, as the engine computes them:

| v (m/s) | Gardner rho (kg/m3) |
|---|---|
| 1600 | 1960.612149304395 |
| 2000 | 2073.094945426908 |
| 2500 | 2192.0310216782973 |
| 3000 | 2294.256693926084 |

The value at 1600 m/s, 1960.612149304395 kg/m3, is one of the six numbers the capstone grades, with a tolerance of 0.5 kg/m3.

Two things to read off that table. The first is a sanity check. A velocity of 1600 m/s is a soft, shallow, water rich sediment, and the transform returns just under 2000 kg/m3 for it, which is what a soft shallow sediment weighs. A transform that returned 2600 kg/m3 there would be telling you something was wrong with the input.

The second is the fourth root. Velocity nearly doubles from 1600 to 3000 m/s and the density moves only from 1960.612149304395 to 2294.256693926084 kg/m3. The exponent of 0.25 makes the relation very flat. That cuts both ways. A moderate error in your velocity produces only a small error in the density estimate, which is forgiving. It also means Gardner cannot resolve fine density detail, because large velocity contrasts are compressed into small density contrasts.

## An empirical fit, not a law

There is no physics that requires density to be the fourth root of velocity. Gardner is a curve drawn through a scatter of measurements from many lithologies at once, and its usefulness comes from the fact that the scatter, for ordinary clastics, is not large.

The lithologies it was never meant to cover are the ones that break it. Anhydrite, halite, coal and volcanics all sit well off the Gardner line, and applying the transform across a salt section produces a density that is confidently wrong. Fluid content matters too. A gas bearing sand has a velocity pulled down by the gas while its density is pulled down by rather less, so Gardner underestimates the density there.

So the rule for a sonic only interval is that you have no choice but to lean on Gardner, and you should record that you did. The engine records the provenance of every density sample it uses, marking each one as coming from the log or from Gardner, so a later reader can see which parts of the overburden curve rest on a measurement and which parts rest on an estimate. Carry that habit into your own work. A density curve with no provenance is an unauditable overburden.

## What the error does

Suppose Gardner is 50 kg/m3 light over a 500 m interval. The overburden below that interval is light by the weight of that error, and the effective stress at every depth below it is light by the same amount, because $\sigma = S - P$. At the tier above this one that effective stress feeds a pressure prognosis, so a shallow density estimate you made casually turns into a pressure error at TD.

This is the general shape of pore pressure work. Nothing is local. Every quantity is an accumulated column, so an error anywhere above your depth of interest arrives at your depth of interest intact.

## Exercise

Using the table above, describe how much the Gardner density changes as velocity goes from 1600 m/s to 3000 m/s, and state the one consequence of that behaviour that matters most when you are filling a gap in a density log.

Self check: over that velocity range, which is close to a doubling, the Gardner density rises only from 1960.612149304395 kg/m3 to 2294.256693926084 kg/m3. The fourth root makes the transform insensitive to velocity. The consequence that matters is that Gardner will hand you a plausible looking density for almost any velocity you give it, including a velocity from a washed out or gas affected interval, so the transform will not warn you about a bad input. The check has to come from you, by asking whether the returned density is sensible for the lithology and depth before it goes into the integration.
