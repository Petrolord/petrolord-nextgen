import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Associate m05, The Low Estimate and Probability.
# Sources: the exceedance sentence of lib/conventions/percentile.js; the
# outcome labels by case; the engine's reason lines on the Ekene Main
# Reserves; deterministic and probabilistic methods; incremental and cumulative
# in words; reading a category table; the 17 CFR 210.4-10(a)(24) quotation.
# Every key rests on a digest line or an engine return re-run in
# /root/cat-wip-prms/scratch/bank-beginner/witness.mjs.

q(2, "Which sentence does the engine return with every categorize call, from the course's shared percentile convention?",
 "P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.",
 ["P90 means the value that 90% of outcomes fall below, per the ordinary percentile table.",
  "P90 means a 90% chance that the project reaches Reserves, per the chance of commerciality.",
  "P90 means the estimate is within 90% of the final quantity, per the reporting rules."],
 "The sentence comes from lib/conventions/percentile.js and is printed as a note under the tables of the categories view. It is an exceedance probability: the chance of meeting or exceeding the figure. Counting the outcomes that fall below is the ordinary percentile, which runs the other way. The chance of reaching Reserves is the chance of commerciality, a separate figure.")

q(0, "What does the label P50 beside a best estimate mean when the method is probabilistic?",
 "At least a 50 percent probability that the quantity recovered meets or exceeds the figure.",
 ["That the project has an even chance of being approved, whatever the quantity turns out to be.",
  "That half of the stated estimates were made by a probabilistic method and half by scenarios.",
  "Exactly 50 percent, no more and no less, since the best estimate is always the median of the range."],
 "Each outcome label is an exceedance probability with the words at least: P90 at least 90 percent, P50 at least 50 percent, P10 at least 10 percent. It says nothing about approval, which is the class and its chance. The words at least matter: the label is a floor for the probability, and the engine states it only when the method is probabilistic.")

q(3, "Which of the three Ekene Main Reserves figures carries the label P90?",
 "8.890000 MMbbl, the 1P.",
 ["24.990000 MMbbl, the 3P.",
  "16.650000 MMbbl, the 2P.",
  "7.760000 MMbbl, the Probable (P2)."],
 "P90 is always the low estimate: the smallest figure is the one most likely to be met or exceeded, so it carries the largest probability number. The engine prints P90 beside the 1P of 8.890000, P50 beside the 2P and P10 beside the 3P. A slice such as the Probable (P2) carries no probability label.")

q(1, "A newcomer reads P90 the way an ordinary statistics table does. Where do they put it, and what is wrong with that?",
 "At the top of the range, since ninety percent of outcomes lie below it; in this course P90 is the low estimate.",
 ["At the bottom of the range, which is right, since the ordinary 90th percentile and P90 agree.",
  "In the middle of the range, since a probability of 90 is close to a probability of 50 in a wide range.",
  "Outside the range, since an ordinary percentile needs more than three estimates to be read."],
 "The ordinary 90th percentile counts from the bottom, so ninety percent of outcomes fall below it and it is a large figure. Petroleum reporting counts exceedance from the top, so the P90 is the figure met or exceeded with at least 90 percent probability, the low estimate. The course fixes this reading once in lib/conventions/percentile.js.")

q(1, "Why does every category line the engine prints add the words \"when probabilistic\"?",
 "The engine cannot tell which method produced the figures, so it states the probability for the probabilistic case only.",
 ["The engine runs a Monte Carlo on every category set and prints the words when it has sampled it.",
  "The words mark figures the engine will refuse if the method control is set to deterministic.",
  "It is a legal disclaimer required by 17 CFR 210.4-10(a)(24) on every figure that reaches a report."],
 "The engine takes three estimates however they were made, so it states the probability conditionally. For a deterministic set, P90 is an outcome label for the low scenario. The engine's categorize function samples nothing, its method input is cumulative or incremental, and the words come from the engine's own convention, which no legal rule imposes.")

q(3, "How are the low, best and high estimates made by a deterministic method?",
 "As three scenarios, each worked out on its own set of inputs, with no distribution drawn.",
 ["As three points read off one distribution of outcomes, at the 90, 50 and 10 percent exceedance levels.",
  "As one scenario, with the low and high set at a fixed share of the best by the engine.",
  "As a distribution that the engine builds from the best estimate and the stated unit."],
 "A deterministic method picks a set of inputs for the low case, another for the best and another for the high, and works each out. Reading three points off a distribution is the probabilistic method. The engine builds no distribution and sets no estimate from another; every estimate is stated.")

q(2, "In a deterministic estimate, what does the label P90 on the low scenario mean in this course?",
 "It is the outcome label of the low case; the low scenario is chosen to carry a high degree of confidence.",
 ["A computed 90 percent probability, since the engine works it out from the spread of the three stated scenarios.",
  "Nothing at all: a deterministic set is refused unless it is relabelled low, middle and high.",
  "That nine in ten of the scenarios the engineer tried came out above the low estimate."],
 "For a deterministic set the engine does not claim a 90 percent chance. P90 stays attached as the outcome label of the low case, and the course reads the low scenario as one chosen to carry a high degree of confidence (PRMS 2.2.1.2 and 2.2.1.4, in the course's words). The engine computes no probability from scenarios and refuses no deterministic set.")

q(0, "How does 17 CFR 210.4-10(a)(24), from the eCFR version current at 2026-09-01, put the probability for proved reserves estimated by probabilistic methods?",
 "At least a 90% chance that the quantities recovered reach or exceed the estimate.",
 ["At least a 10% probability that the quantities recovered will exceed the estimate.",
  "Exactly 90% of the quantities in the ground, measured by a stated recovery factor.",
  "A 90% probability that the estimate lies within 10% of the final quantity recovered."],
 "The public text reads: \"If probabilistic methods are used, there should be at least a 90% probability that the quantities actually recovered will equal or exceed the estimate.\" (17 CFR 210.4-10(a)(24)). It states the exceedance idea in public words for US registrants. The 10 percent figure belongs to the high estimate. The rule sets no recovery factor and no closeness band.")

q(3, "Why would it be wrong to say that the Probable (P2) of 7.760000 MMbbl has a 50 percent probability?",
 "A slice is the gap between two estimates and has no exceedance probability of its own.",
 ["It would be right: the P2 slice carries the P50 label as the engine prints it in the table.",
  "The slice carries the P10 label, since it sits above the Proved slice.",
  "The Probable slice is a Contingent quantity, which carries a chance of development."],
 "Only the cumulative figures, the 1P, 2P and 3P, are estimates of the whole quantity and carry P90, P50 and P10. 7.760000 is what the 2P adds to the 1P, so no probability attaches to it. The increments table prints each slice with its label and value only. The Probable slice belongs to Reserves.")

q(1, "Someone clears the method of the Ekene Main Reserves case and runs the categories view. What happens?",
 "A refusal naming `method`: the method has no default, so a set with none stated is not read.",
 ["method must be \"cumulative\" for Prospective Resources (PRMS 2.2.2.4 defines no incremental terms for them); got nothing",
  "A result read as cumulative, since low, best and high keys are present in the box.",
  "estimates must be ordered low <= best <= high; got nothing"],
 "The engine's own words are: method must be one of \"cumulative\", \"incremental\"; got nothing. It does not infer the method from the keys present. The Prospective message applies to an incremental method stated for Prospective Resources, and the ordering message to estimates out of order.")

q(2, "A category set is stated with the cumulative method. Which figures are the learner's, and which does the engine derive?",
 "The 1P, 2P and 3P are stated; the engine derives the slices.",
 ["The slices are stated and the 1P, 2P and 3P derived.",
  "All six are stated; the engine checks that they add up and returns them unchanged.",
  "The engine derives all six from the stated best estimate, the unit and the stated class."],
 "With the cumulative method the low, best and high are stated and the engine works out Proved (P1), Probable (P2) and Possible (P3). With the incremental method it is the other way round. A mixed box is refused, and no estimate is derived from a single figure.")

q(0, "The engine's reason line prints the 1P of the Ekene Main Reserves as 8.89 MMbbl, and the table prints 8.890000. Which should a learner reason with?",
 "The table figure at six decimals; the reason line drops trailing zeros.",
 ["The reason line, since it is the engine's own working and the table is rounded.",
  "Either, since the reason line and the table come from two separate calls.",
  "Neither: recompute it by hand."],
 "Inside a reason the engine drops trailing zeros, so 8.890000 prints as 8.89. The table prints every quantity to six decimals, and that is the figure to reason and report with. Both come from the same call and agree; the table is the complete form.")

q(3, "A report shows a 1P beside a Probable (P2). What goes wrong if the 2P is added to the Probable (P2)?",
 "The Proved slice is counted once and the Probable slice twice.",
 ["Nothing: the two can be added.",
  "The Proved slice is counted twice and the Probable slice is left out of the total.",
  "The engine refuses the sum, since categorize adds cumulative figures to slices on request."],
 "The 2P already contains the Proved (P1) and the Probable (P2), so adding the Probable slice again counts it twice. Read each figure with its label and turn it into one form before adding or comparing. The categorize function adds nothing across forms on request; it returns both forms of one stated set.")

q(1, "Which four fields does each cumulative row the engine returns carry?",
 "The case, the label, the probability label and the value.",
 ["The class, the unit, the method and the value, one row for each estimate.",
  "The label, the value, the slice and the chance of commerciality of the project.",
  "The case, the value, the section and the date."],
 "Each cumulative row carries case, label, probability and value, for example low, 1P, P90, 8.890000. The class, the unit and the method are printed once as tiles. The slices sit in their own table, and the chance of commerciality belongs to the classification view. The engine records no estimate date.")

q(0, "A 2U of 30.000000 MMbbl is read from the categories table of the Prospective case. What does that table leave unsaid?",
 "How likely the project is to go ahead: that is the class and its chance of commerciality.",
 ["The unit of the figure, since the Prospective case states no unit.",
  "The probability label of the figure, since Prospective Resources carry no P50.",
  "Whether the figure is the best estimate, since a 2U can sit anywhere in the range."],
 "A category table answers the question about the estimate; the class and the chance of commerciality, in the classification view, answer the question about the project. The 2U of 30.000000 is the best estimate if the prospect succeeds. The case states its unit, MMbbl, and the 2U carries the P50 label like any best estimate.")

emit(Q, '/root/cat-wip-prms/banks/ec11b_m05.json', expect_n=15)
finish()
