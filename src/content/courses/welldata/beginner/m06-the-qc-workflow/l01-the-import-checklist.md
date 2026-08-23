# The import checklist

Everything this course has taught folds into one working habit: a checklist you run, in the same order, on every file that arrives. The order matters. Each check assumes the ones before it passed, so running them out of sequence wastes time chasing symptoms whose cause sits upstream. Here is the checklist, and then two full runs of it on files you already know.

## The five checks, in order

1. **Structure.** Does the file parse at all? Confirm the LAS version and wrap mode, and confirm every section the format requires is present and readable. A structural failure ends the import; there is nothing meaningful to QC in a file the parser cannot walk.

2. **Framing.** Is the depth frame sound? Read the depth unit, the range, and the step; check whether the step is uniform; and compare what the header declares against what the data actually contains. The frame is the skeleton every curve hangs on, so a framing error contaminates every later check.

3. **Completeness.** Is the data actually there? Confirm the declared NULL value is being honoured, read the per-curve null counts, and flag any dead curve, meaning a curve whose every sample is null. A curve can be listed in the curve section and still carry no usable data at all.

4. **Plausibility.** Do the finite samples look like rock? Statistics over the finite samples should sit in physical ranges: gamma ray in the tens of GAPI, bulk density around 2 to 3 g/cc, neutron porosity between 0 and roughly 0.5 v/v. A curve that parses cleanly but averages an impossible value is telling you about a unit problem or a corrupted export.

5. **Identity.** Do you know what this is? The well name must resolve to a real well, and the file's provenance, meaning where it came from and when, must be recorded. Data without identity cannot be trusted later, no matter how clean it looks today.

## A green run: basic_20

Run the checklist on basic_20.las. Structure: LAS 2.0, unwrapped, all sections parse. Framing: depth in metres from 1500 to 1650, step 0.5 m, 301 samples, uniform, and the header's STRT, STOP and STEP agree with the recomputed values. Completeness: NULL is declared as -999.25 and honoured; GR carries 8 nulls out of 301, RHOB 9, and NPHI and DT none; no curve is dead. Plausibility: the finite-sample mean GR is 64.9272 GAPI, mean RHOB 2.3393 g/cc, mean NPHI 0.2416 v/v, all comfortably physical. Identity: the well is KETA G1-1, company PETROLORD, field KETA, logged 2026-07-12. Five checks, five passes. This file goes into the registry without a caveat.

## A flagged run: nullheavy_20

Now nullheavy_20.las. Structure passes: it is a clean LAS 2.0 file and every section parses. Framing passes: metres, 1500 to 1600, step 0.5 m, 201 samples, uniform. Completeness is where the flags appear, and notice that the file declares its NULL as -9999 rather than the usual -999.25; the parser honours the declaration, which is exactly why reading the declaration matters instead of assuming the common value. Against that flag, GR carries 71 nulls out of 201 samples, so more than a third of the gamma ray is missing. Worse, NPHI is dead: 201 nulls out of 201 samples, a curve that exists in name only. Plausibility on what remains is fine, and identity resolves. The verdict is not rejection; it is a documented import with two loud caveats, so that nobody downstream computes shale volume from a one-third-missing GR or porosity from a curve that is not there.

## Why the order earns its keep

Imagine running plausibility first on nullheavy_20 without the completeness check. The GR mean over finite samples is 44.3489 GAPI, perfectly physical, and you would have waved through a curve missing a third of its samples. Or imagine checking completeness on a feet file before framing: the counts would pass while every depth sat in the wrong unit. Each check protects the ones after it. The checklist is short because each item does one job and trusts the item before it.

## Exercise

Run the checklist from memory on wrapped_12.las and write one line per check. Self-checks: structure should note LAS 1.2 with wrap YES; framing should find metres, 1500 to 1580, step 0.5 m, 161 samples; completeness should find GR with 5 nulls and RHOB with 9, no dead curves against NULL -999.25; plausibility should accept a finite GR mean of 63.1730 GAPI; identity should resolve KETA G1-2. Then state, in one sentence, why the structure check had more to do on this file than on any other in the set.
