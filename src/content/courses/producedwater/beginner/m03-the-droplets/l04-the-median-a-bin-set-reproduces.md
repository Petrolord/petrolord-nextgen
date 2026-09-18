# The median a bin set has to reproduce

This lesson is about one number that has to come back unchanged, and about why a check of that shape is worth more than it looks.

## The claim

The volume median of a log-normal distribution is its own d50. That is a mathematical fact about the distribution rather than an observation about produced water. So when this module builds a bin set from a typed median of 26 micron, measures the volume median of the bins it just built, and reports 26.000000 micron, it has demonstrated that the thing it built is the thing it said it was building.

## It has to hold on every grid

An identity that only holds on the default settings is not an identity. This one survives a wide sweep of the grid:

| bins | median micron |
| --- | --- |
| 30 | 26.000000 |
| 60 | 26.000000 |
| 120 | 26.000000 |
| 600 | 26.000000 |

Coarse grid, fine grid, the same answer to every digit reported. Anything that made the median drift with resolution would mean the bins were being measured in a way that depends on how the range was chopped up, and a device removal computed against those bins would carry the same drift into the treating answer.

## Why both medians have to be measured the same way

There is a second reason this matters, and it arrives as soon as a train is built. The engine reports the droplet median going into a device and the droplet median coming out of it, and a reader will subtract one from the other without being asked to. Two numbers a reader will compare have to be measured the same way, or the comparison is meaningless. This module states on its own returns that both medians are the volume median of the same bin set, so the comparison is a real one. The inlet median reproducing the typed d50 is what makes that statement checkable from outside.

## A check that needs no source

Notice what this evidence did not require. No published dataset, no vendor test, no field sample. The check is available to anybody holding the engine, it costs nothing to run, and it can be run again on every build without waiting for a laboratory to open. It is also unambiguous, which published comparisons frequently are not. Engineering validation usually means finding a published case and matching it, which is slow and depends on somebody else's measurement being right. Identities are the other half of the job, and a module with no identities in it is a module whose correctness rests entirely on other people's data.

{{panel:pw-water-explorer}}

## Exercise

State the mathematical fact this identity rests on, and say what a drift in the median across the bin sweep would tell you about the implementation. Then explain why the inlet and outlet medians of a train have to be measured on the same basis before a reader may compare them.
