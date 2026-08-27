# Reading the Ekene curves

The model is three lines of algebra. This lesson makes you run those lines by hand, once, completely, at one saturation, so that the curves stop being pictures and become arithmetic you own. The saturation is $S_w = 0.55$, chosen because it sits exactly in the middle of the Ekene mobile window.

## The chain at Sw = 0.55

Step one, normalize. With $S_{wc} = 0.35$ and $S_{or} = 0.25$,

$$S_{wn} = \frac{0.55 - 0.35}{1 - 0.35 - 0.25} = \frac{0.20}{0.40} = 0.5$$

The engine reports 0.5000000000000001. That trailing 1 is not an error and not physics: it is binary floating point arithmetic evaluating $(0.55 - 0.35)/0.4$, where none of the three decimals has an exact binary representation. Your calculator says 0.5, the engine says 0.5000000000000001, and both are right at every figure that matters. You will meet this wrinkle throughout the course, and the honest response is to recognize it, not to round it away silently.

Step two, the water curve. $n_w = 2.5$ and $k_{rw,max} = 0.3$:

$$k_{rw} = 0.3 \times 0.5^{2.5} = 0.3 \times 0.176776695296637 = 0.05303300858899109$$

Pause on $0.5^{2.5}$. Half to the power 2.5 is half squared times the square root of half, which your calculator delivers as 0.176776695296637. Halfway through the mobile window, the water phase has reached not thirty percent of its endpoint, not fifty, but under eighteen percent. That is the exponent 2.5 doing what lesson 2 promised: holding the water curve down.

Step three, the oil curve. $n_o = 2$ and $k_{ro,max} = 0.9$:

$$k_{ro} = 0.9 \times (1 - 0.5)^{2} = 0.9 \times 0.25 = 0.2249999999999999$$

By hand this is exactly 0.225. The engine's 0.2249999999999999 is the same floating point wrinkle arriving through $(1 - S_{wn})$, and again both answers agree everywhere that matters.

So at the midpoint of the mobile window: $k_{rw} = 0.05303300858899109$ and $k_{ro} = 0.2249999999999999$. Oil remains over four times as permeable as water at a saturation where water already fills more than half the mobile pore volume.

## The rest of the curve

The same chain at other saturations gives the table below. Every row is the engine's own output, and every row is reachable by the three steps you just took.

| $S_w$ | $S_{wn}$ | $k_{rw}$ | $k_{ro}$ |
|---|---|---|---|
| 0.45 | 0.25 | 0.009375000000000003 | 0.50625 |
| 0.50 | 0.375 | 0.02583446213091634 | 0.3515625 |
| 0.55 | 0.5 | 0.05303300858899109 | 0.2249999999999999 |
| 0.60 | 0.625 | 0.09264485332524548 | 0.1265625 |
| 0.65 | 0.75 | 0.14614178688862406 | 0.05624999999999995 |
| 0.70 | 0.875 | 0.21485298275615985 | 0.014062500000000025 |

Read the columns for their shape. The water column climbs slowly and then accelerates; the oil column collapses fast. Between $S_w = 0.45$ and $S_w = 0.70$ the oil curve loses ninety seven percent of its value while the water curve is still short of its endpoint. The displacement physics of module 4 lives entirely in the interplay of these two columns.

{{panel:sc-displacement-explorer}}

In the panel, keep the Ekene defaults and read the kr plot against the table above. Pick the row at $S_w = 0.6$ and confirm both curve values by eye, then confirm the crossing point of the two curves lies between 0.6 and 0.65, consistent with the table's columns swapping order there. The tiles above the plot will make sense in module 3; for now, treat the plot as the table drawn continuously.

## A first look ahead

Module 3 combines these two columns with the two viscosities into a single curve, the fractional flow of water. At this same $S_w = 0.55$ the combination gives $f_w = 0.459029062228061$, which says that at that saturation just under half of the flowing stream is water. Hold that number; you will compute it yourself from this lesson's $k_{rw}$ and $k_{ro}$ in the very first lesson of module 3.

## The misconception to avoid

The table shows $k_{rw} = 0.05303300858899109$ at the middle of the window, and the tempting misread is that water is barely moving in the reservoir there. Permeability is not flow rate. How much water actually flows depends on the relative permeabilities and the viscosities together, and water's viscosity advantage at Ekene, 0.5 cp against 1.8 cp for oil, multiplies its effective mobility by 3.6 relative to its permeability alone. A small $k_{rw}$ can still carry a large share of the stream. Module 3 makes that precise; until then, resist reading flow shares off the kr plot.

## Exercise

Run the full three-step chain by hand at $S_w = 0.65$: compute $S_{wn}$, then $k_{rw}$, then $k_{ro}$, and check yourself against the table row above. You will need $0.75^{2.5}$, which your calculator gives as 0.487139289628747.

Then, using only the table, state between which two listed saturations the crossing of the two curves must sit, and compute the chain once more at $S_w = 0.62$ to decide which side of 0.62 the crossing falls on. You will need $0.675^{2.5}$, which your calculator gives as 0.374334135394937.
