# The pre-breakthrough identity

Before water breaks through, the forecast says something very simple and exactly true within its own assumptions: every reservoir barrel of water injected displaces one reservoir barrel of oil. This lesson unpacks why, checks it numerically, and then says what it hides.

## The statement

$$N_{p,rb} = W_i \qquad \text{for } W_i \le W_{i,bt}$$

and therefore, since the oil rate is the derivative of the cumulative,

$$q_o B_o = i_w$$

The oil rate in reservoir barrels equals the injection rate exactly, for as long as no water is produced.

## Why it is true

The reservoir is full and essentially incompressible. Push a barrel in and a barrel must come out. Before breakthrough, nothing coming out is water, so all of it is oil.

That is the whole argument, and it is worth noting that it is a VOLUME argument, not a displacement argument. It does not depend on the relative permeability curves, the mobility ratio, the sweep efficiency or the pattern geometry. Any of those could be anything and the identity would still hold, because it is conservation of volume in an incompressible system with one outlet.

The efficiencies decide WHEN breakthrough happens and what occurs afterwards. Until then, the identity is forced.

## The check

The Ekene design case injects at 2000 reservoir barrels per day into an element with $B_o = 1.21584$. At step 5, well before the breakthrough at 639.1875 days:

$$q_o \times B_o = 2000.0000000000$$

to the last digit the arithmetic carries. That is not an approximation converging; it is the identity holding.

## And after breakthrough

The identity generalises. Water now comes out too, and the total still balances:

$$q_o B_o + q_w B_w = i_w$$

On the design case's last step, at a water oil ratio of 31.119000015950355, the two terms sum to 2000 exactly.

That is because the engine DEFINES the water rate as the injection minus the oil rate, in reservoir barrels. The balance is not a result; it is how the water rate is computed. Which means it cannot be used as a check on the forecast, and it is worth being clear about that distinction: the pre-breakthrough identity is a physical consequence, and the post-breakthrough balance is an enforced definition.

## What the identity hides

Three things, and each matters.

**It hides all the efficiencies.** During the pre-breakthrough period the forecast looks perfect: full recovery of every injected barrel as oil. That is true and it is temporary, and a flood evaluated only on its pre-breakthrough performance will look spectacular regardless of how badly it is going to sweep.

**It hides the pressure.** Real reservoirs are not exactly incompressible, and part of an injected barrel goes into repressurising rather than displacing. The Associate tier's whole pressure module exists because that part is real. The forecast has no pressure model at all, so it assigns all of it to displacement.

**It hides free gas.** If there is free gas in the pore space, injected water compresses and dissolves it before displacing oil. The engine models that as a fill-up volume subtracted from the injection, which is a crude and explicit treatment; lesson 5 shows the artefact it produces.

## The practical use

Despite all that, the identity is the single most useful sanity check on a pre-breakthrough waterflood.

If a field has been injecting for two years, no producer has made flood water, and the incremental oil is materially less than the injected reservoir volume, then one of these is true: the water is going out of zone, the reservoir is being repressurised rather than displaced, or the allocation is wrong. All three are important and all three are found by the same check.

The Professional tier's out-of-zone number and the Associate tier's pressure track are precisely the two quantities that account for the gap. This identity is where they meet.

## The misconception to avoid

"Recovering one barrel of oil per barrel injected means the flood is 100 percent efficient." It means the reservoir is full and nothing else has come out yet. The efficiency of the flood is decided by what happens after breakthrough, and a flood that breaks through early has spent very little of its life in this regime.

## Exercise

First, a field injects 500000 reservoir barrels over two years with no water production, and its incremental oil is 380000 reservoir barrels. Account for the missing 120000 barrels with three named mechanisms, and state which measurement would size each.

Second, explain why the post-breakthrough balance $q_o B_o + q_w B_w = i_w$ cannot be used to validate the forecast, and propose a quantity that could be.
