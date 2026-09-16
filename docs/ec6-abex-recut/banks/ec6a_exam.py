import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# ---------------------------------------------------------------- m01, the rate of return

q(2, "The scenario card colours a rate of 15 percent or more green, and the sweep ranks the plan's drivers Oil Price, Production, CAPEX, OPEX. A reviewer treats the colour rule as a decision and the widest bar as the biggest risk. What has that reading assumed?",
 "Two things neither output claims: a colour on a card is not a decision rule and carries no money beside it, and a ranking by swing is arithmetic leverage with nothing in it about how likely a 30 percent move is.",
 ["Nothing that is not already stated, since the colour applies the only hurdle rate in the studio and the widest swing of 3097.7119 names the driver most likely to move against the case.",
  "Only that the base is sound, since the colour rule and the driver ranking are both properties of a case whose value of 2015.4123 million USD was struck on a capex of 2250.0000 the plan has reconciled.",
  "That the tie-back was screened on the same terms, since its own swing would have to be ranked as well before either concept could be called risked."],
 "The card has no rate to colour on any EGINA case, and the sweep ranks by leverage as a work list for tightening an estimate rather than by likelihood.")

q(0, "At 70.0000 USD a barrel the subsea tie-back is worth 1013.7182 million USD on a capex of 730.0000 and the FPSO 2015.4123 on 2250.0000, and neither of them reports a rate of return. Which reading is sound?",
 "Both measures are true at once, since value per million of capex is 1.388655 for the tie-back and 0.895739 for the FPSO while the FPSO still returns the larger amount of money.",
 ["The tie-back is the better development, because it wins on efficiency and on payback at 3.2035 years against 3.8273, and two measures out of three settle a screening ranking.",
  "The FPSO is the better development, because a ratio taken on 730.0000 of capex cannot be set against one taken on 2250.0000 until both have been restated on a single capex.",
  "Neither ranking holds, because the two scenarios were struck at different discount rates and only values taken at a single rate of 10.0000 percent may be compared."],
 "The ratio says how hard the money worked and the NPV says how much came back. A portfolio sorted on 1.388655 hands the reader 1013.7182 in place of 2015.4123.")

q(3, "A reviewer divides the FPSO's NPV of 2015.4123 million USD by the facility screening estimate of 1363.3524 and sets the result beside the tie-back's value per million of capex of 1.388655. What is wrong with that pair?",
 "The tie-back figure is taken on its concept's whole capex of 730.0000, while 1363.3524 prices one facility and leaves out drilling of 520.0000 and subsea of 380.0000, so the FPSO's like for like figure is 0.895739 on 2250.0000.",
 ["Nothing, since a screening estimate and a concept capex are both class 5 figures in million USD and the two ratios are therefore struck on one footing.",
  "The FPSO's value should have been the plan's own cost items NPV rather than the scenario NPV, because only the cost items reach the 2250.0000 a facility estimate belongs beside.",
  "The tie-back's ratio should have been re-struck on its own facility screening estimate of 184.6717, which is the figure that puts the two concepts on the same basis."],
 "A value per million is only as good as the capex underneath it. The screening estimate belongs beside the concept's facilities field of 1350.0000, a gap of 13.3524, and never beside a development that also drills wells and lays subsea.")

q(1, "A screening pack shows a payback equal to the concept life of 20.0000 years. What should a reader check before quoting it?",
 "Whether the project paid back in its final year or never paid back at all, since one published case with zero production records payback as the project life by convention.",
 ["Whether the cumulative was discounted at 10.0000 percent before the crossing was read, because an undiscounted payback always lands later than a discounted one does.",
  "Whether the price deck covered every producing row, because a deck that stops short leaves the later years unpriced and pushes the crossing into the final row.",
  "Whether the figure came from the concept schedule rather than the cash flow, because a FPSO sanctioned 2027-04-01 reaches first oil 2030-04-01, which is 36 months."],
 "EGINA at 18.0000 and at 30.0000 USD a barrel both report never rather than a number. A payback equal to the life is the one figure that can be the honest answer or a substitution.")

q(2, "A screening threshold of 15 percent on the rate is run past the EGINA scenarios, and the Low price case comes back with no rate at all. What has the threshold told the reader about it?",
 "Nothing: the case is worth 392.8013 million USD at a discount rate of 10.0000 percent, and a rule written against a rate has no input on a case the engine gives none.",
 ["That the case is worthless, since a rate the engine declines to report is a rate that fell below the threshold.",
  "Nothing at all, because a threshold of 15 percent and a discount rate of 10.0000 percent are the same test applied twice and the value had already failed the first of them.",
  "That it is the weakest of the three FPSO cases, which the sweep had already found at its minus 30 percent oil price end of 466.5563 million USD on the plan's own base."],
 "A missing verdict is not a negative one. The case is worth 392.8013 million USD, and a reader who sees an empty cell cannot tell it from a case worth nothing at all.")

q(0, "A pack lists the FPSO at 40.0000 USD a barrel, worth -197.2391 million USD with no rate of return, beside a published case worth -92616.5020 that does carry one, -36.6747 percent at status ok. Why does one of them have a rate and the other not?",
 "The published flow spends once and earns thereafter, so one root zeroes it, while the EGINA flow also pays 260.0000 million USD to abandon the field and changes sign twice.",
 ["The published case is the deeper loss, and a rate is reported wherever the value sits far enough below zero for the search to isolate a single root against it.",
  "The EGINA case is discounted at 10.0000 percent and the published case is not, so only one of the two leaves a flow the search can be run against at all.",
  "The published root is negative, and the engine verifies a rate below zero while it withholds any positive root found on a case whose value is negative."],
 "A rate of -36.6747 percent is a verified root at status ok. A flow that changes sign twice has more than one rate that zeroes it, so the engine names none and the value of -197.2391 is what the row carries.")

# ---------------------------------------------------------------- m02, when there is no rate

q(3, "A published case with zero capex is worth 717.9604 and carries no internal rate of return whatsoever. What does that absence say?",
 "Every year points the same way, so there is nothing to solve for.",
 ["The flow has two crossings rather than none, which is why the engine withholds a rate and records the status multiple-roots even on a case whose value is positive.",
  "The root sits above the upper edge of the band at 1000 percent, which is what a large receipt against a very small outlay gives, so the status reads above-clamp.",
  "The rate exists and is 0 by the engine's convention, in the way the published case with zero production every year records 0 beside an NPV of -979.6325."],
 "The status is no-sign-change, and it is structural: a project that never asked for money up front has nothing for a return to be a return on. The 717.9604 is defined regardless.")

q(1, "Two published cases report above-clamp: one worth 133.3087 whose hidden root is 15389.6875 percent, and one worth 1074.4692 whose hidden root is 2305.7875 percent. What does that status assert?",
 "That a root exists outside the band between -99 and 1000 percent, so the engine did not find it and will not print a number it never verified.",
 ["That no root exists at all, which is what a flow whose years all carry one sign gives.",
  "That the root was found and then suppressed for being implausible, since a rate of four figures of percent would be read as a repeatable expectation on a card.",
  "That the flow crosses zero more than once, so each of the two recorded roots is genuine and neither of them has any claim to be the rate of return of the case."],
 "A tiny outlay followed by a large single year explodes the ratio while the money stays small: 133.3087 of value against 15389.6875 percent. The status is a prompt to check the capex.")

q(0, "The published case whose price deck is shorter than its profile is worth 126.1636, reports multiple-roots, and has a recorded hidden root of -52.4425 percent. Why is -52.4425 not its rate of return?",
 "A second root is equally valid, so the case has no single rate, and the unpriced years still carry their operating cost, which bends the flow back below zero.",
 ["Because it lies below the floor of the search at -99 percent, and a root outside the band is never reported however carefully a golden has recorded it.",
  "Because the engine never reports a rate below zero, which is why the published case that never pays back carries the status ok and no number beside that status.",
  "Because the plan path refuses a short deck by name rather than pricing it, so no rate of any kind was ever computed for that flow to be able to carry."],
 "Missing prices read as 0 in that fixture. EGINA's own Base case reads multiple-roots too, on 2015.4123 with roots of -44.3414 and 29.5779, and picking one root is the reader's preference wearing the engine's authority.")

q(2, "Before the repair the studio printed 1000 percent, in green, against the EGINA concept at 18.0000 USD a barrel. What was that figure?",
 "The upper edge of the band the search covers, returned from where the search stopped, so it is a property of the search rather than of the cash flow.",
 ["The true root of that flow, which sits above the band and is recorded in the goldens in the way 2305.7875 percent is recorded for another published case.",
  "The rate at which the stress case breaks even, computed correctly and then labelled wrongly.",
  "A placeholder the card drew when the engine returned nothing, in the way an index with no denominator was drawn as a clean 1.00 and labelled under budget."],
 "The tell is that the number was exactly the boundary. The repaired engine reports null with the status no-root there, and the NPV of -1834.1220 sat on the same card the whole time.")

q(3, "A case worth -1834.1220 million USD reports no rate of return at all with a status of no-root, and a sweep is drawn around it anyway. What does that chart carry?",
 "Eight re-runs of the case in money and a ranking of the drivers by leverage, with nothing on it to say that a rate was withheld or why.",
 ["Nothing at all, since a case with no verified root inside the band of -99 to 1000 percent cannot be re-run and the sweep has no base to move around.",
  "A rate at each of the eight ends, since every run solves its own flow and the status of no-root belongs to the base run alone.",
  "The same eight ends the Base case gives, since the sweep moves the drivers and a status is a property of the flow rather than of the driver being moved."],
 "The sweep reports values, so it draws with equal confidence on a case the engine would refuse to hand a rate. The ranking of Oil Price, Production, CAPEX, OPEX is leverage and carries no status and no likelihood.")

q(1, "The plan path refuses a deck that does not cover the profile: \"the price deck has no price for production year 3: enter a price for every year of the profile\". A published golden runs a short deck anyway and reports 126.1636 with multiple-roots. What does the pair teach?",
 "That the refusal stops a padded case from being priced at all, and the golden shows what padding does, since unpriced years still carry cost and the flow gains a second change of sign.",
 ["That the refusal is a screening convenience only, since the same deck priced through the golden path returns a usable 126.1636 and a hidden root of -52.4425 percent.",
  "That the two paths disagree about one set of inputs, so a reader should take the refusal from the plan and the rate from the golden and report whichever is available.",
  "That a deck shorter than its profile is padded with the last price it carries, which holds the revenue flat through the unpriced years and leaves one crossing in the flow."],
 "Missing prices read as 0 in the fixture, so the later years produce barrels at no revenue and still pay for lifting them. The plan path refuses by name instead of pricing that.")

# ---------------------------------------------------------------- m03, what a sensitivity says

q(0, "On the plan's own case the sweep's minus 30 percent oil price end is 466.5563 against a base of 2015.4123. What produced 466.5563?",
 "A complete re-run of the case with that one input moved and every other held, which is why the two ends of a row are rarely the same distance from the base.",
 ["The base value scaled down by 30 percent and then discounted again at 10.0000 percent, which is the arithmetic that makes a tornado chart cheap to draw.",
  "The Low price scenario at 48.0000 USD a barrel carried across into the sweep, which is why the sweep and the scenario table agree on the downside of this plan.",
  "The worst of the eight runs, taken once the price fall had been combined with the capex overrun end of 1371.8250 to give the case its full downside."],
 "Every row runs royalty, tax, the discount and the shape again. The Low price scenario is a different number, 392.8013 at 48.0000 USD a barrel.")

q(2, "The oil price swing is 3097.7119 and the production swing is 2844.8375 on the same 30 percent move. What separates them?",
 "A variable operating cost of 5.0000 USD a barrel travels with the barrels, so extra volume brings its own cost and an extra dollar of price brings none.",
 ["Royalty at 12.5000 percent and tax at 30.0000 percent are taken on revenue, so a price move is taxed once while a volume move is taxed twice over the life of the case.",
  "The production driver moves the plateau and the decline as well as the volume, so more of its move lands in later years where the discount of 10.0000 percent bites.",
  "The price driver moves every producing row while the production driver leaves year 0 untouched, and year 0 is the row carrying the capex of 2250.0000."],
 "Over the Base life the operating cost is 3049.6464 against revenue of 16095.0492. The published case with no royalty and no tax keeps price the wider driver on a base of 2738.0331.")

q(1, "The sweep's CAPEX row runs from 2658.9995 at minus 30 percent to 1371.8250 at plus 30 percent. Which of the plan's figures did it move by 30 percent either way?",
 "The 2250.0000 million USD the case was run on, which is the concept's drilling, facilities and subsea fields added and is also what the plan's cost items total.",
 ["The facility screening estimate of 1363.3524 million USD, since a sweep prices the facility from its type and its nameplate of 60000 bopd before it moves anything.",
  "The concept's facilities field of 1350.0000 million USD, since the drilling of 520.0000 and the subsea of 380.0000 are committed and only a facilities figure is open to an overrun.",
  "The CAPEX total less the Decommissioning provision of 260.0000 million USD, since the screening case carries capex and operating cost only."],
 "The two capex estimates agree at 2250.0000 because the plan was costed against its concept, and the sweep moves that one figure. The screening estimate of 1363.3524 is a third number and belongs beside 1350.0000.")

q(3, "CAPEX runs from 2658.9995 at minus 30 percent to 1371.8250 at plus 30 percent, a swing of 1287.1745, while OPEX swings 326.3064 on the same move. Why is the capex row so much the wider?",
 "The capex lands in year 0 where discounting touches it least, and operating cost is spread across the producing years where the later portions count for less.",
 ["The capex base of 2250.0000 is larger than the 95.0000 a year, and the sweep moves each driver by an absolute amount.",
  "The capex row runs backwards, and a swing across a reversed row always reads wider.",
  "Operating cost is taken before royalty and tax, so the government absorbs most of its move, while the capex move falls whole on the investor and is not shared with anybody."],
 "The shares of base are 0.638666 for capex and 0.161906 for operating cost. Both rows still run high to low, because more money spent is less money kept.")

q(0, "May the sweep's minus 30 percent oil price end of 466.5563 be labelled a P90 NPV?",
 "No, because a P-label belongs to a reserves distribution one fluid at a time, and 466.5563 is a single conditional run rather than a point on any distribution.",
 ["Yes, provided the label goes on the minus 30 percent ends of all four drivers together, since those four downside runs bracket the low case of the plan between them.",
  "Yes, because the sweep moves every driver by the same 30 percent, so the eight ends are equally likely and the lowest of them is the low outcome by construction.",
  "No, because the right label for a downside run is P10, which names the high case of a distribution and so the low case of any value that is built on it."],
 "EGINA's oil P50 is 130.0000 MMbbl and its gas P50 is 70.0000 Bcf, and those labels came from a distribution somebody built. The sweep carries no claim about likelihood.")

q(2, "The lowest figure anywhere in the sweep is 466.5563. Is that the worst the case can do?",
 "No, because one driver moves at a time, so a price fall arriving with a capex overrun is nowhere in the table and sits below every figure printed in it.",
 ["Yes, since the widest single driver, at a swing of 3097.7119, already carries any combination of moves that could be made to the case and its four drivers at once.",
  "Yes, because 30 percent is the largest move the sweep may make on a driver.",
  "No, because the capex overrun end of 1371.8250 is lower still than that figure."],
 "On the published marginal case with 900.0000 of capex at 45.0000 the price downside is -225.0477 and the capex overrun end is -44.7315, and the case where both happen is absent.")

# ---------------------------------------------------------------- m04, earned value to a date

q(1, "ODUDU-2 at 2028-12-31 reports a schedule index of 0.821326 and a cost index of 1.027027. How does one project read late and cheap on the same date?",
 "The two ratios share the earned value of 8360000 and divide it by different things, a planned value of 10178668 and an actual cost of 8140000.",
 ["The cost index leads the schedule index by a reporting period, so a project that has slowed reads cheap first and reads late only once the spending has caught up with it.",
  "The cost index is taken against the budget at completion of 32000000, not to a date.",
  "The two disagree whenever a percent complete somebody typed has gone stale."],
 "One earned value over two denominators gives one answer about time and one about money. A report quoting a single index has answered only one of the two questions.")

q(3, "Across five as-of dates ODUDU-2's planned value runs 0, 3429703, 10178668, 19026406 and 32000000 while its earned value stays at 8360000. What changed in the work between 2028-06-30 and 2028-12-31?",
 "Nothing at all, since only the date the question was asked moved.",
 ["Procurement opened its window on 2028-08-01 and earned part of its 8600000, and that is the movement the planned value column records between those two rows.",
  "The team fell behind by roughly the difference between 3429703 and 10178668, which is the fall in the schedule index from 2.437529 to 0.821326 read back into the work.",
  "Detailed design slipped from its 65.0000 percent to a lower reading, since a schedule index cannot fall while the percent complete on every task is being held."],
 "The plan's own demand rose past the work. Earned value and actual cost are unmoved on all five rows, and the cost index reads 1.027027 on every one of them.")

q(2, "One costed task with a planned cost of 900000 and no dates is added to ODUDU-2, and the as-of date is then moved from 2028-12-31 to 2029-06-30. Which figures move?",
 "None of them, since the schedule index is absent on both dates and the completion ratio holds at 0.256839, the date reaching only a planned value the engine cannot phase.",
 ["The planned value, which still rises from 10178668 to 19026406 across the five dated tasks, and the schedule index along with it.",
  "The completion ratio, which falls away from 0.256839 as the later date carries more of the budget at completion of 32900000 into its denominator.",
  "The earned value of 8450000 and the actual cost, since both are measured to the as-of date and a later date finds more work done and more money spent."],
 "The engine reports no planned value at all while a costed task carries no window: \"1 costed task carries no planned dates, so planned value cannot be time-phased\". The figures that survive never knew the calendar in the first place.")

q(0, "A single task 90.0000 percent done half way through its own window reports a schedule index of 1.795082 and a completion ratio of 0.900000. Why can only one of the two pass one?",
 "Earned value can never exceed the budget at completion, while a planned value taken before the last window closes is smaller than that budget, leaving the index room above one.",
 ["The schedule index is allowed above one only while a window is open, and the completion ratio is read after it closes, by which time the whole budget has been scheduled.",
  "The ratio divides by the planned value of the task and the index divides by that task's budget, so it is the index that carries the smaller of the two denominators.",
  "The engine clips the ratio at one to keep a progress figure readable and reports the index raw, because an index above one is a finding a reader is meant to see."],
 "A task cannot be more than 100.0000 percent done and the engine refuses anything higher. ODUDU-2 reads 2.437529 at 2028-06-30 against a completion ratio of 0.261250.")

q(3, "At 2031-01-01 ODUDU-2's schedule index and its completion ratio both read 0.261250. What does that agreement mean?",
 "Every planned window has closed, so the planned value has reached 32000000 and the index can no longer say early.",
 ["The project has finished the quarter of the work it was ever going to finish, which is the reading a schedule index and a progress ratio share once the two converge.",
  "The two ratios are one measurement under two names once the last window closes, which is the reason the repair kept both of them printed on the same report.",
  "The earned value of 8360000 has caught up with the planned value, so the project stands on plan at that date and the cost index of 1.027027 confirms that it does."],
 "On every earlier row they disagree, and at 2028-06-30 they disagree widely, 2.437529 against 0.261250. The meeting is the calendar running out rather than the work finishing.")

q(1, "An as-of date the engine cannot parse is refused: \"asOf is not a valid date: last Friday\". Why is there no fallback to the day the report is run?",
 "A quietly substituted date makes every index on the report unreproducible, and ODUDU-2 gives 10178668 and 0.821326 only because 2028-12-31 was supplied.",
 ["Because the engine reaches no clock at all, so no date could be supplied except through the same field that has just failed to be read as a date.",
  "Because the current day would put the planned value at the budget at completion of 32000000, which is the one denominator that makes a schedule index meaningless.",
  "Because a date-only string read as UTC midnight lands on the day before anywhere west of Greenwich, so any substituted date is wrong by a day for half its readers."],
 "The as-of date is an input like the planned costs. A pack quoting 10178668 without quoting its date has published a number nobody can reproduce.")

# ---------------------------------------------------------------- m05, what earned value refuses

q(0, "Before the repair a planned cost the parser could not read counted as zero. What did that do to a task list like ODUDU-2's?",
 "It took the unreadable figure out of the budget at completion while the task kept its name and its dates, and every number downstream carried on printing.",
 ["It dropped the task from the list altogether, so the report showed four tasks and any reader holding it beside the plan would have seen at once that one was gone.",
  "It refused the whole calculation and returned no indexes, which is the behaviour the repair kept and then extended to a negative planned cost of -100.",
  "It set that task's earned value to its whole budget, since a cost of zero cannot be part complete, which pushed the cost index up past 1.027027."],
 "A Procurement figure of 8600000 read as zero leaves a completion ratio that looks fine on a task list missing money. The engine now names the task: \"Rig move: planned cost is not a number: $1,200\".")

q(2, "Add one costed task to ODUDU-2 with a planned cost of 900000 at 10.0000 percent complete and no dates on it, read at the same 2028-12-31. What does the engine report?",
 "No schedule index and the reason for it, while the budget at completion rises to 32900000, earned value to 8450000 and the completion ratio reads 0.256839.",
 ["The schedule index of 0.821326 unchanged, since a task carrying no dates contributes nothing to the planned value and nothing to the earned value either.",
  "A schedule index above 0.821326, because the new task lifts the earned value to 8450000 while the planned value of 10178668 stays exactly where it was.",
  "Nothing beyond a refusal message, because a costed task with no planned dates is rejected outright in the way a backwards window is rejected outright."],
 "The message is \"1 costed task carries no planned dates, so planned value cannot be time-phased\". Earned value, actual cost, the budget at completion, the ratio and the cost index all survive.")

q(1, "A project with no costed task at all now reports no schedule index, no cost index and no percent complete. What appeared there before the repair?",
 "A clean index of 1.00 under a heading saying the project was under budget, and a percent complete that came back as the string NaN.",
 ["A row of zeros, so a plan nobody had costed was filed beside one that had stalled.",
  "The basis line without any numbers beside it, which is the repaired behaviour arriving early, and the heading stayed blank until a costed task was entered in the list.",
  "The completion ratio standing in for the schedule index, which is the substitution the repair removed, so a project with no costs read 0.261250 like any other project."],
 "The basis the engine now states is \"no costed task, so there is no planned value\". A ratio of one on a project with no numbers in it was the most reassuring card on the page.")

q(3, "A reviewer meets a schedule index of 1.795082 and a proposal to type 150 into a percent complete, and treats both as numbers above one the engine ought to handle alike. What separates them?",
 "The index is a verified reading against a planned value smaller than the budget, and the 150 is refused at the input because earned value may not pass the budget at completion.",
 ["Nothing: both are clipped, the index back to one and the progress back to 100.0000 percent, which is why a task ahead of its own window cannot show it on either figure.",
  "The index is a ratio and the progress a percentage, so 1.795082 is accepted as a share of the plan and the 150 refused only because it was typed into the wrong field.",
  "The index is refused as well on any task whose window is still open, since a schedule reading may pass one only after the last window has closed and the whole budget has been scheduled."],
 "A task 90.0000 percent done half way through its window reads 1.795082 against a completion ratio of 0.900000, and the old capped ratio could never make that reading; progress of 150 meets \"Overdone: percent complete must be between 0 and 100, not 150\".")

q(2, "One published case reports a cost index of 0.000000 against an actual cost of 20.0000, and an empty task list reports a cost index of none. Why are those different findings?",
 "0.000000 says money went out and no budgeted work came back, and none says there was nothing to divide by, which is a gap to fill rather than a result.",
 ["The first is a very small index rounded down and the second an index the engine declined to round, so both of them describe money spent against work that nobody budgeted.",
  "The first belongs to a project with costs and no progress and the second to one with progress and no costs.",
  "Both are absences, printed as 0.000000 where an actual cost exists and as none where it does not."],
 "Arithmetic on a null is the mistake: a roll-up that treats every none as zero drags its average down with projects that were never costed in the first place.")

q(0, "Procurement stands at 30.0000 percent of 8600000 on a task where nothing has actually started. Which check catches it?",
 "No check does, since the guard is a range check rather than a truth check, so a readable figure inside 0 to 100 passes and puts earned value into a report with no work behind it.",
 ["The schedule index catches it, because a task earning ahead of its own window drives that index above one and 0.821326 would have read differently at the date.",
  "The cost index catches it, because Procurement has spent 2450000 against its earned value and progress typed ahead of the work shows up as an index above 1.027027.",
  "The basis line catches it, because the engine states what it did and would name Procurement among the tasks whose progress it could not reconcile with their spending."],
 "Acceptance means the numbers were readable and in range. Earned value is only as good as the progress typed into it, and the refusals guard the arithmetic rather than the judgement.")

# ---------------------------------------------------------------- m06, reading a plan against itself

q(1, "EGINA carries a facility screening estimate of 1363.3524 million USD. Which figure does it belong beside?",
 "The concept's facilities field of 1350.0000, a gap of 13.3524, since the screening estimate covers one facility.",
 ["The concept's capex of 2250.0000, which is the plan's estimate of what the development costs and so the only total a facility estimate can properly be tested against.",
  "The cost items CAPEX total of 2250.0000, because a screening estimate and a budget are both statements about money the plan intends to spend on the development.",
  "The FPSO hull and topsides line of 1180.0000, because the screening estimate prices a hull from its type and its nameplate of 60000 bopd and from nothing else."],
 "Setting 1363.3524 against 2250.0000 compares one facility with a development that also drills 520.0000 of wells and lays 380.0000 of subsea.")

q(3, "A plan states its own duration three ways, 870 days from the network, 933 days across the dates typed on the activities and 36 months from the concept, and reports a payback of 3.8273 years. Which of the four is not a statement about the schedule?",
 "The payback of 3.8273 years, read off the cumulative cash flow, which moves with the oil price while the other three do not.",
 ["The 933 days, which is only the window somebody typed into the activities and carries nothing about how long the work itself takes.",
  "The 36 months, which the concept dates from its own start of 2027-04-01 rather than measuring it from any activity the plan carries.",
  "The 870 days, which is the logic's answer about the work and says nothing about the calendar the plan will actually be run against."],
 "All three durations describe the schedule by three mechanisms, which is why 870, 933 and 36 months stand together. The cumulative runs -2250.0000, -1454.1875, -658.3750 and then 137.4375, and at 18.0000 USD a barrel the same case never pays back.")

q(0, "The plan's cost items carry a Decommissioning provision of 260.0000 typed as ABEX, and the engine reports a CAPEX total of 2250.0000 and an OPEX total of 95.0000 a year. Where is the 260.0000?",
 "In neither total, because an ABEX line is neither development capex nor an annual operating cost, and the case charges it in the final production year instead.",
 ["Inside the CAPEX total of 2250.0000, beside the drilling of 520.0000 and the subsea of 380.0000, because a provision is money committed ahead of first oil.",
  "Spread through the operating years inside the 95.0000 a year, which is how an abandonment provision is charged, and taken again in the facility figure of 204.5029.",
  "Inside the facility screening estimate of 1363.3524, which carries decommissioning at 0.150000 of the capex the facility holds, so the plan's own line duplicates it."],
 "The engine totals are CAPEX 2250.0000 and OPEX 95.0000. The screening estimate carries its own decommissioning figure of 204.5029, which an ABEX cost item replaces rather than adds to.")

q(2, "Two numbers in a plan disagree, so one of them is dropped and the plan reads clean. What has been lost?",
 "The information, since the 63 days between 870 and 933 is the most useful number in EGINA's schedule precisely because nobody planned it.",
 ["Nothing, provided the figure kept is the one the engine produced rather than a derived one.",
  "The audit trail alone, because both figures are still held in the plan's own sections and a reader can recover the difference from the cost items and the concept fields.",
  "The agreement of 0.0000 between the scenario NPV and the plan's own NPV, which is the reconciliation the studio performs for itself and the deletion quietly undoes."],
 "A difference of zero earned by reconciliation is a finding and one assumed in advance is nothing at all. The economics difference is 0.0000 only because the plan was costed against its concept.")

# ---------------------------------------------------------------- across two modules

q(3, "A reader wants the rate of return that goes with the sweep's minus 30 percent oil price end of 466.5563. Where is it?",
 "Nowhere in the sweep, whose eight ends are amounts of money.",
 ["In the scenario table at the Low price case, since 48.0000 USD a barrel is that same downside read through a different card of the studio.",
  "In the price rows at the 40.0000 USD a barrel run, because the sweep takes the price down to about that level and that row carries a rate of its own.",
  "In the base, reduced in the proportion the driver moved, because a rate and a value both scale with the input the sweep has changed."],
 "A rate would need its own run, and the engine reports one only when it verifies a root inside the band between -99 and 1000 percent. On some flows there is none to verify.")

q(1, "Which measure is defined for every one of the five EGINA scenarios, including the case at 18.0000 USD a barrel?",
 "The NPV, defined for every cash flow at every discount rate whether or not a root exists, and reading -1834.1220 on that case.",
 ["The internal rate of return, since the engine returns a status for every case and a status of no-root is itself the answer the search arrived at for that flow.",
  "The payback, since a case that does not pay back is recorded at the project life.",
  "The swing, since the sweep re-runs each scenario across its four drivers and the widest of them, 3097.7119, exists for any case the engine is able to price."],
 "The rate is missing on every one of the five and the payback at 18.0000 is never. A card that leads with a rate has nothing to print on any of them.")

q(0, "A status pack shows ODUDU-2 at 2028-12-31 with a schedule index of 0.821326 beside a completion ratio of 0.261250, and asks which of the two is wrong.",
 "Neither of them, because they answer different questions, one against a planned value that moves with the date and one against a budget at completion that never moves.",
 ["The completion ratio, because a figure reading the same on every as-of date cannot be a measurement of a project already known to be behind its own plan.",
  "The schedule index, because the earned value of 8360000 is a figure taken to the date and dividing it by a time-phased denominator counts the same progress twice.",
  "Both of them, because two measures of one schedule differing by that much show an input error, and only a figure the engine states a basis for belongs in a pack."],
 "Which number is this, and what was it measured against. The same habit puts the network's 870 days beside the calendar's 933 days without calling either of them wrong.")

q(2, "A pack sets ODUDU-2's budget at completion of 32000000 beside EGINA's capex of 2250.0000 million USD and reports the development as well within its budget. What went wrong?",
 "They are different models in different units, a project schedule in whole currency units and a development plan in million USD, and neither measures the other.",
 ["The comparison reached for the concept capex where the cost items CAPEX total of 2250.0000 was the like for like figure, a budget at completion being itself a sum of budget lines.",
  "The budget at completion should have been the planned value of 10178668 at its as-of date.",
  "The capex should have carried the ABEX line of 260.0000 before any comparison was made."],
 "The completion ratio of 0.261250 is progress against 32000000 and says nothing about any development plan. Ask which number this is before asking whether it agrees with another.")

q(1, "A cost the parser could not read once counted as zero, and every index on the report still reconciled. Which habit would have caught it?",
 "Asking whether another number in the plan answers the same question, and holding the reported budget at completion against the costed lines 2400000, 5200000, 8600000, 12500000 and 3300000.",
 ["Watching the completion ratio, which rises when a cost drops out of the budget at completion and would have read above 0.261250 on the same earned value of 8360000.",
  "Watching the cost index, since an actual cost is untouched by an unreadable planned cost and the index of 1.027027 would have moved against a shrunken earned value.",
  "Watching the basis line, which states that the planned value was time-phased to the as-of date and would have named the task whose planned cost it could not read."],
 "Those five planned costs add to 32000000, and a ratio that has quietly moved looks ordinary on its own. Correct arithmetic on the wrong inputs is the hardest error to find.")

q(3, "EGINA at 18.0000 USD a barrel reports no rate, a risk with no probability contributes 0.0000 to an exposure of 269.0000 million USD, and a project with no costed task reports no index. What do the three share?",
 "Each is an absence reported with the reason for it rather than a default filling the space.",
 ["Each is a zero the engine reports as a number, so a roll-up may average them alongside the measured figures beside them without distorting what the average says.",
  "Each is a case the engine refuses outright and declines to price, in the way a price deck that does not cover the whole production profile is refused by name.",
  "Each is a low reading rather than a missing one, so an unscored risk sits in the Low band and a case with no rate sits at the bottom of any ranking made on rate."],
 "A clamp of 1000 percent and an invented index of one used to fill exactly these spaces. The unscored risk carries a cost impact of 400.0000 and the health is 58 with it and 58 without.")

q(0, "Three reports arrive: a scenario with no rate of return, a project whose schedule index is none because one costed task carries no dates, and a project with no planned value at all. What does a reader take to a decision from each?",
 "The NPV of -1834.1220 and a payback of never, then the earned value, the actual cost and the completion ratio of 0.256839, and then nothing until a cost is entered.",
 ["A rate of 1000 percent, an index of one and a percent complete of zero, each being what the engine returns once its own search or its own denominator runs out.",
  "The status alone in all three, since no-root, a planned value that cannot be phased and a task list with no costs are findings rather than measurements and carry no figures.",
  "The completion ratio in all three, since it needs neither a root nor a calendar and reads 0.261250 wherever a budget at completion has been built from the task list."],
 "The basis lines say which measurement is gone and why: \"1 costed task carries no planned dates, so planned value cannot be time-phased\" and \"no costed task, so there is no planned value\".")

q(2, "A portfolio roll-up averages a rate column holding -36.6747 percent, and a schedule index column in which every none has been entered as zero. Which of the two averages is sound?",
 "The rate column, because -36.6747 percent is a measured root, while a none entered as zero turns projects nobody measured into projects that are failing.",
 ["The index column, because a schedule index of 0.000000 is a real measurement of a project that has earned nothing at all, so zero is the value that a missing index properly takes.",
  "Neither, because the repaired engine withholds a negative rate as it withholds an index.",
  "Both, provided the count of contributing projects is printed beside each average."],
 "Treating every none as one hides them instead. A schedule index of 0.000000 against a planned value of 50.0000 is a measurement, and none means there was no plan to ask anything.")

emit(Q, '/root/ec-wip-fdp/banks/ec6a_exam.json')
finish()
