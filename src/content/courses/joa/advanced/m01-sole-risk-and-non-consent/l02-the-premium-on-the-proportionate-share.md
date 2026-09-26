# The premium on the proportionate share

{{panel:joa-agreement-calculator}}

A party that declines an operation keeps its participating interest in the licence. What it gives up is its share of the operation's production until the consenting parties have taken back a premium. The premium is a contract figure, and the first thing to settle is what it multiplies.

## The base is the proportionate share

The engine takes the premium on the non-consenting party's proportionate share of the cost: the cost of the operation times its participating interest. The engine's basis states the multiple on the Ekene sidetrack:

> 400% of the non-consenting party's proportionate share of the cost (a stated contract figure with no default; 100% is the cost alone)

On the Ekene-4 sidetrack PB's participating interest is 15.000000 percent, so its proportionate share of the cost is 2700000.000000 (the cost 18000000.000000 times 15.000000 percent). At the stated 400.000000 percent the premium is 10800000.000000 (engine).

| party | participating interest | proportionate share of the cost | multiple | premium |
| --- | --- | --- | --- | --- |
| PB (Ekene-4 sidetrack) | 15.000000 | 2700000.000000 | 400.000000 | 10800000.000000 |
| C (a well costing 1000.000000, consenting A and B) | 20.000000 | 200.000000 | 300.000000 | 600.000000 |
| B (a well costing 1000.000000, consenting A alone) | 30.000000 | 300.000000 | 100.000000 | 300.000000 |

The base belongs to the declining party alone. The consenting parties pay the whole cost between them in proportion to their participating interests among themselves, and those shares of the project (EKO 47.058824, PA 29.411765, NOC 23.529412) settle how the consenting parties carry the cost. They never enter the premium itself.

## The multiple is stated, with no default

No public text this course reads prints a premium multiple for recovery from production. The Norwegian agreement prints a multiple for a later entry, which the next module reads. The engine therefore holds no multiple of its own. A call without one is refused:

> premiumMultiplePct must be a number at or above 100 (a stated contract figure; 100 recovers the cost alone); got nothing

A multiple below 100 would hand back less than the cost the consenting parties carried for the declining party, and the engine refuses it by name:

> premiumMultiplePct must be a number at or above 100 (a stated contract figure; 100 recovers the cost alone); got 50

A multiple of exactly 100 is accepted. It returns the proportionate share and nothing on top, which is why the third row above reads 300.000000 twice.

## Why the multiple is large

The consenting parties took a risk the declining party refused: a dry sidetrack costs them the whole sum and costs the declining party nothing. The multiple prices that risk. Whether a contract states a small or a large figure is a negotiation, and the course takes whatever figure the contract states. A report quotes the premium with its multiple, every time, because the same base at another multiple is another premium.

## Exercise

Open the agreement calculator on the view "Sole risk: the premium recovered from production", which starts on the Ekene-4 sidetrack. Read PB's proportionate share of the cost and its premium in the second table. Use the control "Premium multiple, percent (stated)" to state 100, then 300, then 1000, and after each change read PB's premium and write it down with the multiple beside it. Check each premium against the proportionate share times the multiple. Finally state 50 and read the refusal, then set the control to "not stated" and read the refusal again.
