# Paid on the bill of lading

Two quantities describe one cargo at the end of a voyage. The bill of lading states what was loaded, and the importer pays for it. The outturn is what is measured ashore, and the importer sells that. The two differ by the ocean loss. This module is about keeping them apart, because a cost is incurred on one and recovered on the other.

{{panel:supply-price-explorer}}

## The rule

The engine states it in one line: outturn = bill-of-lading x (1 - ocean loss / 100). The ocean loss is a percentage of the bill-of-lading quantity, and it is an input. The engine does not estimate it from the voyage, the product or the weather. On a real cargo it is what the shore tanks measure against the bill of lading, and the Associate tier of this course showed how those shore tanks are measured.

BADAGRY's ocean loss is 0.45 percent. Like every figure on the BADAGRY record, it is invented for this course.

## The two quantities on BADAGRY

The first module put the cargo in every unit. Its bill-of-lading quantity is 34000 tonnes at 742.8 kg/m3, which the engine reports as 45772.752 m3 and 45772751.75 litres.

With the ocean loss at 0.45 percent, the engine reports an outturn of 45566774.37 litres. In cubic metres, the outturn is 45566.774 m3 against the 45772.752 m3 on the bill of lading.

Both figures are real to somebody. The supplier's invoice is on the first. The terminal's receipt, the stock ledger and every litre later sold at a pump come out of the second.

## Which lines read which quantity

The landed cost walk of the last module levies its charges on the bill-of-lading quantity. The cargo value is FOB on the bill-of-lading tonnes. The freight and port lines are per tonne on the same 34000 tonnes. The regulatory line is per litre on 45772751.75 litres. The jetty and storage lines are per m3 on 45772.752 m3. No dollar amount in the walk reads the outturn, because the walk describes what is paid.

The outturn enters when the question turns from what the cargo cost to what a litre of it costs. The walk's last column, USD per outturn litre, is that question, and it is the next lesson.

## A loss is not a line

It is tempting to treat the ocean loss as one more line in the build-up, a charge in dollars added to the landed total. The engine does not do that, for a reason this whole tier leans on: a loss added as a charge understates the cost of a litre sold. The loss is not money paid to anyone. It is litres paid for and never received, so it changes the number of litres the money is spread over. The landed total stays the same.

The ocean loss is also an input of its own and has no row in `IMPORT_TEMPLATE`. The template's 9 lines are charges, each paid to someone on a base. The loss is paid to no one and has no base of its own.

## Exercise

Record the bill-of-lading quantity of the BADAGRY cargo in litres and in m3, the invented ocean loss, and the outturn in litres and in m3 as the engine reports them. Then say what the two m3 figures show about which quantity the landed cost walk levies its per-m3 charges on, and which quantity the importer has to sell.
