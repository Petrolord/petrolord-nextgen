# The dual of a row

Every row of a linear programme carries a second number, its dual or shadow price. It answers a question every planner asks: if this limit were a little looser, how much better would the optimum be? In a blend the kernel's raw dual is not yet a price anyone can read, so this module reads it carefully.

## The definition, on the textbook case

A shadow price is the change in the optimum per unit of a row's right-hand side. The textbook case from module one shows it plainly. Maximise 5x + 4y subject to 6x + 4y <= 24 and 1x + 2y <= 6. The kernel reports an objective of 21.0000, a shadow price of 0.7500 on row 1 and 0.5000 on row 2.

The digest checks each by re-solving with the right-hand side raised by one unit, on the same kernel:

| row raised by one | objective | change from the optimum |
| --- | --- | --- |
| row 1, rhs 25 | 21.7500 | 0.7500 |
| row 2, rhs 7 | 21.5000 | 0.5000 |

The change column equals the shadow price in both rows. One more hour on the first unit is worth 0.7500 of objective, and one more on the second is worth 0.5000. That is what a shadow price is: the value, at the margin, of one more unit of whatever the row limits.

## Only binding rows carry a price

Both textbook rows hold exactly at the optimum, so both carry a price. A row with room to spare carries a price of zero, because loosening a limit the optimum does not touch changes nothing. At Apapa the RON, MON and density rows are not binding, and each prices at 0.0000.

## In a blend the dual is rowPrice

optimiseBlend reads the kernel's dual for each row and keeps it as rowPrice: the change in cost per unit of the row's right-hand side. For the volume row that is already a price a person can read. The right-hand side of the volume row is the batch in barrels, so its dual is dollars per barrel of product. At Apapa both columns read 87.5108 for the Total volume row.

For a specification row it is not. Module two built the row as sum((w_i - L d_i) v_i) <= 0. Its right-hand side is zero, and one unit of that right-hand side is a unit of weighted property volume. A ppm of sulfur and a psi of RVP are other quantities. So the sulfur row's rowPrice at Apapa is -0.0914, and the RVP row's is -0.2569, and neither is a price per anything a person reads.

## rowPrice is kept for checking

The engine keeps rowPrice beside the price it reports, so every price traces back to the kernel's own number. The next lesson shows the conversion: a price per whole unit of the property, positive when relief saves money, built from rowPrice, the row's own weights and, for an index, the slope of the index. Calling a rowPrice a price is the error this module exists to prevent.

{{panel:crude-recipe-explorer}}

In the panel, open the textbook case and raise one right-hand side by one unit. Read the change in the objective beside the shadow price the kernel reported before the move.

## Exercise

Read the textbook re-solve table: row 1 raised to rhs 25 gives an objective of 21.7500, a change of 0.7500, and the kernel's shadow price on row 1 is 0.7500. Then read the Apapa price table: the Sulfur maximum row has rowPrice -0.0914 and a price of 551.8026 per ppm. Say what the agreement in the textbook case shows, and say what the two different Sulfur figures show about reading a rowPrice as a price.
