# A second annotator as a check

{{panel:ae-trust-explorer}}

The annotator agreement module measured how far two annotators agree on the Ekene judged set. This lesson asks the question that matters for a comparison: if the second annotator's grades had been the key, would the systems come out in the same order?

## Both systems, both keys

The same runs, scored at k 5 and grade 1 or more, first against the primary grades and then against the second annotator's:

| judgments | queries in the means | A MAP | B MAP | A mean nDCG | B mean nDCG |
| --- | --- | --- | --- | --- | --- |
| primary | 23 | 0.600278 | 0.593007 | 0.762753 | 0.764137 |
| second annotator | 24 | 0.551119 | 0.542743 | 0.718064 | 0.701037 |

Read the nDCG columns. On the primary grades system B has the higher mean nDCG, 0.764137 against 0.762753. On the second annotator's grades system A does, 0.718064 against 0.701037. The order of the two systems flips when the key changes and nothing else does.

Every figure also falls under the second annotator, and the query count changes: under the second annotator no query is excluded, so 24 queries enter the means where the primary grades have 23. The second annotator gave some passage for Q24 a grade of 1 or more, so the query nothing answers is scored under that key.

## The rule this gives

A difference between two systems smaller than the difference between two annotators is not a finding. On nDCG the systems differ by less than two hundredths under either key, and switching keys moves each system by more than four hundredths. The paired bootstrap of the Professional tier reached the same verdict from a different direction: on seed 7, 2000 replicates and level 0.95, its interval for the nDCG difference ran from -0.068015 to 0.058726, across 0. Two independent checks agree that these two systems cannot be told apart on this judged set.

## Kappa as the first warning

The kappa of the two annotators, unweighted 0.579841, was the first warning. Kappa at the relevance threshold the metrics use tells you how stable the key is at that line: at grade 1 or more it is 0.634430, at grade 2 or more 0.794115. A metric computed at grade 1 inherits the weaker of the two.

Rescoring on a second key costs a second set of judgments, which is expensive. The kappa costs only the overlap. A sound practice is to have a second annotator grade a sample, measure kappa at the metric's threshold, and rescore on the second key whenever a comparison is close.

## Exercise

Open the trust explorer on "Cohen's kappa" with the Ekene annotators loaded. From the confusion table the panel prints, count the pairs where one annotator gave grade 0 and the other grade 1 or more. Subtract them from 183 and divide by 183, and check that you reach the observed agreement at grade 1 or more, 0.814208. Repeat for the line between grade 1 and grade 2, and check 0.928962.
