# Opening plus receipts less deliveries

{{panel:supply-tank-explorer}}

## A day as a ledger

A terminal closes its books on a stock every day. The logic is a ledger. Start with what the tanks held at the start of the day. Add what came in. Take off what went out and what is already known to be lost. What is left is what the tanks should hold at the end of the day. Then dip the tanks and see what they do hold.

reconcileStock writes it as three lines:

expected closing = opening + receipts - deliveries - known losses

unaccounted = dipped closing - expected closing

tolerance = a stated percent of throughput, and throughput = receipts + deliveries

The expected closing is what the paperwork says. The dipped closing is what the tape says. The unaccounted figure is the gap between them, and it is the point of the day.

## The AKODO day

| item | value |
| --- | --- |
| opening stock (yesterday's closing dip) m3 | 4953.700 |
| receipts m3 | 2870.000 |
| deliveries m3 | 3312.500 |
| known losses m3 | 3.100 |
| expected closing m3 | 4508.100 |
| dipped closing (standard) m3 | 4499.452 |
| unaccounted m3 | -8.648 |
| unaccounted percent of throughput | -0.1399 |
| tolerance m3 (0.2 percent of throughput) | 12.365 |
| within tolerance | true |
| direction | loss |

Walk it top to bottom. The day opened on 4953.700 m3, which is yesterday's closing dip. 2870.000 m3 was received, 3312.500 m3 was delivered, and 3.100 m3 of known losses was booked. The ledger says the tanks should close on 4508.100 m3.

The tanks were dipped. The closing stock is the standard total built across modules two to four, 4499.452 m3. The dipped closing less the expected closing is -8.648 m3. The sign is the direction: a negative unaccounted figure is a loss, product the ledger expected and the tanks do not hold. The engine reports it as direction loss.

## Every figure at standard

Each figure in the ledger is in m3, and the closing stock is at standard. The opening stock is yesterday's closing dip, also at standard. A ledger only balances fairly when both ends are the same quantity, and module six reads what the digest measures when the closing end is left gross observed.

## What the gap is judged against

A gap of zero would be remarkable. Tapes are read by people, thermometers have a resolution, tables are interpolated, and meters on the receipts and deliveries have their own uncertainty. So the day is judged against a tolerance, stated as a percent of throughput. AKODO's stated tolerance is 0.2 percent, a figure chosen for this course. On this day it comes to 12.365 m3, and the unaccounted figure of -8.648 m3 is within tolerance: true.

Lesson four reads the tolerance in detail. For now, the day closes as a loss within tolerance.

In the panel, set the day's four inputs to the AKODO figures, read the unaccounted figure, then change the receipts and watch the expected closing and the gap move.

## Exercise

Read the AKODO day's expected closing, 4508.100 m3, and its dipped closing, 4499.452 m3. Say which one the ledger produced and which one the tanks produced, what the unaccounted figure is, and what its sign tells you.

Self check: the ledger produced the expected closing from the opening stock, receipts, deliveries and known losses; the tanks produced the dipped closing through the whole tank chain. The unaccounted figure is -8.648 m3, and its negative sign is a loss.
