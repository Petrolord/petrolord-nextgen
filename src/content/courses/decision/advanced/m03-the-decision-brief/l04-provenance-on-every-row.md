# Provenance on every row

Every section of a Decision Studio brief carries a line saying where its numbers came from. That line tells a reader which saved object to open, and it does not tell them whether the object is current or correct.

{{panel:ec-judgement-explorer}}

## Where each section comes from

| section | source |
| --- | --- |
| probabilistic economics | a saved EPE Monte Carlo run |
| decision analysis | a saved tree, re-rolled by this engine at brief time |
| capital allocation | a saved portfolio |

The economics section labels its rows "NPV P90 (low)", "NPV P50" and "NPV P10 (high)", and its provenance says "Petroleum convention: P90 is the low case." Those labels belong to NPV only. EKPAN's success chance of 0.350000 on a tree is a plain number.

## Engine returns and derived rows

In the decision section, Optimal EMV and Recommended first move are engine returns from rolling the saved tree back. Next best alternative and Decision advantage are arithmetic on them. On OKRIKA the rows read 87.0000 and "Appraise" from the engine, then 48.0000 and 39.0000 derived. Because the tree is rolled back at brief time, those rows describe the saved tree as it stands when the brief is built.

## A copy inside the tree

A payoff linked to a Monte Carlo run is different. The Decision Tree Builder stores a copy of the run's NPV mean, P90 and P10 when the link is made, and nothing re-reads the run. EKPAN's success payoff linked to a summary with a mean of 420 rolls back to 105.0000; if that run is later revalued, the tree keeps using the old copy until someone links the run again. Re-rolling at brief time recomputes the tree without refreshing what the tree copied.

So a brief whose economics section comes from a later run than the one the tree copied can show an NPV summary the tree never saw, beside an Optimal EMV built on the older mean. Both provenance lines are true, and the page disagrees with itself.

## What provenance cannot certify

A provenance line names a source. It does not check that the probabilities are realistic, that the payoffs are already discounted, that a cleared cost box was meant to be zero, or that a drill branch worth 105.0000 is acceptable when it loses money with probability 0.500000.

## The mistake

The careful mistake is to treat the economics section's NPV P50 as the payoff the tree used. The tree used the mean, and on EKPAN's linked summary the NPV P50 is 390.0000 against a mean of 420.0000. The second is to trust a brief because every section has a source: the source is where checking starts.

## Exercise

Name the source of each of the brief's three sections. Then explain how a brief can show an NPV summary and an Optimal EMV built from different runs, and say what must be done in the Decision Tree Builder to bring them back into line.
