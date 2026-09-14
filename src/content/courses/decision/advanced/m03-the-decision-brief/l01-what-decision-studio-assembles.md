# What Decision Studio assembles

Decision Studio's brief puts up to three sections on one page, each carrying a provenance line. Its decision section re-rolls a saved tree with the same engine as the Decision Tree Builder and prints four rows, two of them engine returns and two of them arithmetic on those returns.

{{panel:ec-judgement-explorer}}

## Three sections

Probabilistic economics comes from a saved EPE Monte Carlo run. Decision analysis comes from a saved tree, rolled back again by this engine at the moment the brief is built. Capital allocation comes from a saved portfolio. A brief can hold any of the three; each section says where its numbers came from.

## The decision rows

| row | what it is |
| --- | --- |
| Optimal EMV | the root emv, an engine return |
| Recommended first move | the label of the root's best branch, an engine return |
| Next best alternative | the largest other root branch value, derived |
| Decision advantage | Optimal EMV less Next best alternative, derived |

Three trees, briefed:

| tree | Optimal EMV | Recommended first move | Next best alternative | Decision advantage |
| --- | --- | --- | --- | --- |
| EKPAN | 105.0000 | Drill | 37.7500 | 67.2500 |
| OKRIKA | 87.0000 | Appraise | 48.0000 | 39.0000 |
| EKPAN information tree | 92.5750 | Acquire CSEM survey | 75.7500 | 16.8250 |

Each Optimal EMV is a full rollback. EKPAN's 105.0000 is the drill chance node, 0.350000 x 420.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000 = 160.0000, less the drill cost 55.0000. The brief does not store the Builder's answer; it recomputes it from the saved tree, so a brief and a Builder session on the same saved tree agree on the numbers.

## A root that is a chance node

The published chanceRootWithBranchCosts tree starts with a chance node: "calm" at probability 0.600000 with a cost of 2.0000 and a child worth 19.0000, and "storm" at 0.400000 with a cost of 8.0000 and a child worth -25.0000. The brief prints Optimal EMV -3.0000, Recommended first move "Single path", and no Next best alternative or Decision advantage row at all. The Decision Tree Builder shows the same tree with "Chance root" on its first-move card and N/A on the other two.

Both labels say the same thing: there is no choice at the root, so there is nothing to recommend and nothing to compare against. "Single path" is not a path the engine picked. A single-branch decision is similar: the published singleBranchDecision prints Optimal EMV 7.0000, first move "only", and again no next best or advantage row.

## What the brief does not do

The brief adds no judgement to the tree. The decision section is risk neutral, applies no discounting, keeps the first branch listed on a tie, and inherits every silent default the saved tree carries. Its provenance line says which tree was rolled back, not whether that tree's probabilities or payoffs are right.

## The mistake

The careful mistake on a chance root is to read -3.0000 and "Single path" as advice to take the path, or to hunt for the missing next best row as if the brief had failed. The second is arithmetic done on a chance root by hand: the -3.0000 already charges each branch cost on its own branch before weighting, and subtracting the costs once after weighting instead gives a wrong -8.6000.

## Exercise

For the EKPAN tree, list the four decision rows and say which two are engine returns. Then describe what the brief prints for chanceRootWithBranchCosts, what the Builder prints for the same tree, and why neither shows a next best alternative.
