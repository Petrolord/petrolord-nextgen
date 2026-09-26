# The tolerance and the quoted total

{{panel:pr-envelope-calculator}}

Two details finish the arithmetic check. The first is how large a gap between quantity times rate and the quoted amount must be before it counts. The second is what happens when the bid's stated total disagrees with its own lines. This lesson reads the engine's answer to both and names the one figure in the rule that is the engine's own choice.

## The tolerance is a stated convention

The engine calls a line in discrepancy when the gap is above a tolerance. Left out, the tolerance is 0.005, half a cent. No text read states a tolerance, so this is an engine convention, stated in the basis and in the course's table of choices. The alternative would be a tolerance of zero, where any trace of binary rounding in a rate with many decimals would count as an error and trigger a correction nobody intended.

## Equal to the tolerance is not a discrepancy

The rule reads "greater than". A gap equal to the tolerance is left alone. Two stated lines, each with a stated tolerance of 0.5:

| quantity x unit rate (stated) | quoted (stated) | gap (derived) | tolerance | corrected amount (engine) | rule (engine) |
| --- | --- | --- | --- | --- | --- |
| 1 x 100.5 | 100 | 0.5 | 0.5 | 100.000000 | null |
| 1 x 100.75 | 100 | 0.75 | 0.5 | 100.750000 | unit-rate-prevails |

The first line is left as quoted; only the second is corrected. Compare the pass mark, where a bid equal to the mark passes. Each rule has its own boundary, and the course names each one where it applies.

A negative tolerance is refused:

> tolerance must be a finite number at or above 0

## The subtotals prevail

A bid may also state a total. When that total differs from the sum of its own lines, the lines win. Stated as a test on WS1's lines with a stated total of 940000, the engine returns:

> the quoted total 940000 differs from the sum of the quoted lines 943200 by more than 0.005; the subtotals prevail

The corrected total is 943200.000000 and the correction is 3200.000000. When no total is stated, the quoted total is simply the sum of the quoted lines, which is how every Ekene bid reports it. A negative stated total is refused:

> quotedTotal must be a finite number at or above 0 when given

## Words against figures

The Standard Procurement Document also rules on an amount in words that differs from the amount in figures, at ITB 35.1(c). The engine does not compare words with figures, so the course teaches that rule as a concept and grades nothing on it.

## Exercise

In the envelope calculator choose "Arithmetic correction of a bill". Replace the lines with one line: id test, quantity 1, unit rate 100.5, quoted amount 100. Set the tolerance to 0.5 and read the rule. Change the unit rate to 100.75 and read it again. Then switch to another view and back, which restores WS2's six lines and the default tolerance, type 849000 in the quoted total box, and read the reasons: which comes first, the line correction or the total, and what is the final correction?
