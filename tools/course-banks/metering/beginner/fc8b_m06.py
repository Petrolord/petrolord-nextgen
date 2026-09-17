import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Associate m06, The uncertainty budget. Digest sections 13 and 14.

q(2, "What does the sensitivity column of the uncertainty budget say about an input?",
 "How much the flow moves for a given proportional move in that input, so a sensitivity above one amplifies the input's error and one below one damps it.",
 ["How uncertain the input itself is, expressed against the input rather than against the flow, which is why it is printed beside the uncertainty column.",
  "How large a share of the variance the term will carry, which is why the term with the largest sensitivity is the one the engine names as dominant.",
  "How far the input may move before the engine warns, which is what makes the column a screen rather than a weighting."],
 "The sensitivities are read off the orifice equation itself, and multiplying one by the uncertainty of its input gives that term's contribution."),

q(0, "Which term in the ABOH budget carries a sensitivity above one, and what does that mean for it?",
 "The orifice bore at 2.114632, so an error in the bore arrives in the flow amplified rather than damped.",
 ["The discharge coefficient at 1.000000, which is the largest sensitivity in the table and is why it dominates the variance on this run.",
  "The differential pressure at 0.500000, which is above one once the square root is taken.",
  "The pipe bore at 0.114632, since it enters the beta twice."],
 "A sensitivity of 2.114632 against an input uncertainty of 0.050000 percent gives a contribution of 0.105732 percent. The pipe bore sensitivity of 0.114632 is the damped case."),

q(1, "How is a term's contribution column produced from the two columns to its left?",
 "The uncertainty of the input is multiplied by the sensitivity of the flow to that input.",
 ["The uncertainty of the input is squared and then divided by the sensitivity, which is what puts every term onto the variance scale the last column reports.",
  "The uncertainty of the input is divided by the sensitivity, because a sensitivity above one means a smaller share of the input error reaches the flow.",
  "The uncertainty of the input is taken as it stands, with the sensitivity column applying only to the last column."],
 "Density at a sensitivity of 0.500000 and an uncertainty of 0.300000 percent contributes 0.150000 percent, which is the arithmetic on every row."),

q(3, "The six contributions are combined into a total of 0.581059 percent. How?",
 "As a root sum of squares: each contribution is squared, the squares are added, and the total is the square root of the sum.",
 ["By adding the six contributions, which is why the total is larger than any one of them and smaller than a simple sum of the uncertainties.",
  "By taking the largest contribution and widening it by the share of the variance the other five carry between them.",
  "By multiplying the six contributions by their sensitivities and summing the products, which is what the last column reports."],
 "The last column is each term's share of that sum of squares, which is a different ranking of the same six terms from the contribution column."),

q(2, "Why does the budget carry a share of variance column when it already carries a contribution column?",
 "Because squaring reorders the six terms, and the share column is the one that says where money spent on better instrumentation would go.",
 ["Because the contribution column is in percent of the input and the share column is in percent of the flow, so only the second can be compared across terms.",
  "Because the share column is the one that sums to the total, and a reader checking the arithmetic needs a column that adds up.",
  "Because the contribution column is computed for the engine's own default uncertainties and the share column for the ones actually supplied."],
 "Quote the share column when you are deciding what to improve, and quote the total when you are stating what the meter is worth."),

q(0, "What does the digest print about the two largest shares of the variance on the ABOH run at its design reading?",
 "The discharge coefficient at 74.045614 percent against expansibility at 11.847298 percent, a difference of 62.198316 and a ratio of 6.250000.",
 ["The discharge coefficient at 74.045614 percent against density at 6.664105 percent, which are the two terms the engine names on that run.",
  "The discharge coefficient at 0.500000 percent against density at 0.300000 percent, which are contributions rather than shares.",
  "That the discharge coefficient carries about three quarters of the variance, which is the comparison the budget was built to support."],
 "That RELATION is between the two largest shares of the variance, and the engine names the discharge coefficient as dominant and expansibility as the runner up."),

q(1, "The total on the ABOH budget is 0.581059 percent of flow. What is that a band around?",
 "The flow figure, rather than any one of the six inputs that went into it.",
 ["The differential reading, because the budget was derived at a reading and a band belongs to the quantity it was derived at.",
  "The discharge coefficient, since it is the term the engine names as dominant and the total is dominated by it.",
  "Each input in turn, which is why the six contributions can be read as bands on their own rows."],
 "A flow of 24602.3337 lb/hr quoted with that band beside it is a defensible statement, and the same flow quoted alone invites a precision nobody claimed."),

q(3, "Given a reading and a span, the budget derives its differential term from the transmitter and says so. What does that line read?",
 "`the differential transmitter: 0.075 percent of a 200 in H2O span read at 63.8 in H2O is 0.235 percent of reading`",
 ["`the differential transmitter: 0.235 percent of a 200 in H2O span read at 63.8 in H2O is 0.075 percent of the reading`",
  "`the differential transmitter: 0.075 percent of span, applied at the reading supplied with this call`",
  "`a typed differential uncertainty`, since the reading and the span are typed inputs like any other"],
 "The route is reported on the result so a screen cannot show a transmitter panel beside a budget that disagrees with it."),

q(2, "With no reading and no span the same call takes a typed figure instead. What does that do to the total on the ABOH beta?",
 "It moves it from 0.581059 percent to 0.621539 percent, a difference of -0.040480 and a ratio of 0.934872.",
 ["It moves it from 0.581059 percent to 0.757503 percent, which is what the budget reports once the transmitter is no longer supplying a term.",
  "It leaves the total unchanged, because the engine's typed default was chosen to match the transmitter at the design reading.",
  "It refuses, because a budget with no stated basis for its differential term is one that nobody can defend to a reader."],
 "Both figures are totals for the same run at the same beta. The only thing that differs is where one of the six terms came from."),

q(1, "What failure does a basis line on the budget result prevent?",
 "A screen whose transmitter panel and whose budget are each correct in their own terms while the page as a whole tells a lie.",
 ["A budget computed twice on the same call, once from the transmitter and once from the typed figure, with the two totals printed side by side and no way to choose.",
  "A budget that reads the transmitter when a calibration certificate was available.",
  "A budget whose six terms no longer sum to the total the engine printed."],
 "A reader will naturally assume the budget used the figure printed above it. The basis line removes that failure completely."),

q(0, "Running the budget down the span changes which term the engine names as dominant. What is moving to cause that?",
 "One term only, the differential pressure term, because it is derived from the transmitter at the reading in the first column.",
 ["The discharge coefficient, because its sensitivity of 1.000000 is applied to a coefficient that is itself evaluated at the Reynolds number of each row.",
  "The expansibility, because the pressure ratio changes with the reading and the factor is computed against it.",
  "All six, because every uncertainty in the budget is quoted as a percentage and every percentage moves when the flow the budget is written against moves."],
 "The plate did not change and the fluid did not change, and five of the six uncertainties are the engine's defaults on every row of that table."),

q(3, "At what reading does the dominant term change name, and what else is printed at that reading?",
 "At 15.000000 in H2O, with a flow turndown there of 3.651484 and a total uncertainty there of 0.757503 percent.",
 ["At 16.000000 in H2O, with a flow turndown there of 3.651484 and a total uncertainty of 0.757503 percent.",
  "At 16.862007 in H2O, where the engine stops calling the lead clear.",
  "At 14.000000 in H2O, with a total uncertainty there of 0.757503 percent."],
 "Above that reading the engine names the discharge coefficient and below it the differential pressure, and the figure was found by bisecting the returned name."),

q(2, "Why was the crossover found by bisecting the returned name rather than read off the twelve row table?",
 "A table puts the crossover somewhere between two rows, and a bisection on the name gives the reading itself.",
 ["A table row can name a term while the clear flag beside it is false, so the printed names cannot be trusted as evidence of anything.",
  "The rows were chosen for the transmitter sweep, so none sits near the crossover.",
  "The engine names a dominant term only when the lead is clear."],
 "The distinction is the same one the small bore threshold and the published beta edges rest on: ask the engine, and halve the gap."),

q(1, "The budget returns a flag saying whether the lead is clear. What does a false flag tell a reader to do?",
 "Treat the named term as a ranking with no margin behind it, because improving either of the two leaders alone will move the total very little.",
 ["Discard the name and use the total alone, because a ranking the engine will not stand behind carries no information about the meter at that reading.",
  "Improve the second term rather than the first, since the two are close and the cheaper of the two is the one worth attacking.",
  "Rerun the budget with the typed differential uncertainty, because a false flag is how the engine reports that the transmitter route produced an unstable ranking."],
 "The engine's own words in that case are that the two shares are too close to call a dominant term. In a root sum of squares two terms of similar share have to be attacked together."),

q(0, "On the ABOH run at its design reading the lead is clear, and the digest records where that stops being true. Where?",
 "At a reading of 16.862007 in H2O.",
 ["At a reading of 15.000000 in H2O, which is the same reading the name changes at.",
  "At a reading of 16.000000 in H2O, where the flow turndown reaches 3.651484 and the name changes.",
  "At a reading of 22.222222 in H2O, where the transmitter warning starts."],
 "Between that reading and the reading where the name changes, the engine still names a dominant term while telling you the name is not worth much."),

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/beginner/fc8b_m06.json', expect_n=15)
finish()
