# Three independent routes

The last three modules each produced a number for formation water resistivity. This lesson puts them side by side and draws the Expert conclusion. The exercise of comparing them has a name in professional practice: triangulation. One measurement is a claim; two are a comparison; three, arrived at independently, are a case.

## The triangulation table

Collect the three results at formation temperature:

| Route | Method | Rw estimate |
|---|---|---|
| Laboratory sample | Arps correction from 75 degF to 180 degF | 0.049910 $\Omega\cdot m$ |
| SP quicklook | $R_{we} = R_{mfe}\,10^{SSP/K}$ | 0.049831 $\Omega\cdot m$ |
| Pickett fit | Least squares over the water leg | $aR_w$ = 0.0500 $\Omega\cdot m$ |

The Pickett route reports the product $aR_w$, and with the fitted $a = 1$ the product reads directly as Rw. The fit used the 6 valid water-leg samples between 2075 and 2078 m and returned a slope of exactly $m = 2.000$ alongside the intercept, so the same exercise that delivered Rw also confirmed the cementation exponent.

Now measure the agreement. The lowest value is 0.049831 and the highest is 0.0500. The spread is 0.000169, which is under 0.4 percent of the value itself. Against the tolerances that matter downstream, where saturation scales as the square root of Rw, a 0.4 percent spread in Rw moves Sw by about 0.2 percent. The three routes agree for every practical purpose.

## Why independence matters

Agreement alone is not the point. Three copies of the same measurement would agree too, and would prove nothing. The strength of this table is that the three routes share almost nothing:

* The laboratory route starts from a physical sample of the water itself. Its failure modes are contamination of the sample by mud filtrate, mislabelled or wrongly recorded sample temperature, and evaporation or precipitation between wellsite and laboratory.
* The SP route starts from a borehole measurement made against the mud. Its failure modes are a misread SSP (thin beds, baseline drift, hydrocarbon suppression) and the equivalent-resistivity approximation built into the quicklook chain.
* The Pickett route starts from the resistivity and porosity logs over an interval interpreted as water bearing. Its failure modes are picking a leg that is not actually at $S_w = 1$, shale conductivity bending the line, invasion disturbing the resistivity, and the permanent entanglement of $a$ with $R_w$ in the intercept.

Write those failure lists next to each other and notice that no failure appears twice. Filtrate contamination does not touch the SP reading. A suppressed SSP does not move the Pickett intercept. A mispicked water leg has no effect on the laboratory sample. For all three routes to land on the same wrong answer, three unrelated errors would have to conspire to the same value, which is vanishingly unlikely. A closed triangle is therefore strong evidence that the common answer is the true one.

## The Expert conclusion

The three routes converge on 0.05 $\Omega\cdot m$ at formation temperature, and that is the value the Expert adopts for this reservoir. It is worth pausing on what has actually been achieved. At the Associate tier, Rw = 0.05 was a given, printed in the parameter block and taken on trust. At the Professional tier, the Pickett fit showed the water leg was consistent with it. Now, at the Expert tier, two further routes that owe nothing to the logs' Archie parameters have produced the same number from a bottle of water and a millivolt reading. The given has become a finding.

That is the difference in kind between tiers. The arithmetic of each individual route is not difficult; the Expert skill is assembling routes with disjoint failure modes and knowing what their agreement licenses you to conclude.

## Worked example

Quantify the spread as you would in a report:

1. Range: $0.0500 - 0.049831 = 0.000169\ \Omega\cdot m$.
2. Relative spread: $0.000169 / 0.049910 = 0.0034$, or 0.34 percent.
3. Effect on saturation: $S_w \propto \sqrt{R_w}$, so the full spread moves Sw by a factor $\sqrt{1.0034} = 1.0017$, about 0.17 percent.

A SAND_A saturation near 0.36 would move by well under 0.001 across the whole triangle. The conclusion writes itself: the choice among 0.049831, 0.049910 and 0.0500 has no material effect on the evaluation, and any of them, or the rounded 0.05, is defensible.

Try it yourself: the panel below runs the same engine on the typewell.

{{panel:petro-rw-triangulator}}

## Exercise

A neighbouring well yields these three routes: laboratory sample corrected by Arps to 0.031 $\Omega\cdot m$, SP quicklook 0.029 $\Omega\cdot m$, Pickett $aR_w$ 0.030 $\Omega\cdot m$ with $a = 1$. Compute the range and the relative spread against the middle value, and state whether the triangle closes as convincingly as the typewell's. As a self-check: the range is 0.002, the relative spread is 0.002/0.030 = 6.7 percent, and the implied Sw effect is a factor $\sqrt{0.031/0.029} = 1.034$ between extremes, about 3.4 percent in Sw. That triangle still closes usefully, but the report should carry the spread rather than silently picking one vertex.
