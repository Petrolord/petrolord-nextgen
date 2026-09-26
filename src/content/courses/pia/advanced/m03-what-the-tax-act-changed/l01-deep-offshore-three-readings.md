# Deep offshore under the Tax Act, three readings

{{panel:pia-ledger-calculator}}

Under the Petroleum Industry Act 2021 deep offshore pays no hydrocarbon tax. The Nigeria Tax Act 2025 changes the wording of the charging section and leaves the rate section as it was, and the two sections do not fit together cleanly. This is an open reading: the course shows all three readings side by side and grades none.

## What each Act says

The Act keeps deep offshore out of the tax in s.260(3): "(3) This Part shall not apply to a frontier acreage until it is reclassified under section 68 (3) of this Act and to deep offshore."

The Nigeria Tax Act 2025 (Official Gazette No. 117, Vol. 112, 26 June 2025; re-gazetting ordered in December 2025) writes its scope in s.65(1) around upstream companies with "operations in the onshore, shallow water and deep offshore with licences and" leases under the PIA.

Its rate section is the old one restated: s.72(a) charges 30 percent on leases "with respect to onshore and shallow water areas; and" s.72(b) charges 15 percent "for onshore and shallow water and for" prospecting licences. Neither names deep offshore, so the Part reaches deep offshore and prints no rate for it.

## Three readings

The engine states the gap in its refusal and takes a reading as a stated input with no default:

> A deep offshore year under the Nigeria Tax Act 2025 needs pia_deep_offshore_hct_interpretation set to "conservative_zero", "aggressive_pml_30" or "custom": NTA s.65(1) applies hydrocarbon tax to deep offshore operations but s.72 states rates only for onshore and shallow water, so the rate is a stated user choice with no default.

"conservative_zero" reads the silence of s.72 as no rate. "aggressive_pml_30" applies the 30 percent of s.72(a). "custom" takes a rate the user states, and without one it is refused:

> pia_deep_offshore_hct_interpretation "custom" needs pia_deep_offshore_hct_custom_rate_pct as a number from 0 to 100; got null.

## The same lease under each reading

The Ekene deep offshore lease (synthetic; new acreage, 60,000 bopd, 2025 to 2027) under each stated reading:

| year | framework | HCT chargeable profit | HCT, conservative_zero | HCT, aggressive_pml_30 | HCT, custom 20 (stated) |
| --- | --- | --- | --- | --- | --- |
| 2025 | pia_only | 795646660.199557 | 0.000000 | 0.000000 | 0.000000 |
| 2026 | nta_2025 | 1,012,073,369.565217 | 0.000000 | 303622010.869565 | 202414673.913043 |
| 2027 | nta_2025 | 1,014,258,341.102824 | 0.000000 | 304277502.330847 | 202851668.220565 |

The reading moves the hydrocarbon tax line and nothing else: companies income tax is 303622010.869565 in 2026 under every reading, because it does not deduct the hydrocarbon tax. 2025, a year under the Act alone, pays none under every reading, because s.260(3) governs that year.

## Quoting a figure that depends on the reading

A deep offshore hydrocarbon tax in a year under the Nigeria Tax Act 2025 is always quoted with its stated reading, beside the other readings. No reading is the law. A report that shows one reading alone has made a legal choice for its reader without saying so.

## Exercise

Open the ledger calculator on "One case under every stated reading"; it starts with ekene_deep_new_60k_conservative. Read total HCT and the take under the two deep offshore rows, and say which other row moves the royalty and why a new-lease rate onshore or in shallow water has nothing to act on here. Then open "The whole ledger, year by year" with the same case, delete pia_deep_offshore_hct_interpretation and read the refusal. Set it to "custom" with no rate and read the second refusal. Finally set pia_deep_offshore_hct_custom_rate_pct to 20 and check the 2026 hydrocarbon tax against the table.
