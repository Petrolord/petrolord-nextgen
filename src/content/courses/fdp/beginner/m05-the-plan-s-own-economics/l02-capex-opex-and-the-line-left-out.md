# CAPEX, OPEX and the line left out

The plan holds seven cost items totalling more than the economics ever see, because the decommissioning provision of 260.0000 million USD is typed as ABEX and a screening case carries capex and operating cost only.

{{panel:ec-plan-explorer}}

## Three types, two totals

| type | lines | what the engine does with them |
| --- | --- | --- |
| CAPEX | Development drilling 520.0000, FPSO hull and topsides 1180.0000, Mooring and installation 170.0000, Subsea system 380.0000 | totalled into 2250.0000 |
| OPEX | Operations and logistics 72.0000, Maintenance and integrity 23.0000 | totalled into 95.0000 a year |
| ABEX | Decommissioning provision 260.0000 | in neither total |

The engine reports CAPEX 2250.0000 and OPEX 95.0000. The 260.0000 is in the plan, it is visible in the Operate phase roll-up of 355.0000, and it is in no line of the cash flow the screening case builds. Read the Operate roll-up of 355.0000 as an annual figure and the plan appears to cost nearly four times what its economics charge it.

## Why the operating cost is not one number

The OPEX total of 95.0000 is the fixed part, what the field costs to run in a year whatever it produces. The screening case adds a variable part of 5.0000 USD on every barrel, and the two together give the operating cost each year shows. Year 1 of the Base case charges 204.5000 on a full plateau, and year 4 charges 193.5500 on a rate that has declined once. Over the whole case the operating cost is 3049.6464, well above the 1900.0000 that the concept's fixed 95.0000 a year would give over 20.0000 years, and the difference is the barrels.

## The line that is not there

Nothing is wrong with the engine here. A screening tier is a comparison between concepts, and every one of them will carry a decommissioning cost at the end. Leaving it out of all of them changes none of the rankings, and putting it in would need an abandonment year, an escalation and a fiscal treatment that this tier does not ask for. What matters is knowing it is out, so that a value of 2047.5653 million USD is read as a screening value with an abandonment cost still to come. A plan that carries the provision and a plan that forgot to type it both screen at the same value, and only the cost item list shows which of the two you are holding.

## The mistake

Adding the 260.0000 to the capex to be conservative. The engine reports CAPEX 2250.0000, and a reader who quietly makes it something else has a number that matches nothing in the plan, agrees with no concept estimate and cannot be reconciled against anything. If the abandonment cost has to be in the economics, it belongs in a tier that models it, not in a screening capex.

## What it refuses

The engine will not classify a line for you. A cost item's type is a field somebody chose, and a decommissioning provision typed as CAPEX would be added to the capex total without a murmur. It refuses only what it cannot read: a concept with no annual operating cost is stopped with FdpInputError: "the concept annual operating cost is missing".

## Exercise

Give the CAPEX total, the OPEX total and the amount of the plan that reaches neither, and name the cost item it belongs to. Then explain why the Base case charges 204.5000 of operating cost in year 1 when the plan's OPEX total is 95.0000 a year.
