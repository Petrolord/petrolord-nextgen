# A deck and the step hold

A price deck is a short list of years and prices. Between entries the last price holds; after the last entry the escalator takes over; before the first, the first price applies.

{{panel:ec-ledger-explorer}}

## Step, hold, escalate

The deck_step_hold case sets price_deck to 100 in 2030 and 50 in 2032, with oil_price_escalator_pct=10 and a flat oil_price_usd_bbl=100 underneath.

| year | applied_oil_price | gross_revenue |
| --- | --- | --- |
| 2030 | 100.000000 | 100000000.00 |
| 2031 | 100.000000 | 100000000.00 |
| 2032 | 50.000000 | 50000000.00 |
| 2033 | 55.000000 | 55000000.00 |

2030 is the first entry. 2031 has no entry, so the 2030 price holds: not escalated, not interpolated toward 50, held. 2032 steps to the entry. 2033 is past the last entry, so the escalator finally runs, on the last deck price: 50 escalated by 10 percent is 55.000000. Total revenue over the four rows is 305000000.00.

The resolver shows the tail more fully. Fed that deck, it returns 100.000000 for 2028 through 2031, 50.000000 for 2032, then 55.000000, 60.500000 and 66.550000 for 2033, 2034 and 2035. And the flat price it was given, 80, appears nowhere: a deck replaces the flat price for every year, including years the deck does not name.

## Before the first entry

Years before the first deck year take the first deck value. deck_before_first_entry sets entries for 2031 and 2032 only, with the 2031 price written as the string "90" under the long key oil_price_usd_bbl rather than oil. The ledger reads 90.000000 in 2030, 90.000000 in 2031 and 70.000000 in 2032, and the engine accepted both the string and the long key. Its flat oil_price_usd_bbl=100 is never applied. With the escalator at 0 in that case there is no tail to escalate, and 70.000000 would hold for every later year the ledger had rows for.

## What the deck refuses

It refuses to interpolate. A deck with 100 in 2030 and 50 in 2032 does not pass through a price between them in 2031; it holds 100. It refuses to escalate inside its range: the 10 percent escalator that produced 55.000000 in 2033 did nothing to 2031. And it refuses to let the flat price back in, before the first entry or after the last. Once a deck exists the flat price is dead, and the resolver run that was handed flat 80 with the deck returned no 80 anywhere.

## The mistake

The careful mistake is a deck entered as a forecast. A reader who has a view that oil falls from 100 to 50 over two years types those two points and gets a ledger that holds 100 for a full year, then drops, which is a different forecast with different revenue in 2031. The fix is one entry per year the price is meant to move. The second mistake is the tail: a deck that ends in 2032 does not hold 50 forever; with the escalator at 10 it climbs to 66.550000 by 2035, and a reader who set that escalator for the flat price and forgot it has a rising tail nobody chose.

## Exercise

Load deck_step_hold in the explorer and read the four applied prices. Then say what 2031 and 2033 would read if the escalator were set to 0, and which of the two changes.
