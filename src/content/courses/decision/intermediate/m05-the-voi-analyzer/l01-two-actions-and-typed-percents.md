# Two actions and typed percents

The VOI Analyzer values one survey ahead of one decision. It takes every chance as a typed percent, offers exactly two actions, and refuses percents that do not make a distribution before it computes anything.

{{panel:ec-information-explorer}}

## What it takes

The Analyzer's default study, published as suiteDefaults:

| input | typed |
| --- | --- |
| decision | "Drill Exploration Well", cost 40.0000 |
| outcome | Success Case, 30 percent, paying 300.0000 |
| outcome | Dry Hole, 70 percent, paying -50.0000 |
| survey | 3D Seismic Survey, cost 10.0000 |
| indicator | Positive Seismic, 40 percent; outcome chances 60 / 40 percent |
| indicator | Negative Seismic, 60 percent; outcome chances 10 / 90 percent |

A payoff is the money an outcome delivers before the decision cost; the cost is typed once, on the decision, and charged once.

## Two actions

The Analyzer offers the named decision at its cost, and "Do Not", with every payoff 0. There is no third branch. By hand at the stated chances:

0.300000 x 300.0000 + 0.700000 x -50.0000, less the decision cost 40.0000, = 15.00

That beats "Do Not" at 0, so the Analyzer drills and reports an EMV without information of 15.00. Typed with the EKPAN lottery, success paying 420.0000 and a dry hole -25.0000 at a drill cost of 55.0000, it reports 75.75 and an EVPI of 52.00, matching the lottery's emvPrior of 75.7500 and EVPI of 52.0000.

## Percents that must be distributions

The repaired Analyzer checks each set of typed percents before it computes a single card, and names the sum it found:

| typed input | engine message |
| --- | --- |
| outcome chances short | "Outcome chances sum to 90 percent, expected 100" |
| indicator chances over | "Indicator chances sum to 110 percent, expected 100" |
| a posterior row over | "Outcome chances given "Positive Seismic" sum to 130 percent, expected 100" |
| a missing outcome chance | "Outcome chances given "Positive Seismic" sum to 60 percent, expected 100" |
| one chance out of range | "P(Success Case \| Positive Seismic) needs a chance between 0 and 100 percent" |
| no indicators | "No indicators given" |

The EKPAN lottery typed with No bright spot at 64 percent beside Bright spot at 46.000000 percent is refused with "Indicator chances sum to 110 percent, expected 100".

These refusals are new. Before the repair the Analyzer printed a gross value of information of 69.00 beside an EVPI of 63.00 for the posterior row summing to 130 percent: a survey worth more than knowing the answer, from inputs that were not chances at all.

## What it refuses to do

The Analyzer carries one decision, one survey and two actions. It is risk neutral, it does not discount, and it has no sequence: nothing can be learned after the survey and before the decision except the one indicator. A decision with a farm-out, a partner option or an appraisal step has to be squeezed into "act or do not", and whatever is squeezed out is missing from every number the Analyzer returns.

## The mistake

The careful mistake is typing payoffs that are already net of the decision cost. On the EKPAN lottery a success leaves 365.0000 after its 55.0000 drill cost; typing 365.0000 as the payoff and 55.0000 as the cost charges the drill twice, and the Analyzer has no way to know. The check is the EMV without information: if it does not match a rollback done by hand at the stated chances, the typing is wrong before any survey enters. The second mistake is reading a refusal as a glitch and nudging one box until the message goes away; the refusal is telling you the numbers typed are not chances.

## Exercise

Roll back the default study at its stated chances and confirm the 15.00. Then name the two actions the Analyzer offers, state the message for indicator chances summing to 110 percent, and explain what the Analyzer printed before the repair for a posterior row summing to 130 percent and why that number was impossible.
