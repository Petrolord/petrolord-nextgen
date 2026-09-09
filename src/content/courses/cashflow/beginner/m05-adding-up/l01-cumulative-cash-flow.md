# Cumulative cash flow

A running sum of the net cash flow column, one number per year, whose sign says whether the field has yet given back what it took.

{{panel:ec-ledger-explorer}}

## The running sum

Cumulative cash flow at any year is every net cash flow up to and including that year, added. On the hand-derived case the 2030 flow is -12500000.00 USD, so the cumulative is -12500000.00; the 2031 flow is 37500000.00, so the cumulative is 25000000.00, which is also the two-year total.

AKATA's column, with the two flavours the engine prints:

| year | net_cash_flow | real_net_cash_flow | cumulative_nominal | cumulative_cash_flow |
| --- | --- | --- | --- | --- |
| 2029 | -121123680.00 | -121123680.00 | -121123680.00 | -121123680.00 |
| 2030 | 31746007.20 | 30821366.21 | -89377672.80 | -90302313.79 |
| 2031 | 64468245.07 | 60767504.07 | -24909427.73 | -29534809.71 |
| 2032 | 53959532.44 | 49380616.06 | 29050104.71 | 19845806.34 |
| 2033 | 44874457.77 | 39870374.51 | 73924562.48 | 59716180.85 |
| 2034 | 37311468.65 | 32185200.62 | 111236031.13 | 91901381.47 |
| 2035 | 30401798.05 | 25461027.24 | 141637829.18 | 117362408.71 |

The last cumulative is the total. The nominal column closes at 141637829.18, the total net cash flow in money of the day; the engine's cumulative_cash_flow column closes at 117362408.71, the total in 2029 money, because AKATA is configured on the real basis and the running sum follows the basis. On a run with inflation at 0 the two columns coincide, as they do on the hand-derived case.

## Two things the column says

The trough is the maximum exposure: the most the contractor is ever out of pocket. On AKATA it is -121123680.00, in 2029, before the second capex tranche, because 2030 nets 31746007.20 even after the 45000000.00 it spends. A field whose trough sits in its second or third year is a field whose early production is not covering its build.

The sign change is payback. AKATA is negative at -29534809.71 in 2031 and positive at 19845806.34 in 2032, so the money comes back during 2032. multiyear_jv_real turns from -40339805.83 to 1742002.07 between 2031 and 2032, a crossing that clears zero by very little; a modest price cut would move it a year. zero_rates_capex_only reads -60000000.00 then -70000000.00 and never crosses.

## The mistake

Adding the net_cash_flow column and expecting the engine's cumulative gives -89377672.80 for 2030 where the column says -90302313.79. Both are correct running sums; they are sums of different columns. A reader who does not know which basis the run is on cannot say which number is the cumulative, and a payback read from the wrong one lands in the same year with a different fraction. The second mistake is to read the trough as the capex: 255000000.00 was spent, but the exposure is 121123680.00, because the first year's sales covered part of the first year's spend.

## What it refuses

The running sum has no clock. One USD earned in 2035 and one spent in 2029 cancel exactly, so the column cannot say whether waiting was worth it. It does not distinguish a field that pays back on a single large year from one that pays back on many small ones. And it is cash, not a return: it does not divide by anything, so a trough of -121123680.00 is neither large nor small until it is set beside what came back.

## Exercise

Add the real_net_cash_flow column by hand through 2032 and confirm 19845806.34. Then find the trough and the crossing year, and say which of the two would move first if the 2030 capex were larger.
