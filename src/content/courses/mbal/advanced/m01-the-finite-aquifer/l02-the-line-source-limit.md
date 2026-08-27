# The line source limit

Lesson 1 showed that `pD` and `pDFinite` disagree by a factor of twenty five at $t_D$ 0.1 and that the disagreement is indifferent to the size of the aquifer. That is a strong claim and it deserves to be pinned down properly, because the line source is not a bad solution. It is an excellent solution to a slightly different question, and knowing where it stops being an excellent solution to yours is the difference between using it confidently and using it by accident.

## What was thrown away

Go back to the definition. The line source takes the producing body and shrinks its radius to zero while holding the flow rate constant. What survives is a pressure field that depends only on the group $r^2 \phi \mu c_t / (k t)$, and at the contact itself, where you want to evaluate it, that group has been collapsed into $t_D$ alone. The reservoir radius is gone from the equation. It has not been set to a large value or a small one. It has been removed.

That is why the error is worst at early time. A real reservoir of radius $r_R$ has been draining water across its entire circumference since the first day, so the pressure drop at the contact starts building immediately. A point of zero radius has nothing to drain across, so at small $t_D$ its computed drawdown is nearly nothing. The line source does not underestimate the pressure drop by a little at early time. At $t_D$ 0.05 it is 99.7504553307348 percent below the bounded solution, which is to say it reports essentially zero.

The convergence as time passes is the interesting part, and it is slower than most engineers assume. Measured against an aquifer of $r_{eD}$ 200, which for these times is effectively infinite, the line source sits 96.0354475216093 percent low at $t_D$ 0.1, 35.2456814663252 percent low at $t_D$ 1, 9.43242550591380 percent low at $t_D$ 5, 5.00579342097884 percent low at $t_D$ 10, 2.08927420206349 percent low at $t_D$ 25, 1.06020115238775 percent low at $t_D$ 50 and 0.533293080690861 percent low at $t_D$ 100. Searching that curve on a fine grid, the line source first comes within five percent at a $t_D$ near 10.5, within two percent near 26.5 and within one percent near 53.5. So the honest rule is that the line source is a one percent representation of an unbounded aquifer only after about fifty dimensionless time units, and everything earlier than that is an approximation you should be able to defend.

## The panel already contains the proof

You do not need an $r_{eD}$ of 200 to see this. Look at the tile marked **tD 5, finite / line source** as you step the selector upward. At $r_{eD}$ 5 it reads 1.11701, at $r_{eD}$ 10 it reads 1.10414 and at $r_{eD}$ 20 it reads 1.10415, the underlying engine values being 1.11701268357594, 1.10414334962415 and 1.10414792520122. The last two agree to five significant figures, and the value they agree on, 1.104, is the same number the calculation at $r_{eD}$ 200 gives, 1.10414793107361.

Read what that means. Once the aquifer is ten times the reservoir radius or larger, the tile at $t_D$ 5 has stopped responding to the aquifer size entirely. Whatever is left is not a boundary effect. It is the residue of the point source idealisation, and it is worth 10.4147925201219 percent. At $r_{eD}$ 5 the same tile reads 11.7012683575945 percent above unity, so the boundary contributes only the difference: dividing the two ratios gives 1.01165129968648, a boundary contribution of 1.16512996864810 percent against an idealisation contribution of 10.41 percent. At that point on the curve the wall is a minor character.

## A third representation lives in the repository

Here is something worth knowing before module 2, because it decides what the material balance engine is actually doing. The Carter-Tracy routine inside `engines/mbal/mbalEngine.ts` does not call `pD`. It carries its own infinite acting function, the Lee and Wattenbarger rational fit

$$p_D(t_D) \approx \frac{370.529\sqrt{t_D} + 137.582\,t_D + 5.69549\,t_D^{1.5}}{328.834 + 265.488\sqrt{t_D} + 45.2157\,t_D + t_D^{1.5}}$$

and that fit is not a fit to the line source. Evaluate it against the bounded solution at $r_{eD}$ 200 and it agrees to 0.0253026204640359 percent at $t_D$ 0.1, to 0.000671981190288351 percent at $t_D$ 5 and to 0.0000535441719464012 percent at $t_D$ 100, with a worst case of 0.520054132513312 percent at $t_D$ 1. It is a fit to the finite radius infinite acting solution, the one that keeps the inner boundary and drops only the outer one. So the repository holds three representations of an unbounded aquifer, and the line source is the odd one out. When you compare an influx computed by the material balance engine against one computed by `aquiferInflux.js` you are not only comparing two codes, you are comparing two different early time idealisations.

## Worked example: is the line source safe on Dake 9.2?

Module 2 works Dake Exercise 9.2, whose Carter-Tracy march runs over dimensionless times from $t_D$ 5.67218226008396 at the end of year 1 to $t_D$ 56.7218226008396 at the end of year 10, using the `aquiferInflux.js` time coefficient of 0.0155402253700930 per day on 365 day years.

Set the aquifer aside for a moment and ask only whether the line source would be an acceptable stand in for the infinite acting part of that history. At year 1, $t_D$ is 5.67, and the one percent threshold is near $t_D$ 53.5. So the first nine of the ten steps sit inside the region where the line source is more than one percent low, and the first step sits where it is roughly nine percent low. The answer is no. Even before the outer wall enters the discussion, the point source idealisation is doing visible damage across most of this history, which is exactly why the material balance engine carries the Lee and Wattenbarger fit rather than the exponential integral.

## At the panel

{{panel:mb-pd-explorer}}

Set the selector to $r_{eD}$ 20 and look at the plot rather than the tiles. On the logarithmic time axis the blue line source curve starts far below the orange bounded curve, climbs steeply, and only merges with it towards the right hand end. Note that the merge happens on the right, not the left. Then set the selector to $r_{eD}$ 2 and watch the orange curve leave the blue one almost immediately after they touch. Between those two extremes you can see both halves of the story: a left hand gap that belongs to the point source, and a right hand gap that belongs to the wall.

## Exercise

Using the panel, fill in a small table of the **tD 5, finite / line source** tile at every one of the five available $r_{eD}$ settings. Then answer three questions.

First, at which setting does the tile stop changing, to five significant figures, and what does that tell you about how far away a boundary has to be before it stops mattering at that particular time? Second, the tile at $r_{eD}$ 2 reads 2.96611 while the tile at $r_{eD}$ 3 reads 1.48135. Decompose each of those into an idealisation part and a boundary part, using 1.104 as the idealisation floor, and state the two boundary contributions as percentages. Third, an engineer proposes to model a large aquifer at early time using the line source because the aquifer is unbounded and the line source is the unbounded solution. Write the two sentence rebuttal you would put in a review comment, and name the dimensionless time above which you would withdraw the objection.
