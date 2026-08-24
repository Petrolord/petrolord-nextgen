# The uniformity test

The rule the importer uses is short enough to state in one paragraph and more interesting than most people expect. It is not an average, it is not an equality check, and it is not a reading of the header. It is a candidate and a falsification, which is a different shape of computation from the one most engineers write when they are asked whether a column is evenly sampled.

## The rule, exactly

The function is `uniformStepM`. It takes the depth column after conversion, so it is always working in metres, and it does four things in order.

1. It takes the FIRST difference, the second sample minus the first, and adopts it as the candidate step.
2. It builds a tolerance from that candidate and from the depth range.
3. It walks every later consecutive difference and requires each one to sit within the tolerance of the candidate.
4. If every difference passes, it returns the candidate, which is the first difference. If any difference fails, it returns nothing at all, and the pipeline records the file as having no uniform step.

Read step 4 twice. The number the pipeline reports as the file's step is the first difference. It is not the mean of the differences, not the median, and not the range divided by the number of intervals. That distinction has no consequences on a perfectly regular column, where every candidate would agree anyway. It has consequences on a real one, and the next lesson is entirely about the file where it does.

## Why the first difference and not the average

The choice looks arbitrary until you ask what each version can conclude.

An average consumes every difference and returns one number that is influenced by all of them. Feed it a column with one enormous gap and it returns a step slightly larger than the true one, with no indication that anything happened. Feed it a column made of three different spacings and it returns a weighted blend of the three, a value that describes none of the intervals in the file. Whatever you give it, you get a step, so the answer to "is this uniform" is always yes.

Taking the first difference as a candidate turns the question around. The candidate is a hypothesis about the file: every interval in this column is this size. Every later difference is then a chance to falsify it. One difference outside the tolerance is enough to reject the hypothesis, and rejection is reported as an absence of a step rather than as a number. The test can say no, which is the only reason it is worth running.

There is a practical benefit too. The returned value is a real observed interval from the data, not a derived quantity. It is a spacing that actually occurs between two adjacent samples in this file, which is a more honest thing to hand to an application than a mean nobody measured.

## The tolerance has two terms

The comparison is not an equality. Converted depths are stored as 32-bit floats, so two intervals that were identical in the source file can differ in their last stored digits after conversion. An equality test would reject every converted file, which would make the field useless on exactly the wells this tier exists to import.

So the test compares against a tolerance, and that tolerance is the larger of two terms:

$$\text{tol} = \max\left(0.01 \times \text{first},\ 16 \times \varepsilon_{32} \times \max|z|\right)$$

The first term is relative to the step. One percent of the candidate scales with the file, so a 0.15 m log and a 15 m log each get a tolerance proportionate to their own sampling.

The second term is relative to the depth. Float32 numbers are spaced further apart the larger they get, so the representable values near 1500 m are further apart than the representable values near 15 m. Sixteen units in the last place of the deepest sample is a floor on the tolerance that follows the arithmetic rather than the geology. Without it, a file with a very fine step at a very great depth could be rejected for storage noise alone.

Taking the larger of the two means whichever effect dominates sets the tolerance, and the other one never makes the test tighter than the arithmetic can support.

## The numbers on feet_20

Run the two terms for feet_20, whose candidate step after conversion is 0.609619140625 m and whose deepest converted sample is 1584.9599609375 m.

The relative term is one percent of the candidate, which is about 0.006096. The float term, taken on the largest absolute depth in the column, which is the converted stop depth of 1584.9599609375 m, is about 0.003023. The larger of the two wins, so the tolerance for this file is about 0.006096 m.

Hold that number. It is about six millimetres of allowance on a step of about 0.61 m, which is generous against storage noise and nowhere near generous enough to let a real change of sampling through. The next two lessons put both kinds of difference against it.

## What the test is not

Three summaries, because each of them is a mistake somebody makes.

It is not a header check. STEP in the well section is never consulted by this function, which sees only the converted depth column.

It is not an average. Nothing in the procedure sums the differences or divides by a count.

It is not an equality test. Two differences that disagree in their last stored digits both pass, by design, because the disagreement is an artefact of float32 storage and not a property of the well.

And one more, which matters for the capstone. The test runs after unit conversion, so the step it returns is already in metres. There is no second conversion applied to its output.

## Exercise

Write out the four steps of `uniformStepM` in order from memory, then state the tolerance formula and evaluate which of its two terms wins for feet_20. Then answer in one sentence: what does the function return for a file it rejects, and why is that better than returning a best guess?

As a self check: the function takes the first difference as the candidate step, builds a tolerance of max(0.01 x first, 16 x float32 epsilon x max absolute depth), requires every later difference to sit within that tolerance of the candidate, and returns the first difference if all pass. For feet_20 the relative term is about 0.006096 and the float term is about 0.003023, so the relative term wins and the tolerance is about 0.006096 m. A rejected file returns nothing at all, and the pipeline records that no uniform step exists, which is better than a best guess because a number in that field will be believed and used by everything downstream.
