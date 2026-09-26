# The properly nominated quantity

{{panel:gsa-quantity-calculator}}

The daily balance is where a gas sales agreement meets real days. Each day has a nomination, a quantity the seller made available and a quantity the buyer took, and the balance decides what each side owes for the gap. Everything starts from one quantity: what the buyer properly nominated.

## The rule

The engine's rule: PNQ = min(nominated, MaxDCQ). The properly nominated quantity is the smaller of the day's nomination and the contract's MaxDCQ. Above MaxDCQ, a nomination is a request the seller may meet or decline without owing anything. At or below it, the nomination is the seller's obligation for the day.

## The daily balance, column by column

The panel's daily table prints eleven columns for each day, every one an engine return value. This lesson reads the columns that describe the day itself; the next three lessons read the columns the engine computes from them.

| column | what it holds |
| --- | --- |
| nominated | what the buyer asked for |
| properly nominated | the nomination, capped at MaxDCQ |
| available | what the seller made available |
| taken | what the buyer took, at most what was available |
| force majeure, maintenance | quantities stated for the day that excuse a gap |

## One trimmed day

On 2027-01-25 the power plant's buyer nominated 24150.000000 against a MaxDCQ of 23100.000000. The seller made 23100.000000 available and the buyer took all of it. The properly nominated quantity is 23100.000000, so the seller met its obligation in full and there is no seller shortfall. The buyer took 2100.000000 above the DCQ, which the engine counts as over-take.

## A failed over-nomination

The golden case of a failed over-nomination shows the other side. The buyer nominated 150.000000 against a MaxDCQ of 120 percent of a DCQ of 100.000000, and the seller made nothing available. The properly nominated quantity is 120.000000, and that is the seller shortfall: the 30 above MaxDCQ carries no obligation. The engine's reasons, verbatim:

> 2027-03-01: nominated 150 is above the MaxDCQ 120; 30 is not properly nominated

> 2027-03-01: the seller made 0 available against a properly nominated 120: seller shortfall 120

## Taken cannot exceed available

The buyer can only take gas that was there. A day recorded with more taken than made available is a data error, and the engine refuses it before computing anything:

> days[0].taken must be at or below the quantity made available 50; got 60

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "The daily balance". Run the power plant's January 2027 and read the first five columns for 2027-01-25. Then replace the box with one day: a `dcq` of 100, `maxDcqPct` 120, and a day dated "2027-03-01" with `nominated` 150, `available` 0 and `taken` 0. Run it and read the properly nominated quantity, the seller shortfall and both reasons.
