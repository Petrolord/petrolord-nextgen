# What a device does to a distribution

The Associate tier left every device holding one number, its cut size. A cut size is the droplet a device removes half of. It says nothing on its own about how much oil comes out of the vessel, because that depends entirely on what sizes of droplet arrived.

{{panel:pw-water-explorer}}

## The removal is an integral, and the outlet is a distribution

This module computes two separate things every time a device is applied. The first is the REMOVAL, which is the grade efficiency curve integrated against the inlet droplet distribution, bin by bin. The second is the OUTLET DISTRIBUTION, which is what survives that integration, renormalised so it can be handed to the next device.

The second one is the one a reader forgets, and it is the one that makes a train behave the way a train actually behaves. A device removes the droplets it is good at, so the water leaving it is finer than the water that arrived.

## The same device, at several cut sizes

Here is one water through one device, with the cut size varied. The removal and the outlet are read together because neither is the whole answer:

| cut micron | removal percent | surviving volume | outlet median micron |
| --- | --- | --- | --- |
| 30 | 44.236922 | 0.557630781833 | 16.943389 |
| 20 | 60.477315 | 0.395226848971 | 14.126621 |
| 12 | 78.263077 | 0.217369227363 | 10.953502 |
| 6 | 92.922276 | 0.070777242939 | 7.691060 |
| 2 | 99.398720 | 0.006012799541 | 4.880416 |

A device cutting at 12 micron takes 78.263077 percent of the oil off this water and leaves droplets with a median of 10.953502 micron. Tighten the cut to 6 micron and the removal goes to 92.922276 percent with a median of 7.691060 micron. The surviving volume column is what the outlet bins are normalised by, and it is the bookkeeping that makes the next stage possible.

## Why a fixed efficiency is a different model

A vendor table that says a device is ninety percent efficient has thrown the distribution away. It cannot say what the water leaving looks like, so it cannot say what the next device will do with it. Every number in this course comes from a cut size against a distribution instead, and the same device on finer water performs worse.

## What the tier ahead is for

The Associate tier derived its cut sizes from a surface loading. The three devices in this tier get theirs from three different arguments. What they share is this page: whatever produced the cut size, the removal is this integral and the outlet is this renormalised distribution.

## Exercise

In the panel, set a single device at a cut of 20 micron and read the removal and the outlet median. Then set it to 6 micron and read both again.

Write down, in one sentence each, what the surviving volume column is for and why the outlet median moves when the cut size moves.
