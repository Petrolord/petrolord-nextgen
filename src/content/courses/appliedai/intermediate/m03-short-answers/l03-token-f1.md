# Token F1

{{panel:ae-scoring-explorer}}

Exact match gives no credit to an answer that is nearly right. Token F1, the second score of the SQuAD script, gives partial credit: it compares the answer and the reference word by word after the same normalisation, and scores the overlap between 0 and 1. This lesson works it by hand and reads it on the two Ekene systems.

## The rule

The engine prints it in its basis:

> token F1 on the normalised whitespace tokens by multiset overlap: precision = common / prediction tokens, recall = common / truth tokens; when either side has no token, 1 if both are empty and 0 otherwise (SQuAD 2.0)

Three counts make the score. The prediction tokens and the truth tokens are the words of each normalised string. The common tokens are the words the two share. Precision is the share of the answer's words that are in the reference, recall the share of the reference's words that are in the answer, and F1 is their harmonic mean, 2 precision recall / (precision + recall).

## Multiset overlap

A word that appears twice counts twice, but only as often as it appears on both sides. The course's stated example is "oil oil water" against "oil water water". "oil" appears twice in the answer and once in the reference, so it is common once. "water" appears once and twice, so it is common once. There are 2 common tokens of 3 on each side:

| quantity | value |
| --- | --- |
| common tokens | 2 |
| precision | 0.666667 |
| recall | 0.666667 |
| F1 | 0.666667 |

Counting "oil" twice would reward an answer for repeating a word.

## On the Ekene short answers

| query | reference | answer | system | exact | F1 |
| --- | --- | --- | --- | --- | --- |
| Q08 | from 0.5 to 0.35 bbl/d/psi | 0.5 to 0.35 bbl/d/psi | A | 0 | 0.888889 |
| Q18 | 0.85 rising to 1.05 | 0.85 rising by 0.04 a month to 1.05 | A | 0 | 0.727273 |
| Q13 | 45.0 percent | 45 percent | A | 0 | 0.500000 |
| Q16 | Ekene-1 91,667 stb, Ekene-3 111,270 stb, Ekene-5 153,506 stb, Ekene-6 105,267 stb | Ekene-1 91,667 stb, Ekene-5 153,506 stb | B | 0 | 0.666667 |
| Q01 | 2,096 psia | about 2,100 psia | B | 0 | 0.400000 |

A's Q08 drops the word "from" and keeps everything else: exact 0, F1 0.888889. A's Q18 adds words the reference does not have, which lowers precision. A's Q13 shares "percent" and misses "450": half credit. B's Q16 lists two of the four wells with their EUR, and scores 0.666667. B's Q01 shares only "psia" with the reference. Its "2,100" is a different figure, and F1 counts it as a different word.

Over the 24 short answers the mean token F1 is A 0.921507 and B 0.712004, the mean of the per-answer F1 column (derived). Exact match counted 20 and 13 of 24; F1 keeps the same order and shows how far apart the misses are.

## What partial credit means

F1 rewards shared words, whatever they are. An answer with the right unit and the wrong number shares the unit, and earns something for it: B's Q01 earns 0.400000 for "psia". An answer that is right and written with a decimal point earns only part credit, as A's Q13 does. Token F1 is a measure of overlap, and it is read as one. For a number, the question "is this the right value" belongs to a check with a stated tolerance.

## Exercise

Open the view for short answers with system A's list and read the mean token F1 tile. Find the rows with F1 below 1 and exact 0, and for each name the tokens that are missing or extra. Then score your own rows: the reference "12.4 ppg" against "12.4 ppg", "12.6 ppg", "ppg" and "12.4 ppg mud weight". Predict each F1 as a fraction before you run it, and check.
