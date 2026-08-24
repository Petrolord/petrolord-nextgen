# The workflow end to end

Five modules have taken the import pipeline apart a stage at a time. This lesson puts it back together in working order, because the stages are not independent. Each one consumes what the stage before it produced, and a depth unit misread at the start is still wrong at the last curve without ever announcing itself.

The order is: parse, read the header as claims, convert the depth column, convert the curves that carry a length, assign kinds, test the step, record provenance, publish.

## What the Associate tier already did

You did not arrive here empty handed, and the pipeline does not repeat what that tier taught.

The Associate tier gave you the LAS format itself: the section structure, the header line grammar, the data section and wrapped mode, so that a file becomes a set of named curves and a depth column rather than a wall of text. It gave you nulls, the null flag and dead curves, so that missing data is counted rather than averaged into a result. It gave you headers as metadata and identity, and the discipline of reading them as claims to be verified. And it gave you the QC workflow, the habit of running a fixed set of checks on a file before letting it out.

All of that is upstream of this tier and still running. What this tier adds is the step from a file that has been read correctly to a well that has been brought into the project's own units and vocabulary.

## Stage 1: parse and read the header

The parser turns the file into curves with mnemonics, units and data, plus a well section. feet_20 comes out of it declaring a depth unit of F, a start of 4900, a stop of 5200, a step of 2 and 151 samples.

Every one of those is a claim in the file's native unit. The start and stop are read and used, the depth unit drives everything that follows, and the step is noted and never used.

## Stage 2: convert the depth column

The depth unit F is recognised and mapped to its factor, which is exactly 0.3048. The whole depth column is multiplied through, and the frame the registry stores is metric: a start depth of 1493.52001953125 m converted, and a stop depth of 1584.9599609375 m converted.

Both are labelled as converted wherever they are reported, which is the units discipline this tier runs on. A depth in metres that came from a feet file is a derived number, and the label is what stops the next person from wondering.

## Stage 3: convert the curves that carry a length

The depth column is not the only thing denominated in feet. The pipeline inspects every curve's declared unit and converts each one whose unit carries a length.

On feet_20 that means DT, the sonic, which arrives in US/F and leaves in US/M. GR in GAPI, RHOB in G/C3 and NPHI in V/V carry no length and pass through untouched. So the count of curves unit-converted for this file is 2, the depth column and the sonic, and a reviewer who expects 1 has assumed that a file is either a feet file or a metres file when unit trouble lives curve by curve.

## Stage 4: assign kinds

Next the pipeline classifies each curve into a standard kind, so that a downstream app can ask for the gamma ray without knowing what this vendor called it. On feet_20 it recognises gr for GR, density for RHOB, neutron for NPHI and sonic for DT, which is 4 kinds. DEPT is the index curve and is excluded from the count, so the answer is 4 rather than 5.

## Stage 5: test the step

The converted depth column goes to `uniformStepM`, which adopts the first difference as a candidate, checks every later difference against a tolerance, and either returns that first difference or returns nothing. For feet_20 it returns 0.609619140625 m converted. For irregular_20 it returns nothing, and the uniformity field for that file is the integer 0.

The header's step of 2 in feet plays no part in this. It was noted at stage 1 and never consulted.

## Stage 6: record provenance and publish

What the well carries into the registry is the whole of the tier's output: a depth column in metres with its source unit and conversion factor recorded, every curve with the unit it now has and the unit it arrived in, a converted flag per curve, a kind per curve where one was recognised, and a step in metres, or null where no uniform step exists.

## What this tier hands downstream

Every application above the registry consumes that package, and each of them consumes a different part of it.

Petrophysics needs the units right per curve, because a sonic in US/F fed to a Wyllie equation expecting US/M returns a porosity that is wrong and plausible at the same time. Well correlation and mapping need the depth column in metres, because a single well left in feet plants a false structural feature in every surface gridded through it. Anything that counts samples and multiplies needs the step field, including its null. Anything that picks curves automatically needs the kinds.

None of them re-checks. That is the point of doing it once, here, and recording it visibly.

## Exercise

Write the six stages in order and put beside each the single thing it produces for feet_20. Then answer in one sentence: which stage produces no number of its own and yet governs every number after it?

As a self check: stage 1 parses and reads a native depth unit of F with a start of 4900, a stop of 5200 and 151 samples; stage 2 converts the column with the factor 0.3048 to a start of 1493.52001953125 m converted and a stop of 1584.9599609375 m converted; stage 3 converts the curves carrying a length, giving 2 curves unit-converted, the depth column and DT from US/F to US/M; stage 4 assigns kinds and recognises 4, with the index curve excluded; stage 5 tests the step and returns 0.609619140625 m converted; and stage 6 records provenance and publishes. The stage that produces no number of its own and governs everything after it is stage 1, because the native depth unit it reads is what selects the conversion factor for the column and for every curve denominated in feet.
