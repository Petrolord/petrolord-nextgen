import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Professional tier exam, 42 questions over all six modules.
# Digest SECTIONS 10 to 17 at the as-of date 2026-10-15. Questions marked
# TWO MODULES need two modules' material at once.

# m01, the plan and its decisions
q(1, "H-08's pass and W-09's pass are each refused with nobody named. What do the two refusals both ask for?",
 "A date and a named person.",
 ["A reason for the pass.",
  "An NCR raised first.",
  "A future planned date."],
 "H-08's refusal asks for the date it was verified and who verified it; W-09's asks for the date this was decided and who decided it. The words differ with the type and the pair underneath is the same.")

q(3, "Which of these requests does canDecideCheckpoint allow?",
 "H-08 waived with a date, a verifier and a reason.",
 ["W-09 waived with a reason and no date or verifier.",
  "H-11 set Not applicable with a date and a name, no reason.",
  "H-08 passed with nobody named on the record."],
 "The engine has no rule against waiving a hold point, and with its record and reason the waiver is ALLOWED. Each of the other three requests is refused for the part it lacks.")

q(0, "Which statuses make up CHECKPOINT_RESOLVED_STATUSES?",
 "Passed, Waived and Not applicable.",
 ["Passed, Failed and Waived.",
  "Passed and Waived, and no other.",
  "Passed, Waived and In progress."],
 "Failed is not resolved: H-05 is counted in failed 1 and among the outstanding 6. In progress and Notified are outstanding too.")

q(2, "Which column on the QAP-2026-014 table does the engine derive from the point type alone?",
 "stops work.",
 ["overdue.",
  "resolved.",
  "planned."],
 "stops work reads true on every Hold point row and false on every other row. resolved and overdue change as a point's status and dates change.")

# m02, closing the plan
q(1, "Once QAP-2026-014 is Closed, which of these is still allowed?",
 "Raising an NCR with no plan at all.",
 ["Raising an NCR against QAP-2026-014.",
  "Removing W-09, a pending witness point, from it.",
  "Moving the plan back to Active."],
 "canRaiseNcr allows an NCR against no plan, and refuses one against the Closed plan. A closed plan's points are frozen, and Closed is final in nextPlanStatuses.")

q(3, "Which plan move in nextPlanStatuses goes back a step?",
 "Under review to Draft.",
 ["Active to Under review.",
  "Closed to Active.",
  "Superseded to Active."],
 "A plan under review may return to Draft. Nothing leaves Closed or Superseded, and Active has no move back to Under review.")

q(2, "TWO MODULES. The third plan refusal counts 3 open non-conformances, and the NCR summarise prints open 3. Are they the same NCRs?",
 "Yes, the same three.",
 ["No: the plan gate also counts NCR-2026-011, which is Voided.",
  "No: the plan gate counts only the two overdue NCRs and one other.",
  "No: summarise counts only NCRs that are serious and open."],
 "Both counts are NCR-2026-031, NCR-2026-027 and NCR-2026-019, whatever their severity. NCR-2026-011, Voided, and the two Closed NCRs sit outside both.")

q(0, "TWO MODULES. The plan gate counts NCRs as open. Which NCR status clears the plan gate without the NCR ever passing canCloseNcr?",
 "Voided.",
 ["Closed.",
  "Disposition agreed.",
  "Actions in progress."],
 "The walk's last step is every NCR closed or voided. Closed goes through the NCR's own closure gate, and Voided withdraws the NCR; canCloseNcr on NCR-2026-011 reads \"This non-conformance is already voided.\"")

q(3, "The failed-point rows put one other point Failed on a plan whose hold points are Passed and NCRs closed. Which of them lets the plan close?",
 "None of them.",
 ["S-10, the surveillance point, which stops nothing.",
  "M-07, the monitor point, already Not applicable once.",
  "R-04, the review point, since paper is not work."],
 "Four rows, four refusals, one sentence. A point that stops nothing while pending still blocks the plan once it has Failed.")

# m03, the nonconformance
q(1, "At 2026-10-15, which NCRs read overdue true?",
 "NCR-2026-031 and NCR-2026-019.",
 ["NCR-2026-031 and NCR-2026-027.",
  "NCR-2026-019 and NCR-2026-011.",
  "NCR-2026-027 and NCR-2026-019."],
 "NCR-2026-031 was due 2026-10-02 and NCR-2026-019 2026-09-30. NCR-2026-027 is due 2026-11-12, and NCR-2026-011 is Voided with no due date.")

q(2, "Which NCR sits first in ncrByUrgency?",
 "NCR-2026-019, Critical, Disposition agreed.",
 ["NCR-2026-031, Major, Actions in progress.",
  "NCR-2026-006, Minor, the earliest raised.",
  "NCR-2026-027, Minor, the only Open one."],
 "The three open NCRs take orders 1 to 3 with the Critical first, and the closed and voided NCRs follow at orders 4 to 6.")

q(0, "An open NCR reaches an age of 31 days. What does ageBand read?",
 "31 to 60 days.",
 ["0 to 30 days, since 31 is its first day past the edge.",
  "61 to 90 days, the band the next month opens.",
  "null, since an edge day belongs to no band."],
 "The digest's edge rows print 30 days in 0 to 30 days and 31 days in 31 to 60 days.")

q(3, "NCR-2026-011 was raised on 2026-05-11 and voided on 2026-05-13. What is its age?",
 "2 days.",
 ["None; a voided NCR has no age at all.",
  "It keeps ageing to the as-of date, since voided is not closed.",
  "2 days, until the dashboard moves it to Over 90 days."],
 "Voiding stops the clock the way closing does. NCR-2026-011 reads 2 whatever the as-of date, and ncrAgeing leaves it out because it is no longer open.")

q(1, "Which action is counted in the action summarise's awaiting an effectiveness check 1?",
 "k1, Complete on NCR-2026-031.",
 ["k3, Complete and found ineffective on NCR-2026-019.",
  "k2, the preventive action In progress on NCR-2026-031.",
  "k5, the open action on the voided NCR-2026-011."],
 "k1 reads Complete and verified effective false. k3 is the found ineffective 1 and k4 the verified effective 1.")

q(2, "What is the least an Observation NCR needs on the record before canCloseNcr allows it?",
 "The disposition and its date, nothing more.",
 ["The disposition, dated, and a root cause.",
  "The disposition, dated, and one corrective action.",
  "The disposition, dated, and an action verified effective."],
 "The Observation walk is the shortest: with Use as is and its date and nothing else it reads ALLOWED. With nothing recorded it meets the disposition refusal every NCR meets first.")

q(0, "Which walks refuse an NCR that has its disposition and date but no root cause?",
 "The Major walk and the Critical walk.",
 ["Every walk, the Observation walk included.",
  "The Critical walk and no other.",
  "The Major, Critical and Minor walks."],
 "The root cause refusals read \"A major non-conformance needs a root cause before it closes.\" and the same with critical. The Minor walk prints ALLOWED for no root cause and no actions.")

q(3, "Of the open NCRs on the register, which make up the dashboard's serious and open 2?",
 "The Major weld reject and the Critical flange rating.",
 ["The two Major NCRs, the weld reject and the pipe ovality.",
  "The Critical flange rating and the Minor coating.",
  "The weld reject and the coating thickness, both with open actions."],
 "NCR-2026-031 is the Major radiography reject on weld TW-07 and NCR-2026-019 the Critical wrong flange rating. NCR-2026-011, pipe ovality, is Major and Voided, so it is not open.")

q(1, "k6 is an open corrective action on NCR-2026-027, due 2026-11-01. Why is it not in the action summarise's overdue 1?",
 "It is not yet due: 2026-11-01 lies ahead.",
 ["Its NCR is Minor.",
  "Its NCR has no disposition.",
  "It is a Corrective action, and overdue counts Preventive ones."],
 "k6 reads open true and overdue false. The overdue one is k2, the preventive action on NCR-2026-031, due 2026-10-05.")

# m04, the checklist
q(0, "Which item is the observations 1 in checklistProgress on AUD-2026-007?",
 "Item 4, the lifting plan, with the rigging sketch not attached.",
 ["Item 9, excavation shoring, which carries its reason.",
  "Item 2, the gas test, with no entry for the 07:30 hot work.",
  "Item 14, the emergency drill, which has no answer."],
 "Item 4 is Major and reads Observation, with the note \"Plan approved; rigging sketch not attached.\" Item 9 is Not applicable and item 2 Nonconformant.")

q(2, "Item 10's note is blank and item 11 has no note at all. How does the engine treat the two?",
 "Alike: both read answered false.",
 ["Item 10 is answered, since a note field exists.",
  "Item 11 is answered, since Critical items need none.",
  "Both are answered, since each reads Not applicable."],
 "A blank note counts the same as a missing one. Both sit in unansweredItems and both are named in the first reporting refusal.")

q(3, "A finding carries a type and objective evidence and has no statement. What does canRaiseFinding answer?",
 "REFUSED: State the finding in one line.",
 ["REFUSED: Pick the finding type.",
  "ALLOWED, since the evidence says what was seen.",
  "REFUSED, until an owner and a due date are named for it."],
 "canRaiseFinding refuses on no finding type, no one-line statement and no objective evidence, each with its own sentence.")

q(1, "Does a finding's grade alone decide whether it holds a reported audit open?",
 "No. A minor finding that stopped work holds it open.",
 ["Yes. Only a major nonconformity holds a reported audit open.",
  "Yes. Any open finding of any grade holds it open.",
  "No. An observation left open holds it open too."],
 "Stopping work reaches past the grade: the row with a stop-work minor finding open reads REFUSED. With no stop-work, a minor nonconformity or an observation left open reads ALLOWED.")

q(0, "TWO MODULES. A stop-work finding and a Major NCR each have a refusal that names a record. Which pairing is right?",
 "The stop-work finding records its correction at the time; the Major NCR needs a corrective action for the cause.",
 ["The stop-work finding needs a corrective action for the cause; the Major NCR records its correction at the time.",
  "Both need only a disposition, what happens to the item, before anything else is read.",
  "Both record a correction at the time, and neither asks for a corrective action."],
 "The stop-work refusal reads \"Imminent danger does not wait for the corrective action cycle.\" The Major NCR refusal reads \"A disposition deals with the item; a corrective action deals with the cause.\"")

q(2, "With AF-2026-018 raised from item 2, criticalAnswersWithoutFindings lists 6. What would raising a finding from item 6 as well let the reporting walk do?",
 "Move on to asking for the audit conclusion.",
 ["Report the audit at once, the checklist being complete.",
  "Close the audit, since both critical items are covered.",
  "Clear the overdue flag on AUD-2026-007."],
 "Covering item 6 clears the critical-item step, and the next refusal asks for the conclusion. The report, and with it the end of overdue, comes only after that.")

# m05, the audit and the programme
q(3, "From which statuses may an audit be Cancelled?",
 "Planned, In progress and Fieldwork complete.",
 ["Any status that is not final, Reported included.",
  "Planned alone, before the fieldwork starts.",
  "Planned and In progress, before the fieldwork ends."],
 "Cancelling is open until the report is written. After that the audit's one remaining move is to close.")

q(1, "For an audit whose planned end has passed, which status is the first in the workflow to read overdue false?",
 "Reported.",
 ["Fieldwork complete.",
  "In progress.",
  "Closed."],
 "The three statuses before the report read true past the planned end, and Reported, Closed and Cancelled read false. Reported comes first of those three.")

q(0, "AUD-2026-008 is Planned and outstanding. Why is it not one of the programme's overdue 3?",
 "Its planned end, 2026-11-27, has not passed at the as-of date.",
 ["A Planned audit is never overdue, whatever its planned end.",
  "It has no checklist yet, so there is nothing to be late on.",
  "It is the last audit, and the last one is counted on completion."],
 "AUD-2026-006 is Planned too, with a planned end of 2026-10-02, and it reads overdue true. The overdue three are AUD-2026-005, AUD-2026-006 and AUD-2026-007.")

q(2, "On four audits, Reported, Cancelled with no reason, Cancelled with a reason and Planned, how many does programmeProgress count outstanding, and which?",
 "2: the Planned one and the one Cancelled with no reason.",
 ["1: the Planned one, since both cancelled audits are dealt with.",
  "3: every audit except the Reported one.",
  "2: the two Cancelled ones, since neither was delivered."],
 "One rule decides outstanding. programmeProgress counts 2, summarise counts 2, and canCompleteProgramme refuses on \"2 audits in this programme have not been reported or cancelled.\"")

q(1, "An audit programme is Approved. What must happen before it can be marked Complete?",
 "It must first move to In progress.",
 ["Nothing; Approved may move straight to Complete.",
  "It must be Cancelled first.",
  "It must return to Draft for a second approval."],
 "Approved may move to In progress or Cancelled, and only In progress may move to Complete. Complete and Cancelled are final.")

q(3, "canCloseNcr is asked to close NCR-2026-022, which already reads Closed. What does it answer?",
 "REFUSED: This non-conformance is already closed.",
 ["ALLOWED, since closing it again changes nothing on it.",
  "REFUSED: Agree the disposition first.",
  "ALLOWED, since its disposition is Use as is."],
 "The digest prints the same refusal for NCR-2026-006, also Closed, and \"This non-conformance is already voided.\" for NCR-2026-011.")

q(0, "TWO MODULES. What two rules about the lead auditor does this tier read?",
 "There must be one, and it may not also be the auditee.",
 ["There must be one with an account.",
  "It must be external.",
  "It may be the auditee with a co-signer."],
 "One rule sits in the reporting gate and one in auditIndependence, and an outside auditor with no account passes both.")

q(2, "canCompleteProgramme refuses the programme as recorded. Which audits does it name?",
 "AUD-2026-005, AUD-2026-006, AUD-2026-007 and AUD-2026-008.",
 ["AUD-2026-005, AUD-2026-006 and AUD-2026-007, the overdue three.",
  "AUD-2026-004 alone, the cancelled audit.",
  "AUD-2026-002, the one Reported and not yet Closed."],
 "The refusal names the four audits that have not been reported or cancelled. AUD-2026-008 is outstanding with overdue false.")

# m06 and cross-module readings
q(1, "TWO MODULES. Which three requests does the engine refuse until a written reason is on the record?",
 "Waiving a point, setting a hold point Not applicable, and cancelling an audit.",
 ["Passing a hold point, waiving a point, and cancelling an audit.",
  "Setting S-10 Not applicable, waiving a point, and approving a programme.",
  "Agreeing a disposition, cancelling an audit, and approving a programme."],
 "A pass needs a date and a verifier, approval needs a date and an approver, and S-10 set Not applicable with nothing recorded is ALLOWED. A waiver, a set-aside hold point and a cancellation each need their reason.")

q(3, "TWO MODULES. Which of these decisions does the engine accept with a date and a name and no reason?",
 "Passing H-08.",
 ["Waiving W-09.",
  "Setting H-11 Not applicable.",
  "Cancelling AUD-2026-008."],
 "H-08 passed with a date and a verifier is ALLOWED. A waiver and a set-aside hold point need a reason as well, and a cancellation with no reason is refused.")

q(0, "TWO MODULES. M-07 on the plan and item 10 on the checklist both read Not applicable. How does the engine count each?",
 "M-07 counts as resolved; item 10 counts as unanswered without its reason.",
 ["Both count as resolved or answered, since Not applicable is an accepted result.",
  "Both count as outstanding until a reason is written beside each.",
  "M-07 counts as outstanding; item 10 counts as answered."],
 "M-07 is one of the resolved 6 under CHECKPOINT_RESOLVED_STATUSES. Item 10's note is blank, it reads answered false, and it sits in unansweredItems.")

q(2, "TWO MODULES. The plan gate reads NCRs and the audit gate reads findings. Which statement about the two closure gates is right?",
 "The plan waits on every open NCR; the audit waits on open major and stop-work findings.",
 ["Both wait on every open record raised against them, whatever its grade.",
  "The plan waits on Major NCRs alone; the audit waits on every open finding.",
  "Neither reads anything beyond its own points or its own checklist."],
 "canClosePlan counts 3 open non-conformances whatever their severity, Minor NCR-2026-027 included. canCloseAudit allows a minor nonconformity or an observation open with no stop-work.")

q(3, "TWO MODULES. What does percent 71 on the checklist and percent 50 on the plan each leave unsaid?",
 "71 does not say what conformed; 50 does not say which points were waived.",
 ["71 does not say what was answered; 50 does not say which points were passed.",
  "71 leaves out the Nonconformant answers; 50 leaves out the Waived points.",
  "Nothing; each percent is the count of good results over the total."],
 "Items 2 and 6, Nonconformant, sit inside answered 10. W-06 (Waived) and M-07 (Not applicable) sit inside resolved 6 beside the passes.")

q(1, "A plan has 23 of its 40 points resolved. What percent does planProgress print for it?",
 "58.",
 ["38, the figure for 3 of 8.",
  "13, the figure for 1 of 8.",
  "63, the figure for 5 of 8."],
 "Half up on the exact fraction gives 58 here, and that is the line the digest carries.")

q(0, "At the as-of date canCloseNcr allows NCR-2026-019, the oldest open NCR. Which record meets the last requirement of the Critical walk?",
 "k4, verified effective.",
 ["Its disposition, Return to supplier, agreed and dated.",
  "Its age, 117 days.",
  "Its place at order 1 in ncrByUrgency."],
 "NCR-2026-019 is Critical, and a Critical NCR needs a corrective action verified effective. k3 was found ineffective and k4 was verified effective.")

q(3, "H-08 is removed from QAP-2026-014 while the plan is still a Draft. What does canRemoveCheckpoint answer?",
 "ALLOWED.",
 ["REFUSED, as it is on the Active plan.",
  "REFUSED until it is set Not applicable.",
  "ALLOWED only with a reason on the record."],
 "The hold point removal rule bites once a plan has left Draft. Before then H-08 may be taken off; after it, the route is Not applicable with its reason.")

q(2, "TWO MODULES. The plan's points and the NCR register each keep a count that survives closure. Which pairing is right?",
 "failed 1 on the Closed plan; concessions 2 over the closed NCRs.",
 ["overdue 3 on the Closed plan; open 3 over the closed NCRs.",
  "outstanding 6 on the Closed plan; concessions 2 over open NCRs.",
  "outstanding 6 on the Closed plan; mean open age 75 days over closed NCRs."],
 "Under the plan marked Closed the points read outstanding 0, overdue 0, failed 1. concessions 2 are NCR-2026-022 and NCR-2026-006, both Closed.")

q(1, "canReportAudit is asked about AUD-2026-007 with no lead auditor named at all. What does it answer?",
 "REFUSED: Name the lead auditor.",
 ["ALLOWED, since the conclusion is written.",
  "REFUSED: The lead auditor is also the auditee for this audit.",
  "ALLOWED, with an external auditor assumed."],
 "A report is somebody's report, and the reporting walk refuses the same audit with no lead auditor named. Independence is a second rule on top of it.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/intermediate/cqi_exam.json', label='cqi_exam', expect_n=42)
finish()
