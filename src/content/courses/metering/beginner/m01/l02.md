# Reading one orifice result line by line

{{panel:fc-meterrun-explorer}}

One result, read slowly. This is the ABOH gas export run, and the whole of this
module is knowing what each line of it is. Seven of the lines are stated by the
engineer. Nine come back from the engine.

## What you state

| quantity | value |
| --- | --- |
| pipe bore, in | 6.065000 |
| orifice bore, in | 2.926500 |
| differential, in H2O | 63.800000 |
| static pressure, psia | 815.200000 |
| flowing density, lb/ft3 | 2.617800 |
| viscosity, cP | 0.012100 |
| specific heat ratio | 1.270000 |

The pipe bore of 6.065000 in and the orifice bore of 2.926500 in are geometry.
The differential of 63.800000 in H2O is what the transmitter reads. The static
pressure of 815.200000 psia, the flowing density of 2.617800 lb/ft3, the
viscosity of 0.012100 cP and the specific heat ratio of 1.270000 describe the
gas at the plate on the day.

## What comes back

| quantity | value |
| --- | --- |
| beta | 0.482523 |
| discharge coefficient | 0.602223 |
| expansibility | 0.999181 |
| pipe Reynolds number | 2117151.4444 |
| mass flow, lb/hr | 24602.3337 |
| volume at flowing density, ft3/hr | 9398.0952 |
| differential, psi | 2.304922 |
| beta inside the published range | true |
| warning | null |

The beta of 0.482523 is the ratio of the two bores and it is the single number
the rest of the result turns on. The discharge coefficient of 0.602223 is
computed for this beta and this Reynolds number, and module two is about why it
is computed rather than looked up. The expansibility of 0.999181 accounts for
the gas expanding through the plate, and module three is about what that factor
is worth. The pipe Reynolds number of 2117151.4444 places the run on the
correlation.

Then the answers. A mass flow of 24602.3337 lb/hr is the custody quantity here.
The volume of 9398.0952 ft3/hr is at the flowing density, and the next lesson
but one is about how carefully the engine says so. The differential of 2.304922
psi is the same differential the transmitter read, in the units the equation
wants.

## Stated and returned are different kinds of line

It is worth being strict about the difference. A stated line is an input you are
responsible for, and the engine will do arithmetic on whatever you give it. A
returned line is the engine's own work, and it is the only kind of line you may
quote back as a result. Confusing the two is how a meter run ends up defended
with a number that was typed into it. The flowing density is the clearest case
on this sheet. Nothing in this module derives it from the static pressure, the
temperature or a composition, so it arrives as a stated figure and every flow
that follows inherits whatever error it carries.

## The two lines that are a verdict

The last two lines carry no units and they are the ones an operator should read
first. Beta inside the published range comes back true, which says the
coefficient above is an evaluation of a published correlation and is not an
extrapolation of it. The warning comes back null, which says the engine found
nothing about this run worth flagging. Both of those lines can come back
differently on a run you build yourself, and when they do, the flow figure has
not stopped being printed. It has stopped being trustworthy in the same way.

## Exercise

Take the beta of 0.482523 and the returned flag beside it. Say which of the two
stated bores you would have to change, and in which direction, to make that flag
come back false.
