# Shear first, or no rate at all

{{panel:fc-inhibitor-integrity-explorer}}

The whole screening computes the wall shear before it computes the rate. That
ordering is forced by the coupling: the rate depends on whether the corrosion
inhibitor film survived, so the shear has to be known first. It has a
consequence that surprises people the first time they hit it. A shear that
cannot be computed means the screening is incomplete, and no rate is issued at
all.

## Four blank boxes, four refusals

| what was left blank | what the screening did |
| --- | --- |
| the density | screening incomplete: the inhibitor film survival check did not run. wall shear stress needs a positive density |
| the viscosity | screening incomplete: the inhibitor film survival check did not run. wall shear stress needs a positive viscosity |
| the velocity | screening incomplete: the inhibitor film survival check did not run. wall shear stress needs a positive velocity |
| the line inside diameter | screening incomplete: the inhibitor film survival check did not run. wall shear stress needs a positive line inside diameter |

Each message has two halves. The first half says which check did not run and
therefore why the whole screening stopped. The second half names the box. A
reader gets both the cause and the fix out of one sentence.

## Why a missing density is not a missing row

A density is a fluid property and it feels remote from a corrosion rate. On a
screen that computed the rate independently, leaving it out would cost you a
wall shear row and nothing else. Here the rate depends on the shear verdict, so
an absent density means the module does not know whether the corrosion inhibitor
credit applies, and a rate issued without knowing that would be one of two
different numbers with no way to tell which.

Recall the size of the difference. Take the shipped case to 60 ft per second and
the rate is 13.080024 mm/yr with the credit removed and 1.896603 mm/yr with it
kept. Issuing a rate while the credit question is open would be issuing one of
those two figures at random.

## The order the screening runs in

The sequence is stated rather than implied: the wall shear first, then the
rate, then the rate the datasheet efficiency would have given, and only then
the sour comparison, the regime, the withholding, the band label, the remaining
life and the binding constraint. Every step after the first is allowed to
depend on the shear verdict, and reading the order tells you which parts of the
screen are hostage to which inputs.

## Refusing is the conservative act here

There is always a tempting alternative: compute the rate with the credit kept,
print the shear row as unavailable, and let the reader notice. That produces a
complete looking screen with the lower of the two rates on it and a gap the
reader has to spot. The module refuses instead, and the refusal is loud.

This is the pattern worth carrying out of the module. When one result decides
which of two calculations is correct, an unavailable input for that result is
not a missing row. It is a missing answer, and printing the more comfortable of
the two candidates is a choice somebody made on the reader's behalf.

## Exercise

Run the shipped case with the density box blank and record exactly what the
screening returns. Do the same with the viscosity blank. State which two pieces
of information each message gives you, and say why the module will not issue a
rate while the shear is unavailable.
