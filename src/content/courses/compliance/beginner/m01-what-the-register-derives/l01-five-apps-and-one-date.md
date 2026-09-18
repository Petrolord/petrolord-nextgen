# Five apps and one date

This course is about five applications that keep an operator honest with its regulators, its certification body and itself. Each of them holds dated records. None of them lets anybody type a status. Every status, count, age and verdict you will see in them is derived from a dated record read against one stated as-of date, and every gate in them refuses until the evidence, the date and the named person it asks for are on the record.

## The five apps and the modules behind them

Each app is backed by one engine module, and a sixth module, the calendar, sits under all of them.

| app | engine module | what it holds |
| --- | --- | --- |
| Regulatory Compliance | complianceStatus | permits, returns, licences and notifications, each with its dates |
| Document Control | documentControl | controlled documents, their revisions and their review dates |
| Quality Assurance Plan & NCR | qualityAssurance | inspection and test plans and the non-conformances raised against them |
| Audit & Findings Manager | auditManagement | audits, checklists, findings and audit programmes |
| ISO Compliance | isoCompliance | a clause register for a standard, its audits and its findings |

The digest this course is built on measures each module directly. It counts what the module exports and how many of those exports read a date against the as-of date:

| module | exported functions | exported lists and constants | exports that read a date against today |
| --- | --- | --- | --- |
| calendar | 5 | 1 | 1 |
| complianceStatus | 11 | 8 | 4 |
| documentControl | 14 | 7 | 4 |
| qualityAssurance | 28 | 24 | 7 |
| isoCompliance | 34 | 25 | 10 |
| auditManagement | 33 | 20 | 4 |

Read the last column carefully. Every module has at least one export whose answer depends on the date it is given. That is the reason this course keeps naming a date.

## A vocabulary is a frozen list

Each module owns its words as a frozen list, and a status in these apps is always one of those words, spelled and capitalised the way the list spells it. complianceStatus.STATUS_SEVERITY holds the nine statuses an obligation can carry. documentControl holds the review states, from Review overdue down to Not in force. qualityAssurance holds the five point types of an inspection plan. isoCompliance holds the clause statuses. When this course quotes one of those words it quotes it exactly, with its capital letter, because two words that sound alike can be two different statuses. On track and Compliant are the plainest example, and a whole lesson in module two is about the difference.

## One date for everything

The digest is built at one as-of date, 2026-10-15. Every day count, every status and every overdue flag in it is true at 2026-10-15 and at no other date. Move the date and the same record reads differently, with nobody having edited it. That is what "derived" means here, and it is the first thing to hold on to.

## The three cases

The course reads three invented records, one to a tier. IKORO is a terminal's obligation register and document library, and it is this tier's case. ABAM is a flowline tie-in quality plan with its NCRs and audits, and it belongs to the next tier. ORASHI is an ISO 14001:2015 management system, and it belongs to the tier after that.

This tier owns the register and the calendar: what a date is, how an obligation's status is derived, when a warning starts, which period a filing counts for, how the schedule rolls forward, and when a controlled document is due for review.

## Exercise

Using the export table above, name the module with the most exports that read a date against today and the module with the fewest, quoting both figures. Then say what the as-of date of 2026-10-15 has to do with every one of those exports, and what would happen to their answers if the date were moved.
