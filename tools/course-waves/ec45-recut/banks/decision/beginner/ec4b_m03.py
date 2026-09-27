import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, beginner, module m03-decision-nodes.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(3, "On the EKPAN tree the Builder shows Optimal EMV 105.0000, Recommended first move Drill, Next best alternative 37.7500 and Decision advantage 67.2500. What does the advantage measure?",
 "The EMV given up by taking the farm-out over the drill, a difference of averages that says nothing about how often the drill does worse.",
 ["The money the drill makes over the farm-out on the one well drilled, since both moves face the same outcome.",
  "The drill node's value less the farm-out's, read off the drawing's node labels before the drill cost is charged.",
  "The drill's lead over the farm-out in only the outcomes where it does better, weighted across the 0.500000 of the probability that is not a dry hole."],
 "The advantage is 105.0000 less 37.7500. The drill still leaves -80.0000 half the time while the farm-out never loses, and no card shows that.")

# ord 2
q(1, "Inside the EKPAN tree's drill, a reader compares Develop at 260.0000 with Sell at 140.0000 and picks Develop. What has the comparison got wrong?",
 "It finds the right branch at a value 90.0000 too high, and that inflated value would then be weighted into the drill node.",
 ["It finds the wrong branch, since Sell at 140.0000 beats Develop once the develop cost of 90.0000 has been paid.",
  "Nothing, since a decision node compares payoffs, and only a chance node needs branch values net of their costs.",
  "Nothing, since a cost on a branch below a chance node moves up to the drill branch above it and is charged there with the 55.0000."],
 "A decision node only ever compares branch values: Develop is 260.0000 less 90.0000, which is 170.0000, against Sell's 140.0000. The drill chance node weights 170.0000.")

# ord 3
q(0, "On the EKPAN tree, the drill's dry hole reads onOptimalPath true while the farm-out's success reads false. Why?",
 "Every branch of a chance node on the path is on it, so drilling means facing the dry hole, while the farm-out's outcomes lie below a branch not taken.",
 ["The dry hole is the most likely outcome at 0.500000, and the farm-out's success at 95.0000 pays less than the root EMV.",
  "The engine flags the outcomes of whichever chance node has the larger own value, and the drill's node at 160.0000 beats the farm-out's 37.7500.",
  "The flags mark losses the owner has to insure against, and the farm-out's success is not a loss at any probability."],
 "Farm out lost at the root, 37.7500 against 105.0000, so nothing beneath it is reached. The dry hole at -25.0000 is on the path because the plan to drill has to answer it.")

# ord 4
q(2, "On the EKPAN tree, Sell under the marginal find reads onOptimalPath false. Which reading of that flag is right?",
 "Develop is better there, 170.0000 against 140.0000, and Sell would be off the path anyway had the owner not drilled.",
 ["Sell is a poor outcome, since a false flag marks a branch whose value falls below the root EMV of 105.0000.",
  "Sell can never be reached, because the marginal find itself sits off the optimal path beneath the drill's chance node and so is never faced.",
  "Sell loses money once the drill cost of 55.0000 is charged against its 140.0000 as well, and a false flag is how the engine records that loss."],
 "A false flag says a branch is not reached under the best strategy and says nothing about its quality: Sell's 140.0000 is above 105.0000 and still off the path because Develop wins at 170.0000.")

# ord 5
q(1, "Drill pays 40.0000 at a cost of 10.0000 and Farm out pays 30.0000. The same two branches are typed once with Drill first and once with Farm out first. What does the engine report?",
 "A tie both ways at EMV 30.0000, with Drill marked when Drill is listed first and Farm out marked when Farm out is.",
 ["Drill in both orders, since the engine compares children before their costs and Drill's 40.0000 is the larger.",
  "Farm out in both orders, since a branch with no cost wins an exact tie against a branch that carries one.",
  "A refusal in both orders, since two branches of exactly equal value leave the decision node without a best branch."],
 "Drill's branch value is 40.0000 less 10.0000, which is 30.0000, exactly Farm out's. The engine reports the two tied in either order, and the optimal path marks whichever is listed first.")

# ord 6
q(3, "At a success probability of 0.228571 the EKPAN lottery, the two-outcome model, prints Drill 21.7143 and Farm out 21.7143, and Drill less Farm out is -7.11e-15. What does the engine report?",
 "A tie: the residue is far inside the band of 1e-9 x max(1, |best|), and Drill, listed first, carries the action index.",
 ["Farm out as the best action, because it is larger by the residue and the engine compares values to the last binary digit.",
  "Drill as the single best action, because a branch that carries a cost wins an exact tie against one that carries none.",
  "Neither action, because the engine rounds values to four decimals before comparing and refuses two actions that print alike."],
 "Two values tie when they differ by at most 1e-9 x max(1, |best|). A residue of -7.11e-15 is far inside that, so the engine lists both actions as tied and only the mark goes to the first listed.")

# ord 7
q(0, "The published drillFarmOut tree, with its success probability swept, reads Drill 12.0000 and Farm out 12.0000 at 0.200000, and the optimal path marks Drill. Which reading is right?",
 "Drill is marked at 0.200000 only because it is listed first; Farm out leads at 0.150000, 9.0000 to -3.5000, and Drill leads at 0.250000, 27.5000 to 15.0000.",
 ["Drill is marked because its value is larger in the last binary digits, a residue the engine reads as a lead.",
  "Drill is marked because a branch that carries a cost wins an exact tie against one that pays out without any cost.",
  "Farm out should have been named, since the engine keeps the branch that led at the lower probability of 0.150000."],
 "This is an exact tie, 12.0000 against 12.0000: the engine reports both branches tied with indifferent true and marks Drill, the first listed. The EKPAN lottery's crossing at 0.228571 is a reported tie as well, its residue of -7.11e-15 inside the band.")

# ord 8
q(2, "Which plan states the EKPAN tree's optimal strategy?",
 "Drill; on a success take 420.0000; on a marginal find develop; on a dry hole accept -25.0000.",
 ["Drill; on a success take 420.0000; on a marginal find sell for 140.0000, the safer later choice; on a dry hole accept -25.0000.",
  "Drill and take 420.0000, since the optimal path is the single line from the root down to the best payoff.",
  "Drill; on a marginal find develop; on a dry hole farm out for 0.0000 and avoid the -25.0000."],
 "The path runs through one branch at each decision reached and every branch of each chance node on it, so it covers the dry hole at 0.500000. The farm-out is a root alternative and no move available after drilling.")

# ord 9
q(1, "The published allNegative case has branches A at -55.0000 and B at -52.0000. What does the Builder show, and what does it mean?",
 "B as the first move at Optimal EMV -52.0000 with an advantage of 3.0000, and nothing on the cards says both moves lose money.",
 ["No recommendation, since a decision node refuses a root whose best branch value is below zero.",
  "A walk-away at 0.0000, which the engine adds to any decision node whose branches all lose money.",
  "A at -55.0000, since a decision node takes the branch whose value is largest in size regardless of its sign, and 55 is larger than 52."],
 "The rule is the maximum over the branches drawn, and -52.0000 is larger than -55.0000. The advantage of 3.0000 is only the gap between two losses, and says nothing about whether either move should be taken.")

# ord 10
q(3, "If a walk-away branch at 0.0000 were added to the published allNegative tree, what would its root read, and why could the engine not reach that on its own?",
 "EMV 0.0000 with the walk-away recommended; the engine takes its maximum over the branches listed, and a branch not listed does not exist to it.",
 ["B at -52.0000 unchanged, since a walk-away branch only competes at a decision node that also has a chance node beneath it for the walk-away to protect against.",
  "The walk-away at 0.0000, which the engine had already chosen silently, because it floors every decision at zero.",
  "A refusal, since a walk-away at 0.0000 drawn beside branches that all lose money makes the decision node's values inconsistent with one another in sign."],
 "0.0000 beats -52.0000, so the root would take the walk-away. The engine never adds one and never flags a negative optimal EMV.")

# ord 11
q(0, "The published singleBranchDecision case has one branch, only, worth 7.0000. What does the rollback give, and what does it show?",
 "EMV 7.0000 with best branch index 0 and N/A on the Builder's next best and advantage cards, which is no evidence the branch is worth taking.",
 ["A refusal, since a decision node needs at least two branches before it has anything to compare, and the message names the node that has too few.",
  "EMV 7.0000 with an advantage of 7.0000 over the walk-away at 0.0000 that the Builder adds to a single branch.",
  "EMV 7.0000 with a decision advantage of 0.0000, since the single branch is counted a second time as its own next best alternative on the card."],
 "Only a node with no branches is refused. A decision with one branch is rolled back anyway to 7.0000, and the recommendation is simply the only branch drawn.")

# ord 12
q(2, "With EKPAN tree success cut to 0.100000 and the dry hole at 0.750000, the root reads Drill -6.2500, Farm out 14.0000 and Walk away 0.0000. What does it recommend once the walk-away branch is removed?",
 "Farm out at 14.0000, the same as before, because walking away was never the best branch.",
 ["Drill at -6.2500, since removing a branch reorders the list and the first branch listed then takes the root.",
  "EMV 0.0000 anyway, since with no walk-away drawn the engine floors a negative drill at zero on its own.",
  "A refusal, since the drill is negative and the tree no longer carries a branch at zero to fall back on."],
 "A walk-away that is not chosen changes nothing in the rollback. At 0.050000 the answer is the same, Farm out at 9.2500 with or without it.")

# ord 13
q(1, "Why can walking away never be the strictly best branch on the EKPAN tree, whatever the success probability?",
 "The farm-out has no cost and pays 95.0000, 30.0000 or 0.0000, none negative, so its value is never below 0.0000 and is above it whenever success or a marginal find has any chance.",
 ["The drill is positive at every success probability on the EKPAN tree, so a branch worth 0.0000 can never lead the root.",
  "Walking away ties the farm-out at 0.0000 and loses every tie, since it is listed last among the root's three branches.",
  "The engine never selects a branch paying exactly 0.0000, which it reads as a payoff missing from the tree."],
 "The drill is not always positive: at success 0.100000 it is -6.2500. The farm-out dominates the walk-away, so the walk-away is a record of the option and not a live contender.")

# ord 14
q(3, "Money already spent on a licence is drawn on a tree as a negative payoff on the walk-away branch. What does that do to the decision?",
 "It biases the choice against walking away, since money spent before the decision is spent on every branch alike and belongs to none of them alone.",
 ["It is right, since the walk-away is the only branch on which the licence money is lost with nothing coming back for it, so the whole loss belongs on that branch.",
  "It changes nothing, since the rollback recognises a sunk cost typed as a payoff and removes it before any maximum is taken at the root decision node.",
  "It is refused, since a walk-away branch must pay exactly 0.0000 for the engine to accept the decision node."],
 "A walk-away is worth 0.0000 relative to the money still to be decided. Charging sunk money to it alone makes every other branch look better by that amount, and the engine accepts the tree without comment.")

# ord 15
q(0, "A decision node deep in the EKPAN tree, the marginal find, is solved how, compared with the root?",
 "Exactly like the root: it takes its largest branch value, 170.0000 from Develop, and that value feeds the drill chance node at 0.150000.",
 ["After the root, since a decision node below a chance node is valued only once the root has chosen Drill.",
  "At the average of Develop's 170.0000 and Sell's 140.0000, since the owner cannot know which choice will follow.",
  "At Develop's payoff of 260.0000, since a later decision passes its best payoff up the tree and the develop cost of 90.0000 is charged at the root instead."],
 "The rollback runs from the leaves up, so the marginal find is solved before the drill node weights it. Its answer, 170.0000, enters 0.350000 x 420.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000 = 160.0000.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/beginner/ec4b_m03.json", label="ec4b_m03", expect_n=15)
finish()
