import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Professional m02, closing a plan.
# Draws on m02's four lessons only: the canClosePlan walk, the failed point
# rows, canRemoveCheckpoint, canRaiseNcr and nextPlanStatuses of SECTION 11,
# the plan summarise of SECTION 12, the NCR open column of SECTION 13 and the
# Closed summarise line of SECTION 14. Read at the as-of date 2026-10-15.

q(2, "QAP-2026-014 is asked to close as recorded at the as-of date. What does canClosePlan refuse on first?",
 "The one failed checkpoint, H-05.",
 ["The 3 hold points outstanding.",
  "The 3 open NCRs against it.",
  "The 3 overdue points, H-05, S-10 and R-12, in planned date order."],
 "The first refusal is \"1 checkpoint has failed and has not been resolved. A failed inspection is the most outstanding item on a plan.\" The hold point and NCR refusals come later in the walk, and S-10 and R-12, both overdue, never stop it.")

q(0, "With H-05 re-inspected and Passed, the refusal reads \"2 hold points still outstanding (H-08, H-11).\" Why is the count 2 when planProgress printed hold points outstanding 3 at the as-of date?",
 "H-05 was the third, and the re-inspection resolved it.",
 ["The gate counts only hold points that are also overdue at the as-of date.",
  "The gate leaves out a hold point whose planned date falls after the as-of date.",
  "planProgress counts H-01 as outstanding."],
 "At the as-of date the three were H-05, H-08 and H-11. H-08 and H-11 both read overdue false and are still named, so the planned date plays no part in the count.")

q(3, "The same plan has every hold point Passed and every NCR closed, and W-09, a Witness point, reads Failed. What does canClosePlan answer?",
 "REFUSED, with the failed checkpoint sentence H-05 met.",
 ["ALLOWED, since a witness point does not stop work.",
  "REFUSED, with the hold point sentence naming W-09.",
  "ALLOWED, and planProgress keeps W-09 in failed 1."],
 "The course fails W-09, R-04, M-07 and S-10 one at a time and each is refused with \"1 checkpoint has failed and has not been resolved.\" A failed point blocks closure whatever its type, including the types whose stops work column reads false.")

q(1, "The third refusal reads \"3 non-conformances raised against this plan are still open.\" Which NCR statuses does the plan gate treat as open?",
 "Actions in progress, Open and Disposition agreed.",
 ["Open alone.",
  "Every status except Closed, so a Voided NCR is still counted as open.",
  "Open and Actions in progress, since Disposition agreed has settled the item."],
 "The three rows reading open true are NCR-2026-031, Actions in progress, NCR-2026-027, Open, and NCR-2026-019, Disposition agreed. Closed and Voided read open false.")

q(0, "S-10 and R-12 read overdue true at the as-of date. Does canClosePlan stop on either of them?",
 "No. The plan closes with both still unresolved.",
 ["Yes. An overdue point blocks closure.",
  "Only R-12, a Notified point.",
  "Only S-10, since site surveillance runs until the work ends."],
 "The walk reaches ALLOWED with W-09, S-10 and R-12 still unresolved. The gate reads failed points, hold points outstanding and open NCRs, and S-10 and R-12 are none of those.")

q(2, "The plan's points are summarised under the plan marked Closed. Which count keeps a value above zero?",
 "failed, which still reads 1.",
 ["outstanding, still 6.",
  "overdue, still 3.",
  "None of them; a Closed plan reports every count as 0."],
 "The Closed line reads outstanding 0, overdue 0, failed 1. The closed status stops the engine reporting anything as outstanding or overdue, and the failure count survives it.")

q(3, "H-08, a pending hold point, is asked to be removed from the Active plan and is refused. Where does the refusal send the request?",
 "To recording it Not applicable with the reason.",
 ["To waiving it, with a date, a verifier and a reason on the record.",
  "To returning the plan to Draft first.",
  "To raising an NCR against the plan for it."],
 "The refusal reads \"A hold point cannot be removed once its plan has left Draft. Record it as Not applicable with the reason, so the plan shows who set it aside and why.\" The plan workflow has no move from Active back to Draft.")

q(1, "R-04, a review point that Passed, is asked to be removed from the Active plan. Why does canRemoveCheckpoint refuse?",
 "It has a result recorded, and a recorded result is evidence that stays on the plan.",
 ["It is a review point, and review points stop work once the plan is Active.",
  "The plan has left Draft, and no point of any type may leave an Active plan.",
  "It is resolved, and removing it would lower the plan's percent."],
 "The refusal reads \"Item R-04 has a result recorded (Passed). A recorded result is evidence and stays on the plan.\" W-09, a pending witness point, may be removed from the same Active plan.")

q(3, "W-09, a pending witness point, may be removed from the Active plan. When is the same removal refused?",
 "Once the plan is Closed.",
 ["While the plan is Active, since W-09 is still Pending.",
  "Once the plan has left Draft, as for a hold point.",
  "Never, since a witness point stops no work."],
 "The refusal on the Closed plan reads \"This plan is closed. Its inspection points are the record it was finished on.\" A closed plan is frozen.")

q(0, "Which request to raise an NCR does canRaiseNcr refuse?",
 "One raised against QAP-2026-014 once it is Closed.",
 ["One raised against no plan at all.",
  "One raised against the Active plan while H-05 reads Failed.",
  "One raised against the Active plan while 3 NCRs are open."],
 "Against the Active plan and against no plan are both ALLOWED. Against the Closed plan the refusal reads \"QAP-2026-014 is closed. Raise the non-conformance against the plan now in force, or with no plan.\"")

q(2, "In nextPlanStatuses, from which status may a plan move to Closed?",
 "Active only.",
 ["Active or Under review.",
  "Any status that is not final.",
  "Draft, once every hold point is resolved."],
 "Active may move to Closed, Superseded or Cancelled. Asked to move Draft straight to Closed, canAdvancePlan refuses: \"A plan that is draft can only move to Under review, Active, Cancelled.\"")

q(1, "Which plan statuses does nextPlanStatuses print as final?",
 "Superseded, Closed and Cancelled.",
 ["Closed and Cancelled, since a Superseded plan may return to Active.",
  "Closed alone, since a Cancelled plan may be reinstated as a Draft.",
  "Closed and Under review."],
 "Superseded, Closed and Cancelled each print final. Under review may move to Active, Draft or Cancelled.")

q(0, "In what order does the closure walk meet canClosePlan's three refusals?",
 "Failed checkpoints, then hold points outstanding, then open NCRs.",
 ["Hold points outstanding, then failed checkpoints, then open NCRs.",
  "Open NCRs, then failed checkpoints, then hold points outstanding.",
  "Failed checkpoints, then open NCRs, then hold points outstanding."],
 "The counts in the refusals are 1, then 2, then 3, each the engine's own at its step. The NCR check comes last, and it is the only one that reads a record outside the plan's own points.")

q(3, "At the allowed step planProgress reads resolved 9 of 12 and percent 75. What does that percent leave unsaid?",
 "That W-09, S-10 and R-12 are still unresolved on a plan the engine lets close.",
 ["That H-05 was re-inspected and failed a second time.",
  "That 3 NCRs are still open against the plan.",
  "That H-08 and H-11 are still pending."],
 "The allowed step comes after H-05, H-08 and H-11 are resolved and every NCR is closed or voided. A witness point, a surveillance point and a review point stand unresolved, because the gate asks only about failed points, hold points and NCRs.")

q(2, "The course prints overdue 3 and hold points outstanding 3 for the plan. Which point sits in both lists?",
 "H-05 alone.",
 ["H-08 and H-11.",
  "S-10 and R-12.",
  "No point sits in both lists."],
 "The overdue three are H-05, S-10 and R-12. The hold points outstanding are H-05, H-08 and H-11. Only H-05 is on both, and H-08 and H-11 block closure while reading overdue false.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/intermediate/cqi_m02.json', label='cqi_m02', expect_n=15)
finish()
