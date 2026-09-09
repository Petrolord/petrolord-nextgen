# TET or the development levy

Two levies, one base, never both. The framework string on the row says which one was charged, and the rate is the smaller part of the difference.

{{panel:ec-fiscal-explorer}}

## The base they share

The published PIA worked example earns a CIT assessable profit of 1039994854.24 USD in 2025. Under the 2021 Act the tertiary education tax is charged on that profit at 2.5 percent, and the row reads tet_tax 25999871.36 with dev_levy_tax 0.00. Under the 2025 framework the same profit carries a development levy at 4 percent instead: dev_levy_tax 41599794.17 with tet_tax 0.00. The digest puts the ratio in one line: the levy is 1.6 x TET.

Nothing else on the row moves: royalty 217405145.76, HCT 284810956.27 and CIT 293998456.27 in both runs. Only the last line of the cascade changes, and total tax goes from 604809283.90 to 620409206.71.

## What the switch costs

| Override | Framework | TET | Development levy | Total tax | NPV | Take, percent |
| --- | --- | --- | --- | --- | --- | --- |
| force_pia | pia_only | 25999871.36 | 0.00 | 604809283.90 | 135185570.34 | 86.1703 |
| force_nta | nta_2025 | 0.00 | 41599794.17 | 620409206.71 | 119585647.53 | 87.7662 |

On a one-year case NPV is the net cash flow, so the levy lands whole on the headline. AKATA shows the same switch on a seven-year ledger: forced to pia_only it pays TET of 3369056.19 in 2029 and reports NPV 49521778.87; left on auto with its 2029 base year it pays a development levy of 5390489.91 in 2029, 21007007.79 over the life, and reports NPV 42943268.01.

## Which profit

Both levies are charged on the assessable profit, the CIT base before the two-thirds capital allowance restriction, not the chargeable profit after it. On the worked example the assessable profit is 1039994854.24 and the chargeable profit is 979994854.24. Apply 2.5 percent to the chargeable figure and the TET comes out smaller than the row's 25999871.36, by an amount that looks like rounding until the levy is checked the same way and is short by more.

The levy also ignores the loss pool: on pia_loss_relief the 2026 TET is 5755415.35 whether the CIT loss of 12056305.36 is relieved or clamped, because relief acts on the chargeable profit and the levy sits on the assessable one.

## The mistake

The careful mistake is charging both. A reader who knows the Act and has heard of the framework adds TET and the levy to the same year and reports a total tax no run of the engine produces. One of tet_tax and dev_levy_tax is 0.00 on every row in the digest, and the fiscal_framework column says which.

## What the engine refuses

It refuses to let the rate be the whole story: 2.5 against 4 is the rate, 1039994854.24 is the base, and the base is where the money is. It refuses to blend the two frameworks in one ledger. And it charges either levy on nothing but the assessable profit, so a levy that is not 2.5 or 4 percent of that line means the wrong line was read.

## Exercise

State, without arithmetic, why the levy of 41599794.17 is 1.6 x the TET of 25999871.36 on the worked example. Then say which of royalty, HCT, CIT and the levy would change if the same rows were run on auto with a base year of 2026, and why.
