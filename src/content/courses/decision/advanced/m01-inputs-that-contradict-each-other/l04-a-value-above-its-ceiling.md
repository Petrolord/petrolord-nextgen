# A value above its ceiling

The expected value of perfect information is a ceiling: no survey can be worth more than knowing the outcome in advance. Typed posteriors that claim more success than the stated chances allow give, unguarded, values of information above that ceiling, which is why the VOI Analyzer withholds them.

{{panel:ec-judgement-explorer}}

## Why EVPI is a ceiling

Perfect information picks the best action for each outcome. An imperfect signal can at best do the same, so information derived by Bayes from the stated prior satisfies 0 <= evii <= evpi. On EKPAN that reads 0 <= 24.8250 <= 52.0000. On the Analyzer's default study the published voiDefaultLottery gives evWithPerfect 78.0000 against emvPrior 15.0000, an EVPI of 63.0000, and the default survey's gross voi of 33.00 sits under the 63.00 card.

## What the unguarded arithmetic gives

These figures are the unguarded arithmetic from engine calls, with nothing checking the typed chances against the stated prior. The Analyzer withholds them.

| case | implied Success | unguarded gross voi | unguarded net voi | evpi card |
| --- | --- | --- | --- | --- |
| contradictingPosterior | 0.420000 | 75.00 | 65.00 | 63.00 |
| certainPosteriorsWithheld | 1.000000 | 245.00 | 235.00 | 63.00 |

## Two prospects in one subtraction

The value of information is EMV with information less EMV without. The without side uses the stated chances: 15.00 at a 30 percent success chance. The with side weights the typed posteriors by the typed indicator chances, and in contradictingPosterior those average to 0.420000. The subtraction sets a prospect succeeding 0.420000 of the time after the survey against one succeeding 0.300000 of the time before it. The difference holds the uplift of believing in a better prospect, which no survey delivers, and it pushes 75.00 past the ceiling.

In certainPosteriorsWithheld every reading says success is certain, an implied 1.000000. The with side values a well that never comes up dry while the stated chances say it is dry 70 percent of the time. The unguarded 245.00 is the price of that belief.

## Below the ceiling is not safe

Contradictions do not always overshoot. Unguarded, EKPAN typed with indicators at 56 and 44 percent gives 40.62, under its EVPI of 52.00 and far above the honest 19.84. indicatorChancesAboveHundred, with indicator chances summing to 110 percent, gives 33.00 unguarded, the very card the consistent defaults print. A test on the output catches only the loudest cases, so the Analyzer tests the inputs.

## What the Analyzer does

Percent entries that are not distributions are refused before anything is computed, with a message naming the sum, such as "Outcome chances given "Positive Seismic" sum to 130 percent, expected 100". Distributions whose implied prior misses the stated one by more than 0.005 keep EMV without information, 15.00 in both cases, and EVPI, 63.00, and withhold EMV with information, the value of information, the net value and the diagram.

## The mistake

The careful mistake is to clip: accept any value up to EVPI and cap anything above it. Clipping 75.00 to 63.00 still reports a number built from chances that cannot all be true, and it leaves 40.62 and 33.00 untouched because they already sit under their ceilings. The Analyzer never clips and never repairs; the only fix is to make the inputs agree.

## Exercise

For contradictingPosterior, state the implied success chance, the unguarded gross voi and the EVPI card, and explain in two sentences why that value is impossible. Then name one unguarded value that sits below its ceiling and is still wrong, and say what the Analyzer does with its inputs.
