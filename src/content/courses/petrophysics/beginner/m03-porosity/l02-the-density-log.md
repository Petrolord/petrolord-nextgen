# The density log

The density log is the workhorse porosity measurement in most clastic reservoirs, and it is the one this course uses to compute porosity on the typewell. Understanding how the tool works, and what the one-line porosity equation assumes, keeps you from treating its output as magic.

## How the tool measures bulk density

The density tool carries a chemical gamma ray source (traditionally caesium-137) pressed against the borehole wall on a pad, with two gamma detectors at fixed spacings above it. Gamma rays entering the formation scatter off electrons by Compton scattering, and the count rate arriving back at the detectors falls as the electron density of the rock rises. Electron density tracks bulk mass density closely for common minerals and fluids, so after calibration the tool reports **bulk density**, written $\rho_b$ and logged as the RHOB curve in g/cc.

Two practical points follow from the physics. First, the measurement is shallow, sensing roughly the first few centimetres of formation, which is usually the invaded zone; the pore fluid it sees is mostly mud filtrate rather than native fluid. Second, the pad must stay in contact with the wall. In washed-out hole the tool partly reads mud, and a companion correction curve (DRHO) warns you when the compensation has worked hard. Lesson two of module six returns to this as a quality-control habit.

## Bulk density is a volume-weighted mix

A porous rock is a mixture of solid grains and pore fluid, so its bulk density is the volume-weighted average of the two end members:

$$\rho_b = (1 - \phi)\,\rho_{ma} + \phi\,\rho_{fl}$$

Here $\rho_{ma}$ is the **matrix density** of the solid grains and $\rho_{fl}$ is the density of the fluid filling the pores. The equation says something intuitive: a rock with zero porosity reads pure matrix, a rock of pure fluid reads the fluid, and every real rock sits on the straight line between them in proportion to its porosity.

## The density porosity equation

Solving that mixing line for porosity gives the density porosity equation:

$$\phi_D = \frac{\rho_{ma} - \rho_b}{\rho_{ma} - \rho_{fl}}$$

The typewell dataset supplies the two parameters as givens: $\rho_{ma} = 2.65$ g/cc, the grain density of quartz, appropriate for a clean quartz sandstone, and $\rho_{fl} = 1.0$ g/cc, fresh mud filtrate in the invaded zone the tool actually senses.

## Worked example

At 2020.0 m in SAND_A the typewell logs RHOB = 2.3035 g/cc. Applying the equation:

$$\phi_D = \frac{2.65 - 2.3035}{2.65 - 1.0} = \frac{0.3465}{1.65} = 0.2100$$

So the clean sand at 2020 m has a density porosity of 0.21, exactly the kind of value lesson one told you to expect from a good quality sandstone. Notice the mechanics: the numerator measures how far bulk density has fallen below solid rock, the denominator is the total possible drop from solid matrix to pure fluid, and their ratio is the fluid fraction.

Now the other end of the log. In the shale above SAND_A the tool reads about RHOB = 2.55 g/cc:

$$\phi_D = \frac{2.65 - 2.55}{1.65} = \frac{0.10}{1.65} = 0.0606$$

The equation dutifully reports 6 percent porosity. Treat that number with suspicion. Shale is a different mixture than the equation assumes: its grain density is lower than quartz, and much of its pore volume is clay-bound water that cannot flow. The 0.0606 is an apparent porosity produced by applying sandstone parameters to a rock that is not a clean sandstone. It is close to zero effective porosity in practice, and the cutoffs in module five will discard it anyway. The lesson is that $\phi_D$ is only as meaningful as the parameter choices behind it.

## Reading the curve

On the typewell display, watch how RHOB behaves: high and steady around 2.55 in the shales, dropping sharply to around 2.30 in SAND_A where porosity opens up, and sitting at intermediate values in the tighter SAND_B. With the equation in hand you can now read a density curve directly as a porosity curve: every 0.0165 g/cc of density drop below matrix is one porosity unit at these parameters.

## Exercise

Using $\rho_{ma} = 2.65$ and $\rho_{fl} = 1.0$:

1. Compute $\phi_D$ for RHOB readings of 2.485 g/cc and 2.155 g/cc.
2. A reading in a washed-out interval gives RHOB = 1.90 g/cc. Compute $\phi_D$ and explain why you should distrust it before booking it as reservoir porosity.

Self-check: $(2.65-2.485)/1.65 = 0.1000$ and $(2.65-2.155)/1.65 = 0.3000$. The washout gives $(2.65-1.90)/1.65 = 0.4545$, an implausibly high value for buried sandstone; the pad has likely read drilling mud in enlarged hole, so check the caliper and DRHO curves before believing it.
