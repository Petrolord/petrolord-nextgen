# The stress budget

Eaton's relation multiplies the ratio term into a factor that has nothing to do with the sonic log at all: $S - P_h$, the overburden less the hydrostatic. This lesson gives that factor the attention it rarely gets, because half of every pressure the method reports comes from it.

## What the gap is

At any depth, $S - P_h$ is the effective stress a normally pressured rock would carry there. It is also, read the other way, the most overpressure the depth can hold: pore pressure cannot exceed the overburden for long, since beyond that the rock is being lifted, so the fluid's share can grow only until it has taken the whole gap.

Call it the budget. The ratio term decides what fraction of the budget the fluid takes; the budget decides what that fraction is worth in megapascals.

## How the budget grows down this well

Both curves in the difference come from the Associate tier, and their gap widens with depth because sediment is denser than pore fluid. Engine values at the depths this module keeps using:

At the mudline the budget is zero: hydrostatic and overburden meet at 1.005182 MPa, the weight of the water column, and there is no room for overpressure in the first metres of sediment. At 2600 m the budget is 30.04308796385235 MPa. At 3000 m, 35.523412418439044. At 3500 m, 42.544004457243325. At total depth, 49.714487325732826.

Between 2600 m and total depth the budget grows by two thirds. That growth matters when you read a prognosis: the same ratio produces more pressure at depth simply because there is more stress to share.

## The two-factor structure, made visible

Write the overpressure explicitly, since it is the quantity the ramp encodes:

$$OP = PP - P_h = (S - P_h)\,(1 - r^n)$$

Overpressure is the budget times the fraction handed over. Down this well, from the engine, with $n = 3$:

At 2600 m: $30.043088 \times 0.0133142 = 0.4$ MPa. At 3000 m: $35.523412 \times 0.0563009 = 2.0$ MPa. At 3500 m: $42.544004 \times 0.0940203 = 4.0$ MPa. At TD: $49.714487 \times 0.1206892 = 6.0$ MPa.

Read the two columns separately and you see the design of the well. The overpressure climbs linearly, 4 kPa per metre, because it was encoded that way. But the budget climbs too, so the fraction the fluid takes climbs slower than the overpressure does. The sonic's job, through the ratio, is precisely to supply that fraction, depth by depth, such that fraction times budget lands on the ramp. On a real well the same decomposition runs in reverse: it tells you how much of a reported pressure is evidence (the fraction) and how much is simply depth (the budget).

## Why this decomposition is worth carrying

Three practical reasons.

First, error analysis. An error in the trend perturbs the fraction; an error in the density log perturbs the budget. The two enter multiplicatively, so percentage errors add. A three percent budget error and a three percent fraction error make a six percent pressure error, and you know which log to blame for which part.

Second, sanity checks at a glance. If someone shows you 20 MPa of overpressure at 2600 m on this well, you now know that requires two thirds of the budget there, which requires $r^3 = 0.33$, which requires the log to read 44 percent slow. A glance at the sonic kills the claim without running anything.

Third, transfer between wells. The fraction is the part that travels: it is dimensionless, and rocks at similar burial states produce similar ratios. The budget is strictly local, set by water depth and the density column. Reading other people's prognoses in budget-and-fraction terms is the fastest way to compare wells honestly.

## Worked example

The graded overpressure at total depth, assembled from its two factors and nothing else.

Budget: $S - P_h = 91.12306695073282 - 41.408579625 = 49.714487325732826$ MPa.

Fraction: the ratio at TD is 0.9580337483265022, its cube is 0.8793108342707514, so the handover fraction is $1 - 0.8793108342707514 = 0.1206891657292486$.

Overpressure: $49.714487325732826 \times 0.1206891657292486 = 6.000000$ MPa, and adding back the hydrostatic gives the graded pore pressure of 47.408579625 MPa.

## Exercise

Using the budget figures above, answer without touching the panel: if the ratio at 3000 m and at total depth were somehow the same number, what would the ratio of the two overpressures be? Then explain in one sentence why the actual well's overpressure ratio between those depths is 3, not that number.

Self check: with equal fractions the overpressures would scale as the budgets, 49.714487 over 35.523412, which is about 1.4. The actual overpressures are 6 and 2 MPa, a ratio of 3, because the encoded ramp fixes the overpressures and the sonic was built to supply a worse ratio at depth: the fraction grows from 5.63 to 12.07 percent precisely so that fraction times budget follows the 4 kPa per metre line.
