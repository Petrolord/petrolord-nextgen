# Normalising an answer

{{panel:ae-scoring-explorer}}

Retrieval scores say whether the right passages were found. A copilot also returns an answer, and the Ekene systems each give a short answer to every query beside their longer text. Scoring a short answer against the reference means comparing two strings, and two strings that a reader would call the same often differ in case, punctuation or an article. So the engine normalises both sides first, by a published rule, and compares what is left. This module scores the Ekene short answers, and this lesson is the rule.

## SQuAD normalisation

The engine uses the normalisation of the published SQuAD evaluation script and prints it in its basis:

> SQuAD: lowercase, drop ASCII punctuation, replace the words a, an, the by a space, collapse whitespace

Four steps, in that order. Nothing else changes: no unit is converted, no number is parsed, no word is stemmed.

## What the rule does to oilfield text

| text | normalised | tokens |
| --- | --- | --- |
| `2,096 psia` | `2096 psia` | 2 |
| `45.0 percent` | `450 percent` | 2 |
| `45 percent` | `45 percent` | 2 |
| `Ekene-3` | `ekene3` | 1 |
| `Ekene 3` | `ekene 3` | 2 |
| `The Ekene Sand` | `ekene sand` | 2 |
| `a 2 kg wrench` | `2 kg wrench` | 3 |
| `near-miss` | `nearmiss` | 1 |
| `0.5 bbl` | `05 bbl` | 2 |
| `the` | (empty) | 0 |

Read the rows. Punctuation is dropped, and dropping it joins what it separated: the comma in "2,096" goes and the digits close up, the hyphen in "Ekene-3" goes and the well name becomes one token, and the decimal point in "45.0" goes and leaves "450". A space is kept, so "Ekene 3" stays two tokens. The article "the" is replaced by a space, so a string that is only "the" normalises to nothing at all.

## Two tokenisers in one course

The Associate tier tokenised passages for retrieval, and that rule split on every character outside [a-z0-9], so "Ekene-3" gave two tokens and "1.25" gave two. The SQuAD rule drops the punctuation instead of splitting on it. Both are the engine's stated rules for different jobs, and a figure from one is never compared with a figure from the other. When a short answer surprises you, normalise it by hand with the SQuAD rule before reading its score.

## Text in, text out

The normaliser takes one string. Anything else is refused:

> text must be a string

A short answer scored against a reference is refused the same way when the answer is not text:

> prediction must be a string

## Exercise

Open the scoring explorer on the view for short answers. It lists system A's 24 short answers with their references, each normalised. Find the rows for Q01, Q03 and Q13, and write down what the normaliser did to each answer. Then replace the whole list with two rows of your own, `[{"query": "t1", "answer": "The Ekene Sand", "reference": "Ekene sand"}, {"query": "t2", "answer": "Ekene 3", "reference": "Ekene-3"}]`, and read what each side normalises to. Finally add a third row whose answer is the number 45 with no quotation marks, and read the refusal.
