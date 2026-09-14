# Shares over the whole

When partner interests add to more than 100 percent, the operator's residual turns negative. The engine still returns the allocation, marks it valid false and writes a note, so the error is visible before a bill goes out.

{{panel:ec-governance-explorer}}

## The published case

The published case splits a cost of 1000.00 between two partners at 70 and 45 percent.

| field | engine |
| --- | --- |
| partner total | 115.00 percent |
| operator share | -15.0000 |
| operator amount | -150.00 |
| valid | false |

The operator share is 100 less 115.00, which is -15.0000 percent, and 15.0000 percent of the cost is 150.00, so the operator amount reads -150.00. The note, verbatim: "Partner working interests total 115.00 percent, which is more than the whole. The operator share below is negative; correct the interests before billing."

## The bills still add up

Each partner is still allocated its full percentage of the cost. Add the two partner amounts to the operator's -150.00 and the total comes back to 1000.00. That is what makes a share over the whole dangerous: the most common reconciliation check, that the bills sum to the cost, passes. The partners are billed for 115.00 percent of the work and the operator is shown as receiving money for running it.

## Flagged, not refused

The engine does not throw on this input. A negative capex in the portfolio engine or a negative progress on a cost line is refused with an error and no result. A partner list over the whole returns a full result with valid false. The design choice is that the numbers stay visible so the person fixing the list can see how far over it is, and the note tells them not to bill until they do.

That puts the stop in the reader's hands. A screen or an export that shows the partner amounts and hides valid and the note bills the error quietly.

## How a list goes over

Interests are typed in one partner at a time and nothing in the data model forces them to add to 100. A list goes over when a farm-in partner is added without reducing the interest of the partner who farmed out, when a gross interest is typed where a net one belongs, or when the operator's own interest is entered as a partner on top of the residual.

## The mistake

The mistake is to check only that the bills sum to the cost. On the published case they sum to 1000.00 exactly, and the split is still wrong. The checks that catch it are the partner total against 100 and the sign of the operator share, and the engine has already done both: read valid and the note before reading any amount.

The second mistake is correcting the split by editing the operator's figure. The operator share is computed; the fix is in the partner list.

## Exercise

For the published case at 70 and 45 percent, state the partner total, the operator share and amount, and valid. Show that the allocation still sums to the cost, and name the two readings on the result that catch the error when that sum does not.
