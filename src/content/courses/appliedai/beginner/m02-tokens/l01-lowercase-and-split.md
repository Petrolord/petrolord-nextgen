# Lowercasing and splitting text

{{panel:ae-retrieval-explorer}}

Before a passage can be scored it has to become a list of tokens, the units every later count is made of. The engine turns text into tokens by one short rule, and it states that rule in its basis so every token can be worked by hand. This lesson reads the rule and applies it to real Ekene sentences.

## The rule, in the engine's words

    ASCII A-Z lowercased (nothing else changed), split on every run of characters outside [a-z0-9], empty pieces dropped; no stemming

Read it in three steps. First, the capital letters A to Z become small letters, and nothing else in the text is changed. Second, the text is cut wherever there is a run of characters that are not a small letter or a digit: a space, a full stop, a comma, a hyphen, a slash, a colon, an underscore. Third, any empty piece left by the cutting is thrown away. What remains, in order, is the token list.

## Two Ekene sentences

| text (stated) | tokens | count |
| --- | --- | --- |
| `Ekene-3 flowed 1.25 MMscf/d; Top WELL at 1548 m TVD.` | ekene 3 flowed 1 25 mmscf d top well at 1548 m tvd | 13 |
| `Average reservoir pressure 2,096 psia on 2023-01-01.` | average reservoir pressure 2 096 psia on 2023 01 01 | 10 |

In the first sentence "Top WELL" becomes top and well, because case is folded. "MMscf/d" becomes mmscf and d, because the slash separates. The full stop at the end leaves an empty piece, which is dropped. In the second, the comma in "2,096" and the hyphens in the date both separate.

## What lowercasing does and does not touch

Only the ASCII capitals A to Z are folded. An accented letter is outside [a-z0-9], so it separates like a space:

| text (stated) | tokens | count |
| --- | --- | --- |
| `Café Überprüfung naïve` | caf berpr fung na ve | 5 |

Oilfield reports in English rarely carry accents, and the rule keeps every step checkable. A passage in another language would need a different tokeniser, and this engine does not offer one.

## No stemming

Nothing is cut back to a root. "producing" and "produced" stay two different tokens, and so do "rate" and "rates". A query for one does not match the other. You will see this again in the TF-IDF module, where "rates" in one hand-set passage earns its own entry in the vocabulary.

## Why a simple rule

A common alternative, scikit-learn's default word pattern, keeps only tokens of two characters or more. This engine keeps single characters, because well numbers such as the 3 in Ekene-3 matter in oilfield text, and because a learner can apply the rule with a pencil. A search engine you use at work may stem words or fold accents. When you compare a figure from such a tool with one from this engine, name the tokeniser first.

## Exercise

In the retrieval explorer choose "Tokens of a text". The box starts with the first Ekene sentence above; confirm the 13 tokens. Then type a sentence from your own work that has a well name, a date and a decimal in it. Before you look at the result, write down the tokens you expect and their count. Compare, and for every difference name the character that caused it.
