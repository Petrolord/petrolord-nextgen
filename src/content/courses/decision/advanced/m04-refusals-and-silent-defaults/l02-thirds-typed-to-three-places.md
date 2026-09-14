# Thirds typed to three places

Three equally likely outcomes cannot be typed exactly as decimals, and the rollback engine does not round a sum up for you. How many places you type decides whether the chance node rolls back or is refused.

{{panel:ec-judgement-explorer}}

## The same node six ways

A chance node named "Three equal outcomes" pays 30, 60 and 90. Each branch is given the same typed third:

| each branch typed as | sum | result |
| --- | --- | --- |
| 0.3333333333 | 1.000000 | accepted, emv 60.0000 |
| 0.3333333 | 1.000000 | accepted, emv 60.0000 |
| 0.333333 | 0.999999 | refused |
| 0.33333 | 0.999990 | refused |
| 0.3333 | 0.999900 | refused |
| 0.333 | 0.999000 | refused |

The rule is a tolerance of 1e-6 on the sum. Seven places land inside it and the node rolls back to 60.0000, the plain average of 30, 60 and 90. Six places and fewer land outside, and the message prints the sum to six decimals, for three places `Chance branch probabilities sum to 0.999000, expected 1 (at node "Three equal outcomes")`.

## Six places, on the line

The row that surprises people is 0.333333. Written in decimal, 0.999999 sits exactly the tolerance away from 1, and it is still refused. Three copies of 0.333333 added in binary arithmetic land a hair further from 1 than the decimal suggests, and the chance node check compares against 1e-6 with no allowance for representation error. The implied-priors check in the information engine carries a 1e-12 allowance for exactly this kind of residue; the rollback's sum check does not. Treat six places as refused and type seven.

## What the tolerance is for

The tolerance exists so that honest rounding of long decimals passes and genuine mistakes do not. The published thirdsProbabilities case rolls back to 35.0000, matching its golden of 35.0000. A sum of 0.999000 would quietly drop a slice of expected value, so the engine returns a message instead.

## What is accepted without a word

Probabilities have silent cases too. A branch probability typed as the text "0.5" on a two-branch node paying 10 and 30 is read as a number and rolls back to 20.0000. A probability left empty on one branch, with 1 on the other, is read as 0 and the node returns 30.0000. In the Decision Tree Builder, clearing a probability box stores 0, so a cleared box usually shows up as a sum that is not 1 and is refused. It passes only when the other branches already sum to 1, and then the cleared branch simply vanishes from the weighting.

## The mistake

The careful mistake is repairing a refused node by nudging one branch until the sum reaches 1. That changes the chances unequally, so the tree no longer says the three outcomes are equally likely, and the EMV moves off 60.0000 by whatever the nudge put on the branch paying 90 or 30. Type every third to seven places.

## Exercise

For thirds typed to three, six and seven places, write the sum the engine reports and whether the node rolls back. Then explain why a probability box cleared in the Builder can pass the check without anyone noticing, and what the node then weights.
