# The intermediate workflow map

You now have the inputs: six curves, a parameter block, and a deliberate choice of the linear Vsh transform. This lesson lays out the complete Professional pipeline in order, exactly as the Petrophysics app runs it, and attaches to each step the number the capstone will eventually grade. Treat it as the map you will refer back to; each of the next four modules zooms into one leg of it.

## The pipeline in five steps

Step one: shale volume. Compute the linear index from the gamma ray, $V_{sh} = (GR - 20)/(120 - 20)$, clamped to 0 to 1, at every sample. This curve feeds the saturation models in step four and nothing else changes about it for the rest of the course.

Step two: porosity three ways. First the density porosity you already know,

$$\phi_D = \frac{2.65 - RHOB}{2.65 - 1.0}$$

Second, Wyllie sonic porosity from the transit time, using the anchors $\Delta t_{ma} = 182$ and $\Delta t_{fl} = 656$ us/m; module two derives and exercises the formula. Third, the neutron-density combination, which on this workflow is the simple average

$$\phi_{ND} = \frac{\phi_D + NPHI}{2}$$

The workflow carries all three curves in parallel. The saturation models and the Pickett fit run on $\phi_{ND}$, because averaging two independent measurements suppresses the individual biases of each; module three makes that argument properly.

Step three: validate the Archie parameters. Take the water leg, 2075 to 2078 m at the base of SAND_B, cross-plot deep resistivity against $\phi_{ND}$ on log-log axes, and fit a straight line. The slope of that line measures the cementation exponent $m$ and its position measures the product $a R_w$. Module four is devoted to this plot.

Step four: shaly-sand saturation. Run Simandoux and Indonesia at every sample, both driven by RT, $\phi_{ND}$, the linear $V_{sh}$, the validated $R_w = 0.05$ and $m = 2$, and the shale resistivity $R_{sh} = 2.0$ ohm.m read from the thick shale. Both models collapse to Archie wherever $V_{sh} = 0$, so the clean heart of SAND_A is untouched and the shaly fringes are corrected. Module five derives both equations.

Step five: zone means. Average the computed curves over SAND_A, 2010 to 2030 m, sample by sample, skipping invalid values. These means are the deliverables.

## The six graded numbers

The capstone asks you to run this pipeline in the app and report six numbers. Here they are, with the engine truth you should reproduce:

| # | Quantity | Value |
| --- | --- | --- |
| 1 | SAND_A mean neutron-density porosity | 0.1762 |
| 2 | SAND_A mean Wyllie sonic porosity | 0.2069 |
| 3 | Pickett fit: $a R_w$ | 0.0500 ohm.m |
| 4 | Pickett fit: $m$ | 2.000 |
| 5 | SAND_A mean Sw, Simandoux | 0.4335 |
| 6 | SAND_A mean Sw, Indonesia | 0.4280 |

Read the table as a story. Rows one and two say porosity in SAND_A is about 18 to 21 percent depending on method, and the spread itself is information. Rows three and four say the water leg confirms the handed-down $R_w$ and $m$ exactly on this well: the product $a R_w = 1 \times 0.05 = 0.0500$ and the slope returns $m = 2.000$. Rows five and six say the two shaly-sand models agree with each other within half a saturation unit on the zone mean, which is what you expect in a sand this clean.

## Worked example

Trace one sample through the whole map. At 2020 m: GR 20, RHOB 2.3035, NPHI 0.13, DT 281.54, RT 9.2554.

1. Step one: $V_{sh} = (20 - 20)/100 = 0$.
2. Step two: $\phi_D = (2.65 - 2.3035)/1.65 = 0.2100$. The Wyllie formula (next module) gives $\phi_S = 0.2100$ as well at this depth. The combination: $\phi_{ND} = (0.2100 + 0.13)/2 = 0.1700$.
3. Step three does not use this sample; it lives outside the water leg.
4. Step four: with $V_{sh} = 0$ both models reduce to Archie, and all three return $S_w = 0.4324$.
5. Step five: this sample contributes to every SAND_A mean in the table above.

One clean sample, five steps, no surprises. The interesting samples, the shaly ones and the water-bearing ones, each get their own module.

## Exercise

Without looking back, sketch the five-step map and mark where each of the six graded numbers is produced. Then check yourself against the lesson. As a further self-check, answer from the table: which graded numbers would move if you switched the porosity curve feeding steps three and four from $\phi_{ND}$ to $\phi_D$? You should conclude that four of them would move, rows three to six, because the Pickett fit and both saturation models all consume the porosity curve, while rows one and two are defined by their own methods and would not change. Finally, state in one sentence why the Vsh transform choice from the previous lesson barely moves row five or six on this particular well; the answer is in the worked example, where the clean heart of SAND_A carries $V_{sh} = 0$.
