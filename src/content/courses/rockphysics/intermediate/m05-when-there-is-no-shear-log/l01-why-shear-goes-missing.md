# Why shear goes missing

Every calculation in this tier so far has used a shear velocity. Most wells do not have one. This module is about what to do then, and it starts with why the gap exists.

## What records shear

A dipole sonic tool. It excites a flexural wave in the borehole wall and records the shear arrival, and it is a standard part of a modern logging suite.

It is not a standard part of an old one. Monopole sonic tools, which dominated logging until the 1990s, record the compressional arrival well and the shear arrival only in fast formations, where the shear velocity exceeds the velocity of sound in the borehole mud. In slow formations, which includes most shallow sands and nearly all shales, a monopole tool records no usable shear at all.

## The consequence for a field

Field datasets are usually a mixture. A few recent wells have dipole shear over the reservoir interval, and the older wells, which are often the ones that define the field, do not.

That matters for this tier because every substitution needs $\mu$, and $\mu$ needs $v_s$. Without it there is no shear modulus, no separation of the bulk modulus from the compressional velocity, and no substitution.

It also matters because the Expert tier's AVO gradient depends almost entirely on the shear contrast, as the next tier shows. A well with no shear log cannot contribute to an AVO model without an estimate.

## The other reasons it goes missing

Shear can be absent even where a dipole tool was run.

The interval may not have been logged, because the tool was run over a different section.

The data may be present and unusable: cycle skipping, poor hole conditions, or a washed out borehole that the flexural mode never coupled to properly.

Or the shear may be measured but not at the depth wanted. A substitution is done at a reservoir depth, and the log may cover the reservoir but not the specific bed.

## The estimator's own assumption

Every method in this module estimates shear from compressional velocity through an empirical relation. Those relations were fitted to brine saturated rocks.

That has a strict consequence for the order of operations, and it is the subject of the last lesson in the module: estimate the shear velocity first, on the brine case, and substitute the fluid afterwards. Estimating shear from a gas sand's compressional velocity applies a brine relation to a rock that is not brine saturated, and gets it wrong in a predictable direction.

That ordering trips people up because it feels backwards. The estimate is needed to do the substitution, so it must come first, and the relation used to make it only holds for the state the rock is in before the substitution. Those two happen to be compatible, and only because the log is a brine log.

## Worked example

Work out what is actually missing when the shear log is absent, by listing what can still be computed for the Ekene sand.

With the compressional velocity of 3200 m/s and the density of 2250 kg/m3, and no shear, you have $\rho v_p^2 = 23.04$ GPa, which is $K + \tfrac{4}{3}\mu$ and not either of them.

You cannot separate the two. You cannot get $\mu$, so you cannot get $K_{sat}$, so inverse Gassmann has nothing to work on.

One quantity, two unknowns. That is the whole problem, and it is why an estimate of one of them unlocks everything.

## Exercise

State which of these can be computed for a rock with a compressional velocity and a density but no shear log: acoustic impedance, shear modulus, saturated bulk modulus, the quantity $K + \tfrac{4}{3}\mu$.

Self check: acoustic impedance can be computed, since it is density times compressional velocity and needs no shear. The quantity $K + \tfrac{4}{3}\mu$ can be computed, since it is density times the square of the compressional velocity. Neither the shear modulus nor the saturated bulk modulus can be computed, because separating them requires a second measurement, which is exactly what the shear log would have provided.
