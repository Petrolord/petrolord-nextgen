# What a campaign number is

Every reading this tier grades is an aggregate. An aggregate is a number computed over a set of files rather than read off one of them, and it behaves differently from the fields you produced at the tier below. This lesson is about that difference, because a reader who treats a campaign number like a single-file field will be confidently wrong at some point, and the mistake will not look like a mistake.

## The two kinds of number you have now met

At the Professional tier, a converted start depth of 1493.52001953125 m was a property of one file. You could point at the header it came from, at the factor applied to it, and at the float arithmetic that produced the last few digits. If you doubted it, you opened the file.

At this tier, a count of 5 files with a uniform depth step is not a property of any file. No file in the delivery contains the number 5. It exists only across the set, and there is nothing to open in order to check it. You check it by re-running the test on each member and re-counting, which is a different act from verifying a field.

That is the structural difference. A field is read. An aggregate is constructed. Anything constructed can be constructed from the wrong parts, and the result still looks like a number.

## The two questions to ask of any aggregate

Make these a habit now and apply them to every campaign reading in the rest of the tier.

**What is it counting?**

The unit of the count is the first thing to establish and the thing most often assumed. A count of 5 counts files. A count of 24 counts curves. A count of 1 for the dead curve counts curves as well, even though it points at one file. A count of 161 counts samples in one curve of one file. A count of 272 counts flagged samples across the value curves of one file, which is why it can be larger than that file's 201 depth samples.

Those are five different units on one summary page. The file counts and the curve counts are the easy pair to slide between, because a reader who knows that one file converts and one curve is dead can end up believing that one curve was converted. That is not the reading.

Write the unit beside the number every time. Five files. Twenty four curves. One curve. One hundred and sixty one samples.

**What does it hide?**

An aggregate is a summary, and summarising is throwing information away on purpose. The question is always what went into the bin.

A count of 5 uniform files hides which five. It also hides how badly the sixth failed, since the uniformity verdict is a yes or a no and a column that wobbles slightly scores the same as one that wanders. A count of 24 curves hides whether any of those curves carries usable data. A single null total hides how those nulls are distributed, and that particular concealment is the subject of module 4, which spends five lessons on one number.

Neither question is rhetorical. Both have answers, and the campaign panel can give you both, because it shows the composition beside every aggregate. The habit worth building is asking before you look.

## Aggregates fail differently

Two failure modes belong to aggregates and to nothing else.

**Silent membership errors.** If a seventh file were added to the delivery, the count of files with a uniform step could rise to 6 while the count of files without one stays at 1, and nothing about the number 6 announces that the set changed. An aggregate is only meaningful with its set attached. Five out of six is a reading. Five is not.

**Uneven contribution.** Every file contributes 4 curves to the count of 24, so that aggregate is evenly built. The null count in this delivery is nothing like evenly built, and one file dominates it. An aggregate built from one dominant member describes that member while appearing to describe the set. Note also that counts do not cancel, which is why this tier counts uniform files instead of averaging step sizes, since an average would absorb an irregular column into a plausible number and hide it.

## Why these particular aggregates are counts

Every graded reading in this tier is a count, and every one carries a tolerance of zero.

That is unusual. The Professional tier graded converted depths to 0.01 m, because a converted depth is a continuous quantity produced by float arithmetic, and the sensible question about it is whether you are close enough. Ask the same question of a count and it stops making sense. There is no depth-unit conversion that leaves you 0.6 of a file needing conversion. Either the file needs one or it does not.

So the tolerance is zero because the quantity is discrete, and being one off is not being nearly right. It is having a different model of what is being counted. A learner who answers 6 for the curve count of a single file has not miscounted by one. They have counted the depth index as a measurement, which is a different belief about what a curve is, and module 2 exists to settle it.

That is the reason to be precise about the unit and the membership before you compute anything. With no tolerance to absorb it, every ambiguity in the definition lands directly on the answer.

## One number to leave alone

The delivery's largest count is the 272 flagged nulls in nullheavy_20. Apply the first question and you can already say what it counts, which is flagged samples across that file's value curves. Apply the second question and you can already say that it must hide a distribution, since 272 flagged samples in a file of 201 depths cannot be spread evenly over four curves without something specific being true.

Stop there. Module 4 owns the composition of that number and it is the central teaching point of the tier. Guessing at it now costs you the moment when the breakdown lands.

## Exercise

Take the six graded readings named in the tier so far and write each one out in the form "N units of X, over set S". Then, for each, write one sentence saying what the number hides. Do not compute anything and do not look up the composition of the null count.

Self-check: the readings are curves across the campaign, files needing depth unit conversion, dead curves in the delivery, files with a uniform depth step, depth samples in one wrapped file, and flagged nulls in one null-heavy file. Their units are curves, files, curves, files, samples and samples in that order, and the sets are the six-file campaign for the first four and a single named file for the last two. On concealment, the curve count hides whether those curves carry data, the file counts hide which files, the dead-curve count hides which curve, and the null count hides its distribution.
