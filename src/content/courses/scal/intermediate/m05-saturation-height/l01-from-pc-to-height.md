# From Pc to height

Everything this course has done with capillary pressure so far happened in a lab frame: a plug, a fluid pair, a table of psi against saturation. A reservoir does not present you with a Pc axis. It presents you with depth. The bridge between the two is short enough to write on one line, and this module crosses it: capillary pressure above the free water level is what a column of two fluids with different densities builds for free, so a Pc value IS a height, once you know the density contrast.

## The balance in the column

Stand at some height $h$ above the level where the water and oil pressures are equal. The water phase pressure has fallen from that level by the water gradient times $h$; the oil phase pressure has fallen by the oil gradient times $h$. Oil is lighter, so its pressure falls more slowly, and the gap between the two phase pressures grows linearly with height. That gap is the capillary pressure:

$$P_c(h) = (\gamma_w - \gamma_{hc}) \times 0.4335 \times h$$

with $h$ in feet, specific gravities on the water scale, and $0.4335$ psi/ft the fresh water pressure gradient, the same constant family the fractional flow gravity term uses. The engine inverts it:

$$h_{ft} = \frac{P_c}{0.4335 \, (\gamma_w - \gamma_{hc})}$$

That inversion is `heightFromPc`, and it throws if the density contrast is not positive, because a column where the hydrocarbon is denser than the water has no free water level above it to measure from.

## The Ekene pair

The Ekene brine is designed at $\gamma_w = 1.03$. The oil gravity is not a free choice: the field's PVT locked the oil at API 32 back when the material balance history was built, and specific gravity follows from it exactly:

$$\gamma_o = \frac{141.5}{131.5 + 32} = 0.8654434250764526$$

The contrast is $1.03 - 0.8654434250764526 = 0.16455657492354747$, and the working gradient for the whole module is

$$0.4335 \times 0.16455657492354747 = 0.07133527522935783 \ \text{psi/ft}$$

Read that number the way an operator would: each foot of height above the free water level buys the oil column a little over seven hundredths of a psi of capillary pressure. It takes about fourteen feet to build one psi. Gas against water would build pressure several times faster, because the contrast would be several times larger; a heavy oil barely distinguishable from the brine would take hundreds of feet to do the same work. The gradient is the exchange rate between the lab's Pc axis and the field's depth axis, and everything in the next four lessons is priced in it.

## Worked example

Take the Ekene reservoir Pc curve from module 2's collapse work: at $S_w = 0.65$ the curve reads $P_c = 1.3792171975130512$ psi. At what height above the free water level does the rock sit at that saturation?

$$h = \frac{1.3792171975130512}{0.07133527522935783} = 19.334294191458284 \ \text{ft}$$

That is the whole computation. One division. The engine's `swVsHeight` does exactly this to every row of the Pc table and then sorts by height, so the profile it returns is the Pc curve read sideways: saturation on one axis, height on the other, with the free water level at $h = 0$.

Notice what the units did. The Pc came from a J-function scaled in psi; the gradient is in psi per foot; so the height came out in feet. The engine works in field units throughout, and it will keep handing you feet even though every Ekene depth you know is in metres. Lesson 5 deals with that collision properly. Until then, watch the unit on every height you write down.

## The misconception to avoid

The formula does not say that saturation causes pressure or that pressure causes saturation. It says the column GEOMETRY sets the capillary pressure at each height, and the rock's drainage curve then answers with the saturation it can hold at that pressure. Two rocks in the same column at the same height feel the same $P_c$ but hold different water, because their curves differ. Height sets the question; the rock gives the answer. Keeping cause and effect in that order is what makes the next lesson's free water level a meaningful datum rather than a circular definition.

## Exercise

The Ekene reservoir Pc curve reads $11.03373758010441$ psi at $S_w = 0.30$.

First, convert that to a height above the free water level in feet, using the module gradient, and check your answer against the engine's profile, which lists $154.67435353166627$ ft for that row. Second, without computing anything new, say what happens to that height if the oil were heavier, say API 20, and explain in one sentence why a low-contrast column stretches its transition zone while a high-contrast column compresses it.
