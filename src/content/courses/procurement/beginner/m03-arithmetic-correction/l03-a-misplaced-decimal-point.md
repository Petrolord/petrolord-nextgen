# A misplaced decimal point

{{panel:pr-envelope-calculator}}

The rule that the unit rate prevails has one exception written into it. When the decimal point in the unit rate is obviously misplaced, the quoted amount governs and the unit rate is corrected instead. The World Bank Standard Procurement Document, Request for Bids, Works, two-envelope (September 2025) states the exception at ITB 35.1(a). This lesson applies it to WS5's acid line.

## WS5's acid

WS5 prices 60 m3 of 15% HCl treating fluid. It typed the unit rate as 13.8, and wrote the amount as 82800.000000. Sixty times 13.8 is nowhere near that amount. The amount implies a unit rate of 1380.000000, and the gap is a factor of one hundred, a decimal point two places out. The line carries the flag decimalMisplaced set to true, recorded by the evaluator. The engine returns:

> WS5: line acid: quantity x unit rate = 828 differs from the quoted 82800 and the decimal point in the unit rate is obviously misplaced, so the quoted amount governs and the unit rate is corrected to 1380

| bid | line | quantity | unit rate | quoted amount | corrected unit rate | corrected amount | rule |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WS5 | acid | 60.000000 | 13.800000 | 82800.000000 | 1380.000000 | 82800.000000 | total-governs |

The amount stays, the unit rate is corrected as quoted amount divided by quantity, and WS5's total does not move: its correction is 0.000000 on a quoted total of 849400.000000.

## Why the exception exists

Without it, the unit rate rule would cut WS5's acid line from 82800.000000 to 828 and hand WS5 a price it never meant, which it could then not honour. Where a rate is plainly out by a power of ten, the amount is the better record of what the bidder offered.

## The flag is stated

The engine does not judge whether a decimal point is obviously misplaced. ITB 35.1(a) leaves that to the opinion of the Employer, and the engine reads the flag as an input on the line, which the evaluator records once that judgement is made. That keeps the judgement visible: a report shows the flag, and a reader can disagree with it. Two refusals guard the flag. It must be true or false:

> lines[0].decimalMisplaced must be true or false when given

And it cannot sit on a line of quantity zero, since the corrected rate divides by the quantity:

> lines[0].quantity must be above 0 when decimalMisplaced is true (the unit rate is corrected as quoted amount / quantity)

A flag on a line with no discrepancy changes nothing. Stated as a test, 60 at 1380 quoted as 82800 with the flag set, the engine corrects no line at all.

## Exercise

In the envelope calculator choose "Arithmetic correction of a bill". Replace WS2's acid line with WS5's: quantity 60, unit rate 13.8, quoted amount 82800, decimalMisplaced true. Read the rule the panel returns for the line. Then set decimalMisplaced to false and read it again: which figure prevails now, and what happens to the total? Finally set the quantity to 0 with the flag true, and read the refusal and the field it names.
