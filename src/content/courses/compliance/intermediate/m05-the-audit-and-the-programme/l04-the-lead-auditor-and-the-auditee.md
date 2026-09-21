# The lead auditor and the auditee

An audit is worth something only if the person judging the work is independent of it. The auditManagement module checks this with auditIndependence, which reads the lead auditor against the auditee and refuses when they are the same person. This course owns the rule, and this lesson reads it in the Audit & Findings Manager.

{{panel:compliance-plan-explorer}}

## The three rows

| lead auditor | auditee | auditIndependence |
| --- | --- | --- |
| u-kelechi | u-boma | ALLOWED |
| u-boma | u-boma | REFUSED |
| an external lead auditor named in text, with no account | | ALLOWED |

When u-boma is named as both, the engine refuses:

"The lead auditor is also the auditee for this audit. An auditor may not audit their own area: name somebody else as one or the other."

The refusal gives the instruction and leaves the choice open. The audit can keep its lead auditor and name a different auditee, or keep its auditee and name a different lead. Either change restores independence, and the engine does not say which one to make.

## What the check compares

The check compares people. u-kelechi and u-boma are two accounts, and the engine allows the pairing. Named as both roles, u-boma is one account on both sides of the audit, and the engine refuses.

This lesson's third row names one in text, with no account, and the engine answers ALLOWED. An external auditor has no area inside the organisation to audit, so there is nothing for the check to find.

## Somebody has to lead

Independence is one half of the lead auditor rule. The other half is that there must be one. Lesson two read it on the reporting gate: the same audit with no lead auditor named at all is refused with "Name the lead auditor." A report with nobody leading it is nobody's report, and an audit with nobody in the role cannot be tested for independence at all.

## Why "own area" is the phrase

The refusal speaks of an auditor's own area. The phrase matters on a site like the Abam tie-in. The person who runs the contractor's permit to work system is the natural auditee for a question such as item 1, permit to work displayed at the work site. The same person leading the audit would be marking their own work, and a Conformant answer from them proves nothing to anyone reading the report later. Naming a different lead is what makes the answer worth reading.

## Where the rule goes further

This lesson reads the one pairing the audit record carries: lead auditor against auditee. The Expert tier takes the rule into the ISO clause register, where every examiner who records a result on a clause is checked for independence, and where a lead auditor is read against every clause in the audit's scope. Those checks read different records and belong to that tier.

The segregation of duties rules for approving a management of change, or a peer review, are a different family of rules. They belong to the sibling course Risk, Change & Learning, and this course does not teach them.

## Exercise

Read the three auditIndependence rows. Say what the readings show about what the check compares, why the first row is ALLOWED and the second REFUSED, and why an external lead auditor with no account passes. Then read the reporting row with no lead auditor named, and say what the two rules together require of every reported audit.
