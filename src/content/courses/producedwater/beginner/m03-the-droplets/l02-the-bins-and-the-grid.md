# The bins, and the grid the answer is measured on

A continuous distribution has to be laid on a grid before anything can be integrated against it. That grid is a modelling choice, it moves the answer, and this module reports it back rather than hiding it.

## The two numbers that define the grid

The grid has a bin count and a span. The module defaults to 60 bins reaching 4 sigma either side of the median, and it holds a floor under both: the distribution will not be described on fewer than 10 bins, nor spanned by fewer than 3 sigma either side. It also insists that the bin count is a whole number, and says so when it is handed something else. Both floors are declared constants, which means a reader can find them in one place and see what they were set to.

## The bin count, swept

Move the bin count over a wide range on the UZERE inlet and read what stays still:

| bins | median micron | truncated tail | tail over twice the cdf below the span |
| --- | --- | --- | --- |
| 30 | 26.000000 | 0.000063372072 | 1.000000000000 |
| 60 | 26.000000 | 0.000063372072 | 1.000000000000 |
| 120 | 26.000000 | 0.000063372072 | 1.000000000000 |
| 600 | 26.000000 | 0.000063372072 | 1.000000000000 |

The median holds at 26.000000 on every grid, which is the identity from the last lesson surviving a twentyfold change in resolution. The truncated tail holds too, because the tail is a property of how far the grid reaches rather than of how finely it is divided. This is the more useful of the two sweeps to have seen, because bin count is the input an engineer is most tempted to increase when an answer looks suspicious. Increasing it here buys nothing at all, and knowing that saves an argument about resolution when the real question is somewhere else entirely.

## The span, which does move the tail

Now hold the bin count and change how far the grid reaches:

| sigma spans | truncated tail | coarsest bin micron |
| --- | --- | --- |
| 3 | 0.002699934563 | 286.602586 |
| 4 | 0.000063372072 | 637.845785 |
| 5 | 0.000000574210 | 1419.551901 |
| 6 | 0.000000001980 | 3159.270855 |

A narrower grid throws away more of the distribution, and the volume it throws away is what the truncated tail column reports. The normalisation absorbs that volume, so the bins always sum to the whole, and the reader is told how much was absorbed.

## The check that makes the tail believable

The last column of the first table is the reported tail over twice the module's own cumulative probability below the lower span edge. It comes out at 1.000000000000. That says the volume the normalisation absorbed is exactly the analytic tail of the distribution and nothing about the binning. A grid artefact would show up there immediately as a departure from one. This is the second identity in two lessons, and it is worth noticing what kind of check both of them are. Neither needs a published dataset, a vendor curve or a field measurement. Each one compares the module against a mathematical fact about the distribution it claims to be using, and a module that fails such a check is not modelling what it says it is modelling.

{{panel:pw-water-explorer}}

## Exercise

Say which of the two grid inputs moves the truncated tail and which does not, and why. Then explain what the reader is being told when a module reports its own grid back on the answer instead of treating it as an implementation detail.
