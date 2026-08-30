# Cemented, and not cemented

One fact about the tubing changes every calculation in this tier.

{{panel:ct-tubing-explorer}}

## The fact

Casing is cemented. Tubing is not.

A cemented casing string is bonded to the rock along its whole length. It cannot move, it cannot buckle, and its length is fixed by the cement rather than by anything it does.

A tubing string hangs from the wellhead, runs down the inside of the casing with fluid all around it, and lands in a packer near the bottom. Nothing holds its middle.

## What follows

**It can change length.** Heat it and it grows. Pressure it and it shrinks. Neither of those does anything to a cemented casing and both of them do something to tubing every day of the well's life.

**It can push and pull on the packer.** Whatever length change is prevented shows up as a force at the packer instead, and the packer has a rating.

**It can buckle.** A free string in compression inside an oversized hole goes sinusoidal and then helical, and a cemented one cannot.

## The three things that change

Only three inputs move over the life of a completion:

1. The pressure INSIDE the tubing.
2. The pressure in the ANNULUS outside it.
3. The TEMPERATURE of the steel.

Every force in this tier comes from a CHANGE in one of those three from the condition at which the packer was set.

## Which is why everything is a delta

The engine's tubing function does not take pressures. It takes pressure CHANGES, and a temperature CHANGE, measured against the state the string was in when it was landed and the packer set.

    loadCase: { dPiPa, dPoPa }
    tempProfile: { deltaOpC }

A string that has never been produced, never been pumped into and never warmed up has zero force at its packer from all three mechanisms, whatever the absolute pressures are.

## The string this tier uses

3-1/2 inch 9.3 lb/ft tubing, 2500 m long, inside 7 inch 29 lb/ft casing, landed in a packer with a 4 inch seal bore, rated to 670000 N, with 1.5 m of stroke.

## Exercise

Name the three inputs that change over the life of a completion.

Then say, for each of the seven casing load cases in the Professional tier, whether it is a change in one of those three or something else entirely.
