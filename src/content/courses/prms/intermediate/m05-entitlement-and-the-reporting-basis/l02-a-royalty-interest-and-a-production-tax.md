# A royalty interest and a production tax

{{panel:prms-reserves-calculator}}

A royalty can be read two ways, and the reading moves the Reserves figure. If the royalty holder owns a share of the production, that share is not the company's to report, and the volumes come out. If the payment is a tax on production paid in money, the company still owns the barrels, and no volume comes out. PRMS 3.3.1.1 and 3.3.1.2 draw that line, and the engine makes the form a stated input: "royalty-interest" or "production-tax".

## The two lines

The engine prints the net entitlement it applies. On EKN-1 with the royalty stated as a royalty interest, then as a production tax, verbatim:

> net entitlement: 70% working interest less the 15% royalty interest (PRMS 3.3.1.1)

> net entitlement: 70% working interest; the 15% payment is a production tax, so no volume is deducted (PRMS 3.3.1.2)

## The figures

Both golden inputs report on the net-entitlement basis; only the form changes:

| golden input | reporting basis (stated) | royalty form (stated) | 1P BOE | 2P BOE | 3P BOE | 2P oil |
| --- | --- | --- | --- | --- | --- | --- |
| econ-ekene | net-entitlement | royalty-interest | 5995298.044167 | 11229764.729167 | 16851271.080000 | 9908615.920000 |
| econ-ekene-production-tax | net-entitlement | production-tax | 7053291.816667 | 13211487.916667 | 19825024.800000 | 11657195.200000 |
| econ-ekene-working-interest | working-interest | royalty-interest | 7053291.816667 | 13211487.916667 | 19825024.800000 | 11657195.200000 |

With the royalty as a production tax, the net entitlement prints the same figures as the working interest: 13211487.916667 BOE of 2P. Nothing is deducted from the volumes, so the company's share is its whole working interest.

## The cash is the same

The form changes the volumes. It does not change the money: the royalty is paid either way, at the same 15.000000 percent, and the cash flow underneath charges it the same way. On EKN-1 the best undiscounted net cash flow is 382377266.937500 under both forms, and every economic limit stays where it was.

## Which form applies

The engine does not decide. Whether a given royalty is an interest in the production or a tax on it depends on the contract and the law, and on who owns the barrels at the point of sale. The Nigerian fiscal terms belong to the Petroleum Industry Act course; here the form is a stated fact, printed in the reasons where a reviewer can check it.

## The stated royalty

The rate is stated as a percent from 0 to below 100. A royalty of 100 would leave the company nothing and is refused, verbatim:

> royalty.ratePct must be a number from 0 to below 100; got 100

The form is one of two words:

> royalty.form must be one of "royalty-interest", "production-tax"; got nothing

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 Ekene Main waterflood, net entitlement" and read the 2P BOE and the net entitlement line.
2. Set "Royalty form (stated)" to a production tax. Read the 2P BOE, the net entitlement line and the best undiscounted net cash flow.
3. Start from "EKN-1 with the royalty as a production tax" and compare it with "EKN-1 at the working interest".
4. Set "Royalty, percent (stated)" to 0 on either start. Read which figures move now, including the economic limits, and explain why a royalty rate moves the limit when its form does not.
