# Four cards, five numbers and a verdict

The Analyzer's engine returns five numbers, its results panel shows four of them as cards, and a Decision Guidance sentence turns the sign of the net value into a verdict. Knowing which number sits where decides whether a comparison is net against net or net against gross.

{{panel:ec-information-explorer}}

## The five numbers

On the default study:

| engine number | value | where it appears |
| --- | --- | --- |
| emvWithoutInfo | 15.00 | card "EMV without Information" |
| emvWithInfo | 38.00 | card "EMV with Information" |
| voi | 33.00 | the Decision Guidance sentence and the CSV export only |
| netVoi | 23.00 | card "Net Value of Info (Net VOI)" |
| evpi | 63.00 | card "Value of Perfect Info (EVPI)" |

Each card is the engine's two-decimal string.

## How they relate

EMV with Information is already net of the survey cost. At a cost of 0.0000 it reads 48.00, at 10.0000 it reads 38.00, at 20.0000 it reads 28.00. So:

- net VOI = 38.00 less 15.00 = 23.00
- gross VOI = 23.00 plus the survey cost 10.0000 = 33.00, which is also 48.00 less 15.00
- EVPI: 0.300000 x 260.0000 = 78.0000 with perfect information, less 15.0000, gives the 63.0000 the published voiDefaultLottery case records

The only gross value of information on screen is inside the sentence.

## The verdict

The sentence chooses its ending by the sign of net VOI:

| survey cost | netVoi card | verdict |
| --- | --- | --- |
| 10.0000 | 23.00 | "Since this is positive, acquiring the information is financially advantageous." |
| 50.0000 | -17.00 | "Since this is negative, the information costs more than the value it adds, so acquiring it is not justified on EMV grounds." |
| 33.0000 | 0.00 | "The information exactly pays for itself, so the decision is value-neutral on EMV grounds." |

At a cost of 33.0000 the drawn tree's root still reads "Acquire 3D Seismic Survey": the two root branches tie and the first branch listed is kept. At 40.0000 the card reads -7.00 and the root reads "No further information".

## When values are withheld

If the typed indicators contradict the stated outcome chances, the repaired Analyzer keeps the two cards that depend only on the stated chances, EMV without Information and EVPI, and withholds EMV with Information, Net VOI, the gross value and the diagram. On IRRI, both indicators typed 20 / 80 percent, it reports 15.00 and 63.00 and withholds the rest. Before the repair it printed a gross value of -15.00 and a net value of -25.00 there, and information derived by Bayes can never be worth less than 0.

## The mistake

The careful mistake is setting the Net VOI card beside the EVPI card. 23.00 against 63.00 compares a value after cost with a ceiling before cost; the fair comparison is gross against gross, 33.00 against 63.00, and the 33.00 is not on a card. The second mistake is reading EMV with Information as the tree engine's evWithInfo. On the EKPAN lottery the tree engine returns 100.5750 before any survey cost, while the Analyzer's card reads 87.59 after the cost of 8.0000; adding 8.0000 back gives 95.5875, still short of 100.5750 because the Analyzer has dropped the farm-out. The third is subtracting the survey cost from 38.00 a second time.

## What it refuses

The card titled EMV with Information does not say that it is net of the survey cost, and no card names the gross value. The panel carries one survey, one decision and two actions, so every card inherits all three limits, and a two-decimal card can hide a difference its verdict still acts on.

## Exercise

From the default study's cards, recover the gross value of information and say where on screen it appears. Then state the verdict at survey costs of 50.0000 and 33.0000, and explain why comparing 23.00 with 63.00 is unfair.
