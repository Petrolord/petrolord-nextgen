# A volume at the flowing density is not a standard volume

The ABOH run returns a volume of 9398.0952 ft3/hr. It is a real number, it came
out of the engine, and it is the wrong number to put on a ticket. This lesson is
about the words on that line.

## What the engine actually labelled

The line is called the volume at the flowing density, and the engine names it so
on purpose. There is no base pressure and no base temperature anywhere in this
function, so nothing on this line is a standard volume. That single sentence is
the whole finding, and it is worth unpacking slowly because the arithmetic is so
innocent.

The mass flow of 24602.3337 lb/hr is divided by the flowing density of 2.617800
lb/ft3 that you stated, and the result is 9398.0952 ft3/hr. The division is
correct. What it gives you is the space the gas occupied at the pressure and
temperature it was at when it passed the plate, which on this run means a static
pressure of 815.200000 psia.

## Why a volume needs a reference before it is a quantity

Gas is compressible, so a cubic foot of it is a quantity of gas only once you
say at what pressure and temperature that cubic foot was measured. A thousand
cubic feet at line conditions and a thousand cubic feet at standard conditions
are different amounts of molecules, and the difference is not small when the line
is at 815.200000 psia. Custody transfer is therefore done in mass, or in a
volume corrected to a stated base pressure and base temperature by a published
procedure.

This module carries no such procedure. It has no base pressure input, no base
temperature input, and no correction tables, so there is nothing in it that
could turn a flowing volume into a standard one even if you asked. The
compressibility factor at the flowing condition is not in this function either.

## What to do with the line

Treat it as what it is. A flowing volume is useful for sizing a line, checking a
velocity, estimating a residence time or sanity-checking a mass flow against a
density you believe. It is not a sales quantity and it is not comparable with a
figure from another meter unless that other meter was at the same conditions,
which it never is.

The pattern repeats in module four, where a turbine meter returns a gross volume
and the engine attaches a sentence saying what would be needed to make it a
custody quantity. In both places the engine's habit is the same one worth
copying. It prints the number, and it prints what the number is, and the second
half is the part people delete when they build a report.

## Exercise

Point at the four stated inputs on the ABOH sheet that would have to be joined
by two more before a standard volume could exist here. Name the two missing
inputs.
