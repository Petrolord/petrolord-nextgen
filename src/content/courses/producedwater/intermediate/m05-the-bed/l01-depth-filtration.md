# Depth filtration

A walnut shell or media bed is the last device in most de-oiling trains, and it is the one most often described wrongly. It does not screen droplets out. The pores are far larger than the oil it removes.

{{panel:pw-device-explorer}}

## Capture on the grains

Water flows through a packed bed of grains. Oil droplets travelling with it come close to grain surfaces, touch them and are retained. The oil is captured THROUGHOUT the depth of the bed rather than on its face, which is why the mechanism is called depth filtration and why a bed can hold a great deal of oil before anything is visible at the surface.

Because capture happens everywhere in the bed, the right way to describe it is a rate per unit of depth. This module calls that the filter coefficient, lambda, and the penetration through a depth falls exponentially in it.

## What lambda depends on

Three things move the filter coefficient, and each of them has a physical reason:

The DROPLET DIAMETER, through the square of it, because capture is by interception and a bigger droplet reaches a grain from further away.

The GRAIN SIZE, through the inverse cube of it, because finer grains mean more collectors per unit volume and a better interception efficiency on each one.

The LOADING RATE, through a falling power, because water moving faster spends less time near any grain and drags captured oil back off.

## The KOKORI bed, read end to end

A 20 m2 bed, 0.8 m deep, packed with 650 micron media, on the KOKORI flow:

| quantity | value |
| --- | --- |
| loading | 24.841765 m/hr |
| filter coefficient at the reference droplet | 4.140060735138 per m |
| penetration at that droplet | 0.036441443726 |
| removal at that ONE size | 96.355856 percent |
| cut size | 9.149437 micron |

Read the third and fourth rows together. A penetration of 0.036441443726 means that fraction of the 20 micron droplets arriving get all the way through the bed, so 96.355856 percent of them are caught. That figure is the removal AT ONE DROPLET SIZE and it is not the removal of the bed on real water, which depends on the whole distribution.

On a wide droplet distribution most of the oil volume sits at sizes other than the one the reference is quoted at, and the bed treats each of those sizes differently.

## The number a train actually uses

The cut size of 9.149437 micron is the quantity the train reads, and the next lesson is about where it comes from. It is worth saying in advance that it is the same exponential law read backwards rather than a second calculation with its own assumptions, which is a design decision this module made deliberately and states on every return.

## Exercise

Explain why a bed whose pores are far larger than the droplets it removes can still remove them.

Then say why the removal figure of 96.355856 percent cannot be quoted as what this bed does to produced water.
