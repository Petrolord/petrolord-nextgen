# The items nobody placed

Two different gaps stop a comparison being made: an item with no usable coordinates, and a pair of types the spacing table has no figure for. The engine names both rather than quietly leaving them out.

{{panel:fc-layout-explorer}}

## Skipped items carry a reason

ERHA skips two items, and each one says why: `[{"id":"tk2","reason":"bad-coordinates"},{"id":"fl2","reason":"radiation-source-not-placed"}]`.

The first is a tank whose coordinates could not be read, so every pair involving it is gone. The second is a radiation source that is not on the plan, so the setback it would have produced was never computed and nothing could be measured against it. Both are absences with names attached, which is what makes them actionable.

The published cases isolate each. s3AllUnplacedNothingChecked skips w1 and s1, both `bad-coordinates`, and reports checked 0. radiationAndTableWithGhostSource skips an item called ghost with reason `radiation-source-not-placed`, and still manages checked 2 with 2 violations from the items that were placed.

## Unknown pairs are a gap in the table

ERHA reports 12 unknown type pairs, all of them from one chemical injection skid. The table has no figure for a tank beside a skid, so `requiredSpacingM` returns null rather than a guess, and the pair is recorded as unknown.

That is honest and it has a consequence. A flow meter, a skid, a pig launcher or a booster package all return null, so a real plot containing any modern package will report unknown pairs and will not be complete. The answer is a site standard that carries those types, which is a decision for whoever owns the table.

The published case unknownPairIncomplete shows the record: unknown `[{"typeA":"unicorn","typeB":"tank"},{"typeA":"unicorn","typeB":"wellhead"}]`, with checked 1 and 1 violation from the pair that was known.

## The lookup is symmetric and it says null

A pair the table does not carry returns null in both directions, because the lookup is symmetric. Null is the table saying it has no entry. It is not zero, which is the table saying no distance is required, and the two are counted in different places for exactly that reason.

## What is still worth reading

A layout that skipped things is still a layout that judged the rest. radiationAndTableWithGhostSource found 2 violations while one of its sources was missing, and those 2 violations are real findings on real pairs. The skipped list does not invalidate the checks that were made. It says the review has a remainder.

## The mistake

The mistake is treating a skipped item as a cleared item. Nothing about tk2 was examined, so a plan showing no violation involving it is showing an absence of evidence. The skipped list is the place to look before signing.

The second mistake is defaulting an unknown pair to zero to make a plan complete. That converts a gap in the table into a positive statement that no separation is required, which is the one thing the table never said.

## Exercise

Give the two skipped items ERHA reports with their reasons, and explain what each reason means for the pairs involved. Then say why an unknown type pair returns null rather than zero, how many unknown pairs ERHA reports and what they come from, and why defaulting them to zero would be worse than leaving the layout incomplete.
