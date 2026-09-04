# Skin in one paragraph

Skin is not a thing in the rock. It is a bookkeeping number, and knowing exactly what it is bookkeeping for is the whole of this module.

{{panel:st-acid-explorer}}

## The idea

Steady radial flow into a well spends its pressure drop across the drainage area, and the shape of that spending is logarithmic. Most of the drop happens near the well, because that is where the flow area is smallest. The controlling term is the logarithm of the drainage radius divided by the wellbore radius, 300 m over 0.108 m in the published case.

Now suppose the rock near the well is worse than the rest. There is an extra pressure drop, over and above what the logarithm predicts. Rather than model that ring explicitly every time, you write the extra drop as a dimensionless number and add it to the logarithm. That number is the skin.

## Why it is added inside, not outside

The logarithm is dimensionless. So the skin has to be dimensionless too, and it lands in exactly the same place in the expression. This is the reason skin can be compared across wells, fields and fluids: it has no units to carry.

It also means skin and the drainage logarithm are directly comparable in size. In the published case the damage skin is 8.481054145, and the drainage logarithm for a 300 m radius on a 0.108 m wellbore is smaller than that. Read that again. The last 0.9 m of rock is taking more of the drawdown than the entire remaining 299 m of reservoir.

## The sign

Positive skin means extra resistance, which is damage. Zero means the well behaves exactly as an undamaged wellbore of its own radius. Negative means the well behaves better than that, which requires that something has been added: wormholes, a fracture, an enlarged effective radius.

That last case is why the published carbonate job returns -1.287406553 and the published fracture returns -5.3116380662677045. Neither of them is a well without damage. Both are wells with an extra flow path.

## Exercise

Write the skin definition in your own words, in two sentences, without using any formula.

Say why the units of skin are dimensionless and what that buys you.

Then, using 8.481054145 and the drainage geometry of the published case, explain to a non specialist where the well's pressure drop is actually going.
