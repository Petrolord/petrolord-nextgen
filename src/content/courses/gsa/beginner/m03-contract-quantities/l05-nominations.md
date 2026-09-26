# Nominations against the daily quantities

{{panel:gsa-quantity-calculator}}

The DCQ and MaxDCQ are fixed in the contract. What happens on a given day starts with a nomination: the buyer tells the seller, in advance, how much gas it wants delivered that day. The nomination is the bridge between the contract quantities of this module and the daily balance of the next one.

## What a nomination does

A nomination sets the seller's obligation for the day. The seller must make available what the buyer properly nominates, and a gap between the two is a seller shortfall. A nomination also records the buyer's own intention, and the gap between the adjusted DCQ and what the buyer actually takes is a buyer shortfall. The nomination does not change the DCQ; it is a request against it.

## The properly nominated quantity

Only the part of a nomination up to MaxDCQ is properly nominated. The engine's rule: PNQ = min(nominated, MaxDCQ). A nomination at or below MaxDCQ is properly nominated in full. A nomination above it is cut to MaxDCQ, and the seller owes nothing for the excess.

| day (power plant, January 2027) | nominated | properly nominated | what it shows |
| --- | --- | --- | --- |
| 2027-01-02 | 21110.000000 | 21110.000000 | above the DCQ, within MaxDCQ |
| 2027-01-05 | 0.000000 | 0.000000 | a zero nomination |
| 2027-01-25 | 24150.000000 | 23100.000000 | above MaxDCQ, trimmed |

## A zero nomination

A buyer may nominate nothing. That is a lawful nomination, and it leaves the seller owing nothing that day. It leaves the buyer with the whole adjusted DCQ untaken. The engine's reason for 2027-01-05, verbatim:

> 2027-01-05: zero nomination; the whole adjusted DCQ 21000 is a buyer shortfall for the day

So the buyer who nominates zero is exercising its swing downward, and the cost of that choice appears in the year's reconciliation, when its buyer shortfalls are set against its over-takes.

## Taking above the DCQ

On 2027-01-02 the buyer nominated and took 21110.000000, above the DCQ of 21000. The engine counts the excess as over-take: 110.000000 on that day. Over-take is not a debt of either side. Over the month it offsets buyer shortfall, and the next module shows the identity that ties the two together.

## Without a MaxDCQ

If a contract states no MaxDCQ, there is no ceiling, and every nomination is properly nominated. In the golden single day with no MaxDCQ, the buyer nominated, was offered and took 180.000000 against a DCQ of 100.000000, and the engine prints no reason, because nothing is owed either way.

## Nominations and the daily balance

The engine does not model the nomination procedure itself: notice periods, renominations within the day, or the form a nomination takes. It reads a nominated quantity for each day and applies the MaxDCQ rule to it. A contract's procedure decides what counts as the day's nomination; the engine takes the result.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "The daily balance". Run the power plant's January 2027 and read the nominated and properly nominated columns for 2027-01-02, 2027-01-05 and 2027-01-25. Find the reason printed for each of the last two. Then change the `nominated` of 2027-01-02 to 24150 and its `available` and `taken` to 23100, run it, and read what the engine prints for that day.
