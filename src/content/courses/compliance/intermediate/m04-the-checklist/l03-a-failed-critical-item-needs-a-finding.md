# A failed critical item needs a finding

Each question on a checklist carries a criticality: Critical, Major or Minor. When a Critical question is answered Nonconformant, the answer is not enough on its own. The engine asks for a finding raised from it, a record with a number, an owner and a due date that can be tracked to closure.

{{panel:compliance-plan-explorer}}

## The critical questions on AUD-2026-007

At the as-of date 2026-10-15:

| item | question | result | note |
| --- | --- | --- | --- |
| 1 | Permit to work displayed at the work site | Conformant | none |
| 2 | Gas test recorded before hot work | Nonconformant | No gas test entry for the 07:30 hot work. |
| 6 | Isolation certificate matches the tie-in point | Nonconformant | Isolation certificate names valve XV-102, tie-in is at XV-103. |
| 11 | Confined space entry attendant present | Not applicable | none |

Items 2 and 6 are the critical questions that failed. Each note records what the auditor saw, and each is the start of a finding. Item 1 conformed, and item 11 reads Not applicable with no note, so it is still unanswered and lesson one of this module covers it. Neither of those two asks for a finding.

## The critical answers still waiting

criticalAnswersWithoutFindings lists the critical questions answered Nonconformant that no finding covers. With finding AF-2026-018 raised from item 2, it lists 6. Item 2 is covered and item 6 is not.

With that finding Voided, it lists 2 and 6. A voided finding covers nothing. Voiding AF-2026-018 puts item 2 back on the list beside item 6, and the question counts as uncovered exactly as though no finding had been raised from it.

## Where the rule bites

The reporting gate reads the same list. In the digest's walk of canReportAudit, once every item is answered and items 10 and 11 have their reasons, the engine refuses:

"Critical item 6 was answered Nonconformant with no finding raised. A critical question that fails needs a finding with a number, an owner and a due date."

The refusal names item 6 because item 2 is already covered by AF-2026-018. Raise a finding from item 6 as well and the walk moves on to its next requirement, the audit conclusion, which module five reads.

## What a finding needs

A finding is not raised by ticking a box. canRaiseFinding refuses until the record carries three things:

| missing | canRaiseFinding |
| --- | --- |
| the finding type | REFUSED: Pick the finding type. |
| a one-line statement | REFUSED: State the finding in one line. |
| objective evidence | REFUSED |

The evidence refusal in full:

"Objective evidence: what was seen, where, and when. It is the first thing an auditee will ask for."

The notes on items 2 and 6 are that kind of evidence. "No gas test entry for the 07:30 hot work." says what was missing and when. The note on item 6 names the valve on the certificate and the valve at the tie-in. A finding built on either note can be tested by the auditee against the site record, which is exactly what the refusal expects.

## Why only critical questions

The rule is about Critical questions. Item 4, lifting plan approved for the tie-in lift, is Major and reads Observation, and it appears on no list of critical answers. The digest prints no reporting refusal for a Major or Minor question answered Nonconformant, and AUD-2026-007 has none, so this lesson does not say what the engine asks of one. What it prints is the Critical rule: a critical question that fails does not leave the checklist without a tracked finding.

## Exercise

Read the two criticalAnswersWithoutFindings lines: with AF-2026-018 raised from item 2 it lists 6, and with that finding Voided it lists 2 and 6. Say what the pair shows about whether a voided finding covers the question it was raised from, and why the reporting refusal names item 6 alone.
