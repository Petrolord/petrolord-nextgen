# Iso-Sw lines

The water line anchors the Pickett plot, but the plot's real payoff is reading saturation for every other point in the well. The tool for that is the family of iso-$S_w$ lines: contours of constant water saturation drawn across the plot.

## Where the lines come from

Go back to the full Archie equation and take logs without setting $S_w = 1$:

$$\log R_t = \log(a R_w) - m \log \phi - n \log S_w$$

Compare this with the water-line equation. The only difference is the constant term $-n \log S_w$. A fixed saturation therefore draws a line that is exactly parallel to the water line, with the same slope $-m$, shifted vertically by $-n \log S_w$. Since $S_w < 1$ makes $\log S_w$ negative, the shift is upward: lower water saturation means higher resistivity at the same porosity.

The size of the shift is worth internalising for $n = 2$. A point at $S_w = 0.5$ sits a factor $1/S_w^n = 1/0.25 = 4$ above the water line in resistivity. A point at $S_w = 0.1$ sits a factor 100 above it. Each halving of saturation quadruples the resistivity offset. The iso-$S_w$ family is a ladder of parallel lines climbing away from the water line, and a sample's rung on that ladder is its saturation.

## The typewell's water line

With the fitted parameters ($a R_w = 0.05$ ohm.m, $m = 2$), the $S_w = 1$ line for the typewell runs from $R_t = 20.0$ ohm.m at $\phi = 0.05$ down to $R_t = 0.3125$ ohm.m at $\phi = 0.40$. Check the first end point with the water-leg equation: $0.05 / 0.05^2 = 0.05 / 0.0025 = 20.0$ ohm.m. Every water-saturated sample in the well, whatever its porosity, belongs on that line; everything above it holds hydrocarbon.

## Worked example: reading a reservoir point

Take the mid SAND_A sample at 2020 m: $\phi_{ND} = 0.1700$, $R_t = 9.2554$ ohm.m. Two ways to read its saturation, which must agree.

Directly from Archie:

1. $\phi^m = 0.17^2 = 0.0289$.
2. Denominator: $0.0289 \times 9.2554 = 0.26748$.
3. Ratio: $0.05 / 0.26748 = 0.18693$.
4. $S_w = \sqrt{0.18693} = 0.4324$.

From the plot geometry, using the resistivity ratio:

1. The water line at $\phi = 0.17$ predicts $R_t = 0.05 / 0.0289 = 1.7301$ ohm.m.
2. The sample actually reads 9.2554 ohm.m, a factor $9.2554 / 1.7301 = 5.35$ above the line.
3. That factor equals $1/S_w^n = 1/S_w^2$, so $S_w = 1/\sqrt{5.35} = 0.4324$.

Same answer, and the second route is the one your eye performs on the plot: find the sample's height above the water line, and convert the ratio to saturation. A sample sitting 4 times above the line is at 50 percent water; this one sits 5.35 times above, so a little drier at 43 percent.

## Reading clusters, not just points

On a real Pickett plot you read populations. The water leg forms a tight string on the $S_w = 1$ line. The reservoir samples form a cluster between the iso-lines, and the shape of that cluster is diagnostic. A compact cluster parallel to the water line is a reservoir at fairly uniform saturation. A diagonal smear connecting the cluster to the water line is a transition zone. Points drifting below the water line flag shale or bad data, as the theory lesson warned.

The typewell's SAND_A samples plot as a compact cluster around the $S_w \approx 0.43$ position, which anticipates the zone means you will compute in the saturation module: Archie averages 0.4478 over the zone, with the shaly-sand models slightly lower. SAND_B, wetter and closer to the water leg, clusters lower on the ladder.

One caution before you lean on iso-$S_w$ lines quantitatively: everything here is Archie. The lines inherit Archie's clean-sand assumption, so in shaly intervals the plot's saturations read too high, for reasons the next module takes apart. Use the plot to validate parameters and to survey the well; book saturations from the model you can defend in the actual lithology.

Try it yourself: the panel below runs the same engine on the typewell.

{{panel:petro-pickett-explorer}}

## Exercise

The sample at 2076 m in the water leg reads $\phi_{ND} = 0.0980$, $R_t = 5.2062$ ohm.m. First confirm from the water-line prediction that it sits on the $S_w = 1$ line: the line at $\phi = 0.098$ predicts $0.05 / 0.098^2 = 0.05 / 0.009604 = 5.2062$ ohm.m, a ratio of exactly 1. Then compute what resistivity the same sample would read at $S_w = 0.5$ and at $S_w = 0.25$. As a self-check: the offsets are factors of 4 and 16, giving 20.82 and 83.30 ohm.m. State in one sentence why the two answers differ by exactly a factor of 4.
