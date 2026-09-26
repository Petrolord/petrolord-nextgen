# The framework read year by year

{{panel:pia-ledger-calculator}}

A field does not stop producing on 31 December 2025. A ledger that starts under the Petroleum Industry Act 2021 and runs on into 2026 crosses from one set of texts to another part way through its life. The engine handles that by reading the framework one year of assessment at a time. This is one of the engine's declared choices, and every figure in this tier that crosses the switch depends on it.

## The rule

The engine's function for the framework of a year, `fiscalFrameworkForYear`, returns one of two strings. Under the default setting "auto", a year before 2026 is a year under the Act alone ("pia_only") and 2026 and every later year is a year under the Nigeria Tax Act 2025 ("nta_2025"). The first year of assessment under the new Act is exported by the engine as 2026.

Where does 2026 come from? The Nigeria Tax Act 2025's own commencement note, as the gazette prints it, reads "[ 26th June, 2025 ] Commence- ment ENECTED by the National Assembly of the Federal Republic of Nigeria". The effective date of 1 January 2026 comes from a State House statement, a secondary source, and the engine takes the first full year of assessment from it. The course names both dates and teaches the switch as a declared choice of the engine.

## Overriding the rule

The setting `pia_under_nta_2025_override` takes three values. "force_pia" puts every year on the Act alone and "force_nta" puts every year on the Nigeria Tax Act 2025. The engine's own table:

| year (stated) | auto | force_pia | force_nta |
| --- | --- | --- | --- |
| 2023 | pia_only | pia_only | nta_2025 |
| 2024 | pia_only | pia_only | nta_2025 |
| 2025 | pia_only | pia_only | nta_2025 |
| 2026 | nta_2025 | pia_only | nta_2025 |
| 2027 | nta_2025 | pia_only | nta_2025 |
| 2030 | nta_2025 | pia_only | nta_2025 |

Any other value is refused:

> pia_under_nta_2025_override must be "auto", "force_pia" or "force_nta"; got "nta".

The overrides exist for comparison. A forced run answers "what would this ledger pay if one set of texts had governed every year", which is how the previous lesson isolated the levy and the education tax. Neither forced run is the law for the years it rewrites, and a figure from a forced run is always quoted with its override so that nobody mistakes it for the ledger under auto.

## What turns on the framework of a year

| line | a year under the Act alone | a year under the Nigeria Tax Act 2025 |
| --- | --- | --- |
| tertiary education tax | charged | none |
| development levy | none | 4 percent of the CIT assessable profit |
| capital allowance, fifth year | 19 percent, 1 percent retained | 20 percent |
| two thirds restriction on the CIT capital allowance | applies | does not apply |
| deep offshore hydrocarbon tax | none | a stated reading |
| deep offshore and frontier new-lease production allowance | allowed | none |
| decommissioning fund contribution | deductible | deductible only if the escrow condition is met |
| minimum effective tax top-up, when switched on | none | applied |

Royalty, the royalty by price, the hydrocarbon tax rates onshore and in shallow water and the cost price ratio are absent from this table. They read the same under both frameworks, which is why a single ledger can cross the switch with its royalty lines untouched while its tax lines change character.

## One ledger across the switch

On ekene_onshore_across_2026 the engine reports the framework of the ledger as a whole in `kpis.fiscal_framework`: "pia_only_then_nta_2025", with `kpis.nta_first_year` 2026. The Ekene case ekene_force_pia_2027 (synthetic, 2027 to 2032, forced to the Act alone) reports "pia_only" in every year, a tertiary education tax rate of 3.000000 percent and a development levy of 0.000000.

## Exercise

Open the ledger calculator on "The framework of each year" and confirm the table above. Switch to "The whole ledger, year by year", load ekene_onshore_across_2026 and read the two tiles for the framework of the ledger and the first NTA year. In the case, set pia_under_nta_2025_override to "force_nta" and name the rows and columns that change; then set it to "force_pia" and do the same. Finally set it to "nta" and read the refusal.
