# Sigma over the protection period

{{panel:materials-stock-calculator}}

Sigma is the standard deviation of demand over the protection period, and it is the figure the safety stock multiplies. The engine builds it from four stated inputs and one sum. Its basis, verbatim, begins:

    sigma = sqrt(P sd_d^2 + d^2 sd_L^2) with P = leadTime + reviewPeriod

Here d is the mean demand a period, sd_d its standard deviation, P the protection period and sd_L the standard deviation of the lead time.

## Two variances, one square root

The first term, P times the demand variance, is the demand spread over P periods. The second, d squared times the lead-time variance, is the spread a wandering lead time adds at the mean demand. The two sources are taken as independent, so their variances add, and sigma is the square root of the sum.

Standard deviations do not add; their squares do. On the choke bean set the demand part alone is 2.529822 and the lead-time part alone is 1.666650. Their plain sum would be well above sigma. Squared and added, they give sigma squared: 2.529822 squared plus 1.666650 squared is 3.029476 squared. This is why cutting the smaller source of variation saves less than its size suggests.

## One period for everything

The demand, its spread, the lead time, its spread and the review period are all in one period, the one the user chooses. For the choke bean set it is months; for the lecture checks later in this tier it is weeks. The engine converts nothing. A demand a week typed beside a lead time in days gives a meaningless sigma the engine cannot detect, so the period belongs in the written policy.

## Where the lead-time spread enters

The lead-time spread enters on the lead time only. A review period, added under periodic review, is fixed: stock is counted on a timetable, and the engine takes no spread on it. With a review period R, the protection period grows to R plus L, the first term grows with it, and the second term stays as it was. This is a stated choice of the engine; a spread on the review period too is the alternative it names.

## Sigma of zero

With both spreads at zero, sigma is 0.000000 and demand over the protection period is certain. A later lesson shows what the engine does then, and which target it refuses.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "The choke bean set, cycle service level". Read sigma, 3.029476. With a calculator of your own, square 2.529822 and 1.666650, add them, take the square root, and confirm you reach sigma. Then work the two parts from the stated inputs: the square root of 2.5 times 1.6 squared for the first, and 3.3333 times 0.5 for the second.

Next, set the control "Review period, periods (stated, 0 for continuous review)" to 1. Before you read the result, predict which part of sigma grows and which stays fixed. Read the new sigma and check your prediction against the rule above.
