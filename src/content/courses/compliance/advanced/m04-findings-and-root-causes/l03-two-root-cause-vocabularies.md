# Two root cause vocabularies

Lesson 2 showed a Major nonconformity refused until its root cause is recorded. A root cause is recorded against a category, chosen from a frozen list. This course's apps carry two such lists, and they are different. This lesson reads both, as the engines ship them.

{{panel:compliance-readiness-explorer}}

## The ISO list

isoCompliance.ROOT_CAUSE_CATEGORIES holds 10 categories:

Procedure or documentation, Human factors or competence, Design, Material or equipment, Supplier or subcontractor, Planning or scheduling, Communication, Measurement or monitoring, Management system, Other.

The engine also prints that auditManagement.ROOT_CAUSE_CATEGORIES is the same list object as isoCompliance's: true. The Audit & Findings Manager and the ISO register do not hold two copies that could drift apart. They hold one list.

## The quality list

qualityAssurance.ROOT_CAUSE_CATEGORIES holds 9 categories:

Procedure or documentation, Human factors or competence, Design, Material or equipment, Supplier or subcontractor, Planning or scheduling, Communication, Measurement or inspection, Other.

This is the list the Professional tier's NCRs are recorded against.

## Where the lists differ

The engine prints the difference directly:

- only in the ISO list: Measurement or monitoring, Management system;
- only in the quality list: Measurement or inspection.

Each difference fits the work its list serves. An NCR in an inspection and test plan comes from an inspection of an item, so its measurement category is Measurement or inspection. A finding against a management system clause can be caused by the system itself, so the ISO list carries Management system, and its measurement category is Measurement or monitoring, the words of the clause family that monitors performance.

## Reading across the two

A reader comparing root causes across the quality app and the ISO register meets two different words for measurement. A cause recorded as Measurement or inspection on an NCR and one recorded as Measurement or monitoring on a finding are two categories, drawn from two lists. Do not count them together as one category, and do not force one list's words onto the other app's records. Quote each category in the words of the list it came from.

The Management system category has no counterpart in the quality list at all. An NCR cannot be recorded against it.

## Shared functions

The engine reports two more identities between the modules:

- auditManagement.canCloseFinding is the same function as isoCompliance's: true;
- isoCompliance.isActionOverdue is the same function as qualityAssurance.isCapaOverdue: true.

So a finding in the Audit & Findings Manager closes by the same rule as a finding in the ISO register, the walk of lesson 2. And an action is overdue by the same rule whether it sits on an NCR or on a finding. Where the apps share a function, a learner who has read one has read both.

## Where the causes go next

A root cause recorded here can also feed a risk register or a lesson learned. Both of those belong to the sibling course riskchange, "Risk, Change & Learning".

## Exercise

Read the two lists this lesson prints. Name the categories that appear only in the ISO list and the one that appears only in the quality list. Then say which of the two lists a Major nonconformity in the Audit & Findings Manager is recorded against, citing the line above that tells you, and why that answer does not need a separate lesson for that app.
