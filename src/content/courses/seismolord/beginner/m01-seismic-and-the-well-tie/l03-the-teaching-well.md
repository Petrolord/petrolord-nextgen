# The teaching well

Every number in this course comes from one file: `basic_20.las`. It is the clean LAS 2.0 export you already met in the Well Data course, the one used there as the well-behaved reference against which the broken files were compared. Reusing it here is deliberate. You have already QC'd this well, so nothing about the input is in doubt, and every surprise you meet from module 2 onward belongs to the synthetics workflow rather than to the data.

## What is in the file

The file is small enough to hold in your head, which is the point of a teaching dataset.

| Property | Value |
| --- | --- |
| Depth range | 1500 to 1650 m |
| Sample step | 0.5 m |
| Sample count | 301 |
| Null value | -999.25 |

The arithmetic is worth confirming rather than accepting. An interval of 150 m sampled every 0.5 m gives 300 steps, and 300 steps means 301 samples because both ends are included. That off-by-one is the classic error in log processing, and it will matter again in module 4 when 301 impedance samples produce 300 reflection coefficients.

Five curves are present:

| Mnemonic | Meaning | Unit |
| --- | --- | --- |
| DEPT | Measured depth | M |
| GR | Gamma ray | GAPI |
| RHOB | Bulk density | G/C3 |
| NPHI | Neutron porosity | V/V |
| DT | Sonic interval transit time | US/M |

Note the units carefully, because two of them are the ones a synthetic can silently ruin. Depth is in metres, not feet. Density is in grams per cubic centimetre, written `G/C3` in the header, not kilograms per cubic metre. Sonic is microseconds per metre, `US/M`, not microseconds per foot. A file with the same numbers under imperial mnemonics would produce a synthetic that looked entirely respectable and was wrong throughout.

## Only two curves build a synthetic

Of the five curves, a synthetic seismogram uses exactly two.

**DT**, the sonic interval transit time, records how many microseconds a compressional wave takes to travel one metre of formation. It is a slowness, so it is the reciprocal of velocity, and module 2 opens by inverting it. Slow rock has a large DT.

**RHOB**, bulk density, records the mass per unit volume of the formation including whatever fluid fills the pores. Multiplied by velocity, it gives acoustic impedance, and impedance contrasts are what reflect.

GR and NPHI are not used here at all. They are the petrophysical curves: gamma ray drives shale volume, neutron porosity pairs with density for porosity and lithology. They are in the file because it is a general-purpose teaching well, which is why the same file serves the Petrophysics course too. That narrowing is itself a useful lesson. The sonic and density pair carries the entire acoustic description of the well, and if either one is bad the synthetic is unrecoverable no matter how healthy the rest of the suite looks.

## Anchor values

Four numbers from this well will follow you through every remaining module. Commit them to memory now so that when they reappear you recognise them rather than recompute them from scratch.

At the top of the log, 1500 m:

* DT is 399.737 us/m
* RHOB is 2.1893 g/cc

At the base of the log, 1650 m:

* DT is 277.473 us/m
* RHOB is 2.2724 g/cc

Read those four values as a story about the section. DT falls from about 400 to about 277 us/m over 150 m, meaning the rock transmits sound substantially faster at the base than at the top. Density rises from 2.1893 to 2.2724 g/cc over the same interval. Both trends point the same way, which is what normal compaction looks like: deeper rock is tighter, denser and faster. Because impedance is the product of velocity and density, and both factors increase downward, impedance increases downward too and does so faster than either factor alone. Module 2 turns these four numbers into impedance values.

## The mean sonic velocity

One summary statistic from this well is graded directly in the Associate capstone, so it deserves its own definition.

The **mean sonic velocity** over the log is 3145.29 m/s. Two details of that definition matter more than the value.

First, it is computed over all 301 finite DT samples, so it is an average over the whole logged interval from 1500 to 1650 m with nothing trimmed. Second, it is a mean of velocities, not the reciprocal of a mean of slownesses. Those are different quantities and they do not agree, because averaging is not preserved by taking reciprocals. If you average DT first and then invert, you get a different answer, and the capstone will mark it wrong. Compute velocity sample by sample, then average.

The word finite in that definition is doing real work. A curve with nulls in it must have those samples excluded before averaging, or the sentinel value contaminates the result. In `basic_20.las` the DT curve is complete, so all 301 samples are finite and the denominator is 301. That is a property of this well, not a rule. In your own data the count will usually be lower than the sample count.

## Exercise

Without looking back, state the sample count of `basic_20.las` and explain in one sentence why it is not 300. Then, using the anchor values, say whether velocity at 1650 m is higher or lower than at 1500 m and justify it from DT alone. As a self-check: the count is 301 because both endpoints of the 150 m interval are sampled at a 0.5 m step; velocity is higher at the base because DT falls from 399.737 to 277.473 us/m and velocity is the reciprocal of slowness. Finally, write one sentence on why the mean sonic velocity must be computed as the mean of the 301 velocities rather than the reciprocal of the mean DT.
