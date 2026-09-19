# The crossover at the reference size

Two laws that start from one quotation have to agree somewhere, and they agree at the quotation. scaleComparison prints the point where they meet, and on which side of it each law gives the cheaper plant.

{{panel:refinery-screen-explorer}}

## The ratio and the two flags

For each capacity, scaleComparison prints a ratio, which is the modular cost over the stick-built cost, and two flags: whether the modular plant is cheaper, and whether the two laws are equal.

| capacity (bpd) | ratio | modular cheaper | the two laws equal |
| --- | --- | --- | --- |
| 1000 | 0.6170 | true | false |
| 2500 | 0.8123 | true | false |
| 5000 | 1.0000 | false | true |
| 10000 | 1.2311 | false | false |
| 20000 | 1.5157 | false | false |
| 30000 | 1.7118 | false | false |

The ratio is the comparison, printed by the engine so you do not have to make it. A ratio of 0.6170 at 1000 bpd means the modular cost is that fraction of the stick-built cost. A ratio of 1.7118 at 30000 bpd means the modular cost is that multiple of it.

## Reading the crossover

The ratio reads 1.0000 at 5000 bpd, and at that row the two laws equal flag reads true. That is the crossover, and it sits at the reference capacity. It sits there because both laws are anchored to the same quotation: at 5000 bpd the capacity ratio in the formula is 1, and both laws return 64000000.00.

On the rows below 5000 bpd, modular cheaper reads true. On the rows above it, modular cheaper reads false and the two laws equal flag reads false, so the stick-built law gives the lower figure. At 5000 bpd itself modular cheaper reads false as well, because neither is cheaper: they are equal.

## What the crossover measures

The crossover is a property of the screen's construction. Two curves drawn through the same point, with different exponents, cross at that point and nowhere else. Move the reference quotation to a different size and the crossover moves with it.

That is worth saying plainly because the table invites a stronger reading than it supports. It is tempting to read "modular is cheaper below 5000 bpd" as a finding about refineries. It is a finding about one quotation and two default exponents. If the quotation had been for a stick-built plant at one size and a modular plant at another, the screen would need two reference points, and the crossover would be wherever the two scaled curves happened to meet.

So the useful question for a real project is where your own reference points sit. A vendor quotation for a modular plant near the size you are screening is worth more than any exponent, because it moves the anchor to where you need it.

## Using the panel

Drag the capacity slider through 5000 bpd and watch the ratio and the flags change together. The panel marks the crossover on both curves at the reference size. Then change one exponent. The crossover stays at 5000 bpd, because the anchor has not moved; what changes is how far apart the curves are on either side of it.

## The mistake

Reading modular cheaper as false at 5000 bpd and concluding that stick-built wins there. The next column reads true. At the reference size the two laws give the same cost, and the flag that says neither is cheaper is the one to read.

## Exercise

Read the ratio and both flags at 2500, 5000 and 10000 bpd. Say, for each row, which law gives the lower cost or that neither does, and quote the flag that tells you. Then explain why the ratio at 5000 bpd must read 1.0000 whatever exponents are chosen.
