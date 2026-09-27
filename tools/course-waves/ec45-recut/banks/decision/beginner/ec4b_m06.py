import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, beginner, module m06-the-associate-reading.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(3, "The Decision Tree Builder's drawing labels the EKPAN tree's drill chance node EMV 160. A graded question asks for the drill branch's value. What goes wrong if the label is copied?",
 "The answer is 160.0000 where the EKPAN tree's drill branch is 105.0000, wrong by exactly the drill cost of 55.0000.",
 ["Nothing, since the EKPAN tree's drill is on the optimal path, where a label equals the branch value.",
  "Only the precision: the drawing prints 160, and the EKPAN tree's drill branch is 160.0000.",
  "The answer adds the marginal find's sale at 140.0000 into the EKPAN tree's node as a fallback."],
 "A node label is the value before the cost on the branch into it: on the EKPAN tree 0.350000 x 420.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000 = 160.0000, less 55.0000 = 105.0000.")

# ord 2
q(1, "What do the next best alternative and the decision advantage read for OKRIKA?",
 "Sell now at 48.0000, and an advantage of 39.0000 for Appraise.",
 ["Develop now at 33.6000, the branch listed second, which the card takes as the runner-up whatever its value.",
  "Sell now at 48.0000, and an advantage of 71.4000, the value the later sale adds inside the appraisal branch.",
  "Develop now at 183.6000, since the card reads each alternative at its node before the development cost of 150.0000."],
 "The next best card takes the largest other root branch value, 48.0000, and the advantage is 87.0000 less 48.0000 = 39.0000; 71.4000 compares the appraisal with and without its later sale.")

# ord 3
q(0, "On OKRIKA, the development chance node after a poor appraisal sits under a Develop branch reading onOptimalPath false. Its Large and Small probabilities are retyped so they sum to 0.9. What comes back for OKRIKA?",
 "A refusal of the whole tree naming that node and printing 0.900000, with no EMV for Appraise, Develop now or Sell now.",
 ["The root at 87.0000 unchanged, since that development reads onOptimalPath false and the sale at 25.0000 is what the appraisal node weights.",
  "Sell now at 48.0000, the only root branch that passes through no chance node, with the other two root branches reported as refused.",
  "The root with that node's probabilities rescaled to sum to 1, since a node below a branch the rollback does not take is repaired quietly rather than refused."],
 "The sum is checked at every chance node however deep, taken or not: the rollback still values that development at -94.0000 before the decision sets it against the sale at 25.0000. A refusal returns no EMV for any part of the tree, and the engine never rescales.")

# ord 4
q(2, "A reader types the EKPAN tree's success payoff as 185, the P90 (the low case) of its Monte Carlo NPV summary, instead of linking the summary whose mean is 420. What does the tree read?",
 "37.7500 with Farm out first, where the linked summary would have given the tree 105.0000 with Drill.",
 ["105.0000 with Drill, since the P90 is the cautious figure and a drill on the tree that survives it survives the mean as well.",
  "94.5000 with Drill, since 185 sits near the P50 and the tree moves only part way.",
  "22.7500 with Drill, the tree's drill branch at that payoff, since Drill is the only branch that can reach the success payoff."],
 "At 185.0000 the EKPAN tree's drill branch is 22.7500, below Farm out at 37.7500, so the choice flips; linked, only the mean enters and the tree reads 105.0000.")

# ord 5
q(0, "Rolled back without its walk-away branch, what does the EKPAN tree read at its stated probabilities and at success 0.050000?",
 "105.0000 with Drill, and Farm out at 9.2500 at 0.050000, exactly as with the walk-away branch drawn on the tree.",
 ["105.0000 with Drill, but at 0.050000 the tree takes Drill at -28.5000, since with no walk away the least bad branch is the drill.",
  "Less than 105.0000 on the tree, since removing a branch lowers a decision by the weight it carried.",
  "0.0000 at 0.050000, since walking away is the tree's floor and the root has nothing left under it."],
 "A decision takes its best branch, so removing one that is never best leaves every root value unchanged; at 0.050000 the EKPAN tree's Farm out 9.2500 beats Drill at -28.5000 either way.")

# ord 6
q(3, "Which of these first moves is the tie rule speaking, and nothing else?",
 "Drill on the published drillFarmOut tree at success 0.200000, where both branches are 12.0000.",
 ["Farm out on the EKPAN lottery at 0.228571, where both actions print 21.7143 and the lottery keeps the action it meets last.",
  "Develop in the EKPAN tree's marginal find, where 260.0000 less its cost of 90.0000 beats selling at 140.0000 within the rule's margin.",
  "Appraise on OKRIKA at 87.0000, because the appraisal is listed first of the three root branches and the rule favours that position."],
 "An exact tie at drillFarmOut's 0.200000 is reported as a tie and Drill is marked because it is listed first, with nothing between the two. The EKPAN lottery at 0.228571 is a reported tie with Drill marked, and Develop at 170.0000 and Appraise by 39.0000 are real margins.")

# ord 7
q(1, "The EKPAN tree's drill branch is worth 105.0000. Which statement about what a drilled well delivers is right?",
 "On the tree it leaves 365.0000, 115.0000 or -80.0000 after its cost, loses money with probability 0.500000, and never delivers 105.0000.",
 ["On the tree it delivers 105.0000 in the typical case, since an EMV is the outcome a well is most likely to produce.",
  "On the tree it loses money with probability 0.650000, the dry hole chance once the marginal find is counted as a failure.",
  "On the tree it loses money only on the dry hole's -25.0000, since the drill cost of 55.0000 is already inside the EMV."],
 "Each outcome less the 55.0000 drill cost gives the EKPAN tree's three amounts; 0.650000 is the EKPAN lottery's loss chance, a different model that folds the marginal find into its dry hole, and mixing the two is the mistake.")

# ord 8
q(2, "The Onward reading calls OKRIKA's appraisal the idea of information in miniature. Which numbers carry that idea?",
 "The appraisal branch is 15.6000 when its result cannot change the action and 87.0000 when a poor result leads to a sale.",
 ["OKRIKA's appraisal branch is 105.0000 before its cost and 87.0000 after, so it is worth its price of 18.0000.",
  "A poor result cuts the chance of a large field from 0.420000 to 0.200000, and the uncertainty removed is what the appraisal is worth.",
  "The appraisal leads Sell now by 39.0000, the most the company should pay for any appraisal."],
 "Information is worth what it can change: with no sale the appraisal leaves the development unchanged and loses to Sell now at 48.0000, and with the sale the option inside the branch is worth 71.4000.")

# ord 9
q(1, "On the EKPAN lottery EVPI is 61.7143 at a success probability of 0.228571 and 52.0000 at the stated 0.350000. Why is it largest at 0.228571?",
 "It is the lottery's drill against farm-out switch, where the choice made without information is least settled.",
 ["It is where the lottery's drill loses money least often, so knowing the outcome recovers most.",
  "EVPI on the lottery rises as success grows less likely, climbing all the way down to 0.050000.",
  "It is where the lottery's Farm out is named by residue, and EVPI is measured against that error."],
 "Perfect information is worth most where the prior decision is closest to turning; at the EKPAN lottery's stated 0.350000 the drill already leads 75.7500 to 33.2500, and at 0.050000 EVPI is only 13.5000.")

# ord 10
q(3, "The EKPAN lottery's information tree ties its two root branches at a survey cost of 24.8250. What does the engine report there?",
 "A tie, with Acquire CSEM survey marked because it is the first branch listed on the lottery's information tree.",
 ["No further information, because at a net value of 0.0000 on the lottery the engine declines to spend money that buys nothing.",
  "A refusal, since a lottery survey priced at its gross value leaves no best branch.",
  "No further information, because 24.8250 is judged against the lottery's EVPI of 52.0000 and falls short of perfect information."],
 "At a survey cost of 24.8250 both root branches of the EKPAN lottery's information tree are 75.7500. The engine reports them tied and marks the acquisition, listed first.")

# ord 11
q(0, "The EKPAN lottery's survey typed into the VOI Analyzer gives a gross value of information of 19.84 in its guidance sentence, while the same survey is worth 24.8250 on the lottery. What separates them?",
 "The Analyzer offers two actions only, the named decision and Do Not, so the lottery's farm-out is missing from 19.84.",
 ["The Analyzer rounds the lottery's posteriors to two decimals before valuing them, which costs the gross value a few million USD.",
  "The 19.84 is net of the lottery's survey cost of 8.0000, while 24.8250 is the gross value before that cost is paid.",
  "The Analyzer withholds part of the lottery's value, because the typed indicator chances contradict the stated 0.350000."],
 "With Farm out removed the EKPAN lottery's survey is worth 19.8375, the two-action number the Analyzer prints as 19.84; the posteriors were typed at full precision and the inputs read consistent true.")

# ord 12
q(2, "On IRRI both indicators are typed 20 / 80 percent. What does the VOI Analyzer report for the value of information?",
 "It withholds it, with consistent false, and still reports EMV without information 15.00 and EVPI 63.00.",
 ["A gross value of -15.00, the figure the typed chances give with nothing checking them, shown beside a warning.",
  "A value of 0.00, since two readings with the same outcome chances cannot change the decision.",
  "A refusal before anything is computed, since chances that disagree are not chances at all."],
 "The typed numbers are chances that cannot all be true, implying 0.200000 success against a stated 0.300000. Weighted with nothing checking them they would give -15.00, which Bayes can never produce because information is never worth less than 0.")

# ord 13
q(3, "Rolling back a tree in writing, a learner's line disagrees with the explorer at one node. What does the working method say to do?",
 "Stop at the first disagreement and find it, since the root is only as right as everything beneath it.",
 ["Write down the explorer's root, since hand lines are where errors enter.",
  "Carry on to the root, since one node's disagreement is diluted by the weighting above it.",
  "Move one probability and roll back again, since a disagreement at a single node usually means the tree sits near its switch."],
 "The explorer rolls back whatever was typed, a wrong probability, cost or link included, so the method compares node by node; on OKRIKA the lines run 375.0000, 225.0000, 56.0000, 25.0000, 105.0000 and 87.0000.")

# ord 14
q(0, "What can a rolled-back tree in this tier not tell a company about the EKPAN lottery's drill?",
 "Whether the lottery's probabilities are right, what a loss of 80.0000 means to the licence holder, or what learning the outcome before committing 55.0000 is worth.",
 ["Its first move on the lottery, since a risk neutral rollback reports an EMV and leaves the choice between the branches to the reader.",
  "Its value in today's money on the lottery, since the rollback discounts each payoff by the stage it sits at and never shows the rate.",
  "Whether the lottery's probabilities sum to 1, since the engine accepts any chance node and reports its sum only as a note."],
 "The engine returns a risk neutral EMV of 75.7500 for the EKPAN lottery's drill with a best branch and a path, refuses a bad sum and applies no rate; what information is worth before the 55.0000 is committed is the next tier's question.")

# ord 15
q(1, "On the published allNegative tree, branch A is worth -55.0000 and branch B -52.0000. What does the engine return?",
 "B as the first move at an EMV of -52.0000, an advantage of 3.0000 over A.",
 ["A refusal, since a decision node with no branch above 0 has no choice that is worth recommending to anyone.",
  "A at -55.0000, since the decision takes the largest branch value and the engine compares the sizes of the two losses.",
  "An EMV of 0.0000 with no first move, since walking away is implied whenever every branch drawn in the tree loses money."],
 "A decision takes the maximum even when every branch loses: -52.0000 is greater than -55.0000, and the engine never adds a walk-away branch the tree does not draw.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/beginner/ec4b_m06.json", label="ec4b_m06", expect_n=15)
finish()
