# A negative share

A partner with a negative working interest is billed a credit, and the operator is loaded with more than its share while the total can still look fine. Since EC5-0 the engine marks that split valid false and names the partner.

{{panel:ec-governance-explorer}}

## The published cases

| case | cost | partner interests | operator share | operator amount | valid |
| --- | --- | --- | --- | --- | --- |
| negative interest | 1000.00 | 30, -20 | 90.0000 | 900.00 | false |
| negative and over 100 | 1000.00 | 130, -10 | -20.0000 | -200.00 | false |

## A total that looks fine

In the first case the partners are at 30 and -20 percent. Their total is 10 percent, under the whole, so the operator's residual is 100 less 10, which is 90.0000 percent, or 900.00 of the cost. Nothing is negative on the operator line. Without the negative entry the operator would carry 100 less 30, which is 70 percent. The negative partner has quietly moved its magnitude onto the operator and handed itself a credit.

Before EC5-0 this split passed as valid, because the only test was whether the operator share went below zero. The engine now reports valid false with the note: "Partner "B" has a negative working interest (-20.00 percent). Correct the interests before billing."

## Both errors at once

In the second case the partners are at 130 and -10 percent. The total is 120.00 percent, the operator share is -20.0000 and the operator amount -200.00. The note carries both sentences, the negative interest first: "Partner "B" has a negative working interest (-10.00 percent). Correct the interests before billing. Partner working interests total 120.00 percent, which is more than the whole. The operator share below is negative; correct the interests before billing."

## What the engine does and does not do

The allocation is returned unchanged. The engine does not zero the negative interest, does not rescale the list and does not refuse the input with an error. It flags and explains, and the amounts it shows are the wrong amounts the list produces, left visible so the error can be traced.

## The mistake

The mistake is using a negative interest to record something else: a carry, a credit owed from an earlier phase or a correction to last month's bill. The split has no field for any of those, and a negative percent does not model them. It produces an operator share inflated by the same magnitude and a partner bill that pays the partner. Record the credit where credits belong and keep every working interest between 0 and 100.

The second mistake is checking only the total. A list at 30 and -20 sums to 10 percent and would pass a check that the total is at most 100.

## Exercise

For the published case at 30 and -20 percent, state the partner total, the operator share and amount, and valid, and say what the operator would carry without the negative entry. Then explain why this case passed as valid before EC5-0, and give the order of the two sentences in the note when both errors occur.
