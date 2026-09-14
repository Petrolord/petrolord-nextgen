# Success-case NPV is not value

A success-case NPV tells you what a project is worth if it works. Its value to a portfolio is the risked EMV, and on a risky project the two can differ by an order of magnitude.

{{panel:ec-capital-explorer}}

## OK-3 in two numbers

OKONO's exploration well has a success-case NPV of 420.0000 million USD, the largest in the inventory. Its risked EMV is 41.2500:

0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500.

The EMV is 0.098214 of the success case, a derived ratio. Three chances in four the well is dry and loses 85.0000, and that branch takes away more than half of what the one-in-four success contributes.

## Two rankings of one inventory

| project | npv_p50 | risked EMV |
| --- | --- | --- |
| OK-3 | 420.0000 | 41.2500 |
| OK-6 | 360.0000 | 144.0000 |
| OK-4 | 210.0000 | 160.0000 |
| OK-2 | 130.0000 | 115.0000 |
| OK-1 | 95.0000 | 89.7500 |
| OK-5 | 38.0000 | 38.0000 |

Ranked by success-case NPV, OK-3 is first. Ranked by risked EMV it is fifth of six, above only the workovers. OK-4 is third on success case and first on value.

The well's entered `npv_p10` of 700.0000 is higher still, the top of its success range, and its `npv_p90` of 210.0000 the bottom. Both describe the well only in the one case in four that it works. None of the three success figures says anything about the dry hole, which is the likeliest outcome.

## A set's success NPV

The optimizer reports a total success NPV for each funded set beside its total risked EMV:

| capex limit | funded set | total risked EMV | total success NPV |
| --- | --- | --- | --- |
| 450.0000 | OK-1 + OK-3 + OK-4 | 291.0000 | 725.0000 |
| 600.0000 | OK-1 + OK-2 + OK-4 + OK-5 | 402.7500 | 473.0000 |

The smaller budget's set shows the larger success NPV, 725.0000 against 473.0000, because it holds the well, while its risked EMV of 291.0000 is well short of 402.7500. Success NPV adds up the best case of every project as if all of them worked at once.

## What the outcomes say

The seeded risk summary, at seed 20260829 and 10000 iterations, shows what that best case hides. The 450.0000 set has a P(loss) of 0.123600 and a P90 of -18.3574, the low case under the exceedance convention. The 600.0000 set has a P(loss) of 0.001800 and a P90 of 200.3575. Neither set ever returns its total success NPV as a typical result.

## The mistake

The mistake is presenting 725.0000 as what OK-1 + OK-3 + OK-4 is worth. It is the sum of three success cases, one of which happens a quarter of the time. The same error ranks exploration ahead of a waterflood because 420.0000 is larger than 210.0000. The engine never optimises on success NPV and never warns when a set's success total and its risked total drift far apart.

## Exercise

Write OK-3's risked EMV by hand and state what fraction of its success-case NPV it is. Then give the total risked EMV and total success NPV of the 450.0000 and 600.0000 sets, and explain which total the optimizer maximises and why the larger success NPV belongs to the less valuable set.
