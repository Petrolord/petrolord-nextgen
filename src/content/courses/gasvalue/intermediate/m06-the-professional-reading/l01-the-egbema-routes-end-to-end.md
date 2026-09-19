# The Egbema routes end to end

This lesson reads EGBEMA's CNG route as one parcel, from the gas to the credit test. Every step is a figure an earlier module of this tier printed.

{{panel:gasvalue-route-explorer}}

## The CNG route in one table

| step | figure |
| --- | --- |
| CNG yield ceiling, kg/Mscf | 26.7066 |
| CNG made, kg/yr | 43345500.0000 |
| capital, dollars | 29337983.06 |
| gross margin, dollars a year | 21008150.00 |
| value per Mscf, dollars | 7.8904 |
| flare CO2e, t/yr | 215946.438 |
| avoided flare CO2e at the recovery, t/yr | 190032.865 |
| net abatement against diesel, t/yr | 218032.865 |
| breakeven credit price, dollars per tonne | 16.0152 |

## Reading it step by step

**The screen.** Before any of these figures, the route passes the study's screen. Its three checks read pass: a volume of 7.5000 against 5, inerts of 0.0460 against 0.06, a heating value of 1248.4110 against 1000. The verdict is passes.

**The ceiling.** The CNG yield ceiling is 26.7066 kg per Mscf, on the gas mass basis. The study's yield of 18.5 kg sits at or below it. Typed at 30 kg, the yield is refused, and the refusal prints the ceiling as 26.706618 kg.

**The product.** On 7.5 MMscfd and 355 days the parcel is 2662500.0000 Mscf a year. At a yield of 18.5 and a recovery of 0.88, the route makes 43345500.0000 kg of CNG a year.

**The year.** At a price of 0.55 dollars, the revenue is 23840025.00. The operating cost is 2831875.00. The gross margin is 21008150.00, and over the whole parcel the value per Mscf is 7.8904. assumedZero reads none: both costs are typed.

**The capital.** Scaled from a reference plant of 24000000 dollars at 6 MMscfd on the MODULAR exponent 0.9, the capital is 29337983.06. The cash flow is handed on undiscounted: year 0 at -29337983.06, recurring at 21008150.00.

**The flare.** The Associate tier weighed EGBEMA's flare at 215946.438 t/yr of CO2e.

**The avoided flare.** The route recovers 0.88 of it, and the avoided flare CO2e is the flare's CO2e times the recovery: 190032.865 t/yr.

**The net.** Against the diesel counterfactual, with a product combustion of 128000 and a displaced fuel of 156000, the net abatement is 218032.865 t/yr. The net minus the gross flare prints 2086.427.

**The credit.** Against a hurdle of 24500000, standsAloneWithoutCredits reads false, and the breakeven credit price is 16.0152 dollars per tonne. The verdict: "Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price."

## The other three routes in the same parcel

The bid table carries the other three routes on the same gas, volume and days. Mini LNG fails its screen on volume and on CO2 before treatment, and screenedOut names it. The LPG route passes, with a value per Mscf of 0.7476. Gas to power is not fully screened, with Maximum inerts unchecked, and its only counterfactual in this tier gives a net of -2010.348 t/yr, which the credit test refuses. bestByValuePerMscf reads cng.

## What this reading does not do

It adds no figure. It does not discount the cash flow. It does not choose a GWP, a credit price, a limit or a counterfactual for a study. Each of those is the study's input, and each figure attached to EGBEMA is invented and illustrative.

In the panel, load EGBEMA's CNG route and walk the steps in this order, reading each figure where the panel prints it.

## Exercise

Read the end-to-end table. For each step, name the module of this tier that printed it. Then give the recovery that links the flare CO2e to the avoided flare CO2e, and the two counterfactual inputs that take the avoided flare to the net abatement.
