import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(1, "A schedule stored its sanction day by building an instant with new Date from the string 2027-04-01. Which readers were shown a different day?",
 "Every reader west of Greenwich, because that instant is UTC midnight and lands on the day before in their own zone.",
 ["Only readers whose clocks changed between the stored day and the day they opened the plan.",
  "Every reader east of Greenwich, because the instant is local midnight where it was typed.",
  "None of them, because the string carries no time at all and each reader is shown the stored characters rather than an instant converted into a zone."],
 "The string never said anything about a time, and the moment a day is stored as an instant it acquires a time zone it was never given.")

q(3, "A FPSO and a Platform are both sanctioned on 2027-04-01. What first oil does the engine date from each concept?",
 "2030-04-01 at 36 months for the FPSO and 2029-04-01 at 24 months for the Platform.",
 ["2030-04-01 for both of them, because first oil is a property of the field while the concept decides only what is spent on the way to reaching it.",
  "2029-04-01 for the FPSO and 2030-04-01 for the Platform, because a platform carries the longer construction of the two concepts at 36 months.",
  "Dates counted forward from the day the schedule is run, 36 months and 24 months from that day, because the sanction date fixes only the order of the two."],
 "Each first oil is the concept's own start date carried forward by the months that concept takes, so 36 months against 24 is a difference in what is required.")

q(0, "A FPSO is sanctioned on 2028-02-29. Where does first oil land, and how many months is that?",
 "2031-03-01, and still 36 months, because the February three years later has no twenty ninth for the month arithmetic to land on.",
 ["The last day of February in 2031, because a month count beginning on a month end is held to the month end wherever it lands.",
  "2031-03-01, and 36 months and a day, because the day the calendar could not place is added to the month count rather than dropped from it.",
  "A refusal, because a sanction on a leap day cannot be carried forward by whole months without choosing a rule the concept never stated."],
 "That is a calendar answering a calendar question; an implementation adding a fixed number of milliseconds would land near 2031-03-01 and drift with every leap year it crossed.")

q(2, "Oct 30 to Nov 3 returns 4 days in every zone the engine was run in, including zones whose clocks change inside that window. What produces that?",
 "The span is counted in whole calendar days rather than taken as the difference between two instants.",
 ["Both ends are counted, and the day that adds makes up the hour lost to the clocks.",
  "The two ends are converted to UTC before they are subtracted, so the hour the clocks moved is taken off both sides and cancels out between them.",
  "A window crossing a clock change is rounded to the nearest whole day, which recovers the 4 days wherever the hour would otherwise have been lost."],
 "An hour is enough to turn a whole number of days into a fraction, and code that truncates then loses a day while code that rounds keeps it.")

q(1, "An activity with no readable dates returns a calendar span of null and an empty schedule returns 0. Why are those two answers deliberately different?",
 "A span of 0 says the schedule has no extent, and null says the extent is unknown because nothing readable was there to measure.",
 ["A span of 0 marks a count that succeeded and null one that was refused, so null carries the message.",
  "An empty schedule has no rows that could disagree, while an activity with unreadable dates has one, and null marks that row for somebody to repair.",
  "Both mean no extent, and the difference between them is one of formatting."],
 "An engine returning 0 for both would report an unfilled form as a project that takes no time at all.")

q(0, "EGINA's network duration is 870 days and the calendar span across the dates typed on the same eight activities is 933. Which inputs produce each figure?",
 "870 comes from the durations and the finish to start links with no date taking part, and 933 counts whole days from the earliest typed date to the latest with no duration taking part.",
 ["870 counts the work on the critical path and 933 counts the work on all eight activities, including the three that sit off the path carrying float.",
  "870 is the span from sanction to first oil and 933 adds the two milestones at the ends, which hold dates of their own and consume no days.",
  "933 is the same network measured in calendar days and 870 the same network in working days, the difference being the days nobody works."],
 "One says how long the work must take and the other how wide the window is, and 933 less 870 is 63 days.")

q(2, "933 less 870 is 63 days. What are those 63 days?",
 "Float sitting in the calendar rather than in the logic, belonging to no activity at all, and spent already by typing dates that leave the work room it never asked for.",
 ["Contingency somebody set aside against the critical path, which is why it appears in no activity's float column and belongs to the schedule as a whole.",
  "The part of subsea installation's 480 days of float that the typed dates have already consumed, which is why those days belong to that activity.",
  "Days the schedule spends outside the network, because the milestones of duration 0 hold dates that a network duration of 870 days cannot count."],
 "The 63 days can be spent without any activity slipping and without a warning appearing, because neither figure is measured against the other.")

q(3, "EGINA's milestone list reads Project sanction and First oil. What makes those two rows the milestones?",
 "They are the activities of duration 0.",
 ["They are the first and last rows of the schedule, and a milestone marks each end of a network whatever duration the row happens to carry.",
  "They carry dates while the six activities between them carry durations, and a milestone is a dated row with no work underneath it.",
  "They sit on the critical path at a float of 0, which is what a milestone is: a point in the schedule that cannot be moved at all."],
 "A milestone takes no days and still holds a position, project sanction at day 0 and first oil at day 870, each running from its day to the same day.")

q(0, "A concept carries no start date and is run with no today supplied. What does the engine do?",
 "It refuses, with the message that the concept has no start date: enter one, or pass today to date the schedule from.",
 ["It dates the schedule from the day of the run, which is the documented default, and marks that first oil as derived rather than as entered.",
  "It returns the month count alone, 36 months for a FPSO and 24 for a Platform, leaving the date column empty for the author to fill in.",
  "It takes the earliest date typed on any activity in the schedule."],
 "The message carries both ways out and the engine takes neither, because a schedule dated from whatever moment the code ran at cannot be reviewed.")

q(1, "Why can a first oil date computed from today not be reviewed?",
 "It is correct on the day it was computed and wrong on every other day, and nothing in the date column marks where it came from.",
 ["It is computed to the instant, so two reviewers in two zones are shown two days.",
  "It carries no month count beside it, so a reviewer cannot tell whether the concept behind it was a FPSO at 36 months or a Platform at 24.",
  "It is rounded to a whole number of days without the direction being recorded."],
 "Run the same plan twice a week apart and the second run disagrees with the first, with nothing in the plan altered.")

q(3, "Which figure in EGINA's schedule holds no date in it at all?",
 "The network duration of 870 days.",
 ["The calendar span of 933 days, which counts days rather than naming any of them and so survives a change to the concept's own start date.",
  "The month count of 36 months, which is carried forward from a sanction date and comes out the same whichever day the concept is sanctioned on.",
  "The milestone list, because Project sanction and First oil are positions in the logic and the dates printed beside them are only labels."],
 "870 days is a length of work measured from day 0, while every dated figure moves when the concept's start date moves.")

q(2, "Why must a calendar span and a network duration come out of the same arithmetic?",
 "EGINA's durations are whole days, 210, 300, 420, 330, 180 and 150 with 0 on the two milestones, and 870 days of work cannot be set beside a window measured in days and a bit.",
 ["Both are printed in one column of the schedule document, so a fraction in either would force the other to be reported to the same precision.",
  "The calendar span is derived from the network duration by adding the float back on, so a fraction in either would leave the 63 days between them unreadable.",
  "The engine compares the two and warns whenever the window is narrower than the work, and a comparison cannot be made across two kinds of number."],
 "A span between dates subtracted as instants comes out an hour wrong across a clock change, and 933 against 870 means something only if both are whole days.")

q(0, "A report prints 933 under the heading duration. What does that claim which is not true?",
 "That the project holds 933 days of work, when the work is 870 days and 933 is the width of the window the dates sit in.",
 ["That the span was measured from the concept's start date rather than from an activity's.",
  "That the calendar span was counted inclusively at both ends, which is where the difference from the network duration of 870 days comes from.",
  "That the floats of 180, 180 and 480 days were added into the network duration."],
 "The mirror of it is offering 870 as the gap between sanction and first oil, which claims a window 870 days wide.")

q(1, "A plan's typed dates span fewer days than its network duration. What does the engine report?",
 "Both figures, without comment either way, because each is a correct answer to its own question.",
 ["A refusal, in the way a dependency on an activity that is not in the schedule is refused, because the dates and the logic cannot both hold.",
  "The network duration in place of the span, because the work binds.",
  "A warning that the window is short, which is the one comparison the engine makes between the calendar and the logic before it prints them."],
 "Nothing reconciles the two automatically, so a window of 933 against work of 870 holds slack and a narrower one is a plan asking for work in days it does not have.")

q(2, "Storing a day as an instant and subtracting two instants to measure a length are avoided the same way. How?",
 "Keep a date as a date, and count in days.",
 ["Convert every stored date to UTC on the way in and back to the reader's own zone on the way out, so one instant is shown the same way everywhere.",
  "Store the offset beside the instant, so a length can be corrected for the hour a clock change introduced before it is divided by the length of a day.",
  "Round every length to the nearest whole day after the subtraction, which recovers the day that truncating loses across a daylight saving change."],
 "Oct 30 to Nov 3 counts to 4 days in every zone, and the same window subtracted as instants is out by an hour wherever the clocks moved.")

emit(Q, '/root/ec-wip-fdp/banks/ec6i_m02.json')
finish()
