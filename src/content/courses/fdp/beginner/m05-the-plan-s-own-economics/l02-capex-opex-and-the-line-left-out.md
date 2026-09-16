# CAPEX, OPEX and the line outside both totals

The plan holds seven cost items and the engine totals them into two figures. The decommissioning provision of 260.0000 million USD is typed as ABEX, which is neither development capex nor an annual operating cost, so it sits outside both totals and the case charges it at the end of the field's life instead.

{{panel:ec-plan-explorer}}

## Three types, two totals

| type | lines | what the engine does with them |
| --- | --- | --- |
| CAPEX | Development drilling 520.0000, FPSO hull and topsides 1180.0000, Mooring and installation 170.0000, Subsea system 380.0000 | totalled into 2250.0000 |
| OPEX | Operations and logistics 72.0000, Maintenance and integrity 23.0000 | totalled into 95.0000 a year |
| ABEX | Decommissioning provision 260.0000 | in neither total, charged in production year 20 |

The engine reports CAPEX 2250.0000 and OPEX 95.0000. The 260.0000 is in the plan, it is visible in the Operate phase roll-up of 355.0000, and the screening case charges it once, in production year 20, as the plan's end-of-life cost. Read the Operate roll-up of 355.0000 as an annual figure and the plan appears to cost nearly four times what its economics charge it.

## Why the operating cost is not one number

The OPEX total of 95.0000 is the fixed part, what the field costs to run in a year whatever it produces. The screening case adds a variable part of 5.0000 USD on every barrel, and the two together give the operating cost each year shows. Year 1 of the Base case charges 204.5000 on a full plateau, and year 4 charges 193.5500 on a rate that has declined once. Over the whole case the operating cost is 3049.6464, well above the 1900.0000 that the concept's fixed 95.0000 a year would give over 20.0000 years, and the difference is the barrels.

## What charging it is worth

Until September 2026 that line reached no cash flow at all, and the value on the card was the value of a plan that never paid to abandon the field. It now falls in the final production year, where it is deductible for tax in the year it falls, and the case reports 2015.4123 million USD. The same case run with no end-of-life cost at all is worth 2047.5653 million USD, so charging 260.0000 twenty years out costs the plan 32.1530 million USD of present value. A plan that carries the provision and a plan that forgot to type it no longer screen at the same value.

## The mistake

Adding the 260.0000 to the capex to be conservative. The engine reports CAPEX 2250.0000, and a reader who quietly makes it something else has a number that matches nothing in the plan, agrees with no concept estimate and cannot be reconciled against anything. The end-of-life cost is already charged, in the year it falls rather than in year 0, so adding it to the capex charges it twice and twenty years too early.

## What it refuses

The engine will not classify a line for you. A cost item's type is a field somebody chose, and a decommissioning provision typed as CAPEX would be added to the capex total without a murmur. It refuses only what it cannot read: a concept with no annual operating cost is stopped with FdpInputError: "the concept annual operating cost is missing".

## Exercise

Give the CAPEX total, the OPEX total and the amount that sits outside both of them, name the cost item it belongs to and say in which year the case charges it. Then explain why the Base case charges 204.5000 of operating cost in year 1 when the plan's OPEX total is 95.0000 a year.
