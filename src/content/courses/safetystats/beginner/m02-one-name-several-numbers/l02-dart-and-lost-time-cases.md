# DART and lost time cases

{{panel:ss-rates-explorer}}

UGHELLI had 9 recordable cases, 4 DART cases and 2 lost time cases in 2318640 hours. On the 200,000 hour base those read 0.776317, 0.345030 and 0.172515. The hours and the base are the same on every line; only the count changes.

| case class | count, stated | per 200,000 hours | per 1,000,000 hours | ratio, derived |
| --- | --- | --- | --- | --- |
| recordable | 9 | 0.776317 | 3.881586 | 5.000000 |
| DART | 4 | 0.345030 | 1.725149 | 5.000000 |
| lost time | 2 | 0.172515 | 0.862575 | 5.000000 |

The ratio column is 5.000000 on every row, because moving from the OSHA base to the IOGP base multiplies every rate by the same factor. The case class does not change that.

## Nested counts

DART stands for days away, restricted or transferred. A DART case is a recordable case serious enough that the worker lost days, had their duties restricted, or was moved to another job. A lost time case is narrower again: the worker was away from work. So on a site that classifies consistently, every lost time case is also a DART case, and every DART case is also a recordable case. UGHELLI's counts nest that way: 2 inside 4 inside 9.

That nesting is why the three rates fall in the order they do. The recordable rate is the widest net, and the lost time rate the narrowest. A report that shows only the lost time rate is showing the smallest of the three numbers, and a reader should know which one they are looking at.

## The engine does not check the class

All three rates come from the same `incidenceRate` call with a different count. The engine never sees the word DART and cannot tell whether a count of 4 is DART cases or something else. The name a company prints beside the rate is not something the engine checks. That puts the whole weight of the label on the person reporting it.

The BLS worked example makes the same point with published numbers. ABC Company's 7 recordables in 400000 hours read 3.500000 on the OSHA base, and its 3 DART cases in the same hours read 1.500000. The published figures are 3.5 and 1.5, and the engine matches both with a relative difference of 0.

## Where the definitions differ

Different bodies draw the case classes differently. IOGP's lost time injury rate counts fatalities plus lost workday cases per million hours, and its total recordable rate counts fatalities, lost workday cases, restricted workday cases and medical treatment cases per million hours. A company whose own definitions leave out fatalities, or count restricted work differently, can produce a number with the same letters and a different meaning. The engine's arithmetic is identical in every case, which is exactly why the definition has to be written beside the rate.

## Exercise

Take UGHELLI's 4 DART cases and 2318640 hours. Compute the DART rate on the OSHA base by hand and check it against 0.345030. Then multiply your answer by 5 and compare with 1.725149. Repeat for the 2 lost time cases against 0.172515 and 0.862575. Finally, halve the DART rate of 0.345030 and compare the result with the lost time rate of 0.172515, then explain in one sentence why halving the count halves the rate when the hours stay the same.
