# First oil delay

Slide production a year and the capex stays put. That is what schedule_shift_years does, and the ledger it produces is not the one a reader imagines.

{{panel:ec-fiscal-explorer}}

## What moves and what does not

The published schedule_shift_1 case carries capex of 50000000.00 in 2030 and 1000000.00 bbl a year in 2030 and 2031 with opex of 10000000.00. With schedule_shift_years 1 the 2030 row keeps its capex and loses its production and opex: revenue 0.00, depreciation 5000000.00, loss carried forward 5000000.00, net cash flow -50000000.00. Production and opex reappear in 2031 and 2032; 2031 spends the pool and pays 30000000.00, 2032 pays the full 32500000.00. NPV 17355371.90, IRR 35.3939 percent, payback 2.27 years.

Capex is not shifted. A delay in this engine is a delay of first oil against a spend already made, which is the delay a decision maker usually means, and not a delay of the project.

## AKATA delayed

| schedule_shift_years | First production year | Loss pool after year one | NPV | IRR, percent | Payback, years |
| --- | --- | --- | --- | --- | --- |
| 0 | 2029 | 0.00 | 72534830.66 | 29.2361 | 3.46 |
| 1 | 2030 | 21000000.00 | 56565094.12 | 18.8363 | 4.20 |
| 2 | 2031 | 21000000.00 | 40880824.32 | 14.6753 | 4.96 |
| 3 | 2032 | 21000000.00 | 17894126.42 | 15.1070 | 4.90 |

In the one-year case 2029 carries capex of 210000000.00 and nothing else, net -210000000.00, and its 21000000.00 of depreciation goes into the loss pool. 2030 carries the second tranche of 45000000.00 with the first 2200000.00 bbl, and the opex is 24720000.00 rather than 24000000.00, because the escalator counts calendar years from the base year and does not care when first oil came. The oil price escalates the same way, so the delayed first year sells at 83.640000 rather than 82.000000 and reports 55541846.40 against 31746007.20 at zero shift, where the same barrels had to carry the 210000000.00.

## The mistake

The careful mistake is to model the delay by hand and shift everything. A reader who moves the 45000000.00 second tranche into 2031 with the production has built a different project, its capital a year cheaper on present value, and its NPV will sit higher than 56565094.12 for a reason that has nothing to do with the delay.

## A row that is not there

The three-year row list runs 2029, 2030, 2032 and onward: no 2031 row, because nothing happened in it and the engine did not emit an empty year. Now read the KPIs. NPV fell from 40880824.32 at two years to 17894126.42 at three, as it should, while the IRR rose from 14.6753 to 15.1070 percent and the payback shortened from 4.96 to 4.90 years, as it should not. A longer wait for the same money cannot raise a rate of return; the reading that fits is that IRR and payback are counted on rows rather than calendar years, so the missing row made the delay look a year shorter to them. Whatever the mechanism, the NPV of that run is discounted on calendar years and can be trusted; the other two cannot.

## What the engine refuses

It refuses to shift capex. It refuses to hold opex or prices at first-oil values; both escalate from the base year. And it refuses to emit a row for an empty year, or to report the gap anywhere but the row list.

## Exercise

State which of capex, production, opex and price escalation move with schedule_shift_years and which do not. Then say, from the row list alone, why the three-year NPV of 17894126.42 can be trusted and the IRR of 15.1070 percent cannot.
