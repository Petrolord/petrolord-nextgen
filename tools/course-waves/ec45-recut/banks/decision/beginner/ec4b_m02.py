import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, beginner, module m02-chance-nodes.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(2, "Weighting the EKPAN tree's marginal find at 260.0000 gives a drill chance node that is not 160.0000, and the engine accepts it without complaint. What has that calculation got wrong?",
 "It treats development as free, reading the develop payoff where the node needs the develop branch value of 170.0000 after its 90.0000 cost.",
 ["It treats the marginal find as a decision, when the owner has no further choice once a marginal accumulation is found and must simply develop it at 260.0000.",
  "It weights the payoff before discounting it, when the engine expects the develop cost of 90.0000 to be applied to the 260.0000 payoff as a discount rate.",
  "It counts the drill cost of 55.0000 twice, since the develop payoff of 260.0000 already has the drill cost taken out of it."],
 "A chance node weights branch values. Develop is 260.0000 less 90.0000, which is 170.0000, and it beats Sell at 140.0000; the probabilities are untouched, so the engine has nothing to refuse.")

# ord 2
q(1, "A chance node with three equal outcomes paying 30, 60 and 90 has each probability typed as 0.333333. What does the engine return?",
 "EMV 59.9999, since 0.999999 sits on the edge of the 1e-6 tolerance, the check includes its edge, and the thirds are weighted as typed.",
 ["A refusal printing the sum 0.999999, because a sum sitting at the edge of the 1e-6 tolerance is not accepted.",
  "EMV 60.0000 from the weights rescaled to sum to 1, with the typed sum printed as a warning.",
  "EMV 35.0000, the published thirdsProbabilities result, since that case types its thirds to six decimals."],
 "The test is |sum - 1| at most 1e-6 plus a 1e-12 allowance for binary representation, so six decimals pass and the node is worth 0.333333 x (30 + 60 + 90) = 59.9999. Five decimals, 0.33333 each, are refused. The thirdsProbabilities case is a different tree whose 35.0000 matches its own golden.")

# ord 3
q(3, "Refused with thirds typed at 0.333 each, a reader adds the whole shortfall to the last branch of the node paying 30, 60 and 90. What does that produce?",
 "An accepted tree whose last outcome now carries more weight than the other two, although the three were meant to be equal.",
 ["A second refusal, since the engine checks that branches typed as thirds still carry equal probabilities before it weights any of them.",
  "An accepted tree at EMV 60.0000 exactly, since the sum is now 1 and moving weight between the branches cannot move the mean of 30, 60 and 90.",
  "An accepted tree at EMV 60.0000, because the engine spreads a shortfall added to one branch evenly back over all three branches before weighting."],
 "The engine checks only the sum, 0.999000 as first typed, and never whether the weights are the intended ones. The fix is to type every branch at enough precision, as 0.3333333 each rolls back to 60.0000.")

# ord 4
q(1, "One chance node two levels below the root of a tree sums to 0.2, and every other node is well formed. What does the engine return for the well formed parts?",
 "No EMV for any of them: the whole tree is refused, and the message names the failing node cc and prints 0.200000.",
 ["Their EMVs, since the sum is checked only at chance nodes directly beneath the root decision.",
  "Their EMVs, with the failing node carried up the tree at zero so that the root can still be compared.",
  "The root's EMV with the failing node rescaled to sum to 1, and a warning naming node cc beside it."],
 "The check runs at every chance node however deep, so a sum of 0.200000 two levels down refuses the tree and returns nothing. Leaving an outcome off a node is refused the same way: the engine never spreads a missing probability over the rest.")

# ord 5
q(2, "On the published chanceRootWithBranchCosts tree, calm has probability 0.600000, cost 2.0000 and child 19.0000, and storm has probability 0.400000, cost 8.0000 and child -25.0000. What is the root EMV?",
 "-3.0000, from branch values of 17.0000 and -33.0000 weighted by 0.600000 and 0.400000.",
 ["-8.6000, from the two children weighted first and both costs, 2.0000 and 8.0000, subtracted once afterwards.",
  "17.0000, the calm branch value, since a root that is a chance node keeps its likelier branch.",
  "-33.0000, the storm branch value, since a chance root with no move to make reports its worst branch."],
 "Each branch value is its child less its own cost, and only then does the node weight: 0.600000 x 17.0000 + 0.400000 x -33.0000 = -3.0000.")

# ord 6
q(3, "A reader collects every cost on the chanceRootWithBranchCosts tree into one total and subtracts it after weighting, the way a budget would, and gets -8.6000. Why is that wrong?",
 "It charges the storm cost in the calm and the calm cost in the storm, money for events that did not occur.",
 ["It is flagged by the engine, which refuses any cost placed on a branch below a chance node and points to the root instead.",
  "It discounts both costs to a later date, since a cost charged after weighting is treated as paid once the outcome is known.",
  "It is right at the root and wrong at the branches, since a chance root is worth the same whichever way its costs are charged."],
 "A cost on a branch is paid only on that branch. The difference between -3.0000 and -8.6000 is money charged for outcomes that never happened, and a hand calculation is never refused.")

# ord 7
q(0, "What do the Decision Tree Builder's cards show for the chanceRootWithBranchCosts tree, whose root is a chance node?",
 "Optimal EMV -3.0000, Chance root: no first decision to make on the first-move card, and N/A on the next best alternative and decision advantage cards.",
 ["Calm as the recommended first move, being the likelier branch at 0.600000, with storm as the next best alternative and a decision advantage beside it.",
  "No cards, since the Builder needs a decision at the root and refuses to roll back a tree whose root is a chance node.",
  "Optimal EMV -8.6000, since the Builder subtracts the tree's costs once after the rollback to fill the card."],
 "The cards assume a decision at the root. Facing that chance is worth -3.0000, and there is no move to recommend or compare.")

# ord 8
q(1, "The EKPAN tree's success payoff of 420.0000 is replaced by a linked NPV summary with mean 420, P90 185, P50 390 and P10 710, and the tree still rolls back to 105.0000. Why does the spread move nothing?",
 "A chance node is linear in its payoffs, so the mean alone gives the expected value and the rest of the summary cannot change it.",
 ["The engine sets the P90 of 185 against the P10 of 710 as a risk adjustment, and for this particular summary their two pulls on the payoff cancel out.",
  "It does move it, and 105.0000 is the P50 case once the Builder's drawing has rounded the node label.",
  "The spread enters the rollback only at decision nodes, as a risk adjustment on the branch taken, and the success terminal hangs below a chance node."],
 "Averaging over the summary before or after weighting by 0.350000 gives the same number, so a success worth exactly 420.0000 and one spread from 185 to 710 produce the same 105.0000.")

# ord 9
q(3, "To be conservative, an analyst types the summary's P90 of 185 as the EKPAN tree's success payoff instead of its mean. What does the tree then report?",
 "The drill branch falls to 22.7500, below the farm-out's 37.7500, so the tree recommends the farm-out at an EMV that is not the drill's value.",
 ["The drill branch rises to 206.5000, because under the exceedance meaning a P90 is the high case of the summary.",
  "The EMV stays at 105.0000, since the engine reads a linked payoff at its mean whatever statistic is typed in.",
  "The drill branch falls to 94.5000 and still wins, because a P90 moves a payoff less than a P50 would."],
 "P90 is the low case. Read there, the drill weighting gives 22.7500 and the root takes Farm out at 37.7500, which turns a risk preference into what looks like an expected value.")

# ord 10
q(0, "A summary typed as a terminal payoff carries a P90 of 185, a P50 of 390 and a P10 of 710, and no mean. What does the engine return?",
 "A refusal that names the terminal and says the distribution payoff has no finite mean, since the engine does not estimate a mean from the percentiles.",
 ["An EMV using the P50 of 390 as the payoff, since the middle of the distribution stands in for a mean the summary does not carry.",
  "An EMV using the midpoint of the P90 and the P10 as its estimate of the mean, printed with a warning.",
  "An EMV of 105.0000, from the mean last stored for that terminal when a run was linked to it."],
 "Only the mean enters the rollback, so a summary without one gives the engine nothing to weight. It refuses and does not guess a mean from 185, 390 and 710.")

# ord 11
q(1, "An analyst types the linked summary's P50 of 390 as the EKPAN tree's success payoff, because it is the middle of the distribution. What does the tree return?",
 "EMV 94.5000 with Drill, below the true 105.0000, because a chance node needs the mean and the P50 is not it.",
 ["EMV 105.0000, since the P50 and the mean coincide for every summary the Builder can link from a saved Monte Carlo run.",
  "EMV 37.7500 with Farm out, since reading any percentile in place of the mean flips the EKPAN tree.",
  "EMV 206.5000 with Drill, since under the exceedance meaning a P50 sits above the mean of the summary."],
 "At 390 the drill weighting gives a branch value of 94.5000. It still beats the farm-out's 37.7500 here, and on a closer choice that shortfall could flip the move.")

# ord 12
q(2, "An owner drills EKPAN once. Which statement about that single well on the EKPAN tree is true?",
 "It leaves 365.0000, 115.0000 or -80.0000 after the drill cost, loses money with probability 0.500000, and never leaves 105.0000.",
 ["It leaves 105.0000 on average each time, since the branch value is the most likely money the drill returns.",
  "It loses money with probability 0.650000, the dry hole chance that the drill carries on EKPAN.",
  "It leaves 420.0000, 170.0000 or -25.0000, since the drill cost of 55.0000 is already inside the chance node's value of 160.0000 and is not charged again."],
 "105.0000 is an average over outcomes, and the owner receives one of them. 0.650000 is the dry hole of the EKPAN lottery, a different two-outcome model, and mixing it in is exactly the error; the EKPAN tree's dry hole is 0.500000.")

# ord 13
q(3, "A report says that on the EKPAN tree the marginal find, which leaves 115.0000 after the drill cost, is a little above expectation. What is wrong with that sentence?",
 "It treats the EMV as a middle case, when 105.0000 is a weighted average pulled up by the 365.0000 success and need not sit near any outcome.",
 ["Nothing is wrong, because the outcome closest to the EMV is by definition the expected case of the chance node.",
  "The marginal find really leaves 60.0000 once the drill cost of 55.0000 is taken off 115.0000, which is below expectation.",
  "The comparison should be with 160.0000, the drill node's EMV, which is the expectation the drawing prints for the well."],
 "The marginal find happens with probability 0.150000. 115.0000 is already net of the drill cost, so subtracting 55.0000 again counts it twice, and 160.0000 is a value before that cost.")

# ord 14
q(0, "A programme is sized on the EKPAN tree's EMV of 105.0000. What does the rollback itself report that could warn against it?",
 "Nothing: it returns values and best branches, with no distribution, chance of loss or worst case for any branch.",
 ["The Optimal EMV card, which prints the chance of loss beside the root EMV when a branch can lose.",
  "The onOptimalPath flags, which mark the dry hole false because it loses money on the drill branch that the rollback has chosen.",
  "The drawing's EMV 160 label on the drill node, which is the money the well returns before any loss from a dry hole is counted."],
 "The drill's half chance of leaving -80.0000 is worked by hand. The dry hole is flagged true, because choosing to drill means facing it.")

# ord 15
q(1, "Weighting the drill's after-cost money on the EKPAN tree, 365.0000, 115.0000 and -80.0000, by 0.350000, 0.150000 and 0.500000 returns what, and why?",
 "105.0000, the branch value, because the probabilities sum to 1, so taking 55.0000 off every outcome takes it once off the average.",
 ["160.0000, the drill chance node, because weighting a branch's outcomes always returns the node value from before the cost on its branch.",
  "50.0000, because the drill cost of 55.0000 is charged on the branch again once the weighting is done.",
  "105.0000 by coincidence of these payoffs, since a cost taken off each outcome is weighted by probabilities that need not add up to exactly 1."],
 "Weighted, the three after-cost amounts reproduce the rollback's 105.0000, and the branch value is not among them. Charging 55.0000 again after the weighting would count the cost twice.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/beginner/ec4b_m02.json", label="ec4b_m02", expect_n=15)
finish()
