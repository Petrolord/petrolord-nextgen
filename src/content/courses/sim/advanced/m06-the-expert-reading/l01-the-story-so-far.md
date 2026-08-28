# The story so far

Three tiers on one deck. The Associate tier read it, the Professional tier audited it, and this tier built the parts that require a decision.

## Trajectories

A vertical well is two numbers. A deviated well is a path, and its completions are wherever that path crosses a cell.

Ekene's side-track runs from Ekene-6 at (1900, 1800) to (1500, 2100), descending through the column as it goes. Intersecting it against the grid gives

$$11 \text{ connections across } 8 \text{ distinct columns}$$

from cell (20, 19) to cell (16, 22), each carrying a length and a direction. Three columns are entered in one layer and left in the next, which is why eleven connections cover eight columns.

Every connection reads direction X, because the path covers 500 m horizontally and about 10 m vertically, so the horizontal component dominates within every cell. A flag defaulted to Z on a well like this would overstate the well index by roughly the square root of the permeability anisotropy.

## The history schedule

Thirty six monthly periods, rates from volumes by the real month length, closed by a final date one month past the last period.

The round trip is the check: rate times days summed over the history gives

$$176923.83644033302 \text{ stb}$$

against the ledger's 176923.83644033293. Agreement in the last bits of a double is what an exact conversion looks like, and a mean-month divisor instead would have put February nearly ten percent out.

## The calibration

One free parameter, the kriging regional mean, set by bisection so the model reproduces the booked oil volume:

$$\mu = 1570.026311 \text{ m TVD}$$

giving 12132366.897955146 stb against the booked 12139208.107496763, a gap of minus 0.056 percent. The residual is the size of the smallest step the model can take, because oil volume changes in jumps as columns cross the contact.

It cost area: 266 oil cells against the booking's 169, so a larger accumulation with a thinner average column. You can match the volume or the area, and volume is the one a forecast is a fraction of.

## Validation

Seven broken specifications, each isolating one rule, six of them raising exactly one error. Writing that set was harder than it looks: the first attempt cascaded, and a case that raises 180 errors teaches the opposite of what it is for.

What the validator cannot catch is the larger list: right structure and wrong field, right shape and wrong place, right numbers and wrong units, right convention and wrong provenance. Those need comparison against something outside the deck, and there are four such comparisons worth running before any deck is trusted.

## The initialisation datum

Computed rather than chosen: the mean of the 900 column tops,

$$5129.97013005754 \text{ ft}$$

which sits about 12 ft below the contact, because more than half the columns are in the water leg and the mean of a mostly-wet surface lands below the contact.

## What the three tiers say together

The deck is a description, and every number in it is a measurement, a correlation, a convention or a decision. The Associate tier learned to find the number; the Professional tier learned to find its source; this tier learned to make and report the decisions.

None of the three ran a simulation, and the whole of what makes a study trustworthy was available anyway.

## Exercise

First, write the one-paragraph technical summary of this model a reservoir engineer joining the study should read first, containing one number from each tier and one caveat.

Second, of everything above, name the two decisions you would most want reviewed by somebody else before running a forecast, and say why.
