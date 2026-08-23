# The workflow end to end

You have now met every piece of the beginner interpretation loop in isolation. This lesson assembles them into one pipeline and walks a single depth sample through it from raw curves to a pay decision. The point to internalise is that the workflow is a chain: every step consumes the output of the step before it, so the order is fixed and an error made early flows through everything downstream.

## The pipeline in order

The beginner workflow has four stages:

1. **Shale volume.** The gamma ray curve is normalised to the gamma ray index $IGR = (GR - GR_{clean}) / (GR_{clay} - GR_{clean})$, then converted to shale volume with the Larionov tertiary transform $V_{sh} = 0.083\,(2^{3.7\,IGR} - 1)$.
2. **Porosity.** The bulk density curve is converted to density porosity with $\phi_D = (\rho_{ma} - \rho_b) / (\rho_{ma} - \rho_{fl})$.
3. **Water saturation.** Deep resistivity and the porosity from stage 2 feed the Archie equation $S_w = \left(\dfrac{a\,R_w}{\phi^m\,R_t}\right)^{1/n}$.
4. **Cutoffs and summaries.** Each sample is tested against the three cutoffs. Samples that pass all three are flagged as pay, and the flagged samples are summed and averaged into zone summaries.

Notice what the chain implies. Saturation cannot be computed before porosity, because $\phi$ sits inside the Archie equation. The pay flag cannot be set before all three of $\phi$, $V_{sh}$ and $S_w$ exist for the sample. If your clean and clay lines are wrong, your $V_{sh}$ is wrong, your pay flags are wrong, and your net pay is wrong, even though the porosity and saturation arithmetic was faultless.

## The typewell parameter set

Every number the workflow needs is a given constant on the typewell. Keep this table beside you for the rest of the course:

| Parameter | Symbol | Value |
|---|---|---|
| Matrix density | $\rho_{ma}$ | 2.65 g/cc |
| Fluid density | $\rho_{fl}$ | 1.00 g/cc |
| Clean sand gamma ray | $GR_{clean}$ | 20 API |
| Clay gamma ray | $GR_{clay}$ | 120 API |
| Vsh method | | Larionov tertiary |
| Formation water resistivity | $R_w$ | 0.05 ohm.m |
| Tortuosity factor | $a$ | 1 |
| Cementation exponent | $m$ | 2 |
| Saturation exponent | $n$ | 2 |
| Porosity cutoff | | $\phi \ge 0.08$ |
| Shale cutoff | | $V_{sh} \le 0.5$ |
| Saturation cutoff | | $S_w \le 0.6$ |

## Worked example: one sample, every step

Take the sample at 2020 m, inside SAND_A. Its raw readings are $GR = 20$ API, $\rho_b = 2.3035$ g/cc and $R_t = 9.2554$ ohm.m.

**Step 1, shale volume.** $IGR = (20 - 20)/(120 - 20) = 0$. The Larionov tertiary transform of zero is zero, so $V_{sh} = 0$. This is a clean sand sample.

**Step 2, porosity.**

$$\phi_D = \frac{2.65 - 2.3035}{2.65 - 1.00} = \frac{0.3465}{1.65} = 0.2100$$

**Step 3, saturation.** With $a = 1$, $m = 2$, $n = 2$:

$$S_w = \sqrt{\frac{1 \times 0.05}{0.2100^2 \times 9.2554}} = \sqrt{\frac{0.05}{0.4082}} = \sqrt{0.1225} = 0.3500$$

**Step 4, cutoffs.** Porosity: $0.2100 \ge 0.08$, pass. Shale: $0 \le 0.5$, pass. Saturation: $0.3500 \le 0.6$, pass. All three tests pass, so this sample is flagged as pay and its half metre of section contributes to SAND_A's net pay and to its thickness-weighted averages.

Run over every sample in the zone, the same arithmetic produces the SAND_A summary you have seen before: 20.5 m gross, 18.0 m net, net-to-gross 0.878, average porosity 0.208 and average water saturation 0.361.

## Why the order matters

It is worth pausing on how each stage leans on the previous one. The Archie result at 2020 m is only meaningful because the porosity fed into it was computed first, with sensible matrix and fluid densities. The pay flag is only meaningful because all three property curves existed at that depth. When an interpretation looks wrong, trace the chain backwards: check the pay flags, then the saturation inputs, then the porosity inputs, then the shale volume lines. The fault is almost always at the earliest stage where an input was mis-set, and everything after it is contaminated.

The Learning Mode app runs exactly this pipeline with exactly these parameters, so you can reproduce every number in this lesson by opening the petrophysics app and reading the curves at 2020 m.

## Exercise

The sample at 2020.5 m reads $GR = 20$ API, $\rho_b = 2.30515$ g/cc and $R_t = 9.3442$ ohm.m. Walk it through all four stages by hand: compute $V_{sh}$, $\phi_D$ and $S_w$, apply the three cutoffs, and state whether the sample is pay. Check yourself: you should get $V_{sh} = 0$, $\phi_D \approx 0.209$, $S_w \approx 0.350$, and a pay flag of yes.
