# Take, discounted and not

Take is the government's share of what the field is worth before anyone is paid. It is a share of a residual, and the residual has a convention.

{{panel:ec-time-explorer}}

## The undiscounted take

On AKATA the pre-take value is revenue 857602518.80 less capex 255000000.00 less opex 183899092.34. The government keeps the royalty column and the tax total of 148425219.46. The contractor keeps the net cash flow. Take is the government's part of the pre-take value, 66.1723 percent.

Read as a share, it is not a rate. The royalty rate is 15 percent and the tax rate is 40 percent, and neither is 66.1723. Take is higher than either because tax is charged on income after royalty, opex and depreciation, while royalty is charged on gross revenue, and the two stack on a residual that capex has already shrunk.

## The discounted take

The same shares on present values give 76.1610 percent. It is higher because the government's share arrives earlier than the contractor's: royalty is taken from the first barrel in 2029, while the contractor's running total is negative until 2032 and is recovered in the tail years that discounting reduces most. Both figures are readings of one field: the first on totals in money of the day, the second on present values at the applied rate. Every published case with a tail shows the same direction: jv_analytic_decision_kpis 80.7692 against 82.2761, multiyear_jv_real 69.2573 against 75.4578, multiyear_pia_real 71.1024 against 77.4499. single_year_positive, with one row and nothing to discount, reads 61.1111 percent both ways.

## The mistake

The careful mistake is to read take as a property of the fiscal terms. On AKATA at 75 percent working interest, with the same 15 and 40 percent, the reported take is 74.6292 percent; at 25 percent it is 91.5431. The rates did not change. The figure is the share of the whole field's pre-take value that does not reach your ledger, and at a partial interest that includes the partners' share. A take quoted without its working interest, like an NPV quoted without its convention, is not comparable to anything.

The second mistake is to compare a take across a sunk boundary. valuation_year_sunk reports 58.3333 percent where the same rows valued without the sunk flag report 80.7692, because the capex year left the residual.

## What take refuses

It refuses to exist when the residual is not positive: zero_rates_capex_only and jv_loss_unused_at_cessation report take null and discounted take null. It refuses to distinguish royalty from tax; it is one share. And it refuses to say who is better off, since a high take on a large residual can leave the contractor more than a low take on a small one.

## Exercise

Read the undiscounted and the discounted take on AKATA and explain, from the timing of royalty against net cash flow, why the second is higher. Then change the working interest and say what the take figure is measuring.
