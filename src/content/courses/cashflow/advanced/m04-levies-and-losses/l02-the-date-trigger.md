# The date trigger

The framework is chosen for each year of assessment. A ledger that runs across 2026 switches at 2026, and the fiscal_framework column says so row by row.

{{panel:ec-fiscal-explorer}}

## The rule

With the override left on auto, a year before 2026 is a PIA year and a year from 2026 is an NTA year. The engine's own decision, year by year:

| Year of assessment | Override | Framework |
| --- | --- | --- |
| 2024 | auto | pia_only |
| 2025 | auto | pia_only |
| 2026 | auto | nta_2025 |
| 2027 | unset | nta_2025 |
| 2025 | force_nta | nta_2025 |
| 2030 | force_pia | pia_only |

An unset override behaves as auto, and a forced override applies one framework to every year, whatever the date. AKATA, base year 2029, lands on nta_2025 in every one of its seven rows from 2029 to 2035 without anyone asking, because every one of those years is 2026 or later.

## One year later, same rows

The published worked example in 2025 with the override forced to nta_2025 pays a development levy of 42329665.93 and reports NPV 130654493.35. The same volumes in 2026 on auto land on nta_2025 by the date alone, and pay a levy of 42414115.94 with NPV 131414543.48.

Same framework, different levy, because the year moved something else. The royalty-by-price benchmarks escalate a year further, so the price royalty falls from 34908351.810791 to 32797101.449275 and total royalty from 199158351.81 to 197047101.45, and every profit downstream of royalty rises a little: the assessable profit from 1058241648.19 to 1060352898.55, HCT from 285784994.46 to 286418369.57, CIT from 299472494.46 to 300105869.57. Those royalties are on the Regulations (2021) base, the engine default. The levy follows its base. A reader who attributes the whole difference to the framework has read a royalty effect as a levy effect.

## One ledger, two frameworks

This is the fact that catches careful people. The published pia_loss_relief case has rows in 2025 and 2026: the 2025 row prints pia_only and the 2026 row prints nta_2025, with a development levy of 12098579.71 and no TET. The same holds on pia_cpr_carry_two_years, whose 2025 row reads pia_only and whose 2026 and 2027 rows read nta_2025, and on elt_pia_multiyear, pia_only in 2025 and nta_2025 from 2026 to 2030. The worked example's one year repeated in 2026 pays TET of 31747249.45 in 2025 and a levy of 42399115.94 in 2026, and the KPI line names the ledger pia_only_then_nta_2025 with 2026 as its first NTA year.

The texts tax each year of assessment under the law in force for it, and the engine follows them.

## The mistake

Two ledgers with the same rows in different years are two fiscal regimes and two royalty schedules. A reader who sets NPV 141236909.83 in 2025 against 131414543.48 in 2026, both on auto, and calls the gap a one-year delay has compared pia_only with nta_2025 and moved the royalty benchmarks in one step. Nothing was delayed: the volumes were produced in the stated year both times.

## What the engine refuses

It refuses to carry one framework across a ledger on auto; each row's year decides. It refuses to blend the two in one year: a row is pia_only or nta_2025. And it reports the choice in the fiscal_framework column and the KPI line.

## Exercise

State the framework for 2027 with the override unset, and for 2030 with the override forced to pia_only. Then explain why the levy on the 2026 auto run is 42414115.94 rather than 42329665.93 when the framework is the same in both.
