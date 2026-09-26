# Exact match

{{panel:ae-scoring-explorer}}

Exact match is the strictest score a short answer can get. The engine states it in one line of its basis: "the normalised strings are equal". An answer scores 1 when its normalised form equals the reference's normalised form, and 0 otherwise. There is no partial credit and no tolerance. Everything the score forgives, it forgives through the normalisation of the last lesson; everything else is a miss.

## The two systems

Both systems gave a short answer to all 24 queries. Scored against the reference answers:

| system | exact matches |
| --- | --- |
| A | 20 of 24 |
| B | 13 of 24 |

The denominator is the 24 queries, Q24 included: a short answer is scored against its reference whether or not the query had a relevant passage. Each row is one call of the engine's `answerMatch`, and the count is the number of rows that score 1.

## Rows that match, and rows that do not

| query | reference | answer | system | exact |
| --- | --- | --- | --- | --- |
| Q04 | 2000 psia | 2,000 psia | B | 1 |
| Q03 | Ekene-2 and Ekene-4 | Ekene 2 and Ekene 4 | B | 0 |
| Q13 | 45.0 percent | 45 percent | A | 0 |
| Q13 | 45.0 percent | 45.0 percent | B | 1 |
| Q05 | 2024-03-01 | 2024-09-01 | B | 0 |

B's Q04 "2,000 psia" matches "2000 psia" because the comma is punctuation and is dropped. B's Q03 misses, because "Ekene 2" keeps its space and becomes "ekene 2", where the reference's "Ekene-2" becomes "ekene2". A's Q13 misses on a decimal: "45.0 percent" normalises to "450 percent" and "45 percent" stays "45 percent". The two answers state the same quantity, and exact match does not know it. B's Q05 misses because the date is wrong.

Those five rows are the whole character of the score. It is right about Q05, a wrong answer. It is harsh on Q13 and Q03, where the answer is right and written differently. It is generous on Q04 only because the difference happens to be punctuation.

## What exact match cannot see

The course states the limit in plain terms: an exact match compares normalised strings, and it does not know that "45.0 percent" and "45 percent" are the same quantity. A numeric-aware match is the common alternative. The engine keeps the published script's rule and states it, and it scores numbers with a tolerance where the job needs one: field extraction, later in this tier, does exactly that.

The consequence for a report is simple. An exact-match count on its own favours the system that writes figures the way the references do. Read it beside token F1, the next lesson, and look at the rows where the two disagree.

## Stated inputs

Exact match needs two strings. A prediction that is a number is refused before anything is compared:

> prediction must be a string

An empty string is text, and the lesson after next shows what the engine does with it.

## Exercise

Open the view for short answers. Read the exact-matches tile for system A, and find the four rows where A scores 0. Then build a list of your own with one reference, "2,096 psia", and five candidate answers as five rows: "2096 psia", "2,096 PSIA", "2,096 psi", "about 2,096 psia" and "2096.0 psia". Before you run it, predict which rows score exact 1 and write down why. Run it and check each prediction against the normalised columns.
