import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Expert tier exam. 42 questions across the whole tier, digest
# sections 13 to 20 as the 26 advanced lessons teach them, written after the
# six module banks and asked from angles those banks do not take. The one
# history question is framed by its own prompt, which opens "Repair history".

# ---- the comment loop (section 13)

q(0, "A comment is raised and later closed by the shortest legal path. Which statuses does it pass through after \"Open\", and who makes each move?",
 "\"Responded\" by the author, \"Verified\" by the reviewer, then \"Closed\" by the coordinator.",
 ["\"Verified\" by the reviewer, then \"Closed\" by the coordinator, with no response from the author needed.",
  "\"Responded\" by the author, then \"Closed\" by the reviewer.",
  "\"Responded\" by the author, \"Verified\" by the coordinator, then \"Closed\" by the reviewer."],
 "Each role owns its step. The author answers, the reviewer accepts the answer, and the coordinator records the comment as finished. The other exit, withdrawal, finishes a comment without ever reaching \"Closed\".")

q(3, "A reviewer tries to withdraw a comment that the author has already responded to. What does the engine say?",
 "Refused: only Verified or Rejected now.",
 ["\"A withdrawn comment is final.\"",
  "\"The author of the work under review cannot withdraw a comment on it.\"",
  "Nothing: withdrawing is the reviewer's own move."],
 "The engine's sentence is \"A responded comment can only go to Verified or Rejected.\" Withdrawal is reachable from \"Open\" and from \"Rejected\" only, so once a response exists the reviewer judges it first, and may withdraw again only after rejecting.")

q(1, "Of the 7 legal comment moves, how many belong to the reviewer?",
 "4: \"Withdrawn\" from two statuses, \"Verified\" and \"Rejected\" from one.",
 ["3, one each for \"Verified\", \"Rejected\" and \"Withdrawn\".",
  "2: \"Verified\" and \"Rejected\", both from \"Responded\".",
  "5, every move out of \"Open\", \"Responded\" and \"Rejected\"."],
 "The author has \"Responded\" from \"Open\" and from \"Rejected\", 2 moves. The coordinator has \"Closed\" from \"Verified\", 1 move. The reviewer has the other 4, which is why the person being reviewed answers and the person reviewing decides.")

q(0, "Nobody is signed in when a request arrives to verify C-03, a \"Responded\" comment on IK-01. What comes back?",
 "\"Sign in to act on this comment.\"",
 ["The move is allowed, since \"Verified\" is legal from \"Responded\".",
  "\"A comment cannot be verified before the author has responded to it.\"",
  "\"Choose the reviewer.\", since nobody acted."],
 "With nobody signed in there is no actor to check, and the engine says so. \"Choose the reviewer.\" is the refusal when a review is given a reviewer with nobody named at all.")

q(1, "A reviewer clicks \"Rejected\" on a comment that is already \"Rejected\". What does the engine answer?",
 "The same-status sentence: \"This comment is already rejected.\"",
 ["\"A rejected comment can only go to Responded or Withdrawn.\"",
  "\"A rejected comment is final.\"",
  "The move is allowed and the rejection is recorded a second time on the comment."],
 "A move to the status a comment already holds has its own family of sentences. The record does not change, and nothing pretends it did.")

q(3, "Which comment statuses wait on the author?",
 "\"Open\" and \"Rejected\".",
 ["\"Responded\" and \"Rejected\".",
  "\"Open\" only.",
  "\"Open\", \"Responded\" and \"Rejected\", the three unresolved statuses."],
 "Of the three unresolved statuses, \"Open\" and \"Rejected\" wait on the author to respond, and \"Responded\" waits on the reviewer to verify or reject.")

# ---- closing a review (section 14)

q(2, "Which review stages read overdue at a due date of 2026-09-30, asked on 2026-10-01?",
 "\"Draft\", \"In Review\" and \"Verification\".",
 ["\"In Review\" and \"Verification\" only.",
  "Every stage, \"Closed\" and \"Cancelled\" included.",
  "\"Verification\" only, as the last stage before a close."],
 "isOverdue asks the stage first. Only a review in an active stage, \"Draft\", \"In Review\" or \"Verification\", reads overdue once its due date has passed.")

q(0, "byUrgency sorts the IKANG register on 2026-10-01. Which order comes back?",
 "IK-01, IK-02, IK-05, IK-04, IK-03.",
 ["IK-01, IK-02, IK-05, IK-03, IK-04, the latest finished first.",
  "IK-04, IK-03, IK-01, IK-02, IK-05, oldest due date first.",
  "IK-02, IK-01, IK-05, IK-04, IK-03, by stage order."],
 "Overdue reviews first, then other active reviews, then everything finished; within a rank the earlier due date first. IK-01 is the one overdue review. IK-02 is due before IK-05. IK-04, due 2026-08-01, comes before IK-03, due 2026-08-15.")

q(1, "Why are C-10 and C-11 left out of the open and blocking counts for the IKANG register?",
 "They sit on IK-04, which is \"Cancelled\" and locked, so nobody can resolve them.",
 ["They are \"Minor\" comments, which never block whatever their status is.",
  "They are resolved, having been withdrawn when IK-04 was cancelled by the coordinator.",
  "They are left out of the comment total as well, because their review is finished."],
 "Judged on its own, C-10 (\"Critical\", \"Open\") and C-11 (\"Major\", \"Responded\") would each block. Nobody can resolve a comment on a locked review, so the summary keeps both in the comment total and leaves them out of the open and blocking counts.")

q(3, "What do IK-01's severity columns read in its own summary?",
 "\"Critical\" 3, \"Major\" 3, \"Minor\" 1, \"Editorial\" 1.",
 ["\"Critical\" 1, \"Major\" 2, \"Minor\" 1, \"Editorial\" 1, counting unresolved comments only.",
  "\"Critical\" 3, \"Major\" 3, \"Minor\" 1, \"Editorial\" 2, with C-09 counted as \"Editorial\".",
  "\"Critical\" 4, \"Major\" 3, \"Minor\" 1, \"Editorial\" 1."],
 "The severity columns count every rated comment on the log, resolved or not. C-09 carries no severity and is in no severity column, although it is in the total and in openComments.")

q(0, "Can the person whose work IK-01 examines sit in on it purely to watch?",
 "Yes, as an Observer, a role that judges nothing.",
 ["No: \"The author of the work under review cannot review it.\" covers every role.",
  "No: \"Choose the reviewer.\"",
  "Yes, and while observing u-efe may also verify comments."],
 "The author, u-efe, is refused as a Reviewer, as the Lead Reviewer and with no role given, and is refused every reviewer move on a comment. Watching judges nothing, so the digest records the author as an Observer as ALLOWED.")

q(2, "The coordinator tries to add a reviewer to IK-01 without naming anybody. What is the answer?",
 "It refuses: \"Choose the reviewer.\"",
 ["The review goes ahead with no reviewer, to be named later.",
  "It records a blank reviewer and lets the author fill it in.",
  "\"The author of the work under review cannot review it.\""],
 "Naming nobody at all is refused with its own short sentence. The independence rule has nothing to test until somebody is named.")

q(0, "u-kemi, independent of the work, asks to verify C-03 on IK-01, a \"Responded\" comment with its response written. What does the engine do?",
 "The verification goes through for u-kemi.",
 ["Refuses it, because only the coordinator may verify a comment on a review in \"Verification\".",
  "Refuses it, because u-kemi was not the reviewer who raised C-03 on the log.",
  "Refuses it with \"A comment cannot be verified before the author has responded to it.\""],
 "The move is legal from \"Responded\", a response exists, and the actor is independent of the work, so the digest records it as ALLOWED. The author verifying the same comment is refused.")

q(3, "C-03 on IK-01 has been answered by the author and reads \"Responded\". Which of IK-01's summary counts does it sit in?",
 "totalComments, openComments and blockingComments, since the reviewer has not accepted the response.",
 ["totalComments only, because an answered comment is no longer open.",
  "totalComments and openComments, because an answered comment no longer blocks.",
  "blockingComments only, because a \"Major\" comment counts nowhere else."],
 "C-03 counts in totalComments 9, openComments 6 and blockingComments 3. A response is a claim the reviewer has not yet accepted, so it moves neither the open nor the blocking count until the reviewer verifies it.")

q(0, "Which rule decides that the unrated C-09 sorts after C-07, the \"Editorial\" comment, in bySeverityThenAge?",
 "Worst severity first among unresolved comments, and C-09's missing severity places it after every rated one on this log.",
 ["Comments are sorted by comment number within the unresolved group.",
  "Open comments sort by their age alone, oldest first.",
  "An unrated comment is read as \"Editorial\" and sorts last among them."],
 "Unresolved comments come first, worst severity first within them, then the resolved ones. C-09 is unresolved and unrated, so it follows C-07 and precedes C-08, the first of the resolved comments.")

# ---- a lesson and its validation (section 15)

q(3, "From which point in its life does the engine treat a lesson as accepted by the organisation, and which statuses does that cover?",
 "Every status from validation onward among the live ones: \"Validated\", \"Published\", \"Embedded\".",
 ["From publication only, covering the two visible statuses.",
  "From submission, covering \"Submitted\", \"Validated\" and \"Published\".",
  "From the moment it is written, covering every live status."],
 "Accepted starts at validation, the step where somebody other than the author accepts the lesson. Visible is narrower, and live is wider, adding \"Draft\" and \"Submitted\".")

q(3, "Reading a \"Validated\" lesson, its validator finds a gap. Instead of publishing it, where can the lesson go?",
 "Back to \"Submitted\", and from there to \"Draft\".",
 ["Nowhere: once validated, a lesson can only be published or archived.",
  "Straight back to \"Draft\" in a single move.",
  "To \"Superseded\", pending a better version."],
 "From \"Validated\" the legal moves are \"Published\", \"Submitted\" and \"Archived\", and from \"Submitted\" they include \"Draft\". The lesson goes back to its author rather than being published with the gap in it.")

q(2, "ON-06 is \"Submitted\". What do its substance and missing columns read?",
 "Substance no; missing \"what to do about it\".",
 ["Substance yes; missing none.",
  "Substance no; missing \"why it happened, what to do about it\".",
  "Substance no; missing \"what happened\"."],
 "ON-06 records what happened and why and lacks its recommendation. ON-07, the \"Draft\", is the lesson missing \"why it happened, what to do about it\".")

q(0, "With u-grace's validation on record, may ON-05 now go out to everyone?",
 "Yes: the move to \"Published\" goes through.",
 ["No: a lesson must be embedded before it can be published.",
  "No: \"This lesson has not been validated.\"",
  "No: it waits until its review date of 2026-10-06 has passed."],
 "With a validation record by somebody other than the author, the move from \"Validated\" to \"Published\" is allowed. With the record removed, the same move is refused, because the engine asks for the record and never trusts the status alone.")

q(1, "How many lesson statuses does the engine know, and how many of those are visible to everyone?",
 "Seven, and two of them are visible to everyone.",
 ["Seven, and five of them are visible, being the live ones.",
  "Five, all of them live and visible.",
  "Seven, and three of them are visible, from validation onward."],
 "The seven are \"Draft\", \"Submitted\", \"Validated\", \"Published\", \"Embedded\", \"Archived\" and \"Superseded\". Five are live, three are accepted, and only \"Published\" and \"Embedded\" are visible.")

q(1, "Who may validate ON-01, which u-musa wrote?",
 "u-grace, who did not write it.",
 ["u-musa, provided a colleague's name is typed in the validator field.",
  "Anybody signed in, since the lesson is already \"Published\".",
  "Only an external reviewer named by display name."],
 "The digest records u-grace validating ON-01, read as if it were still \"Submitted\", as ALLOWED, and refuses u-musa with or without a typed colleague name.")

q(3, "A lesson is \"Embedded\". Which moves are still open to it?",
 "It can still be superseded by a successor, or archived.",
 ["None: \"Embedded\" is the last status a lesson reaches.",
  "\"Published\", if the application behind it is withdrawn.",
  "\"Superseded\" only, since an embedded lesson cannot be archived."],
 "From \"Embedded\" the legal table lists \"Superseded\" and \"Archived\". Embedded is visible and accepted, so an embedded lesson is still read and still reviewed until it is replaced or taken out of use.")

# ---- proof of use (section 16)

q(2, "What does ON-02's reuse record read?",
 "Total 1, applied 1, adopted 1, last applied 2026-06-10, targets changed \"Management of change\".",
 ["Total 1, applied 0, adopted 0, last applied null, targets changed none.",
  "Total 1, applied 1, adapted 1, last applied 2026-06-10, targets changed \"Procedure\".",
  "Total 2, applied 1, adopted 1, last applied 2026-09-20, targets changed \"Management of change\"."],
 "ON-02 has one application, AA-04, an adoption into \"Management of change\" on 2026-06-10, naming ES-06. 2026-09-20 is its review date, which has nothing to do with the reuse record.")

q(1, "A \"Draft\" lesson is asked to move straight to \"Published\". What does the engine say?",
 "\"A lesson that is draft can only move to Submitted, Archived.\"",
 ["\"This lesson has not been validated.\"",
  "\"A lesson that is draft is final.\"",
  "Nothing: the move is allowed when the lesson has substance."],
 "The legal table gives a draft two moves, to \"Submitted\" and to \"Archived\". A draft goes on through submission and validation, or it is archived.")

q(2, "An \"Archived\" lesson is asked to move to any other status. What comes back?",
 "\"An archived lesson is final.\"",
 ["\"Say why this lesson is being archived.\"",
  "\"A lesson that is archived can only move to Draft.\"",
  "Nothing: an archived lesson can be restored to \"Published\" by its author."],
 "\"Archived\" has no legal next status. The record of why a lesson left use stays as it was written, and the same holds for \"Superseded\".")

q(1, "A published lesson is being replaced, and the form reaches the engine with the successor field empty. What does it say?",
 "\"Name the lesson that replaces this one.\"",
 ["\"A lesson cannot supersede itself.\", since a blank successor reads as the lesson itself.",
  "\"Say why this lesson is being archived.\", as a supersede is treated as an archive.",
  "Nothing: the move is allowed and the successor can be added later."],
 "A superseded lesson has a successor, and naming it keeps the trail intact. \"A lesson cannot supersede itself.\" is the refusal when a lesson names itself.")

q(0, "A lesson's use in management of change is logged without saying which change it went into. What does the engine say?",
 "\"Name the change record this lesson went into.\"",
 ["\"Name the risk.\"",
  "\"Pick what this lesson was applied to.\"",
  "Nothing: a change register target needs only its target type to be recorded."],
 "Both Suite register targets carry a real key. A risk register target must name the risk and a change register target must name the change record, so a reader at either end can follow the trail.")

q(2, "An application arrives with an outcome the register does not know. What does the engine ask?",
 "\"Was the lesson adopted, adapted, or rejected?\"",
 ["\"Pick what this lesson was applied to.\"",
  "\"Say why it was not adopted.\"",
  "Nothing: an unknown outcome is recorded as \"Other\"."],
 "The refusal is a question, and it lists the three outcomes the engine knows. \"Other\" is one of the eight target types and has nothing to do with outcomes.")

q(0, "A lesson changed a site procedure, and the person logging it leaves the reference blank. Which sentence comes back?",
 "\"Name what changed (the procedure, the course, the standard) so somebody can go and look at it.\"",
 ["\"Name the change record this lesson went into.\"",
  "\"Pick what this lesson was applied to.\"",
  "Nothing: a procedure lives outside the Suite, so no reference can be checked and none is asked for."],
 "A procedure, a course or a standard lives outside the Suite, so the engine asks for a reference a person can follow. The target type is given here, which is why the question about what it was applied to does not arise.")

q(2, "ON-01's AA-03 was a \"Training\" application with the outcome \"Rejected\". What is \"Rejected\" in that sentence?",
 "An application outcome, which says nothing about the lesson's own status.",
 ["A lesson status, which moves ON-01 out of \"Published\".",
  "A comment status, carried over from the review of the lesson.",
  "A change stage, recorded against the training course."],
 "\"Rejected\" is a comment status, a change stage and an application outcome in this course. Here it is an outcome recorded against one target, and ON-01 is still \"Published\".")

# ---- lesson dates, the register, held items, goldens, history (sections 17, 18, 20)

q(2, "ON-10 is \"Published\" with its review date on 2026-11-01. Which review reading does it carry on 2026-10-01?",
 "Neither overdue nor due soon, being 31 days away.",
 ["\"review due soon\", as the lead is 30 days and both ends are counted in it.",
  "\"review due soon\", since every review in the next month is inside the lead.",
  "\"review overdue\", since it falls after the lead."],
 "Counting both ends, the lead on 2026-10-01 runs to 2026-10-31 and stops there. ON-10 is one day beyond it, so it reads neither.")

q(1, "An \"Embedded\" lesson had its review date on 2026-09-30. On 2026-10-01, is it overdue, due soon, or both?",
 "Overdue, one day past its date, and no longer due soon.",
 ["Due soon and not overdue, since a lesson has a day of grace after its date.",
  "Overdue and due soon together.",
  "Neither, since the review date is behind it."],
 "The edge table's row at -1 days, a review due 2026-09-30, reads overdue yes and due soon no. An embedded lesson is visible, so it carries a review status.")

q(3, "The ONNE summary reads live 8 and visible 5. Which lessons are outside the live count?",
 "ON-08 and ON-09.",
 ["ON-05, ON-06 and ON-07, which are not visible.",
  "ON-03 and ON-04, which nobody has applied.",
  "ON-06 and ON-07, which lack substance."],
 "Live is \"Draft\", \"Submitted\", \"Validated\", \"Published\" and \"Embedded\". ON-08 is \"Archived\" and ON-09 is \"Superseded\", so the ten lessons less those two give 8. Visible 5 is the four \"Published\" lessons and the one \"Embedded\".")

q(1, "In the ONNE summary, which lessons are awaitingValidation 1 and drafts 1?",
 "ON-06 awaiting validation, ON-07 the draft.",
 ["ON-05 awaiting validation, ON-07 the draft.",
  "ON-06 awaiting validation, ON-05 the draft.",
  "ON-07 awaiting validation, ON-06 the draft."],
 "ON-06 is \"Submitted\" and waits for somebody other than its author to validate it. ON-07 is the \"Draft\". ON-05 is already \"Validated\" and waits to be published.")

q(1, "What does the digest hold happens when an invalid as-of date reaches daysUntil?",
 "It answers NaN, and every date rule then reads as not due.",
 ["It refuses with a reason the user can act on, in the usual refusal shape.",
  "It falls back to the machine clock and answers for today.",
  "It answers 0, so every date reads as due on the as-of date."],
 "A comparison on NaN is false either way, so every date rule reads as not due. The digest lists this among the held items; nothing in this course passes an invalid date.")

q(3, "How many golden cases does the digest measure across the five files this course reads, and in how many time zones does the gate replay each?",
 "1037, and every case is replayed in five time zones.",
 ["1037, in one time zone, the one the digest was built in.",
  "345, the lessonsLearned file, in five time zones.",
  "1037, in two time zones, Lagos and UTC."],
 "The five files hold 77, 140, 291, 184 and 345 cases. The other five assurance golden files belong to Compliance, Audit & Quality.")

q(3, "How many held items does the digest list, and how many of them touch this tier's peer review and lessons registers?",
 "Nine, four of them in this tier.",
 ["Four, all of them in this tier's registers.",
  "Nine, none of them in this tier, since held items belong to the risk register.",
  "Five, one for each golden file."],
 "Five belong to the registers of the earlier tiers. The four in this tier are the comment whose review is missing from the summary's list, the reviewer named by display name only, publishing that does not check again who validated, and the application counts that include lessons that are not visible.")

q(1, "On 2026-10-01 the ONNE summary reads lessonsUnapplied 2. Which lessons are they?",
 "ON-03 and ON-04, the visible lessons with no adoption or adaptation.",
 ["ON-06 and ON-07, the two lessons that lack substance.",
  "ON-08 and ON-09, the two lessons out of use on the register.",
  "ON-03 and ON-05, the visible lessons whose reviews are inside the lead."],
 "ON-03's one application is a rejection and ON-04 has none, which is also why they lead lessonByAttention. ON-05 is not visible, and ON-06 to ON-09 are not counted because they are not visible either.")

q(2, "Repair history from AS15, as digest SECTION 20 frames it: which two defects did AS15 repair?",
 "Emergency changes used to need every level signed before implementation, and a lesson author used to be able to validate their own lesson by typing a name.",
 ["Actions on finished changes used to count as open work for ever, and a comment with no severity used to sort above Critical.",
  "A closed risk used to read review-overdue, and a change already in Implementation used to read overdue against its target date.",
  "Peer review used to hold no rule on who reviews, and several refusals used to read \"A archived\"."],
 "SECTION 20 marks both the emergency route and the typed-name validation as AS15. The actions repair is marked AS14, and the closed risk, the change in Implementation, peer review independence and the refusal copy are ASC-0 repairs.")

q(0, "Agreement between an engine and its independent oracle proves what, and leaves what open?",
 "That the engine does what the stated rule says on those inputs; whether the rule is right stays open.",
 ["That the rule is the right rule, since two methods reached it by different routes.",
  "That the held items are closed, since both methods agree on them.",
  "That the app displays what the engine computes."],
 "Whether the rule is right belongs to the owner decisions, taken on 2026-09-18. A limit both methods share is still a limit, and what the app shows is the app's part.")

# ---- one loop across four registers (section 19)

q(0, "ON-01's application into the risk register: on which date, with which outcome, naming which risk?",
 "2026-05-02, \"Adopted\", naming OB-07, Pump house flooded in the rainy season.",
 ["2026-07-14, \"Adapted\", naming OB-07, Pump house flooded in the rainy season, the date ON-01 was last applied.",
  "2026-05-02, \"Adopted\", naming ES-06, Revised operating procedure for glycol regeneration.",
  "2026-03-12, \"Adopted\", naming OB-07."],
 "2026-07-14 is AA-02, ON-01's adaptation into a procedure, and 2026-03-12 is ON-01's event date. ES-06 is the change ON-02 was applied into.")

q(2, "Which owner decision taken on 2026-09-18 reaches both the change register and peer review?",
 "D1, segregation of duties.",
 ["Q9, emergency change authority and the ratification window, which also sets review due dates.",
  "Q10, validation by typed name, which also governs who verifies a comment.",
  "Q3, fractional levels unscored."],
 "D1 holds segregation of duties on change approvals and, from ASC-0, on peer review. In peer review the engine enforces it now, and the app and database follow with the Suite pull request that ships ASC-0.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/advanced/asrca_exam.json', expect_n=42)
finish()
