# Reservoir barrels, not stock tank

Every volume a field reports is measured somewhere. Oil is measured in a tank at the surface, after the gas has come out of it and it has cooled and shrunk. Water is measured at a meter. Gas is measured at standard conditions. None of those places is the reservoir, and the reservoir is the only place where the question "is the pore space still full" makes sense. This lesson is about the conversion, and about why it is not optional.

## What a formation volume factor is

The oil formation volume factor $B_o$ is the ratio of the volume one parcel of oil occupies in the reservoir to the volume the same parcel occupies in the stock tank:

$$B_o = \frac{\text{reservoir barrels}}{\text{stock tank barrels}}$$

It is greater than one for a live oil, for two reasons acting in the same direction. The oil in the reservoir has gas dissolved in it, and that gas leaves on the way to the tank, taking its volume with it. The oil in the reservoir is also hot, and it cools on the way up. Both shrink the parcel. Ekene's ledger uses $B_o = 1.21584$, meaning a stock tank barrel of Ekene oil occupied nearly one and a quarter barrels of pore space before anyone touched it.

The water factor $B_w$ does the same job for water. Formation water has very little dissolved gas and a low compressibility, so $B_w$ sits close to one; Ekene uses 1.02.

The gas factor $B_g$ is different in character: it converts a volume of gas measured at standard conditions into the space that gas occupies at reservoir pressure. Gas is very compressible, so $B_g$ is a small number in reservoir barrels per thousand standard cubic feet, and it changes strongly with pressure. Ekene's ledger uses $B_g = 0$, which the next lessons will explain and justify.

## Why the direction of the error matters

Because $B_o > B_w$, ignoring formation volume factors always makes a flood look better than it is. Produced oil is under-counted more than injected water is, so the ratio of injection to production comes out too high.

Ekene's first flood month is the clean demonstration. Raw surface counts: 4727.034315745669 stb of oil produced, no water, and 4789.431168713511 bbl of water injected. On those numbers injection exceeds production by more than one percent, and someone reading them would conclude the field was over-injecting from day one.

Convert properly:

$$\text{produced voidage} = 4727.034315745669 \times 1.21584 = 5747.317402456214 \text{ rb}$$

$$\text{injected voidage} = 4789.431168713511 \times 1.02 = 4885.219792087782 \text{ rb}$$

$$\text{VRR} = \frac{4885.219792087782}{5747.317402456214} = 0.85$$

The field was under-injecting by fifteen percent, deliberately, and the surface counts said the opposite.

## The scale of the mistake, measured

The Petrolord daily surveillance engine takes its formation volume factors from a configuration object. If that object is handed to it with the wrong key names, the engine falls back to defaults of $B_o = 1$ and $B_w = 1$, which is exactly the raw-counts calculation above. Doing that to the Ekene record inflates the cumulative VRR from 1.034709324454895 to 1.2263567352896008, a factor of 1.185218598407499.

Nineteen percent. No error is raised, no warning is printed, and the resulting number looks entirely plausible: a flood at 1.23 reads as comfortably over-injected, which is a story a reader will happily accept. That silence is the danger. An implausible number gets checked; a plausible wrong number gets reported.

## Which $B_o$?

A formation volume factor is a function of pressure, so "the" $B_o$ does not exist until you say at what pressure. Ekene's ledger freezes its values at 2100 psia, chosen as a representative flood-era pressure, giving $B_o = 1.21584$ on the field's own PVT line

$$B_o(p) = 1.2 \times \left(1 + 1.2\times10^{-5} \times (3200 - p)\right)$$

Check it: at $p = 2100$, $B_o = 1.2 \times (1 + 1.2\times10^{-5} \times 1100) = 1.2 \times 1.0132 = 1.21584$. And at the initial 3200 psia the same line gives 1.2, which is the $B_{oi}$ the volumetric booking used.

Freezing is a convention, not a law. Module 5 recomputes the whole ledger with $B_o$ read off the pressure track month by month and measures how much the convention was worth. The answer is small for Ekene. The habit of asking is not.

## The misconception to avoid

"Reservoir barrels are just barrels with a correction factor, so as long as I am consistent it cancels." It does not cancel, because the numerator and the denominator of a VRR contain different fluids with different factors. Injected water is multiplied by 1.02 and produced oil by 1.21584. There is no consistency you can adopt at the surface that makes those two the same.

## Exercise

First, compute the reservoir volume occupied by 1000 stb of Ekene oil at 3200 psia and at 2100 psia using the PVT line above, and state which pressure gives the larger reservoir volume and why.

Second, a field produces 1000 stb of oil and 1000 bbl of water in a month and injects 2100 bbl of water. Using Ekene's ledger factors, compute the VRR correctly, then compute it from raw surface counts, and report the ratio of the two answers. Compare that ratio with the 1.185218598407499 quoted above and explain why yours is different.
