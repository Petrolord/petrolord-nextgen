# Exceedance probability

{{panel:prms-classification-calculator}}

The labels P90, P50 and P10 are probabilities, and they are probabilities of a particular kind. Each says how likely it is that the quantity finally recovered will reach or beat the estimate. That is an exceedance probability: the chance of meeting or exceeding a figure. Once the definition is clear, the rest of this module follows from it.

## The sentence the engine prints

The course's code has one shared convention for percentile labels, the module lib/conventions/percentile.js, and the engine returns its sentence with every category set:

> P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.

The calculator prints it as a note under the tables of the view "The categories of a set of estimates".

## Three labels, three probabilities

| case | outcome label | the probability of meeting or exceeding it, when probabilistic |
| --- | --- | --- |
| low | P90 | at least 90 percent |
| best | P50 | at least 50 percent |
| high | P10 | at least 10 percent |

"At least" matters. The estimate is a floor the outcome should reach with that probability or more; it is not a promise that the outcome lands near it.

## An example in words

Picture a hundred equally likely outcomes for the Ekene Main Reserves, sorted from smallest to largest. The P90 is a figure that at least ninety of them meet or exceed: it sits near the bottom of the list. The P10 is a figure that only ten or more of them reach: it sits near the top. The P50 sits in the middle, with half above. The engine's figures for the case are a 1P of 8.890000, a 2P of 16.650000 and a 3P of 24.990000 MMbbl, labelled P90, P50 and P10 in that order.

## A US rule that says the same

The US securities rules use the same idea for proved reserves estimated by probabilistic methods. The public text reads:

> "If probabilistic methods are used, there should be at least a 90% probability that the quantities actually recovered will equal or exceed the estimate." (17 CFR 210.4-10(a)(24))

That is a rule for US registrants, quoted from the eCFR version current at 2026-09-01. This course quotes it because it states the exceedance idea in public words. The framework's own treatment is PRMS 2.2.1.2, which the course teaches in its own words.

## Why exceedance and not "below"

Many tables in statistics count from the bottom: the 90th percentile is the figure that ninety percent of outcomes fall below, which is a high figure. Petroleum reporting counts the other way, from the top, because the question a lender or a regulator asks is how much is at least there. The next lesson follows that reversal through.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The categories of a set of estimates", and start from "Ekene Main Reserves, stated cumulatively". Find the exceedance sentence in the note below the tables, and read the probability label beside each row of the cumulative table. Then switch the start selector to "Ekene North, stated cumulatively" and "Prospective Resources" in turn, and check that the same three probability labels sit beside the low, best and high rows of each class.
