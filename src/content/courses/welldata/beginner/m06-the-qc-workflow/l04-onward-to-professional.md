# Onward to Professional

This tier taught you to read a file's health off a panel. The two tiers above it take the same six teaching files and ask harder questions of them. It is worth knowing now what those questions are, partly so you can see where the path leads, and partly because knowing the destination sharpens the habits you are building at this tier.

One line holds the whole progression together, and it is worth memorising: the beginner READS QC, the professional AUTOMATES it, the expert AUDITS a campaign.

## Professional: the import pipeline

At the Associate tier you read what the parser found. At the Professional tier you drive the full import pipeline, the same code path the platform uses when a file enters the shared registry, and you are graded on what it produces rather than on what a tile displays.

Four things change.

**Units are converted per curve, not just on depth.** At this tier the depth conversion you learned in module 3 stops being a special case. The pipeline inspects every curve's declared unit and converts each one that needs it. On feet_20 that means two curves get converted, not one: the depth column in F, and the sonic in US/F. It is an instructive pair, because it makes the point that a file is not simply a feet file or a metres file. Unit trouble lives curve by curve, and a pipeline that only fixes depth leaves the sonic wrong.

**Curves are recognised by kind.** The pipeline classifies mnemonics into standard curve kinds rather than treating every column as an anonymous array of numbers. On feet_20 it recognises four of them. Recognition is what lets downstream apps ask for the gamma ray without knowing whether this particular vendor called it GR, GRD or SGR, and it is the mechanism behind every automatic curve pick you have ever seen in an interpretation app.

**The metric frame is computed at full precision.** The Associate panel rounds the feet_20 step to 0.6096 m because that is all a human eye needs. The pipeline keeps the frame at working precision: start 1493.52 m, stop 1584.96 m, step 0.609619 m. Over 150 samples the difference between a rounded step and the real one is not cosmetic, and anything that later stacks, resamples or ties on that frame inherits the error.

**Uniformity becomes a verdict.** At this tier the step is not just displayed, it is judged. The pipeline returns a pass or a fail on whether the depth column is uniformly sampled, and irregular_20 fails it. That is the difference between noticing an uneven column and having software that refuses to pretend it is even.

## Expert: the campaign audit

The Expert tier stops looking at files one at a time. Its exercise is a six-file import campaign, which runs the whole pipeline across the entire teaching set and reports on the delivery as a whole:

* the total number of curves imported across all six files
* how many files needed a unit conversion at all
* how many dead curves the campaign detected
* how many files carry a uniform step
* how many samples were parsed out of the wrapped file
* the total count of flagged nulls

This is what a data manager actually faces. Files do not arrive one at a time with a panel waiting for them; they arrive as a delivery of dozens, and the useful question is not "is this file clean" but "what is wrong with this delivery, and which parts of it can I publish today". The Expert readings are all campaign-level totals for exactly that reason. Notice that every one of them is a roll-up of a check you already know: conversions from module 3, dead curves and nulls from module 4, wrapped parsing from module 2, uniformity from module 3. Nothing new is invented at the top tier. The same five checks are simply run at scale and summarised.

## Where this course leaves you

Go back to the idea from the very first lesson of module 1. The data manager is a gatekeeper, not a clerk. Every file that arrives is a claim about the subsurface, and the whole apparatus you have now met, the checklist, the QC panel, the pipeline, the campaign audit, exists to decide whether that claim is fit to be believed before anyone builds on it.

That responsibility is why this course is the root of the geoscience path rather than an optional preliminary. The petrophysicist computing shale volume, the correlator hanging tops, the mapper gridding a surface and the evaluator booking volumes are all working with numbers they did not check themselves. They are trusting that somebody did. Everything downstream trusts what this role lets through.

## Exercise

Without opening the app, list which of the four Professional changes each of these situations would have caught, and say which module of this course first taught you the underlying check: (a) a sonic curve delivered in US/F that was loaded as if it were metric; (b) a depth frame whose step was stored to four decimals and drifted over 150 samples; (c) a file whose depth column skips intervals; (d) a vendor mnemonic no app recognised. Self-checks: (a) per-curve unit conversion, module 3; (b) full-precision metric frame, module 3; (c) the uniformity verdict, module 3; (d) curve kind recognition, which module 2 set up when you read the curve section. Then write one sentence saying which of the six Expert campaign readings you would look at first on a new delivery, and why.
