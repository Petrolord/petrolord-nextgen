# The population standard deviation

{{panel:pr-award-calculator}}

There are two standard deviations in common use, and they differ by one character in the formula. The population standard deviation divides the sum of squared deviations by the number of values, n. The sample standard deviation divides by one fewer, n - 1, and so comes out a little larger. On the relative test for abnormally low bids that small difference moves the limit, and the limit decides which bids are flagged.

## The engine's choice, and why

The engine uses the population standard deviation. That is a declared choice, and the course names it as one. Its reason is the source: the World Bank Procurement Guidance, Abnormally Low Bids and Proposals, Second Edition, July 2016 (read on 2026-09-26), computes its own Annex I Example 1 with the population figure. The Guidance divides by the number of bids, and the engine follows the worked example of the text it cites.

The alternative is the sample figure, which a statistician would use to estimate the spread of a larger population from a sample. The Guidance treats the field of bids as the whole population.

## The same 16 bids, both ways

On Annex I Example 1:

| figure | population (the engine) | sample (lib/stats) |
| --- | --- | --- |
| standard deviation | 315974.537496 | 326337.099079 |
| limit, mean less one standard deviation | 1348451.837504 | 1338089.275921 |
| bids flagged | Bid 1, Bid 2, Bid 3 | Bid 1, Bid 2 |

The mean is the same both ways, 1664426.375000. The sample figure comes from lib/stats sampleStandardDeviation, the platform's statistics library, and its limit is the mean less it; the course derives that column to show what the other choice would do.

The larger sample deviation lowers the limit from 1348451.837504 to 1338089.275921, and Bid 3 falls between the two. Under the population figure Bid 3 is flagged for clarification; under the sample figure it is not. The engine, computing as the Guidance's example does, flags three.

## Why a choice this small is declared

A screen that flags three bids under one convention and two under another is a screen whose output depends on its convention. That is acceptable only when the convention is written down. The engine's basis says "the population standard deviation" in every relative result, and the panel labels its tile "Standard deviation (population)", so no reader has to guess which one produced a flag.

The choice matters less than it looks in one respect: a flag leads to clarification, and nothing is rejected on a flag alone. The next lesson takes that up. It still matters, because a bid that is never flagged is never asked to explain its price.

## Exercise

Open the award calculator on the view "Abnormally low bids". Replace the bids with five of your own, with round evaluated costs you can work by hand. Leave the estimate blank. Compute the mean, then the population and the sample standard deviations yourself, and check the population figure and the limit against the panel's tiles. Then adjust your lowest bid until it sits below the population limit and above the sample limit, recomputing both limits at each step because the bid moves them, and say which convention flags it.
