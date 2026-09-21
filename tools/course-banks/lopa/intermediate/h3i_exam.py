import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 Professional final exam, 42 questions.
# Digest sections 14 to 24 and 32, spread roughly in module proportion:
# seven on the simplified forms and the vocabulary, seven on the full Annex B
# form with its equivalent down times, the repair time after a test and
# imperfect coverage, seven on common cause, seven on the architectures and
# the refusals of a subsystem call, seven on the series sum, and seven on the
# published reproduction, the warnings and the refusals of a function call.

# ---- the simplified forms, the identity and the vocabulary ----

q(0,
 "The simplified forms table bands the two out of three at 3 on the EKULAMA channel. What risk reduction factor stands on that row?",
 "2758.406219",
 ["2706.319458","3377.890772","3801.573360"],
 "The simplified table prints 2758.406219 beside a 2oo3 PFDavg of 0.000362528185. 2706.319458 is the same architecture once detected failures are added to the channel. 3377.890772 is the simplified pair and 3801.573360 the simplified three channel arrangement, both of which sit lower on PFDavg and so higher here.")

q(2,
 "And beside the simplified two out of two on the same channel?",
 "95.129376",
 ["94.553707","90.422454","68.460327"],
 "The simplified table prints 95.129376 against a 2oo2 PFDavg of 0.010512000000 and bands it 1. 94.553707 is the same architecture once the channel carries detected failures. 90.422454 and 68.460327 belong to a shutdown valve swept over proof test coverage, which is a different subsystem entirely.")

q(3,
 "Which simplified form cubes its independent piece before dividing it?",
 "1oo3",
 ["1oo1","1oo2","2oo3"],
 "The simplified table gives the 1oo3 the form ((1 - b) lambdaDU T)^3 / 4 + b lambdaDU T / 2, the only cube among the five. The 1oo2 squares and divides by three, the 2oo3 squares with no division, and the 1oo1 is linear in lambdaDU T with no independent piece to raise at all.")

q(1,
 "The vocabulary fixes what a risk reduction factor is and where each kind of one comes from. Which reading is right?",
 "One over PFDavg, required when it comes from a LOPA row and achieved when it comes from verification.",
 ["One over PFDavg, and the two halves of the engine return the same quantity under the same name, so no distinction between them is needed at all.",
  "The ratio of a mitigated frequency to an unmitigated one, which is required from a row and achieved from a function.",
  "The ratio of an achieved PFDavg to a required one, quoted at twelve decimals."],
 "The vocabulary section fixes the risk reduction factor as one over PFDavg, and says a required one comes from LOPA while an achieved one comes from verification, so the distinction is exactly what the name carries. A mitigated frequency over an unmitigated one is the wrong way up and falls below one, an achieved PFDavg over a required one is a different quantity, and risk reduction factors are quoted at six decimals.")

q(2,
 "Which set of equations does this engine actually implement?",
 "The full Annex B low demand form, with the simplified forms falling out of it in one corner.",
 ["The simplified forms, with corrections added for detected failures, for a repair time after a test and for a proof test coverage below one.",
  "Both sets, choosing between them by whether the call carries detected failures.",
  "The time dependent route, averaged by quadrature."],
 "The identity section says the engine implements only the full form and that the simplified forms are its special case at lambdaDD = 0 and MRT = 0. It does not choose between two implementations, it adds no corrections to a short form, and the time dependent route belongs to the oracle behind the golden rather than to the engine.")

q(0,
 "Every redundant simplified form on that channel carries one term in common. Which is it?",
 "The common cause piece, written b lambdaDU T divided by two, which is a single channel term no voting arrangement removes.",
 ["The squared independent piece, which every redundant form raises to the same power and divides by the same coefficient of three.",
  "The channel equivalent down time, which the simplified forms carry in place of the half interval they would otherwise use.",
  "The detected common cause piece, which is betaD multiplied by the detected rate and by the restoration time."],
 "The simplified forms print b lambdaDU T / 2 in the 1oo2, the 2oo3 and the 1oo3 alike. The independent pieces differ: one is squared and divided by three, one is squared alone, one is cubed and divided by four. The equivalent down times are the full form's bookkeeping. And there are no detected failures at all in the simplified corner.")

q(1,
 "At what precision does this course quote its figures?",
 "PFDavg values and probabilities at twelve decimals, and risk reduction factors, hours and years at six.",
 ["PFDavg values at three significant figures, which is the precision the published source prints, and everything else at six decimals throughout the course.",
  "Everything at six decimals, since that is what the engine prints.",
  "Everything at twelve decimals, including counts and band numbers."],
 "The precision rule is that frequencies, probabilities and PFDavg values print to twelve decimals, while risk reduction factors, hours and years print to six, with counts and band numbers as whole numbers. Three significant figures is what one published source printed, and the reproduction is measured against it rather than quoted at it.")

# ---- the full Annex B form, the repair time after a test, coverage ----

q(3,
 "The EKULAMA pair is run with its repair time after a proof test set to zero, every other stated input held. What channel equivalent down time results?",
 "1319.600000",
 ["1322.000000","1326.800000","1341.200000"],
 "The repair time sweep prints 1319.600000 hours at zero. 1322.000000 hours is the same channel at the 8 hours it is otherwise stated at, and 1326.800000 and 1341.200000 hours are the rows at 24 and 72 hours. The repair time is added once to each undetected down time, so the channel figure moves with it.")

q(1,
 "On that same sweep, what group equivalent down time does a repair time of 24 hours give?",
 "888.800000",
 ["881.600000","884.000000","932.000000"],
 "The sweep prints 888.800000 hours for the group at 24 hours. 881.600000 hours belongs to the zero row and 884.000000 hours to the 8 hour row. 932.000000 hours is the group figure at a week. Both equivalent down times move together across the sweep, because the same addition is made to each.")

q(2,
 "What PFDavg does the pair return at that repair time of 24 hours?",
 "0.000300267345",
 ["0.000298347613","0.000304116193","0.000311851427"],
 "The sweep prints 0.000300267345 at 24 hours, which is 1.006435 times the zero row, derived. 0.000298347613 is the zero row itself. 0.000304116193 is 72 hours and 0.000311851427 is a week, so each of those answers a longer repair time than the one asked about.")

q(3,
 "How much does a repair time after a test of a week add to that pair, measured against a repair time of zero?",
 "4.53 percent",
 ["30.00 percent","71.78 percent","20.61 percent"],
 "The repair time section prints 4.53 percent, derived, for 168 hours against zero, a modest effect on a one year interval. 30.00 percent is the undetected fraction a proof test coverage of 0.7 leaves uncovered. 71.78 percent and 20.61 percent are shares of the teaching function carried by its valves and its transmitters.")

q(0,
 "The OBAGI valve is given a perfect proof test, every other stated input held. What PFDavg comes back?",
 "0.003963600000",
 ["0.005737500000","0.007511400000","0.014607000000"],
 "The coverage table prints 0.003963600000 at a coverage of 1, with a channel equivalent down time of 4404.000000 hours and a band of 2. 0.005737500000, 0.007511400000 and 0.014607000000 are the rows at coverages of 0.95, 0.9 and 0.7, each of which leaves part of the undetected population waiting for the overhaul.")

q(2,
 "Which risk reduction factor does that valve carry at a proof test coverage of 0.9?",
 "133.130974",
 ["174.291939","252.295893","189.107413"],
 "The coverage table prints 133.130974 at 0.9, still inside band 2. 174.291939 is the 0.95 row and 252.295893 the perfect test row. 189.107413 belongs to a single EKULAMA channel with detected failures, which is a different subsystem on different rates.")

q(1,
 "In the equivalent down time table for the EKULAMA pair, which figure is the detected common cause term?",
 "0.000000448000",
 ["0.000263280000","0.000035259176","0.000105777528"],
 "The table prints 0.000000448000, which is betaD multiplied by lambdaDD and by the MTTR alone, and it is almost invisible beside the rest of the answer. 0.000263280000 is the undetected common cause term, which waits half an interval. 0.000035259176 and 0.000105777528 are independent terms of the pair and of the two out of three.")

# ---- common cause ----

q(0,
 "A beta factor of 0.05 is typed on the EKULAMA pair, betaD at half of it. What independent term does the call carry?",
 "0.000035005448",
 ["0.000036430741","0.000032693162","0.000028305589"],
 "The common cause sweep prints an independent term of 0.000035005448 for the pair at 0.05. 0.000036430741 is that term at 0.02, 0.000032693162 at 0.1 and 0.000028305589 at 0.2. The term falls as the fraction rises, because those failures are taken out of the independent rate before it is squared.")

q(3,
 "Three channels voting two of them, at that same fraction of 0.05 and half of it: which total?",
 "0.000368856345",
 ["0.000298845448","0.000214828223","0.000625759485"],
 "The sweep prints 0.000368856345 for the 2oo3 at 0.05, the row where that arrangement first reads common cause dominated. 0.000298845448 is the pair on the same row. 0.000214828223 is the 2oo3 at 0.02 and 0.000625759485 the 2oo3 at 0.1.")

q(1,
 "And the pair itself on that row of the sweep?",
 "0.000298845448",
 ["0.000368856345","0.000298987176","0.000141966741"],
 "The sweep prints 0.000298845448 for the 1oo2 at a beta factor of 0.05 with betaD at 0.025. 0.000368856345 is the two out of three beside it. 0.000298987176 is the same pair at the stated betaD of 0.02 rather than half the beta factor, which is a different input. 0.000141966741 is the pair at 0.02.")

q(2,
 "What common cause contribution do both arrangements carry once the fraction reaches 0.1?",
 "0.000527680000",
 ["0.000263840000","0.001055360000","0.000105536000"],
 "The sweep prints 0.000527680000 in the common cause column of both the pair and the two out of three at 0.1. 0.000263840000 is that column at 0.05, 0.001055360000 at 0.2 and 0.000105536000 at 0.02. The column is identical across the two arrangements on every row, which is the point of the sweep.")

q(0,
 "At that same fraction of 0.1, what independent term does the two out of three carry?",
 "0.000098079485",
 ["0.000109292223","0.000105016345","0.000084916768"],
 "The sweep prints 0.000098079485 for the 2oo3 independent term at 0.1. 0.000109292223 is that term at 0.02 and 0.000105016345 at 0.05. 0.000084916768 is the same term at 0.2, one row further down, so each answers a different claim about common cause.")

q(3,
 "The two out of three is pushed to a fraction of 0.2 with betaD at half. What total is printed?",
 "0.001140276768",
 ["0.001083665589","0.000625759485","0.000560373162"],
 "The sweep prints 0.001140276768 for the 2oo3 at 0.2, and the pair beside it reads 0.001083665589, so two arrangements of quite different cost sit within a few percent of each other once common cause dominates both. 0.000625759485 and 0.000560373162 are the same two arrangements at 0.1.")

q(1,
 "How does the engine build the two common cause terms it adds back?",
 "The beta factor multiplied by lambdaDU and by T1/2 plus MRT, and betaD multiplied by lambdaDD and by the MTTR.",
 ["The beta factor multiplied by lambdaDU and by the MTTR, and betaD multiplied by lambdaDD and by T1/2 plus MRT, so each population is charged the down time of the other.",
  "Both fractions multiplied by the total dangerous rate and by the channel equivalent down time, which is what folds the two populations into one figure.",
  "Both fractions multiplied by the squared independent rate and by the group equivalent down time."],
 "The common cause section states the two terms in that order, and neither carries an equivalent down time or a square, because a common cause failure takes the whole group at once and so behaves like one channel failing. Swapping the down times charges each population the wrong wait, which is the mix up the sweep and the golden's differing case exist to expose.")

# ---- the architectures, and what a subsystem call refuses ----

q(2,
 "In the ranked table, what does the single channel read in the column that measures every architecture against it?",
 "1.000000",
 ["2.000000","0.056541","0.069876"],
 "The ranked table prints 1.000000 for the 1oo1, which is the base of that column. 2.000000 is the two out of two, the one entry above the base. 0.056541 is the pair and 0.069876 the two out of three, both far below it.")

q(0,
 "What does a two out of three buy that a one out of two does not, on the same hardware?",
 "Tolerance of one channel calling for a trip on its own, which this engine computes no number for at all.",
 ["A lower PFDavg, because two of its three channels have to be failed before it misses a demand at all.",
  "A smaller common cause term, because the third channel dilutes the fraction that reaches every channel.",
  "A shorter group equivalent down time, because three channels overlap for less of the interval."],
 "The architecture section says the two out of three buys tolerance of one channel tripping spuriously, which this engine does not compute. Its PFDavg is higher than the pair's at 1.235857 times it, derived. Its common cause term is identical to the pair's on every row of the sweep, and both carry a group figure of 884.000000 hours on this channel.")

q(1,
 "Why does the section insist that an architecture comparison hold every other input?",
 "A comparison that moved the device as well as the voting would have changed two things at once and could support no conclusion about voting.",
 ["Because the engine refuses a second call whose inputs differ from the first, and names the input that moved as the offending field of the call.",
  "Because the equivalent down times are computed once per channel and reused across every architecture the same call is run in.",
  "Because the beta factor has to be identical for two arrangements to share a common cause term."],
 "The section makes the point plainly: moving one input and holding the rest is what makes the ranked table an argument about voting. The engine refuses nothing about a comparison. Each call computes its own equivalent down times. And a shared common cause term is a result of the equations rather than a condition on the comparison.")

q(3,
 "What does a subsystem call return beside its PFDavg?",
 "Its risk reduction factor, its band, its terms and its equivalent down times.",
 ["Its risk reduction factor, its band, its terms, its equivalent down times and the longest proof test interval that would still meet the target typed with it.",
  "Its risk reduction factor, its band and a spurious trip rate for the voting arrangement it was given, which is what the architecture choice is made on.",
  "Its risk reduction factor, its band and a hardware fault tolerance verdict read from the normative table of the standard."],
 "The engine returns the PFDavg of one subsystem, its risk reduction factor and band, its terms and its equivalent down times. A longest interval is a separate function of the engine with its own inputs. No spurious trip rate is computed anywhere. And the engine has no hardware fault tolerance check, because it does not restate a licensed normative table.")

q(2,
 "Which two checks does the engine leave to the analyst entirely?",
 "The architectural constraint of the standard, and whether a low demand method is the right one at all.",
 ["The proof test coverage claimed for a written test procedure, and the lifetime at which the item is restored as new, neither of which it will accept as an input.",
  "The series sum of the subsystems and the band the total falls in, both of which it declines to compute for a function.",
  "The equivalent down times and the dominant term, which it reports without computing either."],
 "The engine has no hardware fault tolerance check and no high demand mode, so a PFDavg that meets a target says nothing about the architectural constraint and is the wrong quantity when the demand rate is high. Coverage and lifetime are inputs it takes and uses. It sums a function and bands it, and it computes and reports both equivalent down times and the dominant term.")

q(1,
 "Which arrangement carries a coefficient of 6 on a squared independent rate?",
 "2oo3",
 ["1oo1","1oo2","2oo2"],
 "The engine prints the two out of three form with 6 in front of the squared independent rate, from three pairs at two orderings each. The one out of two carries 2 on the same square. The two out of two is twice one channel with no square at all, and the one out of one is a single product. A 6 also appears on a cubed term elsewhere, which is a different architecture.")

q(0,
 "A subsystem call names an arrangement the engine has never heard of. What comes back?",
 "architecture: must be one of 1oo1, 1oo2, 2oo2, 2oo3, 1oo3",
 ["lambdaDuPerHour: must be a failure rate per hour, zero or more",
  "proofTestIntervalHours: must be a time above 0 hours",
  "mrtHours: must be a time in hours, zero or more"],
 "The engine refuses in those words and lists what it does implement. The message about a failure rate is what a negative lambdaDU earns. The message about a time above 0 hours answers a proof test interval of zero. The message about a time in hours, zero or more, answers a negative repair time after a test, so each of the three names a different field.")

# ---- the series sum and the loop back to the requirement ----

q(3,
 "The ORONI row is taken at a tolerable mitigated event likelihood of 1e-7 per year. What PFDavg does it require of a function?",
 "0.007407407407",
 ["0.000000024205","0.001792971954","0.001287026426"],
 "That row requires 0.007407407407, which is the figure the achieved value is measured against when the teaching function is typed onto it. 0.000000024205 per year is the mitigated frequency the closed row returns. 0.001792971954 is what the function achieves and 0.001287026426 is a different function entirely.")

q(2,
 "With that function typed onto the row, what mitigated frequency does the engine report?",
 "0.000000024205",
 ["0.007407407407","0.001792971954","0.000136440000"],
 "Closing the row with the teaching function gives 0.000000024205 per year, comfortably inside the tolerable frequency, and meetsTmel is true. 0.007407407407 is a required PFDavg and 0.001792971954 an achieved one, so neither is a frequency at all. 0.000136440000 is one subsystem of that function.")

q(1,
 "Why is a band never the target a function is verified against?",
 "A band is a division ten times wide, so a function can sit inside the right band and still be above the PFDavg its row requires.",
 ["A band is read from the achieved risk reduction factor, and a required figure is read from the achieved PFDavg, so the two are never on the same scale.",
  "A band is returned only for a subsystem, so a function total carries a state and no band at all.",
  "A band is assigned before the decade snap is applied, so any value near a decade is banded twice."],
 "The section states the rule: the required PFDavg is the target and the band is the label it wears. A band is returned for a function as well as for a subsystem, both readings come off the same PFDavg, and the decade snap is applied as part of the banding rather than before some second pass.")

q(0,
 "The engine is handed a function whose subsystems add past a probability. What does it do?",
 "It refuses the whole call, because at that point the sum is no longer a probability and the approximation has left the range it is good for.",
 ["It answers with the sum clipped to one, and attaches a warning saying the series approximation has been left behind.",
  "It answers with the sum as computed, because the series form carries no upper boundary of its own.",
  "It answers and reports the call as common cause dominated across the function."],
 "The engine refuses a list of subsystems whose summed PFDavg reaches 1 and says so in its own words. It clips nothing: a refusal replaces the result. The series sum is an approximation that ignores a small overlap term, and reaching a probability of one is exactly where that approximation stops being usable. A dominant term is a reading of one subsystem.")

q(3,
 "Which part of the teaching function is stated with no MTTR at all?",
 "The valves.",
 ["The transmitters.","The logic solver.","Every part of it."],
 "The stated table gives the valves a lambdaDD of 0, so they carry nothing detected to restore and no MTTR is typed for them. The transmitters and the logic solver both carry detected rates and an MTTR of 8 hours, which the engine requires whenever lambdaDD is above zero.")

q(0,
 "One member of a submitted function is missing an input it needs. Which words come back?",
 "subsystems[1].beta: is required for a redundant 1oo2 and must lie in [0, 1]: beta = 0 is a claim of no common cause and has to be typed",
 ["subsystems: must be a non-empty list of subsystem parameter sets",
  "mttrHours: is required when lambdaDD is above zero: detected failures are down for the restoration time",
  "subsystems: the summed PFDavg reaches 1: not a probability"],
 "A function call names the offending member and the field inside it, so the analyst can see which subsystem of the list is incomplete. The message about a non-empty list answers a function with no members at all. The message about a restoration time is what a subsystem call returns on its own. The message about a summed value answers parts that add past a probability.")

q(1,
 "How many subsystems will the engine accept in one function?",
 "Any non-empty list, so a function with two sensor groups or two final elements is verified in the same way.",
 ["Exactly three, since the published series equation names a sensor, a logic solver and a final element and the engine follows it.",
  "At most five, one for each architecture it implements.",
  "Any list whose members share one proof test interval."],
 "The section says the engine takes any non-empty list of subsystems and sums what it computes for each, and the three letters of the published equation are only the usual three links. Nothing caps the list at three or at five, and each member carries its own interval into its own PFDavg.")

# ---- the published reproduction, the warnings and the boundary ----

q(2,
 "How did the published source print the value of its valve assembly?",
 "1.05E-03",
 ["1.29E-03","2.36E-04","6.97E-07"],
 "The reproduction table sets the engine's 0.001048767640 beside a printed 1.05E-03. 1.29E-03 is the printed total of the whole function. 2.36E-04 is the printed pressure transmitter row and 6.97E-07 the printed analogue input card, so each belongs to another row of the same table.")

q(0,
 "And its pressure transmitter row, as printed?",
 "2.36E-04",
 ["3.44E-04","1.05E-03","5.34E-07"],
 "The source prints 2.36E-04 there, which the engine's 0.000235764375 rounds to. 3.44E-04 is the same subsystem in the second table, where the beta factor is raised by half for the voted arrangement. 1.05E-03 is the valve assembly and 5.34E-07 the processor.")

q(0,
 "The warning on a rare event call names a product. What figure does it give?",
 "0.1752",
 ["4.38","8760","0.1"],
 "The warning reads that lambdaDU x T = 0.1752 exceeds 0.1, and the engine answers while saying the answer overstates. 0.1 is the threshold that product crossed rather than the product itself. 4.38 is the value quoted in the refusal further out, where the linearised equations no longer give a probability. 8760 is the interval in hours.")

q(0,
 "Past that warning lies a refusal. Which words does the engine use?",
 "proofTestIntervalHours: the simplified equations give 4.38 here, which is not a probability: lambda x T is far outside the rare-event range they assume; use an exact (Markov) model",
 ["proofTestIntervalHours: must be a time above 0 hours",
  "lifetimeHours: must be at least the proof test interval",
  "targetPfdAvg: must lie in (0, 1)"],
 "The engine refuses in those words and names the model that would answer. The message about a time above 0 hours answers an interval of zero. The message about a lifetime answers a lifetime shorter than the interval it is paired with. The message about a target belongs to a different function of the engine altogether.")

q(1,
 "A coverage below one arrives with no lifetime beside it. Which field does the engine name?",
 "lifetimeHours",
 ["mttrHours","betaD","proofTestCoverage"],
 "The engine names lifetimeHours and says the uncovered failures stay until the item is restored as new. mttrHours is named when a detected rate arrives with no restoration time. betaD is named when detected failures meet a redundant arrangement with no detected fraction typed. proofTestCoverage is named only when the coverage itself lies outside its own range.")

q(2,
 "Which message answers a function whose parts add past a probability?",
 "subsystems: the summed PFDavg reaches 1: not a probability",
 ["mttrHours: is required when lambdaDD is above zero: detected failures are down for the restoration time",
  "subsystems: must be a non-empty list of subsystem parameter sets",
  "lifetimeHours: must be at least the proof test interval"],
 "The engine refuses the sum in those words, because a total of one is no longer a probability. The message about a non-empty list answers a function with no members. The message about a restoration time answers a subsystem with detected failures and no MTTR. The message about a lifetime answers a lifetime shorter than the proof test interval.")

q(3,
 "What had to be assumed before the published table reproduced at all?",
 "That the repair time after a test equalled the MTTR on every row.",
 ["That the beta factor of the voted arrangement was the printed one on every row, including the second table where it is multiplied for voting.",
  "That every row shared one proof test interval of 8760 hours, which the source declined to print anywhere alongside its results table.",
  "That the failure rates were the engine's own illustrative teaching values rather than the vendor figures the source cites for them."],
 "The reproduction section says the published table reproduces only with MRT equal to the MTTR on every row. The interval of one year is printed by the source throughout. The rates are the source's own, cited there to industry databases and vendor certificates. And the second table reproduces at a beta factor raised by half rather than at the printed one.")

emit(Q, '/root/hse-wip-lopa/banks/h3i_exam.json', expect_n=42)
finish()
