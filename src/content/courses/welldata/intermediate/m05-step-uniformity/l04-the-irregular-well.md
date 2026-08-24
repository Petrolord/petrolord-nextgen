# The irregular well

A test you have only ever watched pass is a test you do not understand. feet_20 went through the uniformity check and came out with a step, and the wobble in its differences turned out to be storage noise the tolerance was designed to absorb. This lesson runs the same code on irregular_20, where the differences are not noise, and watches it return nothing.

## What irregular_20 contains

The file holds 121 depth samples. Walk its depth column sample by sample and the consecutive differences are not one number with a wobble on it. They are three visibly different sizes:

* about 0.300049 m
* 0.5 m
* about 0.699951 m

The largest is more than twice the smallest. This is what real irregularity looks like in a delivered file. It comes from ordinary causes: two logging runs spliced together at different sample rates, an interval edited out and the remaining data closed up, a tool that stalled and resumed, or a merge of curves that were never on the same frame.

You met this file at the Associate tier from the outside. Its header declares a step of 0, which is the LAS convention for a file whose sampling is not constant, and its average step over the interval works out at exactly 0.5 m, as clean a number as a genuinely uniform file would give. Both of those were warnings you were taught to read. Neither of them is what the pipeline uses.

## The same test, step by step

Nothing special is done to this file. The pipeline calls `uniformStepM` on the converted depth column exactly as it did for feet_20.

**The candidate.** The first difference is taken as the candidate step, so the hypothesis under test is that every interval in this column is about 0.300049 m.

**The tolerance.** It is built the same way, from one percent of the candidate against the float32 floor for the file's deepest sample, and it comes out at about 0.003 m. Note how small that is compared with the candidate: three millimetres of allowance on a step of about three tenths of a metre.

**The walk.** The very next differences are about 0.5 m and about 0.699951 m. Measured against the candidate, they miss it by about 0.2 m and about 0.4 m. The allowance is about 0.003 m. The misses are larger than the allowance by a factor of roughly a hundred, so the first of them is enough to reject the hypothesis, and there is no second chance for another candidate.

**The result.** The function returns nothing. No step exists for this file, the pipeline records that, and the capstone field for whether irregular_20 has a uniform step is the integer 0, meaning no.

## The contrast is the lesson

Put the two files side by side, because they are the same test with opposite outcomes and the numbers make the design visible.

On feet_20 the differences disagree by about 0.000122 m against a tolerance of about 0.006096 m. The disagreement is about one fiftieth of the allowance, and the file passes.

On irregular_20 the differences disagree by about 0.2 m and about 0.4 m against a tolerance of about 0.003 m. The disagreement is roughly a hundred times the allowance, and the file fails.

Between the largest thing the test forgives and the smallest thing it rejects there are three orders of magnitude of clear air. That gap is why a tolerance is the right instrument here. It is wide enough that float32 storage never fabricates an irregular file, and narrow enough that no real change of sampling can hide inside it. A tighter test would fail every converted well for arithmetic reasons. A looser test would start calling spliced files uniform, which is the outcome the field exists to prevent.

There is one more thing the pair demonstrates. On irregular_20 the average is exactly 0.5 m and the header is honest at 0, while on feet_20 the header is honest at 2 feet and the average is 0.609599609375 m. Neither the header nor the average had the same relationship to the truth in both files, and neither was consulted in either case. The only input to the verdict was the converted depth column.

## What the pipeline does next

It does not repair the file. The depth column is kept exactly as logged and converted, the sample count stands, the curves are still imported with their units and kinds, and the one thing that changes is that the step field comes back null, which is an explicit refusal to report a step rather than a number of any kind. irregular_20 is a usable well. It is a well that no downstream code may assume a spacing for.

Open the panel below on irregular_20 and then on feet_20, and watch the first differences tile and the uniformity verdict change together.

{{panel:wd-import-explorer}}

## Exercise

Run the panel on irregular_20 and write down the sample count, the first differences it lists and the uniformity verdict. Then, on paper, state the candidate step the test adopts, the tolerance it builds, the size of the first miss, and what the function returns. Finally answer in one sentence: why does float32 wobble pass this test while irregular sampling fails it, when both are differences that disagree with the candidate?

As a self check: irregular_20 holds 121 depth samples and steps by about 0.300049 m, 0.5 m and about 0.699951 m, so the candidate is the first difference of about 0.300049 m and the tolerance is about 0.003 m. The next differences miss the candidate by about 0.2 m and about 0.4 m, which is roughly a hundred times the allowance, so `uniformStepM` returns nothing and the graded field for whether this file has a uniform step is 0, meaning no. Both cases are disagreements with the candidate, and the tolerance separates them by size: float32 wobble on feet_20 is about 0.000122 m against an allowance of about 0.006096 m, while real irregularity here is about 0.2 m against an allowance of about 0.003 m.
