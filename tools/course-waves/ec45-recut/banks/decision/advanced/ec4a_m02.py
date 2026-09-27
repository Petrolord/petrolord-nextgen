import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, advanced, module m02-bigger-lotteries.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(2, "On the published three outcome, four action lottery, Drill alone is rolled back by weighting 500.0000, 150.0000 and -20.0000 and subtracting its 60.0000 cost once, giving 109.0000. Why is that right here and wrong on the published chanceRootWithBranchCosts tree?",
 "Here the cost belongs to the action and is paid in every outcome; there each branch carries its own cost, paid only on that branch.",
 ["Here the payoffs are already discounted, while that tree's branch costs fall later and must be discounted before they are charged.",
  "Here there is no chance node, while a chance node always charges its costs after weighting, which the tree then fails to do.",
  "It is right on both, and the -3.0000 printed for that tree is the engine charging each cost twice, once on the branch and once at the root."],
 "On chanceRootWithBranchCosts calm is worth 19.0000 less 2.0000 and storm -25.0000 less 8.0000 before weighting, giving -3.0000; subtracting both costs after weighting gives a wrong -8.6000.")

# ord 2
q(0, "With the outcome known first, the published golden records the best actions for Large, Medium and Dry on the three outcome lottery as indices 0, 0 and 2. Why does Dry record Farm out?",
 "Farm out and Relinquish both pay 0.0000 in Dry and tie, and the golden records the first listed of the tied pair.",
 ["Farm out breaks the tie by its better payoffs in Large and Medium, which the engine consults when two actions pay the same in one outcome.",
  "Relinquish is left out of perfect information because it pays nothing in any outcome, so Farm out is the only costless action there.",
  "Farm out is what the engine recommends at the prior once a well is dry, and perfect information repeats it."],
 "Listed the other way round the golden would name Relinquish and evWithPerfect would stay at 133.0000, since EVPI takes the best value per outcome.")

# ord 3
q(3, "The three outcome lottery has emvPrior 109.0000, evWithPerfect 133.0000 and an EVPI of 24.0000. Where does that 24.0000 come from?",
 "Only Dry changes the action, from Drill alone to Farm out, so perfect information saves Drill alone's net loss in the 0.300000 of dry cases.",
 ["Every outcome gains, since knowing Large in advance lets the engine size the well, and those gains add up across all three outcomes.",
  "Medium changes the action to Drill with partner, whose halved loss is worth 24.0000 once the outcome is known before the choice.",
  "It is Drill alone's value less Drill with partner's, 109.0000 less 54.5000, scaled down by the chance that the well comes up dry."],
 "In Dry Drill alone pays -20.0000 less its 60.0000 cost where Farm out pays 0.0000; that saving weighted by 0.300000 is 24.0000, and Large and Medium still choose Drill alone.")

# ord 4
q(1, "A reader wants to value a survey on the three outcome, four action lottery in the VOI Analyzer. What does the Analyzer's form do to the lottery?",
 "It keeps the named decision at its cost and Do Not paying 0, so Farm out and Drill with partner are lost on the way in.",
 ["It refuses the lottery with a message naming the number of actions, since the form accepts exactly two and this lottery has four.",
  "It keeps all four actions and values the survey against Drill alone, the best action at the prior at 109.0000.",
  "It merges Drill with partner into Drill alone, since one is a half scale copy of the other, and keeps Farm out beside them."],
 "The Analyzer offers exactly two actions. On the EKPAN lottery a missing farm-out cut the survey's gross value from 24.8250 to 19.8375, and the Analyzer's 19.84 is that two action number.")

# ord 5
q(1, "On the published threeByThree survey, Bright has likelihoods 0.700000, 0.300000 and 0.100000 given Large, Medium and Dry, at priors 0.200000, 0.500000 and 0.300000. What is the posterior chance of Large after Bright?",
 "0.437500, the joint 0.200000 x 0.700000 divided by the chance of Bright, 0.320000.",
 ["0.700000, since the chance of Bright given Large is the chance of Large once Bright has been seen.",
  "0.320000, the chance of Bright itself, which Bayes assigns to the outcome that the reading favours most.",
  "0.200000, since a reading cannot move a prior stated before the survey was run, only the action taken after it."],
 "The chance of Bright is 0.200000 x 0.700000 + 0.500000 x 0.300000 + 0.300000 x 0.100000 = 0.320000; reading the likelihood 0.700000 as the posterior is the likelihood for posterior mistake.")

# ord 6
q(3, "On threeByThree the Bright row of likelihoods, 0.700000, 0.300000 and 0.100000, does not sum to 1. A reviewer rescales that row before running the engine. What is the result?",
 "The row never needed fixing: rows are not distributions, and rescaling it breaks three likelihood columns the engine then refuses.",
 ["The engine would have refused the unscaled survey for a row sum above 1, so the rescaling is what lets the survey be valued at all.",
  "The survey is worth more, since a rescaled row lowers the chance of Bright and so raises the posterior chance of Large after it.",
  "Nothing changes, because the engine rescales every likelihood row to 1 itself before applying Bayes to each of the readings."],
 "Each outcome's column sums to 1 because the survey returns some reading whatever the outcome; the engine refuses a column that misses 1 and names it, and it never checks rows.")

# ord 7
q(0, "On threeByThree, Drill alone after a Bright reading is worth 227.1875 against 109.0000 at the prior, and the survey costs 12.0000. Is the survey worth buying?",
 "No: it is worth 1.2000 gross and -10.8000 net, because Bright and Flat lead to Drill alone, the action the prior already chose.",
 ["Yes: the gain after Bright, weighted by its 0.320000 chance, alone exceeds 12.0000 before Flat and Dim add their share.",
  "Yes: the posterior chance of Large more than doubles after Bright, and a survey that moves posteriors that far earns its price.",
  "No, but only because its EVPI of 24.0000 caps any survey below twice its price, whatever the readings do to the choice."],
 "EV with information is 0.320000 x 227.1875 + 0.380000 x 86.5789 + 0.300000 x 15.3333 = 110.2000, only 1.2000 above emvPrior; all of it comes from Dim, the one reading that moves the action to Farm out.")

# ord 8
q(2, "The published threeByThreeCost12 information tree has root branch values 98.2000 and 109.0000 and chooses No further information. What is 98.2000?",
 "EV with information, 110.2000, less the survey cost of 12.0000.",
 ["The value of drilling after Bright and Flat alone, since the acquire branch drops the Dim reading that leads away from Drill alone.",
  "The acquire branch before its cost, which the tree compares against the prior after charging the survey cost to the other branch.",
  "The best reading's value, 227.1875, weighted by the chance of Bright and added to the prior value of the other two readings."],
 "The gap between the root branches, 98.2000 against 109.0000, is netEvii -10.8000, so a tree asked whether to buy the survey at 12.0000 declines it.")

# ord 9
q(3, "On the published impossibleSignal case, the Never reading has likelihoods 0.000000 / 0.000000 and reports posterior 0.300000 / 0.700000, best action Drill and emv 43.0000. A report says the right move on a Never reading is Drill, worth 43.0000. What is wrong with it?",
 "No outcome produces the reading, so its pSignal is 0.000000 and the row is the engine's fallback to the priors for an event that never occurs.",
 ["Nothing is wrong: a reading that carries no evidence leaves the prior in place, as a coin toss would, and the prior's best action is Drill.",
  "The row is residue of a division by zero the engine should have refused, so the 43.0000 carries no meaning of any kind.",
  "The emv is wrong: after a reading that costs nothing, Drill should carry 115.3333, the value after the best reading."],
 "Bayes cannot divide by a reading chance of 0, so the engine keeps the priors, the prior best action and the prior's emv; 43.0000 describes an event with probability 0.000000, and no separate warning is given.")

# ord 10
q(0, "impossibleSignal returns evWithInfo 55.5000 and evii 12.5000, the same as the published seismicBayes case, which is the same survey without the Never reading. Why?",
 "The Never row's emv is weighted by its pSignal of 0.000000, so it adds nothing to EV with information.",
 ["The engine drops any reading whose likelihoods are all zero before valuing, so both cases reach Bayes as the same input.",
  "The Never emv of 43.0000 equals emvPrior, so at any weight it adds to EV with information exactly what emvPrior subtracts.",
  "A survey is valued from its likelihood column sums alone, and a zero row leaves every one of those column sums where it was."],
 "0.450000 x 115.3333 + 0.550000 x 6.5455 + 0.000000 x 43.0000 = 55.5000; the extra row changes the table and not the value.")

# ord 11
q(2, "A reviewer expects the engine to refuse impossibleSignal, since the Never reading's likelihoods are 0.000000 given both outcomes. What does the engine do?",
 "It accepts the survey, because each outcome's likelihood column still sums to 1, and gives no sign beyond the zero pSignal.",
 ["It refuses the survey, naming the Never reading, because its posterior would need a division by a reading chance of exactly zero.",
  "It accepts the survey but prints a warning beside the table saying that the Never reading is impossible and was set aside from the value.",
  "It refuses the survey with a column message, since a column containing a zero likelihood cannot sum to 1 within 1e-6."],
 "Never contributes 0 to both columns, so they sum to 1 as before; the likelihood refusal is for a column that misses 1, and a pSignal of 0.000000 is the only mark of an impossible reading.")

# ord 12
q(1, "At a Large chance of 0.300000 on the three outcome lottery, Drill alone is worth 161.0000 and Drill with partner 80.5000. Why can the partner never be the best action on this lottery?",
 "Its payoffs and cost are exactly half of Drill alone's, so it is worth half at every probability, and when half is negative Farm out, never below 0, beats it.",
 ["It is dominated by Farm out in every outcome, since Farm out pays at least as much as the partner in Large, Medium and Dry alike.",
  "It is never best at the stated prior, but at a Large chance of 0.000000 it halves Drill alone's loss and so leads the other actions.",
  "It could lead if the engine's risk aversion setting were raised, since halving the Dry loss is exactly what a cautious operator pays for."],
 "Half of a positive value is smaller and half of a negative one is still negative; at a Large chance of 0.000000 Drill alone is 5.0000, the partner 2.5000 and Farm out 15.0000, and the engine has no risk aversion parameter.")

# ord 13
q(0, "Large is swept on the three outcome lottery with Medium held at 0.5 and Dry taking the rest. How many times does the best action change across the sweep?",
 "Once, from Farm out to Drill alone, between a Large chance of 0.000000 and 0.050000.",
 ["Twice, from Farm out to Drill with partner and then from the partner to Drill alone, since the partner's value rises more slowly.",
  "Three times, once for each adjacent pair of actions in the order listed, as each action overtakes the one before it.",
  "Once, from Relinquish to Farm out at a Large chance of 0.000000, since Relinquish and Farm out tie when nothing comes in large."],
 "At 0.000000 Farm out leads at 15.0000 against Drill alone's 5.0000, and at 0.050000 Drill alone leads at 31.0000 against 19.0000; the partner is always half of Drill alone and Relinquish never beats Farm out.")

# ord 14
q(3, "Removing Drill with partner from the three outcome lottery changes no value, yet removing the farm-out from the EKPAN lottery cuts its survey's gross value from 24.8250 to 19.8375. Why the difference?",
 "The EKPAN lottery's farm-out is the best action after a No bright spot reading, while the partner is best after no reading and in no outcome here.",
 ["A survey's value scales with the prior value of the actions it can choose among, and the farm-out carries more of that value than the partner does.",
  "Both removals lower the value of information, but the lottery's loss is too small to show once the engine rounds to four decimals.",
  "Removing an action changes a survey's value only on a two outcome lottery, where every action is chosen after some reading."],
 "The test is whether an action is best after some reading or outcome; the perfect information indices 0, 0 and 2 never name the partner, so deleting it leaves 109.0000, 133.0000 and 24.0000 where they are.")

# ord 15
q(2, "In Dry, Drill with partner loses 10.0000 plus its 30.0000 cost, where Drill alone loses 20.0000 plus 60.0000. Why does the engine give the halved loss no weight?",
 "It is risk neutral and maximises the mean, with no utility function or risk aversion parameter that could prefer a smaller loss.",
 ["The Dry loss is already counted inside EVPI, so charging it again in the action values would count the dry outcome twice.",
  "It discounts the losing outcomes at the chance node, so a halved loss and a full loss both shrink toward the same small number.",
  "It charges the partner's cost before weighting and its payoffs after, so the halving cancels out of the comparison with Drill alone."],
 "The rollback maximises expected money and applies no discounting, so a partner worth 54.5000 against 109.0000 at the prior loses; pruning it removes the one alternative that halves the exposure while changing no number.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/advanced/ec4a_m02.json", label="ec4a_m02", expect_n=15)
finish()
