# TET or the development levy

Two levies, one base, never both in the same year. The framework string on the row says which one was charged, and the rate is the smaller part of the difference. PIA figures here use the Regulations (2021) price-royalty base, the engine default.

{{panel:ec-fiscal-explorer}}

## The base they share

The published PIA worked example earns a CIT assessable profit of 1058241648.19 USD in 2025. In a PIA year the tertiary education tax is charged on that profit at the year's statutory rate, 3 percent from 2023 (2.5 percent before), and the row reads tet_tax 31747249.45 with dev_levy_tax 0.00. In an NTA year the same profit carries a development levy at 4 percent instead: forced to that framework, the row reads dev_levy_tax 42329665.93 with tet_tax 0.00. The ratio is the ratio of the rates, 4 over 3, because the base is the same line.

Nothing else on the row moves: royalty 199158351.81, HCT 285784994.46 and CIT 299472494.46 in both runs. Only the last line of the cascade changes, and total tax goes from 617004738.36 to 627587154.84.

## What the switch costs

| Override | Framework | TET | Development levy | Total tax | NPV | Take, percent |
| --- | --- | --- | --- | --- | --- | --- |
| force_pia | pia_only | 31747249.45 | 0.00 | 617004738.36 | 141236909.83 | 85.5512 |
| force_nta | nta_2025 | 0.00 | 42329665.93 | 627587154.84 | 130654493.35 | 86.6338 |

On a one-year case NPV is the net cash flow, so the levy lands whole on the headline. On AKATA, where every year from 2029 is an NTA year on auto, the levy is 5653419.91 in 2029 and NPV 59766796.57; forced to pia_only it pays TET at 3 percent instead and NPV rises by about 3.8 million USD.

## Which profit

Both levies are charged on the assessable profit, the CIT base before the capital allowance is claimed, and never on the chargeable profit after it. On the worked example the assessable profit is 1058241648.19 and the chargeable profit is 998241648.19, the difference being the capital allowance of 60000000.00. Apply 3 percent to the chargeable figure and the TET comes out short of the row's by 1800000.00.

The levy also ignores the loss pool: on pia_loss_relief the 2026 row is an NTA year and its development levy is 12098579.71 whether the 2025 CIT loss of 43056393.20 is relieved or clamped, because relief acts on the chargeable profit and the levy sits on the assessable one.

## The mistake

The careful mistake is charging both. A reader who has heard of both frameworks adds TET and the levy to the same year and reports a total tax no run of the engine produces. One of tet_tax and dev_levy_tax is 0.00 on every row the engine returns, and the fiscal_framework column says which. A ledger that runs from 2025 into 2026 carries one of each, in different years.

## What the engine refuses

It takes the TET rate from the year unless a rate is stated; a stated rate that differs from the statute is used and named among its own statements. And it charges either levy on nothing but the assessable profit, so a levy that is not the row's tet_rate_pct or 4 percent of that line means the wrong line was read.

## Exercise

State, without arithmetic, why the levy of 42329665.93 is four thirds of the TET of 31747249.45 on the worked example. Then say which of royalty, HCT, CIT and the levy would change if the same rows were run on auto in 2026, and why.
