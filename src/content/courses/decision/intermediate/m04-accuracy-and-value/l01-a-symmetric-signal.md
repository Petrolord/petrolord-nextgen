# A symmetric signal

A symmetric survey is right with the same probability whatever the truth turns out to be. One number, its accuracy, then fixes both likelihood columns, and Bayes turns it into a chance for each reading and a posterior after it.

{{panel:ec-information-explorer}}

## One number for two columns

On the EKPAN lottery the outcomes are Success at a prior of 0.350000 and Dry hole at 0.650000. A symmetric survey of accuracy a says "reads success" with probability a when the well would succeed, and "reads dry" with probability a when it would be dry. Each outcome's column still sums to 1, because the survey misreads a success with probability 1 less a, and a dry hole with the same probability.

The CSEM survey quoted on the EKPAN lottery is not symmetric: it shows a bright spot with likelihood 0.850000 over a success and 0.250000 over a dry hole, so it is right about a dry hole with probability 0.750000. The symmetric survey is a teaching device, one dial for the quality of the tool.

## The chance of each reading

A success reading can arrive two ways, from a success read correctly or from a dry hole misread:

chance of reads success = 0.350000 x a + 0.650000 x (1 less a)

At accuracy 0.800000 that is 0.350000 x 0.800000 + 0.650000 x 0.200000 = 0.410000. A success reading turns up more often than success itself, 0.410000 against 0.350000, because dry holes are common and 0.200000 of them misread.

## Posteriors after each reading

Each posterior is a joint probability over the chance of its reading. After a success reading at 0.800000, the success posterior is 0.350000 x 0.800000 / 0.410000 = 0.682927. After a dry reading it is 0.350000 x 0.200000 divided by the chance of reading dry, 1 less 0.410000, which gives 0.118644.

| accuracy | pSignal reads success | posterior Success after reads success | posterior Success after reads dry |
| --- | --- | --- | --- |
| 0.500000 | 0.500000 | 0.350000 | 0.350000 |
| 0.600000 | 0.470000 | 0.446809 | 0.264151 |
| 0.700000 | 0.440000 | 0.556818 | 0.187500 |
| 0.800000 | 0.410000 | 0.682927 | 0.118644 |
| 0.900000 | 0.380000 | 0.828947 | 0.056452 |
| 1.000000 | 0.350000 | 1.000000 | 0.000000 |

As accuracy climbs from 0.500000 to 1.000000, the chance of a success reading falls to 0.350000 and the posteriors spread from 0.350000 each to 1.000000 and 0.000000. At 0.500000 the survey is a coin; at 1.000000 the reading is the outcome.

## The average never moves

The posteriors, weighted by the chances of their readings, return the prior: at 0.800000, 0.410000 x 0.682927 + (1 less 0.410000) x 0.118644 gives back 0.350000. A survey moves belief up on one reading and down on the other, never on average, which makes this the quickest check on a posterior worked by hand.

## The mistake

The careful mistake is reading accuracy as a posterior. A survey of accuracy 0.800000 that reads success makes success 0.682927 likely, because the prior of 0.350000 still weighs in. The second mistake is weighting the values after each reading by the prior: success readings arrive 0.410000 of the time at this accuracy.

## What it refuses

The engine takes likelihood columns; "accuracy" is only shorthand for one pair of them. A column that does not sum to 1 is refused: "Likelihoods P(signal | "Success") sum to 0.900000, expected 1".

## Exercise

At accuracy 0.900000, write the chance of a success reading and both success posteriors by hand, and check them against the rows. Then weight the two posteriors by the chances of their readings and show that the result is the prior, 0.350000.
