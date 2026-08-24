# What decompaction is

The last module built the forward statement. Porosity falls with depth along the Sclater-Christie curve, so a sediment that arrives at the sea floor loose and open gets squeezed as more sediment lands on top of it, and by the time you log it the pore space it started with has largely gone. This module runs that statement backwards.

## The layer you log is not the layer that was deposited

Open a well report and read off a shale interval. The number written there, say 100 m, is a present-day thickness. It is not what the layer measured on the day the last grain of it was deposited, and it is not what it measured at any intermediate moment either.

That matters because almost every question a basin model asks is a question about an intermediate moment. How deep was the source rock 60 million years ago. How hot was it then. When did it cross the top of the oil window. None of those can be answered from present-day thicknesses alone, because the stack you see today is the compacted stack, and the stack that existed 60 million years ago was thicker at every level that had not yet been squeezed.

So the first job of a basin model is geometric rather than thermal. Before you can say anything about temperature you have to be able to reconstruct the column at a past moment, which means giving every layer back the thickness it had then.

## Running compaction backwards

Compaction is a one way process in nature and a reversible one on paper. The forward direction says: give me a layer's grain content and its top depth, and I will tell you how thick it is, because the porosity at every level inside it is fixed by the curve. The backward direction asks the same question with a different unknown: give me a layer's grain content and a new, shallower top depth, and tell me how thick it becomes.

That is decompaction. You are not adding material and you are not inventing thickness. You are moving a fixed amount of solid grain to a shallower position on the porosity curve, where the curve says the grains sit further apart, and reading off the thickness that the grain now occupies.

The whole method rests on the porosity curve being a function of depth alone for a given lithology. It says that a shale at 1000 m has the porosity of a shale at 1000 m, whether it got there yesterday or fifty million years ago. That is an approximation, and the higher tiers of this course discuss when it fails. At Beginner level it is the model, and it is the reason the arithmetic closes.

## What you have to hold on to

If thickness changes and porosity changes, something has to stay fixed, otherwise the reconstruction has nothing to stand on. That something is the grain.

Module 2 introduced solid thickness, which is the layer with all of its pore space removed and the mineral pressed into a single slab. A layer's solid thickness is a count of how much rock is actually there. Burying the layer squeezes water out and reduces its total thickness, but it does not remove grains, and lifting it back toward the surface lets the grains sit further apart again without adding any. Solid thickness is therefore the conserved quantity, and it is the handle by which the whole restoration is carried.

The engine treats it exactly that way. It derives each layer's solid thickness once, from the present-day stack, and then treats that number as invariant for the rest of the run. Every past geometry is computed by asking where a fixed pile of grain would sit if the top of the layer were at some other depth.

## Backstripping, without the machinery

The technique that does this over a whole well is called backstripping, and the name describes the procedure. You take the stack as it is today, remove the youngest layer, decompact everything that is left to the shallower depths it now occupies, and record that geometry. Then you remove the next youngest layer and repeat. Working down the stack this way, you recover a sequence of past columns, one for each removal, and together they are the burial history of the well.

Two points about that description are worth holding.

The first is that decompaction is the step inside backstripping, and it is the step this module teaches. Backstripping also has to deal with what the water column and the mantle do underneath the sediment, which is a load and isostasy problem, and that belongs to a later tier. You can understand and check the geometric core without it.

The second is that every layer moves at every step. When you strip off the youngest layer, the layer directly beneath it does not merely rise, it also thickens, and so does the layer beneath that, and so on to the base of the stack. A restoration that moves layers up without regrowing them has done half the job and will give you past depths that are all too shallow.

## What decompaction does not do

It does not tell you about erosion. A layer that was once buried under 600 m of section that has since been removed will decompact to the wrong past depth unless the missing section is put back by hand, because the layer's porosity remembers the deepest burial rather than the present one. Recovering an erosion event from its thermal signature is Expert tier work, and it is one of the reasons the higher tiers exist.

It does not tell you about time. Decompaction gives you a set of geometries and says nothing about when the basin was in each of them. Ages come from biostratigraphy and from the age model you supply.

It does not tell you about temperature. That is module 4, and it is what all this geometry is for.

## Exercise

A shale interval logs 100 m thick today with its top at 1000 m. Before doing any arithmetic, write down which of the following three quantities you expect to change when you restore the layer to the surface, and which you expect to stay the same: its total thickness, its average porosity, its solid thickness. Then state, in one sentence, why the quantity that stays the same is the one the calculation is built on.

Self check: total thickness changes, because the grains spread apart as the layer rises up the porosity curve. Average porosity changes, and it increases, because porosity at the surface is higher than porosity at 1000 m for any lithology. Solid thickness stays the same, because moving a layer changes how far apart its grains sit and never changes how many there are. It is the one quantity the restoration can be anchored to, so the calculation is posed as a search for the thickness that a fixed amount of grain occupies at the new depth.
