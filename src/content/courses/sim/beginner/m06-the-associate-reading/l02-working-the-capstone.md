# Working the capstone

Six numbers, every one of them read or counted from a deck. The capstone's brief gives a setting of its own, a regional mean for the kriged TOP_SAND surface, so the deck you read is the Ekene deck rebuilt at that mean. Type the setting into the deck and structure explorers; both open on the committed deck, which is the one this lesson works. The values below are the committed deck's. The capstone does not grade them.

## What changes when the deck is rebuilt

The rebuild changes the column tops, and only them. The six wells still sit in the same cells. Kriging with a zero nugget still returns each mapped top exactly where a well sits on a cell centre. The layers keep their thicknesses in the waterflood course's proportions. The tables and the completions do not move. Everything that depends on the tops moves with them: the TOPS array, the EQUIL datum, each well's reference depth, and which columns sit above the contact.

That is why the fields ask for tops rather than for the cell count, a layer thickness or a table end point. Those are fixed by the deck design, and no setting moves them.

{{panel:sim-deck-explorer}}

## Fields 1 to 3: the top of a stated column

Find the column in TOPS, or type its (i, j) into the structure explorer's column readout, and read its top in feet. On the committed deck, column (15, 15) reads the value the readout shows when the panel opens.

The likely mistake is reading the column the wrong way round. TOPS runs i fastest, so the value for (i, j) sits at position i + 30 (j - 1) in the array, counting from 1. Swapping i and j gives a real top from a different corner of the field.

The check: every top must lie between the crest and the deepest top, and a column next to a well should sit close to that well's mapped top.

## Field 4: the top of the Ekene-2 column

Ekene-2 is the one well half a cell off the lattice, at y = 1150. Its cell is (23, 13), and the deck gives it the top of that column. The mapped 1565 m belongs to the well database. Read the column's top in feet.

The likely mistake is converting the mapped 1565 m to feet. That is the well database. The field asks for the deck.

## Field 5: the EQUIL datum

The mean of the 900 column tops, in feet, which the deck writes into EQUIL. On the committed deck it is 5129.97 ft.

The likely mistake is the midpoint of the depth range, which is a different number because the surface is not symmetric about its range. The check: the datum moves with the regional mean, and in the same direction.

## Field 6: columns above the contact

Count the columns whose top lies above the contact. The structure explorer's tile counts them. The EQUIL contact is in feet; convert before you compare it with a top, or the count comes out as all or nothing.

The likely mistake is counting oil CELLS under the cell-centre rule instead, which the Professional tier grades. A column whose top is a foot above the contact counts here even though its first layer's centre may sit below it.

## The general advice

Every one of these is a reading exercise, and every likely mistake is reading the right kind of number off the wrong place. Before submitting, for each answer, name the keyword or tile you read it from.

## Exercise

First, for each of the six fields, write down the keyword or tile you would read it from and one number that would tell you immediately that you had read the wrong place.

Second, on the committed deck, read the tops of columns (11, 11) and (23, 13). Explain why the first equals Ekene-1's mapped top exactly and the second does not equal Ekene-2's.
