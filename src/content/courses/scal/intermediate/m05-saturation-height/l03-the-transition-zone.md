# The transition zone

The volumetric picture of Ekene that the geoscience ladder built has a clean edge: oil above 1560 m, water below, saturation 0.35 everywhere in the oil leg. The capillary model replaces that edge with a ramp. Between fully wet rock at the contact and nearly drained rock high on the structure, saturation changes continuously over metres of section. This lesson measures that ramp, metre by metre, on the designed Ekene curve.

## The ladder of heights

Invert the height equation for saturation. At a height $h$ above the CONTACT (add the entry height to get above the FWL, then convert to feet), the capillary pressure follows from the gradient, $J$ follows from the psi-per-J factor, and the designed power law hands back the saturation. Run that chain at a sequence of saturations and you get the transition zone as a table. These are the engine's numbers for the designed curve, heights measured above the 1560 m contact:

| $S_w$ first reached | height above contact |
|---|---|
| 0.90 | 0.48353582519437843 m |
| 0.70 | 2.09532190917564 m |
| 0.50 | 6.285965727526915 m |
| 0.45 | 8.643202875349512 m |
| 0.40 | 12.571931455053829 m |
| 0.36 | 18.28644575280558 m |

Read it as a driller would. Half a metre above the contact the rock has already shed a tenth of its water. Two metres up it is at 70 percent water; six metres up it reaches the halfway mark. But look at the spacing lower down: getting from 0.40 to 0.36, a four point change, takes almost six metres, more than the entire journey from 1.0 to 0.5 took. The ramp is steep at the bottom and nearly flat at the top.

## Why the shape is what it is

The shape is the drainage curve read sideways. Near the contact, capillary pressure is barely above entry, and small increments of $P_c$ sweep through the big pore throats quickly: saturation falls fast per metre. High in the column, the curve is approaching its asymptote at $S_{wirr} = 0.25$; each further increment of $P_c$ extracts water only from ever smaller throats, so each saturation point costs more and more height. A power law with $b = 1$ makes this concrete: height above the FWL is proportional to $1/S_w^*$, so halving the normalized saturation requires doubling the height. Nothing about that is Ekene-specific. Every water wet drainage system builds a transition zone with a steep toe and a long flat shoulder; the rock properties only set the vertical scale.

That scale is worth naming. The whole zone from contact to crest spans just over twenty metres here because the Ekene sand is good rock: the psi-per-J factor $2.942330021361175$ is modest and the density contrast is healthy. Make the rock tighter (larger $\sqrt{k/\phi}$ penalty, so more psi per J) or the oil heavier (smaller gradient) and the same dimensionless curve stretches over many times the height. A transition zone is not a property of the fluid pair or of the rock alone but of their ratio.

## At the panel

{{panel:sc-jfunction-explorer}}

Open the saturation height profile. Trace it with the table above in hand: find the height where the curve crosses $S_w = 0.5$ and confirm it against $6.285965727526915$ m above the contact, remembering that the panel's height axis is above the FWL, one entry height lower. Then look at the top of the curve, where it flattens toward the asymptote. The plotted curve never touches $S_{wirr} = 0.25$ at any finite height; the flattening you see between the 0.40 and 0.36 rungs of the ladder is the same geometry that will matter at the crest in the next lesson.

## The misconception to avoid

The transition zone is not "bad data near the contact," and it is not a logging artifact to be squared off before mapping. It is the equilibrium the physics demands, present before the first well was drilled. Squaring it off does not clean the model; it substitutes a rock that does not exist, one with an infinite entry pressure step. When a log through the lower column shows intermediate saturations, the first hypothesis should be that the rock is doing exactly what its drainage curve says, and the second hypothesis, invasion or bad hole, comes after checking the first against a height model like this one.

## Exercise

Use the ladder table and the module gradient. First, compute the capillary pressure at the height where $S_w$ first reaches 0.50, showing the two-step chain from metres to feet to psi, and verify it against the designed curve's value at that saturation, $J$ evaluated at $S_w^* = (0.50 - 0.25)/0.75$ times the psi-per-J factor. Second, in two sentences, explain why the interval from 0.40 down to 0.36 occupies more height than the interval from 1.0 down to 0.5, using the word "asymptote" at least once.
