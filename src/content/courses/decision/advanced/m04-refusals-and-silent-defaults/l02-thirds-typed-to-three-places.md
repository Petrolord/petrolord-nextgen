# Thirds typed to three places

Three equally likely outcomes cannot be typed exactly as decimals, and the rollback engine does not round a sum up for you or rescale the probabilities to fit. How many places you type decides whether the chance node rolls back, and at what value.

{{panel:ec-judgement-explorer}}

## The same node six ways

A chance node named "Three equal outcomes" pays 30, 60 and 90. Each branch is given the same typed third:

| each branch typed as | sum | result |
| --- | --- | --- |
| 0.3333333333 | 1.000000 | accepted, emv 60.0000 |
| 0.3333333 | 1.000000 | accepted, emv 60.0000 |
| 0.333333 | 0.999999 | accepted, emv 59.9999 |
| 0.33333 | 0.999990 | refused |
| 0.3333 | 0.999900 | refused |
| 0.333 | 0.999000 | refused |

The rule is a tolerance on the sum: a chance node passes when |sum - 1| is at most 1e-6 plus a 1e-12 allowance for binary representation, and the boundary is inclusive. Six places and more land inside it. Five places and fewer land outside, and the message prints the sum to six decimals, for three places `Chance branch probabilities sum to 0.999000, expected 1 (at node "Three equal outcomes")`.

## Six places, on the line

The row that repays attention is 0.333333. Written in decimal, 0.999999 sits exactly the tolerance away from 1. In binary, three copies of 0.333333 land a hair further from 1, because 0.333333 has no exact binary image. The 1e-12 allowance absorbs that residue, so a sum exactly 1e-6 short in its typed decimals is accepted. The implied-priors check in the information engine carries the same allowance on its half percent boundary.

Accepted is not the same as rounded up. The engine uses the probabilities as typed, so the node is worth 0.333333 x (30 + 60 + 90), which is 59.9999, a little under the 60.0000 that seven places give. The published thirdsTypedToSixPlaces case, paying 90, 30 and -15, returns 34.999965, matching its golden; thirdsProbabilities, typed at full precision, returns 35.0000.

## What the tolerance is for

The tolerance lets honest rounding pass and stops genuine mistakes. A sum of 0.999000 would quietly drop a slice of expected value, so the engine returns a message.

## What is accepted without a word

Probabilities have silent cases too. A branch probability typed as the text "0.5" on a two-branch node paying 10 and 30 is read as a number and rolls back to 20.0000. A probability left empty on one branch, with 1 on the other, is read as 0 and the node returns 30.0000. In the Decision Tree Builder, clearing a probability box stores 0, so a cleared box usually shows up as a sum that is not 1 and is refused. It passes only when the other branches already sum to 1, and then the cleared branch simply drops out of the weighting.

## The mistake

The careful mistake is repairing a refused node by nudging one branch until the sum reaches 1. That changes the chances unequally, so the tree no longer says the three outcomes are equally likely, and the EMV moves off 60.0000 by whatever the nudge put on the branch paying 90 or 30. Type every third to six or more places, and to seven when the value should read 60.0000 exactly.

## Exercise

For thirds typed to three, six and seven places, write the sum the engine reports, whether the node rolls back and, where it does, its value. Then explain why a probability box cleared in the Builder can pass the check without anyone noticing, and what the node then weights.
