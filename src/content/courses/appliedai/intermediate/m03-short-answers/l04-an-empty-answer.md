# An empty answer and an abstention

{{panel:ae-scoring-explorer}}

A system that finds nothing should say so, and a query that nothing answers should be left unanswered. Both produce an empty short answer, and an empty string is where exact match and token F1 need a rule of their own: there are no tokens to overlap. The engine states the rule, taken from SQuAD 2.0, and the Ekene set was built to show it from both sides.

## The rule for an empty side

The last clause of the token F1 basis:

> when either side has no token, 1 if both are empty and 0 otherwise (SQuAD 2.0)

Exact match needs no extra rule, because two empty strings are equal. So an empty answer to an empty reference scores exact 1 and F1 1. An empty answer to a reference with words scores 0 on both, and so does an answer with words against an empty reference.

## Three planted cases

| query | reference | system | answer | exact | F1 |
| --- | --- | --- | --- | --- | --- |
| Q24 | (empty) | A | (empty) | 1 | 1.000000 |
| Q14 | water free | A | (empty) | 0 | 0.000000 |
| Q24 | (empty) | B | 2024-03-01 | 0 | 0.000000 |

Q24, "subsea tree replacement on Ekene-5", has no relevant passage and an empty reference: nothing in the corpus answers it. System A gave an empty short answer, and its longer text says "No retrieved passage mentions a subsea tree replacement.". That is a correct abstention, planted as one, and it scores full credit.

System A's Q14 is the other side. "Is Ekene-5 producing water?" has the reference "water free", and BM25 retrieved none of its relevant passages in the top 5. A's answer is empty, and its text says "The retrieved passages do not say whether Ekene-5 produces water.". The abstention is honest about what was retrieved, and it is still a miss: F1 0. The failure was in retrieval, and the answer score records it.

System B's Q24 answers a question nothing answers, with a date. The planted defect is a fabricated event, and the short answer scores 0.

## Words that normalise to nothing

Empty is decided after normalisation. The SQuAD rule replaces the articles a, an and the by a space, so an answer of "the" normalises to the empty string and is scored as an abstention. Against an empty reference it would score 1. Read the normalised columns as well as the raw answers.

## Why abstention earns credit

Scoring a correct abstention as a match rewards the behaviour a reader wants: say nothing when nothing was found. Scoring it as a miss where the reference has an answer keeps a system from abstaining its way to a clean record.

## Stated inputs

An empty string is text and is scored. A prediction that is a number is refused:

> prediction must be a string

Write an abstention as an empty string.

## Exercise

Open the view for short answers with system A's list, and find the rows for Q14 and Q24 in the normalised columns. Then score four rows of your own against the references "" and "0.5 bbl": the answer "" against each, and the answer "the" against each. Predict the four exact and F1 figures before you run it. Finally put system B's answer, "2024-03-01", in place of A's empty answer on Q24 and read its score.
