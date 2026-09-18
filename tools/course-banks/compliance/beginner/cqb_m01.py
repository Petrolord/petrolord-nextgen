import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Associate m01, What the Register Derives. Written from digest.txt
# SECTIONS 1 and 2 as the four lessons of this module teach them: five apps and
# one as-of date, a date is a day, an unreadable date is no date, and the as-of
# date is an input the engine is given.

q(2, "The digest counts, for each module, the exports that read a date against today. Which module has the most of them?",
 "isoCompliance, with 10 of them.",
 ["qualityAssurance, with 7.",
  "documentControl, which exports 14 functions.",
  "complianceStatus, with 4."],
 "The export table prints 10 for isoCompliance, 7 for qualityAssurance and 4 each for complianceStatus, documentControl and auditManagement. The 14 is documentControl's count of exported functions, which is a different column."),

q(0, "Every figure in the digest is stated as true at 2026-10-15. What makes that statement safe to make?",
 "Every call that reads a date against today is passed that one date, and no line comes from a call that read the machine clock.",
 ["The digest was generated on 2026-10-15, so the machine clock and the as-of date agreed on the day it ran.",
  "Each module stores the date it was last run with, and reads it back on the next call.",
  "The records themselves carry 2026-10-15 as a field, which the engine copies into each status."],
 "The as-of date is an argument. The generator refuses to print a line from a call that did not pass it, so the same inputs give the same answers on any machine on any day."),

q(1, "At the as-of date, daysUntil of 2026-09-30 prints -15. What does the minus sign tell a reader?",
 "The day is already behind the as-of date, by 15 days.",
 ["An unreadable date, reported as -15.",
  "15 days still to go before that date.",
  "The date falls in a month the calendar pulls back, and the sign marks the pull."],
 "A positive count is a day still ahead, as 2026-11-30 reads 46. A negative count is a day already gone, and the as-of date itself reads 0. A refused input prints none, never a number."),

q(3, "The calendar is given the as-of date with a time late in the evening and an offset of fourteen hours written after it. What does parseDateOnly make of it, and what count does daysUntil give?",
 "2026-10-15, with a count of 0.",
 ["null, with a count of none.",
  "The day that instant falls on in the reading machine's own time zone, so the count depends on where it is read.",
  "2026-10-15 as an instant late in the evening, so its count is a fraction of a day short of the plain date."],
 "parseDateOnly reads the leading YYYY-MM-DD and nothing after it, at local midnight. The row prints 2026-10-15 and 0, the same as the plain date, so the answer is the same in Lagos and in Houston."),

q(1, "Which of these inputs has the correct YYYY-MM-DD shape and is still refused by parseDateOnly?",
 "2026-02-30, a day February does not have.",
 ["15/10/2026, a day written day first.",
  "2027-02-28, the last day of a short month.",
  "2026-11-30, a month end with thirty days."],
 "2026-02-30 is shaped correctly and names a day that does not exist, so it prints null. 15/10/2026 is also refused, for its shape. 2027-02-28 reads 136 and 2026-11-30 reads 46."),

q(0, "15/10/2026 names a real day. Why does the calendar still print null for it?",
 "The calendar reads only the YYYY-MM-DD order, and it refuses to guess which of the numbers is the month.",
 ["The day it names is the as-of date itself, and the calendar refuses to count a date against itself.",
  "It is read as the fifteenth month of 2026, a month the calendar cannot build.",
  "It is read correctly as a day, and only its daysUntil is withheld as none."],
 "A real day written in the order a person in Lagos might write it is still refused. A guess would put a date on the record that nobody chose, and every status derived from it would carry the guess."),

q(2, "REG-2026-013, the waste consignment register, has no due date and no expiry. What status does it read?",
 "No date set, with a reason saying nothing can fall due.",
 ["On track, because with no date on the record nothing has been missed so far and nothing is late.",
  "Overdue, a blank date read as one already passed.",
  "Draft, because an obligation with no dates is treated as one still being set up."],
 "explainStatus gives \"No due date or expiry date has been set, so nothing can fall due.\" The gap is shown with its own status word, and in the sorted register it sits tenth."),

q(3, "A published document in the IKORO library has the text tbc typed where its review date belongs. What review state does it read?",
 "No review scheduled",
 ["Review overdue, because an unreadable date is counted as a date long past.",
  "Not in force, because the calendar refuses the date and the document with it.",
  "Review scheduled, because tbc is read as a date far enough ahead to be outside the window."],
 "tbc is no date, so the document is in force with nothing scheduled for it. The library shows the gap to the reader instead of hiding it behind a date nobody entered."),

q(1, "Which module refuses to produce an answer when the date it is given as today cannot be read?",
 "complianceStatus, whose deriveStatus throws a RangeError.",
 ["documentControl, whose reviewState stops and names the bad date.",
  "qualityAssurance, whose isNcrOverdue throws for an open NCR.",
  "All three, each with its own error message."],
 "deriveStatus throws RangeError: deriveStatus needs a valid date for today. That refusal is owner decision AS15 Q1. The other two modules answer instead of refusing."),

q(0, "documentControl.reviewState is asked about a published document whose review date is 2020-01-06, with an unreadable Date as today. It returns Review scheduled. What does that answer say about the document?",
 "Nothing that can be trusted, because an unreadable today is refused by complianceStatus alone.",
 ["That the review has been booked for a date the engine chose in place of the unreadable one.",
  "That the document is in force and its review date of 2020-01-06 lies ahead.",
  "That the document has been reviewed, because a passed review date with no today is read as done."],
 "The digest records this as a held limit. reviewState answers as though nothing were due, and the course teaches it as a limit and never as a figure."),

q(2, "An open NCR was due 2020-01-06. qualityAssurance.isNcrOverdue is handed a today it cannot read. What is its answer?",
 "false",
 ["true, because 2020-01-06 is before any date the NCR could be read against.",
  "It throws a RangeError, as deriveStatus does.",
  "null, the value the calendar gives for an unreadable date."],
 "false says the NCR is not overdue, which no reader can rely on here. deriveStatus is the one export that throws; this answer is recorded in SECTION 2 as a limit."),

q(3, "documentControl.reviewState is passed today as the STRING 2026-10-15. What happens?",
 "It throws TypeError: d.getFullYear is not a function.",
 ["It parses the string at local midnight and returns the same review state it gives for the Date.",
  "It returns Review scheduled.",
  "It returns Not in force."],
 "The as-of date has to be passed as a date. A string that spells the right day is still the wrong kind of value, and the call fails."),

q(1, "What does owner decision AS15 Q1 state?",
 "An unreadable today makes deriveStatus throw.",
 ["An unreadable today makes every module answer as though nothing were due.",
  "A today passed as a string is read at local midnight.",
  "An unreadable record date reads as today."],
 "Q1 is the refusal the digest prints for deriveStatus: RangeError: deriveStatus needs a valid date for today. The two other modules answering as though nothing were due is a held limit, and a string today makes reviewState throw a TypeError."),

q(2, "The panel lets you move the as-of date. When you move it, statuses change. What was edited on the records in between?",
 "Nothing. The same records read against another date give other statuses.",
 ["Each record's status field, rewritten by the panel.",
  "Each record's due date, shifted by the panel.",
  "The lead time on each record, shortened by the panel."],
 "That is what derived means in this course. A status is never typed, so moving the date back to 2026-10-15 makes every row match the digest again."),

q(0, "The digest's header says in what form it prints every figure. Which form is that?",
 "Whole numbers: day counts, counts, and percents the engine has already rounded.",
 ["Days and fractions of a day, so a late evening time reads short of the plain date.",
  "Working days, so a weekend that falls between two dates is left out of a count.",
  "Whole weeks, with each day count rounded to the nearest week before it prints."],
 "The header reads: every figure is a whole number, days from daysUntil and ages, counts, and percents the engine has already rounded. 2026-11-30 reads 46 and 2027-02-28 reads 136, and the lessons quote those figures as printed."),
emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/beginner/cqb_m01.json', expect_n=15)
finish()
