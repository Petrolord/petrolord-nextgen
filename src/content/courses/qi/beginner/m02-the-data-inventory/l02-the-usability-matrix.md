# The usability matrix

An inventory says what each well carries. A usability matrix says what that means for the study. QI Studio grades every well against every target interval, item by item, as good, limited or missing, and each cell takes the worst of its items. The grades are a rule applied to the headers, written down so two people reading the same headers reach the same matrix.

{{video:qi-a2}}

## The rule, item by item

| item | absent or short means |
| --- | --- |
| sonic | missing |
| density | missing |
| shear | limited |
| porosity | limited |
| shale volume | limited |
| saturation | limited |
| checkshots, fewer than two levels | limited |
| elevation, unset | missing |
| deviation survey, none | limited |

The split follows what the study can do without the item. Sonic and density are required: with either one absent, rock physics cannot run, so the item is missing. Shear, porosity, shale volume and saturation are limited when absent, because the study can go on with an estimate. A well with fewer than two checkshot levels is limited. An unset elevation is missing. No deviation survey is limited.

A cell takes the worst of its items. One missing item makes the cell missing, however good the rest; a cell is good only when every item is good.

## The Ekene matrix

The matrix below is QI Studio's own function run on the pack's headers for the target Ekene Sand. The porosity, shale volume and saturation items read the curves the LAS files carry, and the files carry none of the three, so each reads as absent.

| well | cell | sonic | density | shear | porosity | vsh | sw | checkshots | datum | survey |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ekene-1 | limited | good | good | good | limited | limited | limited | good | good | good |
| Ekene-10 | limited | good | good | good | limited | limited | limited | good | good | good |
| Ekene-2 | limited | good | good | good | limited | limited | limited | good | good | good |
| Ekene-3 | limited | good | good | good | limited | limited | limited | good | good | good |
| Ekene-4 | limited | good | good | good | limited | limited | limited | good | good | good |
| Ekene-5 | limited | good | good | good | limited | limited | limited | good | good | good |
| Ekene-6 | limited | good | good | good | limited | limited | limited | good | good | good |
| Ekene-7 | limited | good | good | good | limited | limited | limited | good | good | good |
| Ekene-8 | limited | good | good | good | limited | limited | limited | good | good | good |
| Ekene-9 | missing | good | missing | good | limited | limited | limited | good | good | good |

Counts over the 10 cells: good 0, limited 9, missing 1. Ekene-9's density item reads: "No density over the zone."

## Reading it

No cell is good, and that is the honest answer for files with no petrophysical curves: every logged well is limited on porosity, shale volume and saturation. That is a gap a study closes by bringing those curves in from petrophysics before it starts, which is why the pack carries the kit's PHIT, VSH and SW for Ekene-1 to Ekene-4.

Nine cells are limited and no worse. Sonic, density, shear, checkshots, datum and survey are good on all nine, so the elastic work can run and only the substitution inputs wait on petrophysics.

Ekene-9 is the one missing cell, and its missing item is density. A limited porosity curve would not stop it; the missing density does. The study either brings in a density log or leaves Ekene-9 out of every elastic result.

Ekene-11 and Ekene-12 are not in the matrix at all. A planned well and a survey location carry no logs, so there is nothing to grade over the zone.

## What the matrix is for

The matrix sets the scope of the study before any engine runs. It says which wells can carry an elastic set, which results will lean on an estimate, and what has to be requested. No usability grade is graded in the capstone; the matrix is a working record of what the data allows.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to Data inventory and Data to "Ekene pack: Ekene-1". Using the inventory table and the rule above, grade the sonic, density, shear and checkshot items for every logged well yourself, and take the worst for each cell. Compare your grades with the matrix in this lesson and explain any cell where the inventory table alone cannot settle the grade.
