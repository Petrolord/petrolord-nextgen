# Paid on the bill of lading

Two quantities describe one cargo at the end of a voyage. In the course's words, the importer pays for the bill-of-lading quantity and sells the outturn. The two differ by the ocean loss. This module is about keeping them apart, because a cost is incurred on one and recovered on the other.

{{panel:supply-price-explorer}}

## The rule

The course states it in one line: outturn = bill-of-lading x (1 - ocean loss / 100). The ocean loss is a percentage of the bill-of-lading quantity, and it is an input the caller supplies.

BADAGRY's ocean loss is 0.45 percent. Like every figure on the BADAGRY record, it is invented for this course.

## The two quantities on BADAGRY

The first module put the cargo in every unit. Its bill-of-lading quantity is 34000 tonnes at 742.8 kg/m3, which the engine reports as 45772.752 m3 and 45772751.75 litres.

With the ocean loss at 0.45 percent, the engine reports an outturn of 45566774.37 litres. In cubic metres, the outturn is 45566.774 m3 against the 45772.752 m3 on the bill of lading.

Both figures are real to somebody. The supplier's invoice is on the first. The terminal's receipt, the stock ledger and every litre later sold at a pump come out of the second.

## Which lines read which quantity

The landed cost walk of the last module levies its charges on the bill-of-lading quantity. The cargo value is FOB on the bill-of-lading tonnes. The freight and port lines are per tonne on the same 34000 tonnes. The regulatory line is per litre on 45772751.75 litres. The jetty and storage lines are per m3 on 45772.752 m3. No dollar amount in the walk reads the outturn, because the walk describes what is paid.

The outturn enters when the question turns from what the cargo cost to what a litre of it costs. The walk's last column, USD per outturn litre, is that question, and it is the next lesson.

## A loss is not a line

It is tempting to treat the ocean loss as one more line in the build-up, a charge in dollars added to the landed total. The engine does not do that. In the course's words, the loss divides the cost: the landed total stays the same and the litres it is spread over fall. The next lesson reads that division.

The ocean loss is also an input of its own and has no row in `IMPORT_TEMPLATE`, whose 9 lines are charges, each with a basis and a stage. It still counts toward a complete build-up. Left blank, it is a missing rate: the walk reads complete false, missing Ocean loss, and labels its total "A FLOOR: 1 rate(s) not supplied, so the full landed cost is at least this." That blank row spreads the landed total over all 45772751.75 bill-of-lading litres, 0.579252 USD a litre sold. Left out of the call entirely, the loss takes the 0 the signature states and reads complete true. A loss of 100 percent or more is refused, and so is one below 0:

> REFUSED: The ocean loss must be at least 0 and under 100 percent.

## Exercise

Record the bill-of-lading quantity of the BADAGRY cargo in litres and in m3, the invented ocean loss, and the outturn in litres and in m3 as the engine reports them. Then say what the two m3 figures show about which quantity the landed cost walk levies its per-m3 charges on, and which quantity the importer has to sell.
