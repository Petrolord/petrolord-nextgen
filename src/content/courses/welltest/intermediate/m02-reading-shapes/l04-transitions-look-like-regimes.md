# Transitions look like regimes

Two mechanisms, eight false labels, and the two rules that remove them.

{{panel:wt-diagnostic-explorer}}

## The evidence

Run the classifier on all seven fixtures with the ordering rules switched off, and compare what it reports against what is planted in them.

| fixture | slope bands alone | what is actually there |
|---|---|---|
| buildup | constant pressure, radial | storage transition, then radial |
| drawdown | constant pressure, radial | the same |
| sealing fault | linear, constant pressure, radial, bilinear, radial | storage, radial, the ramp to the doubled plateau, radial |
| dual porosity | storage, constant pressure, radial | storage, the matrix dip, total-system radial |
| closed rectangle | radial, boundary or pss | correct |
| horizontal well | radial, linear, bilinear, radial | vertical radial, linear, transition, pseudoradial |
| fractured well | linear, bilinear, radial | fracture linear flow, transition, radial |

One fixture out of seven is reported without a false label. Every other one names at least one regime that is not there, including the plain infinite-acting drawdown.

## Mechanism one: a fall between two regimes

The constant-pressure band is any slope at or below minus 0.35. Steep falls are supposed to mean recharge.

But the derivative also falls steeply whenever it is coming DOWN from something to something lower. The storage hump falls to the radial plateau. A dual-porosity derivative falls into its matrix dip. Both are steeper than minus 0.35 over part of their length, and both were labelled recharge.

On the buildup that produced a segment labelled "Constant-pressure boundary / recharge" spanning nearly a decade of equivalent time, in a fixture built from an infinite-acting solution with no boundary in it of any kind.

## Mechanism two: a rise between two plateaus

The bilinear band is 0.16 to 0.34. A gentle rise is supposed to mean flow along a finite-conductivity fracture.

But the derivative also rises gently whenever it is climbing from one plateau to a higher one. That is exactly what a sealing fault does: the derivative sits at the radial value, then climbs towards twice that value as the fault's image well is felt.

The climb is slow, because the doubling is asymptotic. Its local slope spends a long stretch inside the bilinear band. So the fault fixture was reported as having bilinear flow between about 25 and 123 hours, in a test with no fracture in it.

## The two rules

Both mechanisms are caught by the ORDER a segment appears in, which the classifier already knows.

**Recharge does not recover.** Once a constant-pressure boundary is felt, the derivative keeps falling: the reservoir is being supplied and the pressure stops changing. So a constant-pressure stretch with any regime AFTER it is not a boundary. It is the fall out of one regime into the next.

**Bilinear flow is near-well geometry.** It is flow along a finite-conductivity fracture and into it at the same time, so it happens close to the well and it precedes both radial flow and formation linear flow. A bilinear stretch with either of those BEFORE it is not a fracture regime. It is a climb from one level to another.

With those two rules the table becomes:

| fixture | reported now |
|---|---|
| buildup | transition, radial |
| drawdown | transition, radial |
| sealing fault | linear, transition, radial, transition, radial |
| dual porosity | storage, transition, radial |
| closed rectangle | radial, boundary or pss |
| horizontal well | radial, linear, transition, radial |
| fractured well | linear, transition, radial |

Eight false labels removed. One left.

## Why the rules relabel rather than delete

A stretch that is not a regime is still part of the response. Deleting it would leave a gap on the plot with no explanation, and the reader would have to work out what happened in it.

Naming it a transition says something true and useful: this is a passage between the regime before it and the regime after it, and its extent is worth knowing because a long transition is a well with a large storage coefficient or a boundary a long way off.

## The one the rules cannot remove

Look at the fault fixture. Its first segment is still labelled linear flow, over 0.01 to 0.037 hours, and there is no fracture in it. That stretch is the roll-off of the wellbore storage unit slope, on a well whose storage coefficient is 0.01 bbl/psi.

Ordering cannot remove it, because a fracture's linear flow legitimately comes first in a test, and so does the roll-off of a storage unit slope. Nothing about the position separates them.

What separates them is the PRESSURE, which `detectFlowRegimes` is not given. During wellbore storage the pressure change and its derivative are the same quantity and lie on top of each other on the log-log plot. During fracture linear flow they do not: the derivative sits at half the pressure change. That check takes two seconds on the plot in the panel above and it is yours to make.

## The rule this leaves you

A regime label now needs three things from the software and two from you.

From the software: the slope is in the band, the segment is long enough, and the regime is possible in that position.

From you: does the LEVEL the segment sits at imply a number that is credible for this well, and do the pressure and derivative curves agree with the regime being claimed?

The next lesson is about the two that are yours.

## Exercise

Take the first table and, for each false label in it, write down which of the two mechanisms produced it. Confirm your count comes to eight.

Then open the panel on the sealing fault, find the first segment, and write down the one observation on the plot that shows it is storage rather than a fracture.
