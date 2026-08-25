# The coefficient form

One equation, three readings, and the algebra that makes the whole module's behaviour obvious in advance. This is the shortest formula in the course and the one most worth truly owning.

## Reading one: the mechanical story

$$FP = K\,(S - PP) + PP$$

The effective stress $S - PP$ is the load the grain framework carries vertically. An elastic rock confined sideways converts a fraction of any vertical effective load into horizontal effective stress; $K$ is that fraction. The minimum pressure that can hold open a vertical crack must overcome the horizontal effective confinement, $K(S - PP)$, plus the pore fluid already pushing back, $PP$. Add them: the coefficient form.

For $K$ the capstone uses the elastic plane-strain value

$$K = \frac{\nu}{1 - \nu}$$

with Poisson's ratio $\nu = 0.4$, so $K = 0.4 / 0.6 = 2/3$ exactly. A rock squeezed vertically bulges sideways in proportion to $\nu$; held laterally, that frustrated bulge becomes horizontal stress. Stiffer against sideways flow, higher $\nu$, more of the vertical load transmitted around the corner.

## Reading two: the mixture

Rearrange once:

$$FP = K\,S + (1 - K)\,PP$$

The fracture pressure is a weighted average of the overburden and the pore pressure, with weights $K$ and $1-K$. With $K = 2/3$: two parts overburden, one part pore pressure. This reading explains every ordering fact module 3 checked. A weighted average sits between its ingredients, so $PP \le FP \le S$ always, with equality only when $PP = S$. And it sits two thirds of the way up the gap, so the margin above it to the overburden is half the window below it to the pore pressure, the factor of two observed at TD.

## Reading three: the sensitivities

Differentiate the mixture form and the module's dynamics fall out:

$$\frac{\partial FP}{\partial PP} = 1 - K = \tfrac{1}{3} \qquad \frac{\partial FP}{\partial S} = K = \tfrac{2}{3}$$

One third of any pore pressure change passes to the fracture pressure: the fitted-trend experiment measured exactly this, 2.143 MPa of ceiling rise for 6.429 of floor rise. Two thirds of any overburden change passes through, which prices the density column's importance a second time.

And the window, fracture minus pore:

$$FP - PP = K\,(S - PP)$$

so $\partial (FP - PP) / \partial PP = -K$: every megapascal of overpressure NARROWS the pressure-unit window by two thirds of a megapascal. The floor rises by 1, the ceiling by a third, the gap loses two thirds. This single line is the mechanical reason overpressured sections are hard to drill, and it is worth having as algebra rather than as folklore.

## The numbers, assembled once more

At TD on the capstone settings: $FP = \tfrac{2}{3} \times 91.12306695073282 + \tfrac{1}{3} \times 47.408579625 = 60.74871130048855 + 15.802859875 = 76.55157117548855$ MPa, agreeing with the subtractive route in all but the sixteenth digit. Weights two thirds and one third, and both partial products are worth writing once, because the mixture reading makes mental arithmetic possible: the fracture pressure moves a third of any floor move, two thirds of any ceiling move, forever.

## What K is, and is not

Everything above treated $K$ as an elastic constant, and the derivation from $\nu$ is real elasticity. But notice what the derivation assumed: stresses generated only by vertical loading on laterally confined, isotropic, elastic rock, with no tectonic contribution and no strength. Real basins violate at least one assumption each. In practice $K$ is measured, not derived: a leak-off test at each casing shoe gives the actual fracture initiation pressure, $K$ is back-calculated, and the calibrated $K(z)$ carries all the ignored physics inside it, which is the Matthews and Kelly manoeuvre. The formula survives calibration; only the story about $\nu$ becomes decoration. Lesson 4 returns to this with numbers.

## Worked example

A leak-off test at a shoe at 3000 m measures fracture initiation at 55.0 MPa. Back-calculate the implied $K$ on the capstone prognosis. At 3000 m, $S = 66.83114254343904$ and $PP = 33.307730125$ MPa. $K = (FP - PP)/(S - PP) = (55.0 - 33.307730125) / (66.83114254343904 - 33.307730125) = 21.692269875 / 33.523412418439044 = 0.6471$. Slightly below the elastic 2/3; the calibrated value would then be carried downward in place of 0.6667, lowering the TD fracture estimate to $0.6471 \times 43.714487325732826 + 47.408579625 = 75.695$ MPa.

## Exercise

Using only the sensitivity reading: the fitted trend raised the TD pore pressure by 6.429177480013587 MPa. State, without recomputing the fracture pressures, how much the window narrowed in pressure units, and check against the module's two FP values.

Self check: the window narrows by $K$ times the pore pressure rise, $\tfrac{2}{3} \times 6.429177480013587 = 4.286118320009058$ MPa. Check: true window $76.55157117548856 - 47.408579625 = 29.14299155048856$; fitted window $78.69463033549308 - 53.83775710501359 = 24.85687323047949$; difference 4.28611832000907 MPa. The algebra and the arithmetic agree to eleven decimals, which is what owning the formula means.
