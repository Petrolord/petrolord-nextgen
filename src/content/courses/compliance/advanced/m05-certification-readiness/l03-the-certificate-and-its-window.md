# The certificate and its window

The last item on the ORASHI readiness list is the certificate. It expires 2027-01-08, and at the as-of date 2026-10-15 the engine prints certificateDays 85 and the watch item "The certificate expires in 85 days. Book the recertification audit before then." This lesson moves the expiry, and nothing else, to read the item at its edges.

{{panel:compliance-readiness-explorer}}

## The lead window

isoCompliance.CERTIFICATE_LEAD_DAYS is 90. The engine derives two flags from certificateDays: certificateExpiring, for a certificate inside the lead window, and certificateExpired, for one past its expiry. At 85 days the ORASHI record reads certificateExpiring true and certificateExpired false.

## The edges

| certificate expires | certificateDays | certificateExpiring | certificateExpired | certificate item listed |
| --- | --- | --- | --- | --- |
| 2026-10-14 | -1 | false | true | serious |
| 2026-10-15 | 0 | true | false | watch |
| 2027-01-13 | 90 | true | false | watch |
| 2027-01-14 | 91 | false | false | none |
| tbc | null | false | false | none |
| null | null | false | false | none |

Read the rows from the bottom of the window. At 91 days there is no certificate item on the list. At 90 days the watch item appears, in the same words as at 85 with its own count. At 0 days, the expiry date itself, the watch item reads: "The certificate expires today. Book the recertification audit now." The "today" in that sentence is the as-of date the engine was given, 2026-10-15.

At -1 the item changes severity and words:

"The certificate expired 1 day ago. The organization cannot claim certification, and a surveillance audit is no longer possible: it needs a recertification audit."

## Two flags, never together

Owner decision AS15 Q6 states the policy: an expired certificate is a serious readiness item, one inside the lead window a watch item. Rule R3 in SECTION 23 states how the flags carry it: expired and expiring are two separate flags. A certificate with certificateDays -15 reads certificateExpiring false and certificateExpired true. In every row of the edge table, at most one of the two reads true.

That matters to anybody reading the flags directly. A dashboard that tested certificateExpiring alone would show nothing for an expired certificate. Read both flags, or read the list, which already does.

## An unreadable expiry

The last two rows are the limit of the rule. An expiry recorded as the text tbc, and an expiry recorded as null, both give certificateDays null, both flags false, and no item at all. The list does not warn about a certificate whose expiry it cannot read. An empty list line here means the date is missing, and a reader has to know that.

## One item among the others

The certificate item sits among ten others. At 91 days it leaves the list, and the other items stay. The lab prints the item column for each moved expiry and does not print ready for those rows, so this course states only the item. The certificate is read the way every other record in this tier is read: a dated field, one as-of date, and a derived item. A certificate that has months to run removes one line from the list and leaves every other line where it was. Booking the recertification audit does not close an open Major nonconformity.

## Exercise

Read the six rows of the edge table. For each, give certificateDays, the two flags and the item listed. Say at which row the item first appears, where it changes severity, and where it disappears. Then say what the last two rows tell you about a certificate whose expiry is missing from the record, and why reading certificateExpiring alone would mislead at 2026-10-14.
