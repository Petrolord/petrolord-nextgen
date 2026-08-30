# What it is, and what it is not

One dimensionless number carrying four different physical effects.

{{panel:td-friction-explorer}}

## What the model does with it

It multiplies the normal force to give a friction force:

    friction = mu x N

That is Coulomb friction, the oldest model there is, and in the soft-string calculation it is applied at every point along the string.

## What it is called

The friction FACTOR, deliberately not the friction COEFFICIENT.

A coefficient of friction is a property of two materials in contact, measurable in a laboratory, and for steel on steel or steel on rock it is in the range 0.15 to 0.4.

A friction factor is a fitting parameter. It has the same units, it enters the same equation, and it is not the same thing.

## The four things it absorbs

**Genuine sliding friction** between the tool joints and the wall. This is the part the name suggests.

**The stiffness the soft-string model discarded.** A real string bridges doglegs and contacts at points. The extra local force shows up as extra friction, and it lands in the factor.

**Cuttings.** A bed of cuttings on the low side of an inclined hole is something the string has to plough through. That is not friction between two surfaces at all; it is a drag force, and it lands in the factor.

**Everything else that was left out.** Hydraulic effects, thermal effects, a survey that does not describe the hole accurately, a string description with the wrong tool joint size.

## Why that matters

Because a friction factor of 0.35 in open hole is not a statement that the rock has a coefficient of friction of 0.35.

It is a statement that a model with several known omissions reproduces an observed hookload when this number is used. Change the model and the number changes. Change the hole cleaning and the number changes without the rock changing at all.

## The consequence for interpretation

A rising friction factor over a few days of drilling is one of the most useful signals on a rig, and it almost never means the rock got rougher.

It means the hole is getting dirtier, or a ledge has formed, or the string is starting to stick. The factor is a summary statistic for everything the model cannot see, which is exactly what makes its TREND informative even though its VALUE is not a material property.

## The misconception to avoid

"We measured a friction factor of 0.32 in that formation." Nobody measured it. It was fitted, in a particular hole, with a particular model, on a particular day, and it is not transferable to a different hole in the same rock without saying so.

## Exercise

Open the panel's sweep view on the build-and-hold well and note the pick-up hookload at 0.15 and at 0.50.

Then list, for each of the four things the factor absorbs, one physical change on the rig that would move the fitted value without any of the others changing.
