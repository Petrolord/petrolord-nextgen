# An award without rated criteria

{{panel:pr-award-calculator}}

The Associate tier decided the well services tender two ways: the combined score awarded WS3 and the lowest evaluated cost awarded WS5. This tier follows the second road. It asks what the lowest evaluated cost is when a purchase lasts for years, and what the Nigerian content Act does to that award.

Every practical in this tier runs in the course's own award calculator, which calls the same vendored tender engine the lessons quote. There is no Suite app for this course.

## Where the rule comes from

When a tender carries no rated criteria in the award, the contract goes to the bid with the lowest evaluated cost. The engine cites two texts for that award, both read on 2026-09-26:

* the World Bank Procurement Regulations for IPF Borrowers, Seventh Edition, September 2025, para 5.70 (the Most Advantageous Bid, which for a bid without rated criteria is the lowest evaluated cost);
* the Nigeria Public Procurement Act 2007 (Act No. 14, Official Gazette No. 65, Vol. 94, 19 June 2007), s.24(3) and s.33(1).

The technical envelope still runs first, exactly as at Associate. What changes is the last step: the passing bids are ranked on evaluated cost alone, and no technical weight enters the award.

## The materials tender

The second Ekene tender is a synthetic materials supply for two infill wells: casing, wellhead valves, cement, baryte and third-party inspection, delivered to the supply base. Its pass mark is 60, and it is scored on three criteria weighted 60, 25 and 15.

| bid | technicalPercent | status |
| --- | --- | --- |
| MS1 | 75.000000 | pass |
| MS2 | 71.250000 | pass |
| MS3 | 90.000000 | pass |
| MS4 | 68.750000 | pass |
| MS5 | 50.000000 | fail-pass-mark |

MS5 quotes the lowest total of the five, 487200.000000, and the engine returns it with the reason:

> MS5: technical score 50 is below the pass mark 60; the commercial envelope is not opened

So four bids reach the commercial envelope. MS3 scores highest technically, at 90.000000, and under this award basis that earns it nothing beyond a pass.

## Ranked on evaluated cost

The four responsive bids, with the omission rule at the average, a delivery schedule of 8 to 14 weeks at 0.0025 a week, and a five-year life cycle at 0.1:

| rank | bid | corrected price | evaluated cost |
| --- | --- | --- | --- |
| 1 | MS4 | 503930.000000 | 546244.982386 |
| 2 | MS2 | 525700.000000 | 547863.577232 |
| 3 | MS1 | 540300.000000 | 565746.220616 |
| 4 | MS3 | 562500.000000 | 581453.933847 |

The engine returns MS4 as the lowest evaluated cost. Each figure in the right-hand column depends on the settings above, so the course quotes it with its omission rule, schedule and life cycle. The next four lessons take the column apart.

Hold on to one word. "Lowest evaluated cost" names the evaluated cost the engine builds, term by term. It never names the quoted price. MS4 does quote the lowest total of the four responsive bids, but its evaluated cost is built on top of that total with an omission, a schedule adjustment and a life-cycle cost, and the ranking reads the built figure. MS5's lower quote never entered the comparison at all.

## Exercise

Open the award calculator and choose the view "Evaluated cost with a life-cycle cost". It starts on the four materials bids that passed. Confirm the rank table and the lowest evaluated cost tile against the table above. Then edit MS4's completionWeeks to 8, the start of the delivery schedule, and read how its schedule column and its evaluated cost move. Finally read the two declared blocks under the table, which state the life-cycle rule and the evaluated-cost rule in the engine's own words.
