import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, beginner, module m01-what-a-decision-tree-is.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(1, "On the EKPAN tree the dry hole is the single most likely outcome at 0.500000, and in a dry hole the farm-out's 0.0000 beats the drill's -25.0000. An owner farms out on that ground. What does the tree say about the choice?",
 "It trades a branch worth 105.0000 for one worth 37.7500, because the tree weights every outcome by its probability and the drill pays far more in the other half.",
 ["It agrees with the choice, because a decision node takes the branch that does best in the outcome carrying the largest probability.",
  "It agrees once the drill cost of 55.0000 is charged, because the drill then loses money in the most likely outcome and a decision node avoids a likely loss.",
  "It cannot judge the choice, because a risk neutral engine gives no weight to how likely any single outcome is when it compares the moves."],
 "Choosing by the most likely outcome ignores the probability where the drill pays 420.0000 or 170.0000. Weighted, the drill branch is worth 105.0000 against the farm-out's 37.7500.")

# ord 2
q(3, "On the EKPAN tree, \"Marginal find\" sits under the drill's chance node. What kind of node is it, and what does the chance node weight for it?",
 "A decision node, entering the weighting at its best branch value of 170.0000.",
 ["A terminal paying the develop payoff of 260.0000, weighted at 0.150000 like the success and the dry hole beside it.",
  "A chance node between Develop and Sell, entering the weighting at an average of their values because the owner cannot know which will follow.",
  "A decision node, entering the weighting at the sale's 140.0000, since a choice made after drilling is valued at its safer branch."],
 "The owner chooses only if a marginal find occurs, and takes the better branch: Develop at 260.0000 less 90.0000, which is 170.0000, against Sell at 140.0000.")

# ord 3
q(0, "The Decision Tree Builder's drawing labels the EKPAN tree's drill chance node EMV 160, while the drill branch and the root are worth 105.0000. Why do the two differ?",
 "The label is the node's own value, before the drill cost of 55.0000 on the branch leading into it.",
 ["The label is the drill value before discounting, and 105.0000 is it after the rollback's rate.",
  "The label rounds a value above 100 to no decimals, which opens the gap to 105.0000.",
  "The label weights the marginal find at its develop payoff of 260.0000, where the branch value uses the develop branch value instead."],
 "The drill node weights its outcomes to 160.0000, and the branch subtracts 55.0000 once to give 105.0000. The number to set against the farm-out's 37.7500 is the branch value.")

# ord 4
q(2, "A chance node's probabilities are typed so that they sum to 0.9. What does the engine return?",
 "A refusal naming the node and printing the sum 0.900000, with no EMV for any part of the tree.",
 ["The EMV of the node with its probabilities rescaled so they sum to 1, and a warning naming the node beside the result.",
  "The EMV computed on the probabilities as typed, carrying only 0.9 of the weight, since the sum check warns and does not stop the rollback.",
  "An EMV for every node except the one that failed, which is carried up the tree as a value of zero so the root can still be compared."],
 "The engine checks the sum and never repairs it. The published message reads Chance branch probabilities sum to 0.900000, expected 1, at node bad, and a refusal returns no EMV at all.")

# ord 5
q(1, "The published rollbackRefusals cases include a chance node with one branch typed at probability 1.5. What does the engine return for it?",
 "A refusal saying branch a needs a probability between 0 and 1, at node bad.",
 ["An EMV with that branch clamped to 1 and the rest set to zero.",
  "A refusal printing the node's sum, found as the branches are added.",
  "An EMV weighted on the typed numbers, since a branch above 1 is legal whenever another branch on the node is typed low enough to balance it."],
 "The message names the branch and the node: Branch a needs a probability between 0 and 1, at node bad. The engine never clamps a probability of 1.5 into range.")

# ord 6
q(3, "A company will not accept an even chance of losing 80.0000 million USD. What can it set in the engine so that the EKPAN tree prefers the farm-out?",
 "Nothing: neither the tree engine nor the VOI Analyzer has a utility function or a risk aversion parameter.",
 ["A risk aversion parameter on the root decision, which penalises each branch by its chance of losing money before the maximum is taken.",
  "The dry hole's probability of 0.500000, which the engine reads a second time as a loss weight after the rollback has finished.",
  "The listing order, typing the farm-out first so that the tie rule hands it the root."],
 "The rollback maximises expected money, so the drill at 105.0000 beats the farm-out at 37.7500 however badly the drill's -80.0000 hurts. Listing order decides only exact ties, and 105.0000 against 37.7500 is none.")

# ord 7
q(0, "On the EKPAN tree, the develop cost of 90.0000 is spent only after the well has found something, years after the root decision. What must be true of it and of its 260.0000 payoff?",
 "Both must already be present values at the date and rate of the root decision, because the rollback adds them at face value.",
 ["Only the payoff must be discounted by hand, as the engine discounts a cost by how deep its branch sits.",
  "Nothing, because a cost is charged before a chance node weights it, which already places it on the date of the root decision.",
  "Both must be typed as undiscounted cash, as the engine applies one rate to every payoff and cost."],
 "The engine has no rate and no dates: 420.0000, -25.0000 and the drill cost of 55.0000 enter exactly as typed. Whatever valued the numbers must have put them on one date.")

# ord 8
q(2, "An analyst applies a discount rate by hand to an NPV that is already discounted, then types the result as a terminal payoff. What happens to the tree?",
 "Every payoff shrinks while costs stay put, pulling the choice toward the cheaper branch, and nothing in the output shows it.",
 ["The engine detects the second discount and refuses the terminal as a distribution payoff with no finite mean.",
  "Nothing changes, because the rollback strips any rate applied to a payoff before it weights the payoff at its chance node.",
  "Payoffs and costs shrink alike, so the EMV falls in proportion and the recommended branch can never change as a result."],
 "The engine adds numbers at face value, so a smaller 420.0000 meets an unchanged cost of 55.0000. Neither discounting twice nor not at all leaves any trace in the output.")

# ord 9
q(1, "A Builder terminal on a tree is linked to a saved Monte Carlo run, and the run is later revalued. What does the tree use for that terminal?",
 "The copy of the run's NPV mean, P90 and P10 stored when it was linked, until the terminal is linked again.",
 ["The revalued run, because the Builder re-reads every linked run each time the tree is rolled back and replaces the stored numbers.",
  "A refusal saying the distribution payoff has no finite mean, until the changed run is linked again.",
  "The revalued P10 and P90 beside the old mean, since only the mean is copied at linking and the percentiles are read live from the run."],
 "Linking stores a copy in million USD at that moment and nothing re-reads the run, so a tree rolled back to 105.0000 on a stale copy gives no warning. Unlinking keeps the mean as a fixed payoff.")

# ord 10
q(0, "On the published equalEmvTie case, branches A and B are both worth 30.0000 and C is worth 29.9990, and the engine marks A. Listed with B first, what does it mark?",
 "B, at the same EMV of 30.0000, because the engine reports A and B tied and marks the first listed of them.",
 ["A, because the engine sorts a decision node's branches by name before it compares their values.",
  "No branch at all, because an exact tie is refused as ambiguous with a message naming the node.",
  "C, because 29.9990 lies within the engine's tolerance of 30.0000 and the last near tie listed is kept."],
 "A and B tie, so the engine reports both with indifferent true and marks whichever is listed first, and the root stays 30.0000. The mark records the order of typing and nothing about the branches.")

# ord 11
q(3, "A tree with undiscounted payoffs, a success probability chosen to flatter the drill and conveniently ordered branches rolls back with no error. What does the absence of an error establish?",
 "Only that the tree is well formed: known node types, at least one branch per node and probability sums within 1e-6 of 1.",
 ["That its payoffs are present values, since the engine refuses a terminal typed without a rate.",
  "That no branch left off the tree would have beaten the best, since each decision node is checked for a walk-away before it is accepted.",
  "That its probabilities describe the prospect, since a probability chosen to favour one branch would push its chance node out of tolerance."],
 "The engine checks shape only. Any set of probabilities that sums to 1 within 1e-6 passes, and the EKPAN tree's 105.0000 is only as good as its inputs.")

# ord 12
q(2, "An owner picks the drill on the EKPAN tree because its success pays 420.0000, the largest number in the table. What is wrong with that reasoning, given that the tree also recommends Drill?",
 "It never uses the probabilities, so it would pick the drill just as confidently at a success chance too low to justify it.",
 ["Nothing is wrong with it, because a decision node takes the branch holding the largest single payoff anywhere beneath it.",
  "It reads the payoff before the drill cost, and 420.0000 less 55.0000 would lose to the farm-out once both are compared.",
  "It uses the success outcome, which is the least likely of the three, where the tree takes the outcome with the largest probability."],
 "The tree weights 0.350000 x 420.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000 = 160.0000 and then subtracts 55.0000. The best case alone picks the drill for the wrong reason.")

# ord 13
q(1, "A branch on a tree is typed with no child node beneath it. What does the engine return?",
 "The refusal Missing node, with no EMV for the tree.",
 ["A branch value of zero, the absent child read as a terminal that pays nothing, so the rest of the tree still rolls back.",
  "The refusal Unknown node type, since an absent child has no type among the three the engine recognises.",
  "A branch worth minus its own cost, since a cost is charged when the branch is taken whatever lies below it."],
 "The engine never guesses what a malformed node meant. A missing child is refused, and a node typed lottery is refused separately as Unknown node type; neither returns a value in place of 105.0000.")

# ord 14
q(0, "At the EKPAN tree's root decision node, which three numbers does the engine compare?",
 "105.0000, 37.7500 and 0.0000, each the child's value less the cost on its branch.",
 ["160.0000, 37.7500 and 0.0000, the nodes' own values, with the drill cost of 55.0000 charged once the maximum has been taken.",
  "420.0000, 95.0000 and 0.0000, the best payoff reachable on each branch.",
  "-25.0000, 0.0000 and 0.0000, the worst outcome each branch can deliver, since the root guards against a loss."],
 "Nodes combine branch values, each a child value less its branch cost: the drill's chance node is 160.0000 and its branch 105.0000. The root takes the largest, EMV 105.0000, best branch index 0.")

# ord 15
q(3, "A decision node picks one of its branches. What does a chance node on the EKPAN tree pick?",
 "None: it uses every branch, weighting each branch value by its probability.",
 ["The most likely branch, the dry hole at 0.500000, passed up unweighted.",
  "The best branch, as a decision node would, with its probability noted.",
  "Only the branches that are on the optimal path, which it weights by their probabilities rescaled to sum to 1."],
 "The drill outcome node uses all three: 0.350000 x 420.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000 = 160.0000. Only a decision node takes a maximum.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/beginner/ec4b_m01.json", label="ec4b_m01", expect_n=15)
finish()
