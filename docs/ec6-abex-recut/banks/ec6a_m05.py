import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(1, "A planned cost pasted with its currency symbol is now refused as \"Rig move: planned cost is not a number: $1,200\". Before this course's repair, what became of that task?",
 "It counted as zero and stayed in the list with its name and its dates, contributing nothing to the planned value, nothing to the earned value and nothing to the budget at completion.",
 ["It was dropped from the task list, so the budget at completion fell and a warning named the row that had been removed from it.",
  "The symbol and the separator were stripped and the figure read as 1200, which is what a paste out of a spreadsheet was assumed to carry.",
  "The whole project was refused, which is why one unreadable figure used to leave a status pack with no indexes printed on it at all."],
 "Every number downstream still printed, which is worse than a blank cell: correct arithmetic on a task list that is missing money is the hardest error to find.")

q(3, "On a task list whose planned costs are 2400000, 5200000, 8600000, 12500000 and 3300000, the Procurement figure of 8600000 is read as zero. What happens to the completion ratio of 0.261250?",
 "It falls to 0.247009, because Procurement stood at 30.0000 percent, which is above the project's own 0.261250, so the numerator loses 2580000 while the denominator loses 8600000.",
 ["It rises, because the whole 8600000 leaves the budget at completion of 32000000 while the earned value of 8360000, built from the three tasks that carry progress against them, stays exactly where it was.",
  "It holds at 0.261250, because earned value and the budget at completion both lose the same 8600000 and the ratio between them is unchanged.",
  "It reports as none, because a planned cost the parser could not read leaves the budget at completion with no readable value at all to divide into."],
 "Procurement earned 2580000 of the 8360000, so the numerator falls to 5780000 and the denominator to 23400000. The new ratio looks perfectly ordinary, which is the danger: 8600000 has gone out of the 32000000 and nothing on the report says so.")

q(0, "Procurement runs 2028-08-01 to 2029-07-31, so its window is open at 2028-12-31. What does a Procurement cost read as zero do to the schedule index of 0.821326?",
 "It raises it, because part of the 8600000 sits inside the planned value of 10178668 and a smaller denominator lifts the index for no reason a reader can see.",
 ["It lowers it, because the task keeps its window and the planned value keeps the full share it was carrying before.",
  "It leaves it at 0.821326, because the planned value is phased from the task windows alone, and a planned cost feeds only the budget at completion and the ratio built on it.",
  "It removes it, because the engine withholds the schedule index once any costed task fails to parse its planned cost."],
 "Planned value is time-phased from each task's budget across that task's own window, so taking 8600000 out of the sum shrinks the denominator that produced 0.821326.")

q(2, "Fabrication and Commissioning carry actual costs of 0 and the engine is content, while a cost of -100 is refused as \"Credit: planned cost may not be negative: -100\". What is the guard checking?",
 "Readability and sign, and nothing else: a zero is a number somebody typed, and a negative budget has no meaning in the arithmetic that follows it.",
 ["Whether the cost is consistent with the task's percent complete, so a zero is allowed only on a task that also stands at 0.0000 percent.",
  "Whether the cost falls inside the budget at completion of 32000000, which a negative figure cannot do and a zero does trivially.",
  "Whether the figure can be parsed, so the zero passes and the negative is caught further downstream by the earned value sum rather than by the guard."],
 "Fabrication and Commissioning stand at 0.0000 percent with actual costs of 0, and they still carry planned costs of 12500000 and 3300000 into the budget at completion.")

q(3, "One costed task with no planned dates is added to ODUDU-2. What does the engine report for the schedule index, and on what grounds?",
 "No schedule index, with the reason given: \"1 costed task carries no planned dates, so planned value cannot be time-phased\".",
 ["A schedule index built from the tasks that are dated, with a warning that one task was left out of the planned value sum.",
  "A schedule index of 0.256839, which is the completion ratio the engine falls back to whenever the phasing cannot be completed for every task.",
  "No schedule index and no basis line at all, since the engine states a basis only on the reports where the phasing succeeded."],
 "The message counts the tasks that are missing dates, which is a work instruction: date them from the plan, or take their cost out if they are not in the plan yet.")

q(1, "Why does the engine refuse to put a zero into the planned value sum for a costed task that carries no window?",
 "A zero would claim the plan had scheduled none of that money by the as-of date, which is a statement about the schedule nobody made.",
 ["A zero would be counted twice later on, once the task is dated and its budget enters the phased sum a second time under its own window.",
  "A zero would drag the earned value down with it, since the planned value and the earned value are built in the same pass over the task list.",
  "A zero is reserved for a task whose window has not opened yet, and reusing it would leave the two situations impossible to tell apart on a report."],
 "The earned value stays where it is while the denominator shrinks, so a team reads a healthier index than 0.821326 because a date was missing.")

q(2, "With a planned cost of 900000 at 10.0000 percent and no dates on it added, ODUDU-2 reports a budget at completion of 32900000, an earned value of 8450000 and a completion ratio of 0.256839. Why do those three survive when the schedule index does not?",
 "They are sums of money with no calendar in them, while a planned value needs a window on every costed task before it can be phased to a date.",
 ["They were computed before the undated task was read, so they carry the original five tasks and the new one is excluded from all three.",
  "They are reported at task level rather than project level, and only the project level figures are withheld when an input is missing.",
  "The engine substitutes the project start date for a missing window when it totals money, and declines to substitute it when it phases the plan."],
 "Earned value, actual cost, the budget at completion, the completion ratio and the cost index all survive an undated task; the planned value and the schedule index do not.")

q(0, "A window whose end date falls before its start date and a window of zero length arrive in the same task list. What does the engine do with each?",
 "It refuses the backwards window as \"Backwards: the planned end date is before the planned start date\", and it accepts the zero length window and handles it.",
 ["It refuses both, since a window that does not run forward for at least one day cannot carry a share of its task's budget.",
  "It accepts both, and each contributes its task's whole budget to the planned value from the day the window is dated.",
  "It reads the backwards window in whichever order the two dates make sense, and drops the zero length window out of the planned value."],
 "A published zero length window read at 2026-06-01 reports planned value 0, earned value 100 and no schedule index, so the task is either not started or finished.")

q(1, "A project with no costed task at all is read. Which outputs does the engine withhold, and what does it say?",
 "The schedule index, the cost index and the percent complete, with the basis stated: \"no costed task, so there is no planned value\".",
 ["The planned value and the schedule index only, since the earned value and the cost index can still be built from the actual costs that were paid out.",
  "Nothing at all: it reports zeros right across the row, because a task list with no money in it really has earned nothing against nothing.",
  "The whole report, since an earned value calculation with no money on either side of its two ratios has no figures left at all to print."],
 "A published empty task list read at 2026-07-02 reports no planned value, earned value 0, actual cost 0, no schedule index and no cost index.")

q(2, "Before the repair, what appeared on a status card for an index that had no denominator?",
 "A clean 1.00 under a heading saying the project was under budget, and a percent complete that came back as the string NaN, which one card read as a zero and labelled behind schedule.",
 ["A blank cell, which left the reader to work out from the task list whether the project had been costed at all.",
  "A zero under a heading saying the project was behind schedule, which at least pointed at the missing input instead of flattering it.",
  "The completion ratio in place of the missing index, so a project with no costed task borrowed its progress figure and printed it twice."],
 "A ratio of one is what a perfectly run project earns, so the project with no numbers in it printed the more reassuring of the two labels.")

q(3, "Progress of 150 is refused as \"Overdone: percent complete must be between 0 and 100, not 150\". What would accepting it have done?",
 "The task would earn half again its own budget, lifting the earned value above the budget at completion and the completion ratio above one.",
 ["The task would be treated as finished at 100.0000 percent and the surplus carried forward to the next task in the list.",
  "The schedule index would fall, since planned value cannot phase more than a task's budget and the excess would land in the denominator instead.",
  "Nothing measurable, since earned value is capped at the budget at completion of 32000000 and the excess is discarded before the indexes are formed."],
 "A ratio whose whole meaning is the share of the job that is done would be reporting more job than exists, and the cost index would rise along with it.")

q(0, "A progress figure typed as the word half is refused rather than read as zero. What is the argument for refusing it?",
 "A task that may be almost finished would enter the earned value at nothing and drag the schedule index down with no sign on the report of why.",
 ["A zero would break the range check, since a figure the parser cannot read has no position between 0 and 100 to be checked against.",
  "A zero would raise the cost index, since the actual cost of that task stays in the denominator while its earned value disappears.",
  "A zero would be corrected at the next report, since the engine carries the last readable progress figure forward for any task whose newer figure it cannot parse."],
 "The message names the task and quotes the text back: \"Half: percent complete is not a number: half\".")

q(2, "Procurement is typed at 30.0000 percent on a task where nothing has actually started. What does the engine do with that figure?",
 "It accepts it, because the guard is a range check and not a truth check, and the earned value of 8360000 and the schedule index of 0.821326 carry the claim without questioning it.",
 ["It refuses it, since a task with no actual cost recorded against it cannot report progress above 0.0000 percent.",
  "It accepts it and flags it, since 30.0000 percent on a window that opened 2028-08-01 is checked against the share of that window already elapsed.",
  "It accepts it and leaves the earned value alone, since only tasks with spending behind them are allowed into the earned value sum."],
 "Acceptance means the figures were readable and in range; earned value is only as good as the progress typed into it, and the refusals guard the arithmetic rather than the judgement.")

q(0, "One published row reports a schedule index of none beside a cost index of 0.000000, and another a schedule index of 0.000000 beside a cost index of none. What separates the two kinds of entry?",
 "A 0.000000 is a division that happened, an earned value of 0 over an actual cost of 20, and a none is a division that could not happen at all.",
 ["A 0.000000 is printed when the figure rounds below the sixth decimal, and a none when there is no figure to round.",
  "A 0.000000 belongs to a task that has started and earned nothing while a none belongs to one that has not started, so the pair is about timing.",
  "A 0.000000 is how the schedule reading is withheld and a none how the cost reading is withheld, since the two columns use different conventions."],
 "Tasks without costs read planned value none, earned value 0 and actual cost 20; no actuals and no progress reads planned value 50, earned value 0 and actual cost 0.")

q(1, "A portfolio roll-up averages the schedule indexes of its projects and counts every none as a zero. What has it produced?",
 "An average dragged down by projects that were never costed, and counting them as one instead would hide the same projects the other way.",
 ["A conservative average, since treating an absence as the worst case is the safe reading whenever a project's basis is unknown.",
  "A correct average of the projects that did report, since a zero adds nothing to a sum and only the count of projects has changed.",
  "An average that agrees with the completion ratios, since a project with no planned value has still earned nothing against its budget at completion."],
 "A schedule index of 0.000000 says a plan asked for 50 and nothing was earned against it, and a none says there is no plan to ask anything; the missing entries were never measurements.")

emit(Q, '/root/ec-wip-fdp/banks/ec6a_m05.json')
finish()
