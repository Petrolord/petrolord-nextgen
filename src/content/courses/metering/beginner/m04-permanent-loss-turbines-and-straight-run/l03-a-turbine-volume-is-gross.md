# A turbine volume is gross and says so

A turbine meter counts. A rotor spins in the stream, a pickup counts the blades
going past, and the total is a number of pulses. Everything after that is
arithmetic and labelling, and the labelling is what this lesson is about.

## Pulses to a volume

| quantity | value |
| --- | --- |
| pulses | 2640000 |
| K factor, pulses per bbl | 848.200000 |
| meter factor | 1.002100 |
| indicated volume, bbl | 3112.4735 |
| gross volume, bbl | 3119.0097 |

The K factor is how many pulses the meter produces for one barrel, and it is a
property of that meter with that rotor in that service. Pulses divided by the K
factor is the indicated volume of 3112.4735 bbl, which is what the meter itself
believes.

The meter factor of 1.002100 comes from proving, which is the subject of the
next lesson. Applying it gives the gross volume of 3119.0097 bbl.

## What the engine attaches to it

Every call comes back with this sentence:

   > gross volume at metering conditions. A net standard volume needs the API MPMS
     temperature and pressure corrections, and this package carries neither, so this is not
     a custody transfer quantity

Three claims sit in it. The volume is at metering conditions, which means the
pressure and temperature the liquid was actually at while it was going through
the meter. A net standard volume would need the published temperature and
pressure corrections. This package carries neither of them, so what you are
holding is a gross volume and it is not a custody transfer quantity.

## Why the corrections exist

A liquid hydrocarbon expands as it warms. A barrel measured on a hot afternoon
holds less oil than a barrel measured at dawn, and the difference on a large
export parcel is money. The published procedures correct the metered volume back
to a stated base temperature and a stated base pressure, so that both sides of a
transfer are counting the same thing.

They are tables and procedures rather than a formula you can reconstruct from
first principles. This module does not carry them and says so in place of
approximating them, which is what module one did with the orifice volume.

## Indicated and gross are different claims

It is worth keeping the two volumes apart in your head. The indicated volume is
what the instrument said on its own, with no outside evidence involved. The
gross volume is that figure after the meter has been compared against a
reference, so it carries the result of a physical test that somebody performed
on a particular day. When a measurement is disputed, those are two different
conversations.

## The pattern across both meters

In this tier neither the orifice function nor the turbine function produces a
standard volume. Both return a volume, both label it, and both are explicit
about what is missing. A report that quotes either figure as a sales quantity
has removed the label, and the label was the part that made the number honest.

## Exercise

Take the indicated volume and the gross volume above. Say which of the two you
would send to a production database as a daily total, which you would send to a
custody ticket, and what would have to be added before the second question has
an answer at all.
