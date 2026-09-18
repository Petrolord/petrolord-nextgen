# The barometer is an input

A bay on a plateau breathes thinner air. The duty of an air cooler is set by air density, so the barometric pressure belongs on the input sheet beside the ambient temperature, and this module takes it there rather than assuming sea level.

{{panel:fc-rating-explorer}}

## One bay at four barometers

| barometric pressure, psia | air density, lb per ft3 | actual ft3 a minute | fan brake horsepower |
| --- | --- | --- | --- |
| 14.700000 | 0.071139633 | 581948.0744 | 84.515865 |
| 14.300000 | 0.069203861 | 598226.3422 | 86.879945 |
| 13.200000 | 0.063880487 | 648078.5374 | 94.119941 |
| 12.000000 | 0.058073170 | 712886.3911 | 103.531935 |

Those rows are ANTAN, whose own design barometer is 14.300000 psia, so the second row is its design sheet and the other three are the same bay moved uphill. Read the columns in order. As the barometer falls the density falls, so the same mass of air occupies more volume, so the fan turns harder for it. Three directions, one cause, and the engine reports the density and the volume beside the horsepower so the chain is visible rather than implied.

The table computes no ratio between any two of its rows and neither should a reader. A figure formed by dividing one row by another is a figure nothing here stands behind. What the table licenses is the direction, and the direction is the whole lesson.

## The density on its own

The air density is an ideal-gas density and it can be asked for directly. At 60.000000 degF and 14.700000 psia it returns 0.076341600 lb per ft3.

That export is the one place in this module where an answer is a bare number rather than an object with an error key. The module documents the exception rather than making it silently: a leaf correlation has nowhere to put an error key. Below absolute zero it returns a bare NaN, and the bay that calls it turns that into a named refusal rather than passing it on.

## Why this is the honest shape

A caller reading a bare number has one guard to write and a caller reading an object has another, so a module with two shapes has to say which is which. Eleven of this module's doors and the bay itself answer with an object carrying a named error string. Two exports sit outside that contract: this density, and the one that hands back a copy of the held bundle table.

Counting the exceptions and naming them is cheaper than a contract with silent holes in it. The module states both exceptions and the reason for each, so a caller can write one guard for the twelve and two lines for the pair that sit outside them. A guard written against a shape that changes without notice is a guard that fails on the day it matters.

## What a barometer does not change

The rating in the next module holds the surface and the air mass. A barometer moves the volume the fan handles and therefore the fan power, and the bundle it blows through is the same bundle. Keep the two questions apart: one is about the machine that moves air, and the other is about the metal the air passes over.

## Exercise

Record the four barometers with the density, the volume and the fan power each one produces. State the direction each column moves and say why a ratio between two rows would be a figure without a source. Then record the density at 60.000000 degF and 14.700000 psia and name the two exports that sit outside this module's error contract.
