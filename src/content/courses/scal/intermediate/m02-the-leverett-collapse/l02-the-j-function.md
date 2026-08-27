# The J-function

Lesson 1 argued that one dimensionless curve hides under every lab drainage table. This lesson writes the function down precisely, fixes its constant, and shows you the round trip that everything else in this module rides on.

## The definition the engine computes

In field units, with $P_c$ in psi, $\sigma$ in dyn/cm, $k$ in millidarcies and $\phi$ as a fraction:

$$J(S_w) = 0.21645 \; \frac{P_c}{\sigma \cos\theta} \sqrt{\frac{k}{\phi}}$$

The engine stores the constant as `LEVERETT_C = 0.21645`. Going the other way, from a $J$ curve back to pressure on some target rock, is the same equation solved for $P_c$:

$$P_c(S_w) = J(S_w) \times \frac{\sigma \cos\theta}{0.21645 \, \sqrt{k/\phi}}$$

The multiplier on the right is worth naming, because you will use it constantly: it is the psi-per-J factor of a rock and fluid pair, the number of psi that one unit of $J$ costs on that rock. For the Ekene reservoir description, k of 250 md, $\phi$ of 0.20, $\sigma$ of 26 dyn/cm at $\theta$ of 30 degrees, the pieces are $\sigma \cos\theta = 22.516660498395407$ and $\sqrt{k/\phi} = \sqrt{1250}$, and the factor works out to 2.942330021361175 psi per unit of J. Keep that number; module 5 spends it.

## Where 0.21645 comes from, and where it does not

The constant makes the mixed units consistent: psi against dyn/cm, millidarcies against a pure fraction. You might expect it to follow from the unit conversions alone. Almost.

Work it from exact conversions, 1 psi equal to 68947.6 dyn/cm squared and 1 md equal to 9.869233e-12 cm squared, and you get 0.21665. The published field-unit constant, printed in Tiab and Donaldson's Petrophysics and in Amyx, Bass and Whiting before it, is 0.21645. The two differ by a relative 0.0009240009240009504, about nine parts in ten thousand.

The engine adopts the published 0.21645 verbatim, and the choice deserves a sentence of defense. What the J-function machinery actually requires is not that the constant carry twelve true digits, but that the same constant be used in both directions. Scale a lab table to $J$ with 0.21645 and scale that $J$ back to a reservoir with 0.21645, and the constant cancels exactly: the engine's test suite pins the round trip at a relative error of 1e-12. Use 0.21645 one way and 0.21665 the other and you plant a permanent 0.09 percent bias instead. Consistency beats precision here, and matching the published literature makes every textbook comparison land on the printed values.

## The round trip, concretely

{{panel:sc-jfunction-explorer}}

Select plug EK1-P in the panel and leave the Swirr override at 0.25. The left plot is the plug's lab drainage table in psi; the right plot is the same table divided through by the plug's own scaling, now dimensionless. Read the psi-per-J tile, then switch plugs and watch that tile change while the right-hand curve does not move. That is the whole lesson in one interaction: the factor belongs to the plug, the curve does not.

One worked point so the panel is never a black box. Plug EK1-P has k of 420 md, $\phi$ of 0.23, and an air-brine system at $\sigma$ of 72 dyn/cm with $\theta$ of 0, so $\sigma \cos\theta = 72$ and $\sqrt{420/0.23} = 42.73273869671518$. Its lab table reads 29.190762994489138 psi at the 0.30 saturation row. Then

$$J = 0.21645 \times \frac{29.190762994489138}{72} \times 42.73273869671518 = 3.750000000000001$$

The trailing 1 in the fifteenth digit is double-precision arithmetic, not geology. Lesson 3 shows why the designed answer at that saturation is exactly 3.75.

## The misconception to avoid

Do not let anyone, including a data vendor, hand you "the J-function of the field" without the $(\sigma \cos\theta, k, \phi)$ triplet that was used to build it and the constant convention it assumed. A $J$ curve is only as portable as its scaling is reproducible. The classic failure is a J table built with the reservoir fluid pair being re-scaled by a user assuming the lab fluid pair; nothing warns you, the curve simply lands a factor of three wrong, and the error is invisible until someone checks a pressure against core. State the triplet every time. The engine's data structures force this by carrying the sample properties alongside every table.

## Exercise

First, compute the psi-per-J factor for plug EK5-P: k of 95 md, $\phi$ of 0.16, oil-brine at $\sigma$ of 48 dyn/cm and $\theta$ of 30 degrees, where $\sigma \cos\theta = 41.569219381653056$ and $\sqrt{95/0.16} = 24.36698586202241$. Check yourself against 7.8815651094764885 psi per J.

Second, in one sentence each: what breaks if a J curve is built with 0.21645 and consumed with 0.21665, and what breaks if it is built and consumed with 0.21665 throughout?
