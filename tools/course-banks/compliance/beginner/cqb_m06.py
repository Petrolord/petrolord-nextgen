import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Associate m06, The Associate Reading. Written from digest.txt
# SECTIONS 3 to 9 read as one register and one library, as the three lessons of
# this module teach them: the IKORO register end to end, the IKORO library end
# to end, and what the next tier changes.

q(1, "summarise prints an attention count of 5 for the IKORO register at 2026-10-15. Which five obligations are behind it?",
 "REG-2026-005, REG-2026-007, REG-2026-002, REG-2026-012 and REG-2026-001.",
 ["REG-2026-005, REG-2026-007, REG-2026-002, REG-2026-012 and REG-2026-013.",
  "REG-2026-005, REG-2026-007, REG-2026-002, REG-2026-003 and REG-2026-001.",
  "REG-2026-007, REG-2026-002, REG-2026-012, REG-2026-001 and REG-2026-003."],
 "The attention statuses are Expired, Overdue and Due soon: the licence, the notification and the water quality return, then the rental and the discharge permit. REG-2026-013 reads No date set and REG-2026-003 reads On track."),

q(3, "countBy regime prints Environmental 5. What does that count tell a compliance lead?",
 "The shape of the register, including rows it is not counting down.",
 ["That five Environmental rows need action now.",
  "That five Environmental obligations are Active and counted down against their dates at 2026-10-15.",
  "That the Environmental regime holds five of the thirteen permits, with the rest spread across other regimes."],
 "The five Environmental rows include REG-2026-009, which is Superseded, and REG-2026-011, which is Not applicable. A regime count is the shape of the register and says nothing about live work."),

q(0, "Reading the whole register, the discharge permit REG-2026-001 is Due soon with a next action date of 2026-11-20. Which of its dates is that, and what would a reader who counted to the other one miss?",
 "The expiry. A reader counting to the due date of 2027-03-31 would miss the permit lapsing.",
 ["The due date. A reader counting to the expiry would see a lapse that the renewal has already covered.",
  "The due date rolled forward. A reader counting to the expiry would miss the next filing.",
  "The expiry. A reader counting to the due date would read the same status, so nothing is missed."],
 "Read end to end, the permit's row shows 2026-11-20 as its next action date. Counting to 2027-03-31 would give a reader the picture REG-2026-004 shows for the same date: On track."),

q(2, "The flare return REG-2026-003 and the monitoring report REG-2026-004 both read On track. What do their last filings have in common?",
 "Each belongs to an earlier period.",
 ["Each counts for this period.",
  "Each was filed late.",
  "Each is too old for the engine to read, so it is treated as missing."],
 "The flare return was filed 2026-07-28 before a period starting 2026-07-31. The monitoring report was filed 2026-03-30, one day before its period starts on 2026-03-31. The work for the current period is still to do."),

q(1, "Reading the IKORO library at 2026-10-15, which three actions does it ask of a document controller?",
 "Review HSE-PRO-0007, start the review of OPS-PLA-0002, and give OPS-PHI-0001 a review date.",
 ["Review HSE-PRO-0007, review OPS-PRO-0004, and give OPS-PHI-0001 a review date.",
  "Review HSE-PRO-0007, start the review of OPS-PLA-0002, and review ENG-STD-0011.",
  "Start the review of OPS-PLA-0002, publish HSE-PRO-0012, and decide ENG-PRO-0019."],
 "The sampling procedure is Review overdue, the emergency response plan Review due soon, and the flare philosophy No review scheduled. OPS-PHI-0001 has no issue date recorded, so nextReviewDate has nothing to count a period from. OPS-PRO-0004 is Not in force and ENG-STD-0011 is Review scheduled at 258 days."),

q(3, "The register and the library each show a missing date as a state of its own. Which pair of words is that?",
 "No date set and No review scheduled.",
 ["Draft and Not in force.",
  "Not applicable and Review scheduled.",
  "Overdue and Review overdue."],
 "REG-2026-013 has no due date and no expiry and reads No date set. OPS-PHI-0001 is in force with no review date and reads No review scheduled. In both, the gap is visible instead of hidden."),

q(0, "A Superseded obligation and a Superseded document are both on IKORO's books. What does each read?",
 "The obligation reads Superseded, and the document reads Not in force.",
 ["Both read Superseded, the lifecycle word they share.",
  "The obligation reads Overdue, because its passed due date is still on the record, and the document reads Not in force.",
  "The obligation reads Not applicable, and the document reads Review overdue."],
 "REG-2026-009 reads Superseded and is not counted down. OPS-PRO-0004 is Superseded and its review state is Not in force. In both apps a record that is not live does not drive a warning."),

q(2, "ENG-STD-0011, the tank inspection standard, is Approved with its next review on 2027-06-30. What review state does it read at 2026-10-15, and why?",
 "Review scheduled, because Approved is a status in force.",
 ["Not in force, because only a Published document is read for review.",
  "Review due soon, because an Approved document is reviewed before publication.",
  "No review scheduled, because it has no issue date to count from."],
 "EFFECTIVE_STATUSES holds Published and Approved, so reviewState reads the standard, and at 258 days it reads Review scheduled. Its issue date, 2025-06-30, is on the record, and nextReviewDate from it agrees with the recorded review date."),

q(1, "The emergency response plan OPS-PLA-0002 is corrected and re-published before its review date of 2026-11-02. What happens to that date?",
 "It does not move.",
 ["It moves to 12 months after the correction.",
  "It moves to the day of the correction.",
  "It is cleared, so the plan reads No review scheduled."],
 "A review date is earned at issue. OPS-PLA-0002 was issued 2025-11-02 on a 12 month period, and a correction does not reset the clock."),

q(3, "The next tier reads an inspection and test plan. Which point type does qualityAssurance.BLOCKING_POINT_TYPES hold?",
 "Hold point alone.",
 ["Hold point and Witness point.",
  "Witness point alone.",
  "Every one of the five types."],
 "A hold point stops work until it is released. POINT_TYPES lists five: Hold point, Witness point, Review point, Monitor point and Surveillance point."),

q(0, "The next tier's NCRs each carry a severity. Which list does qualityAssurance.NCR_SEVERITIES hold?",
 "Critical, Major, Minor, Observation",
 ["Critical, Major, Minor",
  "Conformant, Nonconformant, Observation and Not applicable",
  "Expired, Overdue, Due soon"],
 "Critical, Major and Minor leaves out Observation, which the list holds. Conformant, Nonconformant, Observation and Not applicable are the checklist answers in auditManagement.ANSWERED_RESULTS."),

q(2, "This tier names three ideas that carry forward into every app the course teaches. Which three?",
 "The as-of date is an input, a status is derived, and a gate refuses until the record is complete.",
 ["The as-of date is the machine's clock, a status is derived, and a gate refuses.",
  "The as-of date is an input, a status is typed by its owner, and a gate warns.",
  "The as-of date is an input, a status is derived, and a gate flags for later."],
 "In Document Control the gate asked for a named reviewer other than the author and refused until it had one. The next tier is full of gates of that kind, each asking for evidence, a date or a named person."),

q(1, "The rule that the author does not review a revision reappears in the next two tiers. What does it become there, and where are the approval rules for management of change taught?",
 "An auditor may not audit their own area; management of change approvals belong to Risk, Change & Learning.",
 ["An inspector may not inspect their own weld; they are taught in this course's Expert tier.",
  "An auditor may not audit their own area; management of change approvals are taught in this course's next tier.",
  "A reviewer may not review twice in a year; they belong to Risk, Change & Learning."],
 "Independence runs through the next two tiers as the auditor rule. Risk scores, heat maps and the approval rules for management of change belong to the sibling course."),

q(0, "countBy regime prints Reporting 3. Which three obligations are they?",
 "REG-2026-002, REG-2026-003 and REG-2026-008.",
 ["REG-2026-002, REG-2026-003 and REG-2026-004.",
  "REG-2026-003, REG-2026-004 and REG-2026-008.",
  "REG-2026-002, REG-2026-008 and REG-2026-010."],
 "The water quality return, the flare return and the community report are Reporting. REG-2026-004 is Environmental and REG-2026-010 is Health & Safety, though both are periodic reports by type."),

q(2, "REG-2026-013 has no dates and sits tenth in the sorted register. REG-2026-010 has a due date of 2027-06-30 and sits eleventh. Why is the undated row higher?",
 "No date set ranks sixth and Draft seventh in STATUS_SEVERITY, which byUrgency reads first.",
 ["Undated rows always sort above dated ones within the bottom half of the register.",
  "REG-2026-010's due date is so far ahead that the engine sorts it below the undated row.",
  "REG-2026-013 is Environmental and REG-2026-010 is Health & Safety, and the register groups by regime."],
 "STATUS_SEVERITY runs No date set sixth and Draft seventh. byUrgency sorts by status first, and puts undated rows last only among rows with the same status."),
emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/beginner/cqb_m06.json', expect_n=15)
finish()
