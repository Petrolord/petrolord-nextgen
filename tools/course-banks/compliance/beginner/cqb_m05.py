import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Associate m05, Controlled Documents. Written from digest.txt
# SECTIONS 8 and 9 as the five lessons of this module teach them: in force and
# not in force, the review date earned at issue, revision numbers that keep
# their width, the author who does not review (AS15 D1), and the review queue.

q(2, "documentControl.DOC_STATUSES holds seven words. Which of them does documentControl.EFFECTIVE_STATUSES treat as in force?",
 "Published and Approved.",
 ["Published alone.",
  "Published, Approved and In Review.",
  "Every status except Obsolete and Rejected."],
 "EFFECTIVE_STATUSES holds Published and Approved, the two statuses a document carries once it has been signed off for people to work to. A document in any other status reads Not in force."),

q(0, "HSE-PRO-0007 and OPS-PRO-0004 both have review dates behind the as-of date. HSE-PRO-0007 reads Review overdue and OPS-PRO-0004 reads Not in force. What separates them?",
 "OPS-PRO-0004 is Superseded, a status outside EFFECTIVE_STATUSES, and reviewState reads only documents in force.",
 ["OPS-PRO-0004's review date, 2020-01-06, is too far back for the review window to reach.",
  "OPS-PRO-0004 is a Draft, and reviewState waits for a Draft to be published.",
  "HSE-PRO-0007 is a procedure, and only procedures are read against a review date."],
 "The old custody metering procedure is Superseded and nobody works to it. Calling it Review overdue would put a dead document at the top of a live queue, so it reads Not in force whatever its date."),

q(3, "OPS-PHI-0001, the flare management philosophy, is Published with no review date on the record. What review state does it read, and what does that ask of the document controller?",
 "No review scheduled: give it a review date.",
 ["Not in force: withdraw it.",
  "Review overdue: review it now.",
  "Review scheduled: nothing yet, because an undated document is left to the default review period."],
 "A document in force with no review date is one nobody has committed to looking at again. The library shows it as its own state so it can be found and given a date."),

q(1, "documentPrefix builds a document number prefix from a department and a category. What does it give for 'QA' and 'ITP'?",
 "QA-ITP",
 ["QAI-ITP",
  "GEN-DOC",
  "QA-ITP-0001"],
 "documentPrefix takes the first three letters of each, and two letters of 'QA' stay two letters. GEN-DOC is what an empty department and category give."),

q(2, "A document issued 2025-03-14 on a 24 month review period is corrected and re-published on 2026-10-01. When does Document Control put its review?",
 "2027-03-14, counted from the issue date.",
 ["2028-10-01, counted from the correction.",
  "2026-10-01, the day the correction was re-published.",
  "No date at all, because a re-published document starts with none."],
 "nextReviewDate counts from the issue date. A correction is not the full review the period asks for, and if it reset the clock a document could be kept from review indefinitely."),

q(0, "nextReviewDate is called for an issue date of 2025-03-14 with the review period missing, as null. What does it return, and whose job is the default?",
 "No date. Applying DEFAULT_REVIEW_PERIOD_MONTHS is the caller's job.",
 ["2027-03-14, because the function applies DEFAULT_REVIEW_PERIOD_MONTHS itself.",
  "A refusal naming the missing review period as a required field.",
  "The issue date itself, so the document comes up for review at once."],
 "The digest prints none for a period of null and for a period of 0. It prints 2027-03-14 only when the caller passes 24, DEFAULT_REVIEW_PERIOD_MONTHS. The owner's recorded position is that the default is the caller's to apply, and the course teaches it as a limit."),

q(3, "nextRevisionNumber is given the current revision '7'. What does it return?",
 "'08'",
 ["'8'",
  "'07'",
  "'01'"],
 "A revision written with one digit comes back padded to two. Keeping the width keeps the text order and the number order the same, so '09' then '10' sorts correctly as text."),

q(1, "nextRevisionNumber is given the letter 'A', and separately null. What does it return for each?",
 "'01' for both.",
 ["'B' for the letter and '01' for null.",
  "A refusal for both.",
  "'02' for both."],
 "A revision that is not a number, whether a letter, an empty string or null, starts a numbered sequence at '01' because the engine has nothing it can count from. ' 04 ' with spaces around it gives '05'."),

q(2, "On revision rev-0019-10 of ENG-PRO-0019, authored by u-adaeze, the author assigns herself as reviewer. What does the engine answer?",
 "REFUSED: The author of a revision cannot review it. Choose somebody independent of the draft.",
 ["REFUSED: Only the reviewer this task is assigned to can decide it.",
  "ALLOWED, with a warning recorded against the task.",
  "REFUSED: Choose the reviewer."],
 "This is the first of the two author checks, made at assignment. The rule is owner decision AS15 D1: a document review task is decided only by its assigned reviewer."),

q(3, "No reviewer is chosen for the revision. What does the engine answer, and why does that refusal come before any decision?",
 "REFUSED: Choose the reviewer. Nobody is named to check against the author.",
 ["ALLOWED, an empty field counts as independent.",
  "REFUSED: The author of a revision cannot review it, because an empty field defaults to the author.",
  "ALLOWED, the task falls to the document controller."],
 "The gate needs two named people on the record, the author and the reviewer. The engine will not treat an empty field as independent."),

q(0, "The author was assigned as reviewer by mistake and now tries to decide the task. At which step is she stopped, and why?",
 "At the decision, which is checked against the author as well.",
 ["Nowhere, because the assignment made her the reviewer of the task.",
  "At assignment only, so the decision itself goes through.",
  "At the decision, because an approved task cannot be decided again."],
 "The engine answers REFUSED: The author of a revision cannot approve it. A slip at assignment does not become an approval, which is why the rule is checked twice."),

q(1, "Somebody other than the assigned reviewer, however senior, decides the task on the reviewer's behalf. What does the engine answer?",
 "REFUSED: Only the reviewer this task is assigned to can decide it.",
 ["ALLOWED, because the decider is not the author and so is independent of the draft.",
  "REFUSED: The author of a revision cannot approve it.",
  "ALLOWED, once the assigned reviewer's name is recorded beside the decision."],
 "Independence from the author is not enough at the decision step. Only the reviewer the task is assigned to may decide it."),

q(3, "EFFECTIVE_STATUSES treats two statuses as in force. Name the document in force that the published count of 3 leaves out.",
 "ENG-STD-0011, the tank inspection standard, which is Approved.",
 ["OPS-PHI-0001, which summarise leaves out for having no review date.",
  "OPS-PLA-0002, which summarise moves to the review due soon count.",
  "HSE-PRO-0007, which summarise counts only under review overdue."],
 "EFFECTIVE_STATUSES holds Published and Approved. The status counts read Published 3 and Approved 1: the sampling procedure, the emergency response plan and the flare philosophy are Published, and the tank inspection standard is Approved."),

q(2, "byReviewUrgency places OPS-PHI-0001, which has no review date, fourth in the queue. Why does it sit above every document that is not in force?",
 "Review states decide the order first, and No review scheduled comes before Not in force.",
 ["Undated documents go first within the queue, so the missing date lifts it.",
  "It is Published, and Published documents always sort above Approved and Draft ones.",
  "Its number sorts ahead of the three documents below it."],
 "The review states come first in the order Review overdue, Review due soon, Review scheduled, No review scheduled and then Not in force. Within a state the nearest date comes first and undated documents go last."),

q(1, "OPS-PRO-0004 carries the oldest review date in the library, 2020-01-06, at -2474 days. Where does it sit in byReviewUrgency, and why?",
 "Fifth, first of the three not in force, because it is the only one of them with a review date.",
 ["First, because the most passed review date in the library is the most urgent one.",
  "Seventh, because a Superseded document is always the last row of the queue.",
  "Fourth, because its passed date lifts it above the one undated document in force."],
 "Its review state is Not in force, so a passed date does not raise it above any document in force. Among the three not in force, the nearest review date comes first and undated documents go last."),
emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/beginner/cqb_m05.json', expect_n=15)
finish()
