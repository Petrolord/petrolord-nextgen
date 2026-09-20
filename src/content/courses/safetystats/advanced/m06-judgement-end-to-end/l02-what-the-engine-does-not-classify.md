# What the engine does not classify

The engine tables 22 refusals across 9 functions, and every one of them is about the shape of an input: a fraction where a count belongs, zero hours, a missing base, a tier of 3. Not one of them refuses a count that was classified wrongly. On AMUKPE, moving 2 recordables to first aid takes the site rate from 1.161259 to 0.982603, and the engine returns both without complaint.

| decision | made by | what the engine checks |
| --- | --- | --- |
| is this injury recordable | the caller | that the count is a whole number, zero or more |
| is this a DART or lost time case | the caller | the same |
| is this release Tier 1 or Tier 2 | the caller | that the tier is 1 or 2 |
| whose hours are these | the caller | that the hours are finite and above zero |

## Every figure starts from a count someone classified

Every rate in this course starts from a count. Someone decided that an injury was recordable, that a restricted day was a restricted day and a lost day was a lost day, and that a release crossed a Tier 1 threshold. The engine receives the result of those decisions as a number. It checks that the count is a whole number and that the hours are positive. It cannot check whether the decisions were right.

This is one of the engine's declared limits, stated in its own header: it does not classify an event as recordable, DART or lost time, because the count arrives classified.

## The process safety tier is an input

API RP 754 is the clearest case. Deciding whether a release is Tier 1 or Tier 2 needs the threshold quantity tables of API RP 754, which are licensed content and are not in the engine, the golden or this course. So the tier is an input. The engine's refusal for a tier of 3 or a missing tier says so in its own words:

> tier must be 1 or 2: classify the events against API RP 754 before rating them

A learner who is given a tier can rate it. UGHELLI's 1 Tier 1 event in 2318640 hours is 0.086257 per 200,000 hours. A learner who is given a release has to classify it outside this engine.

## Where the judgement stays

The judgement stays with the people who keep the register. The engine can make a correctly classified count into a correctly computed rate, with its base named, its interval exact and its chart drawn to the textbook. It cannot make a wrongly classified count right, and it will return a wrong count's rate with the same six decimals and the same clean `basis` block as a right one.

That is why the monitoring note at Expert carries more than numbers. Any reclassification in the period, the definition of a recordable used, whether contractors are in both halves of every rate: these are statements about classification, and the analyst writes them because the engine cannot.

## A test for any rate you are handed

Ask of every rate three questions the engine never asks. Who classified the count, and against which definition? Did the classification change during the period? Would the same review, applied to cases on the other side of the line, ever move one up?

## Exercise

Take UGHELLI's 4 Tier 2 events in 2318640 hours, rated at 0.345030 per 200,000 hours. Compute the rate if one of those events were reclassified as Tier 1 on review, for both tiers. Then write down which document you would need to see before accepting that reclassification, and why the engine could not see it for you.
