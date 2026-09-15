# The working volume

A slug catcher holds more than the slug. ABANA takes a 350.000000 bbl slug with 12000.000000 bpd still arriving over a 5.000000 minute hold, which adds 41.666667 bbl and makes a working volume of 391.666667 bbl.

{{panel:fc-slug-explorer}}

## Three inputs, one volume

The slug arrives and the plant keeps producing. While the catcher is draining its slug out at a controlled rate, normal liquid is still coming down the line, so the vessel has to hold both. The hold time is how long that state is expected to last.

On ABANA the normal inflow over 5.000000 minutes at 12000.000000 bpd is 41.666667 bbl. Added to the 350.000000 bbl slug it gives 391.666667 bbl of working volume, which is the quantity the vessel is actually sized on.

## From barrels to a vessel volume

The working volume is liquid, and a vessel cannot be filled to the top with liquid. A fill fraction of 0.600000 on ABANA turns 391.666667 bbl of working volume into a vessel of 3665.075231 ft3.

| case | slug bbl | normal bbl | fill | volume ft3 |
| --- | --- | --- | --- | --- |
| ABANA | 350.000000 | 41.666667 | 0.600000 | 3665.075231 |
| vessel200bblSlugLd4 | 200.000000 | 17.361111 | 0.600000 | 2033.986786 |
| vessel1200bblSlugLd5 | 1200.000000 | 138.888889 | 0.700000 | 10739.004630 |

The second published case holds 1200.000000 bbl for 10.000000 minutes at 20000.000000 bpd, so its normal inflow of 138.888889 bbl is a far larger share of the total than ABANA's 41.666667 bbl. A long hold on a high-rate line makes the normal inflow a serious part of the vessel.

## What the engine refuses here

A negative hold time is refused by name: SeparatorInputError on holdMin, "holdMin must be a non-negative hold time in minutes (got -5)". A negative normal rate is refused the same way: SeparatorInputError on qLiquidBpd, "qLiquidBpd must be a non-negative liquid rate when it is given (got -100)". A fill fraction outside the range comes back as a returned state instead: { error: "the fill fraction must be between 0 and 1" }.

A hold time of zero is accepted, because it is a real request. It says the vessel drains as fast as the slug arrives, and the normal inflow contributes nothing.

## The mistake

The mistake is sizing on the slug alone. On ABANA that leaves 41.666667 bbl on the floor, and on a line with a longer hold it leaves much more. The second mistake is forgetting the fill fraction and treating 391.666667 bbl as the vessel volume, which specifies a drum with no vapour space at all.

## Exercise

Work the working volume for ABANA from its three inputs, and give the vessel volume at a fill fraction of 0.600000. Then give the normal inflow for the two published vessel cases, and state the two refusals and the one returned error that guard these inputs.
