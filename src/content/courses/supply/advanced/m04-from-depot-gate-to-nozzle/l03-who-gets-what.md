# Who gets what

The waterfall answers what a litre costs. The same lines, read by recipient, answer a different question: where the money in a litre goes. Every element in the pump template names the party it pays, and `marginWaterfall` groups the build-up by that party, largest first.

{{panel:supply-price-explorer}}

## The BADAGRY litre by recipient

Every margin, levy and tax below is invented for this course, and so is the exchange rate behind the landed cost. The engine groups the BADAGRY build-up like this:

| recipient | naira per litre | share of price | elements |
| --- | --- | --- | --- |
| Product (landed) | 884.6753 | 0.823088 | Landed cost (depot gate) |
| Government | 75.1996 | 0.069965 | Statutory levies at the pump; Value added tax |
| Dealer | 31.2500 | 0.029075 | Dealer margin |
| Chain | 24.5000 | 0.022794 | Bridging or equalisation |
| Terminal | 21.0000 | 0.019538 | Depot and terminal margin |
| Transporter | 19.8000 | 0.018422 | Transport to station |
| Marketer | 18.4000 | 0.017119 | Marketer margin |

and it closes on the same price the waterfall reached, 1074.8249 naira a litre.

## Reading the grouping

Each recipient's row is the sum of its elements. Every recipient except Government has one element, so its row repeats the waterfall's line. The dealer's 31.2500 naira a litre is the invented dealer margin. The terminal's 21.0000 is the invented depot and terminal margin.

Government is the recipient with two elements: the invented statutory levies and the invented value added tax. Its row is 75.1996 naira a litre, with a share of price of 0.069965. The next lesson reads that row on its own.

The first row is the product itself. The landed cost at the depot gate is grouped as Product (landed), 884.6753 naira a litre and a share of 0.823088. It is money paid for the cargo and every charge on the way to the gate, which the previous two modules built.

## What the grouping needs

The grouping reads each element's recipient field. The course removes the recipient from the bridging element to show what happens to an element that has none: it is grouped as Unattributed, 24.5000 naira a litre. The engine does not guess that bridging belongs to the chain. It keeps the money visible and names it as unattributed, so the gap in the labelling is on the page.

The grouping also needs a build-up to group. Hand `marginWaterfall` a build-up that the engine refused and it refuses too:

> REFUSED: A landed cost per litre is required.

A build-up the engine refused has no price, and a share of a price that does not exist is a share of nothing.

## Why this view matters

A pump price is argued about in public by parties who each see their own line. A dealer sees the dealer margin, a regulator the levies, a transporter the transport element. The grouping puts them all on one page in one unit, naira a litre, with their shares of one price. Any disagreement about who takes what has to be an argument about a rate on a row, because the rows reconcile to the price.

The engine only groups what it was given. Every recipient name except Product (landed) comes from the template, and every rate from this course's invented record.

## Exercise

Record the naira per litre and the share of price for Product (landed), Government and Dealer, and the pump price. Then record what the bridging element is grouped as when its recipient is removed. Say what the Unattributed row shows about how the grouping treats an element whose recipient is missing.
