# Back to reservoir Pc

The J column travels. This lesson lands it on the reservoir rock: 120 md, 19 percent porosity, the same 50 dyn/cm water system at zero contact angle. Nobody ever ran a capillary experiment on this rock. By the end of the lesson it has a full Pc curve anyway, and the value at $S_w = 0.2$ is your third capstone number.

## The factor, pointed the other way

Going from lab Pc to J, you multiplied by a J-per-psi factor. Coming back, you need psi per unit J, built from the RESERVOIR rock:

$$\text{psi per J} = \frac{\sigma \cos\theta}{0.21645 \sqrt{k/\phi}} = \frac{50}{0.21645 \times \sqrt{120/0.19}} = 9.191758209219469$$

Ahmed prints this step as $p_c = 9.192 \, J(S_w)$. Note the structure: the same three rock and fluid quantities, but now $\sqrt{k/\phi}$ sits in the denominator, because you are converting a dimensionless J back into a pressure.

## The chain the book actually runs

Here is the detail that decides your capstone answer. Ahmed's step 3 does not go back to the lab Pc table. It takes the J column AS PRINTED in step 1, the three-decimal one, and multiplies each entry by 9.192. The engine reproduces that chain exactly when you hand `pcFromJ` the printed column as a tabulated J spec:

| $S_w$ | printed $J$ | engine reservoir $P_c$ (psi) | book prints |
|---|---|---|---|
| 0.2 | 0.169 | 1.5534071373580902 | 1.553 |
| 0.4 | 0.102 | 0.9375593373403855 | 0.938 |
| 0.6 | 0.073 | 0.6709983492730213 | 0.671 |
| 0.8 | 0.058 | 0.5331219761347291 | 0.533 |
| 1.0 | 0.048 | 0.4412043940425345 | 0.441 |

Every printed answer is the engine's value rounded to three decimals. The value at $S_w = 0.2$, 1.5534071373580902 psi, is the capstone field `res_pc_sw02`, graded at a tolerance of 0.002. The prompt tells you to use the printed J column, and lesson 4 shows what happens if you do not.

## Worked example: the top row

$S_w = 1.0$: printed J is 0.048.

$$P_c^{res}(1.0) = 0.048 \times 9.191758209219469 = 0.4412043940425345 \ \text{psi}$$

Compare with the lab measurement at the same saturation: 0.50 psi. The reservoir curve sits BELOW the lab curve at every saturation. That is physics, not accident: the reservoir rock's $k/\phi$ is $120/0.19 = 631.578947368421$ against the plug's 500. Better rock, in this specific sense of more permeability per unit porosity, has larger pores, and larger pores hold any given saturation at lower capillary pressure. The J-function knew that the moment you gave it the two rock descriptions.

## Two factors, two rocks, no reciprocals

A trap worth naming explicitly. The lab factor was 0.0967993827459659 J per psi. Its reciprocal is $1/0.0967993827459659 = 10.330...$, and that number converts J back to psi ON THE LAB PLUG. It is not the reservoir factor. The reservoir factor, 9.191758209219469, is built from the reservoir's own $k$ and $\phi$. If the two factors had been reciprocals, the exercise would have been pointless: you would have recovered the lab curve you started with. The gap between 10.33 and 9.19 IS the rock correction, the whole reason the J-function exists.

## The misconception to avoid

Dividing by the lab factor instead of multiplying by the reservoir factor. It feels symmetric, it produces a plausible curve, and every value on it is wrong by the ratio of the two rocks' $\sqrt{k/\phi}$. The defense is mechanical: write the factor with its rock's name attached, "9.191758209219469 psi per J on the 120 md reservoir rock", and the error becomes impossible to make silently.

## Exercise

First, rebuild the reservoir Pc at $S_w = 0.6$ from the printed J of 0.073 and the reservoir factor, to full calculator precision, and check it against the table above and the book's 0.671.

Second, compute the ratio of the reservoir factor to the lab plug's psi-per-J factor (that is, $9.191758209219469$ against $1/0.0967993827459659$), and state in one sentence what single rock quantity that ratio is measuring.
