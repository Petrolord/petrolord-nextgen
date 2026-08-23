# Raymer-Hunt-Gardner

The Wyllie time average is a physical idealisation. Twenty years of field experience after its publication showed where the idealisation drifts from reality, and in 1980 Raymer, Hunt and Gardner published an empirical replacement built to fit observed porosity across the full range of real logs. This lesson gives you the form the app computes and, more importantly, the judgement of when to reach for it.

## The equation

The original Raymer-Hunt-Gardner (RHG) relation is a curved function of transit time. The engine implements the standard field approximation of it:

$$\phi_{RHG} = C\,\frac{\Delta t - \Delta t_{ma}}{\Delta t}$$

with the constant $C = 0.67$ for the typical clastic case. Compare the structure against Wyllie. The numerator is the same excess transit time over matrix, $\Delta t - \Delta t_{ma}$. The difference is the denominator: Wyllie divides by the fixed span $\Delta t_{fl} - \Delta t_{ma} = 474$ us/m, while RHG divides by the measured transit time itself and scales by 0.67. The fluid value has disappeared from the formula entirely; the empirical constant absorbs it.

Because the denominator now grows with $\Delta t$, the response is no longer a straight line from matrix to fluid. It is steeper than Wyllie at low transit times and flattens at high ones, which is exactly the shape the original field data demanded.

## Worked example

The clean mid SAND_A sample at 2020 m again, DT of 281.54 us/m with $\Delta t_{ma} = 182$:

1. Excess time: $281.54 - 182 = 99.54$ us/m.
2. Divide by the measured DT: $99.54 / 281.54 = 0.3536$.
3. Scale: $0.67 \times 0.3536 = 0.2369$.

So RHG reads 0.2369 where Wyllie read 0.2100 and the density log read 0.2100. Over the whole SAND_A interval from 2010 to 2030 m the pattern holds: the zone mean is 0.2344 by RHG against 0.2069 by Wyllie. On this well, RHG runs about 2.7 porosity units hot.

That is not a defect of the arithmetic. It is the model mismatch working in the open: RHG's constant was calibrated for formations where Wyllie underestimates, and the typewell is not such a formation. A compacted, liquid-filled sand where density and Wyllie agree is precisely the rock the time average was built for, so the correction built into RHG overshoots.

## When RHG is the better choice

The rule of thumb is about compaction.

Wyllie without a compaction correction underestimates porosity in uncompacted and unconsolidated rock, because the slow frame makes the fixed 474 us/m span too generous a scale. The classical fix bolts a $C_p$ divisor onto Wyllie, but $C_p$ must be estimated per well from adjacent shale readings, and a wrongly chosen $C_p$ is just a new error source. RHG was designed to fit field data across the whole porosity range without any separate compaction factor: the curvature of the transform does the compensating.

So the professional's decision tree reads:

* Compacted section, density log in good hole: book density or neutron-density porosity, keep Wyllie as the independent check, and expect RHG to read high.
* Uncompacted or slow section, or a legacy well where the sonic is the only porosity tool: prefer RHG, or Wyllie with a defended $C_p$, and say which you used.
* Any section: if two independent methods disagree by more than a couple of porosity units, that disagreement is information about lithology, fluid or hole condition. Investigate before you average anything.

Notice what did not appear in that tree: nothing licenses picking the transform that produces the biggest porosity. The choice is made from geology and hole conditions, then the number is whatever the choice computes.

## The constant C

The 0.67 constant deserves one paragraph of respect. Published variants range from about 0.62 to 0.70 depending on the calibration set, and some shops tune it to local core. The engine fixes $C = 0.67$, the most common field value, and the app displays it with the other parameters. If you ever tune it, it becomes an interpretation parameter like $\rho_{ma}$ or $R_w$: document the value and the evidence, because a hidden constant is how two interpreters produce different reserves from the same log.

## Exercise

Compute both sonic porosities for a sample reading DT of 229.4 us/m with the typewell anchors. As a self-check: Wyllie gives $47.4/474 = 0.1000$; RHG gives $0.67 \times 47.4/229.4 = 0.1384$. Note that RHG again reads higher, and the gap of nearly 4 porosity units at this low-porosity point is proportionally much larger than at 2020 m. In one sentence, state which of the two you would report for a compacted water-leg sand whose density porosity at the same depth computes to 0.0980.
