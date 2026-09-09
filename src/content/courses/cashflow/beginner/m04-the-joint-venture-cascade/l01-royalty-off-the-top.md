# Royalty off the top

A royalty is a share of gross revenue, taken before any cost is seen, and the engine prints it on every row whether or not the year made money.

{{panel:ec-ledger-explorer}}

## Gross revenue first

Every row starts with volumes times applied prices. AKATA in 2029 lifts 2200000.00 bbl of oil at 82.000000 USD/bbl and 1760000.00 Mscf of gas at 3.200000 USD/Mscf, and the gross_revenue column reads 186032000.00 USD. Nothing has been deducted from that number: no royalty, no opex, no capex, no tax. It is the field's sales at the fiscal price, and the only base the JV royalty uses.

## The royalty line

The JV royalty is one flat percentage of gross revenue. AKATA carries jv_royalty_pct 15, so the 2029 royalty is 27904800.00 USD on 186032000.00. In 2031, gross revenue of 136363147.20 gives a royalty of 20454472.08. The hand-derived JV case carries 20 percent on 100000000.00 of revenue and prints 20000000.00 in each of its two years.

| year | gross_revenue | royalty | net_cash_flow |
| --- | --- | --- | --- |
| 2029 | 186032000.00 | 27904800.00 | -121123680.00 |
| 2031 | 136363147.20 | 20454472.08 | 64468245.07 |
| 2035 | 73325786.51 | 10998867.98 | 30401798.05 |

The 2029 row closes at -121123680.00 because 210000000.00 of capex lands in it, and the royalty is still 27904800.00. That is what off the top means: a share of sales, not of profit.

## Where the royalty goes next

Royalty is deductible against tax, so the government does not keep the whole of it. The hand-derived case, with only the rate moved:

| jv_royalty_pct | year 1 royalty | year 1 tax | year 1 net |
| --- | --- | --- | --- |
| 0 | 0.00 | 42500000.00 | -2500000.00 |
| 10 | 10000000.00 | 37500000.00 | -7500000.00 |
| 20 | 20000000.00 | 32500000.00 | -12500000.00 |
| 30 | 30000000.00 | 27500000.00 | -17500000.00 |

Each step of ten points adds 10000000.00 to the royalty line, but tax falls by 5000000.00 at the same time, so net cash flow moves by 5000000.00, not 10000000.00. At a 50 percent tax rate the treasury hands half of its own royalty back through the tax base. The take still rises, from 65.3846 percent at zero royalty to 88.4615 percent at 30.

## The mistake

A careful person who has read a production sharing contract tries to take the royalty off something net: revenue less opex, or revenue less opex less capex. On AKATA 2029 that gives a royalty smaller than 27904800.00 and, because the deduction against tax shrinks with it, a tax larger than 45250880.00. The ledger looks plausible and every downstream number is wrong. The other mistake is to skip the deduction: a royalty of 20000000.00 beside a tax of 42500000.00 in the same year is the fingerprint of somebody who charged royalty against cash but forgot to remove it from taxable income.

## What it refuses

The JV royalty is one rate on every stream in every year. It has no tiers by production rate, no price component, no terrain and no allowance; those belong to the PIA regime and to the Expert tier. It cannot see cost, so a year with 210000000.00 of capex and a year with none pay the same 15 percent of whatever they sold. And it is field-level: the row prints the field's royalty, and working interest is applied to it afterward.

## Exercise

Write the gross revenue and royalty for 2029, 2031 and 2035 and confirm each royalty is the same share of its revenue. Then say what happens to the year 1 net of the hand-derived case when the royalty moves from 10 to 30 percent, and why the move is smaller than the change in the royalty itself.
