# Differential liberation

The experiment built to imitate what happens in the reservoir, and the one whose numbers are most often misused.

## What is done

Start at the bubble point at reservoir temperature. Drop the pressure by a step. Gas comes out of solution.

Now REMOVE that gas from the cell, at constant pressure, and measure its volume at standard conditions and its gravity. Then drop the pressure again and repeat.

That removal is the whole point and it is what makes the process differential rather than flash. At every step the liquid that remains is in contact with less gas than it started with, so its composition changes as the experiment proceeds.

At the end, the cell is taken to atmospheric pressure and the remaining liquid is cooled to 60 F. That is the RESIDUAL oil, and its volume is the reference for the whole experiment.

## Why the reservoir resembles this

Because in the reservoir, gas that comes out of solution has its own mobility. Once free gas exceeds its critical saturation it flows, and it flows faster than the oil, so it separates from the oil that released it.

The oil left behind is progressively stripped of light components, exactly as in the cell. That is why the differential liberation is the experiment that represents depletion.

## What it reports

**Bod**, the differential formation volume factor: cell liquid volume at each pressure divided by the residual oil volume at 60 F.

**Rsd**, the differential solution gas ratio: gas remaining in solution at each step, divided by the residual oil volume.

**Gas z factor, gas gravity and Bg** for each liberated gas increment.

**Oil density** through the depletion.

## The reference is the problem

Every one of those is divided by the RESIDUAL oil volume: what is left after taking the fluid to atmospheric pressure in a series of differential steps and cooling it.

A stock tank barrel is not that. A stock tank barrel is what comes out of a separator train, which is a small number of flash stages at chosen pressures, and it is a different volume.

For most oils the residual volume is SMALLER than the stock tank volume from an optimally staged separator train, because differential liberation strips more of the intermediate components. So dividing by it gives numbers that are too large.

Take a differential Bod of 1.6 and use it as Bo and you have overstated the formation volume factor by several percent. The same for Rsd.

## The conversion

The standard correction, from Amyx and reproduced in McCain:

$$B_o = B_{od}\frac{B_{ofb}}{B_{odb}}, \qquad R_s = R_{sfb} - (R_{sdb} - R_{sd})\frac{B_{ofb}}{B_{odb}}$$

where the `fb` quantities come from the SEPARATOR test at the bubble point and the `db` quantities are the differential values at the bubble point.

Read the structure rather than the symbols. It rescales the differential curve so that it passes exactly through the separator test's value at the bubble point, and it keeps the differential SHAPE below that. It is exact at the bubble point by construction and approximate everywhere else.

That is an honest description of what the correction is: a shape from one experiment, anchored to a level from another.

## Why it is approximate

Because the real journey from reservoir to tank is neither purely differential nor purely flash. It is differential in the reservoir, then flash through the separators, and the crossover is somewhere in the tubing.

No laboratory procedure reproduces that exactly, so the industry standard is to measure both bounding processes and combine them by a rule. The rule is a modelling choice and it should be named when the resulting table is quoted.

## The misconception to avoid

"The differential liberation is the more realistic experiment, so its numbers are the ones to use." It is the more realistic RESERVOIR process and its numbers are referenced to a residual oil nobody sells. Using them directly overstates Bo and Rs by several percent, which is the largest avoidable error in reading a PVT report.

## Exercise

First, describe the differential liberation in four sentences, making clear what is removed at each step and what the final reference volume is.

Second, explain in two sentences why the Amyx correction is exact at the bubble point and approximate below it.
