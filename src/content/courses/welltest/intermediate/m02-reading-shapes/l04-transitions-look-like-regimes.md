# Transitions look like regimes

Two mechanisms, and every false label in this course is one of them.

{{panel:wt-diagnostic-explorer}}

## The evidence

Run the classifier on all seven fixtures and compare what it reports against what is planted in them.

| fixture | what the engine reports | what is actually there |
|---|---|---|
| buildup | constant pressure, then radial | storage transition, then radial |
| drawdown | constant pressure, then radial | the same |
| sealing fault | linear, constant pressure, radial, bilinear, radial | storage, radial, the ramp to the doubled plateau, radial |
| dual porosity | wellbore storage, constant pressure, radial | storage, the matrix dip, total-system radial |
| closed rectangle | radial, then boundary | correct |
| horizontal well | radial, linear, bilinear, radial | vertical radial, linear, transition, pseudoradial |
| fractured well | linear, bilinear, radial | fracture linear flow, transition, radial |

One fixture out of seven is reported without a false label. Every other one names at least one regime that is not there.

## Mechanism one: a fall between two regimes

The classifier's constant-pressure band is any slope at or below minus 0.35. Steep falls are supposed to mean recharge.

But the derivative also falls steeply whenever it is coming DOWN from something to something lower. The storage hump falls to the radial plateau. A dual-porosity derivative falls into its matrix dip. Both are steeper than minus 0.35 over part of their length, and both get labelled recharge.

On the buildup this produces a segment labelled "Constant-pressure boundary / recharge" spanning nearly a decade of equivalent time, in a fixture built from an infinite-acting solution with no boundary in it of any kind.

## Mechanism two: a rise between two plateaus

The bilinear band is 0.16 to 0.34. A gentle rise is supposed to mean flow along a finite-conductivity fracture.

But the derivative also rises gently whenever it is climbing from one plateau to a higher one. That is exactly what a sealing fault does: the derivative sits at the radial value, then climbs towards twice that value as the fault's image well is felt.

The climb is slow, because the doubling is asymptotic. Its local slope spends a long stretch inside the bilinear band. So on the fault fixture the engine reports bilinear flow between about 25 and 123 hours, in a test with no fracture in it.

## Why this is not a bug worth hiding

It is a limitation of a slope-band classifier, and the honest response is to teach it rather than to work around it.

A classifier that refused to label anything it could not be sure of would label almost nothing, because transitions occupy as much of a real derivative plot as regimes do. A classifier that used order logic would need a model of what reservoir it was looking at, which is the thing being determined.

The label is a reading aid. It says: here is a stretch whose slope is close to a canonical value. What that stretch IS remains an interpretation, and it is yours.

## The two checks that catch every case in the table

**The order check.** Is this regime possible here, given what came before?

Recharge cannot precede radial flow: an aquifer that had already been felt would have kept the pressure up from the start. Bilinear fracture flow cannot follow two hundred hours of radial flow: fracture flow is near-well geometry and it happens first or not at all. Linear flow at 0.01 hours in a well with no fracture is storage, not a channel.

**The height check.** Does the level make sense?

A stretch labelled radial should sit at 70.6 q B mu / (k h) for a plausible k. The fault fixture's SECOND radial stretch sits at 17.483282190120867 psi against an early plateau of 9.906923653538167 psi. Both cannot be the reservoir's permeability, and the ratio between them is the diagnosis.

## The rule

A regime label needs three things before it is a diagnosis: the slope is in the band, the segment is long enough, and the regime is possible at that point in the sequence. The software supplies the first two. You supply the third.

## Exercise

Take the table above and, for each false label, write down which of the two mechanisms produced it.

Then propose one extra rule that a classifier could apply to eliminate the false labels in this course without discarding any real regime, and say what that rule would cost on a reservoir this course does not contain.
