# A blank cost is a missing cost

A cost left empty on a form is one of the commonest ways a figure goes wrong without anyone noticing. A spreadsheet reads the empty cell as nothing, adds nothing, and prints a cheaper answer to the same precision as a correct one. The engine's `truckingEconomics` treats an empty cost box as a missing cost, names it, and marks the answer incomplete.

{{panel:supply-depot-explorer}}

## Four ways to state the driver cost

The engine prints the IBAFO lane four times, with the driver cost stated differently each time. Money is in naira, and every cost is invented for this course.

| the driver cost | complete | missing inputs | cost a trip, naira | cost per litre delivered, naira |
| --- | --- | --- | --- | --- |
| typed | true | none | 495830.99 | 15.0704 |
| blank | false | Driver | 437830.99 | 13.3075 |
| null | false | Driver | 437830.99 | 13.3075 |
| left out of the call | true | none | 437830.99 | 13.3075 |

The typed row is the lane as it should be run. The blank and null rows print a lower cost and say why: the answer is not complete, and the missing input is named as Driver. Anyone reading the output can see that the cost per litre is short by a driver.

## The row that looks complete

The last row deserves the closest reading. The driver cost is left out of the call entirely. The engine then applies the default its signature states, and it reports the answer as complete, with no missing input. Its cost figures are the same as the blank row's.

So two rows print the same money and differ only in the flag. A blank box is read as a missing measurement. An absent input is read as a deliberate choice to accept the stated default. The engine can tell the two apart only by how the call was made. A form that drops an empty field from the call, instead of sending it as blank, turns a missing driver cost into a complete answer.

The lesson for anyone building on the engine is to send every cost the user was shown, blank or not, so that a box the user left empty reaches the engine as missing.

## A missing capital cost

The same rule applies to the truck's capital. With no truck capital cost, the engine prints complete false, names Truck depreciation as missing, and reports a cost per litre delivered of 13.2401 naira, which is a floor.

A floor is a lower bound. The true cost per litre is that figure plus whatever the missing line would add. A floor is useful: it says the lane costs at least this much. It cannot be quoted as the lane's cost.

## Why name the gap

The reason is the one this course keeps returning to. A figure that cannot come out wrong proves nothing, and a cost that quietly drops a line cannot be told apart from a correct one. By naming the missing line, the engine makes the gap part of the answer. A reader can see which cost is missing, fill it, and run again.

## Exercise

Read the four driver cost rows. For each, quote whether the answer is complete, what is named as missing, and the cost per litre delivered. Say which two rows print the same money and differ only in the flag, and what that means for a form that drops empty fields before calling the engine. Then quote the missing capital case and say what its floor means.
