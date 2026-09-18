# No rows means nothing to approve

The last case in the approval table is the one most likely to be read wrongly. A change with no approval rows at all has nothing outstanding and nothing rejected. It still does not pass.

## The empty set

| approval set | levels | outstanding | rejected rows | complete |
| --- | --- | --- | --- | --- |
| no approval rows | none | none | 0 | no |

Read the columns one at a time. There are no levels, because levels come from the rows and there are no rows. Nothing is outstanding, because there is no level to be unsigned. There are 0 rejected rows. A check that asks only "is anything outstanding?" and "is anything rejected?" would answer no to both and let the change through.

The engine answers complete no. An empty approval set is incomplete.

## The refusal names what to do

When such a change is asked to move into "Implementation", the refusal says why and what to do next:

- REFUSED, a change with no approval rows at all: No approvers have been assigned, so there is nothing to approve. Add the approval levels this change needs.

That sentence closes a gap the levels rule leaves open. Because the engine reads levels from the rows, it cannot know how many levels a change should have. It can know that a change with no rows has not been through approval at all, and it refuses to treat that as approved.

This answer, like every engine answer in this module, was also replayed through the independent oracle.

## Compare it with the row that has no level

The table carries another probe that looks similar and answers the opposite way:

| approval set | levels | outstanding | rejected rows | complete |
| --- | --- | --- | --- | --- |
| a row with no level at all | 1 | none | 0 | yes |
| no approval rows | none | none | 0 | no |

The first set has a row. Its missing level counts as level 1, and the row is signed, so the set is complete. The second set has no row at all, so there is nothing to sign. A blank level on an existing row is filled in; an absent row is not.

{{panel:rc-change-explorer}}

## Failing closed

A gate that meets an absence has two choices: treat nothing as permission, or treat nothing as a reason to stop. This engine stops. You will see the same choice again in module five, where an emergency change with no implementation date reads "Ratification overdue" because its window cannot be shown to be open.

For a reader, the lesson is to look at the row count before the outstanding list. An empty outstanding list is good news only when there are rows to be outstanding.

## Exercise

For a change with no approval rows, record the levels, the levels outstanding, the rejected rows and whether the set is complete. Record the refusal at the gate into "Implementation". Then set it beside the row with no level at all and say which rule makes one complete and the other incomplete.
