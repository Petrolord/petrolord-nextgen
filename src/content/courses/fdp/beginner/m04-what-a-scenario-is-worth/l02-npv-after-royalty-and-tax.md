# NPV after royalty and tax

The Base scenario is worth 2015.4123 million USD, and that figure is what is left of 16095.0492 million USD of gross revenue after the state, the drill bit, the vessel and the discount rate have each taken their part.

{{panel:ec-plan-explorer}}

## Where the revenue goes

| item | million USD |
| --- | --- |
| gross revenue | 16095.0492 |
| royalty | 2011.8812 |
| tax | 3276.9239 |
| capex | 2250.0000 |
| operating cost | 3049.6464 |
| government take | 5288.8051 |
| NPV | 2015.4123 |

Royalty of 2011.8812 and tax of 3276.9239 are the government take of 5288.8051, which is 0.328598 of gross revenue. Tax is lower than it would otherwise be, because the plan's end-of-life cost of 260.0000 million USD is deductible in production year 20. The default terms behind those two lines are a royalty of 12.5000 percent and a tax of 30.0000 percent, and the engine applies them year by year rather than to the life total. The capex of 2250.0000 is the concept's own money, read from the three capex fields the concept carries and not from a separate economics box.

## The arithmetic in one year

Year 1 of the Base case earns 1533.0000 of gross revenue. Royalty is 12.5000 percent of that, which is 191.6250. Operating cost is 204.5000, made of the concept's fixed 95.0000 a year plus a variable 5.0000 USD on every barrel produced. Tax of 341.0625 is charged on what remains, and the year closes with a net cash flow of 795.8125. Year 4 produces fewer barrels, so its operating cost falls to 193.5500 while the fixed part of it does not move at all.

## Discounted mid year

The 2015.4123 is a present value at a discount rate of 10.0000 percent, taken mid year rather than at each year end, which treats the cash as arriving through the year instead of on its last day. The undiscounted cash the case describes is far larger, and the gap is the discount rate at work on money that arrives late. Capex is the exception, spent before any of it, which is why the same concept at 18.0000 USD a barrel lands at -1834.1220 rather than at a small positive figure.

## The mistake

Reading the NPV as cash in a bank account. Nothing in a plan ever pays out 2015.4123 million USD: the number is a comparison against earning 10.0000 percent somewhere else. The second mistake is treating government take as tax alone. Tax here is 3276.9239 and royalty is 2011.8812, and a reader who quotes only the first understates what the state receives by the second.

## What it refuses

This is a screening tier, post royalty and tax on stated default terms, at one price and one shape. It is not a sanction case. Full fiscal detail under the PIA and the Nigeria Tax Act belongs to Petroleum Economics Studio, and the number to carry forward from here is a screen that says which concepts deserve that work, not a figure to put in front of a board. The engine also refuses to invent the inputs it needs: a concept with no operating cost is stopped with FdpInputError: "the concept annual operating cost is missing".

## Exercise

Write out the gross revenue, royalty, tax, capex and operating cost of the Base case, and state the government take and its share of gross revenue. Then take year 1 on its own and show that its royalty of 191.6250 is the stated royalty rate applied to its gross revenue of 1533.0000.
