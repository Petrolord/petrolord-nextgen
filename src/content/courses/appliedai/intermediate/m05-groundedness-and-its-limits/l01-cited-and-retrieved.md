# Cited and retrieved

{{panel:ae-scoring-explorer}}

The Associate tier checked system A's cited answers claim by claim: every number, date and quoted span in an answer was looked for in the passages the answer cites. This module takes the check onto system B and reads its rules and its limits.

## The rule

A claim is supported only by a passage that the answer cites and that was retrieved for the query. The engine prints the rule in its basis:

> a claim is supported when it appears in a cited passage that was retrieved: a number as a value within 0 x |passage value| of a passage number (equal), a date as the same date, a quote as the same run of tokens (ASCII A-Z lowercased (nothing else changed), split on every run of characters outside [a-z0-9], empty pieces dropped; no stemming)

Cited means a reader can go and check. Retrieved means the system had the passage for this query. A citation to a passage the system never retrieved supports nothing.

## The two flags

Two kinds of citation are flagged:

> citation EKD-059 was not retrieved for this query

> citation EKD-061 is not a passage of the corpus

System B's Q15 answer cites EKD-059, which is not in B's top 5 for that query. System B's Q21 answer cites EKD-061, and the corpus ends at EKD-060. Both were planted. The first flag is a citation the system could not have read; the second is a citation to nothing.

## Both systems, side by side

At k 5, with each system's retrieved lists and numericRelTol 0:

| figure | system A | system B |
| --- | --- | --- |
| claims | 49 | 41 |
| supported | 47 | 30 |
| pooled supported fraction | 0.959184 | 0.731707 |
| answers with a claim | 22 | 24 |
| fully supported answers | 20 | 15 |
| citations not retrieved | 0 | 1 |
| unknown citations | 0 | 1 |

"Grounded", in this course, means supported by a cited and retrieved passage. System B has 11 unsupported claims, and each one is what the course calls a hallucination: a figure the check could not find in a cited, retrieved passage, named with the engine's reason. The next lesson reads those reasons.

## Without the retrieved lists

A check can be run with no retrieved lists at all, when all you have is the answer and its citations. Then every cited passage of the corpus can support a claim, and the basis says so:

> a citation that is not a passage of the corpus is flagged unknown; no retrieved list was given, so every cited passage of the corpus can support a claim

System B then has 31 of 41 claims supported, 0.756098, because Q15's citation of EKD-059 now counts. The figure is higher and it answers a weaker question. Report which rule ran.

## Citations are a list

The citations of an answer are a list of passage ids, and each must be a non-empty id:

> citations must be an array of passage ids

> citations[0] must be a non-empty string

## Exercise

Open the scoring explorer on the view for groundedness. It starts with every Ekene passage, system B's answers, B's retrieved lists, and numericRelTol 0. Read the six tiles and the two flag lines against the table above. Switch "Use the retrieved lists" to no, and read which tiles changed. Then edit B's Q01 answer so that its citations are the single string "EKD-018" in place of a list, and read the refusal.
