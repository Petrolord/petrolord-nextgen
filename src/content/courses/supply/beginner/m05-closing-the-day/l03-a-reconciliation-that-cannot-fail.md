# A reconciliation that cannot fail

{{panel:supply-tank-explorer}}

## A shortcut with a clean result

The last lesson said the opening stock is yesterday's closing dip. Suppose yesterday's dip is not to hand. Today's closing dip is known, and so are today's receipts, deliveries and known losses. Work the ledger backwards and take the opening stock as:

opening = closing dip - receipts + deliveries + known losses

Hand that to reconcileStock and the result is spotless.

## The demonstration

The AKODO day's receipts, deliveries and known losses are held fixed. The closing dip is set to four different values, and each time the opening stock is taken from it by the line above:

| closing dip m3 | opening taken from it m3 | expected closing m3 | unaccounted m3 | within tolerance | direction |
| --- | --- | --- | --- | --- | --- |
| 4499.452 | 4945.052 | 4499.452 | 0.000 | true | balanced |
| 4380.250 | 4825.850 | 4380.250 | 0.000 | true | balanced |
| 4600.000 | 5045.600 | 4600.000 | 0.000 | true | balanced |
| 4855.500 | 5301.100 | 4855.500 | 0.000 | true | balanced |

Every row balances, so none of them measured anything.

## Why it cannot fail

Put the derived opening stock into the ledger. The expected closing is opening plus receipts less deliveries less known losses. The opening already had the receipts taken off and the deliveries and losses put back, so the ledger undoes exactly what the derivation did and lands on the dip. The expected closing is the dip itself, whatever the dip reads. The unaccounted figure, dipped closing less expected closing, is then zero by construction.

So the check checks nothing. If a tank leaked overnight, the dip would fall, the derived opening would fall with it, and the day would still read 0.000 m3. The figure it tests against was made from the figure it tests.

## The real day, beside it

Set the first row beside the real AKODO day. Both close on 4499.452 m3. The real day opens on yesterday's closing dip, 4953.700 m3, measured before today's tanks were dipped. That day reads unaccounted -8.648 m3, direction loss, within a tolerance of 12.365 m3. The derived day opens on 4945.052 m3, taken from today's own dip, and reads 0.000 m3, balanced.

The real day says something about the terminal. The derived day cannot, because its answer was settled before the question was asked.

## This is why the opening stock is an input

This demonstration is the reason reconcileStock takes the opening stock as an input and refuses without one. The line above is short, and the engine does not take it, because an opening stock derived that way turns the day into a reconciliation that cannot fail. The opening stock has to come from outside the day, from a measurement taken before any of today's figures were known. That is yesterday's closing dip.

A gap that can come out wrong is the only kind that proves anything. The gap is the point of the day.

In the panel, type an opening stock taken from the closing dip by the line above and read the unaccounted figure. Then type yesterday's closing dip, 4953.700 m3, and read it again.

## Exercise

Read the second row of the demonstration: closing dip 4380.250 m3, opening taken from it 4825.850 m3, unaccounted 0.000 m3, balanced. Say why that row reads balanced whatever the closing dip is, and what the opening stock must be instead for the day to measure something.

Self check: the opening was derived from the closing dip by undoing the day's movements, so the expected closing equals the dip and the gap is zero by construction. The opening stock must be yesterday's closing dip, measured before today's figures existed.
