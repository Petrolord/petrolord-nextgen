import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Professional m06, the professional reading.
# Draws on m06's three lessons: the Abam plan and its NCRs read as one record
# (SECTIONS 10 to 14), AUD-2026-007 and its programme read as one record
# (SECTIONS 15 to 17), and the tier's four habits. Every figure is true at the
# as-of date 2026-10-15.

q(2, "Of the three open ABAM NCRs, which does canCloseNcr allow to close at the as-of date?",
 "NCR-2026-019, the oldest open NCR.",
 ["NCR-2026-031, whose corrective action k1 reads Complete.",
  "NCR-2026-027, a Minor NCR, which needs no root cause.",
  "None of them while QAP-2026-014 is Active."],
 "NCR-2026-019 is Critical and reads ALLOWED with k4 verified effective. NCR-2026-031 is refused on its open action k2, and NCR-2026-027 on its missing disposition.")

q(0, "NCR-2026-019 is 117 days old and NCR-2026-027 is 64 days old. What do the two ages tell a reader about closure?",
 "Nothing. The older one may close at the as-of date and the younger one has no disposition.",
 ["That NCR-2026-019 is the further from closure, since it sits in Over 90 days.",
  "That NCR-2026-027 will close first, since its band is the younger one.",
  "That both have stopped ageing, since each has a disposition recorded."],
 "An open NCR ages until it closes, whatever step it has reached. To know what each still needs, read the closure answer and the actions: NCR-2026-019 reads ALLOWED, and NCR-2026-027 is refused on its disposition.")

q(1, "checklistProgress prints outstanding 4 for AUD-2026-007, and the programme summarise prints answers outstanding 2. Why do they differ?",
 "summarise was given the 12 recorded answers, and items 13 and 14 have no row.",
 ["summarise counts only the Critical and Major items that are outstanding.",
  "summarise leaves out the two items whose Not applicable has no reason written beside it.",
  "summarise reads the programme at an earlier date than the checklist."],
 "Items 10 and 11 have a recorded row that is not an answer, and those are the answers outstanding 2. checklistProgress reads all 14 questions and counts 10, 11, 13 and 14. Neither figure is wrong; each counts what it was given.")

q(3, "The first canReportAudit refusal on AUD-2026-007 counts 4 items. Which printed figure counts the same four items?",
 "checklistProgress's outstanding 4.",
 ["The programme summarise's answers outstanding 2.",
  "The programme summarise's audits outstanding 4.",
  "checklistProgress's notApplicable 3, with item 14."],
 "The refusal names items 10, 11, 13 and 14, the same four that unansweredItems lists and that checklistProgress counts as outstanding.")

q(1, "At the as-of date, which statement about H-08 and H-11 is true?",
 "They are pending and on schedule, and they still stop work.",
 ["They are overdue, and so they stop work.",
  "They are on schedule, and so they do not yet stop work on the tie-in.",
  "They are resolved, and the plan waits only on its NCRs."],
 "Both read Pending, resolved false and overdue false, and both are named in the hold point refusal. A hold point stops work until it is verified, whatever its planned date.")

q(2, "What does NCR-2026-031 wait on at the as-of date, in the order the engine asks?",
 "k2, its late preventive action, and then the check that k1 worked.",
 ["The check that k1 worked first, and after it k2, its late preventive action.",
  "Its disposition date, then k2, its preventive action due 2026-10-05.",
  "A root cause, and then the check that k2 worked."],
 "At the as-of date it is refused on \"1 corrective or preventive action still open.\" With k2 Complete it is refused on \"No corrective action has been verified effective yet.\" k1 reads Complete and verified effective false.")

q(0, "Which percents do the tier's three progress functions print for the Abam records at the as-of date?",
 "planProgress 50, checklistProgress 71, programmeProgress 38.",
 ["planProgress 38, checklistProgress 50, programmeProgress 71.",
  "planProgress 71, checklistProgress 38, programmeProgress 50.",
  "planProgress 75, checklistProgress 71, programmeProgress 38."],
 "QAP-2026-014 reads resolved 6 and percent 50, AUD-2026-007's checklist percent 71, and the programme reported 3 and percent 38. planProgress reads 75 only at the allowed closure step.")

q(3, "Which of the tier's progress functions print percent null over an empty record?",
 "All three: planProgress, checklistProgress and programmeProgress.",
 ["planProgress alone, and checklistProgress and programmeProgress both print 0.",
  "checklistProgress alone, and the other two refuse to count an empty record.",
  "None; each prints 0 over an empty record."],
 "A plan with no points, no checklist at all and no audits each print percent null. An empty record has no fraction to take.")

q(2, "A request to change a record is refused. What happens to the record?",
 "Nothing changes, and the refusal says why the request was stopped.",
 ["The request is held as pending on the record until somebody corrects it.",
  "The record moves on to the requested status, with the refusal attached to it.",
  "The item is marked Failed until the request is sent again."],
 "A request is not a result. H-08 stays Pending after its refused pass, stays on the Active plan after its refused removal, and R-04 still reads Passed.")

q(1, "The programme reads reported 3, cancelled 1 and percent 38. What does AUD-2026-004, the cancelled audit, add to the percent?",
 "Nothing. The percent counts reported audits, and it is not one.",
 ["It counts as delivered, the same as a reported audit.",
  "It counts as delivered once its cancellation reason is on the record.",
  "It counts as half an audit, between reported and outstanding."],
 "Reported 3 counts AUD-2026-001, AUD-2026-002 and AUD-2026-003, and AUD-2026-004 sits in cancelled 1, in neither reported nor outstanding. A programme is delivered when its audits are reported, and the course records that the programme counts reported audits only, which is why a complete programme that contains a cancelled audit reads below one hundred percent by design.")

q(0, "What does the Expert tier put in place of this tier's percents when it reads certification readiness?",
 "A list of blockers, each one named.",
 ["A percent of the clauses that are covered.",
  "A score in a band, like a risk rating.",
  "A count of the findings closed in the cycle."],
 "The tier's last lesson says readiness is a list of blockers, each one named, with no percent at all.")

q(3, "A finding here feeds a risk register. Where does this course send a learner for risk scores and bands?",
 "To the sibling course, Risk, Change & Learning.",
 ["To the NCR summarise and its serious and open count.",
  "To ncrAgeing's severity columns and its four age bands.",
  "To the programme summarise's open major count."],
 "Risk scores, bands and the approval rules for change belong to the sibling course, and this course sends the learner there for them.")

q(1, "The plan's summarise and programmeProgress both print overdue 3. Are they the same kind of record?",
 "No. One is H-05, S-10 and R-12; the other is AUD-2026-005 to AUD-2026-007.",
 ["Yes. Both count the audits whose planned end has passed.",
  "Yes. Both count the points whose planned date has passed.",
  "No. One counts NCRs and the other counts audit findings."],
 "The plan's overdue three are inspection points, and the programme's overdue three are audits whose planned ends have passed and which have not been reported.")

q(2, "On QAP-2026-014, which point reads both Failed and overdue true at the as-of date?",
 "H-05, the radiography of the tie-in welds.",
 ["S-10, the site surveillance.",
  "R-12, the as-built dossier review.",
  "H-08, the hydrostatic test, planned 2026-10-20."],
 "H-05 is the one failed point and one of the overdue three with S-10 and R-12. S-10 reads In progress and R-12 Notified; H-08 reads Pending and overdue false.")

q(0, "What stands between AUD-2026-007 and a report the engine allows, in the engine's order?",
 "Its unanswered items, a finding from item 6, and its conclusion.",
 ["Its conclusion, a finding from item 2, and its closure.",
  "A finding from item 6, its closure, and its conclusion.",
  "Its unanswered items, the closure of AF-2026-018, and its lead auditor."],
 "Items 13 and 14 need answers and items 10 and 11 their reasons, item 6 needs a finding, and the conclusion comes last. Finishing the fieldwork has not cleared overdue; reporting the audit will.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/intermediate/cqi_m06.json', label='cqi_m06', expect_n=15)
finish()
