# The Ekene tenders

{{panel:pr-envelope-calculator}}

Every bid in this course comes from two synthetic tenders written for this platform by a stated script, which reproduces the files byte for byte. Both files are labelled SYNTHETIC; the bidders are codes, and the wells follow the platform's Ekene field data. This lesson introduces both tenders and the situations planted in them on purpose.

## The well services tender

Tender EK-11/WS/2027-01 is the coiled tubing cleanout and matrix acid stimulation of Ekene-3 and Ekene-5. It is a two-envelope process with rated criteria: five weighted criteria, each scored 0 to 4, and a pass mark of 70. The award is combined, at technical weight 0.7. Six bids came in:

| bid | quoted total | weeks | discount | deviations | omitted |
| --- | --- | --- | --- | --- | --- |
| WS1 | 943200.000000 | 6 | 15000.000000 | none | none |
| WS2 | 849400.000000 | 8 | 0.000000 | payment-terms 9500.000000 | none |
| WS3 | 918000.000000 | 7 | 0.000000 | none | nitrogen |
| WS4 | 763200.000000 | 7 | 0.000000 | none | none |
| WS5 | 849400.000000 | 9 | 0.000000 | none | none |
| WS6 | 1004400.000000 | 6 | 0.000000 | none | none |

Each quoted total is the sum of that bid's quoted line amounts. WS2 and WS5 quote the same total, 849400.000000, and they will not end the evaluation level, because their bills hide different things.

## The materials tender

Tender EK-11/MS/2027-02 supplies casing, wellhead valves, cement and baryte for two Ekene infill wells, delivered to the supply base. Three criteria are weighted 60, 25 and 15, with a pass mark of 60. Five bids came in, MS1 to MS5, with quoted totals from 487200.000000 (MS5) to 562500.000000 (MS3). Its award is the lowest evaluated cost, and it carries a five-year maintenance cost for the valves. Pricing that maintenance over the life of the valves is the Professional tier's question, so at this tier you use the materials tender for its technical envelope only.

## What was planted

The script placed situations in the files so that each rule has something to find. The ones this tier works through:

1. WS6 fails a mandatory requirement, signed-bid-form, and is excluded before scoring.
2. WS4 has the lowest quoted total of the six and fails the pass mark, so its price envelope is never opened.
3. WS5 scores exactly the pass mark and passes.
4. WS2 prices a line whose quantity times unit rate differs from its quoted amount; the unit rate prevails.
5. WS2 carries a priced deviation on its payment terms.
6. WS5 typed its acid unit rate with the decimal point misplaced; the quoted amount governs.
7. WS3 omits the nitrogen line, priced at the average of the other responsive bids.
8. WS1 offers an unconditional discount.
9. The bid with the lowest evaluated cost, WS5, is not the most advantageous bid, WS3.
10. MS5 fails the materials pass mark.

The engine finds every one, and later lessons show where. When a lesson leans on one of these situations, remember it was planted: a real tender will not label its defects for you.

## Exercise

In the envelope calculator choose "The technical envelope". Replace the criteria with the materials tender's three: specification weight 60, delivery weight 25 and after-sales weight 15, each with maxScore 4. Replace the bids with MS1 to MS5 and their scores from the course's table of the materials bids: specification, delivery and after-sales of 3, 3, 3 for MS1; 3, 3, 2 for MS2; 4, 3, 3 for MS3; 3, 2, 3 for MS4; 2, 2, 2 for MS5. You may leave out the mandatory entries, since every materials bid meets them. Set the pass mark to 60 and find the bid that fails.
