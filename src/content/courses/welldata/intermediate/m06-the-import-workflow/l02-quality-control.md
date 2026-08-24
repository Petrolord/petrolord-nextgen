# Quality control

An import that is wrong looks exactly like an import that is right. Both produce a well with curves on a depth column in metres, and both report more digits than anybody needs. What separates them is whether somebody ran a fixed set of checks before the well entered the registry.

This lesson is that pass, written the way a reviewer runs it: five checks, in the order the questions get asked, with feet_20 as the worked case.

## Check 1: was the depth unit recognised and converted

The first question is what unit the file arrived in and what the pipeline did about it. Expect three things together: the native unit, the factor, and the converted frame. For feet_20 the native depth unit is F, the factor is exactly 0.3048, and the frame comes out at a start of 1493.52001953125 m converted and a stop of 1584.9599609375 m converted, from a native 4900 to 5200 in feet.

Two failures live here. One is a unit the pipeline did not recognise, so there is no factor and no conversion. The other is a metric well converted anyway, which gives a frame about a third of its true depth. Read the native and converted frames side by side and both are visible at a glance.

## Check 2: did every length-denominated curve convert with it

The depth column is never the only thing that can carry a length, so the second question is which curves converted and why.

The mechanism behind the answer is one a Professional reviewer has to know. Conversion is decided by the unit string alone, through a fixed lookup table, and not by any reasoning about what the unit means. The whole table is US/F, US/FT, USEC/F and USEC/FT converting to US/M, and F, FT and FEET converting to M. The importer trims the unit, upper-cases it, and looks for an exact entry. Nothing else converts.

On feet_20 the result is straightforward. DEPT arrives in F and leaves in M, converted. DT arrives in US/F, which is in the table, and leaves in US/M, converted. GR in GAPI, RHOB in G/C3 and NPHI in V/V are not in the table and pass through untouched, so the count of curves unit-converted is 2. A reviewer who accepts 1 has let a sonic in feet into a project that will read it as metric, and the porosity computed from it will be badly wrong and look reasonable.

Now the part the table makes true. A curve carrying a length unit that is not in the table passes through unconverted. A caliper in IN is the standing example: inches are absent from the lookup, so the importer leaves it alone and marks it not converted, exactly as it would a gamma ray. The importer converts what it recognises rather than everything it should.

That is a limitation to state rather than a bug to report, so run this check in two passes. First confirm that every curve whose unit is in the table came out converted. Then read the units of the curves that did not, and ask whether any is a length the table does not cover. A curve in that second group is a real finding, and it needs what an irregular step needs: flag it, record it, decide deliberately.

## Check 3: were kinds assigned

Third, look at the kind column, which was filled in from a different input. Kind is decided by the mnemonic alone: the importer upper-cases it, strips any run suffix after a colon, and looks for an exact match in fixed name lists. The unit is never consulted, so the two columns are independent findings.

On feet_20 the lists match GR, RHOB, NPHI and DT, giving gr, density, neutron and sonic, which is 4 kinds. DEPT is stamped as the index curve by its position in the file rather than by any lookup, and it is excluded from the count, so 4 is right and 5 is the classic overcount.

The rows to look at hardest are the ones marked as not recognised. A curve without a kind is not dropped, but it is invisible to any app that asks for curves by kind, so either accept that deliberately or correct the mnemonic at source.

## Check 4: was the step tested rather than trusted

Fourth, and this is the check that separates this tier from the one below, ask where the step came from.

The answer must be that it was measured from the converted depth column by a test that is allowed to fail. For feet_20 that test returns 0.609619140625 m converted. For irregular_20 it returns null, and the uniformity field for that file is the integer 0.

The failure to look for is a step field that agrees suspiciously with the header. feet_20 declares a step of 2 in feet, so a step field holding 0.6096 exactly, or holding 2, suggests a header claim was stored rather than a column measured.

## Check 5: is every reported depth labelled as converted

Last, read the report rather than the pipeline. Every converted depth has to be labelled as converted wherever it is quoted, in metres, with the source unit and factor recoverable from the provenance.

This is the cheapest check and the one most often skipped. A start depth of 1493.52001953125 m written with no note of its origin cannot be audited later. Labelled as converted from 4900 F at 0.3048, it can be re-derived by anybody.

The same discipline applies to the counts and the flag. Counts are counts, so 2 curves unit-converted and 4 curve kinds recognised are whole numbers with no unit, and the uniformity result is the integer 1 or 0 rather than a word.

Run checks 1 to 4 against the panel below, which shows the native and converted frame, the per-curve unit, kind and converted flag, and the uniformity result together.

{{panel:wd-import-explorer}}

## Exercise

Run all five checks on feet_20 using the panel, writing one line for each saying what passed and what you read it from. Then answer in two sentences: which check catches a sonic left in US/F, and what would you record about a caliper delivered in IN?

As a self check: check 1 gives a native depth unit of F, the factor 0.3048 and a frame of 1493.52001953125 m converted to 1584.9599609375 m converted; check 2 gives 2 curves unit-converted, DEPT from F to M and DT from US/F to US/M, with GR, RHOB and NPHI untouched because their units are not in the table; check 3 gives 4 curve kinds recognised from the mnemonics, index curve excluded by position; check 4 gives a measured step of 0.609619140625 m converted and the integer 0 for irregular_20; and check 5 confirms every converted depth is labelled as converted. Check 2 catches the sonic, since US/F is in the conversion table and the converted count would otherwise read 1 instead of 2. A caliper in IN would come through unconverted because inches are not in the table, which is the importer working as built, so record it as a finding and decide what to do with it deliberately.
