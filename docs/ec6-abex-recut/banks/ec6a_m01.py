import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(2, "Run the EGINA Base case with no end-of-life cost and it reports an internal rate of return of 29.5998 percent at the status ok. Where does that number come from?",
 "It is solved: the discount rate that drives this flow's net present value to zero, fixed by the capex of 2250.0000 million USD, the shape, the price and the terms.",
 ["It is the screening threshold the studio applies to an FPSO concept, carried on the concept beside its three capex fields of 520.0000, 1350.0000 and 380.0000.",
  "It is the discount rate the net present value of 2047.5653 million USD was struck at, which the studio raises above its default of 10.0000 percent for a long shape.",
  "It is a score the engine formed about the concept, weighing the money returned against the 2250.0000 million USD committed."],
 "Nobody chose 29.5998. Year 0 spends 2250.0000 and the years after it earn, and the rate falls out of that flow; charge the plan's end-of-life cost and the same case is worth 2015.4123 with two roots and no rate.")

q(0, "At 40.0000 USD a barrel the concept is worth -197.2391 million USD and reports no rate of return at all, at the status multiple-roots. What is that status saying about the flow?",
 "It changes sign more than once, so more than one discount rate zeroes it and the engine will name none of them the rate of return.",
 ["The search ran out of range before it reached a root, so the status stands in for a rate the engine could see but not confirm inside the band.",
  "The value fell below zero, and the engine withholds a rate on any case whose value is negative at the screening discount of 10.0000 percent.",
  "No root exists at all here, in the way a flow that only spends has none, which is the reading the status no-sign-change carries."],
 "The plan pays 260.0000 million USD to abandon the field in production year 20, so every earning case here changes sign twice; the value of -197.2391 is defined all the same.")

q(3, "The Base cumulative runs -2250.0000, then -1454.1875, then -658.3750, then 137.4375. Why is that climb the reason a discount rate can zero this flow at all?",
 "It starts negative and later turns positive, so some discount rate brings the discounted total to zero.",
 ["Each of the first three years earns 795.8125, and a flow whose early years are equal always carries exactly one root for the search to find.",
  "The cumulative reaches 137.4375 inside the concept life of 20.0000 years, which is the crossing the search requires before it will report any rate.",
  "The net present value of 2015.4123 million USD is positive, and a positive value guarantees a root somewhere inside the band of -99 to 1000 percent."],
 "Discounting punishes the late positive years harder than the year 0 spend of -2250.0000, so a rate that zeroes it exists, and on this plan two of them do; a flow that never turns has none.")

q(1, "What makes the Base net present value of 2015.4123 million USD and the tie-back's 1013.7182 comparable numbers?",
 "Both were struck at a discount rate of 10.0000 percent on the same oil price of 70.0000 USD a barrel, which is what puts them on one basis.",
 ["Both concepts total their capex from the same three fields, which puts the two values onto one basis whatever price each of them was separately run at.",
  "Both scenarios report the status ok, which the engine sets only where two cases share a fiscal basis and one discount rate.",
  "Both clear a screening hurdle of 15 percent, which puts every case that passes onto one footing."],
 "Neither case carries a rate at all, and the capex differs, 730.0000 against 2250.0000; what the two values share is the price and the discount rate.")

q(2, "Value per million of capex is 1.388655 for the tie-back and 0.895739 for the FPSO. What does that pair establish?",
 "Every million the tie-back commits works harder, and there is far less of it committed: 730.0000 million USD against 2250.0000.",
 ["The tie-back is worth more money, since 1.388655 is the share of the field's total value that its capex captures against the FPSO's 0.895739.",
  "The FPSO is the more efficient user of capital, since its 0.895739 is spread over a life of 20.0000 years against the tie-back's 15.0000.",
  "The two concepts are interchangeable, since 1.388655 and 0.895739 both sit above zero."],
 "A plan that stops at the tie-back leaves the rest of the field undeveloped rather than earning 0.895739 per million on it, which is why 1013.7182 is less than 2015.4123.")

q(3, "Two cash flows differ by a factor of three in every single year. What do their rates of return read?",
 "The same rate, because a rate is a percentage and divides out the scale of the flow before it reports.",
 ["Rates three times apart, since the larger flow returns three times the money on the same shape and a rate carries the size of the money through.",
  "Whatever their paybacks imply, since payback and rate are both indifferent to size and therefore move together on any pair of flows.",
  "No rate at all for the smaller of the two, since a flow scaled down towards the floor of -99 percent loses the crossing that the search needs."],
 "The tie-back's higher root of 40.4136 says nothing about its 730.0000 million USD of capex, which is why 1013.7182 sits under a higher figure than 2015.4123.")

q(1, "A published suite case spends 100000 in capex and reports a value of -92616.5020, a rate of -36.6747 percent and the status ok. Why is the status ok?",
 "The flow changes sign, the search found a verified root inside the band of -99 to 1000 percent, and that root simply happens to be negative.",
 ["The status records only that the engine priced the case without refusing one of its inputs, so any run that produced a number at all carries it, whatever the search itself found.",
  "The rate cleared the floor of -99 percent, and ok marks any rate the band contains.",
  "The value of -92616.5020 is a real number rather than a null, which is what ok reports."],
 "A rate of -36.6747 percent says the money came back and came back short, which is a real answer; a null with a status would have said something else.")

q(0, "Three cases all lose money: one reads -92616.5020 with a rate, one reads -1834.1220 with the status no-root, and one reads -524.1537 with no-sign-change. What separates them?",
 "Only the first has a rate: the second changes sign with no rate in the band zeroing it, and the third never changes sign at all.",
 ["Nothing that matters at screening, since all three destroy value and a status records only how far the search ran.",
  "The size of the loss, since a loss as deep as -92616.5020 always admits a root while -524.1537 leaves nothing to find.",
  "The discount rate each was struck at, since -1834.1220 and -524.1537 were taken at rates outside the band."],
 "A reader who files all three under a bad rate has lost the difference between a project that returned money badly and one that returned none.")

q(2, "A team suppresses any rate below zero on their screening cards, on the grounds that a minus sign looks like an error. What have they given up?",
 "The difference between a project that returned money badly at -36.6747 percent and one with no root at all, which the engine marks with a null and a status naming the reason.",
 ["Nothing at all, since every EGINA case reports a rate above the screening discount of 10.0000 percent.",
  "The floor of the search, since hiding rates below zero narrows the band upward from -99 percent.",
  "The payback column, since a case with a negative rate never pays back and must be hidden alongside."],
 "The published case at -36.6747 percent carries the status ok on a value of -92616.5020, while the 18.0000 USD a barrel case has no rate to print at all.")

q(0, "The Base case reports payback of 3.8273 years. What does that figure record?",
 "The cumulative first turned positive inside year 3, moving from -658.3750 up to 137.4375, so the crossing falls part way through the year.",
 ["The discounted cash flow first exceeded the capex of 2250.0000 million USD there, which is the point the engine measures a discounted payback to.",
  "The third full year of production closed at 137.4375 and the remaining fraction is the share of year 4 added for discounting.",
  "The engine interpolated between the year 3 and year 4 positions of 137.4375 and 847.0187 to find where the discounted flow meets the capex of 2250.0000."],
 "Year 0 spends 2250.0000 and each of the first three years earns 795.8125, which walks the cumulative back up through zero inside year 3.")

q(3, "At 30.0000 USD a barrel the concept is worth -935.1995 million USD and the cumulative never reaches zero. What should the payback column carry?",
 "Never, as a null, which is the measured answer rather than missing data.",
 ["The concept life of 20.0000 years, the convention the published zero production case records beside its value of -979.6325.",
  "The payback of the nearest case that does pay back, 5.7734 years from the 48.0000 USD a barrel run, carried as an upper bound.",
  "Nothing at all, since a case the engine has refused to price carries neither a payback nor a rate and the status stands for both."],
 "Substituting the project life turns the clearest finding a screening case can make into a plausible looking 20.0000; at 18.0000 USD a barrel the answer is the same null.")

q(2, "One flow collapses after its cumulative turns and another climbs to 2540.3809 by year 7. Both cross at the same moment. What does payback report?",
 "The same figure for both of them, because payback stops looking the moment the cumulative turns positive.",
 ["A shorter payback for the climbing flow, since the engine weights the years after the crossing by how much each of them adds.",
  "A payback for the climbing flow only, since a flow that falls back below zero has its payback withdrawn and reported as never.",
  "Two figures that rank with the values, since the flow reaching 2540.3809 is worth more."],
 "The Base case is at 137.4375 when it crosses and 2540.3809 by year 7, and 3.8273 years is the same reading in both.")

q(0, "The Low price scenario is worth 392.8013 million USD and reports no rate of return at all, so a screening hurdle of 15 percent has nothing to test. What does the hurdle do with it?",
 "Nothing it can act on: the card has no rate to colour, and the figure that survives is the 392.8013 million USD the case is worth at a discount rate of 10.0000 percent.",
 ["It rejects the case as a loss, since a case the engine gives no rate has already been priced below zero.",
  "It passes the case, since a scenario with no rate clears any threshold until a rate is entered against it.",
  "It applies itself to the concept's capex of 2250.0000 instead, since a threshold has to test some figure."],
 "The rule needs a rate and the engine reports none, so the verdict is missing rather than negative, and the 392.8013 million USD is money the field would otherwise not have had.")

q(1, "A screening process filters on a hurdle and then sorts the survivors by how far each cleared it. What does that do to the EGINA scenarios?",
 "It sorts nothing at all, since not one of the five carries a rate to clear a hurdle by, and 3638.0233, 2015.4123, 1013.7182 and 392.8013 go unranked.",
 ["It produces an order that matches the values, since the margin above a hurdle grows with the size of the case and 2015.4123 million USD leads it.",
  "It ranks them on the higher of the two rates that zero each flow, which puts the tie-back's 40.4136 above the Base's 29.5779 and so puts the tie-back first of all.",
  "It puts the two concepts on separate lists, since 730.0000 and 2250.0000 are not the same commitment."],
 "The hurdle divides the scale out before it tests anything, and here there is nothing to divide: the card reports no rate on any EGINA case.")

q(2, "A screening case is discounted at 10.0000 percent and a hurdle of 15 percent is then applied to its rate. How do the two relate?",
 "They are two different tests, one charging future money before the value is struck and one a policy applied to the rate afterwards.",
 ["They are one test stated twice, since a value taken at 10.0000 percent is positive exactly when the rate clears 15 percent and negative when it does not.",
  "The hurdle replaces the discount rate for any case the engine returns a rate for, so the Base value of 2015.4123 million USD is restated at the higher rate.",
  "The engine derives the hurdle from the default terms of royalty 12.5000 percent and tax 30.0000 percent."],
 "The Low price case passes the first test, since 392.8013 million USD is positive, and the second has no rate to test at all; which of them decides is a policy somebody set.")

emit(Q, '/root/ec-wip-fdp/banks/ec6a_m01.json')
finish()
