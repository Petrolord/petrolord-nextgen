# Ahmed 4-7, start to finish

The last module proved the collapse on plugs whose lab tables were generated from a designed curve, so agreement was guaranteed by construction. This module runs the same machinery against a published worked example with a printed answer at every stage: Example 4-7 in Ahmed's Reservoir Engineering Handbook, fourth edition, pages 224 to 226, the "Nameless Field". It is the anchor the engine's own test suite is armed with, and it is the case your Professional capstone grades.

The value of a published example is the same here as it was for the Fetkovich march in the Material Balance course: the author shows the intermediates, so when your number and the book's number part company you can see exactly where, and decide whether the gap is physics or rounding. In this example the gap is always rounding, and by the end of the module you will be able to say precisely how much rounding, at which step, and in which direction.

## What you are given

A laboratory capillary pressure curve measured on one core plug, and the properties of the plug and of the reservoir rock the curve must be carried to.

| quantity | lab core | reservoir |
|---|---|---|
| permeability $k$ | 80 md | 120 md |
| porosity $\phi$ | 0.16 | 0.19 |
| interfacial tension $\sigma$ | 50 dyn/cm | 50 dyn/cm |
| contact angle $\theta$ | 0 degrees | 0 degrees |

The measured drainage curve, exactly as printed:

| $S_w$ | $P_c$ (psi) |
|---|---|
| 1.0 | 0.50 |
| 0.8 | 0.60 |
| 0.6 | 0.75 |
| 0.4 | 1.05 |
| 0.2 | 1.75 |

The fluid system is the same on both sides, so the whole transfer is a rock correction: same fluids, different pore geometry.

## The factor that does the work

The J-function definition you met in module 2:

$$J(S_w) = 0.21645 \, \frac{P_c}{\sigma \cos\theta} \sqrt{\frac{k}{\phi}}$$

With $\theta = 0$ the cosine is 1, so $\sigma \cos\theta$ is just 50. The rock term is

$$\sqrt{\frac{k}{\phi}} = \sqrt{\frac{80}{0.16}} = \sqrt{500} = 22.360679774997896$$

so every Pc row is multiplied by one constant:

$$\frac{0.21645 \times 22.360679774997896}{50} = 0.0967993827459659 \ \text{per psi}$$

Ahmed prints this step as $J(S_w) = 0.096799 \, p_c$. The engine's `computeJTable` builds exactly the same constant internally, at full double precision. This number is the first of your capstone values: the lab J-per-psi factor, graded at a tolerance of 0.0001.

## The first row by hand

Take the top of the table, $S_w = 1.0$, $P_c = 0.50$ psi:

$$J(1.0) = 0.0967993827459659 \times 0.50 = 0.04839969137298295$$

The book prints 0.048. One multiplication, and you have reproduced the first entry of a published table to its last printed digit. The remaining four rows are the same multiplication with a different Pc, and lesson 2 walks the whole column.

## The shape of the whole example

Ahmed's solution has three steps, and this module gives each one a lesson:

1. Convert the lab Pc table to a J column with the lab factor (lesson 2).
2. Note that J is dimensionless and rock-free, so it travels.
3. Rescale the J column to the reservoir rock to get reservoir Pc (lesson 3).

Lesson 4 then does something the book does not: it runs the chain twice, once from the printed J column and once from the full-precision one, and measures the difference. That difference is small, but it is larger than the capstone tolerance, which is the whole reason to care.

## The misconception to avoid

The factor 0.0967993827459659 is not a property of the J-function, of the fluid pair, or of anything universal. It belongs to this one plug: change $k$, $\phi$, $\sigma$ or $\theta$ and the factor changes with it. Learners who carry "multiply by 0.0968" from one problem to the next are silently assuming every rock is an 80 md, 16 percent plug measured at 50 dyn/cm. The J-function's whole purpose is that the CURVE travels; the factor never does.

## Worked check

Confirm the constant is built from the pieces you were given and nothing else. $\sqrt{500}$ is 22.360679774997896. Multiply by the Leverett constant 0.21645 to get 4.839969137298295, divide by 50, and read 0.0967993827459659. If your calculator shows 0.09679938274, you are holding the same number at shorter precision, which is fine as long as you know that is what you hold. That distinction, casual here, becomes the entire point of lesson 4.

## Exercise

First, compute $J$ at $S_w = 0.6$ by hand from the printed $P_c$ of 0.75 psi and the factor above, to at least ten significant figures, and check it against the value the book prints as 0.073.

Second, suppose the same plug had been measured by mercury injection instead, with $\sigma$ of 480 dyn/cm and $\theta$ of 40 degrees. State which single quantity in the factor changes, whether the factor gets larger or smaller, and why the resulting J curve should nevertheless come out the same.
