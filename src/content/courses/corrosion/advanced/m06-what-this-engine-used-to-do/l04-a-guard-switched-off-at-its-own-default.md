# A guard switched off at its own default

This module's subject is what this engine did before the repair that preceded the course, and this is the last of the four items. Its shape is small, it repeats easily in other code, and it is worth a lesson of its own for that reason.

## The general lesson

A guard written with a strict comparison against a round number is switched off at exactly that number. Write greater than ninety and ninety itself passes through untouched. That is ordinary and usually harmless, and it stops being harmless the moment the round number is also a shipped default, because a default sitting on a boundary is the likeliest value in the whole input space. Test a guard at the default before testing it anywhere else.

## What happened here

Before the repair the corrosion inhibitor warning fired only when the efficiency was strictly greater than ninety percent. The studio shipped with an efficiency of exactly ninety. So the one lesson this module exists to teach was silent on the first screen every user saw. The studio computed the effective protection, printed it in green because the colour was chosen from the presence of a warning, and said nothing. The same guard was equally silent at ninety percent efficiency and fifty percent availability.

Two things compounded it. The colour came from whether a warning existed rather than from the number, so silence rendered as reassurance. And the value that slipped through was the one value a first-time user was guaranteed to meet.

## Where it stands now

The warning fires on the effective shortfall at any efficiency. The trigger, measured by bisecting the availability at which it first appears, is 0.100000 percentage points of shortfall, and the warning states the effective figure and the metal-loss ratio in its own words. At the shipped defaults it is present.

That change is worth reading as a design move rather than as a threshold adjustment. The old guard tested an input. The new one tests the output the warning is actually about, so it does not depend on which of the two inputs a particular programme is short on. A guard on the quantity you care about survives a change in how the inputs arrive at it.

## The habit to take away

Three questions will find most guards of this shape. What does this guard compare against, and is the comparison strict or inclusive? Is the boundary value a round number somebody would plausibly type? And is it the shipped default? A yes to all three means the guard is off where it is needed most, and the cost of checking is a single run at one value you already know.

## Exercise

Find a guard in this module, state what it compares and whether the comparison is strict, and identify the value that sits exactly on its boundary. Then decide whether that value is a plausible input, and say what you would run to prove the guard fires or stays silent there.
