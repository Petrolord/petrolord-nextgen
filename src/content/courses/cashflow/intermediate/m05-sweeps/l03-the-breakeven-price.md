# The breakeven price

The breakeven oil price is the flat price at which NPV is zero at the configured discount rate. It is solved by a search over reruns of the whole ledger, and it leaves a residual.

{{panel:ec-time-explorer}}

## AKATA

AKATA breaks even at 64.916777 USD/bbl. Rerun the ledger at that price and the NPV is 897.16, the IRR is 10.0002 percent and the take is 79.0146 percent. The breakeven is where the NPV curve against price crosses zero, between the sweep points at 60, where NPV is -21406234.12, and 70, where it is 22132715.69. The IRR of 10.0002 percent is the confirmation: where NPV is zero, the nominal discount rate is itself a root.

## What moves it and what does not

| variant | breakeven, USD/bbl |
| --- | --- |
| as configured, real basis | 64.916777 |
| nominal basis | 64.916777 |
| discount rate 15 percent | 69.518418 |
| royalty 20 and tax 50 percent | 74.945115 |
| working interest 60 percent | 64.916777 |
| with a price deck | null |

The basis does not move it, because the two bases give the same NPV. The working interest does not move it, because scaling every flow by one factor leaves the zero where it was. The discount rate moves it: at 15 percent the field needs 69.518418 USD/bbl. The fiscal terms move it most: royalty 20 and tax 50 percent push it to 74.945115.

## The published cases and their residuals

jv_analytic reports 71.725872 USD/bbl where the golden holds 71.726190; the NPV rerun at the engine's price is -243.53 and the golden's NPV at its own price is -0.000213. pia_worked_example reports 55.308589 against 55.308445, rerun NPV 810.98. multiyear_pia_real reports 53.239280 against 53.239195, rerun NPV 851.16. The search stops at a tolerance on price, and a small residual on NPV is the trace it leaves: nothing for a decision, something for a reader who expected zero.

## The three nulls

deck_present_null has a deck of one entry, oil 100 in 2030, and reports null: with a deck there is no single flat price to move. never_breaks_even_null reports null because no price in the search turns the NPV positive. positive_at_floor_null reports null because the NPV is already positive at the lowest price the search tries, so there is no crossing to bracket.

## The mistake

The careful mistake is to treat the breakeven as the price at which the field stops losing money. It is the price at which the field stops losing value at the discount rate, and those are different prices. At 64.916777 USD/bbl the IRR is 10.0002 percent and the undiscounted total is already positive: at 60 USD/bbl the real net cash flow totals 8466495.42. The price at which total net cash flow is zero has to be swept for, and the sweep only brackets it, between 50, where the real total is -45016230.39, and 60.

## What it refuses

It refuses to solve with a deck, refuses to report a price when no crossing exists in its search, and refuses to return an exact zero: the residual is printed so it can be read.

## Exercise

Read the breakeven at 10 percent and at 15 percent and say which direction a 5 percent discount rate would move it, without solving. Then say why the working interest row reads the same as the base case.
