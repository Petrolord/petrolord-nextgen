import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, advanced tier, Refusals and Flags. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(2,
 "The published negativeCapexUnnamed case refuses with PortfolioInputError: \"Project \"1\" has a negative capex (-0.5); capex must be 0 or more\". The project carries no name. Which project in the list is it?",
 "The second project, because an unnamed project is named by its position in the list counted from 0.",
 ["The first project, because the engine numbers the rows of the inventory from 1, the way a reader counts the rows of the Suite table.",
  "Whichever project carries an id of 1, because the message falls back to the id field when the name field is missing.",
  "No project in particular, since \"1\" counts the refusals raised so far and this case holds a single negative capex."],
 "The unnamed refusal counts from 0, so \"1\" is the second entry, and its size does not matter: -0.5 is refused as firmly as -150.")

q(0,
 "When negativeCapexRefused fires on project \"B\" with a capex of -150, what does the optimizer return?",
 "No set, no frontier and no risk summary: the PortfolioInputError and its message are the whole result.",
 ["The best set among the other projects, with B left out of the inventory and the message attached to the result as a warning.",
  "The best set with B clamped to a capex of 0, the treatment a pos of 1.4 or a negative fail_cost receives without any warning.",
  "The best set with overLimit true, since funding B would add 150 to the limit and the flag marks a limit that stopped meaning a limit."],
 "A refusal stops the engine and a flag returns an answer; a negative capex is refused, while a pos of 1.4 is clamped and quietly returns 80.0000.")

q(3,
 "A user gets past the negative capex refusal by typing 0 in place of -150. Why is that not a safe repair?",
 "A free project is still charged one grid cell (finding D2), and whatever the negative number carried, such as a receipt, belonged in the NPV and has vanished.",
 ["A capex of 0 gives the project a risked EMV of 0, since the risked EMV is scaled by capex, and a project with EMV of 0 or less is never funded.",
  "The engine refuses a capex of exactly 0 as well, because the message is read as capex must be more than 0, so the edit trades one refusal for another.",
  "The optimizer ranks projects by EMV per million USD before it fills the limit, so a capex of 0 raises a division by zero inside the ranking."],
 "In freeProjectTightLimit a free project with EMV 10.0000 beside A at capex 100.0000 under a limit of 100.0000 is dropped: the engine funds A alone for 60.0000 where the exact optimum is 70.0000.")

q(1,
 "Three copies of a project with npv_p50 80 and fail_cost 30 leave pos out, type it as \"n/a\", and type it as an empty string. What risked EMVs come back?",
 "80.0000, 80.0000 and -30.0000: an absent or non-numeric pos defaults to 1, while an empty string is the number 0 and reads as certain failure.",
 ["80.0000 for the first and a PortfolioInputError for the other two, because a typed pos that is not a number is refused like a negative capex.",
  "80.0000 three times, because every pos the engine cannot read as a number falls back to the documented default of 1.",
  "-30.0000 three times, because a pos that is missing or unreadable is treated as a chance of success of 0 until one is typed in."],
 "None of the three is refused or flagged; the blank pos read as -30.0000 is finding EC5-6, left unrepaired and taught as a property of the engine.")

q(1,
 "Project T is entered with capex \"abc\" beside project U at capex 40, under a limit of 100. What does the optimizer return?",
 "T + U at a total capex of 40.0000, because \"abc\" counts as capex 0, weighs one grid cell and is neither refused nor flagged.",
 ["A PortfolioInputError naming T, because the capex check refuses any value that is not a number of 0 or more before the grid is built.",
  "U alone at 40.0000, because a capex the engine cannot read as a number drops that project from the inventory before the grid is built.",
  "T + U with overLimit true, because a capex that is not a number is flagged the same way the grid overshoot is flagged."],
 "The probe funds T + U at capex 40.0000 and EMV 80.0000; a non-numeric capex is finding EC5-7, a property of the engine as published, and only reading the inventory catches it.")

q(3,
 "An AFE line described as \"Completion\" is entered at -0.5 percent progress. What does the engine return?",
 "An AfeInputError, \"Cost item \"Completion\" has negative progress (-0.5 percent). Progress runs from 0 to 100 percent.\", and no metrics at all.",
 ["The metrics with that line clamped to 0 percent, since a fraction of a percent below zero is read as a line that has not yet begun.",
  "The metrics with valid false and the message printed as a note, the way the joint venture split reports a negative working interest.",
  "The metrics with that line left out of earned value and out of the budget, so CPI and SPI are computed on the remaining lines."],
 "The size does not matter, -0.5 is refused as firmly as -20; clamping to 0 would hide a typing error as a line not yet begun.")

q(0,
 "The negative progress message says progress runs from 0 to 100 percent. A published case enters progress beyond 100 percent. What does the engine do with it?",
 "It accepts it and earns beyond the budget: earned value 150.0000 against actuals of 90.0000, a CPI of 1.666667 and an SPI of 1.500000.",
 ["It refuses it with the same AfeInputError, because the message states both bounds and the check enforces the range it prints.",
  "It clamps the line to 100 percent, so earned value stops at the budget and the CPI cannot pass the budget over the actuals.",
  "It returns the metrics with a flag on the line, the way the grid overshoot returns its set beside overLimit true."],
 "Only the lower bound is enforced; a CPI of 1.666667 reads as a line far ahead on cost when it has earned more than its budget can hold, a finding left unrepaired.")

q(2,
 "An AFE with no dates is asked for its metrics as of 30 February and refuses with \"asOf is not a valid date\". What would a valid as-of date have moved on that AFE?",
 "Nothing, because with no dates time progress falls back to 1.000000, so the date is refused as an input whatever the arithmetic does with it.",
 ["Planned value and SPI, because the engine builds a window that ends on the as-of date whenever the AFE carries no dates of its own.",
  "Earned value and CPI, because each line's progress is prorated to the as-of date before it is multiplied by the line's budget.",
  "The EAC, because the forecast rule switches every line from its entered forecast to the formula once the as-of date passes the last day of the AFE window."],
 "A lenient parser would roll 30 February into March and report on a day nobody chose; the published no-dates case returns time progress 1.000000 and SPI 0.250000.")

q(3,
 "gridOvershoot now returns A + B at capex 6002.0000 and EMV 800.0000, with overLimit true and overLimitBy 2.0000. What did the EC5-0 repair change about that answer?",
 "Only the marking: the same set comes back and now says it breaks the limit, and the engine never re-solves to A + C at 780.0000.",
 ["The set: the engine now re-solves on the exact capex and reports A + C at 780.0000, keeping overLimitBy 2.0000 to record the overshoot it avoided.",
  "The limit: the engine now widens it to 6002.0000 so that the set is feasible, and overLimitBy records how far the limit had to move.",
  "The capex: the engine funds B at 2.0000 less than its cost so the set fits, and overLimit true warns that B is funded short."],
 "The overshoot is flagged and still happens; ranking 800.0000 against a feasible 780.0000 prefers the set the budget cannot pay for, a golden gap of 20.0000.")

q(0,
 "In gridOvershoot the limit of 6000.0000 runs on a resolution of 3.000000. Why does A + B, at a real capex of 6002.0000, fit the grid?",
 "Rounding capex over 3.000000 weighs A at 1333 cells and B at 667, which fill the 2000 cells exactly.",
 ["The limit and every capex are whole numbers, so the grid runs at 1 million USD per cell and the 2.0000 excess stays inside one cell.",
  "The engine admits any set within one cell of the limit, and an excess of 2.0000 is smaller than the resolution of 3.000000.",
  "B and C round to the same number of cells, so the grid cannot tell them apart and keeps whichever of the two was entered first."],
 "Above a limit of 5000 each cell is the limit / 2000; rounding drops a fraction of a cell from A and from B, which is why the flag reports overLimitBy 2.0000.")

q(2,
 "gridUndershoot funds X + Y + Z at capex 4500.0000 and EMV 660.0000 under a limit of 6000.0000, and reports overLimit false. What does that false establish?",
 "Only that the funded capex is within the limit: the exact optimum funds all four at 860.0000, a gap of -200.0000 that no flag reports (finding D4).",
 ["That the set is the best within the limit, since the repaired engine re-solves on the exact capex and compares the two answers before it sets the flag.",
  "That rounding changed nothing, since overLimit is raised whenever the grid and the exact capex disagree in either direction.",
  "That 1500.0000 was left unspent by choice, because W at 1499.0000 carries the lowest EMV of the four and was not worth its capex."],
 "Rounding makes the four together weigh more cells than the 2000 the grid holds, so one is left out; the undershoot is unflagged and taught as a property.")

q(1,
 "A joint venture split on a cost of 1000.00 enters partner interests of 30 and -20. Is that a refusal or a flag, and what comes back?",
 "A flag: valid false with the engine note naming partner \"B\" and its -20.00 percent, and the allocation still shown with the operator at 90.0000 percent.",
 ["A refusal: an AfeInputError naming partner \"B\" and no allocation at all, the same treatment the AFE engine gives a cost line entered with negative progress or a bad as-of date.",
  "A flag, with the -20 interest clamped to 0, so partner \"B\" is billed nothing and the operator is shown carrying 70.0000 percent.",
  "Neither: the split nets the two interests to 10 percent, so the operator carries 90.0000 percent and valid stays true."],
 "Partner amounts read 300.00 and -200.00 and the operator 900.00; the repaired AFE summary prints the note beside the allocation instead of billing on it.")

q(3,
 "EC5-0 made SPI null where planned value is zero, yet the published empty AFE, with no lines and no spend, reports SPI 1.000000. Why?",
 "An AFE whose budget is 0 reports SPI 1 by a guard that fires before the null rule, a finding left unrepaired.",
 ["The empty AFE has no dates, so time progress falls back to 1 and planned value becomes the whole budget, which is no longer zero.",
  "SPI copies CPI whenever actuals are 0, and CPI on the empty AFE reads 1.000000 because nothing at all has been spent on it.",
  "The null rule applies only up to the start day, and an AFE with no lines is treated as already past the end of its window."],
 "The same empty AFE also reports CPI 1.000000, so an AFE with no lines, no progress and no spend reads as perfect on cost and on schedule at once.")

q(0,
 "OFON-1's S-curve starts at \"Feb 27\" in UTC, Lagos and Tokyo, but a viewer in America/Los_Angeles sees the first point labelled \"Jan 27\" and every Planned value shifted. What is going on?",
 "The engine parses the window as UTC midnight but steps months and prints labels in local time, finding EC5-5, left unrepaired.",
 ["The as-of date west of UTC is still the previous day, so that viewer's curve is drawn for a different as-of date than the metrics.",
  "The saved window is converted to the viewer's time zone when it is stored, so that viewer has edited the AFE window into January.",
  "The repaired curve opens a month before the window to show commitments, and only viewers west of UTC are shown that month."],
 "OFON-1's window opens 2027-02-01, and in UTC its first point is Feb 27 with Planned 0; west of UTC the same AFE carries other labels and other plan values with no warning.")

q(2,
 "In the Suite the correlation slider stops at 0.9, where OKONO's 600.0000 set reads stdDev 232.0795 and P(loss) 0.049500. How should that top value be read?",
 "As the app's limit, never the engine's: the engine accepts 1 and reads stdDev 239.8888 and P(loss) 0.059000, which the screen cannot set.",
 ["As the engine's clamp: any correlation above 0.9 is cut back to 0.9, which is what the published clampAbove case exists to show.",
  "As the largest correlation the simulation can hold, because a correlation of 1 makes sqrt(1 - rho) zero and the draws collapse.",
  "As a harmless cap, because the emv of 402.7500 does not move with correlation, so the last step of the slider would change nothing that is reported."],
 "The published clampAbove case reads correlation used 1.000000; the slider stopping at 0.9 is an app item left as published, so the most correlated case has to be run on the engine and named.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/advanced/ec5a_m04.json', expect_n=15)
finish()
