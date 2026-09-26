# The reasons a claim fails

{{panel:ae-scoring-explorer}}

An unsupported claim is half a finding. The engine's reason gives the other half: where in the corpus, if anywhere, the figure does appear. Read that way, every unsupported claim falls into one of four kinds.

## Four places a figure can be

1. In a retrieved passage the answer does not cite. The system had the passage and cited the wrong one: a citation error.
2. In a cited passage that was not retrieved. The system cited something it could not have read.
3. Only in other passages, neither cited nor retrieved. The figure is real, and it came from somewhere the answer cannot show.
4. In no passage of the corpus. Nothing the system could have read contains it: a fabrication.

## System B's reasons, one of each

A citation error, on Q12, "setting depth of the 9.625 in casing shoe":

> the number 1800 is not in the cited passage EKD-039; it appears in retrieved passages EKD-038 and EKD-042, which the answer does not cite

B's short answer, "1800 m MD", is an exact match. The answer is right, and a reader who followed its citation would not find the figure.

A cited passage that was not retrieved, on Q15:

> the number 0.0012 is unsupported: no cited passage is a retrieved passage of the corpus; it appears in EKD-059, cited but not retrieved

A figure from outside the answer's reach, on Q03, "Which wells were converted to water injectors?":

> the number 92.7 is not in the cited passages EKD-002 and EKD-004; it appears only in passage EKD-034, neither cited nor retrieved

Both of B's Q03 rates were planted from EKD-034.

A fabrication, on Q07, "volumetric STOIIP estimate for the Ekene Sand":

> the number 12.1 is not in the cited passage EKD-008; it appears in no passage of the corpus

The reference is 12,139,208 stb. The answer said 12.1 million stb, a planted unit change. The value is a fair rounding, and the check still cannot support it: it compares numbers, and it does not convert units.

## The whole of system B

| where the figure is | claims (counted from the reasons) |
| --- | --- |
| in a retrieved passage the answer does not cite | 3 |
| in a cited passage that was not retrieved | 1 |
| only in passages neither cited nor retrieved | 5 |
| in no passage of the corpus | 2 |

## Why the reason matters

A pooled supported fraction of 0.731707 does not say what to fix. The reasons do: a citation error is fixed by citing the passage the figure is in; a figure from a passage the system never retrieved has no source the answer can show; a fabrication points at the answer writer. When you report hallucinations, report each one with its reason.

## Two answers to one query

The check scores one answer per query. A set with two answers to the same query is refused, because the pooled fraction would count one query twice:

> answers[1].query repeats Q01 (answers[0]): one answer per query

## Exercise

Open the view for groundedness with its defaults: every passage, system B's answers and retrieved lists, and numericRelTol 0. Read the table of unsupported claims, and put each of the 11 rows into one of the four kinds by reading its reason. Check your counts against the table above. Then copy B's Q01 answer, paste it as a second entry in the answers list, and read the refusal.
