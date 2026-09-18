import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Associate m03, Lead Time and the Current Period. Written from
# digest.txt SECTIONS 4 and 5 as the five lessons of this module teach them:
# the lead time sets the warning, a missing lead time takes the default, the
# edge of the window, the period a filing belongs to, and one day before it.

q(2, "REG-2026-003, the quarterly flare and venting return, is due 2026-10-31, 16 days after the as-of date. Its recorded lead time is 14. Given a lead time of 17 and nothing else changed, what does it read?",
 "Due soon",
 ["On track, because the due date and the as-of date have not moved.",
  "Overdue, because the window now reaches back past the as-of date.",
  "On track, because the recorded lead time of 14 wins over a new one."],
 "The digest prints 17 as Due soon. Only the lead time changed, and that alone turned On track into Due soon: the window now reaches the 16 days that remain."),

q(0, "In the digest's lead time table for REG-2026-003, what is the largest lead time that still leaves the return On track?",
 "15",
 ["14",
  "16",
  "0"],
 "The rows print 14 On track, 15 On track and 16 Due soon. 14 is the lead time on the record, which is not the largest in the table that leaves it On track."),

q(3, "REG-2026-003 has 16 days to its due date. With a lead time of 16, the same number, what does it read, and what does that say about the edge of the window?",
 "Due soon, so the edge belongs inside the window.",
 ["On track, so the edge sits outside the window.",
  "On track, because the window opens on the day after the lead time is reached.",
  "Due soon only on the as-of date itself."],
 "The digest prints 15 On track and 16 Due soon. An obligation whose days until equals its lead time is inside its window, so the warning arrives on the last day the lead time can still be met."),

q(1, "REG-2026-003 is given the word 'ten' as its lead time. What does it read, and where does its window come from?",
 "Due soon, from DEFAULT_LEAD_TIME_DAYS.",
 ["On track, a word read as no window.",
  "Due soon, from reading 'ten' as the number it spells.",
  "A refusal, since it is not a number."],
 "An unusable lead time is replaced by DEFAULT_LEAD_TIME_DAYS. The rows for null, the empty string, -5, 'ten' and a field left out all read Due soon, the status the return carries with the default window."),

q(2, "REG-2026-003 is given a lead time of 0. It reads On track. What does that row show?",
 "Zero is a usable lead time, meaning no advance warning at all.",
 ["Zero is read as missing, and the default applies.",
  "Zero is refused and the old status is kept.",
  "Zero switches the obligation off, as Draft does."],
 "A null, an empty string, a negative number and a word all read Due soon because the default applies to them. 0 reads On track, so the engine is applying the 0 it was given."),

q(0, "A negative lead time, -5, is typed on the flare return's record. Which status follows?",
 "Due soon, because a negative lead time is not a usable one and the default applies.",
 ["On track, because a negative window opens after the due date and is not open yet.",
  "Overdue, because a negative lead time reads the due date as five days passed.",
  "On track, the status it carries with a lead time of 0."],
 "The digest prints -5 as Due soon. With no usable lead time the engine uses DEFAULT_LEAD_TIME_DAYS, and a negative number is not usable."),

q(3, "REG-2026-012, the annual concession rental, is Due soon at 25 days. Its reason names a lead time. What is recorded as its lead time on the register?",
 "null",
 ["The same window the reason names, entered when the obligation was set up.",
  "Nothing, because the reason is only shown when a lead time has been typed.",
  "The lead time of the discharge permit, copied across by the Financial regime."],
 "The register prints null. The window in the reason is DEFAULT_LEAD_TIME_DAYS, and the reason says so: \"inside the default\" window, with \"(none is set for this obligation)\"."),

q(1, "Two Due soon reasons name a window. Which words tell a reader that REG-2026-001's window was chosen on the record?",
 "\"set for this obligation\"",
 ["\"inside the default\"",
  "\"(none is set for this obligation)\"",
  "\"nothing further is due\""],
 "REG-2026-001's reason names the lead time \"set for this obligation\". REG-2026-012's names the default window and adds \"(none is set for this obligation)\", so a chosen window and a supplied one can be told apart without opening either record."),

q(2, "periodStart steps one frequency back from a due date of 2026-10-31. Where does the Quarterly period start?",
 "2026-07-31",
 ["2026-07-28",
  "2026-10-10",
  "2026-08-05"],
 "Three months back from the end of October is the end of July, which has a thirty-first. 2026-07-28 is the flare return's last filing, which falls before that start."),

q(3, "For a due date of 2026-10-31, which frequency's current period starts on 2026-04-30?",
 "Semi-annual",
 ["Quarterly",
  "Annual",
  "Biennial"],
 "Semi-annual steps six months back and April has no thirty-first, so the start is pulled back to 2026-04-30. Quarterly starts 2026-07-31, Annual 2025-10-31 and Biennial 2024-10-31."),

q(0, "REG-2026-004, the annual monitoring report, is due 2027-03-31 and its period starts 2026-03-31. Its last filing is dated 2026-03-30. What is its status, and what would one day later on the filing make it?",
 "On track as recorded, and Compliant with the filing dated 2026-03-31.",
 ["Compliant as recorded, because a filing at the end of March covers a report due at the end of March.",
  "On track either way, because the filing date is not what decides the status here.",
  "Overdue as recorded, and On track with the filing dated 2026-03-31."],
 "Dated 2026-03-30 the filing belongs to the earlier period. Dated 2026-03-31, the first day of the period, it counts, and the digest prints status Compliant. The first day of the period is inside the period."),

q(1, "REG-2026-002, the monthly water quality return, was due 2026-10-10 and was last filed 2026-09-09. Its period starts 2026-09-10. What does it read, and why?",
 "Overdue, because that filing counts for the period before.",
 ["Compliant, a day early is close enough.",
  "On track, because a monthly return has a filing inside the last month.",
  "Due soon, the filing moved the due date on."],
 "The filing falls before the period start, so it discharged the period before. The return for the current period is late, and the reason says \"The due date passed 5 days ago.\""),

q(3, "REG-2026-012, the annual concession rental, was last paid 2025-11-03. Its current period starts 2025-11-09 and it is due 2026-11-09. Why does it read Due soon?",
 "Last year's payment does not count for this period.",
 ["A payment made in November counts for the year, and the row is warning about the next one.",
  "The payment is still inside its period, so only the lead time is holding the row at Due soon.",
  "Any payment over a year old is thrown away."],
 "The payment falls before the period start, so it covered last year's rental. Nothing has been paid for this year's, which is due 2026-11-09 and inside its window."),

q(2, "REG-2026-008 is Semi-annual, due 2027-01-31, with its period starting 2026-07-31. Its last filing is 2026-08-05. What does it read?",
 "Compliant",
 ["On track, because every filing is read as belonging to an earlier period.",
  "On track, because a Semi-annual period is counted from the filing date.",
  "Due soon, because a filing inside the period opens the warning window."],
 "The filing on 2026-08-05 is on or after the period start of 2026-07-31, so the period is discharged. Of the five IKORO filings read against their periods, it is the only one that counts."),

q(1, "In Document Control, which state plays the part Due soon plays in the register, and which constant sets its window?",
 "Review due soon, with documentControl.REVIEW_LEAD_DAYS.",
 ["Review scheduled, with complianceStatus.DEFAULT_LEAD_TIME_DAYS.",
  "Review due soon, with documentControl.DEFAULT_REVIEW_PERIOD_MONTHS.",
  "Review overdue, with each document's own lead time."],
 "OPS-PLA-0002, the terminal emergency response plan, has its next review on 2026-11-02, 18 days after the as-of date, and reads Review due soon. DEFAULT_REVIEW_PERIOD_MONTHS is a review period in months."),
emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/beginner/cqb_m03.json', expect_n=15)
finish()
