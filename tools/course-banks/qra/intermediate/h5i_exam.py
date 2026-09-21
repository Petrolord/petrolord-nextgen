import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 Professional final exam, 42 questions.
# Digest sections 15 to 24, with sections 1, 3 and 34 as the Professional tier
# owns them. Roughly in module proportion: potential loss of life, the fatal
# accident rate, the F-N curve, criterion lines, the published point and the
# boundary, and the societal picture with the Fd rules. Every N is a stated
# input, every F-N figure is self-consistency only, and no Fd number is keyed.

# ---- potential loss of life ----

q(2,
 "One JISIKE crew term in the PLL table reads 0.000600000000 fatalities per year. Which scenario is it?",
 "The process fire, at 5e-4 per year with an expected 1.2 deaths",
 ["The module explosion, at 4e-5 per year with an expected 8 deaths",
  "The fall from height, at 3e-3 per year with an expected 0.5 deaths",
  "The spill with no one near, at 6e-3 per year with no deaths expected"],
 "Multiplying 5e-4 by 1.2 gives the 0.000600000000 the table prints for the process fire. The module explosion's product is 0.000320000000, which is smaller despite its 8 deaths because its frequency is low. The fall from height gives 0.001500000000, the largest term. The spill gives 0.000000000000, since nobody is near it.")

q(0,
 "An analyst adds up the four JISIKE crew frequencies and forgets the deaths. What figure comes out?",
 "0.009540000000",
 ["0.006421666667","0.002420000000","0.000685000000"],
 "Summing 5e-4, 4e-5, 3e-3 and 6e-3 with N ignored gives 0.009540000000, which the course shows as a wrong build: it counts a spill that kills nobody as heavily as a fall. 0.006421666667 is a different wrong build, f over N. 0.002420000000 is the engine's f times N. 0.000685000000 is the golden fractional-and-zero-N case.")

q(3,
 "Which of these scenarios would potentialLossOfLife accept as typed?",
 "One with an expected 0.5 deaths, since an expected number need not be whole",
 ["One with minus 0.5 deaths, read as half a death averted by a measure",
  "Only one whose deaths are a whole count, since people can die only in whole numbers",
  "Any at all, since the engine sums whatever deaths it is given unchecked"],
 "The allowed range for N is 0 or more, and the model string says an expected number need not be whole, which is why the fall from height carries 0.5. A negative N is refused in the engine's own words, whatever it is meant to represent. Whole counts are not required. The engine does check N, which is how a negative one gets refused.")

q(1,
 "Besides the PLL itself, what does potentialLossOfLife hand back?",
 "Each scenario's own contribution, its f times N",
 ["The F-N points and the frequency of no deaths",
  "The FAR per 100,000,000 exposed hours of the crew",
  "The LSIR at each place the scenarios reach"],
 "The function table says potentialLossOfLife returns the PLL and each scenario contribution, which is how the JISIKE table shows 0.000600000000 for the process fire. The F-N points and the zero-death frequency come from fnCurve. The FAR needs exposed hours and a separate call. An LSIR needs probabilities of death at a place, which this call never takes.")

q(2,
 "The engine invents no number. Which default does it therefore apply when a PLL scenario leaves something out?",
 "None: every frequency and every N is an input with no default",
 ["An N of one death for any scenario typed with no fatalities",
  "A frequency of 1e-4 per year for any scenario typed without one",
  "Exposed hours of 8760 for each person when none are given"],
 "The course reads from the engine's header that it invents no number: every scenario frequency, probability of death, occupancy and the rest is an input. An assumed N, an assumed frequency or an assumed year of exposure would each be a number the engine made up, and it makes none. Exposed hours belong to the FAR call anyway.")

q(0,
 "What is the expected fatalities figure of 0.000336000000 per year for the JISIKE off-site scenarios, in PLL terms?",
 "Its PLL: the same sum of frequency times deaths, taken beyond the fence",
 ["A frequency: how often an event beyond the fence kills 3 or more people at once",
  "A probability: the chance that someone beyond the fence dies this year",
  "A rate: deaths per 100,000,000 hours spent beyond the fence by the whole town"],
 "The expected fatalities per year the F-N call returns is the sum of f times N, and the course says that for the off-site set it is also the off-site PLL. The frequency of 3 or more deaths is F(3), 0.000049700000. PLL is never a probability. A rate per 100,000,000 hours is a FAR, which would need exposed hours this set does not state.")

# ---- the fatal accident rate ----

q(1,
 "The JISIKE crew FAR is 2.016667 per 100,000,000 exposed hours. What does that figure say in words?",
 "About 2.016667 crew deaths are expected for every 100,000,000 hours the crew is exposed",
 ["About 2.016667 people on the crew are expected to die in each and every year of operation",
  "Each person on the crew carries a 2.016667 chance of death per 100,000,000 years",
  "About 2.016667 crew deaths are expected for every 100,000,000 hours worked by one person alone"],
 "FAR is fatalities per 100,000,000 exposed hours, built from the PLL over the crew's 120000 hours a year, so it counts expected deaths per exposed hours of the group. Deaths per year is the PLL, 0.002420000000. A chance per years is a muddle of a rate and a probability. The hours are the whole crew's, and one person's hours give the inflated 121.000000.")

q(3,
 "A colleague asks for the FAR of the JISIKE off-site set, whose expected fatalities are 0.000336000000 per year. What is missing?",
 "The exposed hours of the people beyond the fence, which the set does not state",
 ["Nothing, since the engine takes 8760 hours for each person in the town by default",
  "A whole number of deaths, since a FAR cannot be built on a fractional PLL figure",
  "A criterion line, since a FAR is read off the F-N curve where it meets the line"],
 "fatalAccidentRateFromPll needs pllPerYr and exposedHoursPerYr, and the engine invents no number, so an off-site FAR waits on the hours someone states for that population. No default of 8760 hours exists; with no hours the call is refused because a rate over no exposure is undefined. A PLL need not be whole. A criterion line belongs to the F-N comparison and plays no part in a FAR.")

q(2,
 "The JISIKE crew PLL stays the same while the crew's exposed hours double. What happens to the FAR?",
 "It halves, since the exposed hours divide the PLL",
 ["It doubles, since more hours bring more exposure",
  "It is unchanged, since the PLL did not move at all",
  "It falls by a hundred, the ratio of the two bases"],
 "The model string is FAR = PLL x 100,000,000 / exposed hours per year, so doubling the hours with the PLL fixed halves the rate. More hours would raise the PLL only if the scenarios changed, and here they do not. The FAR depends on the hours as well as the PLL. The base is fixed and plays no part in a change of hours.")

q(0,
 "Which call returns the JISIKE crew FAR?",
 "fatalAccidentRateFromPll with pllPerYr 0.002420000000 and exposedHoursPerYr 120000",
 ["fatalAccidentRateFromPll with pllPerYr 0.002420000000 and exposedHoursPerYr 2000",
  "fatalAccidentRateFromPll with pllPerYr 0.002420000000 and exposedHoursPerYr 8760",
  "potentialLossOfLife with the four crew scenarios and an exposedHoursPerYr of 120000 added"],
 "The FAR function takes a PLL and the exposed hours of the group, 60 people at 2000 hours each, 120000. Passing 2000 divides by one person and returns 121.000000. 8760 is one person's whole year, which is no one's exposure here. potentialLossOfLife takes no hours, so the FAR needs its own call on the PLL it returns.")

q(3,
 "The JISIKE spill with no one near is part of the crew set. What does it do to the crew FAR?",
 "Nothing, since it adds zero to the PLL the FAR is built on",
 ["It lowers the FAR, since it adds exposure with no death in it",
  "It raises the FAR, since its frequency is the largest of all",
  "It makes the FAR undefined, since one scenario has no deaths"],
 "The spill's N of 0 gives a contribution of 0.000000000000 to the PLL, and the FAR is the PLL over the exposed hours, which are stated for the crew and do not come from scenarios. So the spill moves the FAR by nothing. Its frequency counts only through N. A zero contribution is ordinary arithmetic, and the one FAR refusal is for no exposed hours.")

q(1,
 "Beside the FAR itself, what does the engine's FAR result carry?",
 "A basis naming its model string and the safety statistics source of its base",
 ["A band that says whether the FAR sits above or below the industry average for the sector",
  "The PLL split by scenario, so that the FAR can be traced back to each event in turn",
  "A probability of death per exposed hour for one person on the crew"],
 "Every result carries a basis block, and for the FAR it quotes \"FAR = PLL x 100,000,000 / exposed hours per year\" and the source RATE_BASES.FAR_100M of the safety statistics engine. The engine bands no FAR against anything. The scenario split is returned by the PLL call. A FAR is a rate over the group's hours and no probability.")

# ---- the F-N curve ----

q(2,
 "Between the flash fire's 12 deaths and the explosion's 40, say at 12.5, what does the step read?",
 "0.000001700000 per year, equal to F(40)",
 ["0.000009700000 per year, equal to F(12)",
  "0.000000000000 per year, since no N is 12.5",
  "0.000008000000 per year, the flash fire alone"],
 "The course reads the step: F(12.5) = F(40) = 0.000001700000 per year, because the next scenarios with 12.5 or more deaths are the explosion at 40 and the toxic cloud at 300. F(12) includes the flash fire, which kills 12, fewer than 12.5. A curve of N or more is not zero between corners. The flash fire alone is the exactly N reading at 12.")

q(0,
 "Under the introduction's strict wording, what frequency would 300 deaths carry for the off-site set?",
 "0.000000000000 per year, since no scenario kills more than 300",
 ["0.000000200000 per year, the toxic cloud sitting at exactly 300 deaths",
  "0.000001700000 per year, the value at the corner before",
  "0.000000011111 per year, the Dutch line at that corner"],
 "The course's comparison prints 0.000000000000 for \"more than N\" at 300, because the only scenario there has exactly 300 deaths and the strict reading drops it. The engine's N or more reading keeps it at 0.000000200000. 0.000001700000 is F(40). 0.000000011111 is the criterion at 300, the other side of a comparison.")

q(1,
 "At the JISIKE corner N = 3, what do the scenarios with exactly 3 deaths contribute on their own?",
 "0.000040000000",
 ["0.000049700000","0.000009700000","0.000010000000"],
 "The two jet fires at the fence, 3e-5 and 1e-5 per year, have exactly 3 deaths each and sum to 0.000040000000, the course's exactly N column at that corner. 0.000049700000 is F(3), which adds every scenario with more deaths too. 0.000009700000 is what \"more than 3\" leaves. 0.000010000000 is the second jet fire alone, which leaves out its twin.")

q(3,
 "What frequency sits at the last corner of the JISIKE off-site curve?",
 "0.000000200000",
 ["0.000001500000","0.000001700000","0.000000000000"],
 "Three hundred deaths are reached by one scenario, the cloud over the town at 2e-7 per year, which the engine writes as 0.000000200000. The explosion on its own, 0.000001500000, has only 40 deaths. Adding the two gives the corner at 40, 0.000001700000. A zero here would mean dropping the only scenario on the corner.")

q(2,
 "How many corners does the JISIKE off-site curve have, and where?",
 "Four: 3, 12, 40 and 300 deaths",
 ["Six: one for each off-site scenario",
  "Five: 0, 3, 12, 40 and 300 deaths",
  "Three: 12, 40 and 300 deaths only"],
 "Corners sit at each distinct N above zero: the two jet fires share 3, then 12, 40 and 300. Six would count the two jet fires separately and the release that reaches no one. N = 0 is kept out of the curve and its frequency is reported apart. Three corners is the count the Dutch line checks, since 3 is below its range, which is a fact about the comparison.")

q(0,
 "Between two consecutive corners, which corner's value does the left-continuous step take?",
 "The corner to its right, the next larger N",
 ["The corner to its left, the smaller N of the pair",
  "The average of the two corner values around it",
  "Zero, since no scenario sits between"],
 "The model string calls the curve a left-continuous step function, and the course reads F(5) as F(12) and F(12.5) as F(40): between corners F takes the value at the next corner up, because every scenario with at least that many deaths lies at or beyond it. The left corner's value includes scenarios with too few deaths. Nothing averages, and an N or more curve is never zero merely because no scenario sits at that N.")

q(3,
 "Why does the area identity count as a check on the F-N curve?",
 "Two separate routes, the area under the steps and the sum of f times N, must land on the same 0.000336000000",
 ["The area is printed in the Purple Book, so matching it reproduces a published worked example of the whole curve",
  "The area equals the Dutch line's value at N = 10, so the curve is fixed to the criterion at that point",
  "The area is the frequency of no deaths, so it confirms that the release reaching no one was left out"],
 "The course sums the area step by step as F at each corner times the width of its step, derived, and gets 0.000336000000, equal to the expected fatalities computed directly; two routes agreeing is a self-consistency check. No published worked F-N example exists. The line at N = 10 is a criterion value unrelated to the area. The frequency of no deaths is 0.000050000000, a different number.")

# ---- criterion lines ----

q(1,
 "Evaluate 1e-3 over N squared at 40 deaths. What frequency results?",
 "0.000000625000",
 ["0.000001700000","0.000006944444","0.000000011111"],
 "The line is 1e-3 over 40 squared, printed as 0.000000625000 per year. 0.000001700000 is the curve's F(40), the numerator of the ratio there. 0.000006944444 is the line at N = 12, and 0.000000011111 is the line at N = 300.")

q(0,
 "At the largest JISIKE corner, 300 deaths, how high does the criterion stand?",
 "0.000000011111",
 ["0.000000200000","0.000000625000","0.000006944444"],
 "At 300 deaths the Dutch constants allow only 0.000000011111 per year. The curve itself stands at 0.000000200000 there, eighteen times higher, which gives the worst ratio of 18.000000. The two other options are the criterion at 40 deaths and at 12 deaths, earlier corners where the allowance is far looser.")

q(2,
 "The explosion and the town cloud hold the curve up at 40 deaths. How many times the Dutch criterion is that?",
 "2.720000",
 ["1.396800","18.000000","2.000000"],
 "Two scenarios reach 40 deaths, and their combined 0.000001700000 set over the allowance of 0.000000625000 comes to 2.720000. The flash fire corner stands lower at 1.396800, while the town cloud corner stands highest at 18.000000. 2.000000 belongs to a variant whose line stops at 100, where the engine takes its own check.")

q(3,
 "What did Bevi article 13 ask to be done with the three points it printed?",
 "Compare the group risk with them, calling them an orientation value",
 ["Treat them as hard limits, with a permit refused above any one of them",
  "Use them only for the public, with the workforce under R2P2",
  "Join them with a slope of minus one to make a societal line of their own"],
 "The course says Bevi article 13 asks for the group risk to be COMPARED with the same three points, calling them an orientation value, while the Purple Book caption calls the line a recommended limit for establishments. The course says nothing of permits or a workforce split. The three points lie on a line of slope minus two, alpha 2, and the slope minus one line belongs to the R2P2 discussion.")

q(1,
 "How does the Purple Book Figure 6.8 caption describe the Dutch line?",
 "As a recommended limit for establishments",
 ["As the one legal limit that replaced Bevi",
  "As a point for accidents of fifty or more",
  "As a line the analyst must derive per plant"],
 "The course says the Figure 6.8 caption prints the line as a recommended limit for establishments. The engine did not read Bevi's successor, and the caption predates the repeal by decades. Fifty or more is the R2P2 point. The constants are fixed by the source, so no one derives them per plant.")

q(0,
 "Two criterion lines share C. What does a larger alpha do to the line?",
 "It falls faster with N, so larger events must be rarer",
 ["It rises with N, so larger events are allowed more often",
  "It shifts the whole line up by a factor of C at every N",
  "It leaves the line where it is and only moves its start"],
 "The line is F = C / N^alpha, so a larger alpha makes the allowed frequency fall faster as N grows; the course says 1 is called risk neutral and 2 risk averse. No positive alpha makes the line rise. C scales the line, and alpha shapes it. The start of the line is a separate smallest N, set by its own input.")

q(3,
 "With the Dutch constants capped at N = 100, what ratio does the corner at N = 12 still report?",
 "1.396800, unchanged, since the cap moves only the top of the range",
 ["2.000000, since every check is taken again at N = 100 itself",
  "0.000000, since a capped line skips corners below its top end",
  "18.000000, since the worst ratio is carried down to each corner"],
 "The course shows the capped comparison as N 12.000000 ratio 1.396800, N 40.000000 ratio 2.720000 and N 100.000000 ratio 2.000000, so the corners inside the range are checked as before. Only the out-of-range corner at 300 is replaced by a check at 100. No corner is skipped, and each corner keeps its own ratio.")

q(2,
 "Why is the worst ratio no longer at the top corner when the Dutch line is capped at N = 100?",
 "The corner at 300 is out of range, and F at 100 gives only 2.000000, below the 2.720000 at 40",
 ["The cap halves every ratio above N = 40, which leaves the corner at 40 the largest of those checked",
  "The corner at 12 grows once the cap is set, overtaking every other corner in the checked range",
  "The engine reports the first exceeding corner as the worst once any upper end is typed in"],
 "With the cap the engine evaluates F at N = 100, 0.000000200000 against a line of 1e-7, a ratio of 2.000000, and the corner at 40 keeps 2.720000, the largest. The corner at 300 with its ratio of 18.000000 is outside the range. The cap changes no ratio inside the range, and the first exceeding corner, at 12, has the smallest ratio of the three.")

q(1,
 "Which function returns a state against a criterion, the checks at every corner and the worst ratio?",
 "fnCriterionComparison",
 ["fnCurve","potentialLossOfLife","lsirTransect"],
 "The function table lists fnCriterionComparison as taking scenarios and a criterion and returning the state, the checks at every corner and the worst ratio. fnCurve returns the points, the expected fatalities and the zero-death frequency, with no criterion. potentialLossOfLife returns a PLL. lsirTransect returns individual risk along a line of distances.")

# ---- the published point and the boundary ----

q(0,
 "How does R2P2 paragraph 136 word its one societal point?",
 "An accident killing 50 or more in one event is intolerable if more frequent than one in five thousand a year",
 ["An accident killing 50 or more in one event is acceptable if it is less frequent than one in ten thousand a year",
  "Any accident killing more than 50 people is intolerable at every frequency, with no point to compare it against",
  "An accident killing 50 or more is intolerable if more frequent than 1e-3 over the square of its N"],
 "The course says an accident killing 50 or more people in one event should be regarded as intolerable if its frequency is more than one in five thousand a year, which the preset holds as N = 50 at 0.000200000000. R2P2 prints no acceptability point at one in ten thousand. A point with no frequency would not be a point. 1e-3 over N squared is the Dutch line.")

q(3,
 "Against the analyst's line of C = 0.01 and alpha = 1, why is the JISIKE corner at N = 3 checked at all?",
 "The line runs from N = 1 by default, so a corner at 3 lies inside its range",
 ["The engine checks every corner against every line, whatever range is given",
  "A line of slope minus one is taken to run from N = 3 upward by convention",
  "The corner at 3 carries two scenarios, and shared corners are always checked"],
 "The course says an analyst's line runs from N = 1 by default, so the corner at 3 is inside it, and it is where the worst ratio of 0.014910 sits. Against the Dutch line, which runs from 10, the same corner is left out, so ranges do matter. No convention starts a line at 3. A shared corner is checked or skipped by its N like any other.")

q(1,
 "For the golden case r2p2-touch, what ratio does the engine compute at N = 50 before the snap places the corner?",
 "0.9999999999999999",
 ["1.000000000000","0.001000","1.0000001"],
 "F(50) is 1.5e-4 + 5e-5, which is 0.00019999999999999998 in double, against a point of 0.000200000000, a ratio of 0.9999999999999999. The snap then counts it as on the point and the state is TOUCHES. A ratio of exactly 1 is the paper value, which double arithmetic does not reach here. 0.001000 is the JISIKE curve against the point. 1.0000001 is a sum from an event tree the engine refuses.")

q(2,
 "A curve TOUCHES the Dutch line. Has it exceeded the line?",
 "No: it has no corner strictly above and at least one on the line within the snap",
 ["Yes: a corner on the line is treated as above it, so touching is a mild exceedance",
  "Yes, when the touching corner is at the line's smallest N, where the line is highest",
  "It depends on the analyst, since the engine leaves a touching curve to be judged"],
 "The course defines TOUCHES as no corner above and at least one on the line within the snap, and EXCEEDS as at least one corner strictly above, so a touching curve has not exceeded. The position of the touching corner makes no difference. The engine returns a definite state word for every comparison and leaves nothing undecided.")

q(0,
 "What problem is the 1e-9 relative snap there to solve?",
 "Double arithmetic can land a hair off a value that is exact on paper",
 ["The published lines are printed to three figures and need widening",
  "Frequencies below 1e-9 per year are too small to be meaningful",
  "An analyst's own line is never exact, so every line is blurred"],
 "The golden r2p2-touch sums to 0.00019999999999999998 in double though it is exactly on the point on paper, and without the snap a plain comparison would call it BELOW. The snap is 1e-9 relative, a guard against arithmetic, and has nothing to do with how a source prints its figures. A frequency is not ignored for being small. Every line, preset or supplied, gets the same snap.")

q(3,
 "Which presets does fnCriterionComparison know by name?",
 "vrom-establishments and r2p2-para-136",
 ["vrom-establishments, r2p2-para-136 and r2p2-line",
  "r2p2-workers and r2p2-public, one for each group",
  "vrom-establishments alone, with R2P2 given by hand"],
 "The refusal for an unknown preset lists exactly two names: one of vrom-establishments, r2p2-para-136, or a line or points the caller gives. r2p2-line is the name the refusal table shows being refused. r2p2-workers and r2p2-public are presets of a different function. The R2P2 point is a preset, so no one has to type it by hand.")

q(1,
 "Which two refusals of fnCriterionComparison name the same field, criterion?",
 "Unknown presets such as 'r2p2-line' and inherited names such as 'valueOf'",
 ["A line with no slope, and a line whose smallest N is above its own largest N",
  "An unknown preset, and a scenario that has no name of its own at all in the list",
  "An inherited name, and a curve whose corners all lie below the line"],
 "The refusal table shows both 'r2p2-line' and 'valueOf' refused with field criterion and the message beginning criterion: unknown preset, since a name is looked up only among the presets the engine defines. A line with no slope names criterion.exponentAlpha. A nameless scenario is refused by fnCurve on scenarios[0].name. A curve below the line is a result, BELOW, and no refusal.")

q(2,
 "When the engine refuses an input, what number does the refusal carry?",
 "None of its own: it names the offending field and gives a message",
 ["The value that was passed, rounded to twelve decimals for the record",
  "The nearest value the engine would have accepted for that same field",
  "A result computed with a default in place of the refused input value"],
 "The course says a refusal carries no number of its own, and every function returns either a result with a basis or an object with error and field. The engine suggests no nearest value and computes nothing with a default, since it invents no number. Any number inside a quoted message, such as the 0 in \"must be above 0\", is part of the engine's words.")

# ---- the societal picture and the Fd rules ----

q(3,
 "Under the Purple Book explosion rules, what happens in a cell at 40000 Pa gauge?",
 "Everyone dies, indoors and outdoors, since it is above 30000 Pa",
 ["Only a fraction of those indoors die, and no one outdoors",
  "No one dies, since the value is below the lower 10000 Pa gauge threshold",
  "Only those outdoors die, since buildings shield those inside"],
 "Figure 5.5 as the engine applies it: above 30000 Pa gauge everyone dies, above 10000 Pa only a fraction of those indoors, and at or below 10000 Pa no one. At 40000 Pa the top rule holds. The partial indoor rule stops at 30000 Pa. 40000 Pa is far above 10000 Pa. The explosion rules never spare the indoors over the outdoors at the top.")

q(0,
 "A stated peak of exactly 10000 Pa gauge reaches a populated cell. How many there die under the Purple Book rule?",
 "No one dies, since 10000 Pa is at or below the lower threshold",
 ["A fraction of those indoors die, since the threshold is reached",
  "Everyone outdoors dies, since the indoors rule starts only above it",
  "Everyone dies, since any value on a printed edge takes the upper rule"],
 "The course's rows show zero at 5000 and at 10000 Pa gauge, and says a value at a threshold falls in the lower rule. Only above 10000 Pa do some of those indoors die. No rule kills those outdoors below 30000 Pa. An edge value always takes the rule below it, which is the same convention as exactly 30000 Pa.")

q(2,
 "From which Purple Book table do the day and night fractions of people indoors come?",
 "Table 5.3",
 ["Table 4.5","Table 4.7","Figure 6.8"],
 "The course cites Table 5.3 for the fractions of the population indoors by period, and the refusal for an unknown period names it too. Table 4.5 is the direct ignition probability table and Table 4.7 classifies reactivity, both Associate lookups. Figure 6.8 is the Dutch line.")

q(1,
 "For the same stated toxic PE, why does the night case give a smaller Fd than the day case?",
 "More people are indoors at night, where the rule gives a smaller fraction dying",
 ["The engine lowers PE itself at night, since fewer people are awake and outside then",
  "Night is refused unless a fraction indoors is given, and that fraction sets Fd lower",
  "The toxic rule applies only to people outdoors, who are fewer by night"],
 "The course's toxic rows share PE 0.4 and FE,in 0.040000, and only the fraction indoors changes, 0.93 by day and 0.99 by night, so more weight falls on the smaller indoor fraction. PE is a stated input from the consequence course, and the engine never alters it. A period of night is accepted as it stands. The rule counts deaths indoors as well as outdoors. These figures teach the rule and are graded nowhere.")

q(3,
 "What must pbFatalityFractions be given for a toxic cloud?",
 "A stated probability of death, and either a period or a fraction of people indoors",
 ["A concentration and an exposure time, from which it builds the probability itself",
  "The number of people in the cell, since it returns the expected deaths directly",
  "Both a period and a fraction of people indoors, so that the two can be checked"],
 "The function table lists the effect and its input, and a period or a fraction indoors; for a toxic cloud the input is the probability of death, which is a stated input from the consequence course, and the engine refuses a toxic call without it. A concentration and an exposure time are consequence modelling, which belongs to the consequence course. The call returns fractions, and the expected deaths in a cell are Fd times its people. A period and a fraction together are refused.")

q(0,
 "In the JISIKE off-site results, which figure is a frequency of events and which an expected number of deaths?",
 "F(3), 0.000049700000, is a frequency; 0.000336000000 is expected deaths per year",
 ["F(3), 0.000049700000, is expected deaths; 0.000336000000 is a frequency of events",
  "Both are frequencies of events, one counted from N = 3 and one counted from N = 0",
  "Both are expected deaths per year, the first taken at one corner and the second overall"],
 "F(3) is the frequency per year of events with 3 or more deaths, a corner of the curve. 0.000336000000 is the sum of f times N, expected fatalities per year, equal to the area under the curve. Swapping them, or calling both by one name, loses the distinction the Professional tier rests on: the curve says how often, and the sum says how many on average.")

emit(Q, '/root/hse-wip-qra/banks/h5i_exam.json', expect_n=42)
finish()
