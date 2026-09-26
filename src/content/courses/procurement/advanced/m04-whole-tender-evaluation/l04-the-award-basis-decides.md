# The award basis decides

{{panel:pr-award-calculator}}

{{panel:pr-contract-calculator}}

Both Ekene tenders carry a setting that changes the winner with the bids untouched. On the well services tender it is the award basis and the price method; on the materials tender it is the reading of section 14 of the content Act. An Expert reads these settings as decisions made before the envelopes opened, and quotes every award with the setting that produced it.

## The well services tender under three settings

The bids, the technical scores and the evaluated costs (omission rule average; schedule minWeeks 6, maxWeeks 10, ratePerWeek 0.005) stay fixed. Only the award setting moves:

| award basis | price method | award |
| --- | --- | --- |
| combined, technical weight 0.7 | lowest-ratio | WS3 |
| combined, technical weight 0.7 | linear | WS5 |
| lowest-cost | not used | WS5 |

Under lowest-ratio the commercial score is 100 x Cmin / C, so even WS3, the dearest responsive bid, still scores 89.994781 on price and wins on its technical lead. Under linear the dearest responsive bid scores 0.000000 and the least costly 100.000000, so the same spread of evaluated costs moves the commercial score much further, and WS5 wins. Under a lowest-cost award the technical percentages only decide who passes.

Kiiver and Kodym, in the Journal of Public Procurement 15(3) (Fall 2015, read on 2026-09-26), describe the linear family; the World Bank's standard two-envelope bidding document for works (September 2025, read on 2026-09-26) prints the lowest-ratio formula. Neither choice is wrong. Each is a statement about how much a price difference should count, and it has to be made and published before the bids are seen.

## The materials tender under two readings

The Nigerian Oil and Gas Industry Content Development Act 2010 (Act No. 2, commenced 22 April 2010, read on 2026-09-26), s.14, asks for a content lead of "at least 5% higher" and does not say whether that means percentage points or a percentage of the runner-up's content. The engine has no default; the course presents both readings side by side as an open question of the Act. On the materials tender, with a lowest-cost award:

| s.14 reading | award | why |
| --- | --- | --- |
| none stated | MS4 | MS4 has the lowest evaluated cost |
| points | MS4 | MS2 leads by 4.541020 percentage points, less than 5 |
| relative | MS2 | MS2 leads by 7.960608 percent of MS4's content, at least 5 |

Same bids, same contents, and the reading decides the award. A tender document that intends to apply s.14 should state its reading in advance, and a report quotes the reading beside the award.

## One question to ask of every award

Which stated setting, changed to its alternative, would change this award? On the well services tender the answer is the price method or the award basis; on the materials tender, the s.14 reading. An evaluation report names that setting.

## Exercise

Open the award calculator on the view "Sections 14 and 16, both readings" and read the leader, the runner-up, the lead and the bid selected under each reading. Then open the contract calculator on the view "The whole tender, any award basis". Its box holds the materials tender with the points reading: read the award, change `ncLeadBasis` to "relative" and read it again. Delete the whole `nigerianContent` entry and confirm which bid stands. Say in one sentence which setting decides this award and why the Act leaves it open.
