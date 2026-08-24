# Why a uniform step matters

At the Associate tier you learned to tell a uniform depth column from an irregular one, and you learned not to trust the average. This tier asks the next question. The import pipeline has to decide, for every file it takes in, whether a single sample interval exists, and it has to write that decision into a field every application above it will read. This lesson is about why that field earns its place.

## What a constant interval buys you

A depth column with a constant increment is more than tidy. It is a promise that the sample index and the depth are interchangeable. Sample 100 sits exactly 100 steps below sample 0, so code with an index can get a depth by multiplying, and code with a depth can get an index by dividing. Much of log processing rests on that promise silently.

Three families of downstream work lean on it hardest.

**Thickness by counting.** Net pay, net sand and every other footage number is a count of samples passing a cutoff, multiplied by the sample interval. If no single interval exists, there is nothing to multiply by.

**Moving windows.** Running averages, despiking, smoothing filters, gradient curves and the windowed shale volume calculations petrophysics uses are all defined over a number of samples. A five sample window is a 3 m window only when every sample sits about 0.6 m from its neighbour. Where the spacing varies, the same window covers different amounts of rock at different depths, so the filter output is stretched in some places and squeezed in others, and nothing in the output curve says so.

**Shared frames.** Merging two logging runs, splicing in a repeat section, resampling one well onto another's frame, and building the evenly sampled series a synthetic seismogram needs all begin by assuming a regular frame exists. That frame is usually carried as three numbers, a start, a stop and a step, and rebuilt from them.

## What breaks when the assumption is wrong

The damage from a wrong step is rarely loud. That is what makes it expensive.

If the step is right in kind but wrong in value, every thickness is wrong by the same proportion and every depth reconstructed from the frame drifts, a little at the top of the well and a lot at the bottom. Nothing looks broken. The curves plot, the tops hang, the numbers are plausible, and the error is a scale factor buried in a booking.

If the file is genuinely irregular and something downstream assumes a step anyway, the failure is worse, because it is not a single scale factor. Each interval is misallocated by its own amount. Thin beds in the closely sampled runs are under counted and coarse runs are over counted, and the total can land close to the honest answer while every interval is wrong. No single correction fixes it, because there is no single error.

The third failure is the quiet one. Software handed a step it can use will use it, with no way to know whether the number came from a measurement of the depth column or from a header line somebody typed. Whatever the pipeline puts in the step field is believed.

## The header's STEP entry is a claim

Every LAS file carries a STEP entry in its well section, and feet_20 declares a step of 2 in feet with a start of 4900 and a stop of 5200. That entry is a statement of intent by whoever wrote the file. Nothing in the format checks it against the data section, and nothing stops an export writing a nominal step while the depth column does something else.

The failure modes are ordinary rather than exotic. A file is edited to remove a bad interval and the header is not updated. Two runs are concatenated and the header keeps the step of the first. A tool stalls and the header still carries the programmed sample rate. The convention for a genuinely irregular file is to declare a step of 0, and a well behaved exporter does that, but the convention is a courtesy rather than a rule.

There is a second reason the header cannot be taken at face value in this pipeline. The header's STEP is in the file's native unit. On feet_20 it is 2 in feet, which is not a metric step at all. Even a header that is perfectly honest about the file as delivered is not yet an answer to the question the registry asks, which is what the step is in metres after conversion.

## Why the importer tests instead

So the importer does not read the step. It measures it.

After the depth column has been converted to metres, the pipeline hands that column to a test that walks the consecutive differences and decides whether one interval describes all of them. If one does, the test returns it and the file is recorded as having a uniform step in metres. If none does, the test returns nothing, and the pipeline records that the file has no uniform step rather than inventing one.

That is the whole design, and one property is worth naming now. The test is allowed to fail. An average is not. Divide the depth range by the number of intervals and you always get a number, which means you have built a check that can never report a problem. A test that can only ever succeed is not a test. The next lesson takes the real rule apart in detail, and the two after that watch it pass on one file and fail on another.

## What the pipeline records

The output is deliberately small. There is a depth step in metres when one exists, and the field comes back null when one does not. That null is an absence of a value rather than a value, and it has nothing to do with the LAS NULL flag for missing samples that you met at the Associate tier. The capstone grades both halves: a step in metres for feet_20, and an integer 1 or 0 for whether irregular_20 has a uniform step at all. Recording the null is as much a result as recording the number, because it is what stops a downstream app from assuming.

## Exercise

Write down three specific pieces of downstream work from your own discipline that would use a sample interval without checking whether one exists, and for each, say whether a wrong step value or a missing step would do more damage. Then answer in one sentence: why can the average step never be used as the uniformity check?

As a self check: thickness by counting, moving window filters and shared depth frames are the three families this lesson names, and a wrong step scales every thickness while a missing step misallocates each interval by its own amount, which cannot be corrected afterwards with a single factor. The average can never be the check because dividing the range by the number of intervals always returns a number, so a check built on it can never report a failure.
