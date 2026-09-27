# One rounded net value for the card and the verdict

The VOI Analyzer's cards are two-decimal strings, and its verdict sentence reads the same rounded net value of information as the Net VOI card. Near zero the card and the sentence therefore agree, and a card of 0.00 always carries the sentence that says the value rounds to zero.

{{panel:ec-judgement-explorer}}

## Either side of the gross value

The Analyzer's default study has a gross voi of 33.00. Sweep the survey cost across it:

| survey cost | netVoi card | verdict sentence |
| --- | --- | --- |
| 32.990 | 0.01 | Since this is positive, acquiring the information is financially advantageous. |
| 32.996 | 0.00 | Since this rounds to zero, the information costs what it is worth, so acquiring it or not is indifferent on EMV grounds. |
| 33.000 | 0.00 | Since this rounds to zero, the information costs what it is worth, so acquiring it or not is indifferent on EMV grounds. |
| 33.004 | 0.00 | Since this rounds to zero, the information costs what it is worth, so acquiring it or not is indifferent on EMV grounds. |
| 33.010 | -0.01 | Since this is negative, the information costs more than the value it adds, so acquiring it is not justified on EMV grounds. |

At 32.996, 33.000 and 33.004 the card reads 0.00 and the sentence says the value rounds to zero. At 32.990 the card reads 0.01 and the sentence says positive; at 33.010 it reads -0.01 and the sentence says negative.

## One rounding, read twice

The net value is rounded once, to two decimals, half away from zero with a 1e-12 allowance, and that rounded value is both the card and what the verdict tests. At 32.996 the unrounded net value is 33 less 32.996, a small positive amount, which rounds to 0.00, so the verdict writes the rounds-to-zero sentence. At 33.004 the unrounded amount is small and negative, it also rounds to 0.00, and "-0.00" is never printed: a negative zero is written as 0.00. The card and the sentence answer at the same precision, so they cannot disagree.

## What agreement does not tell you

Agreement settles the wording and leaves the decision open. A card of 0.00 and its sentence say only that the survey is priced at its value to the cent. Survey costs of 32.996 and 33.004 are indistinguishable in any real tender. The cost at which information becomes neutral is the gross value, 33.00 here and 24.8250 on EKPAN's full lottery. Near that price the right report is that the survey is priced at its value, with the margin written out, and the choice between buying and not buying rests on something the EMV does not measure.

## A card is a string

The five KPIs come back from the engine as two-decimal strings, and "-0.00" is never among them. A spreadsheet or script that reads them inherits the rounding. A reviewer comparing an Analyzer net value of 0.00 with a hand calculation cannot tell whether the unrounded value was slightly positive, zero or slightly negative. The CSV export carries the same strings.

## The mistake

The careful mistake is reading the neutral sentence as a finding about the survey. It reports a net value inside half a cent of zero and nothing more: the same sentence covers a survey slightly under its value and one slightly over it. When a netVoi card reads 0.00, compare the survey cost with the gross voi and say the survey is priced at its value.

## Exercise

For survey costs of 32.996, 33.000 and 33.004 on the default study, write the netVoi card and the verdict sentence, and show that the card and the sentence agree at each. Then state the range of survey costs that round the net VOI to 0.00, and the first cost on each side of 33.00 in the sweep at which the sentence changes.
