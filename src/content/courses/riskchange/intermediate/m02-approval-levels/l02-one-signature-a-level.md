# One signature a level

The rule over the approval rows asks for at least one "Approved" row at every distinct level. This lesson reads the two words that carry the weight: "one" and "Approved".

## One signer is enough at a level

A level can carry more than one row. Two people may both be asked to approve at level 2. The engine prints that case:

| approval set | levels | outstanding | rejected rows | complete |
| --- | --- | --- | --- | --- |
| two signers at level 2, one of them signed | 1, 2 | none | 0 | yes |

The second signer at level 2 is still "Pending", and the level is still signed, because one "Approved" row signs a level. The engine does not read a level as a vote that needs every row. If an organisation wants both people to sign, the engine's rule does not express that with two rows at one level. It would need two levels.

That is worth knowing before you build an approval set. Two rows at the same level mean "either of these may sign for this level". Two rows at different levels mean "both of these levels must sign".

## Only "Approved" signs

The four statuses are "Pending", "Approved", "Rejected" and "Delegated". Only one of them signs:

| approval set | levels | outstanding | rejected rows | complete |
| --- | --- | --- | --- | --- |
| three levels, the first signed | 1, 2, 3 | 2, 3 | 0 | no |
| a delegated row | 1 | 1 | 0 | no |

A "Delegated" row is not an "Approved" row, so its level stays outstanding. A delegated row records no approval, so it signs nothing. Module three reads how an absence is covered.

The engine's answers here were each replayed through the independent Python oracle for the module, so every row is two methods agreeing.

## What the gate says about outstanding levels

When a change is asked to move into "Implementation" with levels unsigned, the refusal names them. For ES-01, a permanent change in the ESANMI register with levels 2 and 3 unsigned, the engine answers:

- REFUSED, ES-01 into Implementation as it stands, levels 2 and 3 unsigned: Approval levels 2 and 3 have not signed yet.

The sentence is built from the outstanding list, so it tells the user which levels to chase. Module four reads the rest of the gate.

{{panel:rc-change-explorer}}

## Reading an approval set in order

When you read a set of approval rows, work in this order:

1. List the distinct levels on the rows, treating a row with no level as level 1.
2. For each level, look for at least one "Approved" row. A level without one is outstanding.
3. Look for any "Rejected" row at any level.
4. The set is complete only when nothing is outstanding and nothing is rejected.

"Pending" and "Delegated" rows do nothing to step 2 on their own. They sit on the set, and the level they sit at stays outstanding until somebody at that level approves.

## Exercise

For the set with two signers at level 2, one of them signed, record the levels, the levels outstanding and whether the set is complete. Then do the same for the set holding one "Delegated" row. Say which word in the rule, "one" or "Approved", decided each answer.
