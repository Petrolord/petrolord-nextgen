# A blank box is missing

{{panel:carbon-inventory-explorer}}

## The refusal

Leave the Igbogene flare's destruction efficiency blank and the engine answers with a refusal. A blank box reaches the engine as an empty string or null, and the answer is the same for both:

REFUSED: A destruction efficiency is required. It is not read as 100 percent: for a flare it is the answer, and it is contested.

The refusal has three parts. The value is required. It is not read as 100 percent. And the reason: for a flare the destruction efficiency is the answer, and the figure is contested.

## What 100 percent would report

The digest prints what a flare read as 100 percent would report beside the same flare at its stated efficiency. The inputs are invented for this course and the methane line is on "IPCC AR6 GWP100, fossil methane":

| destruction efficiency | co2Tonnes | ch4Tonnes | methane line tCO2e | flare tCO2e |
| --- | --- | --- | --- | --- |
| 1 | 2236.537 | 0.000 | no line (no methane) | 2236.537 |
| 0.98 | 2191.807 | 16.306 | 485.922 | 2677.729 |

Read as 100 percent, the same flare is 2236.537 tCO2e with no methane line: 441.191 tCO2e below the flare at 0.98. That difference is the digest's arithmetic on the engine's two figures.

The 100 percent row has no methane at all. The methane line is the part that disappears, and on the course's set it is 485.922 tCO2e at the stated efficiency. A blank read as 100 percent would remove it from the inventory without anyone having decided that the flare burns completely. That is what the refusal prevents.

## A refused flare is a blocked line

SECTION 5 prints what happens to the refusal: handed to atomBalanceLines, the refused flare becomes 1 line labelled "Flaring" that carries the refusal, so an inventory built with it is blocked on the flare.

SECTION 9 prints the Igbogene inventory with every other gap closed and only the flare's efficiency blank:

| lines | Scope 1 tCO2e | Scope 2 tCO2e | total tCO2e | reportable | not reportable because |
| --- | --- | --- | --- | --- | --- |
| 4 | 27353.048 | 12915.000 | 40268.048 | false | 1 line(s) could not be computed |

The blocked line is Flaring, and its reason is the refusal above, word for word. The digest reads the row itself: the total leaves out the flare's CO2 and methane lines, and the inventory is not reportable while the flare stands refused. With the flare efficiency entered, the inventory has 5 lines and Scope 1 is 30030.777 tCO2e.

SECTION 9 prints one more case beside it. atomBalanceLines with excluded true adds no line at all: 0 lines, for a source left out of the boundary on purpose. A refused flare is a blocked line with its reason. A source excluded on purpose adds none.

In practice, the person reading an inventory total rarely sees the input boxes behind it, so the blocked line is the record that a box was left blank.

In the panel, clear the flare's efficiency, then type 1, then type 0.98, and compare the three states of the inventory.

## Exercise

Read the rows for 1 and for 0.98 and the digest's difference of 441.191 tCO2e. Say what the relationship between the two rows shows about why the engine refuses a blank instead of reading it as 100 percent.

Self check: read as 100 percent, the flare is 2236.537 tCO2e with no methane line. At its stated 0.98 it is 2677.729 tCO2e, with a methane line of 485.922 tCO2e. The 100 percent reading is 441.191 tCO2e below the stated one and drops the methane line entirely, so a blank read as 100 percent would drop the methane line without anyone having decided that the flare burns completely.
