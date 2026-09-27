import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, beginner, module m05-when-the-decision-changes.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(1, "Where do the EKPAN lottery's Drill and Farm out branches cross?",
 "At 80 / 350 = 0.228571 on the lottery, solved from Drill = 445 p - 80 and Farm out = 95 p.",
 ["At 0.250000 on the lottery, the first sweep row where Drill beats Farm out.",
  "At 80 / 445 = 0.179775 on the lottery, the probability where the drill branch's value falls to zero.",
  "At 0.200000 on the lottery, the last sweep row where Farm out is best."],
 "The EKPAN lottery's sweep rows sit 0.050000 apart, so they bracket the switch between 0.200000 and 0.250000 and cannot place it; 0.179775 is Drill against Walk away, where Farm out already wins at 95 p.")

# ord 2
q(3, "At success 0.228571 on the EKPAN lottery the engine prints Drill 21.7143 and Farm out 21.7143 and names Farm out, although Drill is listed first. Why Farm out?",
 "Drill less Farm out comes out at -7.11e-15 on the lottery, because 80 / 350 has no exact binary image.",
 ["Ties go to the branch that cannot lose money, and the lottery's farm-out never loses.",
  "The tie rule keeps the branch listed first, and the engine re-lists the lottery's actions by value, which puts Farm out first below the switch.",
  "The engine treats a probability typed to six decimals as rounded, and on the lottery it falls back to the farm-out when two values look level."],
 "A true tie would go to Drill, the first branch listed; the EKPAN lottery's choice at 0.228571 is rounding residue under a strictly greater test, so report the switch and no winner at it.")

# ord 3
q(0, "Swept, the published drillFarmOut tree reads Drill 12.0000 and Farm out 12.0000 at success 0.200000 and names Drill. How should that row be reported?",
 "The two are indifferent at 0.200000; Drill is named only because it is listed first, and the advantage is 0.0000.",
 ["Drilling is better from 0.200000 upward, since the engine names Drill at the first row where it is no longer behind.",
  "Farm out is best up to and including 0.200000, since a tie on a published tree is resolved toward the branch that cannot lose.",
  "Drill wins by a residue too small to print, the same way the EKPAN lottery's crossing at 0.228571 is decided."],
 "The drillFarmOut tie is exact to the last digit, so the tie rule decides it; the EKPAN lottery's crossing is decided by -7.11e-15 of residue instead, and neither result is a recommendation.")

# ord 4
q(2, "The published drillFarmOut sweep moves its success probability in the drill's chance node and the farm-out's chance node together. Why both at once?",
 "So each row judges Drill and Farm out on the same prospect; the engine links no chance node to another and would roll back a row that moved only one.",
 ["Because the engine refuses a tree whose two chance nodes carry different success probabilities, with the same message it gives a sum that is off.",
  "Because moving the drill's node alone would leave the farm-out's node summing to something other than 1 within 1e-6, so that tree would be refused.",
  "Because the farm-out's payoffs are scaled to the success probability, and a sweep has to rescale them at every row before the two branches are compared."],
 "Each row is a separate rollback with the payoffs held as typed, so at 0.200000 both branches are 12.0000 on one prospect. The engine checks each chance node's own sum and has no link between chance nodes, so a mismatched row would roll back without a warning.")

# ord 5
q(2, "What does the engine report to tell a reader that its recommended branch is tied with the runner-up?",
 "Nothing: it returns one best branch index whether the runner-up is behind by 25.0000 or by nothing.",
 ["A tie flag on the decision node, set when two branch values agree to four decimals.",
  "The runner-up's index beside the best, so a tie shows as two branches on the optimal path.",
  "A warning in place of a recommendation whenever two branch values agree within the same 1e-6 tolerance its chance nodes use."],
 "The rollback cannot tell an exact tie, like drillFarmOut's 12.0000 at 0.200000, from a residue of -7.11e-15 like the EKPAN lottery's at 0.228571; both come back as one best branch.")

# ord 6
q(0, "On the EKPAN lottery, moving success from 0.350000 to 0.400000 lifts the EMV from 75.7500 to 98.0000, and moving it from 0.200000 to 0.250000 lifts it from 19.0000 to 31.2500. Which move matters to a decision maker?",
 "The smaller move lower down on the lottery, which changes the first move from Farm out to Drill.",
 ["The larger move on the lottery, because the EMV rises by more and a decision is only as sensitive as the value it rests on.",
  "Neither, because the lottery's EMV rises steadily across the whole sweep, so the success probability never decides the first move.",
  "Both equally, because each row of the lottery's sweep is a separate rollback and every rollback returns a fresh recommendation."],
 "The biggest changes in value sit well inside the EKPAN lottery's Drill region, where the action never changes; the choice turns between 0.200000 and 0.250000, which is what a decision maker needs.")

# ord 7
q(3, "A reader raises the EKPAN lottery's success probability from 0.350000 to 0.400000 and leaves its dry hole at 0.650000. What does the engine do?",
 "Refuses the chance node, because its probabilities no longer sum to 1 within 1e-6.",
 ["Rescales both probabilities so they sum to 1, and rolls the lottery back at a success chance slightly below 0.400000.",
  "Rolls back at 0.400000 as typed and returns the lottery's Drill value of 98.0000, since only success enters the drill line.",
  "Takes the dry hole as 1 less the success chance, since a two-outcome lottery only needs the one probability to roll back."],
 "A probability cannot move alone: the EKPAN lottery's 98.0000 at 0.400000 is a rollback with the dry hole moved down to 0.600000 by the same amount, and a node that does not sum to 1 is refused.")

# ord 8
q(1, "The EKPAN tree at success 0.100000 reads Drill -6.2500, and the EKPAN lottery at 0.100000 reads Drill -35.5000. Why do the two disagree?",
 "The tree keeps its marginal find at 0.150000 and develops it, while the lottery folds that probability into its dry hole.",
 ["The tree's drill is read before its cost of 55.0000 and the lottery's after it, so they differ by that cost.",
  "The lottery's value comes off a sweep grid and the tree's from an exact rollback, so one is rounded.",
  "The tree's dry hole stays at 0.500000 as success moves, so its sum drifts from 1 and is let through."],
 "The EKPAN tree at 0.100000 carries a dry hole of 0.750000 and a marginal find worth 170.0000; the EKPAN lottery has two outcomes only, so a value from either model is not a point on the other's curve.")

# ord 9
q(0, "Why is walking away never the best action on the EKPAN lottery at a success probability above 0?",
 "The lottery's farm-out pays 0.0000 on a dry hole, as walking away does, and 95.0000 on success, so at 95 p it beats walking away wherever success is possible.",
 ["On the lottery Drill crosses Walk away at 0.179775 and Farm out at 0.228571, and the engine only acts on the higher of two crossings.",
  "Walking away is dropped from the lottery below 0.179775, where Drill is negative, so it is never compared with anything there.",
  "The tie rule keeps Farm out whenever it and Walk away are level, and on the lottery the two are level at every success probability."],
 "An action that equals another in one outcome and beats it in the other can never be worth less; the EKPAN lottery's Drill against Walk away crossing at 0.179775 lies where Farm out already wins.")

# ord 10
q(3, "At success 0.100000 on the EKPAN lottery a reader sees Drill at -35.5000 and concludes: walk away. What does that answer give up?",
 "The lottery's farm-out at 9.5000, the best of its three actions there.",
 ["Nothing, because a negative drill on the lottery means no action on that prospect is worth more than walking away.",
  "The lottery's drill at 9.0000, since the drill turns positive at that probability once the farm-out is taken off the table.",
  "The lottery's farm-out at 19.0000, since a farm-out is valued at the switch probability rather than at the probability stated."],
 "A negative drill says only that drilling is worse than nothing; the best action needs every branch compared at once, and at 0.100000 the EKPAN lottery's Farm out is 9.5000 against Walk away at 0.0000.")

# ord 11
q(1, "The farm-out terms are not agreed, so a tree for the EKPAN lottery is drawn with only Drill and Walk away. Where does its first move switch?",
 "At 0.179775, below the lottery's true switch of 0.228571, so across the whole farm-out region the tree chooses wrongly.",
 ["At 0.228571, since on the lottery the switch belongs to the prospect and not to whichever branches happen to be drawn.",
  "At 0.250000, the first row of the lottery's sweep where Drill beats everything the tree has left to compare it with.",
  "Nowhere, since without the farm-out the lottery's tree drills at every probability and the walk-away branch is never taken."],
 "The engine compares only the branches drawn: the EKPAN lottery's Drill = 445 p - 80 crosses Walk away at 80 / 445, so the tree walks away and then drills where Farm out would have won.")

# ord 12
q(2, "The EKPAN lottery's drill is worth 75.7500 and leaves 365.0000 with probability 0.350000 or -80.0000 with probability 0.650000. What does the rollback return about that loss?",
 "Nothing: an EMV, the best branch and the optimal path, with no chance of loss, worst case or range.",
 ["The lottery's chance of loss, 0.650000, beside the EMV, since every chance node reports the weight on its negative outcomes.",
  "A worst case of -80.0000 on the lottery's drill, since the optimal path lists the terminal payoffs that it passes through.",
  "A warning that the lottery's drill usually loses, its loss chance being above 0.500000."],
 "The EKPAN lottery's outcome table is derived by hand from the payoffs and the 55.0000 cost; neither 365.0000 nor -80.0000 is near 75.7500, and the engine reports neither.")

# ord 13
q(3, "A company cannot absorb a loss of 80.0000 on one well. On the EKPAN lottery at 0.350000, what does the engine recommend, and why?",
 "Drill at 75.7500 over the lottery's Farm out at 33.2500, because it maximises expected money with no utility function.",
 ["Farm out at 33.2500 on the lottery, because the engine prefers an action that never loses when the other loses with probability 0.650000.",
  "Drill on the lottery, but only once the module's risk aversion parameter is set to neutral.",
  "Farm out on the lottery, since a loss chance above 0.500000 makes the drill too risky to recommend."],
 "The rollback is risk neutral and no risk aversion setting exists in either module: a company may rationally take the EKPAN lottery's farm-out, and the tree still recommends the drill by its larger mean.")

# ord 14
q(0, "The EKPAN lottery's sweep pays Farm out 95.0000 on success at 0.050000 and at 0.250000 alike. What does that say about the sweep?",
 "The engine holds each payoff at its typed value while the lottery's probability moves, though no partner would offer those terms on a much weaker prospect.",
 ["The lottery's farm-out terms are fixed by contract, which is why the engine refuses a farm-out payoff that changes with the probability.",
  "The engine rescales the lottery's farm-out payoff at each row and prints only the stated value, so the column is the terms at 0.350000.",
  "The lottery's sweep is invalid below the switch, since a payoff held fixed across rows only means something where its action is chosen."],
 "A sweep is a list of separate rollbacks with the payoffs as typed; the EKPAN lottery's lines are straight only because 95.0000 and 420.0000 stay put as p moves.")

# ord 15
q(1, "On the EKPAN tree the success payoff is linked to a Monte Carlo NPV summary with mean 420, P90 185 (the low case) and P10 710. What does the tree read?",
 "105.0000, the same as a flat 420.0000 on the tree, because only the mean enters the rollback.",
 ["37.7500 on the tree, since a linked payoff enters at its P90, the low case.",
  "206.5000 on the tree, since a linked payoff enters at its P10, the high case, the value a prospect is promoted on.",
  "A value on the tree weighted across the summary's mean, P90 and P10, since the link stores all three for the rollback to use."],
 "The rollback is linear, so the mean is the only statistic it needs and the spread stays hidden; read at the P90 of 185 the EKPAN tree would fall to 37.7500 and flip to the farm-out.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/beginner/ec4b_m05.json", label="ec4b_m05", expect_n=15)
finish()
