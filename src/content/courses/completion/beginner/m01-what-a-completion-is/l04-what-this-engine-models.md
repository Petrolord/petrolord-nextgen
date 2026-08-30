# What this engine models

The scope of the calculation, stated up front, so that nothing later in the course comes as a surprise.

## What it computes

Five things, and they are the five modules of this tier and the next.

An API drift from an outside diameter and an inside diameter. A stack up from a list of component lengths. A run in clearance for every component against the casing above it. A through bore as a running minimum of inside diameters. Four volumes from the same geometry.

The advanced tier adds a sixth: a seal space out in a polished bore receptacle, which is the only part of the course where the completion moves.

## What it does not compute

It does not compute inflow. Nothing in this engine knows a permeability, a skin or a drawdown, and no output of it is a rate.

It does not compute tubing stress. Burst, collapse, tension and triaxial belong to the Casing and Tubing Design course, and this course borrows three numbers from it in the advanced tier rather than recomputing them.

It does not compute a running load, a drag or a hook load. A component that fits geometrically may still be impossible to run in a deviated hole, and this engine will not say so.

It does not compute artificial lift performance, sand control, perforating or stimulation. Each of those has its own course.

## What it will refuse

The engine refuses rather than guessing in six places. A component with no length. A component whose inside diameter is not inside its outside diameter. A hanger above surface. A packer deeper than total depth. A total depth above the packer. And a drift asked for on a tubular whose kind it does not recognise.

It also has one behaviour that is not a refusal and is easy to mistake for one. When the casing program does not cover an interval, the volume integration skips that interval and returns a warning naming it. The number that comes back is real and it is incomplete, and the warning is the only thing that says so.

## Why the scope is drawn here

Every one of the excluded items would need inputs this course does not have. Adding inflow needs a reservoir model. Adding stress needs a temperature and pressure history. Adding running loads needs a survey.

A tool that answered those questions from the inputs it has would be answering them by assumption. Drawing the line where the data stops is what makes the numbers on this side of it trustworthy.

## Exercise

List the five things the engine computes and the four families of thing it does not.

For each of the four, name the input that would have to arrive before it could be computed at all.

Then say which one you would add first, and what you would need to bring with it.
