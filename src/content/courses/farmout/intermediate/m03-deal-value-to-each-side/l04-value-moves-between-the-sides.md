# Value moves between the sides

{{panel:farmout-deal-calculator}}

The well, the chance and the success-case value are the same whoever drills. What a farm-out does is move value between the farmor and the farminee, and send the assignor fees out of both. The engine states this as an identity. This lesson reads it on the Ekene Deep deal, then checks the engine against the one published worked figure the course uses.

## The identity

The engine's basis:

> farmor alone = farmor after the farm-out + farminee + assignor fees: the deal moves value between the two sides and the fees leave both

| term | EMV (engine) |
| --- | --- |
| EKO drills alone | 18418808.982316 |
| EKO after the farm-out | 19833033.704181 |
| FIN farms in | -1806224.721864 |
| assignor fees | 392000.000000 |

The last three add to 18418808.982316, the first. The engine returns their difference from the farmor alone as float residue under 0.000001 in size, so the identity holds to the precision the course prints.

On these terms EKO's EMV rises by 1414224.721864 while FIN's is below 0. The deal moves value from the farminee to the farmor, and the fees leave both.

## The consideration in expectation

The engine also reports what EKO receives, weighted by the chance. The carry is 4400000.000000 on a success and 4000000.000000 on a dry hole, 4100000.000000 in expectation. With the bonus of 2000000.000000 and the reimbursement of 3600000.000000, the expected consideration is 9700000.000000, or 323333.333333 per percent earned. That is a figure of these terms and this chance: a report quotes it with both.

## The fees in the identity

The assignor fees are a stated input to the deal value: the Ekene fixture states 392000.000000, and the fifth module computes that figure from the 2024 Regulations. A deal box without them is refused:

> deal.assignorFees must be a finite number at or above 0; got nothing

A deal with no fee states 0, and the identity then reads farmor alone equals farmor after plus farminee.

## A published check

Penn State EME 801, Lesson 6, Expected Monetary Value and Value at Risk (the course page prepared by Seth Blumsack and Mark Kleinginna, CC BY-NC-SA 4.0, read on 2026-09-27) prints a drill yourself or farm out problem. The course cites its figures only. It states a producer chance of 35.000000 percent and a dry-hole chance of 65.000000 percent. Drilling yourself pays -250000.000000 on a dry hole and 500000.000000 on a producer; farming out pays 0.000000 and 50000.000000. The page prints EMVs of 12500.000000 and 17500.000000.

The course states those payoffs as a deal and the engine returns:

| position | dry hole | producer | EMV (engine) | EMV the page prints |
| --- | --- | --- | --- | --- |
| drill yourself | -250000.000000 | 500000.000000 | 12500.000000 | 12500.000000 |
| farm out | 0.000000 | 50000.000000 | 17500.000000 | 17500.000000 |

The page states no participating interest. The course's deal keeps 6.666667 percent for the owner, the farm-out payoff of 50000.000000 over the 750000.000000 success value, and the incoming party pays the whole well of 250000.000000 to earn 93.333333 percent.

## Exercise

Work in the course's own deal calculator.

1. Open the view "The value of the deal to each side" and start from "The Ekene Deep deal, cash flows stated". Read the four transfer tiles and add the last three yourself.
2. Read the expected carry, the expected consideration and the expected consideration per percent earned.
3. Start from **The Penn State figures** in the start selector. Check both EMVs against the table, and read the farmor's best-action tile.
4. Back on the Ekene Deep deal, set "Assignor fees the farmor pays (stated, 0 for none)" to not stated and read the refusal.
