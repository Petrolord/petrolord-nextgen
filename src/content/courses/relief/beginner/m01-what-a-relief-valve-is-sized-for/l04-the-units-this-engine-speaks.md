# The units this engine speaks

{{panel:fc-sizing-explorer}}

This module speaks API 520 in its United States customary forms, and it speaks them without converting anything for you. A rate handed in the wrong unit produces a perfectly finite area that is wrong by whatever the conversion factor was, and no guard anywhere in the module will catch it.

## The field units, route by route

Gas and steam loads arrive in lb/hr. Liquid loads arrive in gpm. Pressures are absolute, in psia, except where a row says psig, and the gauge cases are the liquid route and every stated set pressure. Temperatures are in degR except where a row says degF. Areas are in2 throughout.

The later tiers add more: wetted areas in ft2, duties in Btu/hr, velocities in ft/s, drum lengths in ft, droplet sizes in micron, heat release in kW, distances in m, radiant flux in kW/m2, blowdown times in s and masses in lb. Those belong to the Professional and Expert tiers and carry no figures here.

## The leading constants, measured rather than typed

Each published equation carries a leading constant, and none of them is exported. The digest behind this course recovers each one by asking the engine a question whose only possible answer is that constant.

| constant | measured |
| --- | --- |
| the default outlet pressure, psia | 14.700000000000 |
| the gas coefficient leading constant | 520.000000000000 |
| the subcritical leading constant | 735.000000000000 |
| the liquid leading constant | 38.000000000000 |
| the steam leading constant | 51.500000000000 |
| the liquid Reynolds constant | 2800.000000000000 |

Every one of those is a unit bearing number. That is why they are quoted to twelve decimals here: a leading constant is the place where the unit system lives, so the figure and the unit are one statement. The gas constant was recovered by dividing gasConstantC(1.4) by a bracket that depends on the isentropic exponent alone. The liquid one came from a single inviscid area at unit coefficients, rearranged against its own stated inputs.

## What the engine works out and what somebody typed

The closed forms this module can derive, it derives. The coefficient C from the isentropic exponent, the critical pressure ratio from the same exponent, the subcritical factor from the exponent and the pressure ratio, the viscosity correction from the Reynolds number, and the Napier correction from the pressure.

The rest are published charts and tables, and they arrive as typed inputs with their references named. That set is the balanced bellows back pressure factor Kb for gas, the equivalent Kw for liquid, the steam superheat factor KSH, and the API 526 orifice table. All four are held for literature in this course, which means they are taught as stated limits and never as things the package can check. Nothing graded in this tier rests on any of them.

## Precision, and why it is declared

Areas, pressures, dimensionless ratios and the gas coefficient print to six decimals. Flows and duties print to four. Measured constants print to twelve. Counts are whole numbers. Quoting a figure at a precision nobody declared is how two correct answers come to look like a disagreement.

## Exercise

List the unit each of the three loads in this tier arrives in, and say which of the three routes works in gauge pressures throughout. Then name the four typed factors and tables, and say for each one what a learner would have to go and read to check it.
