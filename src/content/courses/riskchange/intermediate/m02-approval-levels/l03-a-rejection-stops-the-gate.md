# A rejection stops the gate

The approval rule has two halves. The first asks for a signature at every level. The second says no row at any level may be "Rejected". This lesson reads the second half, which can stop a change that looks fully signed.

## Every level signed, and still not complete

The engine prints the case that shows it:

| approval set | levels | outstanding | rejected rows | complete |
| --- | --- | --- | --- | --- |
| every level signed and one rejection | 1, 2 | none | 1 | no |

Nothing is outstanding. Level 1 has an "Approved" row and level 2 has an "Approved" row. A reader who checks only for outstanding levels would call this set done. The engine does not, because one row somewhere in the set is "Rejected". A rejection anywhere makes the set incomplete even when every level has an "Approved" row.

It does not matter which level the rejection sits at. One recorded rejection is enough to stop the set.

## The refusal at the gate

When a change with that set is asked to move into "Implementation", the engine refuses with its own sentence:

- REFUSED, a change with every level signed and one rejection: An approver has rejected this change. It cannot be implemented.

Compare it with the refusal for unsigned levels, "Approval levels 2 and 3 have not signed yet." That one names what is missing and invites more signatures. This one names a decision that has been made. No further signature clears it, because the rejected row still sits on the set.

Both refusals were replayed through the module's independent oracle, so each is two methods agreeing.

## Why a rejection outweighs approvals

An approval set is the record of independent people being asked whether a change is safe to make. If one of them has said no, the set carries an objection that nobody has answered. Letting the approvals at other levels outvote it would turn the approval set into a majority vote, and the engine's rule does not do that. The objection has to be dealt with before the change can go in.

The engine also holds the rejection in place. Module three shows that an approval already decided cannot be decided again: the refusal reads "This approval is already rejected."


## The emergency route respects it too

Module five reads the emergency route, which lets an Emergency change into "Implementation" on its first level alone. Even there the condition is that level 1 has signed and nobody has rejected it. The route shortens the wait for signatures. It does not step over a rejection.

## A rejected row and a rejected change

Two things in this tier carry the same word. A rejected approval row is a status on one row. "Rejected" is also a stage of a change, one of the three terminal stages, reachable from "Screening", "Review" and "Approval". A rejected row stops the gate into "Implementation"; a change in the "Rejected" stage is final, and the engine answers "A rejected change is final." if anyone tries to move it. Name which one you mean.

{{panel:rc-change-explorer}}

## Exercise

For the set with every level signed and one rejection, record the levels, the levels outstanding, the number of rejected rows and whether the set is complete. Record the refusal the engine gives at the gate into "Implementation". Then say which half of the approval rule produced it, and why the empty outstanding list did not decide the answer.
