import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Associate m04, Rolling the Schedule Forward. Written from
# digest.txt SECTION 6 and the One-off rows of SECTION 3 as the four lessons of
# this module teach them: rolling from the date that was due, month ends pulled
# back, the two frequencies with no next date, and a filed One-off discharged.

q(1, "REG-2026-002 was due 2026-10-10 and is filed late on 2026-10-14. What next due date does the Regulatory Compliance app roll the return to?",
 "2026-11-10",
 ["2026-11-14",
  "2026-10-14",
  "2026-11-09"],
 "The app passes the due date to rollForward: rollForward(2026-10-10, Monthly) = 2026-11-10. The same call on the filing date would give 2026-11-14, the date the app does not use."),

q(3, "Why does the app roll a monthly return forward from the date that was due and never from the filing date?",
 "Filing late does not move the regulator's next deadline.",
 ["A roll from the filing would land on a month end the calendar has to pull back, and the pull is avoided.",
  "The filing date is not stored on the record.",
  "Rolling from the filing warns too soon."],
 "Rolling from the filing would put 2026-11-14 on the register, a deadline the regulator does not recognise. Each late filing would push every later deadline further out."),

q(0, "Once the late filing of REG-2026-002 is recorded and its due date rolled, what does the return read?",
 "Due soon, with a next action date of 2026-11-10 and 26 days to go.",
 ["Compliant, because the filing on 2026-10-14 counts for the current period.",
  "Overdue, because the filing came after the date that was due.",
  "On track, counted to 2026-11-14."],
 "The rolled row's period starts 2026-10-10 and the filing is on or after it, so the filing counts. The row is still Due soon because 26 days is inside the default window, and the lead time is asked about first."),

q(2, "The same rolled REG-2026-002 row is given lead_time_days 0. What does it read?",
 "Compliant: \"Last filed 2026-10-14, next due in 26 days.\"",
 ["Due soon, because the default window still applies when the lead time is 0.",
  "On track, because nothing has been filed for the period that starts 2026-11-10.",
  "Overdue, a lead time of 0 leaves no time."],
 "With lead_time_days 0 no window is open, so the next question deriveStatus asks is about the filing. The filing counts for the current period, and the row reads Compliant."),

q(1, "What do the two statuses of the rolled REG-2026-002 row, Due soon with its window open and Compliant with lead_time_days 0, show about deriveStatus?",
 "It asks about the lead time window before it asks about the filing.",
 ["It asks about the filing first.",
  "It reads the lead time only for a row never filed.",
  "It treats a lead time of 0 as missing."],
 "The digest states it: deriveStatus asks whether the next action date is inside the lead time before it asks about the filing. The open window is what keeps the row at Due soon."),

q(0, "rollForward is given a due date of 2026-08-31 and the frequency Monthly. What next due date does it give?",
 "2026-09-30",
 ["2026-10-01",
  "2026-11-30",
  "2026-10-31"],
 "September has no thirty-first, so the date is pulled back to the last day of that month. The rule never pushes a date into the next month. 2026-11-30 is the Quarterly roll."),

q(0, "From the same due date of 2026-08-31, which frequency keeps the thirty-first on its next due date?",
 "Annual, which lands on 2027-08-31.",
 ["Quarterly, which lands on 2026-11-30.",
  "Semi-annual, which lands on 2027-02-28.",
  "Monthly, landing on 2026-09-30."],
 "August has a thirty-first, so the Annual and Biennial rolls keep it: 2027-08-31 and 2028-08-31. November, February and September are shorter, so those rolls are pulled back."),

q(2, "A due date on the leap day 2028-02-29 is rolled forward by Annual. What does rollForward give?",
 "2029-02-28",
 ["2028-02-29",
  "2027-02-28",
  "none"],
 "2029 has no twenty-ninth of February, so the date is pulled back to that month's last day. 2027-02-28 is the Semi-annual roll from 2026-08-31, and none is what rollForward gives for One-off and Other."),

q(3, "2026-01-31 rolled Monthly gives 2026-02-28. Where does the roll after that land?",
 "2026-03-28",
 ["2026-03-31",
  "2026-02-28",
  "2026-04-28"],
 "Each roll starts from the date it is given. A date pulled back to the end of a short month rolls on from that day of the month, so the schedule does not return to the thirty-first on its own. 2026-04-28 is the roll after 2026-03-28."),

q(3, "rollForward is given the frequency One-off. What does it return, and what does that none mean?",
 "none, because a One-off does not recur.",
 ["The due date it was given, so a One-off stays due on the same day each year.",
  "A refusal naming One-off as a frequency the calendar cannot step by.",
  "The date one year on, the interval the engine assumes when no other is named."],
 "A One-off is due once. There is nothing to roll to and no period to step back through, so none is the correct answer after it is discharged."),

q(2, "rollForward also returns none for the frequency Other. What does that none mean?",
 "The engine has no interval to step by, so somebody who knows the next date has to enter it.",
 ["The obligation is finished, in the same way as a filed One-off.",
  "The obligation is Draft until a frequency from the list is chosen for it.",
  "The engine rolls it by the default of one year once it is filed."],
 "Other names no fixed interval. The engine will not invent a next date, because a fictional due date is worse than none: a register reader trusts a date and does not question it."),

q(0, "The waste consignment register carries the frequency Other and nothing in either date field. Before anyone can say it is late, what has to happen?",
 "Somebody has to enter when it is due.",
 ["It has to be filed once, so rollForward has a date to step on from.",
  "It must become a One-off.",
  "Nothing, because a row that reads No date set is never late."],
 "It reads No date set, with the reason \"No due date or expiry date has been set, so nothing can fall due.\" None tells the reader the schedule for this row is somebody's job."),

q(1, "REG-2026-006 and REG-2026-007 are both One-off obligations whose due dates have passed. What single field separates Compliant from Overdue?",
 "The filing: REG-2026-006 was filed on 2026-08-10 and REG-2026-007 has none.",
 ["The lead time: REG-2026-006 has one recorded and REG-2026-007 falls back on the default.",
  "The lifecycle: REG-2026-006 is Draft and REG-2026-007 is Active.",
  "The expiry: REG-2026-006 carries one and REG-2026-007 does not."],
 "Both are Active, both are One-off and neither has an expiry. A passed due date with a filing discharges a One-off; with no filing it is Overdue, and REG-2026-007's reason reads \"The due date passed 44 days ago.\""),

q(3, "REG-2026-006 reads Compliant beside a negative days until. Which words in its reason tell a reader the status is not stale?",
 "\"nothing further is due\"",
 ["\"next due in\"",
  "\"was for an earlier period\"",
  "\"not tracked against a date\""],
 "The reason reads \"Filed 2026-08-10. A one-off obligation, nothing further is due.\" The obligation was met, it does not recur, and the passed date is the date it was met against."),

q(2, "Where do REG-2026-007 and REG-2026-006 sit in the register sorted worst first?",
 "Second and eighth.",
 ["First and ninth.",
  "Third and eighth.",
  "Second and ninth."],
 "REG-2026-007 is second, straight after the expired licence. REG-2026-006 is eighth, among the Compliant rows. The filing is the one difference between them."),
emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/beginner/cqb_m04.json', expect_n=15)
finish()
