# Four ways to sell a flare

The Associate tier read one gas by the mole and weighed its flare. This tier asks what that gas could be sold as. EGBEMA is a flow station in Imo State flaring associated gas, and the case carries four ways to sell it. Egbema is a real place. The flow station, its analysis and every figure attached to it are invented and illustrative.

## The four route templates

flareToValue exports ROUTE_TEMPLATES. It holds four routes, and each has an id, a label, a yield unit and a basis for its yield ceiling:

| route id | label | yield unit | yield ceiling |
| --- | --- | --- | --- |
| cng | Compressed natural gas | kg | gas mass |
| mini_lng | Mini LNG | t | gas mass |
| lpg_extraction | LPG and condensate extraction | t | propane and heavier |
| gas_to_power | Gas to power or gas to wire | MWh | heating value |

Read the columns in order. Each route's yield is typed per Mscf in the route's own unit: kilograms for CNG, tonnes for mini LNG and for LPG, megawatt hours for gas to power. The yield ceiling column names the basis for the most one Mscf of this gas can make. CNG and mini LNG are capped on the whole gas mass, LPG on the propane and heavier, and gas to power on the heating value. Module 2 reads those ceilings figure by figure.

## Five questions, five functions

The Flare Gas to Value Studio answers the route questions with five of the seven functions flareToValue exports. The course's question table pairs each question with the function that answers it:

| question | function |
| --- | --- |
| which way of selling it does the gas allow | screenRoute against a route's requirement envelope |
| what does a route make, earn and cost in a year | routeEconomics |
| what does the flare emit, and what does recovering it abate | abatement |
| does the project need carbon credits to clear its hurdle | creditSensitivity |
| how do the routes compare in a bid | compareRoutes |

This tier follows that order. Module 1 is screenRoute and the envelopes. Module 2 is the yield ceiling (yieldCeiling). Module 3 is a route's year in routeEconomics, with the capital scaled by the power law in modularRefinery. Module 4 is the counterfactual inside abatement. Module 5 is creditSensitivity and the bid table from compareRoutes. Module 6 reads EGBEMA's CNG route from the gas to the credit test as one parcel.

## What each route asks of the gas

Every route carries a requirement envelope. Each requirement has a name, a direction (min or max), a unit and a limit. All four routes carry a Minimum volume in MMscfd. The rest differ route by route:

- Compressed natural gas: Maximum inerts and Minimum heating value.
- Mini LNG: Maximum CO2 before treatment and Maximum inerts.
- LPG and condensate extraction: Minimum liquids content, in gal/Mscf of C3+.
- Gas to power or gas to wire: Minimum heating value and Maximum inerts.

Each of those is read against a figure the Associate tier already printed for EGBEMA: a heating value of 1248.4110 Btu/scf, an inert mole fraction of 0.0460, a CO2 mole fraction of 0.0280 and a gpmC3Plus of 3.2205. The volume is the 7.5 MMscfd EGBEMA flares.

## Where this course stops

A flare is also a line in an emissions inventory, and the `carbon` course owns that inventory. The cash flow is handed on: routeEconomics assembles capital, operating cost and revenue, hands them to the sanctioned economics engine and does not discount them. Its valuation note reads "A second discounted cash flow in this module would be a second answer."

## Exercise

Read the four yield ceiling bases in the template table. Say which two routes share a basis, and quote the basis the LPG route's ceiling names. Then name the one requirement all four envelopes carry, and give the EGBEMA figure that requirement is read against.
