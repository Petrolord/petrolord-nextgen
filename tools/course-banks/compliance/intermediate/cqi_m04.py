import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Professional m04, the checklist.
# Draws on m04's four lessons only: digest SECTION 15 (AUD-2026-007's
# checklist, checklistProgress, unansweredItems, criticalAnswersWithoutFindings,
# canRaiseFinding), and the rows of SECTIONS 16 and 17 those lessons read (the
# first canReportAudit refusals, the stop-work canCloseAudit row, the finding
# counts in the programme summarise). Read at the as-of date 2026-10-15.

q(0, "Items 9, 10 and 11 on AUD-2026-007 all carry the result Not applicable. Which of them reads answered true?",
 "Item 9, which carries its reason.",
 ["Item 11, the Critical one.",
  "Items 9 and 10, which have a note.",
  "All three of them."],
 "Item 9's note reads \"No excavation open during the audit.\" Item 10's note is blank and item 11 has none, and both read answered false. A blank note counts the same as a missing one.")

q(2, "checklistProgress prints notApplicable 3 and answered 10. Which figure includes items 10 and 11?",
 "notApplicable 3, which counts every Not applicable result.",
 ["answered 10, which counts every row that carries a result of any kind.",
  "Both of them, since a Not applicable result is one of the four answers.",
  "Neither; such an item is dropped."],
 "notApplicable counts items 9, 10 and 11. answered 10 counts items 1 to 9 and 12, and leaves out 10 and 11 because a Not applicable with no reason is not an answer.")

q(3, "unansweredItems lists 10, 11, 13 and 14. What separates items 13 and 14 from items 10 and 11?",
 "Items 13 and 14 have no row at all; 10 and 11 have a row that is not an answer.",
 ["Items 13 and 14 are Critical questions, and 10 and 11 are Minor ones.",
  "Items 13 and 14 carry a blank note, and 10 and 11 carry no note.",
  "Items 13 and 14 read Observation, and 10 and 11 read Not applicable."],
 "The course prints that items 10 (Not applicable, a blank note) and 11 (Not applicable, no note) have a recorded row that is not an answer, and that items 13 and 14 have no row at all. Item 13 is Minor and item 14 Major.")

q(1, "Items 2 and 6 are answered Nonconformant. What do they do to checklistProgress's percent 71?",
 "They raise it, exactly as a Conformant answer would.",
 ["They lower it, since the percent counts conformant answers.",
  "Nothing; a failed answer is outstanding.",
  "They are held out of it until a finding is raised from each."],
 "The percent measures answering. Items 2 and 6 sit inside answered 10 beside the conformant 6 and the observation, so the percent says how much of the checklist has an accepted answer and says nothing about what conformed.")

q(3, "An audit has no checklist at all. What does checklistProgress print, and what should a screen show for it?",
 "percent null, shown as no checklist to measure.",
 ["percent 0, shown as an empty bar on the audit's screen.",
  "No figure, since checklistProgress refuses an audit with no checklist.",
  "percent 71, the figure carried over from AUD-2026-007."],
 "With no questions there is no fraction to take. planProgress over a plan with no points and programmeProgress over no audits print null in the same way.")

q(0, "AF-2026-018 was raised from item 2 and is then Voided. What does criticalAnswersWithoutFindings list?",
 "Items 2 and 6.",
 ["Item 6 alone, since item 2 keeps the finding raised from it.",
  "Item 2 alone, since voiding reopens only the finding's own item.",
  "Nothing until the audit is reported."],
 "With AF-2026-018 in force the list is 6. With it Voided the list is 2, 6: a voided finding covers nothing, and item 2 counts as uncovered exactly as though no finding had been raised.")

q(2, "A three-item checklist has a Major item and a Minor item answered Nonconformant, no finding raised, every item answered and a conclusion written. What does canReportAudit answer?",
 "ALLOWED, and the report goes through.",
 ["REFUSED, naming the Major item as needing a finding.",
  "REFUSED, naming both items as needing a finding.",
  "ALLOWED only once the Major item has a finding raised."],
 "criticalAnswersWithoutFindings lists 0 items and the report is ALLOWED. The finding rule applies to Critical items only, and the engine has no rule that a Major or Minor nonconformance must raise a finding before the audit is reported.")

q(1, "The course walks canRaiseFinding through three refusals before it reaches the stop-work rows. What do those three ask for?",
 "A finding type, a one-line statement and objective evidence.",
 ["A finding type, an owner and a due date.",
  "A one-line statement, a correction and a root cause.",
  "Objective evidence, a lead auditor and the auditee's signature."],
 "The three refusals are \"Pick the finding type.\", \"State the finding in one line.\" and the objective evidence sentence. A number, an owner and a due date are what the reporting refusal says a failed critical question needs.")

q(0, "What does the canRaiseFinding refusal say objective evidence is?",
 "What was seen, where, and when.",
 ["Who saw it and who owns it.",
  "A photograph and a date.",
  "The clause and the gap."],
 "The refusal reads \"Objective evidence: what was seen, where, and when. It is the first thing an auditee will ask for.\" Item 2's note, \"No gas test entry for the 07:30 hot work.\", is that kind of evidence.")

q(3, "A finding that stopped work is raised with the type Observation. What does canRaiseFinding answer?",
 "REFUSED, because it must be typed a nonconformity.",
 ["ALLOWED, once the correction is recorded with it.",
  "ALLOWED, and it counts in stop-work open.",
  "REFUSED until the audit has been Reported."],
 "The engine's own sentence is \"A finding that stopped work is a nonconformity, not an observation.\" A stop-work nonconformity with its correction is ALLOWED.")

q(2, "A stop-work nonconformity is raised. What must it carry on the record at the moment it is raised?",
 "The correction: what was done about it at the time.",
 ["A corrective action, with the root cause behind it.",
  "A check that the correction was effective.",
  "The lead auditor's name on the stop order."],
 "The refusal reads \"A finding that stopped work records what was done about it at the time. Imminent danger does not wait for the corrective action cycle.\" The correction is immediate; the corrective action runs on its own cycle.")

q(1, "A reported audit has a stop-work minor finding still open. What does canCloseAudit answer?",
 "REFUSED: 1 finding that stopped work is still open.",
 ["ALLOWED, since only major findings hold an audit open.",
  "ALLOWED, once the correction is on the finding.",
  "REFUSED until the finding is regraded as major."],
 "The finding in that row is a minor one and it still holds the audit open. Having stopped work is enough for the gate, whatever the finding's grade.")

q(3, "The programme summarise prints open findings 1, open major 1 and stop-work open 1. How many findings stand behind the three counts?",
 "One: AF-2026-018, a Major nonconformity, Open, stop-work true.",
 ["Three, one behind each of the three counts.",
  "Two: AF-2026-018 and a finding raised from item 6.",
  "One: AF-2026-018, a Minor nonconformity that stopped work."],
 "The course names the findings summarise counts: AF-2026-018 alone. One finding is behind open findings 1, open major 1 and stop-work open 1.")

q(0, "With every item answered and items 10 and 11 given reasons, canReportAudit refuses on critical item 6 alone. Why is item 2 not named?",
 "Item 2 is covered by AF-2026-018.",
 ["Item 2 is a Major question.",
  "Item 2's note already records the time of the hot work.",
  "The refusal names only the last critical item that failed."],
 "Items 2 and 6 are both Critical and both Nonconformant. criticalAnswersWithoutFindings with AF-2026-018 raised from item 2 lists 6, and the refusal reads \"Critical item 6 was answered Nonconformant with no finding raised.\"")

q(2, "Item 11 is a Critical question that reads Not applicable with no note. Where does the engine list it at the as-of date?",
 "In unansweredItems, beside 10, 13 and 14.",
 ["In criticalAnswersWithoutFindings, beside item 6.",
  "Nowhere; it needs nothing more.",
  "Among the conformant 6, since nothing was found wrong."],
 "Without its reason item 11 is not an answer, so it sits in unansweredItems and in outstanding 4. criticalAnswersWithoutFindings lists Critical items answered Nonconformant, and with AF-2026-018 raised from item 2 it lists 6 alone.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/intermediate/cqi_m04.json', label='cqi_m04', expect_n=15)
finish()
