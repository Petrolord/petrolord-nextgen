import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Associate m04, The Calendar Date. Written from digest.txt
# SECTION 4, which is the four lessons of this module: whole days between two
# dates, due today is not overdue, a date that does not exist, and one as-of
# date in every time zone. Every dated answer is true on 2026-10-01.

q(1, "Counted by daysUntil from the as-of date 2026-10-01, how many days away is 2026-10-31?",
 "30",
 ["31",
  "29",
  "30 back"],
 "From 2026-10-01 to 2026-10-31 is the thirty days of October that follow the first, so daysUntil returns 30. The first of November, 2026-11-01, is one day further at 31."),

q(2, "What does daysUntil return for 2027-01-01, counted from 2026-10-01?",
 "92, a positive count, as the date is still to come",
 ["92 back, as the date falls in another year",
  "60, as the calendar counts every month in the gap as exactly 30 days",
  "3, a count of the months between the two dates"],
 "A date after the as-of date is positive, a date before it negative, and the as-of date itself 0. The first day of 2027 is 92 whole days after 2026-10-01."),

q(0, "A record carries the date 2025-10-01. Read on the as-of date, how many whole days lie between them, sign included?",
 "-365",
 ["365",
  "-1, one year expressed as a count of years",
  "null, as a date a year earlier is outside the window the calendar reads"],
 "The sign is read first: a date already gone is negative. A date one year before 2026-10-01 is -365 days away."),

q(3, "OB-01, an \"Open\" risk, falls due for review on 2026-10-01, the as-of date itself. Which pair of answers does the engine give on that day?",
 "0 days, and not overdue",
 ["0 days, and overdue, since the review has not happened",
  "-1 days, and overdue",
  "1 day, and not overdue, as the due date counts as the day before"],
 "A review is overdue only when days until is below zero. OB-01's days until on 2026-10-01 is 0, and 0 is not below zero: the review is due today and the day is not over."),

q(0, "OB-02 is \"Open\" and its next review is 2026-09-30. On 2026-10-01, is its review overdue?",
 "Yes: it is live and its days until is -1, below zero.",
 ["No: one day late is inside a tolerance.",
  "No, because -1 rounds to 0 in whole days.",
  "Yes, but only in a zone behind UTC."],
 "A risk review is overdue when the risk is LIVE and its review date has PASSED. OB-02 is \"Open\" and 2026-09-30 is -1 days from 2026-10-01, so on that date it is overdue in every time zone."),

q(2, "A \"Closed\" risk's review date passed the day before the as-of date. The same risk, marked \"Open\", is asked the same question. What are the two overdue answers?",
 "Closed: no, and Open: yes.",
 ["Closed: yes. Open: yes, as both dates are past.",
  "Closed: no. Open: no, as one day late is still read as on time.",
  "Closed: yes. Open: no."],
 "The test asks the status first. Only a live risk carries a review obligation, so the \"Closed\" copy is never overdue whatever its date, while the \"Open\" copy with days until of -1 is."),

q(1, "What is the parsed value of \"2026-02-30\" in calendar.js, and what is its days until from 2026-10-01?",
 "null, and null: an impossible date is no date at all",
 ["2026-03-02, as the date rolls into March",
  "2026-02-28, pulled back to the month's end",
  "It is refused with a reason"],
 "A date that does not exist is no date at all, and the engine never rolls an impossible date over into a real one. A rolled-over date would look valid and carry a sensible count, which is exactly what makes it dangerous."),

q(3, "A review date on a record reads \"2026-13-01\". How does the calendar module read it?",
 "It parses it to null.",
 ["It rolls the thirteenth month into January of the next year.",
  "It reads the month as 1 and keeps the year, since 13 is taken as a typing slip.",
  "It keeps the year and reads the date as the first day of that year."],
 "A thirteenth month parses to null, the same as 30 February and the same as text such as \"after the turnaround\". The engine never guesses which real date was meant."),

q(3, "An \"Open\" risk carries a review date of 30 February. What are its days until and its review overdue answer on 2026-10-01?",
 "Days until null, overdue no",
 ["Days until negative, overdue yes, since February is before October",
  "It is flagged overdue until a readable date replaces it",
  "Days until null, overdue yes, as an unreadable date is treated as late"],
 "A live risk with no readable review date is never review-overdue: the engine has no date to be late against, and nothing in it flags the missing date. The record needs a review date that exists."),

q(0, "A record holds the timestamp \"2026-09-30T23:30:00Z\". What calendar date does calendar.js read, and what is its days until from 2026-10-01?",
 "2026-09-30, and -1",
 ["2026-10-01, and 0, for a reader east of UTC",
  "2026-10-01 in some zones and 2026-09-30 in others, so the count depends on the reader",
  "It is refused, because a timestamp is not a calendar date"],
 "A timestamp is read by its leading date only, the date its first ten characters name, whatever the zone the reader is in. So it is 2026-09-30 and -1 for every reader."),

q(2, "Why does a whole number of days separate any two dates the calendar module reads, in every time zone?",
 "Both the record's date and the as-of date are read at local midnight from their leading YYYY-MM-DD.",
 ["The module rounds every gap to the nearest whole day after converting both dates to UTC, so the hours cancel.",
  "The module reads both dates at noon UTC.",
  "The module counts only working days, and those are always whole."],
 "Because both sides are read by the same rule, the hours never enter the calculation. From 2026-10-01 to 2026-10-02 is 1 day wherever you stand, and a review due on a date is due on that calendar day in every office."),

q(1, "On 2026-10-01, how many live OBODO risks are review-overdue, and which are they?",
 "2: OB-02 and OB-05, both \"Open\" with a passed date",
 ["3: OB-01, OB-02 and OB-05",
  "1: OB-05 only",
  "4: OB-02, OB-05, OB-09 and OB-10"],
 "OB-02 is -1 days from 2026-10-01 and OB-05 is -16, and both are \"Open\". OB-01 is due on the as-of date itself and is not among them, and OB-09 and OB-10 are not live."),

q(0, "OB-09 is \"Draft\" with no review date. Why does its review overdue answer read no?",
 "Its status is not live, so the test never reaches the date.",
 ["Its days until is null, and the engine reads a null count as zero days, which is not below zero.",
  "Drafts wait for a first review date.",
  "Its review date defaults to the as-of date, which is never overdue."],
 "The rule asks the status first, and \"Draft\" is not live. A live risk with no review date also reads no, for the other reason: there is no date to be late against."),

q(3, "Which two conditions does the risk review overdue rule check, and in which order?",
 "First that the risk is live, then that days until is below zero",
 ["The date first, then the status",
  "Only that days until is below zero, whatever the status",
  "First the band, then the date"],
 "The test asks the status first: only \"Open\", \"Under Review\", \"Mitigated\" and \"Realized\" risks can be overdue. Then the date: a review due on the as-of date, 0 days away, is not overdue."),

q(2, "OB-07 is \"Realized\", with its review set for 2026-10-02. Taking 2026-10-01 as the as-of date, which reading is right?",
 "1 day away, so its review is not overdue",
 ["1, and overdue",
  "-1, and overdue",
  "It has no review obligation, as \"Realized\" is not a live status"],
 "\"Realized\" is live, so the date is read. 2026-10-02 is 1 day after 2026-10-01, which is not below zero, so on 2026-10-01 its review is not overdue."),

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/beginner/asrcb_m04.json', label='asrcb_m04', expect_n=15)
finish()
