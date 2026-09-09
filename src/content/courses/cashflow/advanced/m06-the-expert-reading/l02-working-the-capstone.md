# Working the capstone

A fiscal ledger is worked from the outside in: regime, framework, terrain, then the bases, then the end of the ledger, and only then the headline. Most wrong answers come from starting at the headline.

{{panel:ec-fiscal-explorer}}

## Fix the regime and the framework before any number

Read the fiscal regime and the base year, and write the framework down. Under the PIA a base year of 2025 on auto gives pia_only and 2026 gives nta_2025; AKATA's 2029 gives nta_2025, so its last line is a development levy, 5390489.91 in 2029, and its TET is 0.00. Forced to pia_only the same rows pay TET of 3369056.19 and NPV moves from 42943268.01 to 49521778.87. Get the framework wrong and every row's last line is wrong.

## Fix the terrain, the lease and the reading

The terrain string sets the production royalty rate and the HCT rate together. AKATA in shallow water pays production royalty 22944240.00 in 2029 and HCT 25422778.65; onshore, 27454240.00 and 24069778.65; deep offshore, 9301600.00 and, under the conservative reading, HCT 0.00, or 29481778.65 under the aggressive one. Lease status sets the allowance: converted gives 5500000.00 on 2200000.00 bbl, new gives 17600000.00, and a new lease with prior production of 96000000 keeps the 2029 allowance but loses it later, 32000000.00 over the life against 77440000.00. None of these is a rate to guess from a rule of thumb. Each is a string, and the string must be read from the case.

## Walk the bases in order

Take AKATA's 2029 row. Gross revenue 186032000.00. Royalty 26549752.36, production plus price. Then HCT on liquids: assessable profit 130971072.31, with costs of 66000000.00 claimed against a CPR cap of 120920800.00 and 0.00 deferred, less the allowance of 5500000.00, chargeable 84742595.49, HCT 25422778.65. Then CIT: assessable 134762247.64, chargeable 92762247.64 after the two-thirds restriction, CIT 27828674.29. Then the levy on the assessable profit, 5390489.91. Total tax 58641942.84, net cash flow -133879695.21. Check the CPR columns every year: the cap binds in 2032, deferring 1398740.53, and in 2033, deferring 14561618.62, and a cap that binds in the last year is the difference between a claim and a forfeiture.

## Decide the end of the ledger

Read whether the economic limit is on; with it off, a losing tail stays and hands the IRR a terminal negative. Read the abandonment mode, and if it is a lump sum, whether the number entered is the share. Then read the sign of the final net cash flow before believing any IRR.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Framework | One string on every row, matching the base year and override |
| Last line | TET or the levy, never both, at 2.5 or 4 percent of the assessable profit |
| Royalties | Sum to the KPI, 122393644.64 on AKATA |
| Loss columns | Offsets used on the row after the loss, per base |
| Final flow | Sign read; negative means the IRR is one root of possibly two |
| Headline | Basis, convention and framework written beside it |

Then the units: USD, bbl, Mscf, boe at 6 Mscf per barrel, percent as a word, calendar years.

## The mistake

The careful mistake is to check the rates and skip the bases. Every rate on AKATA under the PIA is a published number, and a ledger can carry every one of them correctly and still report 61725382.46 where 141623594.88 is right, because one string was read the other way. The strings are where the marks are lost.

## Exercise

Work AKATA's 2030 row in the order given, one line each: framework, terrain and lease, royalty, HCT base and tax, CIT base and tax, levy, net cash flow. Then name the single string that, misread, changes every line from HCT downward without changing a single rate the reader typed.
