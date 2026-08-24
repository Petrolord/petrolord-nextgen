# The capstone walkthrough

The Professional capstone for this course is called SI import of the feet-denominated well, and it is short. It asks you to run the full import pipeline on feet_20 and read the import panel, and it grades six numbers. There is no essay and no hidden dataset. This lesson walks the six in capstone order, gives the unit and tolerance of each as the assessment defines them, says where each one is read, and points out where marks are lost.

## The six graded fields

| Field | Unit | Tolerance |
| --- | --- | --- |
| feet_20: start depth (converted) | m | 0.01 |
| feet_20: stop depth (converted) | m | 0.01 |
| feet_20: depth step (converted) | m | 0.001 |
| feet_20: curves unit-converted | count | 0 |
| feet_20: curve kinds recognised | count | 0 |
| irregular_20 has a uniform step (1 yes / 0 no) | - | 0 |

**1. feet_20: start depth (converted), in m, tolerance 0.01.** The value is 1493.52001953125 m converted, read from the start converted tile with feet_20 selected. The native start of 4900 F sits beside it. Handing in 4900 is the unit error this whole tier exists to train out of you.

**2. feet_20: stop depth (converted), in m, tolerance 0.01.** The value is 1584.9599609375 m converted, from the stop converted tile on the same file. Again the native stop of 5200 F is displayed next to it, so read the metric one.

**3. feet_20: depth step (converted), in m, tolerance 0.001.** The value is 0.609619140625 m converted, from the reported step tile. This is the first consecutive difference of the converted column, certified by the uniformity test, and not an average.

**4. feet_20: curves unit-converted, a count, tolerance 0.** The value is 2, from the curves unit-converted tile, and you can confirm it in the curve table by counting the rows whose converted flag reads yes. Those rows are DEPT, from F to M, and DT, from US/F to US/M.

**5. feet_20: curve kinds recognised, a count, tolerance 0.** The value is 4, from the curve kinds recognised tile, whose label states that the index curve is excluded. The four are gr, density, neutron and sonic. The file has five curves, so 5 is the overcount to avoid.

**6. irregular_20 has a uniform step (1 yes / 0 no), tolerance 0.** The value is 0, meaning no. This is the one field that is not read on feet_20. Switch the panel to irregular_20 and read the uniform depth step tile, where the test has returned nothing because the differences of about 0.300049 m, 0.5 m and about 0.699951 m cannot all sit inside one tolerance.

Six readings, two files, one panel. Do the five feet_20 fields first and switch files once.

## Three of the six must be exact

Fields 4, 5 and 6 carry a tolerance of 0. Two of them are counts and the third is the uniformity flag, and none of them has any margin at all. They are right or they score nothing.

That is the correct design for these quantities. There is no such thing as being close to 2 curves converted. A count is either the number of things or it is not, so 1 is not a near miss on 2, it is a reviewer who let a sonic in feet through. The same is true of 4 kinds against 5, where the difference is the whole question of whether the index curve is a kind. And the uniformity result is graded as the integer 1 for yes and 0 for no, so there is nothing between them to be nearly right about. The answer for irregular_20 is 0.

## The two depth fields tolerate 0.01, so the hand answers pass

Fields 1 and 2 allow 0.01 m, and that window is wide enough to be worth stating plainly.

The graded values are the float32 representations, 1493.52001953125 m converted and 1584.9599609375 m converted, because the depth column is stored as 32-bit floats and those are the values the pipeline actually holds. The hand arithmetic gives 4900 times 0.3048 as 1493.52 and 5200 times 0.3048 as 1584.96. Both sit far inside the 0.01 window, so a learner who computes the conversion with a calculator passes both fields. The hand answer is not wrong. It is the same depth written to the precision a person needs, while the graded value is the same depth written to the precision the machine stores.

## The step field tolerates 0.001

Field 3 allows 0.001 m, which is generous against a step of about 0.61 m and is there for a specific reason. Module 5 showed that four numbers sit within a whisker of each other for this file: the reported 0.609619140625, the exact hand answer of 0.6096, the average step of 0.609599609375, and another observed difference of 0.6094970703125. All four fall inside the window, so the grade does not turn on float32 bookkeeping. The value the pipeline reports is still specifically the first difference, 0.609619140625 m converted.

## Getting to the capstone at all

The platform enforces the same order it did at the Associate tier. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks. Passing it grants the Professional certification in Well Data Manager.

Open the panel below and locate all six values in capstone order before you submit anything.

{{panel:wd-import-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit and tolerance of each, and say which file and which tile you would read each from. Then answer in two sentences: which three fields must be exact, and why do the hand answers for the two depth fields still pass?

As a self check: start depth converted in m at tolerance 0.01, 1493.52001953125 m converted; stop depth converted in m at tolerance 0.01, 1584.9599609375 m converted; depth step converted in m at tolerance 0.001, 0.609619140625 m converted; curves unit-converted as a count at tolerance 0, which is 2; curve kinds recognised as a count at tolerance 0, which is 4; and whether irregular_20 has a uniform step at tolerance 0, which is the integer 0. The first five are read on feet_20 and only the last requires switching to irregular_20. The three fields with a tolerance of 0 are the two counts and the uniformity flag, and the hand answers of 1493.52 and 1584.96 pass because both sit far inside the 0.01 window around the float32 values the pipeline stores.
