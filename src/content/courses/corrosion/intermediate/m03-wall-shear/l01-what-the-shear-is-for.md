# What the shear is for

{{panel:fc-inhibitor-integrity-explorer}}

This module computes a wall shear stress for one purpose: to decide whether a
corrosion inhibitor film survives on the steel. It is not an erosional velocity
check. This engine has no erosional-velocity criterion at all, it carries no
model of mechanical erosion or erosional wall loss from entrained solids or
liquid impingement, and the Casing and Tubing Design course at its Expert tier
is where the erosional velocity criterion is owned on this platform. The
comparison is a pivot between two courses rather than a derivation you can run
here.

## What the shear door returns

Given a velocity, a line inside diameter, a density and a viscosity, the door
returns this module's Reynolds number, the friction branch it landed in, this
module's friction factor, the wall shear in pascals and a film-risk word. On
the studio's shipped default case this module's Reynolds number is
416686.8569, the
branch is turbulent, the wall shear is 14.408065 Pa, the film risk is low and
the film is not stripped.

Both of those are this module's own quantities. The Pipeline and Line Sizing
course computes its own friction factor and its own Reynolds number for a pipe,
on a different correlation with a different transition, and the two will not
agree.

## Two thresholds, and both are held

The film-risk word comes from two numbers. Measured out of the engine, the
film-stripping threshold is 100.000000 Pa and the moderate band sits at
50.000000 Pa. Neither carries a source in this repository and the engine says
so in its own held list. That matters more here than it would for a cosmetic
label, because the stripping threshold now acts on the rate rather than only on
a colour.

| velocity m/s | Reynolds | wall shear Pa | film risk | is the credit removed |
| --- | --- | --- | --- | --- |
| 1.000000 | 63287.5636 | 2.302609 | low | false |
| 4.000000 | 253150.2545 | 27.920824 | low | false |
| 8.000000 | 506300.5091 | 97.225957 | moderate | false |
| 12.000000 | 759450.7636 | 201.718855 | high | true |
| 25.000000 | 1582189.0909 | 755.983414 | high | true |

## Reading that table

At 8.000000 m/s the shear is 97.225957 Pa, the word is moderate and the
corrosion inhibitor credit is still taken. At 12.000000 m/s the shear is
201.718855 Pa, the word is high and the credit is removed. Somewhere between
those two rows the module changes what it computes rather than only what it
prints, which is why the next module in this tier is about that coupling.

## Where the shear sits in the order

The whole screening computes the wall shear before it computes the rate,
because the rate depends on whether the film survived. That order has a
consequence a reader meets quickly: if a shear cannot be computed, no rate is
issued at all. A blank density is enough to stop the screening, and the module
says so rather than leaving the row empty.

## What the number is worth

The shear is a measurement of the flow and the verdict on it is a stated
convention, so a reader should hold the two at different levels of confidence
even though they arrive in the same row.

## Exercise

Record this module's Reynolds number, the wall shear and the film-risk word at
velocities of 4.000000, 8.000000 and 12.000000 m/s. Then record the two
threshold values the risk word is taken against and state which of your three
shear figures sits between them.
