# Working the capstone

Six numbers, all of them about where the deck's contents came from rather than what they are. This lesson walks each mechanism and names the mistake most likely to produce a plausible wrong answer.

## What you are given

The deck, the six mapped well tops, the NG5 volumetric booking of 12139208.107496763 stb over 169 oil cells at a contact of 1560 m, and the field's fluid gravities: 32 API oil, 0.75 gas, 180 F, bubble point 2000 psia.

## Field 1: the deck's STOIIP

Sum the oil volume the model holds under the Eclipse cell-centre rule: for each column, count the layers whose CENTRE is above the contact, take their thickness, multiply by area, porosity and one minus connate water, and divide by the formation volume factor.

The likely mistake is clipping the column at the contact instead of by cell centre. That gives a larger number, because a column whose top is a few feet above the contact then contributes a partial layer rather than none.

The check: your answer should be within a tenth of a percent of the booking, because the model was calibrated to be.

## Field 2: the gap against the booking

The deck's volume against the booked volume, as a percentage. The sign matters: the deck is the smaller, so the answer is negative.

The likely mistake is computing it as a fraction of the deck's volume rather than the booking's. The two differ in the fourth decimal place of a small number, which is inside the tolerance for one and outside for the other.

## Field 3: the oil cell count

Count the columns that contribute any oil under the cell-centre rule.

Two mistakes. Counting CELLS rather than columns gives a number several times larger. And using the column-clipped rule gives a different count, because a column whose top is a foot above the contact contributes oil under one rule and not the other.

The check: it must exceed the booking's 169, because matching the volume over a thinner average column requires more area.

## Field 4: the depth the deck gives Ekene-2

Find Ekene-2's cell from its map coordinates, then read the TOPS value for that column and convert to metres.

The likely mistake is reporting the mapped top of 1565 m. That is the well's depth; the field asks for the DECK's depth, and the two differ because the well is half a cell off the lattice.

The check: the answer should be shallower than 1565 and by less than a metre. If it equals 1565 exactly you have read the well database rather than the deck.

## Field 5: the correlated Bo at initial pressure

Run the standard correlation stack on 32 API, 0.75 gas gravity, 180 F, bubble point 2000 psia, and read the oil formation volume factor at 3200 psia.

The likely mistake is reading the value at the bubble point rather than at the initial pressure. Above the bubble point Bo DECREASES with pressure, so the bubble point value is the larger one, and picking it gives an answer that is wrong in a direction that looks right.

## Field 6: the solution gas gap

The correlated solution gas at the bubble point against the designed 400 scf/stb, as a percentage.

The likely mistake is a unit slip. The deck carries solution gas in Mscf/stb, so its top PVTO node reads 0.4 rather than 400. Comparing 421.94 against 0.4 gives a nonsense percentage, and comparing 0.42194 against 400 gives a different nonsense.

The check: the answer is a few percent, and the correlated value is the larger.

## The general advice

Every one of these six asks you to hold two sources against each other: the deck against the booking, the deck against the well database, the design against the correlation. Before submitting, for each answer, name the two sources and which one the question asked for.

## Exercise

First, for each of the six fields, write down the two sources it compares and which one the answer comes from.

Second, apply the check on field 3 and state what a count below 169 would tell you about which clipping rule you used.
