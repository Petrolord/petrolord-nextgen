# Frontier acreage and who receives it

{{panel:pia-royalty-calculator}}

Two short provisions close the royalty by price. One takes frontier acreage out of it entirely. The other sends every dollar of it to a named fund. Both are one sentence long, and both are easy to miss on a ledger that shows only the total royalty.

## No royalty by price on frontier acreage

The Seventh Schedule para 11(2):

> "(2) There shall be no royalty by price for frontier acreages."

The engine applies it by terrain. On the frontier case, ekene_frontier, the oil price is 120 USD/bbl in 2026, and the engine returns a royalty by price of 0.000000. The same case pays a liquids royalty rate of 0.075000, the flat frontier rate with no tranches (Regulations r.13(3)).

| ekene_frontier, 2026 | engine figure |
| --- | --- |
| royalty by price | 0.000000 |
| liquids royalty rate | 0.075000 |

Frontier acreage stands apart in the tax too. The Act's hydrocarbon tax Part does not apply to frontier acreage until it is reclassified, PIA s.260(3):

> "(3) This Part shall not apply to a frontier acreage until it is reclassified under section 68 (3) of this Act and to deep offshore."

This tier names that provision and leaves the tax to the Professional tier.

## Who receives the royalty by price

Every other royalty is paid into the Federation Account. The royalty by price goes to a fund, the Seventh Schedule para 11(3):

> "(3) Royalty derived from “royalty by price” shall be for the credit of Nigerian Sovereign Investment Authority."

So when prices rise, the extra royalty the state collects lands with the Nigerian Sovereign Investment Authority. On Ekene Alpha in 2026 that is 4037323.188406 USD on the Regulations base, the engine default, out of a total royalty of 18012822.226867 USD.

## Reading a ledger with both in mind

A total royalty line mixes three parts: the production royalty on liquids, the gas royalty and the royalty by price. A reader who knows the terrain can tell at once whether the third part is possible at all. A reader who knows the destination can say which part of the total leaves the Federation Account.

## Exercise

Open the royalty calculator and choose "Royalty by price and its benchmarks". Set the year to 2026, the price to 120 and the base year to the Regulations base. Read the rate for onshore, then change the terrain to frontier and read it again. Switch to "The instruments stacked on a ledger", run ekene_frontier, and note the total royalties tile. Change pia_terrain in the case box to "onshore", run it again, and say how much of the difference in total royalty comes from the royalty by price and how much from the tranches.
