# Information that cannot change anything

A survey can move every posterior and still be worth exactly nothing. Information has value only when some reading of it changes the action taken, and until then its EVII is 0.

{{panel:ec-judgement-explorer}}

## A survey that moves beliefs

A symmetric survey on the EKPAN lottery reads success correctly on a success, and dry correctly on a dry hole, with the same accuracy. At the stated prior of 0.35:

| accuracy | posterior Success after reads success | posterior Success after reads dry | action after reads success | action after reads dry | evii |
| --- | --- | --- | --- | --- | --- |
| 0.550000 | 0.396907 | 0.305825 | Drill | Drill | 0.0000 |
| 0.600000 | 0.446809 | 0.264151 | Drill | Drill | 0.0000 |
| 0.650000 | 0.500000 | 0.224771 | Drill | Farm out | 0.7250 |
| 0.700000 | 0.556818 | 0.187500 | Drill | Farm out | 8.0500 |

At accuracy 0.600000 a "reads dry" result drops the success probability from 0.35 to 0.264151. That is a real change in belief, and the value is still 0.0000. The drill against farm-out switch sits at 0.228571, and 0.264151 is above it, so both readings lead to Drill. Weight Drill's value at each posterior by the chance of each reading and the result is Drill's value at the prior, 75.7500, the same number the survey was meant to improve.

The survey first changes an action at accuracy 0.645051, when a "reads dry" result can push the posterior below 0.228571. By 0.650000 it is worth 0.7250.

## Zero that prints as zero

At accuracy 0.550000 the engine returns an EVII of -1.42e-14. That is floating-point residue from subtracting two equal sums, and a residue below 1e-9 is reported as 0.0000. It is not a negative value of information: information derived by Bayes can never be worth less than 0.

## Three more ways to be worth nothing

Perfect information is worthless when the best action does not depend on the outcome. The published dominantAction lottery, Always paying 100.0000 / 50.0000 against Never paying 10.0000 / 5.0000, has emvPrior 65.0000, evWithPerfect 65.0000 and evpi 0.0000. The published certainOutcome lottery has nothing left to learn: emvPrior 260.0000, evWithPerfect 260.0000, evpi 0.0000.

A signal whose readings do not depend on the outcome moves nothing at all. The published uselessSignal reads "Heads" and "Tails" each with probability 0.500000, both leave the posterior at 0.300000 / 0.700000, and its evii is 0.0000.

## Nearly nothing

The published threeByThree survey has three readings and changes one action: after "Dim" it recommends the farm-out, worth 15.3333. Its evii is 1.2000 against an evpi of 24.0000, and at a cost of 12.0000 its netEvii is -10.8000. A survey that changes one action on its least likely reading is worth what that one change adds, and here 1.2000 is a tenth of the 12.0000 price.

## The mistake

The careful mistake is valuing a survey by how much it teaches. A geophysicist can show that the 0.600000 survey shifts the dry-case posterior from 0.35 to 0.264151, and a manager can agree it is informative, and both are right that beliefs moved. Neither has shown that a decision moved. Before pricing information, name the reading that would change the action, and the posterior at which it would.

## Exercise

For the symmetric EKPAN survey at accuracy 0.600000, write both posteriors, the action after each reading and the EVII, and explain why the value is 0.0000. Then state the accuracy at which the survey first changes an action, and its EVII at 0.650000.
