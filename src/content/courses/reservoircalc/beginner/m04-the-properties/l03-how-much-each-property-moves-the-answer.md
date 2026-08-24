# How much each property moves the answer

You now know where the four properties come from and that each of them is a result with uncertainty attached. The practical question follows: if one of them is wrong, how wrong is the booking? At this tier the answer is unusually clean, because the whole chain is a product.

## The chain is one product

Write out module 3 in a single line:

$$\mathrm{STOIIP} = \mathrm{GRV} \times \mathrm{NTG} \times \phi \times (1 - S_w) \times \frac{6.2898}{B_o}$$

Nothing is added anywhere. There is no threshold, no cutoff, no term that switches on above some value. Every property enters exactly once, as a factor.

That has a direct consequence. In a product, a relative change in any one factor produces the same relative change in the result. Multiply NTG by 1.1 and the whole expression is multiplied by 1.1. This is the definition of a linear response, and here it holds exactly rather than approximately, over any size of change.

So STOIIP scales linearly with NTG, linearly with porosity, linearly with the hydrocarbon fraction $1 - S_w$, and inversely with $B_o$.

## Working a 10 percent error through

Take each property in turn and suppose it is 10 percent too high in relative terms, everything else being correct.

**NTG.** The true value is 0.8 and the sheet says 0.88. The factor is multiplied by 1.1, so the booking is 10 percent too high. The transmission is one for one.

**Porosity.** The true value is 0.20 and the sheet says 0.22. Again the factor is multiplied by 1.1, and again the booking is 10 percent too high. Porosity and NTG have identical leverage, which is worth remembering because porosity gets far more attention in reviews than NTG does.

**Water saturation.** This one is different, and the difference is where the arithmetic earns its keep. A 10 percent relative error in $S_w$ takes 0.35 to 0.385. The factor in the chain is not $S_w$ but $1 - S_w$, which moves from 0.65 to 0.615. The absolute change is 0.035, and as a fraction of 0.65 that is a bit over 5 percent, so the booking falls by a bit over 5 percent rather than by 10.

The damping factor is the ratio $S_w / (1 - S_w)$, which here is 0.35 over 0.65, a little more than one half. Note what that ratio does at other saturations. In a tight rock at $S_w = 0.6$ the ratio is 1.5, so a 10 percent error in saturation would move the booking by 15 percent. In a clean sand at $S_w = 0.15$ the ratio is under 0.2 and the same relative error barely registers. Saturation uncertainty hurts most exactly where the reservoir is worst.

**Formation volume factor.** The true value is 1.2 and the study says 1.32. The chain divides by $B_o$, so the booking is multiplied by 1.2 divided by 1.32, which is about 0.909. The booking falls by about 9 percent. The response is inverse in sign and very slightly damped in size, and for small errors it is close enough to one for one that you can treat it as such.

## Errors combine by multiplication

Because the chain is a product, errors do not add. They multiply.

If NTG is 10 percent high and porosity is also 10 percent high, the booking is not 20 percent high. It is multiplied by 1.1 twice, which is 21 percent high. For small errors the difference between adding and multiplying is minor, but the direction is worth knowing: independent errors that all point the same way compound slightly worse than a simple sum suggests.

The more important point about combination is that errors can cancel. A porosity that is 10 percent low against a $B_o$ that is 10 percent low will very nearly offset, and the booking will look correct while both inputs are wrong. A number that comes out right is not evidence that the inputs were right. Only the inputs are evidence for the inputs.

## Nothing here competes with the contact

Now put those property sensitivities beside the one thing this course keeps returning to.

| Contact | STOIIP |
| --- | --- |
| 1550 m | 3.835815 MMstb |
| 1560 m | 12.139208 MMstb |
| 1570 m | 22.044451 MMstb |

Moving the contact 10 m deeper from the capstone case takes the booking from 12.139208 to 22.044451 MMstb. Moving it 10 m shallower takes it to 3.835815 MMstb. Those are not 10 percent effects. The step down is a fall to less than a third, and the step up is close to a doubling.

The reason is structural. Every property in the chain multiplies a fixed volume by a fixed fraction, so it can only ever produce a proportional change. The contact does something else. It changes which cells are in the accumulation at all, from 128 cells to 169 to 190, and at the same time it adds column to every cell that was already contributing. Two effects compound, and the response is much steeper than linear.

The working conclusion is a matter of where to spend effort. If the contact is uncertain by 10 m, arguing about whether porosity is 0.20 or 0.21 is not the best use of the afternoon. Establish the contact first, from pressure data, from fluid samples, from a logged contact in a well, or from the deepest closing contour if nothing better exists. Then argue about the properties.

## Exercise

Your petrophysicist revises porosity from 0.20 to 0.18 and, in the same pass, revises water saturation from 0.35 to 0.30. Without computing a volume, state the direction and approximate relative size of each effect on the booked STOIIP, and say what the net direction is.

Self check: porosity falls by 10 percent in relative terms, so the booking falls by 10 percent, one for one. Water saturation falls by 0.05, so the hydrocarbon fraction rises from 0.65 to 0.70, which is 0.05 out of 0.65 and therefore an increase of a bit under 8 percent. The two effects are close in size and opposite in sign, so the net change is small and slightly downward. That is exactly the cancellation the lesson warns about, and it means a booking that barely moved conceals two properties that both changed.
