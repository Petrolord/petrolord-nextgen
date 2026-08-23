# Trust but verify

A header entry is not a measurement. It is a claim, written by whoever built the file, about what the data section is supposed to contain. Most of the time the claim is true. The whole value of a QC step is that it does not depend on that.

The habit is simple and it never changes: read the claim from the header, recompute the same quantity from the actual depth column and the actual samples, and compare the two. Agreement is a small piece of evidence that the file is what it says it is. Disagreement is a finding, and which of the two is wrong is a separate question you answer afterwards.

## The honest irregular file

Start with a file that tells the truth in an unusual way. Here are the framing entries of irregular_20:

```
STRT.M  1500.0000 : START DEPTH
STOP.M  1560.0000 : STOP DEPTH
STEP.M     0.0000 : STEP
NULL.   -999.25 : NULL VALUE
```

A step of zero is not a missing value and not a typo. It is the LAS convention for a file whose depth samples are not evenly spaced, and it is the export saying so out loud. There is no single increment to declare, so the file declares none.

Recompute and the claim holds up. The data section carries 121 samples, the first at 1500 m and the last at 1560 m, so there are 120 increments across the interval. Those increments are not constant: they cycle through 0.3, 0.5 and 0.7 m, forty of each. Their total is $40 \times (0.3 + 0.5 + 0.7) = 60$ m, which is exactly the 60 m span the header declares, so the average increment is $(1560 - 1500) / 120 = 0.5$ m even though no single increment equals 0.5.

The engine reaches the same conclusion mechanically. `uniformStepM` walks the depth vector, compares every increment against the first one within a small tolerance, and returns `null` the moment one does not match. For irregular_20 it returns `null`, which is the import telling you to treat the depth column as data in its own right rather than as arithmetic you can regenerate from STRT and STEP.

## The dishonest file that looks identical

Now imagine the same depth column exported by a tool that fills in `STEP.M 0.5000` because that is what its template always writes. The samples are unchanged, still 0.3, 0.5 and 0.7 m apart.

Work through the header-only checks and every one of them passes. STRT is 1500 and STOP is 1560, which is consistent. The expected sample count, $(1560 - 1500)/0.5 + 1 = 121$, matches the 121 rows in the file exactly, because the average increment really is 0.5 m. A reviewer who checks the header against itself, or even the header count against the row count, sees a clean file and moves on.

Only the recomputation catches it. Walk the depth column and the second increment is 0.5 while the first is 0.3, the declared step is contradicted at the third sample, and the file is flagged. Anything built on the false claim would have been wrong in a quiet way: resampling to a regular grid, merging with a curve from another run, or reading a value at a depth by index arithmetic instead of by depth.

That contrast is the reason the discipline exists. The honest file and the dishonest file differ in exactly one header character, they pass exactly the same paper checks, and only evidence from the data separates them.

## The same discipline for NULL

`NULL` is a claim of the same kind, and it is easier to get lazy about because one value is so common. Most files you meet declare -999.25, so it is tempting to treat that as a fact about LAS rather than a per-file declaration.

nullheavy_20 declares something else:

```
NULL.   -9999.00 : NULL VALUE
```

That is perfectly legal, and the file uses it heavily. Of its 201 GR samples, 71 carry the null flag. Honour the declaration, exclude those 71, and the mean GR over the 130 real samples is about 44.35 API, a believable shale-and-sand average. Assume -999.25 instead, so that no sample matches and all 201 are treated as measurements, and the mean comes out near -3503, a number no rock has ever produced. The NPHI curve is worse still: every one of its 201 samples is the null flag, so honouring the declaration reports a dead curve with no statistics at all, while assuming the wrong flag reports a curve with a tidy mean of -9999.

Notice how the failure presents itself. Nothing crashes, no line fails to parse, and you get numbers either way. The wrong ones are absurd here only because -9999 is far from any real reading, which is a courtesy of this particular file rather than a general protection.

## The general rule

Three sentences carry the whole lesson. The header is a claim. The data is the evidence. QC is the comparison, and a claim that has not been compared against evidence has not been checked.

In practice that means recomputing first depth, last depth, increment behaviour, sample count and null count from the samples themselves, then reading the header beside them. The app's QC panel does exactly this and shows the two side by side, which is convenient rather than magical; the reasoning is yours either way.

## Exercise

Given a file that declares STRT 1500, STOP 1600 and STEP 0.5, and a data section whose depth column runs 1500.0, 1500.5, 1501.0, 1502.0, 1502.5 and onward, state which checks pass and which fail. Self-check: the declared span and step predict $(1600 - 1500)/0.5 + 1 = 201$ samples, so a row-count check may well pass, but the increment from 1501.0 to 1502.0 is 1.0 m against a declared 0.5 m, so the step claim fails at the fourth sample and a uniform-step test returns null.

Then answer this for nullheavy_20: if you computed its GR mean while assuming -999.25, would the result be too high or too low, and by roughly how much? Self-check: far too low, about -3503 against a true 44.35, because 71 flags of -9999 were averaged in as if they were readings.
