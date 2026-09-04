# What burial assumes

The ground term is one shape factor with a long list of conditions attached to it, and the engine header states them. None of them is checked by anything in the module.

{{panel:pd-thermal-explorer}}

## The five conditions

The term is the classical conduction shape factor for an ISOTHERMAL cylinder in a SEMI-INFINITE medium, obtained by the method of images. Unpacked: a pipe surface at one temperature all the way round, one uniform soil conductivity everywhere, a flat surface held at ambient above it, no groundwater moving through the soil, and no seasonal front working down. The fifth condition is not physics at all: H is the depth to the CENTRELINE of the coated pipe, not to the top of it.

A real seabed satisfies none of the five exactly and some of them badly. The function returns a resistance to ten places either way.

## The one assumption a reader controls

Depth to centreline is the one that gets entered wrong, because a trench is dug to a top of pipe and reported that way. On the published 8.625 in coated diameter, a 4.0 ft trench read to the centreline gives 0.4112572083 hr ft degF/Btu per foot. Read to the top of pipe, so that 4.0 ft becomes 4.359375 ft, it gives 0.4227104126. Two readings of one hole, 2.784925 percent apart.

## Why that number is not the size of the problem

At the published depth 2H/D is 11.13043478 and acosh is nearly flat there, so half a foot of confusion costs very little. Nearer the surface it costs more: the shape factor moves by 1.42729466 between 1.000000 ft and 2.000000 ft of cover, against 1.17253653 between 10.000000 ft and 20.000000 ft. The same ambiguity is worth more on a shallow line than a deep one, and the return says nothing about which case it is in.

## The mistake

Treating the soil conductivity as a property of the ground rather than of the model. One k stands for backfill and native soil, for the wet layer and the dry one, for the mud a line starts in and the sand it crosses into. Somebody who measured one sample and typed it in has an answer for a uniform seabed that does not exist, and no flag says so.

## What a shape factor refuses to know

Whether the pipe is isothermal round its circumference, which it is not once a line runs part full. Whether the trench has silted in or scoured out. Whether the surface above it is at ambient. Each of those changes the real answer without changing the computed one.

## Exercise

Read the ground resistance at 4.000000 ft and at 4.359375 ft on the published coated diameter in the panel.

Then say which of the five conditions you would list in a report, and which one you could check.
