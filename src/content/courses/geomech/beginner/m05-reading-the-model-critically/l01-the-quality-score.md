# The quality score

A number that says how much to trust the profile.

{{panel:gm-stress-explorer}}

## What it checks

Three things, and it starts at 100.

**Stress ordering.** In a normal faulting regime the overburden should be the largest stress, and SHmax should be at least as large as Shmin. Pore pressure should not exceed Shmin. Any sample breaking any of those is a violation.

**Missing samples.** Any null or non-finite value in any of the four profiles.

## The deductions

Twenty points if any ordering violation exists, fifteen if any sample is missing. Both are flat deductions rather than counts: one violation costs the same twenty as fifty.

## What this profile scores

**80 out of 100**, with one warning:

    23 samples violate the NF-regime stress ordering or have PP above Shmin.

## Reading that

Twenty-three of 52 samples, which is 44 percent of the profile, are in a stress state the run says it is not in.

That is not a small anomaly at the edge of the data. It is nearly half of it.

## Why a flat deduction is the right design

Because the score is a flag rather than a metric. Its job is to make somebody look, and a score of 80 with a named warning does that.

A score that fell smoothly with the violation count would invite treating 91 as acceptable and 89 as not, which is a false precision on a diagnostic.

## What it does not check

**Whether the values are right.** A profile can score 100 and be completely wrong, if it is internally consistent and complete.

**Whether the model applies.** Nothing here knows about salt, faults, or a well drilled through a formation the correlations were never calibrated on.

So a good score is a necessary condition and nowhere near a sufficient one.

## How to use it

As the first thing you read. If the score is below 100, read the warning before reading any output, because the warning tells you which part of the profile to distrust.

## Exercise

In the panel, turn the tectonic strain multiplier down to zero and read the quality score again.

Then turn it up to 2 and read it once more, and say what that tells you about which input is responsible.
