# The story so far

The Associate tier taught you how oil is pushed. This tier taught you how oil is held. Between the two sits the whole of special core analysis: relative permeability decides what moves when both fluids are mobile, and capillary pressure decides where each fluid sits before anything moves at all.

The arc of this tier ran in one direction, from the laboratory toward the field. A capillary pressure curve is measured on a plug a few centimetres long, in a fluid system chosen for the convenience of the lab rather than the truth of the reservoir. Module 1 gave you the curve and its rules. Module 2 gave you the Leverett J-function, the dimensionless form that strips the plug's permeability, porosity and lab fluids out of the measurement, so that three plugs measured three different ways collapse onto one curve for the rock family. Module 3 walked a published example, the Nameless Field of Ahmed's Example 4-7, through the full chain: lab table to J column to reservoir curve. Module 4 taught you to fit the power law and to average several samples into one reservoir candidate. Module 5 cashed the whole chain in for the thing a field team actually wants: saturation as a function of height, a free water level, and a defensible statement about what the rock holds at the crest.

## The six numbers you earned

Each of the Professional capstone's graded quantities was earned in a specific module, by a specific chain, in specific units. That table is worth reading twice, because the capstone will grade the chain as much as the number.

| Quantity | Value | Where it was earned |
|---|---|---|
| Lab J-per-psi factor, Ahmed 4-7 | $0.0967993827459659$ | Module 3, from $C \sqrt{k/\phi} / (\sigma \cos\theta)$ on the lab core |
| $J$ at $S_w = 0.2$, Ahmed 4-7 | $0.16939891980544033$ | Module 3, the full-precision J column |
| Reservoir $P_c$ at $S_w = 0.2$, Ahmed 4-7 | $1.5534071373580902$ psi | Module 3, the book's own printed-J chain |
| Ekene entry height | $3.142982863763458$ m | Module 5, entry pressure over the gradient |
| Ekene free water level | $1563.1429828637636$ m TVD | Module 5, contact plus entry height |
| Ekene saturation at the crest | $0.35062979402484734$ | Module 5, the J curve read at the crest height |

Notice what the table quietly insists on. The reservoir $P_c$ value follows the printed chain, the one the book itself used, rescaling the rounded three-decimal J column rather than the full-precision one. Module 3's last lesson showed that the two chains disagree by more than the grading tolerance, so this is not pedantry, it is the difference between a right answer and a wrong one. The two height quantities are in metres, though the engine works in feet, so the exact factor 0.3048 sits inside both. And the crest saturation is the number that ties this whole tier back to the field you have carried since geoscience: the booking's flat 0.35 turns out to be what the crest, and only the crest, drains to.

## Where the two halves meet

SCAL is one subject wearing two coats. The capillary half you finished here says where the fluids start. The displacement half from the Associate tier says what happens when you push. The capstone belongs to this tier, but the course belongs to both, so bring the displacement machinery back into your hands before you sit it.

## See it in the panel

{{panel:sc-displacement-explorer}}

Set the oil viscosity back to the Ekene value of 1.8 cp and the water exponent to 2.5, and confirm the six Associate quantities still read as you remember them: mobility ratio 1.2, front saturation 0.6372, displacement efficiency at breakthrough just under 0.51. Then slide the oil viscosity to 5 cp and watch which tiles move and which do not. The ceiling tile does not move, because endpoints alone set it. If you can explain every tile that moved using only the fractional flow curve, the Associate half is still yours.

## The misconception to avoid

The tier's most expensive misconception is that the J-function is a property of the fluids. It is the opposite: J exists precisely to remove the fluids from the measurement. The fluid pair enters through $\sigma \cos\theta$ on the way into J and leaves again on the way out, which is why a mercury table six times taller than an air-brine table carries the same J curve. If your J curves from two lab programmes disagree, the first suspects are the rock properties and the contact angle you assumed, not the physics.

## Exercise

First, without opening a panel, write the six capstone quantities from memory with their units, and against each one write the single most likely way to get it wrong: wrong chain, wrong unit, wrong height datum. Check yourself against the table above.

Second, explain in three sentences why the printed-J chain and the full-precision chain give different reservoir curves for the Nameless Field, and why the capstone grades the printed one. If your explanation does not contain the word rounding, start again.
