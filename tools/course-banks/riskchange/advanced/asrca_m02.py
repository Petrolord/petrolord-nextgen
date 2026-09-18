import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Expert m02, Closing a Review. Digest section 14 only, as the four
# lessons of m02 teach it: the IK-01 log, the IKANG register on 2026-10-01 and
# segregation of duties in peer review. 15 questions.

q(1, "IK-01, Water injection pump selection, carries nine comments. Which of them block the review from closing?",
 "C-01, C-03 and C-04.",
 ["C-01, C-02 and C-08.",
  "C-01, C-06, C-07 and C-09.",
  "C-01 and C-03."],
 "A comment blocks when its severity is \"Critical\" or \"Major\" and its status is unresolved. C-02 and C-08 are \"Critical\" and resolved. C-06, C-07 and C-09 are open and never block, being \"Minor\", \"Editorial\" and unrated. C-04 is \"Major\" and \"Rejected\", which is unresolved.")

q(3, "C-04 on IK-01 is a \"Major\" comment whose status is \"Rejected\". Why does it still block?",
 "\"Rejected\" is unresolved: the reviewer did not accept the author's response.",
 ["A rejection drops the comment from the review, so it blocks only until it is closed out.",
  "Every \"Major\" comment blocks whatever its status, until the coordinator closes the review.",
  "The engine reads a \"Rejected\" comment as \"Critical\" once the reviewer has refused a response to it."],
 "The resolved statuses are \"Verified\", \"Closed\" and \"Withdrawn\". \"Rejected\" is not among them, so a \"Major\" comment in that status is both blocking in severity and unresolved in status. C-05 is \"Major\" too and does not block, because it is \"Withdrawn\".")

q(0, "The coordinator asks the engine to close IK-01 as it stands. What comes back?",
 "A refusal: \"1 critical and 2 major comments still need resolving. Verify, close out or withdraw them first.\"",
 ["A refusal: \"3 critical and 3 major comments still need resolving. Verify, close out or withdraw them first.\"",
  "A refusal: \"1 critical and 2 major comments still need resolving. Respond to each of them and ask the reviewer again first.\"",
  "The close is allowed, because IK-01 is already in \"Verification\"."],
 "The sentence counts the blockers by severity: C-01 is the one \"Critical\", C-03 and C-04 the two \"Major\". The log holds 3 \"Critical\" and 3 \"Major\" in all, but only unresolved ones are counted, and the way forward names the three moves that resolve a comment.")

q(2, "One move later C-01 has been withdrawn. The coordinator asks again to close IK-01. What does the engine answer?",
 "Still refused, with C-03 and C-04 blocking, 2 in all, both \"Major\" and unresolved.",
 ["Allowed, because no \"Critical\" comment is left unresolved on the log.",
  "Still refused, with C-01, C-03 and C-04 blocking, because a withdrawal needs the coordinator's close.",
  "Allowed, since C-03 already carries a response from the author."],
 "Withdrawing C-01 resolves it. C-03 is \"Responded\" and C-04 is \"Rejected\", both unresolved \"Major\" comments, and a \"Major\" blocks as surely as a \"Critical\". A response is a claim the reviewer has not yet accepted.")

q(0, "IK-01's blocking comments are withdrawn. C-06 (\"Minor\"), C-07 (\"Editorial\") and C-09 (no severity) are still \"Open\". May the review close?",
 "Yes: the close is allowed with those three still open.",
 ["No: 3 open comments remain, and a review waits for every open comment before it closes.",
  "No: C-09 carries no severity, so the engine reads it as \"Critical\" and it blocks the close.",
  "No: the close waits until the coordinator has closed out C-02 and C-08 first."],
 "Only \"Critical\" and \"Major\" block. The digest records the close as ALLOWED with a Minor, an Editorial and an unrated comment still Open. Verified comments waiting on the coordinator hold nothing open either, because they are resolved.")

q(3, "summarise is run over IK-01 and its own log. What are totalComments, openComments and blockingComments?",
 "9, 6 and 3: every comment, every unresolved comment, and the unresolved ones rated \"Critical\" or \"Major\".",
 ["9, 4 and 3, since only comments whose status reads \"Open\" are counted as open.",
  "8, 6 and 3, since the unrated C-09 is left out of every count.",
  "9, 6 and 5, since every \"Critical\" and \"Major\" comment counts as blocking."],
 "Open counts every unresolved status: four \"Open\", one \"Responded\" and one \"Rejected\" make 6. Blocking is the unresolved comments rated \"Critical\" or \"Major\", which is 3. The total is every comment on the log, C-09 included.")

q(1, "Where does the summary put C-09, the IK-01 comment that carries no severity?",
 "In totalComments and openComments, and in no severity column, since it has no severity to be counted under.",
 ["In the \"Editorial\" column, the lowest severity, as well as in totalComments and openComments.",
  "In blockingComments, because a comment with no severity is treated as \"Critical\".",
  "Nowhere, since an unrated comment is left out of the summary."],
 "C-09 is a real comment, so it is in the total, and it is \"Open\", so it is in the open count. It has no severity to be counted under, which is why the severity columns read \"Critical\" 3, \"Major\" 3, \"Minor\" 1 and \"Editorial\" 1 and sum to 8.")

q(2, "bySeverityThenAge sorts IK-01's log for the coordinator. Which order does it return?",
 "C-01, C-03, C-04, C-06, C-07, C-09, C-08, C-02, C-05.",
 ["C-09, C-01, C-03, C-04, C-06, C-07, C-08, C-02, C-05.",
  "C-01, C-02, C-08, C-03, C-04, C-05, C-06, C-07, C-09.",
  "C-01, C-03, C-04, C-09, C-06, C-07, C-08, C-02, C-05."],
 "Unresolved comments come first, worst severity first within them, then the resolved ones. The three blockers lead. The unrated C-09 sorts after every rated unresolved comment, the \"Editorial\" C-07 included, so a missing severity never lifts a comment above a rated one.")

q(3, "IK-02 is \"In Review\" with a due date of 2026-10-01. What does isOverdue answer on 2026-10-01?",
 "Not overdue: a review due on the as-of date is on time.",
 ["Overdue, because its due date has arrived on the as-of date.",
  "Overdue, because C-12, an open \"Major\" comment, sits on it.",
  "Not overdue, because \"In Review\" is not one of the active stages."],
 "A due date is the last day the work is on time, so a review is overdue only once the date has passed. IK-01, due 2026-09-29, has passed it and reads overdue. \"In Review\" is an active stage, and comments play no part in the overdue rule.")

q(1, "On 2026-10-01 a coordinator checks IK-04, a review in the \"Cancelled\" stage whose due date of 2026-08-01 passed long before. Is it overdue?",
 "Not overdue, whatever its date: isOverdue asks the stage first, and \"Cancelled\" never reads overdue.",
 ["Overdue, because 2026-08-01 is before the as-of date and the stage plays no part.",
  "Overdue, until the comments C-10 and C-11 on it are withdrawn.",
  "Not overdue, but only because its due date is more than 30 days past."],
 "isOverdue asks the stage first. At the same past due date, 2026-09-30, \"Draft\", \"In Review\" and \"Verification\" read overdue, and \"Closed\" and \"Cancelled\" do not. A cancelled review has no work left to be late with.")

q(0, "The whole IKANG register, five reviews and 12 comments, is summarised on 2026-10-01. What are totalComments, open and blocking?",
 "12, 7 and 4, with C-10 and C-11 kept in the total alone.",
 ["12, 9 and 6, with C-10 and C-11 on IK-04 counted as open and blocking.",
  "10, 7 and 4, with C-10 and C-11 left out of the comment total.",
  "12, 8 and 5, with C-12 counted twice across two reviews."],
 "C-10 and C-11 sit on IK-04, which is \"Cancelled\" and locked, so nobody can resolve them. They stay in the total and in the severity and status columns and leave the open and blocking counts. C-12 is on IK-02, which is live, so the counts are IK-01's 6 and 3 each with C-12 added.")

q(2, "u-efe, the author of IK-01, is put on the review with no role given at all. What does the engine do?",
 "It refuses in the words it uses for a Reviewer, so a blank role is no way round the rule.",
 ["It allows u-efe on as an Observer, the role a blank is read as.",
  "It refuses with \"Choose the reviewer.\", because no role was chosen.",
  "It allows it, because the rule reaches only the two named reviewer roles and a blank names neither of them."],
 "The engine refuses the author as a Reviewer, as the Lead Reviewer and with no role given, each time with \"The author of the work under review cannot review it. Choose somebody independent of the work.\" Only an explicit Observer is allowed, because watching judges nothing.")

q(3, "u-efe, the author of IK-01, asks to withdraw C-01, an \"Open\" comment on that work. What comes back?",
 "Refused: \"The author of the work under review cannot withdraw a comment on it. A reviewer independent of the work decides it.\"",
 ["Allowed, because \"Withdrawn\" is a legal next status from \"Open\" for anybody signed in.",
  "Refused: \"An open comment can only go to Responded or Withdrawn.\", since the author must respond before anything else can happen.",
  "Allowed, because the author may take back any comment before responding to it."],
 "The move is legal in the table. It is refused because of who asks: \"Verified\", \"Rejected\" and \"Withdrawn\" are the reviewer's moves, and the author never takes them. An author who could withdraw a \"Critical\" comment could clear a blocker without answering it.")

q(0, "u-efe, the author of IK-01, asks to close out C-02, a comment the reviewer has already verified. What does the engine answer?",
 "Allowed: the rule leaves the coordinator's move unrestricted.",
 ["Refused: \"The author of the work under review cannot verify a comment on it.\"",
  "Refused: \"A verified comment can only go to Closed.\", since the author asked.",
  "Refused: \"Sign in to act on this comment.\""],
 "Segregation of duties in peer review restricts the reviewer's three moves. The author's own move, \"Responded\", and the coordinator's, \"Closed\", are not restricted by it, and closing out a verified comment is administrative once the reviewer has accepted the response.")

q(1, "An external reviewer is put on IK-01 named only by display name. What does the engine do, and what does that show about the independence rule?",
 "It allows the reviewer, since a display name alone cannot be matched to the author, and the digest holds that as a limit.",
 ["It refuses, because every reviewer has to be a signed-in user of the app.",
  "It refuses with \"Choose the reviewer.\", because a display name alone names nobody.",
  "It allows the reviewer as an Observer only, so nothing on the review can be judged by them."],
 "The digest records the external reviewer as ALLOWED and lists the limit among the held items: a reviewer named by display name only cannot be matched to the author, and a review with no author recorded cannot be checked either.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/advanced/asrca_m02.json', expect_n=15)
finish()
