# Terminal decline practice

A hyperbolic decline has a property no well has: its instantaneous decline goes to zero. Write it out,

$$D(t) = \frac{D_i}{1 + b D_i t}$$

and as $t$ grows the well declines more and more slowly, forever. That is a fine description of a well still draining an expanding volume, and a false description of a well that has drained everything it is going to drain. Once flow is boundary dominated, the drainage volume is fixed, pressure falls roughly in proportion to what is left, and the fractional decline settles onto a floor and stays there.

Nothing in the Arps family knows this. So evaluators impose it from outside, and the imposition has a name: **terminal decline**.

## The practice

Pick a minimum decline $D_{\min}$ as a matter of policy, typically stated as an effective annual percentage. Run the hyperbolic until $D(t)$ falls to $D_{\min}$, then switch to an exponential at that rate for the rest of the life. The switch time comes straight out of the equation above:

$$t_{sw} = \frac{1}{bD_i}\left(\frac{D_i}{D_{\min}} - 1\right)$$

The forecast is then two segments. Hyperbolic from $q_i$ down to $q_{sw} = q(t_{sw})$, contributing the usual Arps cumulative; then exponential from $q_{sw}$ to the economic limit, contributing $(q_{sw} - q_L)/D_{\min}$.

The result is a curve that is continuous in rate and in decline at the joint, and that terminates in finite time at a finite volume for **any** $b$, including the $b > 1$ cases that module 1 lesson 3 showed have no ultimate at all. That is the point of the practice. Terminal decline is what makes a hyperbolic booking a booking rather than an argument about limits.

## Worked example, four steps

Take the same well the whole module has used: $q_i = 120$ stb/d, $D_i = 0.0012$ per day, $b = 1.2$, economic limit 10 stb/d. Unbounded, it books 321875.914758613 stb over 35.625993063559186 years. Apply a terminal decline of 5 percent per year.

**Step 1, the floor in engine units.** Five percent effective per year, tangent convention, is $D_{\min} = -\ln(1 - 0.05)/365 = 0.00014052957366452213$ per day.

**Step 2, the switch.** $t_{sw} = (0.0012/0.00014052957366452213 - 1)/(1.2 \times 0.0012) = 5235.505470031922$ days, which is 14.343850602827185 years.

**Step 3, the joint.** $q_{sw} = 120/(1 + 1.2 \times 0.0012 \times 5235.505470031922)^{1/1.2} = 20.091081478993967$ stb/d, and the hyperbolic cumulative to that rate is 214834.64138858786 stb.

**Step 4, the tail.** $(20.091081478993967 - 10)/0.00014052957366452213 = 71807.52930400119$ stb, produced over $\ln(20.091081478993967/10)/D_{\min} = 4964.726625845288$ days, which is 13.601990755740516 years.

Total: **286642.170692589 stb** over 27.9458413585677 years.

Stop and add steps 3 and 4 on a calculator before reading on, and notice how large the tail is. Seventy one thousand barrels, a quarter of the whole booking, comes from an exponential segment that no data supports either; capping the forecast did not make the late volume observable, it only made it finite.

## What the cap is worth, and what it is not

Vary the policy and hold everything else:

| terminal decline | switch (days) | $q_{sw}$ (stb/d) | capped EUR (stb) | cut vs uncapped | life (years) |
|---|---|---|---|---|---|
| none | n/a | n/a | 321875.914758613 | 0 | 35.625993063559186 |
| 5 %/yr | 5235.505470031922 | 20.091081478993967 | 286642.170692589 | 10.946374814172376 % | 27.9458413585677 |
| 10 %/yr | 2192.46878645 | 36.6030880766 | 226180.603901891 | 29.730498 % | 18.322075 |
| 15 %/yr | 1177.13240883 | 52.5258127907 | 185344.964773378 | 42.417262 % | 13.431337 |

Three observations, in order of how often they are missed.

**The policy is a lever in its own right.** Moving the terminal decline from 5 percent to 15 percent removes 42.417262 percent of the booking without touching a single fitted parameter. That is comparable in size to the entire $b$ lever of lesson 2. If a submission does not state its terminal decline, its reserves number is not reproducible, which is why governance rule 2 of lesson 3 exists.

**A cap is not the same as conservatism.** Even at 5 percent, the capped booking of 286642.170692589 stb is 3.1270054984646074 times the exponential booking of 91666.6666666667 stb. The 3.51 lever became a 3.13 lever. It did not become a modest number. Anybody who tells you the hyperbolic has been "made conservative by the terminal decline" has confused finite with small.

**The harmonic needs it too.** Run the same 5 percent cap on the $b = 1$ row and the booking falls from 248490.664978800 to 243306.489069931 stb, a cut of only 2.086265860052039 percent. The cap bites hardest exactly where the exponent is highest, because a high $b$ is precisely what keeps $D(t)$ near zero for longest. That is the correct behaviour of the instrument: the wells whose forecasts most need bounding are the ones the bound moves most.

## The engine limitation, stated plainly

**Our decline engine does not implement terminal decline.** `calculateEUR` takes $q_i$, $D_i$, $b$, the economic limit and a model name, and nothing else. `generateForecast` steps a single Arps segment day by day and stops at the limit. There is no $D_{\min}$ argument, no switch, no second segment, anywhere in `engines/dca/arps.js`. The uncertainty explorer's EUR tile is an unbounded hyperbolic booking, and so is every EUR the fit panels report.

That is a real limitation and it is yours to handle, outside the tool. Three practical consequences:

1. **Never report an engine EUR as a capped booking.** If your policy requires a terminal decline, the engine's number is not your number, and the difference on a $b = 1.2$ well is over thirty five thousand barrels at a 5 percent floor.
2. **Compute the two segments yourself.** The four steps above are four calculator operations. Use the engine for the hyperbolic segment by calling the EUR function with $q_{sw}$ as the economic limit, which gives you the first segment exactly, then add the exponential tail by hand.
3. **Say which one you did.** Any EUR you circulate should carry the phrase "unbounded hyperbolic" or "capped at X percent per year terminal decline". Those are different quantities and they differ by more than most people's estimate of their own uncertainty.

Do not invent the feature in your write-up. Writing "terminal decline applied" next to a number the engine produced would be a fabricated control, which is worse than an uncapped forecast honestly labelled.

## Exercise

Repeat the four steps for the same well at a terminal decline of 8 percent per year. Report $D_{\min}$ in per-day units, the switch time in days and years, the rate at the switch, the hyperbolic cumulative to that rate, the exponential tail volume, the capped EUR, and the percentage cut against 321875.914758613 stb.

Then two sentences of judgement. First: your capped answer will still be more than 2.5 times the exponential booking from the same early data. State what evidence, specifically, you would need to see before you were willing to circulate it. Second: the exercise fixed the terminal decline and varied nothing else, but in practice $b$ and $D_{\min}$ are chosen by the same person on the same day. Name the failure mode that creates and say how you would guard against it.
