# Working the capstone

Six numbers on a parameter set the lessons never ran.

{{panel:gm-stress-explorer}}

## What is asked

1. The **k0** the run uses.
2. The **frictional limit ratio q**.
3. **Shmin at 2000 m** of true vertical depth, in pascals.
4. **SHmax at 2000 m**, in pascals.
5. The **Horsrud UCS** for a core plug sonic reading, in pascals.
6. The **McNally UCS** for the same reading, in pascals.

## The settings

Not one of these is a value the lessons run on:

| parameter | capstone | lessons |
|---|---|---|
| Poisson ratio | 0.24 | 0.28 |
| friction angle | 26 deg | 32 deg |
| Young's modulus | 18000000000 Pa | 25000000000 Pa |
| tectonic strain epsX | 0.0002 | 0.0001 |
| tectonic strain epsY | 0.0005 | 0.0003 |
| Biot coefficient | 0.9 | 1 |
| SHmax azimuth | 105 deg | 60 deg |
| tensile strength | 2500000 Pa | 1000000 Pa |

The core plug reads **233 microseconds per metre**, which is not one of the profile's own sonic samples.

## The order

Fields 1 and 2 first: both are one line from a single input each, and both feed the two after them.

Fields 3 and 4 need the profile's overburden and pore pressure at 2000 m, the effective vertical stress from them at a Biot coefficient of 0.9, the burial term, the two strain terms, and then a check against the frictional bounds.

Fields 5 and 6 are independent of everything else. They need only the sonic reading and the two published correlations.

## The traps

**The Biot coefficient is 0.9, not 1.** It changes the effective vertical stress AND the pore pressure that gets added back, so it moves fields 3 and 4 in a way that does not cancel.

**The two strain terms differ.** Shmin takes epsX plus nu times epsY, and SHmax takes them the other way round. Swapping them swaps your two answers.

**Check the frictional bounds at 2000 m before reporting.** If either stress is clamped, the clamped value is the answer rather than the raw estimate. Work out whether it is.

**Field 6 is McNally, which takes slowness in microseconds per FOOT internally.** The reading is given in microseconds per metre. Getting the conversion wrong changes the answer by orders of magnitude rather than percent.

**Neither UCS field is the profile's own published UCS column.** That column was computed at the profile's own sonic samples with Horsrud, and 233 is not one of them.

## Two free checks

Field 2 must be smaller than the lessons' q of 3.254588303299863, because the friction angle is lower.

Field 1 must be smaller than the lessons' k0 of 0.38888888888888895, because the Poisson ratio is lower.

If either of yours went the other way, you have the formula upside down.

## Exercise

Before computing anything, predict whether field 5 or field 6 will be larger, using what module 4 established about where the two correlations cross.

Then compute both and check whether you were right.
