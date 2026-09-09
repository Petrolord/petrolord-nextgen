# The date trigger

The framework is chosen once, from the base year, and every row inherits the choice. A ledger that runs across 2026 does not switch in the middle.

{{panel:ec-fiscal-explorer}}

## The rule

With the override left on auto, a base year of 2025 selects pia_only and a base year of 2026 selects nta_2025. The engine's own decision table reads:

| Base year | Override | Framework |
| --- | --- | --- |
| 2025 | auto | pia_only |
| 2026 | auto | nta_2025 |
| 2025 | force_nta | nta_2025 |
| 2030 | force_pia | pia_only |
| 2027 | unset | nta_2025 |

An unset override behaves as auto, and a forced override beats the date either way. AKATA, base year 2029, lands on nta_2025 without anyone asking, and all seven of its rows from 2029 to 2035 print nta_2025 in the fiscal_framework column.

## One year later, same rows

The published worked example at a 2025 base year with the override forced to nta_2025 pays a development levy of 41599794.17 and reports NPV 119585647.53. The same volumes at a 2026 base year on auto land on nta_2025 by the date alone, and pay a levy of 41684425.66 with NPV 120347330.91.

Same framework, different levy, because the base year moved something else. The price royalty anchors escalate a year further, so the price royalty falls from 34905145.759897 to 32789358.588134, total royalty from 217405145.76 to 215289358.59, and every profit downstream of royalty rises a little: the assessable profit from 1039994854.24 to 1042110641.41, HCT from 284810956.27 to 285445692.42, CIT from 293998456.27 to 294633192.42. The levy follows its base. A reader who attributes the whole difference to the framework has read a royalty effect as a levy effect.

## The trigger reads the base year, not the row

This is the fact that catches careful people. The published pia_loss_relief case has a 2025 base year and rows in 2025 and 2026, and both print pia_only: the 2026 row pays TET of 5755415.35 and a development levy of 0.00, though a run based in 2026 would have paid the levy. The same holds on pia_cpr_carry_two_years, whose 2025, 2026 and 2027 rows all read pia_only, and on elt_pia_multiyear, whose rows run from 2025 to 2030 under pia_only throughout.

Expecting the 2026 row to switch is reasonable and wrong. A ledger is one framework from its first row to its last.

## The mistake

Two ledgers with the same rows and different base years are two fiscal regimes and two royalty schedules. A reader who sets NPV 135185570.34 at a 2025 base year against 120347330.91 at 2026, both on auto, and calls the gap a one-year delay has compared pia_only with nta_2025 and moved the royalty anchors in one step. Nothing was delayed: the volumes were produced in the base year both times.

## What the engine refuses

It refuses to switch frameworks inside a ledger. It refuses to read the row year; only the base year and the override enter the table. And it reports the choice only in the fiscal_framework column and the KPI line, so a reader who does not look there does not know which levy was charged.

## Exercise

State the framework for a base year of 2027 with the override unset, and for 2030 with the override forced to pia_only. Then explain why the levy on the 2026 auto run is 41684425.66 rather than 41599794.17 when the framework is the same in both.
