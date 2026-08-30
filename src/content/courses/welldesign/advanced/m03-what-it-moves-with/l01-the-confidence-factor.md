# The confidence factor

One number, chosen by convention, that scales every separation factor.

{{panel:wd-clearance-explorer}}

## Where it enters

The separation factor is a clearance divided by k times the combined sigma. So for a positive factor:

    separation factor is proportional to 1 / k

Halve k and the factor doubles. That is the whole of its effect, and it is a large one.

## The standard value

The clearance examples use k = 3.5, which is the industry convention for anti-collision.

In two dimensions that corresponds to a confidence of about 99.8 percent under a normal assumption, and in three dimensions to rather less. But that translation is not really the point: 3.5 is a chosen scaling of a model with unmodelled tails, and the number carries a risk judgement rather than a probability.

## The sensitivity, measured

The panel's sensitivity view runs the same pair at k = 2.0, 3.5 and 5.0.

On a POSITIVE factor the effect is exactly proportional: the k = 2 result is 1.75 times the k = 3.5 one, and the k = 5 result is 0.7 times it.

On a NEGATIVE factor the same proportionality applies with the opposite meaning, which is the previous module's lesson.

## Why it must be agreed in advance

Because two parties can compute the same pair of wells correctly and disagree about whether it is safe.

An operator using k = 3.0 and a partner using k = 3.5 differ by 17 percent on every factor, which is enough to move a case from clear to review. The disagreement has nothing to do with the wells.

So the confidence factor is stated in the drilling programme, agreed between the parties, and not adjusted afterwards. Adjusting it to clear a well is the most direct way to make an anti-collision statistic meaningless, and it leaves no trace in the reported number.

## What a different k does not change

The geometry. The centre-to-centre distance, the closest approach point, the two hole radii and the tool allowance are all independent of k.

So a report that states the geometry alongside the factor lets a reader recompute at their own k. A report that states the factor alone does not.

## The relation to the thresholds

The thresholds of 1.0 and 1.5 are calibrated for k = 3.5. They are not universal constants: a house using k = 3.0 with the same thresholds is accepting a different risk level, whether or not anybody noticed.

Changing k and keeping the thresholds is therefore a change in policy dressed as a change in convention, and it is worth being explicit about.

## The honest form

State k in the report header, alongside the model, the parameter sets and the search radius. It costs one line and it is the difference between a number somebody else can use and a number they have to trust.

## The misconception to avoid

"k = 3.5 means 3.5 sigma, so about 99.98 percent." That is the one-dimensional figure. In two dimensions the same k gives about 99.8 percent and in three dimensions less, and none of those percentages is real anyway because the distribution's tails are not modelled. k is a scaling with an agreed value, and treating it as a calculated confidence gives it a precision it does not have.

## Exercise

A pair of wells gives a separation factor of 1.62 at k = 3.5.

Compute the factor at k = 3.0 and at k = 4.0. State which of the three, if any, would place the well in the review band, and say what that shows about quoting a factor without its k.
