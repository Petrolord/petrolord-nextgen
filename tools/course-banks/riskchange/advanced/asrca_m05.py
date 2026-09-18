import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Expert m05, What the Engines Do Not Know. Digest sections 17, 18
# and 20, as the five lessons of m05 teach them. The two history questions are
# framed by their own prompts, which open "Repair history", and draw only on
# SECTION 20. 15 questions.

q(2, "A visible lesson's review is due 2026-10-31. How does it read on 2026-10-01?",
 "\"review due soon\", being 30 days away, and not overdue.",
 ["Neither, being one day outside the lead.",
  "\"review overdue\", because a lesson inside its lead is already late for review.",
  "\"review due soon\" and \"review overdue\" together, since the lead has been entered."],
 "REVIEW_LEAD_DAYS is 30, with both ends counted, so a review 30 days away is still due soon. At 31 days away, a review due 2026-11-01, the lesson reads neither. No row of the edge table reads both.")

q(0, "On 2026-10-01, the as-of date, a published lesson reaches its review date that very day. Which review status does the engine give it?",
 "Due soon and not overdue: 0 days away, the date has arrived and has not passed.",
 ["Overdue and not due soon, because the review date has been reached.",
  "Neither, because a review due today is outside the lead.",
  "Overdue and due soon together."],
 "A lesson reads review overdue only once its date has passed, which is the row at -1 days, a review due 2026-09-30. At 0 days the lesson is inside the lead, so it reads due soon.")

q(3, "ON-05 has been validated and is not yet published, and its review falls on 2026-10-06. Which review status does the engine give it on 2026-10-01?",
 "None at all.",
 ["\"review due soon\", being inside the 30-day lead before its date.",
  "\"review overdue\", because a validated lesson has to be reviewed before it can be published.",
  "\"review due soon\", counted in reviewsDueSoon on the summary."],
 "Only a visible lesson, \"Published\" or \"Embedded\", has a review status. ON-05 is accepted and not yet visible to anybody, so it reads neither overdue nor due soon, and reviewsDueSoon 2 is ON-01 and ON-03.")

q(1, "On 2026-10-01 the ONNE summary reads reviewsOverdue 1. Which lesson is it, and why?",
 "ON-02, \"Embedded\", whose review date of 2026-09-20 has passed.",
 ["ON-08, \"Archived\", at 607 days the oldest lesson on the register.",
  "ON-05, \"Validated\", whose review date is only days away.",
  "ON-04, \"Published\", which has no review date at all."],
 "Age carries no status of its own. ON-02 is visible and its review date has passed, so it is the one overdue review. ON-08 is not visible and has no review status, and ON-04 with no review date reads neither.")

q(1, "The ONNE summary reads lessonsApplied 3 and applied 4. What does each count?",
 "lessonsApplied counts visible lessons; applied counts applications.",
 ["Both count applications, lessonsApplied over visible lessons only and applied over every lesson.",
  "Both count lessons, and applied also includes the lessons that were rejected somewhere.",
  "lessonsApplied counts applications and applied counts lessons."],
 "lessonsApplied 3 is ON-01, ON-02 and ON-10, the visible lessons with at least one adoption or adaptation. applied 4 counts the adopting and adapting applications themselves, two of which belong to ON-01.")

q(3, "lessonByAttention orders the ONNE register on 2026-10-01. Why does ON-03 come before ON-04?",
 "Both are visible lessons nobody has applied, and ON-03's event date, 2026-06-05, is newer than 2026-05-30.",
 ["ON-03 has a review date inside the lead and ON-04 has none.",
  "ON-03 has an application on its log and ON-04 has none.",
  "ON-03 is older, and older lessons come first within a rank."],
 "The ranks run: visible lessons nobody has applied, then lessons awaiting validation, then overdue reviews, then other live lessons, then the rest, newest event first within a rank. ON-03 and ON-04 share the first rank, so their event dates decide.")

q(0, "A lesson's age is counted to the as-of date. From which date is it counted?",
 "From its event date.",
 ["From the date it was validated, when the organisation accepted it.",
  "From its last applied date, since that is the last time it was used.",
  "From the local date of its creation timestamp, whatever else it records."],
 "Age counts from the event date. Only a lesson with no event date falls back to its creation timestamp, read as the local calendar date, so the same row can be a day older in Lagos than in UTC. Every ONNE lesson records its event date.")

q(2, "The application counts in the lessons summary carry a stated limit. Which one does the digest list among the held items?",
 "They include applications on lessons that are not visible.",
 ["They leave out rejections.",
  "They count only the visible lessons' applications, like lessonsApplied does.",
  "They count each lesson once, however many applications it has on its log."],
 "The lesson counts beside them, lessonsApplied and lessonsUnapplied, cover visible lessons only. The application counts do not narrow the same way, and the digest lists that as a held item taught as a limit and graded nowhere.")

q(3, "A peer review summary is handed a comment whose review is missing from the list of reviews. What does the digest hold it does?",
 "It still counts the comment as open work, as an MOC action with an unknown change does.",
 ["It drops the comment from every count, because nothing can be read without its review.",
  "It refuses the whole summary until the missing review is added to the list it was handed.",
  "It counts the comment in the total only."],
 "The summary keeps a finished review's comments out of the open and blocking counts only when it can see the review. A comment it cannot place is counted as open work, and the digest lists that as a held item.")

q(1, "Which of these is an owner decision taken on 2026-09-18 under AS15?",
 "Q3, fractional levels unscored.",
 ["A band found by its lower edge alone, so any positive score bands.",
  "countByBand counting whatever population it is handed by the caller.",
  "Publishing checking only that a validation record exists."],
 "The owner decisions are D1, Q9, Q10 and Q3. The other three options are held items: limits no owner has decided, taught as limits. An engine that disagrees with an owner decision is wrong; a held item is a stated boundary.")

q(0, "What does owner decision D1 cover in these engines?",
 "Segregation of duties on change approvals and, from ASC-0, on peer review.",
 ["Segregation of duties on lesson validation by a typed name.",
  "The emergency change authority and the ratification window.",
  "Fractional levels, left unscored on the matrix."],
 "Q10 is validation by typed name, Q9 is emergency change authority and the ratification window, and Q3 is fractional levels unscored. All four were taken on 2026-09-18 under AS15.")

q(2, "The digest measures peerReview_cases.json by reading it. What does it record for cases, cases carrying a repaired marker, and functions exercised?",
 "184, 38 and 17.",
 ["345, 19 and 26.",
  "184, 17 and 38.",
  "291, 69 and 15."],
 "345, 19 and 26 are lessonsLearned_cases.json, and 291, 69 and 15 are managementOfChange_cases.json. Golden cases total 1037 across the five files, and the gate replays every case in five time zones.")

q(2, "A golden case and the oracle bridge both check the engine. On which records does each check it?",
 "A golden case on the records the oracle author chose; the bridge on this course's records.",
 ["Both on this course's records, the golden case in five zones and the bridge in one zone.",
  "A golden case on this course's records; the bridge on the records the oracle author chose.",
  "Both on the oracle author's records, replayed from the golden files."],
 "The bridge, oracle_bridge.py, replays every engine answer in the digest, IKANG and ONNE included. A defect that shows on only one record slips past a check that never meets it, which is why both exist.")

q(3, "A change has finished, and one of its actions still reads \"Open\". What do openActions and overdueActions do with that action today?",
 "They skip it: a finished change is locked, so its actions are not open work.",
 ["They count it as open work until the action itself reads \"Complete\" or \"Cancelled\".",
  "They skip it only on a change in the Closed stage, and count it on a Cancelled one.",
  "They skip it, as they skip an action whose change is not in the register."],
 "On 2026-10-01 the summary skips AC-06 and AC-07, whose changes, ES-06 in the Closed stage and ES-09 \"Cancelled\", are finished and locked, and a probe on the \"Rejected\" ES-11 counts its open action nowhere. AC-09, whose change is not in the register, still counts, and the digest holds that as a limit.")

q(0, "Today, how does the peer review summary count an unresolved \"Critical\" comment that sits on a \"Cancelled\" review?",
 "In the comment total and its severity and status columns, and in neither the open nor the blocking count.",
 ["In the open and blocking counts for as long as it stays unresolved, whatever its review's stage.",
  "Nowhere at all, the comment total included, because its review is locked.",
  "In the open count and not the blocking count, because nobody can resolve it."],
 "A \"Cancelled\" review is locked, and nobody can move a comment on it, so a work count that included one could never fall. The summary lists such a comment in every column that describes the log and leaves it out of the counts of work still owed. The digest's case is C-10 on IK-04.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/advanced/asrca_m05.json', expect_n=15)
finish()
