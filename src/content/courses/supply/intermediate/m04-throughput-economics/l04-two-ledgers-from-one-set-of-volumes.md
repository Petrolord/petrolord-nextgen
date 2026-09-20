# Two ledgers from one set of volumes

One call to `throughputEconomics` keeps two ledgers. The money ledger turns throughput into revenue and margin. The carbon ledger turns the period's loss into a weight and the weight into emissions. They share their volumes and nothing else. This lesson reads the three IBAFO cases together to show each ledger failing or succeeding on its own inputs.

{{panel:supply-depot-explorer}}

## The three cases

IBAFO's invented period: throughput 2640.000 m3, fee 7.80 USD/m3, variable cost 2.35 USD/m3, fixed cost 9400.00 USD, loss 4.600 m3, density 745.2 kg/m3, and the synthetic factor of 850 kg CO2e a tonne. Money is in US dollars.

| case | revenue USD | margin USD | margin USD/m3 | loss tonnes | emissions kg CO2e | kg CO2e per tonne of throughput |
| --- | --- | --- | --- | --- | --- | --- |
| factor and density supplied | 20592.00 | 4988.00 | 1.89 | 3.4279 | 2913.7320 | 1.481061 |
| no emission factor | 20592.00 | 4988.00 | 1.89 | 3.4279 | none | none |
| no density | 20592.00 | 4988.00 | 1.89 | none | none | none |

## What the table shows

The money columns are identical in all three rows. Revenue, margin and margin per m3 need the throughput, the fee and the costs, and none of them needs a density or a factor.

The carbon columns fail in a chain. Without a factor, the loss still has a weight, 3.4279 tonnes, and only the emissions and the intensity read none. Without a density, the loss has no weight, so everything after it reads none as well. Each none sits exactly at the first link that has no input and at every link after it. Nothing before the gap is lost, and nothing after it is guessed.

This is the pattern the whole course is built on. A chain of measured inputs is walked in order, and the engine names the link nobody measured.

## One set of volumes

The two ledgers read different volumes. The money ledger reads the throughput, the volume that passed and was charged for. The carbon ledger reads the loss, the volume that went missing. Both are the depot's own figures for the same period.

That shared period lets a manager set the margin beside the loss and its emissions for the same days. The intensity row does this inside the carbon ledger, spreading emissions over throughput. The engine prints no figure that combines the two ledgers, such as a cost of carbon, and this course invents none.

## Reading a report built this way

When a depot report carries both ledgers, check three things.

First, that the money and the carbon figures are for the same period and the same throughput. A margin for one month beside emissions for another answers no question.

Second, that every carbon figure names its density and its factor, and where each came from. In this course the factor is synthetic and the density is the course's own; a real report cites both.

Third, that a none in the carbon columns is reported as a none, and that any zero the engine assumed is reported with its name. The money side takes a blank cost or loss as zero and names it in assumedZero; a blank fixed cost reads margin 14388.00 USD with assumedZero: fixed cost. A zero quoted without that name turns a missing measurement into a claim.

## What this module leaves out

The margin is a period's margin and never a valuation. This module prices no bay, no tank and no truck; module five reads the truck lane's own cost per litre delivered.

## Exercise

Read the three IBAFO rows. Say which columns are the same in all three and why. Then say, row by row, the first column that reads none and the missing input that causes it, and explain why the loss tonnes print in the second row and not in the third.
