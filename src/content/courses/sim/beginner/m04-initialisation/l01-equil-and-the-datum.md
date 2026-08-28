# EQUIL and the datum

The SOLUTION section says where the fluids were before anyone produced anything. It is one keyword and one line, and that line decides the initial state of all 4500 cells.

## The line

EQUIL takes a datum depth, the pressure at that depth, and the contacts. For Ekene:

    datum depth        the grid's mean column top
    pressure at datum  3200 psia
    oil-water contact  5118.110236220472 ft

The datum depth is the grid's MEAN column top, computed from the 900 TOPS values.
This tier does not quote the number, because computing it from the surface is an
Expert exercise; what matters here is knowing what it IS. The pressure is Ekene's initial reservoir pressure, the same 3200 psia the Material Balance course started its tank from. The contact is the mapped 1560 m, converted.

{{panel:sim-deck-explorer}}

Open SOLUTION. It is nine lines for a model that took 137 lines to build.

## What a datum is

A reference depth, and nothing more. It is not the top of the reservoir, not the contact, and not the middle of anything in particular. It is the depth at which you are quoting a pressure.

Any depth would do, provided the pressure you quote is the pressure at THAT depth. Quote 3200 psia at a datum 100 ft shallower and you have described a different reservoir, one whose pressure at the original depth is higher by whatever the fluid gradient gives over 100 ft.

So the pair is what matters. A pressure without its datum is not a pressure, and a deck that changes datum without changing pressure has silently repressurised the field.

## The datum here sits below the contact

The mean top is about 12 ft DEEPER than the 5118.11 ft contact. That looks odd until you see where it came from: it is the average of all 900 column tops, and more than half of Ekene's columns sit below the contact in the water leg. The average of a surface that is mostly wet lands below the contact.

Nothing is wrong with that. A datum in the water leg is perfectly legal, and the pressure quoted there is the water-phase pressure at that depth. It is only surprising if you expected the datum to mean something physical, which it does not.

## What the simulator does with it

It puts every fluid where gravity would have put it.

Starting from the known pressure at the datum, it integrates each phase's density upward and downward to get a pressure at every depth. Above the contact it uses the oil density, below it the water density. Then, cell by cell, it assigns a saturation from which side of the contact the cell sits on.

The result is a static, gravity-consistent initial state with no flow anywhere. That is what equilibration means: the model starts at rest.

## Why this matters more than it looks

Because the initial state fixes how much oil the model contains, and that is the number every forecast is a fraction of. Get the contact wrong by 10 ft and the oil in place moves. Get the datum and pressure pair inconsistent and the whole pressure field is offset, which changes every well's drawdown from the first timestep.

Equilibration is nine lines and it decides more than the 137 lines above it.

## The misconception to avoid

"The datum should be at the crest, or at the contact, or at the middle of the reservoir." It should be wherever you have a pressure measurement you trust, because that is what the pair is for. Conventions vary between companies and none of them is more correct. What is not optional is stating the depth alongside the pressure, every time.

## Exercise

First, the contact is at 5118.110236220472 ft and the datum is the mean of the 900 column tops, which falls below it. Explain why the mean of a mapped surface can fall below a contact, without computing the mean.

Second, a colleague moves the datum 50 ft shallower and leaves the pressure at 3200 psia. Describe what has changed about the model.
