# The well services tender end to end

{{panel:pr-envelope-calculator}}

{{panel:pr-contract-calculator}}

This lesson walks the Ekene well services tender from the opening of the technical envelopes to the award, and then sets the award against the company's should-cost. Every figure is one the earlier tiers built stage by stage; here they are read as one evaluation, the way an evaluation committee reads its own report. The tender is synthetic, and the situations in it were planted so that each rule has something to find.

## The technical envelope

Six bids arrive for tender EK-11/WS/2027-01. WS6 fails a mandatory requirement, the signed bid form, and is excluded before scoring. The other five are scored on five weighted criteria against a pass mark of 70:

| bid | technicalPercent | status |
| --- | --- | --- |
| WS3 | 85.000000 | pass |
| WS1 | 82.500000 | pass |
| WS2 | 75.000000 | pass |
| WS5 | 70.000000 | pass |
| WS4 | 65.000000 | fail-pass-mark |

WS5 sits exactly on the pass mark and passes. WS4 has the lowest quoted total of all six bids, 763200.000000, and its price envelope is never opened.

## The commercial envelope

Four envelopes open. Two bills need correcting. WS2 priced its coiled tubing spread below quantity times unit rate, so the unit rate prevails and its price rises by 18000.000000. WS5 typed its acid rate with a misplaced decimal point and declared it, so its quoted amount governs and its price does not move. Then each evaluated cost is built, with omission rule average and schedule minWeeks 6, maxWeeks 10, ratePerWeek 0.005:

| bid | corrected price | adjustments in brief | evaluated cost |
| --- | --- | --- | --- |
| WS5 | 849400.000000 | three weeks late | 862141.000000 |
| WS2 | 867400.000000 | payment terms deviation, two weeks late | 885574.000000 |
| WS1 | 943200.000000 | discount of 15000.000000, on time | 928200.000000 |
| WS3 | 918000.000000 | nitrogen omitted and priced at 35400.000000, one week late | 957990.000000 |

WS5 has the lowest evaluated cost.

## The award

The award is combined, at technical weight 0.7 with priceMethod lowest-ratio and technicalMethod relative. The weight sits inside its para 5.50 cell of the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025, read on 2026-09-26) for a high-risk contract of US$900000. The combined scores rank WS3 at 96.998434, WS1 at 95.806109, WS2 at 90.970882 and WS5 at 87.647059, so WS3 is most advantageous. Under a lowest-cost award WS5 would win instead. WS3 carries the highest technical percentage and the fourth-lowest evaluated cost, and at a technical weight of 0.7 the first outweighs the second.

## The award against the should-cost

The committee's last question is whether the award is a fair price. Against the should-cost of 895361.041667, WS3's evaluated cost gives a ratio of 1.069948, inside the stated band of 0.8 to 1.25 with no flag. The award costs the company more than its own estimate, and the ratio says how much more, as a figure the committee can defend: the extra buys the best technical offer, at a weight the Regulations allow.

## Exercise

Open the envelope calculator on the view "The whole tender in one call". It loads the well services tender at its fixture settings. Read the award and the two exclusions with their stages. Change `award` to "lowest-cost" and read the award again, then set `award` back to "combined", change `priceMethod` to "linear" and read it once more. Then open the contract calculator on the view "Should-cost and the screening band" and read the ratio of whichever bid each of the three settings awarded. Write one sentence per setting: the award, its ratio to the should-cost, and the setting that produced it.
