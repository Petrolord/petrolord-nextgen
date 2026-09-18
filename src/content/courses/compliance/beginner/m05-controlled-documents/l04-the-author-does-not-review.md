# The author does not review

A review exists to put a second pair of eyes on a document. If the person who wrote a revision can also review it, the review adds nothing. Document Control enforces that rule itself, and it enforces it at both ends: when a reviewer is assigned and when a review task is decided.

## The rule

The owner decision behind it is AS15 D1: a document review task is decided only by its assigned reviewer, never by the author.

## Seven requests, one revision

The digest takes revision rev-0019-10 of ENG-PRO-0019, the hydrotest procedure. The document's status is In Review, its current revision is '09' and its next revision is '10'. The revision is authored by u-adaeze, and the digest puts seven requests to the engine. Each answer is ALLOWED or a refusal, and each refusal is quoted exactly as the engine gives it:

| request | answer |
| --- | --- |
| the author assigns herself | REFUSED: The author of a revision cannot review it. Choose somebody independent of the draft. |
| no reviewer chosen | REFUSED: Choose the reviewer. |
| an independent reviewer is assigned | ALLOWED |
| the assigned reviewer decides a pending task | ALLOWED |
| somebody else decides it for the reviewer | REFUSED: Only the reviewer this task is assigned to can decide it. |
| the author was assigned by mistake and tries to decide | REFUSED: The author of a revision cannot approve it. |
| a task already approved is decided again | REFUSED: This review task is already approved. |

{{panel:compliance-register-explorer}}

## Reading the refusals

The first two refusals are at assignment. The author cannot be the reviewer, and there has to be a reviewer. Assigning an independent reviewer is allowed.

Notice what the gate compares. It needs two named people on the record: the author of the revision, u-adaeze here, and the reviewer on the task. That is why "Choose the reviewer." comes before anything else can be decided. With nobody named there is nobody to check against the author, and the engine will not treat an empty field as independent.

The next three rows are at decision. The reviewer the task is assigned to may decide it. Nobody else may decide on the reviewer's behalf, however senior, and the refusal says so: "Only the reviewer this task is assigned to can decide it."

The sixth row is the one that shows why the rule is checked twice. Suppose the author was assigned as reviewer by mistake, through a slip at assignment. The decision check still refuses: "The author of a revision cannot approve it." A mistake at assignment does not become an approval, because the decision is checked against the author as well.

The last row closes the loop. A task already approved cannot be decided again, so an approval on the record stays the approval that was given.

## Why the rule is a gate

A rule that says the author should not review, written in a procedure, is a rule that holds until the week everybody is busy. A gate in the engine holds every week. It also makes the record honest: a document shown as reviewed in Document Control has been reviewed by somebody other than its author, and nobody has to take that on trust.

This is the same principle of independence that the next two tiers meet in audits, where an auditor may not audit their own area. The approval rules for management of change and for peer review belong to the sibling course, Risk, Change & Learning, and are taught there.

## Exercise

Read the seven requests and their answers. Name the two refusals that concern the author, and say at which step each one is checked. Then say why checking at the decision as well as at assignment matters, using the row where the author was assigned by mistake.
