import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Associate m02, An Obligation's Status. Written from digest.txt
# SECTIONS 3 and 7 as the five lessons of this module teach them: nine statuses
# worst first, the lifecycle answering for itself, an expired permit above an
# overdue return, the earlier of two dates, and On track against Compliant.

q(1, "REG-2026-005, the radioactive source licence, is Active with a due date of 2026-12-31 and an expiry of 2026-09-30. What does it read at the as-of date of 2026-10-15?",
 "Expired, with a days until of -15.",
 ["Overdue, at -15.",
  "On track, counted to 2026-12-31.",
  "Due soon, counted to 2026-12-31."],
 "The next action date is the earlier of the due date and the expiry, here 2026-09-30. A passed expiry gives Expired, and explainStatus says \"The permit expired 15 days ago.\""),

q(3, "The digest varies REG-2026-005 one field at a time. Which single variant makes the licence read Overdue?",
 "The due date moved to 2026-10-01 with no expiry.",
 ["The expiry removed.",
  "The expiry moved out to 2027-09-30.",
  "The lifecycle set to Archived, a word the lifecycle list does not have."],
 "That variant reads Overdue at -14. Removing the expiry or moving it out leaves the licence On track, and Archived leaves it Expired at -15. A passed due date gives Overdue; a passed expiry gives Expired."),

q(2, "REG-2026-005 is given the lifecycle word Archived, which complianceStatus.LIFECYCLES does not hold. What does it read?",
 "Expired, at -15, the same as the licence as recorded.",
 ["Not applicable, because an unknown lifecycle is treated as one that does not bind the operator.",
  "Draft, the lifecycle a record falls back to until somebody sets it.",
  "A refusal naming Archived as unknown."],
 "Only Draft, Superseded and Not applicable switch the countdown off. A word outside the four leaves the dates in charge, and the passed expiry still gives Expired."),

q(0, "Set REG-2026-005's lifecycle to Superseded and change nothing else. It reads Superseded, and its days until still prints -15. Why is the count still printed?",
 "The expiry is still on the record, so the count is printed, and the status ignores it because the lifecycle is read first.",
 ["The engine reports how late the licence was at the moment it was superseded, for the audit trail.",
  "Superseded is ranked as a kind of Expired, and the count shows how far past expiry it is.",
  "The count is left over from before the change and will clear on the next save."],
 "The lifecycle is checked before any date. The lapsed expiry that makes the recorded licence the worst row does not decide this variant's status, and the date stays on the record."),

q(3, "REG-2026-001, the produced water discharge permit, has a due date of 2027-03-31 and an expiry of 2026-11-20. What status does it read at 2026-10-15, and which date drives it?",
 "Due soon, driven by the expiry of 2026-11-20.",
 ["On track, driven by 2027-03-31.",
  "Due soon, driven by 2027-03-31.",
  "Expired, driven by the expiry of 2026-11-20, because a permit with an expiry on the record reads Expired."],
 "The next action date is the earlier of the two dates, 2026-11-20, and it is inside the lead time recorded for the permit. The due date of 2027-03-31 is the same date REG-2026-004 counts to, and that row reads On track."),

q(1, "REG-2026-009, the original environmental impact approval, has a due date of 2025-01-06 and a days until of -647. Why does it not read Overdue?",
 "Its lifecycle is Superseded, so it is not tracked against a date.",
 ["Its due date is too far behind the as-of date to count, and the engine stops counting after a year.",
  "It is a One-off, and a passed One-off reads Compliant.",
  "A later expiry cancels the passed due date."],
 "explainStatus gives \"Lifecycle is Superseded, so it is not tracked against a date.\" The day count is still printed because the date is still on the record."),

q(2, "summarise prints an attention count of 5 for the IKORO register. Which statuses does that count add together?",
 "Expired, Overdue and Due soon.",
 ["Expired, Overdue and No date set.",
  "Expired and Overdue only.",
  "Due soon and On track."],
 "complianceStatus.ATTENTION_STATUSES holds Expired, Overdue and Due soon. At IKORO those counts are 1, 2 and 2, and the attention count is 5."),

q(0, "REG-2026-007 and REG-2026-002 are both Overdue. Why does byUrgency put REG-2026-007 above REG-2026-002?",
 "Its next action date, 2026-09-01, is the nearer of the two.",
 ["Its code sorts ahead of REG-2026-002 once the leading digits are read as a number.",
  "It is a One-off, and a One-off sorts ahead of a Monthly return with the same status.",
  "Its regime is Health & Safety, which the register ranks above Reporting."],
 "byUrgency sorts by the worst status first, then by the nearest next action date. REG-2026-007 carries 2026-09-01 and REG-2026-002 carries 2026-10-10."),

q(3, "REG-2026-007's next action date, 2026-09-01, is earlier than REG-2026-005's, 2026-09-30. Why does REG-2026-005 still sort first?",
 "Expired ranks above Overdue, and the status decides the order before the date does.",
 ["REG-2026-005 has the larger negative count, and the register sorts the most negative count to the top.",
  "Licences sort above notifications in the register, whatever their dates.",
  "REG-2026-007 has no filing, and an unfiled row sorts after a row that has one."],
 "In complianceStatus.STATUS_SEVERITY Expired is first and Overdue second. byUrgency reads the status first and uses the date only among rows with the same status."),

q(2, "REG-2026-003, the quarterly flare and venting return, was last filed 2026-07-28 and is due 2026-10-31. It reads On track. What does its reason say about that filing?",
 "It was for an earlier period, so nothing has been filed for this one yet.",
 ["It counts for the current period, and the return is On track until its next due date.",
  "It was filed late, so the return cannot read Compliant until the next period.",
  "It is too old to read, so the engine treats the return as never filed."],
 "The reason reads \"Due in 16 days. The last filing (2026-07-28) was for an earlier period, so nothing has been filed for this one yet.\" On track says there is time to do work that is still to do."),

q(0, "REG-2026-008, the host community development report, reads Compliant. What makes it Compliant where REG-2026-003 reads On track?",
 "Its last filing, 2026-08-05, falls inside the period it is in now.",
 ["Its due date is further ahead, and a row far enough from its due date reads Compliant.",
  "It is a Semi-annual obligation, and every Semi-annual row with a filing reads Compliant.",
  "Its lead time is not set, so it has no warning window to fall into."],
 "Compliant says the obligation has been met for the period it is in. REG-2026-003 has a filing too, but it belongs to an earlier period."),

q(1, "Which owner decision separates On track from Compliant?",
 "AS15 Q2: evidence counts towards Compliant only for the current period.",
 ["AS15 Q1: an unreadable today makes deriveStatus throw.",
  "AS15 Q2: any filing on the record counts towards Compliant, whenever it was made.",
  "No decision: the lead time alone decides, and a row outside its window reads Compliant."],
 "A filing made for last quarter says nothing about this quarter. Q1 is the unreadable today rule from module one, and a row outside its window with nothing filed for the period reads On track."),

q(3, "On track sits fourth in complianceStatus.STATUS_SEVERITY and Compliant fifth. What do the two IKORO On track rows have that the two Compliant rows do not?",
 "Nothing filed for the period they are in now.",
 ["A due date that has already passed.",
  "An expiry date on the record.",
  "A lifecycle other than Active."],
 "REG-2026-003 and REG-2026-004 each give the reason that the last filing was for an earlier period, so nothing has been filed for this one yet. REG-2026-008 was filed inside its period and REG-2026-006 is a filed One-off. All four are Active with no expiry, and only REG-2026-006's due date has passed."),

q(1, "The digest's variant sets REG-2026-005's lifecycle to Superseded. Of these summarise counts, which one would lose the licence?",
 "Expired",
 ["Overdue",
  "No date set",
  "Not applicable"],
 "As recorded the licence is the one Expired row. With the lifecycle Superseded it reads Superseded, so it leaves the Expired count and joins the Superseded one."),

q(0, "complianceStatus.LIFECYCLES holds four words. Which of them leaves an obligation counted down against its dates?",
 "Active",
 ["Draft",
  "Superseded",
  "Not applicable"],
 "For Draft, Superseded and Not applicable the lifecycle is the status, and explainStatus says the record is not tracked against a date. An Active obligation is counted down."),
emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/beginner/cqb_m02.json', expect_n=15)
finish()
