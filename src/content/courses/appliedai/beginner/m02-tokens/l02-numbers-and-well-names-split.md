# Numbers and well names split apart

{{panel:ae-retrieval-explorer}}

The tokenising rule cuts on every character outside [a-z0-9]. In ordinary prose that means spaces and punctuation. In oilfield text it also means the decimal points, thousands commas, hyphens and slashes inside numbers, dates, well names and units. This lesson follows what happens to each, because every one of them changes what a query can match.

## Decimals and thousands

A decimal point separates, so "1.25" becomes the two tokens 1 and 25. A thousands comma separates too, so "2,096" becomes 2 and 096. The leading zero stays, since nothing but case is changed. After tokenising, the engine no longer sees a number at all; it sees short strings of digits.

| text (stated) | tokens | count |
| --- | --- | --- |
| `Ekene-3 flowed 1.25 MMscf/d; Top WELL at 1548 m TVD.` | ekene 3 flowed 1 25 mmscf d top well at 1548 m tvd | 13 |
| `Average reservoir pressure 2,096 psia on 2023-01-01.` | average reservoir pressure 2 096 psia on 2023 01 01 | 10 |

The consequence for retrieval is direct. A query for "2096" matches no token in "2,096 psia", and a query for "2,096" is itself split into 2 and 096. Write a figure the way the passages write it.

## Dates

An ISO date such as 2023-01-01 becomes three tokens, 2023, 01 and 01. The 01 appears twice, and a repeated token counts twice in a passage. Two passages from the same month share the year and month tokens whatever their subject.

## Well names and codes

"Ekene-3" becomes ekene and 3. The well number is a token of its own, and single-character tokens are kept, so the 3 can match a query. It can also match any other 3 in a passage. On Q02, "initial oil rate of Ekene-3", the token 3 appears in 19 passages of the corpus.

| text (stated) | tokens | count |
| --- | --- | --- |
| `Core plug EK1-P: permeability 420 md.` | core plug ek1 p permeability 420 md | 7 |
| `Bit graded 2-3-WT at 1760 m MD.` | bit graded 2 3 wt at 1760 m md | 9 |
| `Monthly H2S drill: 0 ppm H2S.` | monthly h2s drill 0 ppm h2s | 6 |

Letters and digits that sit together stay together: EK1 is one token and H2S is one token, h2s. The hyphen splits EK1-P into ek1 and p. A bit grade written 2-3-WT becomes 2, 3 and wt, so the grade reads as two bare digits.

## Units

A unit written with a slash splits: "MMscf/d" gives mmscf and d, and a unit such as bbl/d/psi would give three tokens. A unit glued to its figure stays glued, since letters and digits together are one token. Units are matched as words like any other.

## Where this matters later

This rule is about retrieval. The answers module checks claims with its own reading of numbers, in which "2,096" is the single value 2096 and "Ekene-1" is an identifier that makes no claim. The two readings serve two jobs and are stated separately.

## Exercise

In the retrieval explorer choose "Tokens of a text" and type `Ekene-4 injectivity fell from 0.5 to 0.35 bbl/d/psi on 2024-03-01.` Before you read the result, write down the tokens and the count you expect. Then choose "BM25, read term by term", keep the hand set, and type the query "2096". Read the note that comes back, then try the query "2,096 psia" and see which passage ranks and on which tokens.
