# Cost lost at cessation

{{panel:pia-hct-calculator}}

A carried cost waits for a year with room under the cap. If crude oil operations end first, the Act says the wait is over and the cost is gone. This lesson reads that rule, shows where the engine reports it, and says what the ledger's last year stands for.

## The text

The Petroleum Industry Act 2021, Sixth Schedule para 2(2)(c): "(c) where under paragraph 2 (2) (b), any cost exceed the cost price ratio limit upon the termination of upstream petroleum operations related to crude oil, such costs shall not be deductible for purpose of calculation of the hydrocarbon tax."

Section 264 closes the door from the other side. Among the items that may never be deducted is "(q) costs under paragraph 2 (2) (c) of the Sixth Schedule to this Act." So the forfeited cost cannot come back through any other deduction for the hydrocarbon tax.

## What the engine reports

The engine treats the last year of the ledger as the end of crude oil operations. Cost still carried out of that year is reported in the KPIs as `cpr_forfeited_at_cessation`, which the panel shows as "Forfeited at cessation".

| ledger (the Ekene CPR case, synthetic) | last year | carried out of the last year | forfeited at cessation |
| --- | --- | --- | --- |
| 2024 to 2026 | 2026 | 93000000.000000 | 93000000.000000 |

The forfeited amount equals the last year's carry. It has no other source: the engine forfeits exactly what the cap still holds back when the ledger ends.

## What forfeiture reaches, and what it leaves

Forfeiture belongs to the hydrocarbon tax alone, because the cost price ratio belongs to it alone. Companies income tax deducted the same opex in full in each year it was spent, and its capital allowance runs on its own schedule. A lease that forfeits cost under the cap has still had that cost in its companies income tax base.

That makes the length of the ledger a real input. A ledger cut short forfeits the carry at the year you stopped it, whether or not the field would have produced on. When you read a forfeiture figure, read the last year beside it.

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "The tax base and the cost price ratio on a ledger" on ekene_cpr_binding_forfeiture and read the "Forfeited at cessation" tile: 93000000.000000.
2. Delete the 2026 entries from `prodRows` and `opexRows`. The ledger now ends in 2025. Confirm the tile now shows 52250000.000000, the carry out of 2025.
3. Restore the case and add a 2027 year with 1000000 bbl of oil and opex of 0. Does the forfeiture grow or shrink? Why?
4. In one sentence, cite the two provisions that make the tile's figure non-deductible.
