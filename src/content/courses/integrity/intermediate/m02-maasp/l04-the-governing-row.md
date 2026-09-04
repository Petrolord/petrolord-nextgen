# The governing row

Every row can be right and the answer still wrong, because picking one of them is a separate piece of work.

{{panel:wi-annulus-explorer}}

## The reduction

    let governing = rows[0];
    for (const r of rows) if (r.allowSurfacePa < governing.allowSurfacePa) governing = r;

The governing row is the MINIMUM over the rows. It is not the first row, and rows[0] appears in that code only as an incumbent to be beaten.

On the published candidates the winner is the third one supplied:

| name | allowable, Pa |
|---|---|
| 9-5/8 production casing burst | 17606905.05541501 |
| 7 in production liner burst | 26855228.63225454 |
| 4-1/2 tubing collapse | 11905664.170969129 |

Governing: 4-1/2 tubing collapse, at 11905664.170969129 Pa. A reduction that returned the first row instead would report 17606905.05541501 Pa, and the difference, 5701240.88444588 Pa, is pressure the tubing cannot take being offered to an operator as though it could.

## Data and logic are verified differently

A row is data. Check it against an oracle, or against a line of arithmetic, and you have checked it.

The pick is logic. It has no arithmetic to compare against, it has a rule, and a golden case only exercises the rule for the ordering that golden happens to have. Verify all three rows above to the last decimal and you have verified nothing about the fold that turns them into one number.

A sibling course in this series shipped exactly that mistake in a different engine. A casing check reduced a whole load profile to one depth, and took that depth at the bottom of the section rather than searching it. Every pressure in the profile was correct. The pick was wrong, so the answer was optimistic on the cases whose worst point sat at the top, with no error and no implausible number to give it away.

## Two details of this reduction

The comparison is strictly less than, so on a tie the earlier row keeps the name. The reported limit is identical either way, but the element you go and inspect is not, so a near tie deserves a look at the list rather than trust in the label.

The clamp comes after the pick. `maaspPa` is the greater of zero and the governing row's allowable, and `negative` reports on that same row, which is the smallest, so no other row can be negative while it is not.

## Exercise

In the panel, reorder the candidates so the tubing collapse is first, and confirm the reported limit does not move.

Then construct a two element case where the first row governs, and say why that case would fail to detect a first-row bug.
