# Why a concentration is not enough

A laboratory returns oil in water as one number in parts per million. That number is what a plant logs, what a regulator asks for and what an operator argues about, and on its own it cannot tell anybody what a piece of equipment will do to it.

## The same water, several cut sizes

Take the UZERE inlet, whose droplets sit at a median of 26 micron with a log spread sigma of 0.8, and put it through one device at several cut sizes. What the device removes, and what the droplets look like afterwards, both follow:

| cut micron | removal percent | outlet median micron |
| --- | --- | --- |
| 30 | 44.236922 | 16.943389 |
| 20 | 60.477315 | 14.126621 |
| 12 | 78.263077 | 10.953502 |
| 6 | 92.922276 | 7.691060 |
| 2 | 99.398720 | 4.880416 |

One water, five answers. The inlet concentration never entered any of them. What decided each row was the size of the droplets against the size the device can catch. Read the outlet median column as well, because it is the half of the answer a concentration cannot hold: the device takes the coarse droplets first, so the water leaving is always finer than the water arriving, and the next device downstream inherits a harder duty than the one this device was given.

## The same cut size, several waters

Now hold the device still at a 12 micron cut and move the spread of the droplets instead. The removal changes again:

| sigma | removal at a 12 micron cut, percent | outlet median micron |
| --- | --- | --- |
| 0.5 | 84.480253 | 15.793311 |
| 0.7 | 80.243119 | 12.244813 |
| 0.8 | 78.263077 | 10.953502 |
| 1 | 74.748250 | 8.988225 |
| 1.5 | 68.402514 | 5.944722 |

Nothing about the equipment moved between the first row and the last. The removal fell from 84.480253 percent to 68.402514 percent because the water carried its oil in a wider range of droplet sizes. A wide distribution puts volume into droplets far below the cut size, and those droplets pass. The same argument reads the other way at the top of the table, where a tight distribution piles the oil volume into sizes the device is good at.

## What this means when somebody quotes an efficiency

A vendor efficiency is a measurement made on one water. Carried to another water it is a guess wearing a decimal point. This module refuses to work that way: it takes the distribution, computes a cut size from the equipment, and integrates one against the other. That is why the engine asks for a median droplet size and a spread before it will size anything at all, and why a reader who can only supply a concentration has not yet supplied enough.

## The number a report should carry

Report a concentration by all means. Report the median droplet diameter and the spread beside it, because those two are what decide whether the next device in the train earns its foundations. A sample bottle result with no droplet sizing behind it will support a mass balance and will not support a design.

{{panel:pw-water-explorer}}

## Exercise

Using the first table, say what happens to the outlet median as the cut size falls, and explain why a device that removes 99.398720 percent still leaves droplets behind. Then use the second table to say which of the two tables a vendor efficiency quietly assumes never happens.
