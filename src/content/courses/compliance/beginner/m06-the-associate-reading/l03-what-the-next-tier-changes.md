# What the next tier changes

This tier has been about the register and the calendar. You have read dates as days, refused dates that are no date, and watched one as-of date turn a register of obligations and a library of documents into statuses, warnings and a queue. The next tier keeps all of that and changes what the records are.

## What carries forward

Three things you have learned here stay true in every app this course teaches.

The as-of date is an input. Every age, every overdue flag and every status in the next tier is read against a stated date, and a figure without its date is not a figure you can use.

A status is derived. Nobody types Overdue, Due soon or Review overdue onto a record. The engine reads the dated record and says what state it is in.

A gate refuses until the record is complete. In Document Control you saw this with the reviewer: the engine asked for a named reviewer who was somebody other than the author, and it refused until it had one. The next tier is full of gates of that kind, and each one asks for evidence, a date or a named person.

## What the next tier reads

The Professional tier moves from the register to the work site. Its case is ABAM, a flowline tie-in with a quality plan, the NCRs raised against it, a contractor HSE audit and an audit programme. Three apps are in play.

The Quality Assurance Plan & NCR app holds an inspection and test plan. Each point on the plan has a type, and qualityAssurance.POINT_TYPES lists them: Hold point, Witness point, Review point, Monitor point and Surveillance point. One of them is special. qualityAssurance.BLOCKING_POINT_TYPES holds Hold point alone, because a hold point stops work until it is released. Progress on a plan is counted from its points, and the plan's closure is a gate.

The same app holds non-conformances. Each carries a severity from qualityAssurance.NCR_SEVERITIES, Critical, Major, Minor or Observation, and a disposition that says what happens to the non-conforming item. How long an NCR has been open is an age, and an age is read against the as-of date exactly as a days until is.

The Audit & Findings Manager holds audits, their checklists and their findings. A checklist answer is one of auditManagement.ANSWERED_RESULTS: Conformant, Nonconformant, Observation or Not applicable. An audit moves through a lifecycle, and an audit programme is delivered by the audits in it.

## What stays in this course and what goes elsewhere

Independence runs through the next two tiers. You met it here as the rule that the author does not review. There it becomes the rule that an auditor does not audit their own area. Risk scores and heat maps, and the approval rules for management of change, belong to the sibling course, Risk, Change & Learning.

## Exercise

Name the three ideas this tier says carry forward into the next one, and for each, give the example from this tier that showed it: a figure read against 2026-10-15, a status the engine derived, and a refusal from Document Control quoted exactly as the engine gives it.
