# The label that is not the sweep

The capex chart's axis promises a multiplier of 0.8 to 1.5. The loop behind it stops at 1.4, and the verdict printed underneath prices a 40 percent overrun while the label promises 50.

{{panel:ec-comparison-explorer}}

## Why the last point is missing

The sweep is a for loop from a multiplier of 0.8 to 1.5 in steps of 0.1, tested with a less-than-or-equal against 1.5. Adding 0.1 repeatedly to a binary floating point number does not land on 1.5: the accumulated multiplier reaches 1.5000000000000004, the test fails, and the loop exits. The engine returns seven labels, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3 and 1.4, and a reader takes the last for the end of a range advertised as reaching 1.5.

## What the missing point is worth

Call the engine directly at a multiplier of 1.5 and the eighth point exists. On the default project:

| regime | x1.4 | x1.5, called directly | loss over the SEVEN swept points (derived) | loss over EIGHT points (derived) |
| --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | 79.1811 | 58.5739 | 97.7613 | 118.3685 |
| Ghana - Deepwater | 107.3627 | 85.7833 | 88.2631 | 109.8425 |
| Brazil - Concession | 260.5129 | 228.3016 | 108.6653 | 140.8766 |
| USA - Gulf of Mexico | 228.4023 | 189.4674 | 228.7953 | 267.7301 |
| Angola - Deepwater PSC | 147.4539 | 124.9212 | 84.8591 | 107.3918 |
| Generic Royalty/Tax | 257.3831 | 221.3360 | 208.0310 | 244.0782 |

The named winners survive here: Angola - Deepwater PSC gives up the least on both counts and USA - Gulf of Mexico the most. What does not survive is the quantity they are named with. Angola's loss is quoted as 84.8591 when the labelled range would give 107.3918, and the USA figure is 228.7953 against 267.7301. Every resilience number on that chart is understated.

## The verdict is not false

The resilience sentence says what it measured: contractor NPV given up between the first and last point the sweep actually produced. Those points are a 20 percent underspend and a 40 percent overrun. The sentence is answering a narrower question than the chart's label asks, which is harder to catch than a wrong number, because nothing in the sentence is wrong.

The golden pins both readings, publishing the seven engine points as `engineCapexPoints` and the seven engine losses as `capexLossesAsEngine` beside the oracle's eight point sweep, so a silent change to either is caught.

## A different range, published

The seven published capex cases do not use the sweep's range at all. They run the PIA template at multipliers of 0.7 to 1.3 and pin the whole result, and the NPV falls from 240.3937 at 0.7 to 98.2520 at 1.3 while payback slips from year 3 to year 5 and the payout year from 2 to 4. Two ranges live in one engine, and neither is the one on the axis.

## What the sweep refuses

No input changes the swept range, the step, or the number of points. A reader who wants a 50 percent overrun has to call the ledger function directly at that multiplier.

## The mistake

The careful mistake is quoting resilience across the 0.8 to 1.5 range, because that is what the chart says. The right sentence names the seven points and the 40 percent overrun, and if the question was about 50, says the sweep did not answer it.

## Exercise

State the seven multipliers the engine returns and the value the accumulator reaches on the eighth attempt. Then, for USA - Gulf of Mexico, give the loss over the swept points and the loss the labelled range would have given.
