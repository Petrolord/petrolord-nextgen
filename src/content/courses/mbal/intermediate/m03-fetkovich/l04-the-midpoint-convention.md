# The midpoint convention

The marching equation asks for $p_{wf}[n]$, the reservoir pressure at the aquifer face during step $n$. Your data does not contain that. Your data contains a pressure at the start of the step and a pressure at the end of it, and the reservoir spent the step somewhere between the two.

So you have to choose. Most people never notice they are choosing, which is exactly why this lesson exists. The choice is worth sixteen percent of your water influx.

## Three candidates

Take step 1 of the published history. The reservoir was at 2740 psia at the start of the year and 2500 psia at the end. Three defensible things you might write down:

- the start-of-step pressure, 2740 psia
- the end-of-step pressure, 2500 psia
- the midpoint, $(2740 + 2500)/2 = 2620$ psia

Ahmed's solution makes the choice explicit, and it is the third:

$$p_{wf}[n] = \frac{p[n-1] + p[n]}{2}$$

The engine implements the same convention. In `computeFetkovichWe` the line reads `const p_wf = (p_prev + p_curr) / 2;` with the comment `midpoint convention` beside it. This is not the engine picking a house style. It is the engine following the published method, and it is why the engine reproduces the printed influx column.

For the four steps of the published history the midpoints are

$$\frac{2740 + 2500}{2} = 2620, \quad \frac{2500 + 2290}{2} = 2395, \quad \frac{2290 + 2109}{2} = 2199.5, \quad \frac{2109 + 1949}{2} = 2029$$

Compare those against the book's printed $\bar{p}_r$ column: 2620, 2395, 2199, 2029. Three match exactly and the third is the book rounding $2199.5$ down to a whole psi. The overbar on $\bar{p}_r$ was telling you all along that this is an average across the step, not a reading at an instant.

## Why the choice is not neutral

The drawdown driving the influx is $\bar{p}_a[n-1] - p_{wf}[n]$. The aquifer pressure is fixed by the previous step, so whatever you choose for $p_{wf}$ moves the drawdown by exactly the same amount in the opposite direction. Choose a lower reservoir pressure and you get a larger drawdown and more water. Choose a higher one and you get less.

That gives the errors a direction you can predict before you compute anything:

**The start-of-step pressure understates the influx.** In step 1 it is catastrophic. The aquifer starts at 2740 and the reservoir starts at 2740, so the drawdown is zero and the model delivers no water at all in the first year, which is plainly false: the reservoir dropped 240 psi during that year and the aquifer felt it. Every later step inherits the deficit, and the cumulative influx after four steps comes out at $31.7496087853307$ MMbbl against the correct $37.9731544101719$, an error of $-16.3893300978283$ percent.

**The end-of-step pressure overstates the influx.** In step 1 the drawdown becomes $2740 - 2500 = 240$ psi, exactly double the midpoint's 120 psi, so the step delivers exactly double the water: $7850495.69460241$ bbl instead of $3925247.84730120$ bbl. Cumulative influx after four steps reaches $44.1967000350130$ MMbbl, an error of $+16.3893300978283$ percent.

Read those two percentages again. They are the same magnitude with opposite signs, and that is not a coincidence: the midpoint sits exactly halfway between the two alternatives at every step, and the influx is linear in $p_{wf}$, so the two errors are mirror images. The midpoint is not a compromise between two reasonable options. It is the only one of the three that does not bias the answer.

There is a common misstatement of this point that you should be able to correct on sight. It is sometimes written that using the end-of-step pressure understates early influx. It does the opposite. The end-of-step pressure is the lowest of the three candidates, so it produces the largest drawdown and the most water, and the overstatement is worst in the very first step, where it is a clean factor of two.

## Worked example: step 1 three ways

Constants for the published case: the reduced marching constant is $32710.3987275100$ bbl per psi and the aquifer starts at 2740 psia.

Start-of-step, $p_{wf} = 2740$:

$$\Delta p = 2740 - 2740 = 0, \qquad \Delta W_e = 32710.3987275100 \times 0 = 0 \ \text{bbl}$$

Midpoint, $p_{wf} = 2620$:

$$\Delta p = 120, \qquad \Delta W_e = 32710.3987275100 \times 120 = 3925247.84730120 \ \text{bbl}$$

End-of-step, $p_{wf} = 2500$:

$$\Delta p = 240, \qquad \Delta W_e = 32710.3987275100 \times 240 = 7850495.69460241 \ \text{bbl}$$

The book prints 3.925 MMbbl for this step. Only the midpoint reproduces it, and it does so to four figures.

Follow the three marches to the end and the ordering holds, though the gap narrows in relative terms because the aquifer's own pressure adjusts. The start-of-step march takes less water out, so its aquifer stays stronger and pushes harder later. Neither self-correction rescues the answer, and both leave the shape of the influx curve wrong even where the final total looks tolerable.

## Why the midpoint is the right physics, not just the right convention

The influx over a step is an integral of rate against time, and the rate depends on the reservoir pressure through the step. Over a single step the reservoir pressure is close to linear in time, and the average of a linear function over an interval is its midpoint value. So the midpoint is the pressure that reproduces the integral, to first order, with one evaluation. The other two candidates evaluate the integrand at an endpoint and pretend the whole step looked like that instant.

This also tells you when to worry. If the pressure moves in a strongly curved way inside a step, the midpoint of the endpoints is no longer the average of the path, and the fix is a shorter timestep rather than a better averaging rule. A step that spans four years is averaging over four years you did not look at.

## At the panel

{{panel:mb-aquifer-explorer}}

The table at the foot of the panel prints the book's own **printed pr_bar** column beside the engine's influx. Check the four entries 2620, 2395, 2199 and 2029 against the four midpoints computed above, and satisfy yourself that the only discrepancy is the rounding of 2199.5.

The panel always marches with the midpoint, because the engine does. To see the alternatives you have to do the arithmetic yourself, which is the exercise.

## Exercise

Take step 2 and work it three ways by hand. The aquifer enters the step at $2689.25228502350$ psia, the reservoir was at 2500 psia at the start of the step and 2290 psia at the end, and the reduced marching constant is $32710.3987275100$ bbl per psi.

Compute the drawdown and the step influx for the start-of-step, midpoint and end-of-step choices. Confirm that the midpoint result is the average of the other two, and confirm that the midpoint result matches the panel's second step.

Then answer this. Suppose your pressure surveys are not annual but come at 30, 400 and 1500 days. Does the midpoint rule still give the average pressure over each step, and if not, which step is the least trustworthy and what would you do about it?
