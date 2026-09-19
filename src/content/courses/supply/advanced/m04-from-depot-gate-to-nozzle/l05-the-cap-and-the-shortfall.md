# The cap and the shortfall

Where a pump price is capped, the question a build-up answers changes. The price is no longer an output someone sets from the chain's cost. It is a fixed figure, and the question is whether it covers the chain. `buildPumpPrice` answers that with a shortfall and a verdict, and it keeps the sign convention strict so the verdict cannot be misread.

{{panel:supply-price-explorer}}

## The shortfall and its sign

The shortfall is the chain's price less the cap. A positive shortfall means the cap is below the chain's cost. A negative one means the cap sits above it. Alongside the figure, the engine prints the verdict: the cap covers the chain, true or false.

Both caps below are invented for this course, like every rate in the BADAGRY build-up. Neither is a regulated price in any market.

| cap naira/L (invented) | pump price naira/L | shortfall naira/L | the cap covers the chain |
| --- | --- | --- | --- |
| 1150.0000 | 1074.8249 | -75.1751 | true |
| 1040.0000 | 1074.8249 | 34.8249 | false |

Against a cap of 1150.0000 naira a litre, the shortfall is -75.1751 and the cap covers the chain. Against a cap of 1040.0000 naira a litre, the shortfall is 34.8249 and it does not.

## Reading the second cap

A cap that does not cover the chain means some line in the chain is not being paid in full at that price. The engine does not say which. It prints the shortfall in naira a litre, one figure, and leaves the question of who absorbs it to the reader. Who absorbs a shortfall is settled outside the chain, and nothing that settles it is an input to this engine.

What the engine does is make the gap exact and give it a sign. A shortfall of 34.8249 naira a litre is a specific figure, and every row of the waterfall is still on the page beside it, so an argument about closing it can point at particular rows.

## A floor against a cap

The course prices the BADAGRY build-up with the dealer margin and the levies left blank. The engine reports complete false, names both missing elements, prints a price of 1031.3197 naira a litre, and labels it: "A FLOOR, not a price: 2 rate(s) not supplied."

Set that price beside the invented cap of 1040.0000 naira a litre. A reader who ignored the label could reach a verdict from those two figures alone. The complete build-up, with every invented rate supplied, prints 1074.8249 and a shortfall of 34.8249 against the same cap, with the verdict false. The floor is a figure the full price cannot be below. It can never show that a cap covers a chain, because the missing rates have not been added yet.

So a cap verdict is worth reading only on a build-up the engine reports as complete. On a floor, the engine's label is the answer, and it says the price is not formed.

## The cap as the next module's target

A cap is a fixed figure and the chain's price moves with its inputs. The next module takes the one input that multiplies every dollar in the chain, the exchange rate, sweeps it, and finds where the price meets the invented cap of 1150.0000 naira a litre.

## Exercise

Record the pump price, the shortfall and the verdict against each invented cap. Then record the price and the label the engine prints with the dealer margin and levies blank. Say what that price, read against the invented cap of 1040.0000 naira a litre and against the complete build-up's shortfall at the same cap, shows about checking a cap on an incomplete build-up.
