import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Professional m06, the professional reading.
# Every row, count and order is the ESANMI register of digest Section 12, read
# on the as-of date 2026-10-01, with the rules of Sections 7 to 11 behind them.
# No question states, implies or lets a reader derive a capstone condition or
# graded value; the capstone lesson is examined for its habits only.

q(3, "Which changes does the total count in the ESANMI summary take in on 2026-10-01?",
 "Every row, whatever its stage.",
 ["The live changes only, since finished changes are locked and leave the summary.",
  "Every change that has reached the facility, in \"Implementation\" or the Closed stage.",
  "The active changes plus those whose expiry state is \"Closed out\"."],
 "Total counts every row, including the four finished changes ES-06, ES-07, ES-09 and ES-11. Active, a different count, reads 8.")

q(0, "Which change does byUrgency put first on 2026-10-01, and why?",
 "ES-03, the one change that reads \"Expired\", because expired changes rank first.",
 ["ES-08, the one change that reads overdue on its target date.",
  "ES-05, because its ratification is overdue.",
  "ES-12, because its due date is null."],
 "byUrgency ranks expired changes first, then expiring soon, then overdue, then other live work, then everything finished. ES-03's expiry of 2026-09-28 is behind the as-of date.")

q(2, "In byUrgency on 2026-10-01, ES-05 comes before ES-02. What decides that?",
 "Both read \"Expiring soon\", and ES-05's expiry, 2026-10-10, is earlier than ES-02's, 2026-10-14.",
 ["ES-05 is an Emergency change, and within any one rank Emergency changes come before Temporary ones.",
  "ES-05 reads \"Ratification overdue\", and an overdue ratification outranks an expiry on the list.",
  "ES-05's target date is earlier, 2026-09-20 against 2026-09-26."],
 "Within a rank the earlier expiry or target date comes first. ES-02's target is also 2026-09-20, so a reader who sorted on the target could not separate them.")

q(1, "ES-08 is the one change that reads overdue in the ESANMI register on 2026-10-01. Why ES-08?",
 "It is in \"Review\", before the facility, and its target date of 2026-09-25 has passed.",
 ["It is the one change whose actions are overdue on that date.",
  "It has the earliest target date of any live change in the register on 2026-10-01.",
  "It is in \"Review\" and its expiry date has passed."],
 "The overdue flag on a change is read against its target date and only in \"Draft\", \"Screening\", \"Review\" and \"Approval\". ES-08 is a Permanent change and carries no expiry.")

q(3, "awaitingApproval reads 1 on 2026-10-01, although ES-01 carries two Pending approval rows. Why 1?",
 "It counts changes whose stage is \"Approval\".",
 ["It counts approval levels that are still outstanding, and ES-01 has one level left to sign.",
  "It counts Pending rows, and one of ES-01's two rows is left out because it was delegated.",
  "It counts the changes carrying a Pending row, less the changes already in Implementation."],
 "awaitingApproval counts changes whose STAGE is Approval, so ES-01 counts once. ES-01's levels 2 and 3 are the ones the gate reports unsigned.")

q(0, "The ESANMI counts by risk level read \"Low\" 2, \"Medium\" 4, \"High\" 4, \"Critical\" 2. Which two changes are the \"Critical\" pair?",
 "ES-04 and ES-12, both Emergency changes in \"Implementation\".",
 ["ES-03 and ES-05, the two changes most urgent on 2026-10-01.",
  "ES-05 and ES-12, the two changes whose ratification reads overdue on 2026-10-01.",
  "ES-01 and ES-02, the two changes that head the stage order of the register."],
 "Every row counts by risk level, finished changes included. ES-05 carries \"High\" and ES-03 \"Medium\", so urgency and risk level are separate readings.")

q(1, "expiringSoon reads 2 on 2026-10-01. Which two changes are behind it?",
 "ES-02 and ES-05.",
 ["ES-02 and ES-04, the two in-effect changes with expiries still ahead.",
  "ES-02 and ES-10, whose expiries fall within 14 days of 2026-10-01.",
  "ES-05 alone."],
 "ES-02 expires 2026-10-14 and ES-05 2026-10-10, both inside the lead of 14 days counted inclusively. ES-04's expiry of 2026-11-29 reads \"Within expiry\", and ES-10 is in \"Screening\".")

q(2, "ES-11 is \"Rejected\". Which reading does it give on 2026-10-01?",
 "\"Permanent change\" and \"Not required\", overdue no, and no open actions.",
 ["\"No expiry\", overdue yes, since its target of 2026-09-01 has passed.",
  "\"Permanent change\", overdue yes, and \"Not required\".",
  "\"Permanent change\" and \"Not required\", overdue no, with any Open action on it still counted as open work."],
 "ES-11 is terminal and never in effect. A probe puts an Open action due 2026-09-26 on it and reads openActions 0, overdueActions 0.")

q(3, "ES-01 and ES-12 both show a null ratification due date. What does each null mean on 2026-10-01?",
 "ES-01 needs no window; ES-12's window cannot be counted.",
 ["Both mean no window has started, so both read \"Not required\" until a date is recorded.",
  "Both mean the change is overdue for ratification, since neither can show a window open.",
  "ES-01 is awaiting ratification and ES-12 has been ratified, so neither has a date left."],
 "ES-01 is Permanent and reads \"Not required\". ES-12 is an Emergency change with no implementation date and reads \"Ratification overdue\". Always read the null beside the state.")

q(0, "Where do the four finished changes sit in byUrgency on 2026-10-01?",
 "Last: ES-07, ES-09, ES-06 and ES-11, after every live change.",
 ["First, since finished changes need closing out.",
  "Mixed in by their target dates.",
  "Left out of the order entirely."],
 "The order is ES-03, ES-05, ES-02, ES-08, ES-10, ES-01, ES-04, ES-12, ES-07, ES-09, ES-06, ES-11. Everything finished comes after the other live work.")

q(1, "ratificationPending reads 1 on 2026-10-01. Which change is it, and what is its due date?",
 "ES-04, whose window runs to 2026-10-03.",
 ["ES-05, \"Awaiting ratification\", due 2026-09-27.",
  "ES-12, \"Awaiting ratification\", with no due date because none was recorded.",
  "ES-04, \"Ratified\"."],
 "ES-04's due date is after the as-of date, so its window is open. ES-05 is past its due date and ES-12 has none; they make ratificationOverdue 2.")

q(2, "Before reading a change register, what does the capstone lesson say to write down first?",
 "The as-of date, because every dated state is true on one date.",
 ["The number of changes in the register, so each count can be checked against the total.",
  "The type of every change, since the type decides every state.",
  "The machine clock's date, which the engine reads by default."],
 "Every expiry state, ratification state and overdue flag is true on one date. The engines default to the machine clock, so the stated date is what makes an answer checkable.")

q(3, "The capstone lesson's check for an open action runs in an order. Which order does it give?",
 "Skip finished statuses, skip terminal changes, keep unknown changes, then test the due date.",
 ["Test the due date first, then skip anything more than 14 days past the as-of date, then skip Cancelled.",
  "Keep every Open or In progress action, then drop the ones whose change is unknown, then test the due date.",
  "Skip finished statuses, keep terminal changes that have open actions, then count anything due on the as-of date."],
 "Put the action log beside the change register. An open action is overdue only when its due date has passed, days until below zero; one due on the as-of date is not.")

q(0, "This tier met two owner decisions, both taken under AS15 on 2026-09-18. Which two, and what does each decide?",
 "D1, that only the assignee decides an approval and never the originator, and Q9, the emergency route and its ratification window.",
 ["D1, the stage table, and Q9, the lead of 14 days before an expiry.",
  "D1, the approval levels, and Q9, the no-rows refusal.",
  "Q9 alone, the emergency route."],
 "D1 is segregation of duties, enforced by the database too, with an absence covered by reassigning. Q9 is reduced authority up front and full review after the event, within 7 days.")

q(1, "Which list does a rule read to decide that a change's actions are no longer open work?",
 "The terminal list: \"Closed\", \"Rejected\" and \"Cancelled\".",
 ["The in-effect list, since a change on the facility has finished its work.",
  "The active list, read the other way round.",
  "The expiry states."],
 "A finished and locked change takes its actions out of openActions. ESANMI shows it on AC-06 (ES-06, Closed) and AC-07 (ES-09, Cancelled), and a probe shows it on the Rejected ES-11.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/intermediate/asrci_m06.json', label='asrci_m06', expect_n=15)
finish()
