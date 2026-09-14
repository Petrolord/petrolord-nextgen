# A KPI rounded before the verdict

The VOI Analyzer's cards are two-decimal strings, and its verdict sentence reads the unrounded net value of information. Near zero the card and the sentence can disagree, and both are doing what the app as published does.

{{panel:ec-judgement-explorer}}

## Either side of the gross value

The Analyzer's default study has a gross voi of 33.00. Sweep the survey cost across it:

| survey cost | netVoi card | verdict sentence |
| --- | --- | --- |
| 32.990 | 0.01 | Since this is positive, acquiring the information is financially advantageous. |
| 32.996 | 0.00 | Since this is positive, acquiring the information is financially advantageous. |
| 33.000 | 0.00 | The information exactly pays for itself, so the decision is value-neutral on EMV grounds. |
| 33.004 | -0.00 | Since this is negative, the information costs more than the value it adds, so acquiring it is not justified on EMV grounds. |
| 33.010 | -0.01 | Since this is negative, the information costs more than the value it adds, so acquiring it is not justified on EMV grounds. |

At 32.996 the card reads 0.00 and the sentence says positive. At 33.004 the card reads -0.00, a negative zero, and the sentence says negative. Only at a cost of exactly 33.000 do the card and the sentence both say neutral.

## Why they disagree

The card is the net value passed through two-decimal rounding. At 32.996 the unrounded net value is 33 less 32.996, a small positive amount, which rounds to 0.00. The verdict tests the sign of the same small amount before any rounding, finds it above zero, and writes positive. At 33.004 the unrounded amount is small and negative, the rounding keeps its sign and prints -0.00, and the verdict writes negative. They answer at different precisions.

## Which number to believe

Believe neither as a decision. Survey costs of 32.996 and 33.004 are indistinguishable in any real tender, and a verdict that flips between them is reporting the sign of a difference far smaller than any cost estimate can resolve. The cost at which information becomes neutral is the gross value, 33.00 here and 24.8250 on EKPAN's full lottery. Near that price the right report is that the survey is priced at its value, with the margin written out, and the choice between buying and not buying rests on something the EMV does not measure.

## A card is a string

The five KPIs come back from the engine as two-decimal strings. A spreadsheet or script that reads them inherits the rounding. A reviewer comparing an Analyzer net value of 0.00 with a hand calculation cannot tell whether the unrounded value was slightly positive, zero or slightly negative. The CSV export carries the same strings.

## The mistake

The careful mistake is repairing the disagreement in one direction: trusting the card and calling 32.996 neutral, or trusting the sentence and calling it a positive investment. Both treat a residue as a finding. The Analyzer does not flag a card that rounds to zero, so the check is yours: when a netVoi card reads 0.00 or -0.00, compare the survey cost with the gross voi and say the survey is priced at its value.

## Exercise

For survey costs of 32.996 and 33.004 on the default study, write the netVoi card and the verdict sentence. Explain in one sentence why they disagree, and state the survey cost at which the card and the sentence both report the information as value-neutral.
