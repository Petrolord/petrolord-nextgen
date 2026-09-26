# Numbers, dates and quotes as claims

{{panel:ae-retrieval-explorer}}

The engine picks out the parts of an answer that are checkable by matching: the figures, the dates and the quoted phrases. Each of these is a claim, and each claim is looked for in the passages the answer cites. This lesson reads exactly what counts as a claim.

## What a claim is, in the engine's words

    claims: quoted spans (straight or curly double quotes) first, then ISO dates YYYY-MM-DD, then numbers: digits with optional comma thousands groups and a decimal part, a leading minus only after a non-alphanumeric character, a percent sign ignored; a number directly after a letter, or after - _ or / that follows a letter or digit, is part of an identifier and not a claim; every occurrence is a claim

Quotes are taken out first, then dates, then the numbers that remain. A number with thousands commas, such as 2,096, is the single value 2096; the tokeniser split it for retrieval, and the claim reader keeps it whole. A percent sign is ignored, so "45%" is the number 45. A number glued to a word, such as the 1 in "Ekene-1", belongs to an identifier and makes no claim. A figure that appears twice is two claims.

## When a claim is supported

    support: a claim is supported when it appears in a cited passage that was retrieved: a number as a value within 0 x |passage value| of a passage number (equal), a date as the same date, a quote as the same run of tokens (ASCII A-Z lowercased (nothing else changed), split on every run of characters outside [a-z0-9], empty pieces dropped; no stemming)

At the teaching setting a number must equal a number in the passage. A quote is matched as tokens, so its case and punctuation do not matter, but its words must appear together and in the same order.

## A stated answer on the hand set

The answer cites d1 and d4, and d1, d2 and d4 were retrieved:

    Ekene-1 made 120 bopd; the survey read 2,096 psia on 2023-01-01, a "water injection" start, and 45% water, -2 skin.

| claim | kind | value | supported |
| --- | --- | --- | --- |
| 120 | number | 120 | true |
| 2,096 | number | 2096 | true |
| 2023-01-01 | date | 2023-01-01 | false |
| water injection | quote | water injection | false |
| 45 | number | 45 | false |
| -2 | number | -2 | false |

2 of the 6 claims are supported, a supported fraction of 0.333333. 120 is in d1 and 2,096 in d4. The date and the quote are both in d2, which was retrieved and not cited, so they support nothing. 45 and -2 appear in no passage at all. "Ekene-1" made no claim.

## The fraction

The supported fraction is supported claims over claims. Pooled over many answers it counts claims, so an answer with many figures weighs more.

## What the reader cannot see

A claim is only a figure, date or quote. A sentence such as "the well is watering out" makes no claim the engine can test. Units are not read either, so a correct figure with the wrong unit is still found.

## Exercise

In the retrieval explorer choose "Claims in cited answers". Replace the passages with the five hand set lines, and replace the answers with one answer for a query "H1": the text above, citations `["d1", "d4"]` and retrieved `["d1", "d2", "d4"]`. Confirm the six claims and the fraction 0.333333. Then add d2 to the citations and predict which claims turn supported before you read the table.
