# A representative difference

This is the subtlest number in the course, and it is worth slowing down for. The graded step for feet_20 is 0.609619140625 m. There are three other numbers within a whisker of it, all of them defensible, all of them reachable by sensible arithmetic, and none of them the value the pipeline reports. Understanding which one is graded, and why, is understanding what the uniformity test actually returns.

## The differences are not all the same

Start with what the depth column looks like after conversion. feet_20 is sampled every 2 feet, and the conversion factor is exactly 0.3048, so every interval in the source file is the same length. After conversion they are not.

The converted depths are stored as 32-bit floats. A float32 cannot hold most decimal values exactly, so each converted depth lands on the nearest representable value, and the gap between two neighbouring depths inherits both roundings. Walk the column and you find at least two distinct consecutive differences:

* 0.609619140625 m
* 0.6094970703125 m

They differ by about 0.000122 m, which is about a tenth of a millimetre. That difference is not in the well. Nothing in the borehole changed between those two samples. It is an artefact of how the numbers are stored, and it appears in the fifth decimal place of a measurement whose meaningful precision stops several decimals earlier.

## The tolerance was built for exactly this

The previous lesson established the tolerance for this file as about 0.006096 m. Set the observed spread against it. The differences wobble by about 0.000122 m, and the tolerance allows about 0.006096 m, so the wobble uses about one fiftieth of the allowance. Every later difference sits comfortably inside the window around the candidate, the hypothesis survives, and the test reports a step.

This is the case the second term of the tolerance formula and the one percent term were both written for. An equality test would have looked at 0.609619140625 and 0.6094970703125, seen two different numbers, and declared feet_20 irregular. It is not irregular. It is a uniformly sampled well whose converted depths are stored in a format that cannot represent them exactly.

Say that out loud in the form the pipeline means it: this log is uniform to within a tolerance rather than exactly uniform. That is the strongest claim any converted file can support.

## Which number is graded

The test returns the first difference, so the reported step for feet_20 is 0.609619140625 m, and that is the graded value.

It is a representative difference. It is one real interval, observed between the first two samples, that the test has certified as describing every other interval to within the tolerance. It is not a summary of the column and it was never intended to be one.

Three near neighbours are worth naming, because each is a number a careful learner might arrive at.

**0.6096** is the exact hand answer, 2 feet times 0.3048. It is the correct arithmetic for the nominal step in metres, and it is what the Associate tier's panel displayed. It is not what the pipeline reports, because the pipeline never computes the step from the header. It reads it from the converted column.

**0.609599609375** is the average step, the last converted depth minus the first, divided by the 150 intervals. It is a perfectly sensible summary of the column and it is what most people write when asked for the step. The test does not average, so this is not the reported value.

**0.6094970703125** is another consecutive difference from the same column. It is a real observed interval, exactly as real as the graded one. It is not reported only because it is not the first.

All three sit inside the capstone tolerance of 0.001 on the step field, so a learner who reports any of them passes that field. That is deliberate and it is not a reason to be vague. The tolerance is there so that the grade does not turn on float32 bookkeeping, while the value the pipeline reports is specifically the first difference, 0.609619140625 m.

## Why this matters beyond the grade

The habit worth taking away is reading a reported step as a claim about a column rather than as a property of a well. When a registry field says the step is 0.609619140625 m, the meaning is: one interval was measured, every other interval agreed with it to within the stated tolerance, and this is the interval that was measured. That is a much more useful sentence than "the step is 0.6096 m", because it tells you what was tested and what was allowed.

It also tells you what the field is not safe for. Reconstructing depth 150 samples down by multiplying the reported step by 150 is not the same as reading the 151st depth, because the small differences accumulate. Where the exact depth matters, read the depth column. The step field is for the work that needs a spacing, not for regenerating the frame.

The panel below runs the pipeline on any teaching file and shows the reported step next to the first consecutive differences, so you can watch the wobble and the verdict at the same time.

{{panel:wd-import-explorer}}

## Exercise

Open the panel on feet_20 and write down the reported step and the first differences it lists. Then, without looking, write the three near neighbours of the graded value and say where each one comes from. Finally answer in one sentence: why does the reported step differ from the average step even though the file is uniform?

As a self check: the reported and graded step is 0.609619140625 m, and the differences in the column include both 0.609619140625 m and 0.6094970703125 m, about 0.000122 m apart, well inside the tolerance of about 0.006096 m. The three near neighbours are 0.6096, the exact hand answer of 2 feet times 0.3048; 0.609599609375, the average step taken as the last converted depth minus the first over 150 intervals; and 0.6094970703125, another consecutive difference from the column. All three fall inside the capstone tolerance of 0.001, so all three would pass, and the value the pipeline reports is specifically the first difference. It differs from the average because the test never averages: it adopts the first difference as a candidate, checks the rest against it, and returns that first difference.
