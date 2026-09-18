# Three independence rules in three apps

Independence is not only an ISO rule in this course. Three of the five apps check that a person does not pass judgement on their own work, and each checks it against a different name on the record. The digest says so in SECTION 19: the Audit & Findings Manager checks the lead auditor against the auditee, and Document Control checks a reviewer against the author. This lesson lays the three side by side.

{{panel:compliance-readiness-explorer}}

## The ISO register: the auditor against the clause owner

You read this rule in lessons 1 and 2. The isoCompliance module compares the lead auditor with the owner of every clause in the audit's scope, and compares each examiner with the owner of the clause they record. The name it reads is the clause owner held in the register. Its refusal cites ISO 19011.

## The Audit & Findings Manager: the lead auditor against the auditee

The Professional tier read the auditManagement module's auditIndependence rule. There is no clause register in that app. An audit names a lead auditor and an auditee, and the rule compares those two names:

- u-kelechi leads and u-boma is audited: ALLOWED.
- u-boma named as both: REFUSED.
- an external lead auditor named in text, with no account: ALLOWED.

The refusal, verbatim:

REFUSED: The lead auditor is also the auditee for this audit. An auditor may not audit their own area: name somebody else as one or the other.

The word here is "area". The auditee is the area being audited, and the rule reads one person against one person.

## Document Control: the reviewer against the author

The Associate tier read documentControl's rule on revision rev-0019-10, authored by u-adaeze. When the author is assigned as reviewer, the engine refuses:

REFUSED: The author of a revision cannot review it. Choose somebody independent of the draft.

When the author was assigned by mistake and tries to decide the task, it refuses again: "The author of a revision cannot approve it." Owner decision AS15 D1 states the rule: a document review task is decided only by its assigned reviewer, never by the author.

## The three side by side

| app | the judge | the name checked against |
| --- | --- | --- |
| ISO register | lead auditor, and each examiner | the owner of each clause in scope |
| Audit & Findings Manager | lead auditor | the auditee |
| Document Control | reviewer | the author of the revision |

The principle is one sentence: nobody passes judgement on their own work. What differs is where the engine finds the person's own work. In the ISO register it is a clause ownership, so the check can name several clauses. In the Audit & Findings Manager it is a single named auditee. In Document Control it is the author of one revision.

Each rule compares two names its own record holds. The ISO register compares the examiner with the clause owner, the Audit & Findings Manager compares the lead auditor with the auditee, and Document Control compares the reviewer with the author of the revision. SECTION 19 prints the first comparison, and it points to SECTION 16 and SECTION 8 for the other two.

## Where the principle continues

The Management of Change and Peer Review apps carry their own segregation of duties rules for approvals. Those belong to the sibling course riskchange, "Risk, Change & Learning", and this course does not teach them.

## Exercise

Read the three refusals in this lesson: the ISO lead auditor refusal for u-kalu from lesson 1, the auditIndependence refusal for u-boma, and the Document Control refusal for u-adaeze. For each, name the person refused and the name on the record they were checked against. Then say why only the ISO refusal can list more than one item, using the words each app's record holds.
