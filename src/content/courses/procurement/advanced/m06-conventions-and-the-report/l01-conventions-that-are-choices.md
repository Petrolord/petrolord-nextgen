# Conventions that are choices

{{panel:pr-contract-calculator}}

Where a text fixes a rule, the engine follows the text and cites it. Where no text fixes one, the engine still has to do something, and what it does is a convention: a choice, stated, that another careful evaluator might make differently. A different choice would move a figure, so every report that quotes a figure names the conventions behind it. This lesson lists them with the alternative each one declines.

## The conventions

| convention | the engine's choice | where it comes from |
| --- | --- | --- |
| arithmetic tolerance | 0.005, a gap above it is corrected | engine convention (half a cent) |
| ties | 12 significant digits; then the lower evaluated cost, the earlier receipt, the bidder id | engine convention; no text read states a tie-break |
| completion-time base | corrected price less the discount | engine convention; the SPD gives the rate without its base |
| who prices an omission | the other bids still responsive | engine reading of ITB 34.1 |
| overall content across units | weighted mean with stated weights | engine convention; the Act has no rule |
| the s.14 group | within 1 percent of the lowest | engine reading of s.14, stated in every reason |
| the plan of a contract | the modes, unless a plan is stated | engine convention |
| an overrun | a contractor cost above the planned cost | engine convention |
| cost percentiles | exceedance labels; floor-index percentiles | lib/conventions/percentile.js and lib/stats basicStats |
| the should-cost band | stated by the user, both limits inside | no published threshold |
| the ALB standard deviation | population | World Bank ALB Guidance Annex I Example 1 |

## The alternatives, and why the engine did not take them

**The tolerance.** A tolerance of zero would call a line priced to the cent a discrepancy whenever binary arithmetic leaves a trace below a cent. Half a cent catches a real pricing error and lets a rounding trace pass.

**Ties.** Exact equality of doubles would let the last bit of a floating-point sum decide an award. A drawing of lots cannot be reproduced. Twelve digits and a stated order make every tie the same on every machine.

**Who prices an omission.** Every bid received could have priced it, but then a bid whose envelope was never opened, such as WS4 on the well services tender, would set a price in an evaluation it never entered.

**The completion-time base.** The quoted price would charge a late bidder on a figure its own arithmetic corrected. The corrected price less the unconditional discount is what the company would actually pay, and every schedule reason states it.

**Content across units.** Pooling the quantities would add man-hours to tonnes. A weighted mean with stated weights is the only honest way to report one overall figure, and the weights have to be stated.

**The plan.** The mean is another possible reference for an overrun, but a plan is what a company budgets, and budgets are usually built from most likely values. A caller who plans differently states a plan.

**Percentiles.** Interpolating between sorted values is common elsewhere. Reading the value at a floor index keeps every percentile a value the engine actually sampled, and the labels follow the platform convention.

**The ALB standard deviation.** The sample standard deviation divides by one fewer. On the Guidance's Annex I Example 1 it is 326337.099079, the limit would fall to 1338089.275921, and the test would flag Bid 1 and Bid 2 only, where the Guidance's own computation, with the population figure, flags Bid 1, Bid 2 and Bid 3.

## Exercise

Open the contract calculator on the view "Boundary probes" and run the arithmetic probe with a gap of 0.004 and then 0.006 at the tolerance of 0.005, recording the rule each time. Then open the view "Contract types on one job" at 20000 iterations on seed 20270211, add a `plan` with the mean days of 15.277257 and a `dailyCost` of 42000, and read how the probability of an overrun moves. Write one line for each convention you changed: the choice, the alternative you used and the figure that moved.
