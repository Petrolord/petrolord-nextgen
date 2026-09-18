# The disposition comes first

An NCR has two jobs. It decides what happens to the item that does not conform, and it deals with why the item came to be that way. canCloseNcr asks about the item first. Until the disposition is agreed and dated, nothing else about the NCR is read.

{{panel:compliance-plan-explorer}}

## Seven dispositions

The qualityAssurance module's list of dispositions has seven entries: Use as is, Repair, Rework, Regrade, Reject, Return to supplier and Scrap. Asked to close a Major NCR with nothing recorded, the engine refuses with a sentence that recites the list:

"Agree the disposition first: what happens to the non-conforming item. Use as is, repair, rework, regrade, reject, return to supplier or scrap."

Record a disposition, Repair, and the engine refuses again:

"Record the date the disposition was agreed."

A disposition is a decision, and like every decision in this tier it carries its date. Only with both on the record does the gate move on to the cause, which lesson two reads.

## The ABAM NCRs and their dispositions

At the as-of date 2026-10-15 the six ABAM NCRs read:

| code | severity | status | disposition |
| --- | --- | --- | --- |
| NCR-2026-031 | Major | Actions in progress | Repair |
| NCR-2026-027 | Minor | Open | none |
| NCR-2026-019 | Critical | Disposition agreed | Return to supplier |
| NCR-2026-022 | Observation | Closed | Use as is |
| NCR-2026-011 | Major | Voided | none |
| NCR-2026-006 | Minor | Closed | Regrade |

NCR-2026-027, coating thickness below specification on spool S-14, has no disposition. Asked to close it, the engine gives the first refusal above word for word. It is a Minor NCR, and the disposition rule applies to it all the same. Lesson two shows the steps that change with severity. This one does not.

NCR-2026-019, the wrong flange rating delivered, reads Disposition agreed with the disposition Return to supplier. Its status word says what the record shows: the item's fate is settled while the NCR itself is still open.

## Concessions

Two dispositions keep a non-conforming item in use. The module's CONCESSION_DISPOSITIONS list holds Use as is and Regrade. A concession accepts the item as it stands, or at a lower grade, where the other five dispositions change it, send it back or remove it.

The NCR summarise at the as-of date prints concessions 2. The two ABAM NCRs whose disposition is on that list are NCR-2026-022, bolt torque record missing, Use as is, and NCR-2026-006, gate valve body casting porosity, Regrade. Both are Closed, and the count keeps them. A concession is worth counting after closure because it is the NCR outcome that leaves a known departure from specification in service.

## Why the item comes before the cause

The item is physical and it is on site now. A spool with thin coating or a flange of the wrong rating has to be held, fixed or sent away before anyone can build on it, whatever the root cause turns out to be. The engine's order puts that decision first. Its later refusal on a Major NCR states the split in one line: "A disposition deals with the item; a corrective action deals with the cause."

## Exercise

Read the disposition column of the NCR table and the summarise figure concessions 2. Name the two NCRs the figure counts and their statuses. Then read NCR-2026-027's row and its closure refusal. Say what the readings show about whether a concession stops being counted once its NCR is closed, and what a Minor NCR with no disposition is told first.
