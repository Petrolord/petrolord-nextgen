# Gross, working interest and net entitlement

{{panel:prms-reserves-calculator}}

A company reports the Reserves it is entitled to, and entitlement depends on the basis chosen. The same forecasts, cut at the same limits, give three different figures: the whole project at 100 percent, the company's working interest share of it, and that share less what a royalty holder takes. PRMS 3.3.1 sets out the idea; the engine makes the basis a stated input with no default, and prints the figure on the basis you state.

## The engine's rule

The basis, verbatim:

> applyJV of engines/economics/cashflow.ts (working interest and royalty scaling); PRMS 3.3.1

The scaling is the canonical applyJV of cashflow.ts, the same function the cash flow course uses for a partner's share. The prms engine adds no arithmetic of its own.

## The same forecasts on three bases

EKN-1 carries a working interest of 70.000000 percent for its operator and a 15.000000 percent royalty, stated as a royalty interest. Only the basis changes between these golden inputs:

| golden input | reporting basis (stated) | 1P BOE | 2P BOE | 3P BOE | 2P oil |
| --- | --- | --- | --- | --- | --- |
| econ-ekene-gross | gross | 10076131.166667 | 18873554.166667 | 28321464.000000 | 16653136.000000 |
| econ-ekene-working-interest | working-interest | 7053291.816667 | 13211487.916667 | 19825024.800000 | 11657195.200000 |
| econ-ekene | net-entitlement | 5995298.044167 | 11229764.729167 | 16851271.080000 | 9908615.920000 |

Read the 2P oil down the column. Gross, it is 16653136.000000 barrels, the best case to its economic limit. At the working interest it is 11657195.200000, the gross scaled by 70.000000 percent. On the net-entitlement basis it is 9908615.920000: the working interest share with the royalty interest taken out. The engine's line, verbatim:

> net entitlement: 70% working interest less the 15% royalty interest (PRMS 3.3.1.1)

## One basis for everything

The basis moves every category together, so the 2P on EKN-1 is 18873554.166667 BOE gross, 13211487.916667 at the working interest and 11229764.729167 on the net-entitlement basis. None of the three is wrong. Each answers a different question: how much the project holds, how much of it the company pays for, and how much the company may count as its own. A figure quoted without its basis answers none of them, which is why the course's vocabulary always names the basis beside the word entitlement.

The limits and the economic verdicts are the same on every basis, because the cash flow is run at 100 percent before any scaling.

## A basis must be one of three

The basis is stated with the words the engine reads. Anything else is refused, verbatim:

> reportingBasis must be one of "gross", "working-interest", "net-entitlement"; got "net"

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 Ekene Main waterflood, net entitlement". Read the reported oil and BOE of each case and the net entitlement line in the reasons.
2. Set "Reporting basis (stated)" to gross, then to working-interest. Read the 2P BOE each time and confirm the economic limits stay the same.
3. Set "Working interest, percent (stated)" to 100 on the working-interest basis and compare the 2P oil with the gross figure.
4. Set "Reporting basis (stated)" to not stated and read the refusal.
