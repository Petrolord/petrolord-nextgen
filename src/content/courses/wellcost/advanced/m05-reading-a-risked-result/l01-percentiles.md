# Percentiles

A sampled run gives you thousands of answers. A percentile is how you turn that pile into something a person can sign.

{{panel:wc-risk-explorer}}

## What the sampler actually does with the pile

There is no formula involved. The run produces one total per realisation, the totals are sorted from smallest to largest, and a percentile is read off by index. The tenth percentile is the value one tenth of the way along the sorted list. That is the whole mechanism.

Two things follow immediately. A percentile only exists once the run has finished, and its precision is limited by how many draws you took. With 2,000 iterations the tails are built from a small number of realisations, so the extremes wobble far more than the middle does.

## The median is not the mean

These two get used interchangeably and they are different numbers with different jobs.

The median is the middle of the sorted list. Half the realisations came in below it. The mean is the arithmetic average, and it is pulled by the tail.

On the golden's linear fixture the mean cost is 1,530,000 USD against a deterministic modal base of 1,500,000, a gap of 30,000 USD, which is a fraction of 0.02. The standard deviation of that fixture is 63868.354187866 USD, so the coefficient of variation is 0.041744022345010456.

Cost distributions are right skewed, because rates can collapse further than they can improve and delays have no upper bound in the way savings do. So the mean sits above the median, and quoting one while calling it the other flatters or penalises the estimate depending on which way you slipped.

## Which figures are worth quoting

Three numbers do most of the work.

| Figure | What it answers |
| --- | --- |
| Median | The even money outcome |
| Mean | What a long run of similar wells would average |
| A stated tail percentile | How much cover a given confidence needs |

The mean matters to a portfolio, because averages add across wells. The median matters to the single well in front of you. The tail matters to whoever has to fund the bad case.

Notice that none of those three is the deterministic base cost. That number is not a percentile of anything until you go and find out where it sits, which is the subject of a later lesson in this module.

## Exercise

In the panel, read the mean and the median of a risked run and write down which is larger and by how much.

Then halve the iteration count, rerun, and record which moves more, the median or the tail figure you chose. Say in one sentence why.
