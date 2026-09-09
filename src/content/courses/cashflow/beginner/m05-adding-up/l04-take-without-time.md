# Take without time

Take is the share of the value a field creates that the government keeps, computed on undiscounted totals, and it can pass 100 percent.

{{panel:ec-ledger-explorer}}

## The definition

The pre-take value is total revenue less total capex less total opex, what the field is worth before any fiscal term touches it. On AKATA that is 857602518.80 USD less 255000000.00 less 183899092.34. The government's share is the royalty column added up plus the tax total of 148425219.46. Take is the government's share over the pre-take value, and AKATA prints 66.1723 percent. The rest is the contractor's total net cash flow.

The hand-derived case: revenue 200000000.00, capex 50000000.00, opex 20000000.00; royalty 20000000.00 in each of two years and tax 65000000.00; take 80.7692 percent.

## The rate is not the take

Moving the tax rate alone on the hand-derived case:

| jv_tax_rate_pct | year 1 net | year 2 net | take percent |
| --- | --- | --- | --- |
| 0 | 20000000.00 | 70000000.00 | 30.7692 |
| 30 | 500000.00 | 50500000.00 | 60.7692 |
| 50 | -12500000.00 | 37500000.00 | 80.7692 |
| 85 | -35250000.00 | 14750000.00 | 115.7692 |

At a zero tax rate the take is 30.7692 percent, all of it royalty. At 85 percent it is 115.7692: the government collects more than the field's pre-take value and the contractor's two years sum to a loss. Royalty moves it on its own axis, 65.3846 percent at zero royalty and 88.4615 at 30. A regime is a take, not a rate.

## Over 100 and null

Take passes 100 percent whenever the contractor's total net cash flow is negative: elt_royalty_tail prints 131.2500 percent, jv_loss_carryforward 125.0000, psc_carryforward 101.0000. The engine prints null when there is no value to share: zero_rates_capex_only and jv_loss_unused_at_cessation have no revenue, so both print take null rather than a number nobody could read.

## The mistake

Reading take as the government's share of revenue. Royalty plus tax over 857602518.80 is smaller than 66.1723 percent, and it is the number a press release prints; take is over value, not sales. The second mistake is the working interest one: AKATA at 25 percent prints a take of 91.5431 percent, which compares one partner's scaled net with the whole field's value and is not a fiscal statement. The third is to expect take to say something about timing: the one-year depreciation schedule lowers total tax from 148425219.46 to 116025219.46, and take moves only because less was collected, not because it was collected later.

## What it refuses

Take does not measure whether the contractor did well; a low take on a field that never pays back is no comfort, and a high take on a rich field can sit beside a fine return. It has no clock, so it ignores when the government collects and when the contractor spends. The engine's discounted take, 76.1610 percent on AKATA against 66.1723 undiscounted, is the version that has a clock, and it belongs to the Professional tier.

## Exercise

Name the three totals that make the pre-take value and the two lines that make the government's share. Then explain, using the 85 percent row, how a take can exceed 100 percent without any error in the ledger.
