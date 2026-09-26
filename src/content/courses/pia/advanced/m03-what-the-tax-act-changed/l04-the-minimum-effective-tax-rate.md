# The minimum effective tax rate

{{panel:pia-ledger-calculator}}

The Nigeria Tax Act 2025 sets a floor under what large companies pay. The test is written for a company and its audited accounts, and a project ledger is neither. This lesson reads the text, then shows the engine's labelled approximation and why the course never grades it.

## What s.57 says

The charge is in s.57(1): "where, in any year of assessment, the effective tax rate of a company is less than 15%, such company shall recompute and pay an additional tax that makes its effective tax rate equal to 15%."

It reaches only some companies. S.57(2): "(2) The provisions of this section shall apply to: (a) a company that is a constituent entity of an MNE group; and (b) any other company with an aggregate turnover of N20,000,000,000 and above in the relevant year of assessment."

And it defines its own ratio in s.57(4). The effective tax rate is "the rate produced by dividing the aggre- gate covered tax paid by a company for a year of assessment by the profits of the company", and profits are "the net profits before tax as reported in the audited financial statement less 5% of depreciation and personnel cost for the year." The numerator is tax paid; the denominator is an accounting figure.

Group membership, turnover in naira, audited profit, depreciation and personnel cost are facts about a company, and none of them lives in a field ledger. The statutory test is concept-only in this course.

## The engine's approximation

The engine offers a project-level stand-in, off by default (`pia_apply_minimum_etr`). Switched on, it tops the project's taxes up to a stated rate of the companies income tax assessable profit, in years under the Nigeria Tax Act 2025 only, and says so in a note:

> The minimum effective tax rate top-up is a project-level approximation of NTA s.57: the Act tests the company (a member of a multinational group, or turnover of 20 billion naira or more) on audited profit before tax less 5% of depreciation and personnel cost, which a project model cannot see. The top-up is applied only to years under the NTA and is reported on its own line.

On ekene_min_etr_nta_only (synthetic, shallow water, 2025 and 2026), the golden input states 85 percent, set high so that the top-up shows:

| year | framework | CIT assessable profit | HCT + CIT + TET + levy | top-up at 85 (stated) | top-up at 15 |
| --- | --- | --- | --- | --- | --- |
| 2025 | pia_only | 151142412.694013 | 87344719.997228 | 0.000000 | 0.000000 |
| 2026 | nta_2025 | 131887635.869565 | 76758086.956522 | 35346403.532609 | 0.000000 |

At the statutory 15 percent the top-up is 0.000000 in both years: the project's taxes are already well above 15 percent of its assessable profit. At 85 percent it fires in 2026 and stays at 0.000000 in 2025, because 2025 is a year under the Act alone.

## Why it is never graded

The approximation swaps the Act's company for a field and its denominator for a project figure. The result is a sensitivity, never the tax a company owes under s.57, and the course keeps it out of every capstone and keyed question.

## Exercise

Open the ledger calculator on "The whole ledger, year by year" and load ekene_min_etr_nta_only. Read the minimum ETR top-up column: 0.000000 in 2025 and 35346403.532609 in 2026, and find the approximation note under the ledger. Set pia_minimum_etr_pct to 15 and read the column again. Then set pia_apply_minimum_etr to false and confirm the note disappears. Name what s.57(4) needs that the case does not contain.
