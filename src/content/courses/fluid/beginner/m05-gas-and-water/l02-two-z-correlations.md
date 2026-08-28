# Two z correlations

Hall-Yarborough and Dranchuk-Abou-Kassem both fit the same chart by different methods, and comparing them is free.

{{panel:fluid-correlation-explorer}}

## What they are fitting

Both are fits to the Standing-Katz z-factor chart, which was itself built from measurements on natural gases in 1942 and has been the industry reference ever since.

So the two correlations do not disagree about physics. They disagree about how well their functional form reproduces a chart, in different regions of it.

## Hall-Yarborough (1973)

Solves for a reduced density implicitly and gets z from it. The equation cannot be rearranged, so it needs a Newton iteration.

That means it can fail to converge, and an implementation has to handle that. It is well behaved over the normal range and it is the engine's default.

## Dranchuk and Abou-Kassem (1975)

An eleven-constant equation in reduced density, also solved iteratively. More constants, a slightly wider stated range, and generally regarded as the more accurate of the two over the full chart.

## What they give for Ekene

At the initial pressure of 3200 psia, 180 F and 0.75 gas gravity, so a reduced pressure of 4.874147976086212 and a reduced temperature of 1.6414421349756225:

| correlation | z |
|---|---|
| Hall-Yarborough | 0.8577529684232971 |
| Dranchuk-Abou-Kassem | 0.8605955632995046 |

The gap is

$$-0.3303055462323185 \text{ percent}$$

A third of a percent. Both are describing the same chart and they land a third of a percent apart at this state.

## What to do with the gap

Treat it as a lower bound on how well z is known.

It is a lower bound rather than an estimate, because both correlations are fitting the SAME chart. Any error in the chart itself, or in the pseudo-criticals that placed this gas on it, is common to both and the comparison cannot see it.

So a third of a percent is what two fits to one chart disagree by. The real uncertainty in z for a gas whose composition you have not measured is larger.

## Why the free check is worth taking

Because it costs one extra function call and it catches implementation errors immediately.

If two independent correlations agree to a third of a percent, both implementations are probably right. If they disagree by ten percent, one of them has a bug or the reduced state was computed wrongly, and you have found out in a second rather than after a history match.

That is the same argument the simulation course made for running two clipping conventions: the second answer costs almost nothing and it bounds the first.

## Where the gap widens

Near the critical region, at reduced temperatures just above one, and at very high reduced pressures. Both correlations were fitted over stated ranges and both degrade outside them, in different ways.

The engine attaches those ranges and warns when the reduced state leaves them, which is why the correlation warning function takes a maximum reduced pressure and a reduced temperature as inputs.

## The misconception to avoid

"Dranchuk-Abou-Kassem has more constants so it is more accurate." More constants means it can follow the chart more closely where it was fitted. It does not mean it extrapolates better, and a higher-order fit can behave worse outside its range precisely because it has more freedom to do so.

## Exercise

First, use the panel to get both z factors for Ekene at 3200 psia and state the percentage gap.

Second, explain in two sentences why the gap between these two correlations is a lower bound on the uncertainty in z rather than an estimate of it.
