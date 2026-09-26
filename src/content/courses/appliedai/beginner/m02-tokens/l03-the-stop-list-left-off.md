# The stop list, and why it is left off

{{panel:ae-retrieval-explorer}}

Many search tools throw away very common words before they count anything. The list of words thrown away is called a stop list. The engine carries one, scikit-learn's ENGLISH_STOP_WORDS (318 words, BSD-3-Clause), and it leaves it off by default.

## What the list is for

Words such as the, of and at appear almost everywhere, so they say little about which passage fits a query. With the list on, the Ekene vocabulary falls to 505 tokens (against 574) and the mean passage length to 27.483333 (against 38.316667).

## What the list removes that matters here

The list was written for general English. In oilfield text some of its words carry meaning. Every one of these was checked to be on it: well, top, bottom, fire, system, first, third, one, two, three, twelve, fifteen, fifty, hundred, thick, thin, per, full, empty, found, back, part, side, move, amount, mill, bill, interest, no, not.

A geologist's query "the well top" loses every token with the list on, and BM25 returns an empty ranking with this note:

> the query has no token after the stop list, so no document is ranked

Q14 shows a subtler loss. "Is Ekene-5 producing water?" keeps the query terms is, ekene, 5, producing, water with the list off, and ekene, 5, producing, water with it on. The word that answers the question in the passages, "no", is itself a stop word, so with the list on no passage could ever match it.

## Three sentences, with the list on

| text (stated) | tokens with the list on | removed |
| --- | --- | --- |
| `Ekene-3 flowed 1.25 MMscf/d; Top WELL at 1548 m TVD.` | ekene 3 flowed 1 25 mmscf d 1548 m tvd | 3 |
| `Bit graded 2-3-WT at 1760 m MD.` | bit graded 2 3 wt 1760 m md | 1 |
| `oil_rate and water/cut` | oil rate water cut | 1 |

In the first row the list takes top, well and at, two of them words a reader would search for.

## The switch, and its refusal

The stop list is a switch that takes true or false. Anything else is refused, naming `stopWords`:

> stopWords must be true or false

The panel offers the switch as a two-way choice, so you will meet this refusal only when you call the engine directly. When the list is on, it applies everywhere at once: to the passages, to the query and to every length BM25 uses. A corpus left with no token at all after the list is refused for BM25:

> documents has no token in any text after the stop list: BM25 needs an average document length above 0

## Why off by default

The engine's stated reason is short: the list removes well, top, bottom, fire and system. On oilfield text this list does harm. Switching it on is a choice you can make, and a choice you then report. The course states the setting beside every figure: system A and system B both ran with the stop list off.

## Exercise

In the retrieval explorer choose "Tokens of a text". Type `Top of the Ekene Sand found at 1548 m; no water, one fire drill.` and read the tokens with the stop list off, then on. List every word removed and mark those that carry oilfield meaning. Then choose "BM25, read term by term", keep the hand set, set the stop list on and type the query "the well top". Read the note. Finally set the stop list off, type "oil rate", switch the list on and off again, and see whether d1's score moves.
