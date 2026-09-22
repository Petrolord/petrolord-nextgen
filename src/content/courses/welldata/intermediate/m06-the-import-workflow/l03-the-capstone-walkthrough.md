# The capstone walkthrough

The Professional capstone for this course is short. It asks you to run the full import pipeline on a feet-denominated well and read the import panel, and it grades six numbers. There is no essay. The capstone is set on its own case, the ODUMA campaign: download the case files from the capstone card, open oduma3_feet.las and oduma4_irregular.las in the import panel with **Open your own LAS files**, and read the six values there. No lesson prints them and no panel loads the files for you.

This lesson walks the six in capstone order on the teaching files, as a worked example: feet_20 stands in for oduma3_feet and irregular_20 for oduma4_irregular. It gives the unit and tolerance of each as the assessment defines them, says where each one is read, and points out where marks are lost. Your capstone values will be different from the worked ones.

## The six graded fields

| Field | Unit | Tolerance |
| --- | --- | --- |
| oduma3_feet: start depth (converted) | m | 0.01 |
| oduma3_feet: stop depth (converted) | m | 0.01 |
| oduma3_feet: depth step (converted) | m | 0.001 |
| oduma3_feet: curves unit-converted | count | 0 |
| oduma3_feet: curve kinds recognised | count | 0 |
| oduma4_irregular: depth samples | count | 0 |

**1. Start depth (converted), in m, tolerance 0.01.** On feet_20 the value is 1493.52001953125 m converted, read from the start converted tile. The native start of 4900 F sits beside it. Handing in the native value is the unit error this whole tier exists to train out of you.

**2. Stop depth (converted), in m, tolerance 0.01.** On feet_20 the value is 1584.9599609375 m converted, from the stop converted tile on the same file. Again the native stop of 5200 F is displayed next to it, so read the metric one.

**3. Depth step (converted), in m, tolerance 0.001.** On feet_20 the value is 0.609619140625 m converted, from the reported step tile. This is the first consecutive difference of the converted column, certified by the uniformity test, and not an average.

**4. Curves unit-converted, a count, tolerance 0.** On feet_20 the value is 2, from the curves unit-converted tile, and you can confirm it in the curve table by counting the rows whose converted flag reads yes. Those rows are DEPT, from F to M, and DT, from US/F to US/M. On the capstone file, count every row flagged yes, whatever its unit.

**5. Curve kinds recognised, a count, tolerance 0.** On feet_20 the value is 4, from the curve kinds recognised tile, whose label states that the index curve is excluded. The four are gr, density, neutron and sonic. The file has five curves, so 5 is the overcount to avoid. A curve the importer reads as not recognised is not counted either.

**6. Depth samples in the irregular file, a count, tolerance 0.** On irregular_20 the value is 121, from the Samples tile. This is the one field that is not read on the feet file. Switch the panel to the irregular file: its differences cannot all sit inside one tolerance, so the uniform depth step tile stays empty, and the sample count is what the capstone grades.

Six readings, two files, one panel. Do the five fields on the feet file first and switch files once.

## Three of the six must be exact

Fields 4, 5 and 6 carry a tolerance of 0. All three are counts, and none of them has any margin at all. They are right or they score nothing.

That is the correct design for these quantities. There is no such thing as being close to 2 curves converted. A count is either the number of things or it is not, so on feet_20 a 1 is a reviewer who let a sonic in feet through. The same is true of 4 kinds against 5, where the difference is the whole question of whether the index curve is a kind. And a sample count is a whole number of rows, so there is nothing between 120 and 121 to be nearly right about on irregular_20.

## The two depth fields tolerate 0.01, so the hand answers pass

Fields 1 and 2 allow 0.01 m, and that window is wide enough to be worth stating plainly.

On feet_20 the pipeline values are the float32 representations, 1493.52001953125 m converted and 1584.9599609375 m converted, because the depth column is stored as 32-bit floats and those are the values the pipeline actually holds. The hand arithmetic gives 4900 times 0.3048 as 1493.52 and 5200 times 0.3048 as 1584.96. Both sit far inside the 0.01 window, so a learner who computes the conversion with a calculator passes both fields. The hand answer is not wrong. It is the same depth written to the precision a person needs, while the pipeline value is the same depth written to the precision the machine stores. The capstone's feet file behaves the same way.

## The step field tolerates 0.001

Field 3 allows 0.001 m, which is generous against a step of about 0.61 m and is there for a specific reason. Module 5 showed that four numbers sit within a whisker of each other for feet_20: the reported 0.609619140625, the exact hand answer of 0.6096, the average step of 0.609599609375, and another observed difference of 0.6094970703125. All four fall inside the window, so the grade does not turn on float32 bookkeeping. The value the pipeline reports is still specifically the first difference, 0.609619140625 m converted.

## Getting to the capstone at all

The platform enforces the same order it did at the Associate tier. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks. Passing it grants the Professional certification in Well Data Manager.

Open the panel below, locate all six values in capstone order on the teaching files, then open the ODUMA files with Open your own LAS files and read the six there before you submit anything.

{{panel:wd-import-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit and tolerance of each, and say which file and which tile you would read each from, on the teaching files and on the ODUMA files. Then answer in two sentences: which three fields must be exact, and why do the hand answers for the two depth fields still pass?

As a self check on the worked example: start depth converted in m at tolerance 0.01, 1493.52001953125 m converted on feet_20; stop depth converted in m at tolerance 0.01, 1584.9599609375 m converted; depth step converted in m at tolerance 0.001, 0.609619140625 m converted; curves unit-converted as a count at tolerance 0, which is 2; curve kinds recognised as a count at tolerance 0, which is 4; and the depth samples in irregular_20 as a count at tolerance 0, which is 121. The first five are read on the feet file and only the last requires switching to the irregular file. On the capstone the files are oduma3_feet and oduma4_irregular, and their values are yours to read. The three fields with a tolerance of 0 are the three counts, and the hand answers of 1493.52 and 1584.96 pass because both sit far inside the 0.01 window around the float32 values the pipeline stores.
