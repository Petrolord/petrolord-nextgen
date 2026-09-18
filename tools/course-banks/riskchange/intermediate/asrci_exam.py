import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Professional tier exam, 42 questions over the whole tier.
# Every figure, state and refusal is from digest Sections 7 to 12. Every dated
# state is true on the as-of date 2026-10-01 and the question says so. Written
# last, on angles the module banks do not take; at least six questions need two
# modules at once (marked "two modules" in the comment above each).

# two modules: m01 lists, m05 expiry
q(1, "A Temporary change was \"Cancelled\" while its expiry was still ahead; the date has since passed. What does it read on 2026-10-01?",
 "\"No expiry\", uncounted, because \"Cancelled\" sits outside the in-effect list.",
 ["\"Expired\", counted, because the date is behind 2026-10-01 on a type that carries an expiry.",
  "\"Closed out\", because a cancelled change is terminal.",
  "\"Permanent change\"."],
 "Only \"Implementation\" and the Closed stage are in effect. A Temporary change in \"Cancelled\" one day past its expiry reads \"No expiry\" and is not counted expired.")

q(3, "Which moves does the stage table allow out of \"Screening\"?",
 "\"Review\", \"Rejected\", \"Cancelled\" and back to \"Draft\".",
 ["\"Review\" and \"Cancelled\" only.",
  "\"Review\", \"Approval\" and \"Cancelled\", since a screened change may skip ahead.",
  "\"Review\", \"Rejected\" and \"Cancelled\", with no step back from a screened change."],
 "Screening has four legal next stages. Screening, Review and Approval can each step back to the stage before.")

q(0, "Which stage row is the only one that offers \"Implementation\", and what else does that row offer?",
 "The \"Approval\" row, which also offers a rejection, a cancellation and a step back to \"Review\".",
 ["The \"Review\" row, which also offers \"Rejected\" and \"Cancelled\".",
  "The \"Approval\" row, which offers nothing else.",
  "The \"Approval\" row, which also offers \"Closed\" and \"Cancelled\"."],
 "The row reads \"Implementation\", \"Rejected\", \"Cancelled\", \"Review\". No other row offers the move onto the facility.")

# two modules: m02 approvals, m04 expiry condition
q(2, "Readable expiry, all levels signed, no rejection, no unfinished action: can a Temporary change leave \"Approval\" for \"Implementation\"?",
 "It allows it, with every condition met.",
 ["It refuses, because a Temporary change must go in on the emergency route.",
  "It refuses: A temporary change needs an expiry date before it is implemented.",
  "It allows it on level 1."],
 "The expiry condition asks for a readable date, and the approval condition asks for every level signed with no rejection. Both are met.")

q(1, "A set carries three levels and only the first has signed. What does the engine read?",
 "Two levels outstanding, 2 and 3, so the set is incomplete.",
 ["Levels 1, 2, 3; outstanding 2, 3; complete yes, since level 1 is the one that decides.",
  "Levels 1; outstanding none; complete yes.",
  "Levels 1, 2, 3; outstanding 3."],
 "Every distinct level present must carry at least one Approved row. Levels 2 and 3 have none, so both are outstanding and the set is incomplete.")

q(3, "Who may decide ES-01's level 2 approval, as it is assigned?",
 "u-emeka alone.",
 ["u-emeka or u-halima, since both are independent of ES-01.",
  "u-emeka, or u-chika when u-emeka is unavailable, since u-chika knows the change.",
  "Any member signed in who did not raise ES-01."],
 "The approval is assigned to u-emeka. The engine allows u-emeka to decide it and refuses u-halima, nobody and the originator.")

# two modules: m03 segregation, m05 emergency route
q(0, "An Emergency change must go in fast, and its originator is the only person on site. May the originator sign level 1 so the change can go in?",
 "No. Under D1 the change originator never decides an approval, on any route.",
 ["Yes. The emergency route suspends the originator rule until the change is ratified.",
  "Yes, provided an independent approver ratifies level 1 within 7 days.",
  "No, because an Emergency change needs every level signed before it goes in."],
 "The originator rule is written against the originator by identity, at assignment and at decision. The route needs level 1 signed by somebody allowed to sign it, and nobody having rejected it.")

# two modules: m04 gate conditions, m05 emergency route
q(2, "Level 1 has signed on an Emergency change waiting in \"Approval\", no approver has objected, and its expiry field is blank. What keeps it out of \"Implementation\"?",
 "The expiry condition: an Emergency change needs a readable expiry.",
 ["Nothing stops it: an Emergency change needs only its first level signed to go in.",
  "Nothing stops it, because an Emergency change reads its expiry as \"No expiry\".",
  "The approval condition."],
 "Temporary and Emergency are the two types that must carry an expiry date. The emergency route changes how many levels must sign; it does not lift the expiry condition.")

q(1, "Which action types can block the gate into the Closed stage?",
 "Implementation and Post-implementation actions left unfinished.",
 ["\"Pre-implementation\", \"Implementation\" and \"Post-implementation\", every type left unfinished.",
  "\"Post-implementation\" alone.",
  "\"Pre-implementation\" alone."],
 "Pre-implementation actions are the first gate's business. Into the Closed stage the engine asks that no Implementation or Post-implementation action is unfinished.")

# two modules: m01 legal moves, m04 the gate into Closed
q(3, "ES-02 is in \"Implementation\" and AC-03 is still \"In progress\". Of its two legal next stages, which can it reach today?",
 "\"Cancelled\" only.",
 ["The Closed stage only, since cancelling a change on the plant needs its work finished first.",
  "Both, since \"In progress\" work has already been started on the change.",
  "Neither, until AC-03 reads \"Complete\"."],
 "The Closed stage claims the work is done, so its gate reads AC-03 and refuses. A cancellation withdraws the change, and no action blocks it.")

q(0, "Tomorrow, 2026-10-02, is the end date of a temporary bypass now running. How many days away is it on 2026-10-01, and which state follows?",
 "\"Expiring soon\", 1 day away.",
 ["\"Within expiry\", 1 day.",
  "\"Expired\", -1.",
  "\"No expiry\"."],
 "Any expiry from 0 to 14 days away, counted inclusively, reads \"Expiring soon\". The date has not passed.")

q(2, "Which expiry state goes with 2026-11-30 on a change already in \"Implementation\", read on 2026-10-01?",
 "\"Within expiry\", 60 days away.",
 ["\"Expiring soon\", 60 days away, because the expiry lies ahead.",
  "\"Within expiry\", 14 days away, the most the lead counts.",
  "\"No expiry\"."],
 "Beyond the lead of 14 days a change in effect reads \"Within expiry\". The count is whole calendar days between the two dates.")

q(3, "ES-04 is an Emergency change in \"Implementation\". Which pair of states does it read on 2026-10-01?",
 "\"Within expiry\", and on ratification \"Awaiting ratification\" until 2026-10-03.",
 ["\"Expiring soon\" and \"Ratification overdue\", due 2026-09-27, since both of its windows are short.",
  "\"Within expiry\" and \"Ratified\", because it went in on its first signature as the route allows.",
  "\"No expiry\" and \"Awaiting ratification\"."],
 "ES-04's expiry is 2026-11-29, beyond the lead. Its ratification due date is after the as-of date, so the window is open. Expiry and ratification are separate questions on one record.")

q(1, "Implemented on 2026-09-30, an Emergency change still lacks its level 2 signature. When does its window close, and what state holds on 2026-10-01?",
 "It stays open until 2026-10-07, so the change is \"Awaiting ratification\".",
 ["Due 2026-10-01, \"Awaiting ratification\", counting the window from the as-of date.",
  "Due 2026-10-08, \"Awaiting ratification\".",
  "Due 2026-10-07, \"Ratified\"."],
 "The due date is the actual implementation date plus 7 calendar days. 1 day has gone by, and the window is open.")

q(0, "Six days after going in on 2026-09-25, an Emergency change with level 2 still unsigned is read on 2026-10-01. What is owed, and by when?",
 "Level 2's signature, by 2026-10-02; meanwhile \"Awaiting ratification\".",
 ["7 days since, due 2026-10-01, \"Ratification overdue\".",
  "6 days since, due 2026-10-01.",
  "6 days since, \"Ratified\"."],
 "2026-09-25 plus 7 days is 2026-10-02, the day after the as-of date. The window is open.")

# two modules: m01 overdue flag, m05 ratification
q(3, "ES-05 is an Emergency change in \"Implementation\", past its target date of 2026-09-20. Which reading is right on 2026-10-01?",
 "Overdue no, and \"Ratification overdue\".",
 ["Overdue yes, and \"Ratification overdue\", since both of its dates have passed.",
  "Overdue yes, and \"Awaiting ratification\", since the target is the older date.",
  "Overdue no, and \"Not required\"."],
 "A change's own overdue flag is read only before it is on the facility. \"Ratification overdue\" is its own state: ES-05's ratification was due 2026-09-27.")

q(2, "Which list of stages does a change's own overdue flag read?",
 "The active stages that are not in effect.",
 ["Every active stage, \"Implementation\" included, once the target date has passed.",
  "The in-effect stages, where late work on the facility is measured.",
  "The terminal stages, where a change is judged against its date."],
 "A change is overdue only in \"Draft\", \"Screening\", \"Review\" or \"Approval\", with its target date passed. Late work after that shows as overdue actions.")

q(1, "Beyond the 5 in \"Implementation\", what else in the ESANMI register sits on the facility as read on 2026-10-01?",
 "ES-06 and ES-07, the 2 in the Closed stage.",
 ["None: a change in the Closed stage is finished and off the list.",
  "ES-09 and ES-11, the \"Cancelled\" change and the \"Rejected\" one.",
  "ES-01, which is in \"Approval\" and next in line to go in."],
 "Being on the facility is being in effect, and in effect is \"Implementation\" and the Closed stage. By stage reads \"Closed\" 2, which are ES-06 and ES-07. \"Cancelled\", \"Rejected\" and \"Approval\" are not in effect.")

q(0, "ES-03 went onto the plant with an expiry of 2026-09-28, and its one action AC-08 was cancelled. Give the register's reading for it on 2026-10-01.",
 "\"Expired\", counted in expired, with AC-08 finished and outside openActions.",
 ["\"Expired\", with AC-08 still in openActions.",
  "\"Expiring soon\", with AC-08 finished.",
  "\"No expiry\", with AC-08 finished."],
 "ES-03 is in effect and its expiry has passed, so it is the one change in expired 1. A Cancelled action is finished.")

# two modules: m04 actions, m06 register
q(3, "AC-05 is a Post-implementation action on ES-04, \"Open\", due 2026-10-20. How is it counted on 2026-10-01?",
 "In openActions only.",
 ["In openActions and in overdueActions, because it is open on a change in effect.",
  "In neither, because ES-04 has not yet been ratified by every level.",
  "In overdueActions only, because its change is past its target date."],
 "ES-04 is live, AC-05 is unfinished, and its due date lies after the as-of date. It is one of the 4 open actions and neither of the 2 overdue ones.")

q(2, "On ES-09, which was cancelled, AC-07 sits \"In progress\" with a due date of 2026-08-10. Is it open work or overdue on 2026-10-01?",
 "In neither count, because ES-09 is \"Cancelled\".",
 ["In openActions and overdueActions, because \"In progress\" is unfinished and its date has passed.",
  "In openActions only, because an action in progress is never overdue.",
  "In neither, because \"In progress\" counts as finished."],
 "Actions on a finished and locked change are not open work. \"In progress\" is unfinished, but the change behind it is terminal.")

q(1, "An open action on a live change falls due on 2026-10-02. On 2026-10-01, is it open work, and is it overdue?",
 "Open work that is not yet overdue: openActions 1, overdueActions 0.",
 ["openActions 0, overdueActions 0, since its date is still ahead of the as-of date.",
  "openActions 1, overdueActions 1.",
  "openActions 0, overdueActions 1."],
 "Whatever its date, unfinished work on a live change counts as open. Overdue needs days until below zero, and 2026-10-02 is 1 day ahead.")

q(0, "Which of these approval sets reads complete yes?",
 "A single signed row that carries no level at all.",
 ["No approval rows at all.",
  "A lone \"Delegated\" row.",
  "Levels 1 and 3, with level 3 unsigned."],
 "A row with no level counts as level 1, so one signed row signs the only level. An empty set, a Delegated row and an unsigned level all read complete no.")

# two modules: m02 levels, m03 deciding
q(3, "One row, marked \"Delegated\", is all a level has. Is the level signed, and can the row's assignee still decide it?",
 "The level stays outstanding, and deciding it is refused: This approval is already delegated.",
 ["The level reads signed, and deciding it again is refused: This approval is already approved.",
  "The level stays outstanding until the delegate decides it, and the delegate may do so.",
  "The level is dropped from the set, and there is nothing left to decide."],
 "Only \"Approved\" signs a level. A Delegated row counts as decided, so a second decision on it is refused, and the owner's route for an absence is reassignment.")

q(2, "A refusal begins \"Only the person this approval is assigned to\". Which rule produced it?",
 "Only the assignee decides.",
 ["The originator never approves, which is checked at the decision as well.",
  "A decision is made once, which refuses a second decision on a row.",
  "An approval assigned to nobody."],
 "The assignee refusal answers anybody other than the assignee, nobody signed in included. The originator refusal begins \"The originator of a change cannot approve it\".")

q(1, "Work started, work unfinished: a Pre-implementation action reads \"In progress\" on a fully signed Permanent change with no rejection. Can the change go in?",
 "It refuses, because \"In progress\" is unfinished.",
 ["It allows it: the work has begun.",
  "It refuses, because a Permanent change needs a readable expiry date first.",
  "It allows it, because Pre-implementation work blocks only the gate into the Closed stage."],
 "\"In progress\" is unfinished, just as \"Open\" is, and an unfinished Pre-implementation action blocks the gate into \"Implementation\".")

q(0, "Besides the engine, what enforces decision D1?",
 "The database enforces the same rule.",
 ["Nothing: it is advice to the app.",
  "The originator.",
  "The approval level."],
 "The engine holds the rule in its assignment and deciding checks, and the digest records that the database enforces the same rule.")

# two modules: m02 rejection stops the gate, m03 a decision is made once
q(3, "ES-01's level 2 approval has been decided \"Rejected\". Can the same row be decided \"Approved\" later so the change can go in?",
 "No: This approval is already rejected.",
 ["Yes, by the assignee, since only the assignee decides the row.",
  "Yes, once every other level has signed, which outweighs the rejection.",
  "Yes, by any member independent of the change, which covers the objection."],
 "A decision is made once, and that is what keeps the rejection rule in place: a rejection anywhere stops the gate with \"An approver has rejected this change. It cannot be implemented.\"")

q(2, "Day zero of an emergency window: implemented on 2026-10-01 with level 2 outstanding, where does the ratification stand that same day?",
 "0 days gone, a window to 2026-10-08, \"Awaiting ratification\".",
 ["0 days since, due 2026-10-01, \"Awaiting ratification\", the window ending today.",
  "0 days since, with due null.",
  "0 days since, \"Not required\"."],
 "The window starts on the date the change actually went in, and the due date is 7 days later.")

# two modules: m04 the expiry condition, m05 no expiry
q(0, "What do a blank expiry and an expiry reading \"after the turnaround\" have in common for a Temporary change?",
 "The gate refuses both with the same sentence, and in \"Implementation\" both read \"No expiry\".",
 ["The gate allows both, and both read \"Expired\" once in \"Implementation\".",
  "The gate refuses the blank only.",
  "Nothing."],
 "Either way the date cannot be read. The gate refuses both, and a change that reached the plant without one reads \"No expiry\" and can never read \"Expired\".")

q(3, "ES-07 went through to the Closed stage; its temporary expiry was 2026-08-01. Which expiry state, and is it in the expired count, on 2026-10-01?",
 "\"Closed out\", and outside the expired count.",
 ["\"Expired\", counted, because the expiry is behind the as-of date on a type that carries one.",
  "\"No expiry\", uncounted, because a closed change is terminal and no longer running.",
  "\"Expired\", uncounted, because the change is finished and locked in the register."],
 "ES-07 finished on the facility. Its date is long behind 2026-10-01, and the Closed stage turns that into \"Closed out\" instead of an alarm.")

q(2, "No implementation date sits on ES-12's record, and its expiry is 2026-12-31. Read its expiry state, overdue flag and ratification on 2026-10-01.",
 "\"Within expiry\", overdue no, \"Ratification overdue\" with due null.",
 ["\"Within expiry\", overdue no, \"Awaiting ratification\" with due null.",
  "\"No expiry\", overdue yes, \"Ratification overdue\".",
  "\"Within expiry\", overdue no, \"Not required\"."],
 "With no recorded implementation date the window cannot be shown to be open, so it fails closed. Its expiry is well beyond the lead.")

# two modules: m04 the gate into Closed, m05 the emergency route
q(1, "At which gate is the emergency route's full review enforced?",
 "The gate into the Closed stage: it cannot close until every level has signed.",
 ["The gate into \"Implementation\", which waits for every level on every type of change.",
  "Neither gate: ratification is only reported.",
  "The gate into \"Cancelled\"."],
 "The route lets the change in on level 1 and never lets it finish early. The refusal reads: Approval level 2 has not ratified this emergency change. It cannot close until every level has signed.")

q(0, "What are the values of EXPIRY_LEAD_DAYS and EMERGENCY_RATIFY_DAYS?",
 "14 days, counted inclusively, and 7 days from the actual implementation date.",
 ["7 days and 14 days.",
  "14 days and 8 days.",
  "15 days and 7 days."],
 "An expiry 14 days away reads \"Expiring soon\" and 15 days away \"Within expiry\". A ratification due on the as-of date, day seven, reads \"Awaiting ratification\".")

q(3, "Why does ES-08 sit between ES-02 and ES-10 in the urgency order read on 2026-10-01?",
 "Overdue ranks after expiring soon and before other live work.",
 ["ES-08's target date, 2026-09-25, is earlier than every other target in the register.",
  "ES-08 is the one change in \"Review\", and Review ranks between Implementation and Screening.",
  "ES-08 carries a lower risk level."],
 "Expired, then expiring soon, then overdue, then other live work, then everything finished. ES-08 is the one overdue change, so it sits between ES-02 and the other live work.")

q(2, "Four changes are in the register's total and missing from its active figure on 2026-10-01. Name them.",
 "The four finished changes: ES-06, ES-07, ES-09 and ES-11.",
 ["The four changes past their target date, which leave the active count.",
  "The 4 open actions, which are counted in total and not in active.",
  "The four Temporary changes."],
 "Active is \"Draft\", \"Screening\", \"Review\", \"Approval\" and \"Implementation\". Total counts every row, so the two Closed changes, the Cancelled one and the Rejected one are the difference.")

q(1, "Which stages offer a rejection as their next move?",
 "From \"Screening\", \"Review\" or \"Approval\" only.",
 ["Every active row, \"Draft\" and \"Implementation\" included, so any live change can be refused.",
  "\"Approval\" alone.",
  "\"Review\" and \"Approval\"."],
 "A change in \"Draft\" cannot move to \"Rejected\", and a change in \"Implementation\" can only move to \"Closed\" or \"Cancelled\".")

q(0, "A report reads: \"ES-02 is expiring soon.\" What is missing from it?",
 "The date it is true on, 2026-10-01, since \"Expiring soon\" moves with the as-of date.",
 ["The type, since \"Expiring soon\" is spelled differently for Emergency changes.",
  "Nothing: an expiry state holds on every date.",
  "Its risk level."],
 "\"Expired\", \"Expiring soon\" and \"Within expiry\" move with the date. ES-02, expiry 2026-10-14, reads \"Expiring soon\" on 2026-10-01, and the same record read on another date could read something else.")

q(3, "A Closed-stage change is picked for another move. Which sentence comes back?",
 "A closed change is final.",
 ["A change in Closed can only move to Cancelled, the one exit a finished change keeps.",
  "It allows \"Cancelled\".",
  "It refuses: 1 implementation or post-implementation action still open."],
 "Closed, Rejected and Cancelled are the 3 stages that lead nowhere. The refusal lists no moves because there are none to list.")

q(2, "Only one of these ESANMI readings on 2026-10-01 is a change that fails closed. Which?",
 "ES-12, whose missing implementation date leaves its window unprovable.",
 ["ES-10, whose past expiry reads \"No expiry\" while the change is still in \"Screening\".",
  "ES-01, whose ratification reads \"Not required\" with due null.",
  "ES-05, due 2026-09-27."],
 "Failing closed is an absence read as a reason to stop or to flag. ES-12's missing implementation date means its window cannot be shown open. ES-05 is overdue on a real date.")

q(1, "Name the summary field that tallies changes sitting at the \"Approval\" stage, with its ESANMI value on 2026-10-01.",
 "awaitingApproval, which reads 1.",
 ["ratificationPending, which reads 1, since ratification is a later approval.",
  "active, which reads 8, the live stages.",
  "overdue, which reads 1, before the facility."],
 "ES-01 is the one change at that stage, and its two Pending rows do not make it count twice.")

q(0, "A change with every level signed carries an unfinished \"Post-implementation\" action. Does that action stop it going into \"Implementation\"?",
 "No. Post-implementation work blocks the gate into the Closed stage, and that is checked later.",
 ["Yes. Any unfinished action blocks both gates.",
  "Yes, when its due date has passed.",
  "No, since actions block nothing."],
 "Each gate reads its own action types, so this action waits for the second gate. The first gate asks only about Pre-implementation work.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/intermediate/asrci_exam.json', label='asrci_exam', expect_n=42)
finish()
