# The capstone walkthrough

The Expert capstone for this course is called The six-file import campaign, and its dataset is all six teaching LAS files. It asks you to run the full import pipeline on every file and read the campaign panel, and it grades six numbers. This lesson walks the six in capstone order, gives the unit and tolerance of each as the assessment defines them, says where each one is read, and points out where marks are lost.

## The six graded fields

| Field | Unit | Expected | Tolerance |
| --- | --- | --- | --- |
| Curves imported across the campaign | count | 24 | 0 |
| Files needing depth unit conversion | count | 1 | 0 |
| Dead curves detected | count | 1 | 0 |
| Files with a uniform depth step | count | 5 | 0 |
| Depth samples in wrapped_12 | count | 161 | 0 |
| Flagged nulls in nullheavy_20 | count | 272 | 0 |

**1. Curves imported across the campaign, a count, tolerance 0.** The value is 24, read from the curves imported tile, whose label states that the depth index is excluded. Confirm it against the campaign row and the per-file column, where every one of the six files shows 4. Six files at 4 curves each is 24. The loss here is 30, which is the depth index counted as a curve in every file.

**2. Files needing depth unit conversion, a count, tolerance 0.** The value is 1, read from the files needing conversion tile, and the file is `feet_20.las`, the only row in the table whose converted column reads YES. This field counts files rather than curves. The Professional tier graded a per-curve conversion count on this same file, and the two questions have different answers.

**3. Dead curves detected, a count, tolerance 0.** The value is 1, read from the dead curves tile, and the curve is NPHI in `nullheavy_20.las`. A dead curve is one with no finite sample anywhere, so this is a count of curves rather than of files or of nulls.

**4. Files with a uniform depth step, a count, tolerance 0.** The value is 5, read from the files with a uniform step tile, which shows it as 5 of 6. Read the direction of this field carefully. It counts the files that pass, and the exception is `irregular_20.las`, whose depth column has no uniform step. Entering 1 is the classic loss, and it is not a careless one. Every other exception field on this paper counts the file that fails, and this one counts the five that do not.

**5. Depth samples in wrapped_12, a count, tolerance 0.** The value is 161, read from the wrapped_12 depth samples tile and the samples column of that row. It is 805 numeric tokens in the data section divided by 5 declared curves, and the independent check from the header's depth frame gives the same 161. The loss to avoid is 483, which is the number of physical lines in the data block rather than the number of depth samples.

**6. Flagged nulls in nullheavy_20, a count, tolerance 0.** The value is 272, read from the nullheavy_20 flagged nulls tile, and confirmed in the lower table by opening that file: 71 in GR, 0 in RHOB, 201 in NPHI and 0 in DT, adding to 272. The count is against the file's own declared null of -9999 rather than the more common value used elsewhere.

Six readings, one panel. There is no file switching on this paper, because every field is a campaign-level number.

## Every field has a tolerance of zero

Say that plainly, because it is unusual. There is no margin anywhere in this capstone. Six fields, six tolerances of zero.

That design follows from what these quantities are. Every one of the six is a count. A count is either the number of things or it is not, so there is nothing between 24 and 30 for a grader to be generous about. There is no sense in which 4 files with a uniform step is close to 5, and no sense in which 483 is nearly 161. Compare the tier below, where two depth fields tolerated 0.01 m because a metre is a continuous quantity.

The practical consequence is that reading carefully is the whole skill. A wrong count on this paper is not a small error. It is a different answer.

## The two fields that are linked

Fields 3 and 6 are not independent readings, and understanding why is the central idea of module 4 arriving on the assessment.

The dead curve counted in field 3 is NPHI in `nullheavy_20.las`, and its 201 null samples are part of the 272 counted in field 6. So 201 of the 272 are the dead curve, and only 71 are scattered nulls inside a GR that does have data. Both are still graded separately and still count different things, one curves and one nulls, but a candidate who understands the link reads the file once and gets both. A candidate who does not is liable to subtract the dead curve's samples from the null total, or to report a file with a dead curve plus 272 nulls elsewhere.

## Getting to the capstone at all

The platform enforces the same order it did at the two tiers below. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks. Passing it grants the Expert certification in Well Data Manager.

Open the panel below and locate all six values in capstone order before you submit.

{{panel:wd-campaign-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit and tolerance of each, and say which tile or which part of the table you would read each from. Then answer in two sentences: which field counts the files that pass rather than the file that fails, and how are the dead curve count and the null count related?

As a self check: curves imported across the campaign, a count at tolerance 0, which is 24 with the depth index excluded; files needing depth unit conversion, a count at tolerance 0, which is 1 and is `feet_20.las`; dead curves detected, a count at tolerance 0, which is 1 and is NPHI in `nullheavy_20.las`; files with a uniform depth step, a count at tolerance 0, which is 5 of 6; depth samples in `wrapped_12.las`, a count at tolerance 0, which is 161; and flagged nulls in `nullheavy_20.las`, a count at tolerance 0, which is 272. The uniform step field is the one that counts the files that pass, so the answer is 5 rather than the 1 file that fails. The dead curve is 201 of the 272 flagged nulls, so the two fields describe overlapping evidence and only 71 of those nulls are scattered nulls in a curve that has data.
