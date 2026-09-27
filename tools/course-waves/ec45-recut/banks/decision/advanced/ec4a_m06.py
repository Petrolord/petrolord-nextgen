import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, advanced, module m06-the-expert-reading.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(3, "IRRI types both of the Analyzer's indicators as 20 / 80 percent against stated outcome chances of 30 / 70. What does an expert reading write down?",
 "EMV without information 15.00 and EVPI 63.00, with the value of information withheld because the inputs imply a success chance of 0.200000.",
 ["A value of information of -15.00, worked out by hand from the typed chances, since the Analyzer prints none.",
  "A value of information of 0.00, since a withheld value means the survey cannot change the decision and so is worth nothing.",
  "No numbers at all, because indicator chances that contradict the stated ones are refused before the Analyzer computes anything."],
 "15.00 and 63.00 need nothing but the stated chances, so they survive. The unguarded -15.00 falls under the zero floor Bayes guarantees, and a withheld value is never written as 0.00.")

# ord 2
q(1, "Weighted as typed with nothing checking them, published certainPosteriorsWithheld gives a gross voi of 245.00. What makes that number impossible on sight?",
 "It sits above the evpi card of 63.00, and no information can be worth more than perfect information.",
 ["It sits below the default study's genuine gross voi of 33.00, which any survey on those same payoffs must at least reach.",
  "It turns negative once the survey cost of 10.0000 is taken off, and a net value below zero cannot come out of Bayes.",
  "Its implied success chance of 1.000000 lies outside the range the Analyzer accepts, so the value rested on an out-of-range input."],
 "The inputs imply 1.000000 / 0.000000 against a stated 0.300000 / 0.700000, and the net value would be 235.00. The Analyzer reports 15.00 and 63.00 and withholds the rest.")

# ord 3
q(2, "The EKPAN lottery's survey is typed into the Analyzer with its posteriors rounded to 65 and 10 percent, which passes with a gross voi of 20.51. What happens when they are rounded to 65 and 8 percent?",
 "The value of information is withheld, because the implied success chance is 0.342200, a delta of -7.800000e-3, outside the 0.005 check.",
 ["It passes with a gross voi of 20.51 as well, because rounding a posterior to a whole percent never moves the implied prior by half a percent.",
  "It is refused, because posteriors rounded to whole percents no longer sum to 100 under each indicator and so are not chances.",
  "It passes with a gross voi of 19.84, because the Analyzer recovers full-precision posteriors from the indicator chances before valuing."],
 "At 65 and 10 the implied chance is 0.353000, within 0.005 of the stated 0.35; at 65 and 8 it is 0.342200 and the Analyzer withholds. 19.84 is the gross voi at full precision.")

# ord 4
q(0, "The first step of an expert case adds every set of typed percents. The EKPAN lottery typed with No bright spot at 64 percent fails it. What is the answer for that case?",
 "The refusal message, `Indicator chances sum to 110 percent, expected 100`, and the box at fault, since a refused case has no value.",
 ["EMV without information 75.75 and EVPI 52.00 with the value of information withheld, as for any typed inputs that fail a check.",
  "The values from the later steps with No bright spot corrected so that the pair sums to 100, since the message names the box that was mistyped.",
  "The gross voi the typed chances give with nothing checking them, since a refused case is valued by its unguarded arithmetic."],
 "The indicator chances sum to 110.000000 percent, so they are not a distribution. Withholding with 75.75 and 52.00 answers chances that sum correctly but contradict each other, and the message never says whether 64 or 46.000000 is the slip.")

# ord 5
q(2, "In the second step an expert rebuilds the EKPAN lottery's implied prior by hand from its survey. Which arithmetic is right?",
 "0.460000 x 0.646739 gives 0.297500, 0.540000 x 0.097222 gives 0.052500, and the sum 0.350000 is the stated prior.",
 ["0.850000 plus 0.150000 gives 1 down the Success column, so the stated prior of 0.350000 holds by construction.",
  "0.646739 and 0.097222 averaged equally over the two readings give the stated prior of 0.350000 to within the 0.005 check.",
  "0.297500 plus 0.162500 gives 0.460000, and that joint total is the implied prior the stated 0.350000 is compared against."],
 "The implied chance of an outcome is the sum over the indicators of each indicator's chance times the outcome's chance given it. 0.297500 plus 0.162500 is the chance of a bright spot, and the likelihood columns are a separate check.")

# ord 6
q(3, "An expert case lists a three-outcome lottery with Drill alone at 109.0000, Drill with partner at 54.5000, Farm out at 31.0000 and Relinquish at 0.0000. Why can Drill with partner never be the best action at any probability?",
 "It is exactly half of Drill alone everywhere: half of a positive value is smaller, and half of a negative one is still negative while Farm out never falls below 0.",
 ["It falls below Farm out once the Large chance drops under 0.200000, and above that chance Drill alone overtakes it, so no window is left.",
  "Its partner's share is charged as a cost after weighting, which pulls the value below Relinquish whenever the Dry chance exceeds 0.300000.",
  "It becomes best only at a Large chance of 0.500000, which the sweep never counts because the Dry chance would then be 0.000000."],
 "The sweep holding Medium at 0.5 has one switch, between Farm out and Drill alone; at a Large chance of 0.000000 Drill with partner is 2.5000 against Farm out at 15.0000. The third step still lists it, valued.")

# ord 7
q(1, "In the fourth step, perfect information on the EKPAN lottery needs the best action after a dry hole, where Farm out and Walk away both pay 0.0000. Does that tie change the EVPI?",
 "No: EVPI takes the best value per outcome, so 0.350000 x 365.0000 gives 127.7500 and, less 75.7500, the EVPI is 52.0000 whichever is named.",
 ["Yes: the tie goes to Farm out as the branch listed first, and its 95.0000 on a success lifts the expected value with perfect information.",
  "Yes: at a tie the engine averages the two tied actions, which halves the contribution of the dry hole to the value with perfect information.",
  "No, but only because Walk away is dropped from a lottery where the farm-out pays at least as much in every outcome, so no tie exists."],
 "Both tied actions pay 0.0000 on a dry hole, so 0.650000 x 0.0000 adds nothing whichever is named. A tie changes a label and never the value taken.")

# ord 8
q(0, "On the EKPAN lottery an expert values the survey at a cost of 8.0000. Which set of figures belongs in the report?",
 "Gross 24.8250, net 16.8250, a neutral price equal to the gross 24.8250, and bounds of 0 and 52.0000 on the gross.",
 ["Gross 24.8250, net 16.8250, and a neutral price of 52.0000, since information stays worth buying until its cost reaches the EVPI ceiling.",
  "Gross 16.8250 and net 8.8250, since the survey cost is taken off once inside the information tree and again when the net is reported.",
  "Gross 100.5750 and net 92.5750, since the value of information is the expected value with the survey before the prior is subtracted."],
 "EVII is 100.5750 less 75.7500. The information tree's two root branches tie at a survey cost of 24.8250, where the engine reports the tie and marks the acquisition, listed first.")

# ord 9
q(0, "A case asks what the EKPAN lottery's survey is worth with all three of its actions available, and a candidate writes the Analyzer's gross voi of 19.84. What went wrong?",
 "The right number for the wrong question: 19.84 is the two-action value, and with the farm-out available the survey is worth 24.8250.",
 ["Nothing, because the Analyzer is the published tool for this question and its 19.84 supersedes a hand calculation on the Bayes engine.",
  "A rounding slip, since 19.84 is the Bayes engine's 24.8250 after the posteriors are rounded to whole percents inside the Analyzer.",
  "The candidate quoted the net value, since 19.84 is what remains after the survey cost and the gross value sits in the guidance sentence."],
 "The Analyzer offers only the named decision and \"Do Not\"; the Bayes engine without the farm-out gives 19.8375. The Analyzer's netVoi card for the same survey reads 11.84 and its evpi card 52.00.")

# ord 10
q(2, "The onward lesson takes decision analysis on to capital portfolio decisions under one budget. Why is the best set of projects not simply the set of individually best ones?",
 "Because money spent on one project is unavailable to the next, so each is judged against what else the same budget buys.",
 ["Because each project's EMV has to be turned into a net value of information before projects on different prospects can be compared at all.",
  "Because a portfolio rolls every project back at the discount rate of its riskiest member, which lowers each value unevenly and so reorders them.",
  "Because an individually best project was valued with its own information already bought, and a portfolio has to strip every survey value out first."],
 "Capital portfolio decisions choose among many projects under one budget, and money spent on one is unavailable to the next, so the choice is of a set under that constraint. Decision Studio already sets capital allocation from a saved portfolio beside the decision analysis in one brief.")

# ord 11
q(3, "A Decision Studio brief for the EKPAN tree prints Optimal EMV 105.0000, Next best alternative 37.7500 and Decision advantage 67.2500, with the success payoff linked to a Monte Carlo summary. Read at the summary's P90 of 185.0000, the low case, what would change?",
 "The tree would fall to 37.7500 and the choice would flip to the farm-out, though the brief rightly uses the mean, the only statistic a linear rollback needs.",
 ["Nothing, because the brief re-reads the linked run at brief time and the run's mean has not moved since it was saved.",
  "The advantage would shrink by the gap between the mean and the P90, while Drill stayed the recommended first move.",
  "The tree would rise to 206.5000, because the P90 of a Monte Carlo summary is its high case under the exceedance convention."],
 "With success at 185.0000 the drill branch is worth 22.7500 against the farm-out's 37.7500. At the mean of 420 the brief's 105.0000 is identical to a plain payoff, and 206.5000 belongs to the P10, the high case.")

# ord 12
q(1, "OKRIKA appraises at 87.0000 against selling now at 48.0000. Without the option to sell after a poor appraisal, the appraisal branch would be worth 15.6000. What does the difference between 87.0000 and 15.6000 price?",
 "The later choice: the option to sell after a poor result is worth 71.4000 inside the appraisal branch.",
 ["The appraisal's information, since 71.4000 is what appraising adds over developing now at 33.6000.",
  "The decision advantage, since 71.4000 is how far the recommended first move leads the next best alternative in the brief.",
  "The first move itself, since 71.4000 is what the root would lose if Sell now at 48.0000 were struck from the tree."],
 "87.0000 less 15.6000 is 71.4000. Without the later choice the root would sell now at 48.0000, and with it the brief's Decision advantage for Appraise is 39.0000.")

# ord 13
q(2, "The story so far says thirds typed as 0.333 are refused while 0.3333333 rolls back to 60.0000. Where do thirds typed to six places, 0.333333, fall?",
 "Accepted just below 60.0000, because the engine weights the payoffs by 0.333333 each and reports the slightly smaller mean.",
 ["Accepted at 60.0000, because the message would print 0.999999, which is exactly 1e-6 short and inside a tolerance that includes its edge.",
  "Accepted at 60.0000, because the engine rescales an accepted sum to 1 before it weights the payoffs of the node.",
  "Refused, because in binary their sum misses 1 by a hair above 1e-6 and the chance node check makes no allowance for binary rounding."],
 "The sum test is |sum - 1| at most 1e-6 plus a 1e-12 allowance and includes its edge, so six places pass and are weighted as typed: 0.333333 x (30 + 60 + 90) = 59.9999. Five places and fewer are refused, and seven give 60.0000.")

# ord 14
q(0, "The half percent boundary on implied priors holds in the Analyzer's check. What holds it?",
 "A 1e-12 allowance on top of 0.005, which absorbs 0.0050000000000000044, the binary value of 0.305 less 0.3.",
 ["An inclusive comparison against 0.005 alone, which suffices because 0.305 less 0.3 is exactly 0.005 in binary floating point.",
  "A threshold widened to 6.000000e-3, which is why an implied chance of 0.306000 is the first case the Analyzer withholds.",
  "Rounding each implied chance to six decimals before the delta is taken, so that 0.305000 less 0.300000 comes out exact."],
 "The binary delta overshoots 0.005 by 4.3e-18; compared against 0.005 alone justInsideTolerance would read inconsistent. An implied 0.306000 is inconsistent with or without the allowance.")

# ord 15
q(2, "An expert writes one sentence reporting the EKPAN lottery's survey. Which sentence carries everything the reading asks for?",
 "Worth 24.8250 gross and 16.8250 net at a cost of 8.0000, against a ceiling of 52.0000, with drill, farm-out and walk away as the actions.",
 ["Worth 19.84 gross in the Analyzer and 11.84 net, which is its value because the Analyzer is the published tool for this very question.",
  "Worth 24.8250 gross and worth buying at any cost up to its ceiling of 52.0000, since the EVPI is the price that makes information neutral.",
  "Worth 16.8250 as the value of the survey, since the cost of 8.0000 is already inside the information tree and needs no separate mention."],
 "A value of information without its actions, its tree and its consistency is not a number: the same survey is 19.84 in the two-action Analyzer. The price that makes the survey neutral is the gross 24.8250, below the 52.0000 ceiling.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/advanced/ec4a_m06.json", label="ec4a_m06", expect_n=15)
finish()
