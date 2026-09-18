# Levels come from the rows

Module one showed that only "Approval" leads to "Implementation". This module reads what it takes to pass through that door: the approval rows attached to a change, and the rule the engine applies to them.

## No list of levels anywhere else

The engine keeps no separate setting that says how many levels a change needs. The levels come from the approval rows themselves. Whatever distinct levels appear on the rows attached to a change are the levels that change needs, and the rule over them is short:

- every distinct level present must carry at least one "Approved" row;
- no row at any level may be "Rejected";
- a row with no level counts as level 1.

An approval row has one of four statuses: "Pending", "Approved", "Rejected" and "Delegated". Only "Approved" signs a level. The next two lessons read the other three. "Delegated" is a status a row can carry and nothing more: it signs nothing, and module three shows that deciding a Delegated row is refused as already delegated.

## Reading the levels off a set

The engine prints each probe with the levels it found, the levels still outstanding, the count of rejected rows, and whether the set is complete:

| approval set | levels | outstanding | rejected rows | complete |
| --- | --- | --- | --- | --- |
| three levels, the first signed | 1, 2, 3 | 2, 3 | 0 | no |
| three levels, all signed | 1, 2, 3 | none | 0 | yes |
| a row with no level at all | 1 | none | 0 | yes |
| levels 1 and 3, no level 2 | 1, 3 | 3 | 0 | no |

Every answer in that table was also replayed through the module's independent oracle.

## A missing level is not invented

Look at the last row. The set carries rows at levels 1 and 3 and nothing at level 2. The engine reads levels 1 and 3, and only level 3 is outstanding. It does not conclude that a level 2 row must be missing and refuse the set for it. The levels are whatever the rows say they are.

That puts a duty on whoever builds the approval set. If a change needs a level 2 signature, a level 2 row has to exist. The engine checks the rows it is handed, and it cannot check a row nobody added.

## A row with no level

A row with no level at all counts as level 1. A set holding one such row, signed, reads levels 1, outstanding none, complete yes. The blank does not make the row disappear, and it does not create a separate unnamed level. It lands on the first level.

{{panel:rc-change-explorer}}

## Complete means both halves

"Complete" in these tables is a yes or no over both rules together: every level signed and no rejection anywhere. The set with three levels and only the first signed has two levels outstanding, 2 and 3, so it is not complete. When every level is signed and nothing is rejected, it is.

## Exercise

For the set with levels 1 and 3 and no level 2, record the levels the engine found, the levels outstanding and whether the set is complete. Then record the same three answers for a set holding one signed row with no level. For each, name the rule from this lesson that produced the answer.
