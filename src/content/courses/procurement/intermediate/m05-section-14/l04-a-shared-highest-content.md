# A shared highest content

{{panel:pr-award-calculator}}

Section 14 selects the bid that "contains the highest level" of Nigerian content, provided it leads its closest competitor by at least 5%. Two situations strain those words: two bids that share the highest content, and a runner-up with no Nigerian content at all. In both the engine returns a lead of null, and in both it says why. This lesson reads each.

## Two bids at the top

A stated case under the points reading: LO, the lowest evaluated cost, at 2000000 with 40%; S1 at 2005000 with 65%; S2 at 2010000 with 65%. All three are within 1% of LO, so all three are in the group.

| | points reading |
| --- | --- |
| group | LO, S1, S2 |
| lead | null |
| s.14 applied | false |
| selected | LO |

S1 and S2 tie for the highest content. No single bid "contains the highest level" here. The engine reads that as the section being engaged, with the group formed, but selecting nothing. The lowest evaluated cost stands. The reason, after its case label and before the three readings, verbatim:

"S1 and S2 share the highest Nigerian content 65%, so no single bid leads; the lowest evaluated cost LO stands"

The lead is null because there is no single leader to measure it from. A lead of zero would say something different, that a leader exists and leads by nothing. Null says the question has no answer on these bids.

The Act states no tie-break for this case, and the engine invents none for s.14: it leaves the lowest evaluated cost in place and reports why.

## A runner-up with nothing

A stated case under the relative reading: LO at 2000000 with 0%, and Z1 at 2004000 with 30%. Z1 leads. The runner-up, LO, has no Nigerian content.

| | relative reading |
| --- | --- |
| group | LO, Z1 |
| lead | null |
| s.14 applied | true |
| selected | Z1 |

Under the relative reading the lead is measured as a percentage of the runner-up's content, and a percentage of zero is a division by zero. The engine returns the lead as null. It still applies the section, because any positive content is more than 5% higher than none, by any reading. The reason, after its case label and before the readings, verbatim:

"2 bids within 1% of the lowest evaluated cost; Z1 has the highest Nigerian content, 30% against 0% (LO), a runner-up with no Nigerian content, at least 5% higher, so s.14 selects Z1 over the lowest evaluated cost LO"

Here a null lead sits beside an applied section. That is why the course reads the applied and selected fields as well as the lead: a null lead can mean "no single leader" or "no finite ratio", and only the reason and the other fields say which.

## Quoting these results

Every one of these figures is quoted with its reading. A null lead on the Z1 case under the relative reading and a null lead on the S1 and S2 case under the points reading are different statements, and both are results returned with a reason.

## Exercise

Open the award calculator on the view "Sections 14 and 16, both readings". Replace the bids with LO, S1 and S2 from the first table, each with a receipt time and flags of your choosing, and read both columns. Raise S2's content by one point and read the leader, the lead and the selected bid under each reading. Then replace the bids with LO and Z1 from the second table and read both columns, noting what the points column gives for the lead where the relative column gives null.
