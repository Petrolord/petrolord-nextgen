import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, intermediate, module m03-buying-the-information.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(3, "A budget memo quotes 24.8250 as the worth of the EKPAN lottery survey, which is priced at 8.0000. What is wrong with the memo?",
 "It quotes gross as net, overstating the survey's contribution by exactly its price; the net value is 16.8250.",
 ["Nothing is wrong, since the price is sunk once the contract is signed, and a value of information is always quoted before sunk costs are taken off.",
  "It should quote 92.5750, the lottery's acquisition branch, since that is what the company holds after paying for the survey.",
  "It understates the worth, since the survey also protects the 75.7500 the lottery is worth at the prior and that belongs in the figure."],
 "On the EKPAN lottery netEvii is evii less the cost: 24.8250 less 8.0000 is 16.8250. The 92.5750 is the whole decision with the survey bought, which is more than the survey adds on its own.")

# ord 2
q(1, "Why can the EKPAN lottery survey's price of 8.0000 be taken off before or after the readings are weighted with the same result, when a cost on one branch of a chance node cannot?",
 "The survey price sits on the branch that buys the survey and is paid whichever reading arrives, while a chance-branch cost is paid on that branch alone.",
 ["Because the survey price is already discounted and a chance-branch cost is not, so the engine applies the two at different points in the rollback.",
  "Because readings are signals that are not outcomes themselves, and the engine skips any cost placed on a signal branch while weighting it.",
  "It cannot: taking 8.0000 off after weighting charges it 0.460000 plus 0.540000 times over, which overstates the price paid."],
 "On the EKPAN lottery the price is paid once on every path through the survey, and 0.460000 plus 0.540000 is 1, so 100.5750 less 8.0000 is 92.5750 either way. A chance-branch cost must come off inside its branch.")

# ord 3
q(2, "On the EKPAN lottery information tree at a survey cost of 8.0000, what is the root worth, and what does the difference between its two branches equal?",
 "92.5750, and 92.5750 less 75.7500 is 16.8250, the net value of information.",
 ["100.5750, since the lottery survey's cost is paid below the reading chance node and never reaches the root of the tree.",
  "92.5750, and the lottery's difference of 16.8250 is the gross EVII, since the root has already charged the survey inside its value.",
  "75.7500, since the root keeps the lottery's prior decision and treats the survey as an option priced separately from the tree."],
 "The EKPAN lottery information tree's acquisition branch is 100.5750 less 8.0000 = 92.5750 against 75.7500 for no further information; the root difference 16.8250 equals netEvii.")

# ord 4
q(0, "Reading the EKPAN lottery information tree by node values, as the Decision Tree Builder's drawing labels them, what does a reader see under the survey branch?",
 "A chance node worth 100.5750, 8.0000 more than the branch value of 92.5750, because a node's value is taken before the cost on the branch leading into it.",
 ["92.5750 on the lottery, since the drawing labels each node with the value of its branch after the cost has been charged.",
  "100.5750 on the lottery, and that figure is the survey branch's value, because the survey cost is charged only at the root.",
  "8.0000 on the lottery, since the survey node is labelled with its own price and the readings carry the value."],
 "The drawing labels a node's own value, which excludes the cost on the branch into it. The same holds for the EKPAN lottery drill node after a bright spot, 262.7989 against a branch of 207.7989.")

# ord 5
q(2, "Which branches under \"No further information\" read onOptimalPath true in the EKPAN lottery information tree at a survey cost of 8.0000?",
 "None, because that root branch is not taken, and a branch below an untaken branch is never on the optimal path.",
 ["Drill, since Drill is the lottery's best action at the prior and the flag marks each decision node's best.",
  "Drill and its two outcomes, since the flag marks the best path inside every decision node of the tree.",
  "All of them, since the no-information branch is the fallback the policy returns to after a poor reading on the lottery survey."],
 "The EKPAN lottery tree marks the survey, both readings, Drill under a bright spot and Farm out under no bright spot; every branch under the untaken 75.7500 branch reads false.")

# ord 6
q(3, "What policy does the root choice commit the company to on the EKPAN lottery when the survey is priced at 8.0000?",
 "A policy: buy the survey, drill on a bright spot and farm out without one.",
 ["Buy the survey and drill after either reading, since the survey's worth lies in the confidence it adds to the lottery's prior choice of Drill.",
  "Drill now without the survey, since the lottery's prior decision at 75.7500 is already positive and a survey could only confirm it.",
  "Buy the survey and then drill, since Drill is best at the lottery's prior and after the reading that is more likely to arrive."],
 "On the EKPAN lottery the optimal path runs through the survey, Drill at 207.7989 after a bright spot and Farm out at 9.2361 after no bright spot. The more likely reading, at 0.540000, is no bright spot.")

# ord 7
q(1, "At what survey price do the two root branches of the EKPAN lottery information tree tie, and why that price?",
 "24.8250, the gross EVII, since the acquisition branch is 100.5750 less the price and the other branch holds at 75.7500.",
 ["52.0000 on the lottery, the EVPI, since a price above the value of perfect information is the first price at which any survey loses money.",
  "100.5750 on the lottery, the price at which the acquisition branch reaches zero and stops adding anything to the root.",
  "16.8250 on the lottery, the net value, since the tie comes when the price has used up everything the survey adds."],
 "On the EKPAN lottery the branches are equal when the price is 100.5750 less 75.7500 = 24.8250. EVPI is the neutral price of a survey that never misreads, and the neutral price compares two branches and never a branch with zero.")

# ord 8
q(0, "At a survey cost of exactly 24.8250 the EKPAN lottery information tree's root still marks the acquisition. What does that mark carry?",
 "Only the listing order: the branches tie at 75.7500, the engine reports the tie and marks the first listed, and a net value of 0.0000 says nothing favours buying.",
 ["A small positive net value hidden by printing to four decimals, since the engine compares the unrounded lottery branch values.",
  "A preference for information whenever the two lottery branches fall within the engine's tolerance of 1e-6 of each other.",
  "A real recommendation, since at the neutral price the survey still lowers the chance of drilling a dry hole on the lottery."],
 "At a cost equal to the EKPAN lottery's EVII the two root branches tie; the engine reports the tie and marks the acquisition, listed first. Read netEvii beside every root choice.")

# ord 9
q(0, "costExactlyNetZero returns root branch values 43.0000 and 43.0000 and bestBranchIndex 0. What would listing the no-information branch first change?",
 "The marked branch, which becomes doing without the survey, while the root value stays 43.0000 and the tie is reported either way.",
 ["Nothing, since the engine breaks exact ties toward the branch with fewer nodes below it, which is the no-information branch in either order.",
  "The root value, since the rollback weights a decision node's branches in listing order before it takes the maximum.",
  "The tie price, which moves away from the survey's gross value of 12.5000 toward the prior."],
 "The two root branches tie, so the engine reports the tie in either order and marks whichever is listed first. The survey there costs 12.5000, its gross value, and the root is 43.0000 whichever branch is marked.")

# ord 10
q(2, "At a survey cost of 28.0000 the EKPAN lottery acquisition branch is still worth 72.5750. A reader buys the survey because that branch is comfortably positive. What does the tree say?",
 "Do not buy: the no-information branch at 75.7500 is worth more, and the net value is -3.1750.",
 ["Buy, since a positive acquisition branch on the lottery means the survey returns more than its price and so adds value to the decision.",
  "Buy, since 28.0000 is still under the lottery's EVPI ceiling of 52.0000.",
  "Do not buy, as the branch is below the lottery survey's gross worth of 100.5750."],
 "On the EKPAN lottery a positive acquisition branch ignores the other root branch: 72.5750 against 75.7500 gives -3.1750. The 100.5750 is evWithInfo, and the gross value is 24.8250.")

# ord 11
q(3, "Across the EKPAN lottery cost sweep from 0.0000 to 32.0000, which of these moves?",
 "The acquisition branch and the net value, one for one with the price.",
 ["The success posterior after a bright spot, which falls from 0.646739 as a dearer survey is bought on the same lottery.",
  "The gross EVII, which shrinks from 24.8250 at no cost down to -7.1750 at the top of the lottery sweep.",
  "The no-information branch, which rises above 75.7500 as the lottery survey becomes less attractive to buy."],
 "The price is paid before any reading on the EKPAN lottery, so pSignal 0.460000, the posteriors, the actions and the gross 24.8250 stay fixed; only the acquisition branch and netEvii fall, to 68.5750 and -7.1750 at 32.0000.")

# ord 12
q(1, "Why does the EKPAN lottery information tree's root never fall below 75.7500, however dear the survey?",
 "Declining the survey is always available, and the root takes the larger of its two branches.",
 ["The engine floors the root at the lottery's prior EMV as a clamp.",
  "75.7500 is the least the lottery's Drill action can return after a bright spot, which the survey guarantees.",
  "The engine caps any survey price at its EVII, so the lottery's acquisition branch cannot fall further than 75.7500."],
 "Nothing is clamped or capped: at 32.0000 the EKPAN lottery acquisition branch really is 68.5750, and the root is 75.7500 because the no-information branch wins the maximum.")

# ord 13
q(3, "seismicCost20 returns a root emv of 43.0000 with bestBranchIndex 1 and root branch values 35.5000 and 43.0000. What happened?",
 "The survey price of 20.0000 exceeds its gross value of 12.5000, so the root takes the no-information branch.",
 ["The engine refused the survey because its price passed the prospect's EVPI of 35.0000, and fell back to the prior decision in place of a value.",
  "The survey changed the prior decision, and 43.0000 is the value of acting on the negative seismic reading that the survey returns most often.",
  "Index 1 is the survey branch, and 35.5000 is what the tree charged for the survey out of its 43.0000 root."],
 "The seismic survey's evWithInfo is 55.5000, so its acquisition branch is 55.5000 less 20.0000 = 35.5000 against 43.0000. The price is below the prospect's EVPI of 35.0000 and nothing is refused.")

# ord 14
q(2, "The published noSignals case asks for an information tree with no readings at all and a survey cost of 0.0000. What does the engine return?",
 "The plain prospect decision, a root \"Choose action\" at 43.0000 with no survey branch.",
 ["A refusal: an information tree needs a reading to build its chance node.",
  "A survey branch worth 43.0000 tied with no information, and the first branch listed, the acquisition, named as the choice.",
  "A survey branch worth the EVPI, as a survey with no readings cannot misread."],
 "noSignals returns root \"Choose action\" at 43.0000 with branch values 43.0000, 18.0000 and 0.0000: the three actions of the prospect and nothing to buy.")

# ord 15
q(1, "A manager asks the EKPAN lottery cost sweep whether a cheaper survey with weaker likelihoods would be worth more net. What can the sweep answer?",
 "Nothing, since the sweep holds the survey's likelihoods fixed and every survey quality needs its own tree.",
 ["Yes, by reading the lottery's net value at the cheaper price, since price is the only way a survey's quality reaches the information tree.",
  "Yes, since the lottery's net value falls one for one with price, so any cheaper survey is worth more net whatever its likelihoods are.",
  "Only that any survey adds value below the lottery's 24.8250, where the sweep stops paying."],
 "The EKPAN lottery sweep values one survey at many prices; its gross 24.8250 comes from 0.850000 and 0.250000. A weaker survey has a different gross value, and the engine has no budget constraint either.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/intermediate/ec4i_m03.json", label="ec4i_m03", expect_n=15)
finish()
