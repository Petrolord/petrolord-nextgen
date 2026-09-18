# What the allowance is taken off

{{panel:fc-inhibitor-integrity-explorer}}

A corrosion allowance is a thickness set aside to be lost. The obvious next question is what it is being taken off, and this module cannot answer it. The allowance arrives as a number the caller types in. Nothing here computes a minimum thickness, nothing checks the allowance against a wall, and no pressure-containing calculation exists in the module at all.

## Three apps, one word, no link

The platform has three studios that use the phrase and none of them knows about the other two. This studio consumes an allowance to give a life. The Pipeline and Line Sizing studio adds one to a pressure-containing wall. The Storage Tank studio adds one to a shell course. The wall this studio is eating is not the wall either of those sized, there is no link between them, and there is no minimum thickness anywhere in this module to reconcile them with.

That is recorded, it is stated in the studio's help, and it is deliberately left unwired, because linking three apps is a design decision rather than a bug fix. Knowing it is the difference between reading a remaining life as a fact about a pipe and reading it as a fact about a number somebody typed.

## The owners of the neighbouring quantities

The Barlow thin-wall relation with a design factor belongs to the Pipeline Network course at its Associate tier. That is where a minimum thickness comes from, and this module has none, so it cannot say what the allowance is being taken off. Wall loss taken to a derated burst pressure belongs to the Torque and Drag course at its Expert tier. This module consumes an allowance and never computes a pressure, so the comparison between the two is a pivot rather than a derivation. Name the owner in each case and stop there.

One more course points the other way. The Well Integrity and Plug and Abandonment course states in its own scope that it carries no corrosion model, no wall loss and no remaining life. This course fills exactly that refusal. Its vocabulary stays where it is: a barrier envelope is not a corrosion allowance, and neither term substitutes for the other.

## What the arithmetic does say

Inside its own boundary the door is precise. On the digest's teaching streams the allowance is 3.175000 mm with 0.400000 mm consumed, leaving 2.775000 mm. At 1.676428 mm/yr that is 1.655305 yr remaining, and against a 20 year design life the allowance a new line would need is 33.528563 mm, short by 30.753563 mm. At 0.076842 mm/yr the same allowance gives 36.112878 yr and meets the design life with a shortfall of 0.000000 mm.

Every one of those numbers is a division or a multiplication. The allowance and the consumed depth are typed and the rate is the correlation's, so each life inherits whatever the rate rests on. None of them knows the wall thickness, the design pressure or the pipe grade.

## Exercise

Take one stream and record its allowance, its consumed depth, its remaining allowance and its remaining life. Then write down which of those four the module computed and which it was handed, and say what a reader would have to bring from another studio before the life meant anything about a real pipe.
