# The truncated tail, and a check that needs no source

A log-normal distribution has no end. A grid does. The volume that falls outside the grid has to go somewhere, and what this module does with it is both a modelling decision and, unusually, a quantity that can be checked with no published data at all.

{{panel:pw-water-explorer}}

## What the tail is

The grid reaches a stated number of sigma either side of the median. Beyond both ends there is real volume in the analytic distribution that the bins do not cover. The module reports that volume as the TRUNCATED TAIL, and the normalisation absorbs it, so the bins that exist still carry the whole of the oil.

On the OGBOTOBO train, described on 60 bins over 4 sigma, the truncated tail is 0.000063372072.

## The check

Here is the part worth an Expert reader's attention. The truncated tail is not only reported, it is CHECKABLE, and the check needs no source outside the module.

The tail is the volume beyond both span edges. The module's own cumulative distribution function evaluates the volume below the lower edge. By the symmetry of the log-normal in log diameter, twice that lower figure is the whole tail. So divide the reported tail by twice the module's own cdf at the lower span edge, and the answer has to be one.

It is. Across bin counts of 30, 60, 120 and 600 the ratio comes out at 1.000000000000 on every row, which says the tail the normalisation absorbs is exactly the analytic tail rather than a binning artefact.

## Why that is a stronger result than a published comparison

A published case tells you the engine agrees with somebody else's number at somebody else's conditions. This tells you the engine agrees with ITSELF, structurally, at every condition swept.

Two independent parts of the module are being asked the same question by different routes. The binning machinery answers it by adding up what it could not fit. The cdf answers it analytically. Nothing outside the file is consulted, nothing has to be looked up, and no tolerance has to be argued about.

## What moves it and what does not

The span moves the tail, and it moves it hard. The published grid cases carry a tail of 0.000063342484 at a span of 4, 0.000000573303 at a span of 5, and 0.000000001973 at a span of 6.

The bin count does not move it. Compare the rows at 30 bins and at 60 in the same group and the tail is identical, because slicing the covered range more finely does nothing about what lies outside it.

That is the same pairing the lesson before this one found in the median column, read from the other side.

## Exercise

In the water explorer, set a distribution and record the truncated tail. Change the bin count and check whether it moves. Change the span by one sigma and check again.

Then write down, in your own words, why a check that compares a module with itself can be worth more than one that compares it with a book.
