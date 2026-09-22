# Working the capstone

Six numbers, all of them about where the deck's contents came from rather than what they are. The capstone's brief states a setting of its own: a regional mean and a contact to rebuild the deck at, and an oil for the correlation check. Type them into the structure explorer, which opens on the committed deck and the teaching oil. This lesson walks each mechanism on the committed deck and names the mistake most likely to produce a plausible wrong answer. The capstone does not grade the teaching values.

## What you are given

The deck, the six mapped well tops, and the NG5 volumetric booking of 12139208.107496763 stb over 169 oil cells at a contact of 1560 m. The teaching oil is the field's: 32 API, 0.75 gas, 180 F, bubble point 2000 psia, 400 scf/stb designed.

## Field 1: the deck's STOIIP

Sum the oil volume the model holds under the Eclipse cell-centre rule: for each column, count the layers whose CENTRE is above the contact, take their thickness, multiply by area, porosity and one minus connate water, and divide by the formation volume factor.

The likely mistake is clipping the column at the contact instead of by cell centre. That gives a larger number, because a column whose top is a few feet above the contact then contributes a partial layer rather than none.

The check on the committed deck: it lands within a tenth of a percent of the booking, because the model was calibrated to. A deck rebuilt at another mean or contact will not, and the gap is the next field.

## Field 2: the gap against the booking

The deck's volume against the booked volume, as a percentage. The sign matters: a smaller deck reads negative, a larger one positive.

The likely mistake is computing it as a fraction of the deck's volume rather than the booking's. The two differ in the fourth decimal place of a small number, which is inside the tolerance for one and outside for the other.

## Field 3: the oil cell count

Count the columns that contribute any oil under the cell-centre rule.

Two mistakes. Counting CELLS rather than columns gives a number several times larger. And using the column-clipped rule gives a different count, because a column whose top is a foot above the contact contributes oil under one rule and not the other.

The check on the committed deck: it exceeds the booking's 169, because matching the volume over a thinner average column requires more area.

## Field 4: the depth the deck gives Ekene-2

Find Ekene-2's cell from its map coordinates, (2200, 1150), then read the TOPS value for that column and convert to metres. The structure explorer's well table gives it in metres.

The likely mistake is reporting the mapped top of 1565 m. That is the well's depth; the field asks for the DECK's depth, and the two differ because the well is half a cell off the lattice.

The check: the answer should differ from 1565 by less than a metre or so. If it equals 1565 exactly you have read the well database rather than the deck.

## Field 5: the correlated Bo at initial pressure

Run the standard correlation stack on the stated oil (the structure explorer's correlation check takes it) and read the oil formation volume factor at the initial pressure. For the teaching oil that is 32 API, 0.75 gas gravity, 180 F, bubble point 2000 psia, read at 3200 psia.

The likely mistake is reading the value at the bubble point rather than at the initial pressure. Above the bubble point Bo DECREASES with pressure, so the bubble point value is the larger one, and picking it gives an answer that is wrong in a direction that looks right.

## Field 6: the solution gas gap

The correlated solution gas at the bubble point against the designed solution gas, as a percentage. For the teaching oil the design is 400 scf/stb.

The likely mistake is a unit slip. The deck carries solution gas in Mscf/stb, so its top PVTO node reads 0.4 rather than 400. Comparing the teaching oil's 421.94 against 0.4 gives a nonsense percentage, and comparing 0.42194 against 400 gives a different nonsense.

The check for the teaching oil: the answer is a few percent, and the correlated value is the larger.

## The general advice

Every one of these six asks you to hold two sources against each other: the deck against the booking, the deck against the well database, the design against the correlation. Before submitting, for each answer, name the two sources and which one the question asked for.

## Exercise

First, for each of the six fields, write down the two sources it compares and which one the answer comes from.

Second, on the committed deck, apply the check on field 3 and state what a count below 169 would tell you about which clipping rule you used.
