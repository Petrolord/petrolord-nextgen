# A hurdle above zero

A target NPV above zero asks for the price at which a project earns its discount rate plus a stated sum of money on top, and ISIALA's price climbs with every hurdle.

{{panel:ec-breakeven-explorer}}

## ISIALA at three targets

| target NPV, million USD | breakeven price, USD/bbl |
| --- | --- |
| 0 | 71.6277 |
| 100 | 96.5968 |
| 250 | 134.3869 |

At a target of 0 the price is the one at which ISIALA earns exactly 12 percent. A target of 100 million USD asks for 12 percent and 100 million USD of present value beyond it, which takes 96.5968 USD/bbl. A target of 250 takes 134.3869. NPV at the bracket top is 1552.6414 million USD, so the solver finds a price for any hurdle up to that and returns null above it.

The hurdle also moves the answer along the kinks. At 71.6277 only years 2 to 12 pay tax. At 134.3869 the year 16 kink of 124.4805 lies below the price and the year 17 kink of 141.4551 above it, so years 2 to 16 pay tax and the curve is shallower there. Each extra million USD of hurdle near 250 costs a little more price than it did near 100.

## A negative target

A target can sit below zero. The published solve_negative_target asks for -200 million USD on the base case and returns 146.9294, below that case's plain breakeven of 175.1500: the price at which the project falls short of its discount rate by exactly 200 million USD of present value.

## The Monte Carlo at a hurdle

Two published runs share seed 7 and 300 iterations and differ only in the target:

| case | target | 10th percentile | median | 90th percentile | base |
| --- | --- | --- | --- | --- | --- |
| mc_seed_7 | 0 | 150.7142 | 179.2190 | 215.8148 | 175.1500 |
| mc_target_250_seed_7 | 250 | 184.5382 | 214.9766 | 251.2132 | 210.4257 |

The same seed means the same draws, so every iteration has the same sampled capex, opex and efficiency in both runs. Only the target moved, so every iteration's price moved up, and the whole distribution with it. The base case moves the same way, from 175.1500 to 210.4257, matching solve_base_target_250.

## What a hurdle is not

A hurdle is money at the discount rate, not a higher discount rate. Raising the rate would weigh late years less and change every discount factor; a target NPV leaves the factors as they are and asks for a fixed sum. Nor is it extra capex, which would be discounted and would enter year 1's tax base.

## What it refuses

The target is absolute. It does not scale with project size, so 100 million USD of hurdle means something different on ISIALA than on the published base case with capex of 1000. The engine offers no IRR hurdle and no ratio of value to investment; a return-on-capital rule has to be turned into an NPV target by hand.

## The mistake

The mistake is reporting a hurdle price as the breakeven. A memo that says ISIALA breaks even at 96.5968 USD/bbl has quietly demanded 100 million USD of value on top; the plain breakeven is 71.6277.
## Exercise

Give ISIALA's breakeven price at targets of 0, 100 and 250 million USD. Explain what a target of 100 asks for, in words that mention the discount rate. Compare the medians of mc_seed_7 and mc_target_250_seed_7 and say why sharing a seed makes the comparison fair. Then say why a hurdle is not the same as raising the discount rate.
