# Choosing matrix and fluid values

The density porosity equation has exactly two parameters, and everything you compute with it inherits the quality of those two choices. This lesson builds the habit of choosing $\rho_{ma}$ and $\rho_{fl}$ deliberately, testing how sensitive the answer is to them, and stating them in every report.

## What the choices mean

$\rho_{ma}$ is the grain density of the solid framework. It is a mineralogical statement:

| Matrix | $\rho_{ma}$ (g/cc) |
|---|---|
| Quartz (sandstone) | 2.65 |
| Calcite (limestone) | 2.71 |
| Dolomite | 2.87 |

$\rho_{fl}$ is the density of the fluid the tool actually senses. Because the density measurement is shallow, that fluid is usually **mud filtrate** in the invaded zone. Fresh filtrate is close to 1.0 g/cc, salty filtrate can reach 1.1 g/cc or more, and any residual gas near the wellbore pulls the effective value sharply lower.

The typewell givens are $\rho_{ma} = 2.65$ and $\rho_{fl} = 1.0$: a clean quartz sandstone drilled with fresh mud, with liquid-filled pores near the wellbore. Those are the assumptions under every porosity number in this course, and both are stated in the dataset so the interpretation is reproducible.

## Sensitivity: the wrong matrix

Take the worked point from lesson two, RHOB = 2.3035 g/cc at 2020 m. With the correct quartz matrix:

$$\phi_D = \frac{2.65 - 2.3035}{2.65 - 1.0} = 0.2100$$

Now suppose an interpreter assumed limestone, $\rho_{ma} = 2.71$:

$$\phi_D = \frac{2.71 - 2.3035}{2.71 - 1.0} = \frac{0.4065}{1.71} = 0.2377$$

The same log reading now claims 0.2377, about 2.8 porosity units too high. Over the 18 m of SAND_A pay that error inflates pore volume by roughly 13 percent, and it will inflate the hydrocarbon volume estimate by a similar factor before saturation is even considered. The direction is general: assuming a matrix heavier than the real one raises computed porosity, assuming one lighter lowers it, and it can drive clean low-porosity readings negative. A porosity log that dips below zero in a known tight streak is often confessing a matrix mismatch.

## Sensitivity: the fluid

Fluid density errors matter most where porosity is high, because $\rho_{fl}$ only enters multiplied by pore volume. Repeat the 2020 m point with salty filtrate at $\rho_{fl} = 1.1$:

$$\phi_D = \frac{2.65 - 2.3035}{2.65 - 1.1} = \frac{0.3465}{1.55} = 0.2235$$

A little over one porosity unit high. Now consider gas. If invasion is shallow and gas remains in the sensed zone, the effective fluid density might be 0.7 g/cc or lower, and using 1.0 then **understates** the denominator's true span while the light gas has already **lowered** RHOB, so the computed $\phi_D$ overshoots true porosity. This is the same physics behind the gas crossover of lesson three, now seen from the density side.

## Choosing well in practice

The professional habits are simple:

1. **Tie matrix to known lithology.** Core grain-density measurements, cuttings descriptions and regional knowledge fix $\rho_{ma}$ better than any assumption. Absent all of that, the neutron-density overlay pattern itself hints at lithology.
2. **Tie fluid to the mud system.** The mud report tells you filtrate salinity, hence density. Flag any interval where gas may survive in the invaded zone.
3. **Test the sensitivity.** Recompute a key zone with the plausible alternative values, exactly as done above, and report the spread. If the answer moves more than the decision can tolerate, say so.
4. **State the parameters.** Every table of porosity in a report should carry its $\rho_{ma}$ and $\rho_{fl}$. An unlabelled porosity is unauditable, and module six will hold you to this standard in the capstone write-up.

The typewell makes this easy by handing you defensible parameters. Real wells will not, and the two-line sensitivity check you just learned is the fastest insurance available in log analysis.

## Exercise

A sand logs RHOB = 2.40 g/cc.

1. Compute $\phi_D$ with quartz parameters ($\rho_{ma} = 2.65$, $\rho_{fl} = 1.0$).
2. Recompute with dolomite by mistake ($\rho_{ma} = 2.87$, same fluid).
3. State the size and direction of the error in porosity units.

Self-check: quartz gives $(2.65-2.40)/1.65 = 0.1515$; dolomite gives $(2.87-2.40)/1.87 = 0.2513$. The wrong heavy matrix reads about 10 porosity units too high, a two-thirds overstatement of storage.
