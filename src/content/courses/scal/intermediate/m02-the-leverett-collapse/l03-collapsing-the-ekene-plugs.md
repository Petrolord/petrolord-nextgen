# Collapsing the Ekene plugs

Three plugs, three laboratories, three fluid systems, and pressures that disagree by a factor of six. This lesson runs the collapse on all of them at once and reads what comes out the other side.

## The cast

| plug | well | lab system | $\sigma$ dyn/cm | $\theta$ deg | k md | $\phi$ | $P_c$ at the 0.30 row, psi |
|---|---|---|---|---|---|---|---|
| EK1-P | Ekene-1 | air-brine | 72 | 0 | 420 | 0.23 | 29.190762994489138 |
| EK3-P | Ekene-3 | mercury-air | 480 | 40 | 250 | 0.20 | 180.18302550343515 |
| EK5-P | Ekene-5 | oil-brine | 48 | 30 | 95 | 0.16 | 29.55586916053684 |

Each lab table runs from a saturation of 0.30 up to 1.00 in steps of 0.05, fifteen rows per plug. Face value says EK3-P is a different kind of rock altogether, three times the permeability of EK5-P yet six times anyone's pressure. Face value is wrong: mercury's enormous interfacial tension is doing the talking, not the pore space.

## Run the collapse

{{panel:sc-jfunction-explorer}}

Select all three plugs in the panel. The left plot shows the three lab curves refusing to agree in psi; the right plot shows what happens after each is divided by its own $\sigma \cos\theta$ and multiplied by its own $\sqrt{k/\phi}$: one curve, three markers riding it. Toggle plugs in and out and watch the cloud stay put.

The agreement is not approximate. At every one of the fifteen saturation rows, the spread between the three computed $J$ values is at most 4.440892098500626e-16, which is machine epsilon territory: the plugs agree to the last bit that double-precision arithmetic can represent. This is by construction. The Ekene fixture generated each plug's lab table FROM one designed J curve through the engine's own scaling, so the collapse recovering that curve exactly is the machinery proving itself, the same way the decline-curve course's fits recover planted decline parameters.

## The curve they collapse onto

The designed field curve is a power law on normalized saturation:

$$J(S_w) = a \left( \frac{S_w - S_{wirr}}{1 - S_{wirr}} \right)^{-b}, \qquad a = 0.25, \; b = 1.0, \; S_{wirr} = 0.25$$

With $b$ equal to 1 the algebra collapses to something you can carry in your head:

$$J(S_w) = \frac{0.25 \times 0.75}{S_w - 0.25} = \frac{0.1875}{S_w - 0.25}$$

Try it at the row every plug's table starts on. At a saturation of 0.30 the denominator is 0.05, so $J = 0.1875 / 0.05 = 3.75$ exactly. That is the designed answer behind the 3.750000000000001 the engine computed from plug EK1-P's psi in lesson 2: fifteen digits of agreement with the plant, and the sixteenth is floating-point dust.

Three more waypoints, all hand-reachable: $J(0.40) = 0.1875/0.15 = 1.25$; $J(0.625) = 0.1875/0.375 = 0.5$; $J(1.00) = 0.1875/0.75 = 0.25$, which is just $a$, since at full water saturation the normalized saturation is 1 and the power law returns its own coefficient. The value of $J$ at $S_w = 1$ being $a$ is worth remembering: module 5 turns it into the entry pressure of the reservoir.

Note what $S_{wirr} = 0.25$ is doing: it is the saturation the curve asymptotes toward, where $J$ blows up. It sits deliberately BELOW the 0.35 connate water saturation the displacement course used. Those are different physical statements, the drainage asymptote versus what the crest of this structure has actually drained to, and module 5 makes the distinction earn its keep. Do not average them into one "irreducible water" in your notes.

## Reading a collapse like an engineer

Three habits, in the order you should apply them.

First, check the spread before admiring the shape. A tight cloud means the samples share pore geometry after scaling; on real core "tight" means a few percent, not machine epsilon, and module 4 quantifies what fitting does with residual scatter.

Second, read the ends. The low-saturation end is where $J$ climbs fastest and where a wrong $S_{wirr}$ shows up as curvature that will not straighten. The high-saturation end approaches $a$, and samples disagreeing THERE disagree about entry behavior, which is a rock-quality statement.

Third, only after the collapse holds are you licensed to average. Averaging curves that have not collapsed produces a number with no rock attached to it.

## The misconception to avoid

"The plugs agree, so the measurement uncertainty is negligible." The collapse removes the ROCK and FLUID scale factors; it says nothing about whether the laboratory measured pressure correctly in the first place. On this designed fixture there is no measurement error by construction. On real core, a systematic error that scales every pressure in one lab, a miscalibrated transducer for instance, survives the collapse perfectly and simply shifts that plug's curve. Agreement across plugs from DIFFERENT labs is the strong evidence; agreement of one lab with itself is bookkeeping.

## Exercise

First, use the closed form to compute $J$ at a saturation of 0.55, then convert it to a pressure on plug EK3-P using its psi-per-J factor of 48.048806800916026. Check yourself against the plug's table value of 30.03050425057251 psi at that row.

Second, the fixture's designed curve gives every plug the SAME $J$ at each saturation, yet the three plugs' pressures at the 0.30 row span a factor of six. Write the one-line ratio of plug EK3-P's psi-per-J factor to plug EK1-P's and confirm it reproduces the pressure ratio between their tables.
