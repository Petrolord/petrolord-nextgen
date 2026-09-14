# Gross and net

A survey's gross value is what it is worth before it is paid for, and its net value is what is left after the price. For EKPAN the CSEM survey is worth 24.8250 million USD gross and 16.8250 net at a cost of 8.0000.

{{panel:ec-information-explorer}}

## One subtraction

| quantity | value |
| --- | --- |
| evii | 24.8250 |
| survey cost | 8.0000 |
| netEvii | 16.8250 |

netEvii is evii less the cost: 24.8250 less 8.0000 is 16.8250. The cost is paid once, before any reading is seen, on every path through the survey.

## Where the cost sits

Deciding after a reading is worth 100.5750. Paying 8.0000 to get there leaves 92.5750, and against deciding now at 75.7500 the survey adds 16.8250. Because this cost is paid whichever reading arrives, taking it off before or after the readings are weighted gives the same answer. That holds only for a cost on the branch that buys the survey. A cost that falls on one branch of a chance node is paid on that branch alone and must come off inside it.

## The sign decides

A positive net value says buy on EMV grounds, and a negative one says do not. Three published cases keep the gross value fixed and move only the price:

| case | evii | netEvii |
| --- | --- | --- |
| seismicBayes | 12.5000 | 7.5000 |
| costEqualsValue | 12.5000 | 0.0000 |
| costAboveValue | 12.5000 | -7.5000 |

The survey, its posteriors and its gross value are identical in all three rows. At a net value of 0.0000 the survey exactly pays for itself.

## Project value and survey value

The acquire branch, 92.5750 at a cost of 8.0000, is the value of the whole decision with the survey bought. The net value, 16.8250, is the survey's own contribution. They answer different questions, and the first can stay comfortably positive while the second turns negative: at a cost of 28.0000 the acquire branch is still worth 72.5750 and the net value is -3.1750.

## The mistake

Three wrong answers recur. Quoting 24.8250 to a budget committee as the survey's worth is gross quoted as net, and it overstates the case by exactly the price. Subtracting 8.0000 from evWithInfo and reporting 92.5750 as the survey's value confuses the decision with the survey. Reading a positive acquire branch as a reason to buy ignores the no-information branch, which at 28.0000 is worth more.

## What the engine assumes

The engine is risk neutral and does no discounting, so the price and the payoffs must already be in the same discounted money. It values one survey at one price. It does not ask whether a cheaper, weaker survey would be worth more net, and it has no budget constraint.

## Exercise

For EKPAN at a survey cost of 8.0000, write the gross value, the net value, the acquire branch value and the no-information value. Then use seismicBayes, costEqualsValue and costAboveValue to say what changes and what stays fixed when only the price moves.
