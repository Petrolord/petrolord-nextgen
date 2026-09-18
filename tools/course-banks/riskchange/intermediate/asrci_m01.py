import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Professional m01, a change and its stages.
# Every figure, stage name and refusal sentence is from digest Section 7, with
# the ESANMI counts the m01 lessons quote from Section 12. Nothing here reaches
# into the Expert tier's sections.

q(2, "Straight from \"Review\" to the Closed stage: which sentence does the stage machine return?",
 "It refuses: A change in Review can only move to Approval, Rejected, Cancelled, Screening.",
 ["It allows the move, because the Closed stage is in effect and Review is an active stage.",
  "It refuses: A closed change is final.",
  "It allows the move once every approval level has signed and nothing on the set is rejected."],
 "The row for \"Review\" lists four legal next stages and the Closed stage is not one of them. No row skips a stage, and the refusal quotes the row it was read from.")

q(0, "Which stage is the only one the stage machine lets into \"Implementation\"?",
 "\"Approval\".",
 ["\"Review\", once the reviewers named on the change have finished with it.",
  "Any active stage whose approval set reads complete on the day it is asked.",
  "\"Screening\", on the emergency route that an Emergency change is allowed."],
 "Only \"Approval\" leads to \"Implementation\". The emergency route changes how many levels must sign at that one door; it opens no second door.")

q(1, "How many stages lead nowhere, and which are they?",
 "3: \"Closed\", \"Rejected\" and \"Cancelled\", whose rows read none.",
 ["2: \"Rejected\" and \"Cancelled\", since a Closed change can go back to Review.",
  "3: \"Implementation\", \"Closed\" and \"Rejected\".",
  "4: \"Closed\", \"Rejected\", \"Cancelled\" and \"Draft\", which cannot be rejected."],
 "The engine prints it: 3 stages lead nowhere. These are the terminal stages, and moving any of them is refused with a sentence such as \"A closed change is final.\"")

q(3, "Can a change in \"Draft\" be moved to \"Rejected\"?",
 "No. The \"Draft\" row offers only \"Screening\" and \"Cancelled\", so a draft is withdrawn by cancelling it.",
 ["Yes. \"Rejected\" can be reached from every active stage.",
  "Yes, once an approver has recorded a Rejected row on it.",
  "No, because \"Rejected\" is reachable from \"Approval\" alone."],
 "\"Rejected\" appears in three rows: \"Screening\", \"Review\" and \"Approval\". The \"Draft\" row lists two moves and neither is \"Rejected\".")

q(2, "From which stages can a change step back to the stage before?",
 "\"Screening\", \"Review\" and \"Approval\".",
 ["\"Review\", \"Approval\" and \"Implementation\", each back one step for rework.",
  "Every active stage, with the single exception of \"Draft\", which has none before it.",
  "Only \"Approval\", which can hand a change back to \"Review\" for more work."],
 "Screening returns a change to \"Draft\", Review to \"Screening\" and Approval to \"Review\". \"Implementation\" has no step back: its row offers \"Closed\" and \"Cancelled\" and nothing else.")

q(1, "A change in \"Implementation\" is asked to go back to \"Approval\". Which sentence does the engine return?",
 "A change in Implementation can only move to Closed, Cancelled.",
 ["A change in Implementation can only move to Closed, Cancelled, Approval.",
  "Approval levels 2 and 3 have not signed yet.",
  "A change in Implementation is on the facility and cannot be moved back to any earlier stage."],
 "The refusal lists the row for \"Implementation\", which holds two moves. The engine's sentence names the stage and the legal moves; it does not describe the facility.")

q(3, "Which stages make up the in-effect list, the change on the facility?",
 "\"Implementation\" and \"Closed\".",
 ["\"Implementation\" alone.",
  "\"Approval\", \"Implementation\" and \"Closed\", from the signature onward.",
  "\"Closed\", \"Rejected\" and \"Cancelled\", the stages whose rows read none."],
 "In effect is \"Implementation\" and \"Closed\". The terminal list, \"Closed\", \"Rejected\" and \"Cancelled\", overlaps it only at the Closed stage.")

q(0, "\"Implementation\" is an active stage. Which other list does it also sit in, and what follows from that?",
 "In effect: it can expire, and cannot read overdue.",
 ["Terminal: its actions leave the open count once it is reached.",
  "No other list; each stage sits in exactly one of the three.",
  "In effect: its actions leave the open count once the target passes."],
 "Two stages sit in two lists: \"Implementation\" is active and in effect, and the Closed stage is in effect and terminal. Being on the facility is what lets a change expire and what ends its overdue flag.")

q(1, "The ESANMI register holds 5 changes in \"Implementation\" on 2026-10-01, and all 5 are past their target dates. How many read overdue on that date?",
 "None of them. A change is overdue only before it is on the facility, and late work there shows as overdue actions.",
 ["All 5, because each change's target implementation date has passed by 2026-10-01.",
  "Only those whose actions are still open on 2026-10-01.",
  "Only the Emergency ones, whose ratification is also running late on that date."],
 "The overdue flag on a change is read in \"Draft\", \"Screening\", \"Review\" and \"Approval\" only. Being in effect means the target was met or passed by the fact of it, so none of the 5 reads overdue on 2026-10-01.")

q(3, "The ESANMI summary reads active 8 on 2026-10-01. Which stage counts add up to it?",
 "\"Draft\" 0, \"Screening\" 1, \"Review\" 1, \"Approval\" 1 and \"Implementation\" 5.",
 ["\"Implementation\" 5 and \"Closed\" 2, which are in effect, plus the 1 \"Rejected\" change.",
  "\"Implementation\" 5 plus ES-06, ES-09 and ES-11.",
  "\"Implementation\" 5 plus the 3 Emergency changes."],
 "Active is \"Draft\", \"Screening\", \"Review\", \"Approval\" and \"Implementation\": 0 + 1 + 1 + 1 + 5 = 8. Every distractor here also adds to 8, which is why the list behind a count matters more than the count.")

q(2, "Somebody tries to move a change that is already \"Rejected\". What does the engine answer?",
 "It refuses because the stage leads nowhere: A rejected change is final.",
 ["It refuses: A closed change is final.",
  "It refuses: An approver has rejected this change. It cannot be implemented.",
  "It allows a move back to \"Review\"."],
 "\"Rejected\" is one of the 3 stages that lead nowhere. The gate refusal about a rejecting approver is a different sentence, about a rejected approval row on a live change.")

q(0, "Which change types must carry an expiry date?",
 "\"Temporary\" and \"Emergency\".",
 ["\"Temporary\" alone.",
  "Every type.",
  "\"Emergency\" alone."],
 "The types that must carry an expiry date are \"Temporary\" and \"Emergency\". A \"Permanent\" change carries none and its expiry state reads \"Permanent change\".")

q(2, "The refusal \"A change in Draft can only move to Screening, Cancelled.\" names two stages. Where do they come from?",
 "The row of legal next stages for \"Draft\", in the order the row lists them.",
 ["The stages this change has already passed through, most recent first.",
  "The stages whose approval sets are complete for this change on the day it was asked.",
  "The workflow order of all eight stages, starting from the one after \"Draft\"."],
 "The sentence is the row: it names the stage the change is in and every move that stage allows. That is why a user can act on it without opening the stage table.")

q(1, "\"Cancelled\" appears in which rows of the stage table?",
 "Every active row, from \"Draft\" through \"Implementation\".",
 ["Only the rows for \"Screening\", \"Review\" and \"Approval\".",
  "Every row, the three stages that lead nowhere included, so any record can be withdrawn.",
  "Only the \"Draft\" row, before any work has been spent on the change."],
 "Withdrawing a change is open while the work is live, so all five active rows carry it. The three terminal rows read none.")

q(3, "A change in \"Draft\" has every approval level signed and every action complete. Can it move straight to \"Approval\"?",
 "No. The \"Draft\" row lists only \"Screening\" and \"Cancelled\", and no signature or action makes a move legal that the row leaves out.",
 ["Yes, because a complete approval set is what \"Approval\" checks for.",
  "Yes, provided the change is of the type \"Emergency\".",
  "No, because the approval set has to be emptied first."],
 "A move is a question of two stages. The engine answers this one \"A change in Draft can only move to Screening, Cancelled.\" whatever the rows and actions say.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/intermediate/asrci_m01.json', label='asrci_m01', expect_n=15)
finish()
