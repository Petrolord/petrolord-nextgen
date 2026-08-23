# The well section

Every LAS file opens with headers before a single measurement appears, and the most important of them live in the well section, the block that starts with `~Well`. The data section tells you what was measured; the well section tells you where, when, by whom, and how the numbers that follow should be read. A file with a perfect data block and a wrong well section is more dangerous than a file with obvious data problems, because nothing about it looks broken until the curves end up attached to the wrong well.

## The reference set

The cleanest of the six teaching files, basic_20, carries the full set of entries. Here is its well section exactly as it appears in the file:

```
STRT.M  1500.0000 : START DEPTH
STOP.M  1650.0000 : STOP DEPTH
STEP.M     0.5000 : STEP
NULL.   -999.25 : NULL VALUE
COMP.   PETROLORD : COMPANY
WELL.   KETA G1-1 : WELL
FLD .   KETA : FIELD
LOC .   ONSHORE GHANA : LOCATION
SRVC.   PETROLORD STUDIO : SERVICE COMPANY
DATE.   2026-07-12 : LOG DATE
UWI .   KETA-G1-BASIC : UNIQUE WELL ID
```

Read one line to learn the grammar of all of them. `STRT.M  1500.0000 : START DEPTH` breaks into four parts: the mnemonic `STRT`, the unit `M` attached after the dot, the value `1500.0000`, and a description after the colon. The unit slot is empty where no unit makes sense, which is why `NULL.` and `COMP.` have nothing between the dot and the spaces.

## Framing entries versus identity entries

The entries divide into two families with different jobs.

Four of them frame the data, and QC depends on them directly:

* `STRT` and `STOP` declare the first and last depth of the data block, in the declared unit. For basic_20 that is 1500 to 1650 metres.
* `STEP` declares the depth increment, here 0.5 m. A later lesson deals with what a step of zero means.
* `NULL` declares the missing-value flag, here -999.25. Every statistic you will ever compute on this file is wrong unless this value is excluded first.

The rest establish identity and provenance: `WELL` (the well name, KETA G1-1), `COMP` (the operating company), `FLD` (the field), `LOC` (a location string), `SRVC` (who ran the logs), `DATE` (when), and `UWI` (a unique well identifier, KETA-G1-BASIC here). None of these change a single computed number, and all of them decide whether the numbers end up in the right place. The app's QC panel surfaces the ten standard entries in a metadata table so you check them the same way every time.

## Why both families matter

The framing entries matter because the parser and every downstream consumer act on them. If `NULL` is wrong, missing samples enter your averages as huge negative numbers. If `STEP` is wrong, resampling and merging misbehave. These failures are loud once you know to look.

The identity entries fail quietly. A file whose `WELL` says KETA G1-1 when the curves were logged in a different borehole will parse perfectly, pass every numeric check, and poison every application that trusts it. The well name is the key that links these curves to tops, checkshots and zones across the whole platform, so an identity error propagates everywhere at once. That asymmetry, loud framing errors and silent identity errors, is why a data manager reads the whole well section and not just the numeric rows.

## Worked example

Answer three QC questions for basic_20 from the header block above, before touching the data:

1. How many samples should the file contain? From STRT, STOP and STEP: $(1650 - 1500) / 0.5 + 1 = 301$ rows. The parsed file indeed reports 301 depth samples, and comparing this expectation against the actual count is a standard first check.
2. What value marks a missing sample? -999.25, so a GR reading of -999.25 is an absence, never a measurement.
3. Which well do these curves belong to? KETA G1-1, operated by PETROLORD in the KETA field, logged 2026-07-12 by PETROLORD STUDIO, unique id KETA-G1-BASIC. That is enough to resolve the well against the registry without guessing.

Not every file is this complete. Of the six teaching files, only basic_20, irregular_20 and nullheavy_20 carry the full identity set; the wrapped file trims it to `WELL`, `COMP` and `UWI`, and the quirky export keeps only the well name. Missing entries are legal LAS, so the QC habit is noting what is absent, not assuming it.

## Exercise

From the header block above, without opening the data section: state the expected sample count if STOP were 1600 instead of 1650 (self-check: $(1600 - 1500)/0.5 + 1 = 201$, which is exactly the sample count of nullheavy_20, a file that spans 1500 to 1600 m at the same step). Then list which two framing entries you would check first on a file that arrived with no documentation, and say in one sentence why each failure mode is worse than a missing `LOC`.
