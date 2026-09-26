# The development levy replaces the education tax

{{panel:pia-ledger-calculator}}

One line of the ledger changes its name and its rate at the switch. In a year under the Act alone the tertiary education tax is charged on the companies income tax assessable profit. In a year under the Nigeria Tax Act 2025 that line is empty and a development levy of 4 percent takes its place on the same base.

## The education tax, and where it goes

The rate of the tertiary education tax comes from the Finance Act 2023 (the signed copy published by the Budget Office of the Federation on 7 June 2023, a scan read page by page on 2026-09-26): 3 percent under s.26, with effect from 1 May 2023 under s.30. The 2.5 percent that applies before 2023 rests on a secondary source, alerts on the Finance Act 2021, and the course says so wherever it is used. The engine applies 3 percent to the whole of 2023.

The Nigeria Tax Act 2025 deletes three sections of the Act behind the tax: "(5) The Tertiary Education Trust Fund (Establishment, Etc.) Act, 2011 is amended by deleting sections 1, 2, and 3(3)." (s.197(5)).

## The levy, and what it reaches

NTA s.59(1) opens: "59. (1) A development levy of 4% is imposed on the assessable profits of" and closes by excluding "other than small companies and non-resident companies. (2) The Service shall collect the levy and pay it into a special account created for that purpose."

The levy is shared out by fixed percentages under s.59(3), half of it to the Tertiary Education Trust Fund, so that fund still receives money through the levy.

One exclusion matters for this course. S.59(4) reads: "(4) The tax imposed under this Part shall not be levied on assessable profits computed for the purposes of hydrocarbon tax." The engine charges the levy on the companies income tax assessable profit, as it charged the education tax, and never on the hydrocarbon tax base.

## The two lines on one lease

The onshore lease ekene_onshore_across_2026 (synthetic, converted, 2024 to 2028) runs across the switch. The engine returns:

| year | framework | CIT assessable profit | TET | development levy |
| --- | --- | --- | --- | --- |
| 2024 | pia_only | 153422584.102902 | 4602677.523087 | 0.000000 |
| 2025 | pia_only | 138422805.570953 | 4152684.167129 | 0.000000 |
| 2026 | nta_2025 | 123013136.548913 | 0.000000 | 4920525.461957 |
| 2027 | nta_2025 | 109119842.223295 | 0.000000 | 4364793.688932 |
| 2028 | nta_2025 | 96315736.305067 | 0.000000 | 3852629.452203 |

Each row carries exactly one of the two lines, on the same kind of base.

## On a whole ledger

Ekene Alpha runs 2026 to 2032, every year a year under the Nigeria Tax Act 2025. Its development levy over the ledger is 35714217.371697 at 100 percent and its tertiary education tax 0.000000. Forced to the Act alone, the levy total falls by 35714217.371697 and the education tax total rises by 26785663.028773. The two do not cancel, because the rates differ and because forcing the Act alone also changes the capital allowance, which moves the base.

## Exercise

Open the ledger calculator on "The whole ledger, year by year" and load ekene_onshore_across_2026. Read the TET and levy columns and confirm that each year carries one of the two. Divide the 2026 levy by the 2026 assessable profit in the table above and check the rate. Then switch to "Which provision moved", load ekene_alpha_shallow_converted_nta and enter {"pia_under_nta_2025_override": "force_pia"}. Confirm the TET and levy rows, and explain why their sum is not zero.
