# What agreement proves

Two kinds of check, and what each one is worth.

## The independent implementation

A separate program over the same geometry, the same convention and the same formulas, written by a different author.

**It eliminates:** transcription errors, sign errors, unit errors, misread formulas. Between them, most of the defects that actually occur.

**It does not eliminate:** a shared misreading of the convention, or anything about the convention itself.

## The hand example

Fifteen round inputs and six answers checkable in one line of arithmetic each.

**It eliminates:** everything the implementation check does, plus a shared misreading, because the arithmetic is available to anyone.

**It does not eliminate:** anything about the model. Single bubble, isothermal, vertical hydrostatics, surface BOP.

## The four assumptions both share

**A single bubble.** The influx is one continuous column with mud above and below. Real influxes are dispersed and mix.

**Isothermal expansion.** Boyle, with no temperature change as the gas rises. A rising gas cools, which reduces the expansion, so the model is conservative here.

**Vertical hydrostatics.** Pressures are computed from true vertical depth with no friction and no dynamics.

**A surface blowout preventer.** No riser, no choke line friction, no subsea stack. On a floating rig the choke line friction is a substantial correction and it is absent.

## Which of the four matters most

The surface BOP assumption, on any offshore floating operation.

The choke line on a deepwater rig can be several thousand metres long and its friction is tens of bar at a slow circulating rate. Every pressure in the sheet shifts by that amount, and the standard procedure has a specific correction for it.

## What this course's agreement claim is

That the engine implements the stated convention correctly, verified against an independent implementation to better than 1e-6 and against a hand calculation exactly.

That is as strong a verification claim as any course in this series makes, and it is still a claim about the code rather than about a well.

## The habit

State which of the two checks a number passed. Agreeing with another program and agreeing with arithmetic are different claims, and the second is the stronger one.

## Exercise

For each of the four shared assumptions, say whether it makes the computed kick tolerance larger or smaller than the truth.

Two of them are conservative and two are not, and knowing which is which is what the Expert tier's last module is about.
