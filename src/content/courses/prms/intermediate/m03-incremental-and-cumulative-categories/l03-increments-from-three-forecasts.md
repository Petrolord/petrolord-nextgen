# Increments from three forecasts

{{panel:prms-reserves-calculator}}

So far the estimates were stated directly. In practice a Reserves category set often comes from three technical forecasts, low, best and high, each cut at its own economic limit year under the canonical rule and put on a reporting basis. The engine's economic limit view does this and returns the categories in both forms, in oil, gas and barrels of oil equivalent. The increments there are differences of three truncated, entitled quantities, and they obey the same rules as the increments of the last two lessons.

## The Ekene Main categories

Ekene Main waterflood (EKN-1, synthetic) is run on the net-entitlement basis. Module four explains how each case is cut; here we read the result:

| category | oil | gas | BOE |
| --- | --- | --- | --- |
| 1P | 5289968.880000 | 4231974.985000 | 5995298.044167 |
| 2P | 9908615.920000 | 7926892.855000 | 11229764.729167 |
| 3P | 14868768.565000 | 11895015.090000 | 16851271.080000 |
| P1 | 5289968.880000 | 4231974.985000 | 5995298.044167 |
| P2 | 4618647.040000 | 3694917.870000 | 5234466.685000 |
| P3 | 4960152.645000 | 3968122.235000 | 5621506.350833 |

Every row is a return value. The Probable (P2) in oil, 4618647.040000, is the 2P oil 9908615.920000 less the 1P oil 5289968.880000, and the same subtraction holds for the gas and the BOE columns.

## The engine's line

The reasons print the categories and the increments on the stated basis, verbatim:

> on the net-entitlement basis: 1P 5995298.044167, 2P 11229764.729167, 3P 16851271.08 BOE at 6 Mscf per BOE (supplementary, PRMS 3.2.9.3); P2 5234466.685, P3 5621506.350833

The reason drops trailing zeros; the fields keep them, so the 3P reads 16851271.080000 BOE as a field.

## Why each case is cut on its own

Each forecast has its own economic limit, so each quantity is cut at a different year. The 2P is the best forecast to its own limit, which falls later than the low case's. The increments are still exact differences, because the engine takes the three cut quantities as three cumulative estimates and subtracts.

That is also why an increment can be larger or smaller than intuition suggests. On EKN-1 the Possible (P3) in BOE, 5621506.350833, is larger than the Probable (P2), 5234466.685000, because the high case runs longer before its limit.

## One category set, one basis

The categories are reported on one stated basis, and every category shares it. Changing the basis moves every row together; module five follows that through. The engine also checks the category order in BOE, the unit in which oil and gas are read together.

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 Ekene Main waterflood, net entitlement". Find the category table and read P2 and P3 in oil, gas and BOE.
2. Check the P2 in gas as 2P gas less 1P gas.
3. Open the view "Incremental and cumulative categories", set "Class (stated)" to Reserves and "Method (stated)" to cumulative, and type the 1P, 2P and 3P BOE from step 1 as the low, best and high estimates. Confirm the increments match the economic limit view.
4. Write one sentence on why the P3 in BOE is larger than the P2 on EKN-1.
