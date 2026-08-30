# The offset you did not plot

The well that was not in the scan.

## The failure

Every anti-collision calculation in this course compares a reference against a NAMED offset. The scan is only as complete as the list of offsets it was given.

A well that is not in the database, or is in it under a name nobody searched, or was excluded because it is plugged, or is a sidetrack recorded as part of its parent, is not in the scan, and its absence produces no warning at all.

## Where the missing wells come from

**Old wells.** Fields drilled before digital records have wells whose surveys exist on paper or not at all.

**Abandoned wells.** A plugged well is still a hole with steel in it. Some databases filter them out of scans by default.

**Sidetracks.** A well with several sidetracks may be recorded as one entity with one survey, and the abandoned original legs are physically there and not in the record.

**Wells belonging to somebody else.** A field boundary is not a barrier. Clearing against a neighbouring operator's wells requires their data, and the exchange is a commercial and legal process as well as a technical one.

**Shallow hazards that are not wells.** Pipelines, anchors, previous conductor stubs, and shallow gas. Same geometry, different object, and usually a different data source.

## The search radius question

Scans are usually run against every well within some horizontal distance of the plan. That radius is a choice.

Too small and a well that crosses at depth is missed, because at surface it was far away. Too large and the scan returns hundreds of wells and the real conflicts are buried.

The defensible approach is to scan wide and filter by separation factor rather than by distance, since the factor is what the decision is made on.

## The plan versus the definitive survey

For a well that has not been drilled yet, or for one whose survey was never digitised, the position is the PLAN.

A plan is where somebody intended the well to go. The difference between plan and actual is routinely tens of metres and occasionally much more.

Clearing against a plan and recording that as cleared is an overstatement. Where it cannot be avoided, the honest treatment is a much larger uncertainty for that offset, which is exactly what an error model with a poor parameter set produces.

## The uncertainty of an old well

An offset drilled in 1975 with a single-shot magnetic survey every 150 m, computed with the tangential method, has a position uncertainty far larger than the model in the Professional tier gives for a modern MWD run.

Using a modern parameter set for it is optimistic by a large factor, and the industry maintains parameter sets for historical tools for exactly this reason.

## What to do

**Ask what was scanned.** A separation factor without a list of offsets is a partial answer.

**Ask where each offset's position came from.** Definitive survey, plan, or paper record.

**Ask which parameter set was used for each.** A 1975 well cleared with a 2020 parameter set is not cleared.

**Plot everything.** A plan view with every well in the search radius drawn on it is the cheapest check there is.

## The misconception to avoid

"The scan came back clear." The scan came back clear against the wells it was given, with the positions and uncertainties it was given for them. All three are inputs, all three are frequently wrong, and none of them produces a warning when it is.

## Exercise

You are handed an anti-collision report showing a minimum separation factor of 2.4 against three offsets.

Write the five questions you would ask before signing it, and for each, say what answer would make you reject the report.
