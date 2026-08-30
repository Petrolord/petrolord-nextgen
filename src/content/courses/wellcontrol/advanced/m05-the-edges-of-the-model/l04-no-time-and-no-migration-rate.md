# No time, and no migration rate

The axis the model does not have.

## What is missing

A clock. Every calculation in this course is a state rather than a history.

The shut-in pressures are read at one moment. The kill sheet describes a sequence in STROKES rather than in time. The kick tolerance asks about one configuration.

## What happens in time that matters

**Gas migrates.** At 100 to 300 metres an hour, in a shut-in well, carrying its pressure with it and raising both gauges.

**Gas dissolves and comes out of solution** in an oil-based mud, on a timescale set by the pressure history.

**The formation keeps flowing** while the well is underbalanced, at a rate set by its permeability and the underbalance.

**The mud gels** while the pumps are off, which is the previous course's subject and which raises the pressure needed to restart.

## Which of them the model would most need

Migration, because it changes the shut-in pressures while nothing is being done, and because it is what makes waiting expensive.

A migration rate and a clock would let the engine say how long a well can be held before the casing pressure reaches the MAASP.

That is a genuinely useful number and it is not computed here.

## What is done instead

Volumetric control: a procedure that bleeds mud in measured increments as the pressure rises, holding the bottom hole pressure constant while the gas rises.

It is arithmetic done at the wellsite, on a sheet, with a trip tank. It is not in this engine and it is standard.

## Why the kill sheet uses strokes rather than time

Because strokes measure VOLUME, and volume is what displaces. Time only measures volume if the pump rate is constant, and the pump rate is one of the things that can change.

A schedule in strokes survives a rate change; a schedule in time does not.

That is a deliberate and good design choice, and it is why the model can be time-free and still describe an operation that takes hours.

## What that leaves out

Everything that depends on elapsed time rather than on pumped volume: migration, dissolution, formation inflow, and gelling.

Four things, all of which happen during the waiting rather than during the pumping.

## Exercise

A well is shut in with gas at the bottom and held for three hours while kill mud is built, with migration at 150 metres per hour.

Estimate how far the gas has risen and, using the mud density, how much both surface gauges have risen. Compare against the MAASP.
