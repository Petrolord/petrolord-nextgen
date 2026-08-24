# The problem

Ekene-4 reached total depth above TOP_B. The hole ended below BASE_SAND at 1615 m and above the surface everybody wants, so the well carries TOP_A at 1530 m, TOP_SAND at 1590 m and BASE_SAND at 1615 m, and it carries no TOP_B. The other three wells on the section all carry TOP_B, at 1640 m in Ekene-1, 1662 m in Ekene-2 and 1628 m in Ekene-3.

Two tiers of this course have already met that blank. The Associate tier read the section and learned to leave the gap alone. The Professional tier flattened the section, measured how it grows, and set the rule that a missing pick stays missing in the data. This tier does the thing both of those tiers deliberately refused to do. It predicts where TOP_B would have been in Ekene-4, and it says out loud how much that prediction can be trusted.

## What is missing, precisely

One value. Not a well, not a log, not a zone. The tops table for the Ekene section has sixteen slots and fifteen of them are filled.

| top | Ekene-1 | Ekene-2 | Ekene-3 | Ekene-4 |
| --- | --- | --- | --- | --- |
| TOP_A | 1500 | 1512 | 1495 | 1530 |
| TOP_SAND | 1548 | 1565 | 1541 | 1590 |
| BASE_SAND | 1580 | 1601 | 1570 | 1615 |
| TOP_B | 1640 | 1662 | 1628 | missing |

Every depth in that table is a measured depth in metres. The blank is correct and it is not a data-quality defect. Ekene-4's logs are good, its picks are good, and the surface it lacks lies below the bottom of the hole. There is nothing in that wellbore to re-examine, because the rock was never drilled.

That matters for how you approach the rest of the tier. You are not recovering a lost measurement. There is no measurement. You are constructing a statement about a place nobody has been, out of measurements made somewhere else.

## Why the blank is worth attacking

A single empty cell sounds like a small problem until you follow it downstream. Three pieces of work stall on it, and they are the three pieces of work a correlated section exists to feed.

**A map stalls.** Contouring TOP_B needs a depth at every control point you intend to use. With three of four wells carrying the surface, the mapper has three control points across the area the four wells cover. Ekene-4 sits where it sits, and its part of the map is drawn by extrapolation from the other three or left blank. Either outcome is worse than having a value with a stated range on it, because the extrapolation the contouring package performs is an assumption nobody wrote down and nobody can inspect.

**A volume stalls.** Gross rock volume between two surfaces needs both surfaces over the whole area. If TOP_B is a bounding surface, the area around Ekene-4 either drops out of the volume or is filled by whatever the software does at the edge. A resource number computed that way carries an uncertainty nobody has quantified, and it is quoted as though it were as firm as the parts built on four wells.

**A well plan stalls.** The most direct cost of all. Somebody proposing to deepen Ekene-4, or to drill a new well near it, needs a prognosis: at roughly what depth should the crew expect TOP_B, and how much depth uncertainty should the casing design and the mud programme carry. That question cannot be answered with a blank. It also cannot be answered honestly with a single number, because the person who receives a single number will plan as though it were certain.

Notice what those three uses have in common. None of them wants a pick. All of them want a depth with a range attached and the method written beside it. That is what this tier produces.

## What a prediction is, and what it is not

The estimate you build here does not go into the tops table. That boundary was set at the Professional tier and it holds all the way up. Ekene-4's TOP_B slot stays blank, the correlation line on the section still stops after the third well, and the count of wells carrying all four tops stays at 3.

What you produce instead is a labelled estimate that travels with three things: the marker it was projected from, the wells it was derived from, and the range around it. Strip any of those and the estimate turns into a rumour. A depth quoted with no method behind it cannot be checked, cannot be updated when a fourth well arrives, and cannot be distinguished from something somebody measured.

## Why this is the top of the ladder

The arithmetic ahead is small. You will add a mean interval to a depth, twice, and subtract one result from the other. A learner from the Associate tier could do the arithmetic today.

What makes it the Expert tier is that the arithmetic is not the work. The work is knowing which assumption you just made, knowing what in the data argues against it, and reporting a number in a form that survives being read by somebody who was not in the room. The section grows, which the Professional tier measured: the TOP_A to TOP_SAND interval runs 48, 53, 46 and 60 m across the four wells, a growth range of 14 m. A section that grows is a section where the surfaces are not parallel, and a prediction built on non-parallel surfaces depends on which surface you leaned on. That dependence is the whole subject of this course from here on.

## Exercise

Write down the three things you would need to hand a drilling engineer who has asked, this afternoon, for a TOP_B prognosis in a deepening of Ekene-4. Do not compute anything. Then write down the one thing in the tops table that must not change as a result of your answer, and say what would break if it changed.

Self-check: the engineer needs a predicted depth, a range around it, and the basis of both, meaning the marker it was projected from and the wells it was derived from. A depth with no range invites a plan that treats it as certain, and a range with no basis cannot be revised when new data arrives. The thing that must not change is Ekene-4's TOP_B slot, which stays blank. If a predicted depth were typed into it, the count of wells carrying all four tops would rise from 3 to 4, every statistic on TOP_B would silently mix three observations with one inference, and the range, which is the most useful part of the estimate, would be discarded at the moment of entry.
