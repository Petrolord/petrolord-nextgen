# The Akodo day end to end

{{panel:supply-tank-explorer}}

## From the tanks to the ledger

The last lesson ended on a closing stock of 4499.452 m3 at standard. This lesson carries it through one day and then nine.

## The ledger

| item | value |
| --- | --- |
| opening stock (yesterday's closing dip) m3 | 4953.700 |
| receipts m3 | 2870.000 |
| deliveries m3 | 3312.500 |
| known losses m3 | 3.100 |
| expected closing m3 | 4508.100 |
| dipped closing (standard) m3 | 4499.452 |
| unaccounted m3 | -8.648 |
| tolerance m3 (0.2 percent of throughput) | 12.365 |
| within tolerance | true |
| direction | loss |

The opening stock is an input, and it is yesterday's closing dip. The expected closing is the ledger's figure. The dipped closing is the tank chain's figure. The gap between them, -8.648 m3, is a loss within the course's stated tolerance of 0.2 percent of throughput, which on this day is 12.365 m3.

## Three ways to spoil the day

This lesson measures three ways of closing the same day badly, and each teaches one rule.

**Leave the opening stock out.** The engine refuses: "No opening stock, so the day cannot be closed. The opening stock is yesterday's closing dip." It does not start from zero, which would book yesterday's whole stock as today's gain.

**Take the opening stock from today's dip.** Opening = closing dip less receipts plus deliveries plus known losses gives 4945.052 m3 on this day, and the day reads unaccounted 0.000 m3, balanced. Every closing dip the course tries, from 4380.250 m3 to 4855.500 m3, reads balanced in the same way. Every row balances, so none of them measured anything. That is why the opening stock is an input taken from before the day began.

**Close on the gross.** Close the same day on the gross closing stock, 4581.490 m3, against an opening stock held at standard, and the engine reads unaccounted 73.390 m3, direction gain, within tolerance false. Nothing in the tanks changed: gross observed m3 at three observed temperatures was set against m3 at standard. The rule: both ends of the ledger at standard.

## The band and the still day

The verdict depends on the stated percent. At 0.1 percent the band is 6.183 m3 and the same -8.648 m3 reads outside it; at 0.2 percent it reads within. The percent is fixed before the day is closed. A day with no receipts and no deliveries has no throughput and no band: the course's still day reads unaccounted 0.500 m3, tolerance 0.000 m3, within tolerance false, direction gain.

## Nine days

Across nine days the unaccounted figures sum to -27.200 m3, or -0.0494 percent of cumulative throughput, and the run ending on the latest day is 6 days of loss. The engine prompts: "6 days of loss in a row. One day is noise; a run in one direction is worth investigating: a drifting meter, a passing valve, or a temperature effect not being corrected." The percent is taken on the cumulative throughput, printed as 55085.000 m3. The course trims the history one day at a time: kept to 5 or 6 days, the run is 2 or 3 days of loss and the prompt is none; kept to 7, 8 or 9 days, the run is 4, 5 or 6 days of loss and the prompt is printed.

## Exercise

Read the AKODO day closed on the standard stock and the same day closed on the gross stock: unaccounted -8.648 m3, within tolerance true, direction loss; and unaccounted 73.390 m3, within tolerance false, direction gain. Say what differs between the two closings and which one measures the terminal.

Self check: only the closing stock differs. 4499.452 m3 is at standard, matching the opening stock; 4581.490 m3 is gross observed, a different quantity. The standard closing measures the terminal: a loss within tolerance. The gross closing reports a gain produced by mixing units.
