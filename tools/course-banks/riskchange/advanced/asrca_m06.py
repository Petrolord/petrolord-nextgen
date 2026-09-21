import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Expert m06, The Expert Reading. Digest section 19, and sections
# 13 to 18 as the three lessons of m06 read them: the loop from a lesson into
# a risk and a change, the chain worked on IK-01 and ON-01, and where these
# engines hand over. 15 questions.

q(1, "ON-01 was applied into the risk register on 2026-05-02, naming OB-07, Pump house flooded in the rainy season. How does OB-07 read at the other end of that trail?",
 "\"Realized\", residual 8, \"Medium\", \"Within appetite\".",
 ["\"Closed\", residual 8, \"Medium\", \"Within appetite\", since the lesson has been applied to it.",
  "\"Realized\", residual 8, \"High\", \"Above appetite\", because the risk has already happened.",
  "\"Realized\", residual 12, \"High\", \"Within appetite\"."],
 "OB-07 is a record with its own state, decided by the riskScoring engine from its own fields. The lesson that names it points at that row, and the risk's status, residual, band and appetite answer stay the risk's own.")

q(3, "ON-02 was applied into the change register on 2026-06-10. Which change does it name, and what stage is that change in?",
 "ES-06, Revised operating procedure for glycol regeneration, now \"Closed\".",
 ["ES-06, Revised operating procedure for glycol regeneration, now in \"Implementation\".",
  "OB-07, Pump house flooded in the rainy season, now \"Realized\".",
  "ES-06, with its stage set to \"Embedded\" by the lesson that names it."],
 "\"Closed\" here is a stage of a change, decided by the managementOfChange engine from the change's own approvals and actions. \"Embedded\" is a lesson status, ON-02's own, and OB-07 is the risk ON-01 names.")

q(0, "AA-01 records ON-01 going into the risk register. What must that application carry for the engine to record it?",
 "The risk it points at, OB-07, so the trail can be walked from the lesson to the row and back.",
 ["Only its outcome, since a risk register target is a Suite register the engine already knows.",
  "The residual score of the risk at the time the lesson was applied.",
  "A reference to a procedure, as every application outside the Suite needs."],
 "The course records an application into the risk register that names the risk as ALLOWED, and refuses one that names no risk. Both ends carry a key: the lesson names the row, and the row is a record with its own state.")

q(2, "The ONNE summary reads intoRiskRegister 1 and intoMoc 1. Which applications are they?",
 "AA-01 and AA-04, the two applications into Suite registers.",
 ["AA-01 and AA-02, the two applications of ON-01 that changed something.",
  "AA-04 and AA-06, the two adoptions dated after 2026-06-01, whatever their targets.",
  "AA-03 and AA-05."],
 "AA-01 is ON-01 into the \"Risk register\", naming OB-07. AA-04 is ON-02 into \"Management of change\", naming ES-06. AA-02 went into a procedure and AA-06 into a maintenance plan, neither of them a Suite register.")

q(2, "ON-06 records its source type as \"Audit finding\". How far does this course go with that audit and its finding?",
 "It reads them only as the source of the lesson; they belong to Compliance, Audit & Quality.",
 ["It scores the finding on the five by five matrix before the lesson that cites it is validated.",
  "It follows the finding through its own lifecycle until the finding closes.",
  "It checks that the audit was independent before accepting the lesson."],
 "Compliance, Audit & Quality owns audit independence, the audit and finding lifecycles and root-cause categories. This course names an audit finding as the source of a lesson and stops there.")

q(0, "Working the chain on IK-01, a reader asks two questions of each comment to find its blockers. One is its severity. What is the other?",
 "Whether each comment's status is resolved.",
 ["Whether the review is overdue on 2026-10-01, since a late review cannot close.",
  "Who wrote each comment, since that decides blocking.",
  "How many comments the log holds in total, since blocking is a share of the total."],
 "Resolved first, then blocking: the resolved statuses are \"Verified\", \"Closed\" and \"Withdrawn\", which leaves 6 unresolved on IK-01. Asking those six for \"Critical\" or \"Major\" leaves 3 blocking.")

q(3, "In the chain, a reader is tempted to skip C-03 and C-04 on IK-01 because a response exists on one and a rejection is recorded on the other. Why must they stay in the blocking count?",
 "\"Responded\" and \"Rejected\" are both unresolved, and both comments are \"Major\".",
 ["They stay only until the coordinator records the review as overdue.",
  "A response or a rejection turns a \"Major\" comment into a \"Critical\" one.",
  "They must stay because every comment on a review in \"Verification\" blocks until it closes."],
 "Only the reviewer's verification turns a response into a resolved comment, and a rejection means the reviewer did not accept the response. Both statuses therefore still wait on somebody, and a \"Major\" comment that is unresolved blocks.")

q(1, "IK-01 is in \"Verification\" and was due 2026-09-29. What does the chain record for its overdue reading?",
 "Overdue on 2026-10-01, with that date written beside the verdict.",
 ["Overdue, with no date needed, because 2026-09-29 is in the past on every day this course is read.",
  "Not overdue, as \"Verification\" is finished.",
  "Not overdue, its blockers hold the clock."],
 "\"Verification\" is an active stage, and 2026-09-29 has passed on 2026-10-01. A status without its as-of date cannot be checked, because every date rule answers a different question on a different day.")

q(0, "ON-01's review is due 2026-10-20. What review status does the chain record for it on 2026-10-01?",
 "It is inside the lead, so the engine reads review due soon.",
 ["\"review overdue\", because ON-01 has passed 203 days of age since its event.",
  "Neither, because a lesson that is embedded has no review status.",
  "Neither, since 2026-10-20 sits outside the 30-day lead."],
 "ON-01 is visible and 2026-10-20 falls inside the 30-day lead on 2026-10-01, so it reads review due soon. Age carries no status of its own. Had ON-01 been \"Validated\" like ON-05, it would carry no review status at all.")

q(3, "With 2 applied on its reuse record, what does the chain record for marking ON-01 \"Embedded\"?",
 "Allowed.",
 ["Refused, because its rejected application must be withdrawn first.",
  "Refused: \"This lesson has been considered 1 time and adopted nowhere.\"",
  "Refused, until the review due on 2026-10-20 is done."],
 "An adoption into the \"Risk register\" and an adaptation into a \"Procedure\" are evidence of use, so the move is allowed. The considered-and-adopted-nowhere refusal is ON-03's, whose one application is a rejection.")

q(2, "ON-02 is \"Embedded\". Which record is the evidence of use that its status rests on?",
 "AA-04, its \"Adopted\" application into the change register, naming ES-06.",
 ["Its validation record, which is all Embedded asks beyond Published.",
  "AA-01, the adoption that named OB-07 in the risk register.",
  "Its review date, 2026-09-20, which keeps it current."],
 "Embedded is earned by an application that changed something: ON-04, with none, and ON-03, with only a rejection, are both refused it. ON-02's reuse record holds one application, AA-04, applied 1 into \"Management of change\". AA-01 is ON-01's, and a review date says nothing about use.")

q(1, "Segregation of duties in peer review, the author never reviewing the work, is held where today?",
 "In the engine; the app and the database follow with the Suite pull request that ships ASC-0.",
 ["In the app and the database already, with the engine following later.",
  "In the database only, as a constraint on who can be put on a review.",
  "Nowhere yet: it is listed among the held items as a limit."],
 "The engine enforces the rule now, from ASC-0, as owner decision D1 applied to peer review. A lesson that told a learner the app already refuses the author would be teaching something the course does not say.")

q(0, "Which of these does the peerReview engine hand to a person rather than decide itself?",
 "Whether the author's response is good enough to accept.",
 ["Whether a \"Major\" comment that is \"Rejected\" still blocks the review from closing.",
  "Whether the author may verify.",
  "Whether a comment with no response text may be verified by the reviewer."],
 "The engine checks that the right people acted and that the record is complete. It decides blocking, refuses the author a reviewer's move and refuses a verification with no response text. Whether a response deserves to be accepted it leaves to a person, in its own words: \"A reviewer independent of the work decides it.\"")

q(1, "The Lessons Learned dashboard and the ONNE register on 2026-10-01: what does the course record about reviewsOverdue and reviewsDueSoon?",
 "They read 1 and 2; the dashboard computes both and shows neither.",
 ["The dashboard displays them, and the engine leaves both uncomputed on this register.",
  "The engine computes them as 2 and 1, and the dashboard shows only the first of the two.",
  "Neither is computed, because the dashboard reads lessons one at a time."],
 "The engine's summary reads reviewsOverdue 1 and reviewsDueSoon 2 on the ONNE register. The course records beside them that the dashboard computes both and displays neither: the engine answers, and whether a user sees the answer is the app's part.")

q(3, "Across the three tiers of this course, the same kind of rule keeps the person with most interest in a yes from giving it. Which set of three refusals shows that rule?",
 "The originator approving a change, the author reviewing their own work, the author validating their own lesson.",
 ["The author responding to a comment, the coordinator closing it out, the reviewer withdrawing it.",
  "A band read from its lower edge, a residual that falls back, a target that declines.",
  "An archive with no reason, a supersede with no successor, a draft sent straight to publication."],
 "Segregation of duties runs through every register: the originator of a change never approves it, the author of work under review never reviews it, and the author of a lesson never validates it. The author's own response and the coordinator's close are allowed.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/advanced/asrca_m06.json', expect_n=15)
finish()
