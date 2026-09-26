# When kappa has no value

{{panel:ae-trust-explorer}}

Kappa divides by the disagreement chance would produce. When that expected disagreement is 0 there is nothing to divide by, and a kappa cannot be computed. The engine does not guess a value and does not refuse the call. It returns kappa as null with the reason beside it.

## The one case, and the reason

The expected disagreement is 0 when both raters give every item one and the same label. The engine returns the counts and the agreements, and in place of a kappa it returns this note:

> kappa is undefined: both raters gave every item the same label (2), so the expected disagreement is 0

The boundary is exact: an expected disagreement above 0 gives a kappa, and one of 0 gives null with the reason. A single disagreement anywhere moves the expected disagreement above 0, and kappa returns.

## A result with a note is not a refusal

A refusal is a call the engine will not run, because an input is wrong: it returns an `error` and names the `field`. A result with a note is a call that ran on valid inputs where one figure has no defined value: it returns everything else and puts the reason beside the missing figure. Kappa on two raters who always agree on one label is the second kind. Say that kappa "is returned as null, with the reason", and keep the word "refused" for the first kind.

Recall and average precision on Q24, and an answer with no checkable claim, are results of the same kind.

## The refusals that do belong to kappa

For contrast, these are refusals, each naming its field:

> a must be a non-empty array of ratings

> b must be an array of 3 ratings, one per item of a

> labels must be given in order for linear weights on string ratings (the weights use the label positions)

An empty rater list, two lists of different lengths, and weighted kappa on words with no label order: each question was malformed.

## Why this case is worth a lesson

A judged set in which both annotators mark every passage for a query as not relevant is common: Q24, "subsea tree replacement on Ekene-5", has 8 judged passages, all at grade 0 in the primary grades. If you measure agreement query by query, a query like that can give two raters with one shared label, and the kappa for that query has no value. The honest report says so and gives the observed agreement, which is 1, beside the null.

## Exercise

Open the trust explorer on "Cohen's kappa". Clear both boxes and type five ratings of 2 for each rater. Read the note the engine returns and the observed agreement tile. Change one of rater b's ratings to 1, read the new kappa, and explain it from the observed and expected tiles. Then make rater b's list one rating shorter and read the refusal. Write one line for each of the three results saying whether it was a refusal or a result with a note.
