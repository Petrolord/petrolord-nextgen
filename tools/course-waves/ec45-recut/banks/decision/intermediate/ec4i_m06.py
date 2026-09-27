import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, intermediate, module m06-the-professional-reading.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(3, "Working the EKPAN lottery at its stated prior of 0.350000, an analyst's Bayes arithmetic gives a survey value of 61.7143. What should they conclude before checking a single line?",
 "It is wrong: it exceeds the EVPI of 52.0000 written down at step two, and 61.7143 is the EVPI at the switch 0.228571.",
 ["It is plausible, because a good survey can be worth more than perfect information when the prior sits near the switch.",
  "It is right, since the EVPI peaks at 61.7143 and a survey that reads the rock well reaches that peak.",
  "It is the gross value, and taking the survey cost of 8.0000 off it brings the net value under the EVPI."],
 "The ceiling comes before Bayes so that any value above it, or below 0, is caught without a second calculation. 0 <= evii <= evpi holds for every derived survey.")

# ord 2
q(1, "Which line is the EKPAN lottery's value with the CSEM survey, before its cost?",
 "0.460000 x 207.7989 + 0.540000 x 9.2361 = 100.5750",
 ["0.350000 x 207.7989 + 0.650000 x 9.2361, weighting each signal's value by the prior of the outcome it points to",
  "0.460000 x 207.7989 + 0.540000 x -36.7361, keeping Drill after No bright spot because Drill is best at the prior",
  "0.460000 x 207.7989 + 0.540000 x 9.2361 less 8.0000, taking the survey cost out before the value is called gross"],
 "Weight by pSignal, never by the prior, and take the best action after each signal: Farm out at 9.2361 after No bright spot. EVII is 100.5750 less 75.7500 = 24.8250.")

# ord 3
q(2, "An analyst reads the CSEM survey's 0.850000 as the chance of success after a bright spot on the EKPAN lottery. What does that do?",
 "It values Drill after a bright spot at 298.2500 against the posterior's 207.7989, because a likelihood is read as a posterior.",
 ["Nothing to the value, since a likelihood and a posterior agree whenever the survey is more likely to be right than wrong about the rock.",
  "It lowers Drill after a bright spot, because 0.850000 ignores how often dry holes show one too and so understates the chance of success.",
  "It changes only the chance of a bright spot, 0.460000, and leaves the Drill value after one where Bayes put it."],
 "The posterior is 0.646739 because the 0.250000 of dry holes that show a bright spot still count; reading 0.850000 overvalues the drill.")

# ord 4
q(0, "The CSEM survey on the EKPAN lottery is quoted at exactly 24.8250. What does the information tree mark, and what does that mean?",
 "\"Acquire CSEM survey\", only because the two root branches tie at 75.7500 and the engine marks the branch listed first; it reports the tie, and the money is the same either way.",
 ["\"No further information\", because a net value of zero buys nothing and the engine prefers not to spend on information.",
  "\"Acquire CSEM survey\", but by floating-point residue, since the two branch values differ in their last binary digits.",
  "\"Acquire CSEM survey\" on merit, because 24.8250 is below the gross value and the net value at that price is 16.8250."],
 "The neutral price is the gross evii, 24.8250, where acquire is 100.5750 less 24.8250 = 75.7500. The engine reports the tie and marks the first branch; the drill against farm-out crossing at 0.228571 is a reported tie as well.")

# ord 5
q(2, "The VOI Analyzer values the CSEM survey on the EKPAN lottery at a gross 19.84, while the tier's own Bayes run gives 24.8250. Why?",
 "The Analyzer offers two actions, so after No bright spot it can only walk away, losing the farm-out's 9.2361 on the 0.540000 of readings that would use it.",
 ["The Analyzer rounds the typed posteriors, and the value of information is sensitive enough that rounding alone takes it from 24.8250 to 19.84.",
  "The Analyzer's figure is after the survey cost of 8.0000 and the tree's is before it, and the rest of the gap is two-decimal rounding.",
  "The Analyzer uses a smaller EVPI for the two-outcome lottery, and its value of information is scaled down to stay under it."],
 "With the full posteriors typed, emvPrior and EVPI still match at 75.75 and 52.00; only the value with information moves, from 100.5750 to 95.5875.")

# ord 6
q(3, "A report on the EKPAN lottery in the VOI Analyzer writes \"net VOI 11.84 of a possible 52.00\". What is wrong with the pairing?",
 "It sets a net value beside a gross ceiling; the fair pair is the gross 19.84 against 52.00, and 19.84 is on no card.",
 ["Nothing, since both numbers come from the Analyzer's cards on the same inputs and the same survey cost of 8.0000.",
  "The EVPI card should be reduced by the survey cost first, because the ceiling on a survey cannot include the price of it.",
  "The pairing should use 24.8250 against 52.0000, because the Analyzer's own cards on the EKPAN lottery cannot be compared at all."],
 "EVPI charges nothing for information, so it pairs with the gross value, 11.84 plus the cost of 8.0000. On the Analyzer the gross value appears only in the guidance sentence and the CSV.")

# ord 7
q(1, "Which single number does the EKPAN lottery's work on perfect information, on actions after each signal and on accuracy all lean on?",
 "The drill against farm-out switch, 80 / 350 = 0.228571.",
 ["The EVPI, 52.0000, which every survey value and every action choice after a signal is measured against.",
  "The prior, 0.350000, since every posterior is compared with it to decide whether the reading changes the action.",
  "The chance of a bright spot, 0.460000, which sets the weight on the drill branch in every step of the work."],
 "EVPI peaks there at 61.7143, each posterior's action depends on its side of it, and a symmetric survey is worth 0.0000 until a dry reading carries success under it, first at accuracy 0.645051.")

# ord 8
q(0, "A close-out note on the EKPAN lottery lists Drill at 75.7500, an EVPI of 52.0000, a CSEM survey worth 24.8250 gross, and a chance of 0.500000 that Drill loses money. Which entry does not belong to the lottery?",
 "The loss chance: on the lottery Drill loses 80.0000 with probability 0.650000, and 0.500000 belongs to the three-outcome EKPAN tree, whose drill branch is 105.0000.",
 ["The EVPI: 52.0000 is the EKPAN tree's figure, and the lottery's own EVPI is 61.7143 at its switch.",
  "The survey value: 24.8250 is the tree's figure, and the lottery's is the two-action 19.84.",
  "The drill value: 75.7500 is the lottery's value after the CSEM survey cost has been taken off, and the lottery's Drill before any survey is bought is worth 105.0000."],
 "The EKPAN lottery has two outcomes and no later decision: emvPrior 75.7500, evpi 52.0000, evii 24.8250, and Drill loses on the dry hole 0.650000 of the time. The EKPAN tree adds a Marginal find with a later decision; its drill branch of 105.0000 loses money with probability 0.500000. Name the model beside every EKPAN number.")

# ord 9
q(0, "On IRRI, both indicators are typed 20 / 80 percent into the Analyzer defaults. What does the Analyzer report?",
 "EMV without information 15.00 and EVPI 63.00, withholding the rest, because the typing implies success 0.200000 against the 0.300000 stated.",
 ["A gross value of information of -15.00 and a net value of -25.00 on its cards, showing that a survey read this way is worse than useless to the decision.",
  "A refusal, because two identical rows of chances are not a distribution and cannot be valued.",
  "A gross value of 0.00, since two identical indicators move nothing and so leave the value at zero."],
 "The rows sum to 100 so nothing is refused, but the implied chance sits far more than 0.005 from the stated one. The -15.00 is what the typed chances give with nothing checking them against the stated prior, and information derived by Bayes is never worth less than 0.")

# ord 10
q(2, "The EKPAN lottery's Drill action is chosen at 75.7500 against Farm out at 33.2500, although it loses 80.0000 with probability 0.650000. A manager wants the survey credited for sparing a dry hole. What does the tier's engine say?",
 "Nothing beyond the mean: the engine is risk neutral, so avoiding a loss counts only at its expectation, and a dry hole spared on a well drilled anyway adds no value.",
 ["It credits the survey with the 80.0000 loss avoided on each dry reading, weighted by how often dry readings arrive.",
  "It adds a risk premium to the farm-out after a dry reading, which is why the survey is worth 24.8250 on this lottery.",
  "It discounts the dry hole's loss more heavily than the success, which is how the survey's value reflects the downside."],
 "Every number in the tier is risk neutral and undiscounted: the rollback maximises the mean, so comfort is not money.")

# ord 11
q(1, "Working the EKPAN lottery by hand, an analyst's posteriors weighted by their signal chances do not return the prior of 0.350000. What does that show?",
 "A posterior divided by the wrong thing, so every value built on it is wrong before any action is chosen.",
 ["A survey informative enough to move the average belief away from the prior, which is what gives it a value above zero.",
  "Inputs that contradict each other, which the tree engine would withhold in the way the Analyzer does.",
  "Rounding to six decimals, which the engine allows for within its 1e-6 tolerance on each probability column it checks."],
 "The check is 0.460000 x 0.646739 + 0.540000 x 0.097222 = 0.350000; a survey moves belief up on one reading and down on the other, never on average.")

# ord 12
q(3, "An analyst takes the EKPAN lottery's survey cost of 8.0000 off inside each signal branch and again at the information tree's root. What net value do they report?",
 "8.8250, where the net value is 16.8250, because the weights sum to 1 and the inner charges add one more 8.0000.",
 ["16.8250, since a constant taken off every signal branch cannot change which action wins after either signal, and so cannot change the money either.",
  "12.8250, since the inner charge is weighted by the signal chances and only about half of it survives to reach the root.",
  "0.8250, because charging the survey on every branch of the tree is the same as quoting it at 24.0000."],
 "The acquire branch becomes 84.5750 instead of 92.5750 against 75.7500. The actions do not change, but the money does: subtract the cost once, after the Bayes value.")

# ord 13
q(2, "Why can the tree engine never withhold a value of information the way the VOI Analyzer does?",
 "It takes likelihoods and derives the posteriors itself, so its inputs cannot contradict the stated outcome chances.",
 ["It quietly rescales any posteriors that fail the check so that they return the stated prior before it values the survey on its own.",
  "It has a wider consistency tolerance than the Analyzer, so inputs that fail 0.005 there pass here.",
  "It does withhold, but its withheld values print as 0.0000 in the table rather than as a missing card."],
 "Contradictory inputs are only reachable when posteriors are typed by hand, which the Analyzer allows and the tree engine does not.")

# ord 14
q(0, "On the EKPAN lottery, EVPI is 52.0000 at the stated prior and 0.0000 on the dominantAction lottery. Where on the EKPAN lottery's prior sweep is it largest, and why there?",
 "At the switch 0.228571, 61.7143, because the prior decision is least settled there.",
 ["At the stated prior 0.350000, 52.0000, because that is where the survey is actually bought.",
  "At a prior of 0.500000, where success and a dry hole are equally likely and uncertainty is greatest.",
  "At a prior near 0.900000, where the Drill payoff dominates and knowing the rare dry hole saves most."],
 "The sweep reads 54.0000 at 0.200000, 61.7143 at 0.228571 and 60.0000 at 0.250000; at 0.500000 it is 40.0000. The value of knowing peaks where the choice turns.")

# ord 15
q(1, "The EKPAN lottery's symmetric survey at accuracy 1.000000 and the Bayes run on the published perfectSignal case both reproduce perfect information. What ties them to it?",
 "Each reading occurs under one outcome only, so the posteriors are 1.000000 and 0.000000 and evii equals evpi: 52.0000 on the EKPAN lottery, 35.0000 on the prospect.",
 ["Each reading arrives with chance 0.500000, so the survey splits the wells evenly and the value doubles to reach the EVPI.",
  "The survey's cost is zero in both runs, and evii equals evpi whenever information is free on any lottery.",
  "Both runs quote the likelihood as the posterior, which the engine permits only when a signal is perfect."],
 "The success reading arrives exactly as often as success, 0.350000 on the EKPAN lottery and 0.300000 on perfectSignal, whose evWithInfo is 78.0000, the prospect's evWithPerfect.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/intermediate/ec4i_m06.json", label="ec4i_m06", expect_n=15)
finish()
