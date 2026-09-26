# The cover reading

{{panel:joa-agreement-calculator}}

The third reading concerns who covers a defaulting party's unpaid cash call. The Norwegian text says the non-defaulting parties advance it by their participating interests. Under a live carry that wording can be read two ways, and the engine states the way it takes.

## The text

The Norwegian Joint Operating Agreement (Attachment A, unofficial English translation, PDF dated 27 February 2007, cited from the Wayback Machine capture of 26 May 2024, read on 2026-09-26) says:

> "the amounts which are not paid shall be advanced by the non-defaulting Parties in accordance with their Participating interest." (Norway JOA Art. 9.1)

Outside a carry a party's paying interest equals its participating interest, and the sentence has one meaning. Under a carry the two differ, and the carried party pays no cost at all.

## The reading, in the engine's words

> the non-defaulting parties advance the unpaid amounts in proportion to their paying interests among themselves (the parties that pay cost; a carried party pays none)

The engine covers by paying interest because cover is cost, and the paying interest is each party's share of cost. A reading by participating interest would bring the carried NOC into the cover, asking a party that pays no cost to advance cash for another.

## Where the reading acts

On the Ekene March default PB leaves 2000000.000000 of its share unpaid while NOC is carried in full. The paying interests of the non-defaulting parties are EKO 50.000000 and PA 31.250000, and the engine covers in proportion to them:

| party | paying interest | cover percent | cover |
| --- | --- | --- | --- |
| EKO | 50.000000 | 61.538462 | 1230769.230769 |
| PA | 31.250000 | 38.461538 | 769230.769231 |

NOC, carried, pays no cost and covers none (engine). The engine's reason:

> the unpaid 2000000 is advanced by EKO 1230769.23, PA 769230.77, in proportion to their paying interests among the non-defaulting parties

Where no carry is stated the two readings agree. On a golden case with parties A 50, B 30 and C 20 percent and no carry, C defaults on 200000.000000 and the cover is A 125000.000000 (62.500000 percent) and B 75000.000000 (37.500000 percent), which is both their paying and their participating shares among themselves.

## Two things that are no reading

The forfeiture that may follow a default is apportioned differently, and that is no reading: the Norwegian Art. 9.4 apportions an assigned interest by participating interest, and the engine reports the interests after a forfeiture on that basis (EKO 47.058824, PA 29.411765, NOC 23.529412 on the Ekene default left open). The default interest the defaulter pays is distributed to the parties financing the default in proportion to their cover.

No graded figure depends on the cover reading: every capstone field is the same number under the engine's reading and under the alternative it names.

## Exercise

Open the agreement calculator on the view "A default and forfeiture", which starts on the Ekene March default. Read the cover table and check that the cover percents follow the paying interests. Then delete the `carries` entry from the box, so that NOC is not carried, and read the cover table again: note which parties now cover PB and in what shares. Put the carry back. Finally open the view "The three stated readings" and read reading three with the table beneath it.
