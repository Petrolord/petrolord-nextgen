# The band is narrow

A one point two ratio meeting a catalog whose rows are nearly two to one wide.

{{panel:ps-sand-explorer}}

## The two widths

The Saucier band spans a factor of one point two, from five to six times the formation median.

A commercial gravel is sold as a dual mesh designation: twenty forty, sixteen thirty, thirty fifty. Those describe the two sieves the sand was cut between, and the ratio between them is close to two.

So the specification is narrower than the product.

## What the engine does about it

Takes the pack median as the mid-range of the two sieve openings, and asks which catalog rows have a median inside the band.

That is a reasonable convention and it is flagged approximate, because a real vendor's sieve certificate gives the actual distribution rather than the mid-range of the nominal cut.

## What follows

With seven catalog rows spanning from fifty seventy up to eight twelve, and a band only one point two wide, there are formation medians for which no row lands inside.

The gaps are not small. Sweeping seven representative formation medians across the range, three of them have no commercial match at all.

## Why that is not a bug

Because it is true. Gravel is manufactured in a handful of standard cuts, and a formation whose median falls between two of them cannot be given a perfect pack.

An engine that quietly returned the nearest row without saying so would be hiding a real design decision. An engine that refused would be useless, because the job still has to be done.

## What the engine returns instead

Both. A list of matches, which may be empty, a flag saying whether it is empty, and the nearest row by median regardless.

The reader then knows whether they are inside the published rule or making a judgement, which is the distinction that matters.

## Exercise

Compare the width of the Saucier band with the width of a commercial dual-designation cut.

Say how the engine defines a catalog row's median and why that definition is flagged approximate.

Then say what the engine returns when nothing matches, and argue for that over both alternatives.
