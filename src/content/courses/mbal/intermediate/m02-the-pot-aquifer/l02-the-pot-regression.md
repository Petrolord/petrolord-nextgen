# The pot regression

You have one equation per survey and two unknowns: the oil in place and the aquifer water in place. Six surveys give six equations, which is plenty of information in principle. The question is how to arrange it so that both unknowns fall out at once.

Havlena and Odeh's discipline answers it. Choose the axes so that each unknown becomes a slope or an intercept, then let the shape of the plot testify. Here is what that discipline produces when an aquifer term is present.

## The rearrangement the engine uses

Write the balance for an oil tank with a pot aquifer, keeping the rock and connate water term explicit:

$$F = N E_o + N m E_g + N (1+m) E_{fw}' + (c_w + c_f) W (p_i - p)$$

where $E_{fw}'$ is the rock and water expansion with its $(1+m)$ factor pulled out. Group by what each term is proportional to. The oil and gas cap expansions are lumped as $E_m = E_o + m E_g$, and everything else on the right is proportional to the drawdown. Divide through by $E_m$:

$$\frac{F}{E_m} = N + \left[ N B_{ti}(1+m)\frac{S_{wi}c_w + c_f}{1 - S_{wi}} + (c_w + c_f) W \right] \frac{p_i - p}{E_m}$$

Plot $F/E_m$ on the vertical axis against $(p_i - p)/E_m$ on the horizontal, and you have $y = c + m x$ with

- **intercept** $= N$, the oil in place
- **slope** $=$ the bracket, which carries the reservoir's own rock and water term and the aquifer term together

That is exactly what the engine does in the pot branch of its oil solver: it builds the two coordinate arrays from each timestep's $F$, drawdown and $E_m$, fits an ordinary least squares line, and takes the intercept as the oil in place.

On an oil tank with no gas cap, $m = 0$ and $E_m = E_o$, which is the case both this module's tanks are in.

## The unknown has moved

Register what just happened, because it is the thing to carry out of this lesson.

On a closed tank the oil in place was the slope. Here it is the intercept. The Associate tier flagged that this would happen: when a tank imports water, the balance gains a term, the plot gains an axis, and the unknown you want moves from the slope to the intercept.

Re-point everything you know about reading a fitted line accordingly. On the closed tank plot the intercept was a diagnostic and the slope was the answer, so a wandering intercept was evidence rather than damage. On the pot plot the intercept is the answer, and anything that disturbs it disturbs your booking directly.

## Why the denominator is not the total expansion

The obvious alternative is to divide by $E_t$ rather than by $E_m$, since $E_t$ is the quantity the whole Associate tier was built on. The engine deliberately does not, and its source says why: an $E_t$ based regression does not reproduce the published pot aquifer benchmark, because $E_t$ already absorbs $E_{fw}$ into the denominator and that distorts the line.

The reason in words. $E_{fw}$ is proportional to the drawdown and its contribution to the withdrawal is proportional to $N$, so it belongs with the other drawdown-proportional terms on the right hand side, grouped into the slope alongside the aquifer term. Put it into the denominator instead and you have mixed a quantity carrying the unknown $N$ into the horizontal axis. The plot is then no longer linear in the unknowns, the intercept stops being a clean $N$, and the fit answers a question nobody asked.

That generalises past this one plot. When you construct a straight line form, sort every term by which unknown it multiplies, not by which bundle it usually travels in. $E_t$ is a convenient bundle for a closed tank and the wrong bundle here.

## Reading $W$ back out

The slope is a mixture, so the aquifer water in place is not read off it directly. It is recovered by subtracting the part of the slope the reservoir itself contributes:

$$W = \frac{\text{slope} - N B_{ti}(1+m)\dfrac{S_{wi}c_w + c_f}{1 - S_{wi}}}{c_w + c_f}$$

which is the formula the engine applies immediately after the fit. Note the order: the intercept gives $N$, then $N$ gives the reservoir's contribution to the slope, then the remainder of the slope gives $W$. An error in the intercept propagates straight into $W$, and lesson 4 is about how large that error can be.

## Worked example

Run the constructed tank of module 1, with its 20000000 rb pot aquifer, through the engine with the pot model selected.

The fit returns an intercept of 11999999.9999999 stb and a slope of 251.876923076925. The truth built into the tank was 12000000 stb, recovered to twelve significant figures.

Now recover the aquifer. The reservoir's own contribution to the slope is

$$N B_{ti} \frac{S_{wi}c_w + c_f}{1 - S_{wi}} = 12000000 \times 0.00000932307692307692 = 111.876923076923$$

reservoir barrels per psi. That number is the tank's rock and connate water response per psi of drawdown, the same quantity the Associate tier computed for Ekene as 113.174770971432 rb/psi. Subtract it from the slope and divide by the compressibility group:

$$W = \frac{251.876923076925 - 111.876923076923}{0.00000700000000000000} = \frac{140.000000000002}{0.00000700000000000000} = 20000000.0000003 \ \text{rb}$$

The engine reports 20000000.0000004 rb. Both unknowns recovered from six surveys, to the precision the arithmetic can carry.

Do the same on the 5000000 rb version and the fit returns a slope of 146.876923076922, the same reservoir contribution of 111.876923076923, a remainder of 35.0000000000000 reservoir barrels per psi and an aquifer of 4999999.99999980 rb.

## See it in the panel

{{panel:mb-tank-explorer}}

Set the selector to "Pot aquifer (not needed here)" and look at two tiles together: "OOIP from the slope" and "Intercept". They show the same number.

That is not a bug, and it is worth understanding before lesson 4 asks you to grade a number off it. In the pot branch the oil in place IS the intercept, so the two tiles report the same quantity, and the label was written for the closed tank case where the oil in place is the slope. Whenever you read a material balance output, check which regression produced it before interpreting a slope or an intercept.

Note also that the survey table does not change when you move the selector. $F$, $E_o$, $E_{fw}$, $E_t$ and $F/E_t$ are properties of the data, not of the aquifer model.

## Exercise

A pot regression on an oil tank with no gas cap returns an intercept of 8400000 stb and a slope of 210 reservoir barrels per psi. The tank has $B_{ti} = 1.25$ rb/stb, $S_{wi} = 0.28$, $c_w = 0.000003$ and $c_f = 0.000005$ per psi.

Compute the compressibility group $S_{wi}c_w + c_f$, then the reservoir's contribution to the slope, then the aquifer water in place. Work in that order and keep the units attached at each step.

Then answer this. Suppose the intercept had come back 10 percent higher, at 9240000 stb, with the slope unchanged. Recompute $W$ and say by what percentage it moved. Which of the two unknowns is the more fragile, and why does the answer depend on how large the aquifer term is compared with the reservoir term inside that slope?
