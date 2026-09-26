# Take, discounted and not

Take is the government's share of what the field is worth before anyone is paid. It is a share of a residual, and the residual has a convention.

{{panel:ec-time-explorer}}

## The undiscounted take

On AKATA the pre-take value is revenue 857602518.80 less capex 255000000.00 less opex 183899092.34. The government keeps the royalty column and the tax total of 148425219.46. The contractor keeps the net cash flow. Take is the government's part of the pre-take value, 66.1723 percent.

Read as a share, it is not a rate. The royalty rate is 15 percent and the tax rate is 40 percent, and neither is 66.1723. Take is higher than either because tax is charged on income after royalty, opex and depreciation, while royalty is charged on gross revenue, and the two stack on a residual that capex has already shrunk.

## The discounted take

The same shares on present values give 76.1610 percent. It is higher because the government's share arrives earlier than the contractor's: royalty is taken from the first barrel in 2029, while the contractor's running total is negative until 2032 and is recovered in the tail years that discounting reduces most. Every published case with a tail shows the same direction: jv_analytic_decision_kpis 80.7692 against 82.2761, multiyear_jv_real 69.2573 against 75.4578, multiyear_pia_real 69.3025 against 75.6850. single_year_positive, with one row and nothing to discount, reads 61.1111 percent both ways.

## The mistake

The careful mistake is to expect take to move with the working interest. It does not. AKATA reports 66.1723 percent at a working interest of 100 percent, and 66.1723 at 75, at 60, at 40 and at 25. Every monetary line and the volumes are the share: 2029 gross revenue is 186032000.00 at 100 percent and 111619200.00 at 60, total oil 9680000.00 bbl against 5808000.00. Both sides of the ratio are scaled by one factor, so the share holds.

A take built by dividing a partner's scaled net cash flow by the field's unscaled value counts the other partners' portion as government take, and it rises as the interest falls. Check that a take quoted from another report keeps both sides of the ratio at the same basis before comparing it with this one.

The second mistake is to compare a take across a sunk boundary. valuation_year_sunk reports 58.3333 percent where the same rows valued without the sunk flag report 80.7692, because the capex year left the residual.

## What take refuses

It refuses to exist when the residual is not positive: zero_rates_capex_only and jv_loss_unused_at_cessation report take null and discounted take null. It refuses to distinguish royalty from tax; it is one share. It refuses to move with the working interest. And it refuses to say who is better off.

## Exercise

Read the undiscounted and the discounted take on AKATA and explain, from the timing of royalty against net cash flow, why the second is higher. Then change the working interest and say why the figure does not move.
