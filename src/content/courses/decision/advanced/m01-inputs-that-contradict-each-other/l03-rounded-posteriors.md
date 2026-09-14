# Rounded posteriors

Survey posteriors usually travel as rounded percents. Typed back into the VOI Analyzer, the rounding moves the value of information, and a little more rounding in the wrong direction trips the consistency check.

{{panel:ec-judgement-explorer}}

## EKPAN typed nine ways

EKPAN's survey has exact posteriors of 0.646739 after a bright spot and 0.097222 after none, with a bright spot 0.460000 likely. Here it is typed at full precision, then rounded.

| Bright spot percent | Success given Bright spot percent | Success given No bright spot percent | implied Success | delta | consistent | gross voi | netVoi card |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 46.000000 | 64.673913 | 9.722222 | 0.350000 | 5.551115e-17 | true | 19.84 | 11.84 |
| 46.000000 | 64.700000 | 9.700000 | 0.350000 | 0.000000e+0 | true | 19.89 | 11.89 |
| 46.000000 | 65.000000 | 10.000000 | 0.353000 | 3.000000e-3 | true | 20.51 | 12.51 |
| 46.000000 | 65.000000 | 9.000000 | 0.347600 | -2.400000e-3 | true | 20.51 | 12.51 |
| 46.000000 | 64.000000 | 10.000000 | 0.348400 | -1.600000e-3 | true | 18.46 | 10.46 |
| 45.000000 | 65.000000 | 10.000000 | 0.347500 | -2.500000e-3 | true | 18.41 | 10.41 |
| 46.000000 | 65.000000 | 8.000000 | 0.342200 | -7.800000e-3 | false | withheld | withheld |
| 46.000000 | 66.000000 | 10.000000 | 0.357600 | 7.600000e-3 | false | withheld | withheld |
| 47.000000 | 65.000000 | 10.000000 | 0.358500 | 8.500000e-3 | false | withheld | withheld |

## Accepted, and still different

Six rows pass, and the gross voi runs from 18.41 to 20.51 against 19.84 at full precision. The survey is the same survey in every row. Rounding to one decimal gives an implied chance of exactly 0.350000, a delta of 0.000000e+0, and still a card of 19.89 instead of 19.84. A perfect consistency result says the entries agree with the stated chance; it says nothing about whether they match the survey.

## A posterior that does not reach the value

The rows typed 65.000000 / 10.000000 and 65.000000 / 9.000000 print the same 20.51. After No bright spot the Analyzer's drill action loses money at either chance, so the best action there is Do Not, which pays 0 at any success chance. The posterior after No bright spot is multiplied into a branch worth nothing, and the card cannot see it.

The check can. Typed at 8.000000 percent, the same unseen posterior drags the implied chance to 0.342200, a delta of -7.800000e-3, and the Analyzer withholds everything but EMV without information 75.75 and EVPI 52.00. A number that never touches the value can still break the agreement every value depends on.

## The most sensitive entry

The indicator chance weights both posteriors, so it moves the implied prior fastest. With the posteriors at 65.000000 and 10.000000, a bright spot typed at 45.000000 percent passes at 0.347500 and prints 18.41; typed at 47.000000 percent it fails at 0.358500. Rounding the bright spot posterior up to 66.000000 fails too, at 0.357600. Entries rounded in the same direction add their errors: 65.000000 and 10.000000 both round upward and together leave a delta of 3.000000e-3, most of the allowance, before the indicator chance is touched.

## The mistake

The careful mistake is to round every entry to a tidy whole percent, see consistent true, and quote the card as the survey's value. The accepted rows show a pass is not precision: a report quoting 20.51 has overvalued the survey by rounding alone. The withheld rows show the Analyzer does not repair: it will not pull 66.000000 back toward 64.673913. Type the posteriors at full precision, or give the likelihoods to the Decision Tree Builder, which derives posteriors that cannot disagree.

## Exercise

For the rows typed 65.000000 / 10.000000 and 65.000000 / 8.000000, state the implied success chance, the delta and what the Analyzer shows. Then explain why 65.000000 / 9.000000 prints the same gross voi as 65.000000 / 10.000000, and why the check still reads the posterior after No bright spot.
