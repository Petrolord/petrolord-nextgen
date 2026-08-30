# The question it answers

How much influx the well can take, and what "take" means.

{{panel:wc-tolerance-explorer}}

## The question

If a kick of a stated size enters, can it be circulated out by the standard procedure without fracturing the shoe?

The answer is a volume: the largest influx for which the answer is yes.

## Why it is not obvious

Because the influx does not stay where it entered. Circulating it out moves it up the annulus, and as it rises the pressure around it falls and it expands.

At the shoe it is at its largest, and the shoe is the weakest point. Those two facts meeting is what the calculation is about.

## The two things happening at once

**The influx trades a mud column for its own.** As it rises past the shoe, the mud that used to be between the shoe and the bottom of the hole has been replaced, partly, by influx. The pressure at the shoe rises.

**The influx expands.** Boyle: as the pressure falls, the volume grows, so more of the annulus is influx and less is mud.

Both push the shoe pressure up, and the calculation asks how large the initial influx can be before that pressure reaches the fracture pressure.

## The inputs

The two true vertical depths, the mud density, the fracture gradient, the influx density, the two annulus capacities, and either a formation pressure or a kick intensity.

Eight numbers, and seven of them are known before any kick.

## The kick intensity

The amount by which the pore pressure exceeds the mud weight, expressed as a density.

    formation pressure = (mud density + kick intensity) x g x TVD at the bit

A kick intensity of 60 kg/m3 means the formation is half a pound per gallon heavier than the mud. It is a design assumption: a kick of that intensity is what the well is being designed to tolerate.

## What the answer is used for

**At the planning stage:** where to set the casing, by finding the mud weight at which the tolerance runs out.

**At shut-in:** comparing the actual pit gain against it, to decide whether the standard procedure will work.

## Exercise

For the slant well at 1440 kg/m3 mud and a kick intensity of 60, compute the formation pressure the calculation assumes.

Compare it against the formation pressures the two published scenarios produced, and say whether a 60 kg/m3 intensity is a mild or a severe design assumption.
