# Piston

Pressure acting on an area difference at the packer.

{{panel:ct-tubing-explorer}}

## The formula

    piston = (Ap - Ai) x dPi - (Ap - Ao) x dPo

Two terms, opposite signs, each a pressure change times an area difference.

## Where it comes from

Draw a control volume around the bottom of the tubing where it enters the packer.

The bore pressure acts upward on the annular area between the seal bore and the tubing bore, because that is the projected area the bore fluid sees at the change of section. The annulus pressure acts downward on the annular area between the seal bore and the tubing outside.

Neither pressure acts on the seal bore area itself, because the seals transmit it to the packer rather than to the tubing.

## The areas on this string

    Ap - Ai = 0.0035712418834005005 square metres
    Ap - Ao = 0.0019001530466156167 square metres

The bore area is 1.879 times the annulus one, so a pascal of bore pressure is worth nearly two pascals of annulus pressure and they act in opposite directions.

## Worked, three times

**Production heating,** 10 MPa on the bore and nothing on the annulus:

    0.0035712418834005005 x 10000000 = 35712.418834005 N

**Injection cooling,** 20 MPa on the bore: exactly twice that, 71424.83766801 N, because the term is linear.

**Stimulation,** 45 MPa on the bore and 5 MPa on the annulus:

    0.0035712418834005005 x 45000000 - 0.0019001530466156167 x 5000000
    = 160705.88475302252 - 9500.765233078084
    = 151205.11951994442 N

## What annulus pressure is for

That third case is the point. Holding 5 MPa on the annulus during a stimulation removes 9500 N of piston force, and it does more than that: it also reduces the ballooning term and it supports the tubing against burst.

Annulus pressure during a treatment is a deliberate operational tool and not an accident, and this is the term that quantifies the first part of its benefit.

## What the piston force does not do

It does not depend on the length of the string, or on the temperature, or on the fluid densities. It is an end effect at the packer, and it would be the same on a 500 m string.

## Exercise

Compute the piston force for a case with 30 MPa on the bore and 12 MPa on the annulus.

Then find the annulus pressure at which the piston force would be exactly zero for a bore pressure change of 30 MPa.
