# The exchange rate

The BADAGRY cargo is bought in US dollars and sold in naira. Somewhere in the chain the currency changes, and where it changes is a design decision with consequences. The engine converts once, at the end of the landed cost, on the cost of a litre sold.

{{panel:supply-price-explorer}}

## Once, at the end

The rule is naira per litre sold = USD per litre sold x 1520.4000. That rate, 1520.4000 naira to the dollar, is invented for this course like every other rate on the BADAGRY record, and it describes no market on any date.

Everything before that line is in dollars. FOB, freight, insurance, CIF, the course's invented import duty and every other landed line are dollar amounts. The landed total is 26513943.86 USD, and over the outturn it is 0.581870 USD a litre sold. Only then does the exchange rate enter, and the engine reports 884.6753 naira a litre sold.

Converting once keeps the exchange rate as a single, visible input. A build-up that converted line by line would carry the rate into every line. A reader checking the figure would have to confirm the same rate had been used in every one. Here there is one multiplication and one rate to check.

## The precision changes with the currency

The dollar figure prints to six decimals, 0.581870 USD a litre. The naira figure prints to four, 884.6753. When you quote either, quote it at the precision it prints. The naira figure is the one the pump price is built on in the next module, and that build-up starts from 884.6753 naira a litre exactly.

## With no exchange rate

Leave the exchange rate out and the engine does not assume one: with no exchange rate the local figure is none. The rule is about the local figure. The dollar cost of a litre sold needs no exchange rate. The naira figure needs exactly one, and without it the naira figure is none.

That is the same rule the tier has applied to the density and to every rate. A missing input leaves a missing output. It is never replaced by a guess, and an old rate carried over from another record is a guess.

## The rate as a driver

The exchange rate multiplies every dollar in the build-up, so it is the natural input to sweep when the question is what breaks a price. The fifth module of this tier does that: it re-prices the whole chain from the cargo to the nozzle at each value of the exchange rate and finds the rate at which a price cap stops covering the chain. That sweep starts from the rule in this lesson. Every dollar figure in the walk is unchanged by the rate, and only the conversion at the end moves.

## Exercise

Record the landed total in US dollars, the USD per litre sold at the BADAGRY ocean loss, the invented exchange rate and the naira per litre sold as the engine prints them. Then say what those four figures, read in order, show about where the exchange rate enters the landed cost and what the engine reports for the naira figure when the rate is missing.
