# Royalty on the value of gas delivered

{{panel:gsa-contract-calculator}}

The state takes a royalty on the gas a licence holder sells. The engine carries no royalty rule of its own: it imports `deriveGasRoyaltyRate` from the canonical `cashflow.ts` of the engines library and applies the rate to one base, which this lesson names.

## Where the rate comes from

The Petroleum Industry Act 2021 (Act No. 6; Official Gazette No. 142, Vol. 108, 27 August 2021; read on 2026-09-26) sets the gas royalty in its Seventh Schedule para 10(6). The engine's basis on the power plant agreement names the rate and its source:

> gas royalty rate 0.025 from engines/economics/cashflow.ts deriveGasRoyaltyRate (onshore, 100% utilised in-country: 5%, 2.5% in-country, PIA Seventh Schedule para 10(6)) on the value of gas delivered (taken x contract price): royalty is charged on delivered gas value and not on deficiency payments

The rate depends on two stated terms: the terrain and the share of the gas utilised in-country. The Petroleum Industry Act course teaches the fiscal system that rate sits in; this course takes the rate as the canonical function returns it.

| case | terrain | share utilised in-country | royalty rate (engine) |
| --- | --- | --- | --- |
| Ekene power plant (synthetic) | onshore | 100 percent | 0.025000 |
| Ekene export feed (synthetic) | onshore | 0 percent | 0.050000 |
| golden small case | deep offshore | 40 percent | 0.040000 |

Gas sold to the domestic power plant is utilised in-country and pays 0.025000; the export feed gas is exported and pays 0.050000.

## The base is delivered value

The engine multiplies the rate by the delivered value: the gas taken, at the contract price. On the power plant in 2027 the delivered value is 15794100.000000 and the royalty 394852.500000. On the export feed in 2029 the delivered value is 139839071.650000 and the royalty 6991953.582500. The royalty is never charged on the seller revenue as a whole: a deficiency payment carries none, and the refund line changes nothing.

The net after royalty is the seller revenue less the royalty. On the export feed in 2029 that is 164422970.730000.

The power plant figures rest on the fixture's held price of 2.18 US$ per MMBtu, the reported 2026 domestic base price held flat as a stated planning assumption.

## A reading the engine states

Charging royalty on delivered value and not on the deficiency payment is one of the four readings the engine states, and the next module reads it beside the others. It is stated here so its effect is clear: in a deficiency year the royalty falls with the gas taken, and when the gas is made up in a later year it pays its royalty then, at that year's contract price.

## Refusals on the royalty

The royalty has no default terrain. A call without it is refused, and so is a terrain the canonical function does not know:

> royalty must be an object { terrain, inCountrySharePct } (no default terrain); got nothing

> royalty.terrain must be one of "onshore", "shallow_water", "deep_offshore", "frontier"; got "marginal_field"

## Exercise

Open the contract calculator on "The whole contract in money". It starts on the Ekene export feed, onshore, with nothing utilised in-country. Read the gas royalty rate tile and check the 2029 royalty against the rate and the delivered value. Then set inCountrySharePct to 100 and read the rate again; set the terrain to deep_offshore with 40 percent in-country and read it once more. State which columns move each time. Finally delete the royalty block and read the refusal.
