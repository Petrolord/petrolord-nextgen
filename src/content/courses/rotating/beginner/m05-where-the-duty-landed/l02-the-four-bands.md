# The four bands

The percentage of best efficiency flow is turned into one of four labels. The labels are what a reader acts on, and the boundaries between them are at 50, 70, 120 and 140 percent of best efficiency flow.

{{panel:fc-pump-explorer}}

## The labels, with a row from each

| flow gpm | percent of BEP | region | preferred | note present |
| --- | --- | --- | --- | --- |
| 345.000000 | 30.000000 | outside | false | true |
| 690.000000 | 60.000000 | allowable, low | false | true |
| 977.500000 | 85.000000 | preferred | true | false |
| 1495.000000 | 130.000000 | allowable, high | false | true |
| 1840.000000 | 160.000000 | outside | false | true |

Five rows and four labels. The label "outside" appears at both ends of the range, low and high, and the two cases carry different notes because they fail for different reasons. Everything between 70 and 120 percent is "preferred" and carries no note at all.

## The three fields move together

Read the last three columns across. The region names the band. The preferred flag is true on exactly the rows labelled "preferred" and false everywhere else, which makes it the machine-readable half of the label. And a note is present on exactly the rows where the flag is false.

That consistency is the point. A caller who tests the flag, a caller who tests the label and a caller who tests for the presence of a note all get the same verdict. There is no row in this table where two of those three disagree.

## Why a label and a percentage both

The percentage alone would leave every reader to apply their own bands, and two engineers would then read the same duty differently. The label alone would throw away how close the duty is to the edge of its band, which is the difference between a selection that is comfortable and one that will move out of its band the first time the station changes. The return carries both, so neither reading is lost.

## What is held for literature here

The bands themselves are held. They are at 50, 70, 120 and 140 percent, they are customary in pump practice, and this repository holds no publication for them. So no graded value anywhere in this course is a region, a percentage of best efficiency flow or a preferred flag.

That does not make them useless and it does not make them decorative. It makes them a convention that this course prints, explains and refuses to examine anybody on, which is the honest treatment of a number with no citation behind it. When you take these labels to a real selection, the bands your own organisation works to are the ones that matter.

## The mistake

Reading "allowable" as acceptable. The word is doing a narrower job than it looks. Both allowable bands carry a note, each naming a different consequence of running there, and the next two lessons read all four notes. A duty in an allowable band is a duty somebody has decided to live with.

## Exercise

Name the four labels and give the four percentages the boundaries sit at. Then say which label carries no note, and explain why nothing in this course is graded on a region or a preferred flag.
