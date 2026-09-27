import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, advanced, module m05-numbers-to-distrust.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(1, "On the EKPAN lottery at a success probability of 0.35 the drill is worth 75.7500 and the farm-out 33.2500. What would make either decision module recommend the farm-out at these same payoffs and chances?",
 "Nothing in either module, since both maximise expected money and neither holds a utility function or a risk aversion setting.",
 ["Setting a risk tolerance below the drill's loss of 80.0000, which the rollback reads before comparing the two means.",
  "The drill's 0.650000 chance of losing money, since the engine demotes an action that loses more often than it wins.",
  "A higher discount rate on the drill's success payoff, because the rollback applies the rate typed on each terminal before weighting."],
 "The engine sees only the two means: 0.350000 x 365.0000 plus 0.650000 x -80.0000 is 75.7500. A preference for the farm-out belongs in words beside the tree and is never hidden in a payoff quietly lowered until the farm-out wins.")

# ord 2
q(3, "The EKPAN lottery's survey has an EVII of 24.8250. With the survey the drill is chosen only after a bright spot, so the joint chance of drilling a dry hole falls from 0.650000 to 0.162500. How much of that fall is priced in the 24.8250?",
 "None of it, because EVII is a difference of means and prices only the rise in expected money.",
 ["All of it, because the posterior after a bright spot is built from the dry-hole joint chance and so carries the reduction in risk inside it.",
  "The part that falls on the no bright spot reading, since the farm-out chosen there with probability 0.540000 never loses on the well.",
  "Most of it, since EVII is the EVPI of 52.0000 scaled down by how far the survey cuts the chance of drilling a dry hole."],
 "A risk averse buyer would pay more than 24.8250 for this survey, and the engine cannot say how much more. The 0.162500 is a joint chance; the posterior of a dry hole after a bright spot is 0.353261.")

# ord 3
q(0, "A small tree values Drill at 40.0000 less a cost of 10.0000 and Farm out at 30.0000. Listed Drill first the optimal path marks Drill; listed Farm out first it marks Farm out. What decides the mark?",
 "The listing order decides only which tied branch the optimal path marks; the engine reports the two as tied in either order.",
 ["Floating-point residue in the cost subtraction, which leaves one of the branches a few binary digits ahead depending on which is evaluated first.",
  "The branch with the lower cost, since the engine breaks an equal EMV in favour of the action that commits less money up front.",
  "The last branch evaluated, because a decision node overwrites its best choice whenever a later value is at least as large."],
 "Both orderings return an emv of 30.0000 with the tie reported, and only the mark follows the order in which somebody typed the branches. At the computed switch point 0.228571 on the EKPAN lottery the engine reports a tie as well; 40.0000 less 10.0000 is exactly 30.0000.")

# ord 4
q(2, "In the VOI Analyzer, Success at 25 percent pays 200, Dry hole at 75 percent pays -50, and the decision cost is 12.5. What does the insight say about the decision without new information, and why?",
 "That 'Drill Exploration Well' and 'Do Not Drill Exploration Well' both come to $0.00M, so it is indifferent between them, because acting is worth exactly 0.",
 ["That 'Drill Exploration Well' is the optimal decision, because acting is worth a small binary residue above 0 once the decision cost of 12.5 is subtracted.",
  "That drilling is optimal, because the Analyzer names the risky action whenever the net value is positive and the netVoi card reads 20.00.",
  "That drilling leads by 12.5, because the Analyzer compares its two actions on their payoffs alone and charges the decision cost of 12.5 only after it has chosen."],
 "0.25 x 200 plus 0.75 x -50 less 12.5 is exactly 0, and the insight names both actions. The gross voi of 25.00 is large because the prior decision is perfectly unsettled.")

# ord 5
q(0, "Reading a Decision Studio brief of the published equalEmvTie tree, where would a reviewer see that no single first move is being recommended?",
 "Recommended first move, which names A, B and C as coming to the same figure, and Decision advantage, which reads Indifferent at the precision shown.",
 ["Only Decision advantage, which reads 0.0000 because Next best alternative is also 30.0000, beside a first move of \"A\".",
  "Next best alternative, which reads 29.9990 for \"C\" and so shows that the runner-up sits only a hair below the branch the brief names as its choice.",
  "Optimal EMV, which is printed without decimals whenever two root branches tie, so that a reader can see at a glance that the value is shared."],
 "All three root values print as 30.00 on a card, C included at 29.9990, so the first-move row lists them together and the advantage row carries the word Indifferent where a margin would be.")

# ord 6
q(3, "On the Analyzer's default study the gross voi is 33.00. At a survey cost of 32.996 the netVoi card reads 0.00. What does the verdict sentence say?",
 "Since this rounds to zero, the information costs what it is worth, so acquiring it or not is indifferent on EMV grounds, because the verdict reads the card.",
 ["Since this is negative, the information costs more than the value it adds, because the verdict sets the cost against the EVPI card.",
  "Since this is positive, acquiring the information is financially advantageous, because the verdict tests the net value before it is rounded.",
  "No verdict at all, since the Analyzer drops the sentence whenever the net card rounds to zero and leaves the whole choice between buying and not buying to the reader."],
 "The net VOI is rounded once to the two-decimal card, half away from zero with a 1e-12 allowance, and the verdict reads that same value. At 32.990 the card reads 0.01 and the sentence says positive; at 33.010 it reads -0.01 and says negative.")

# ord 7
q(3, "Priced at 33.004, the default survey's net value card reads 0.00. What do the card and the verdict tell a reader?",
 "It sits at its gross value to the cent: 33 less 33.004 rounds to a 0.00 card, and the sentence beside it reads that same card as zero.",
 ["That the cost is a hair above the value, since the card prints -0.00 to keep the sign of the unrounded net value.",
  "That the survey cost was entered as a negative receipt, which the Analyzer marks with a sign on an otherwise zero card.",
  "That the consistency check found a small disagreement, which the Analyzer reports as a signed zero in place of withholding."],
 "33 less 33.004 is a small negative amount, and rounded half away from zero to two decimals it is 0.00; -0.00 is never printed, and the verdict reads the same rounded value. At 33.010 the card reads -0.01 beside the negative verdict.")

# ord 8
q(2, "A netVoi card reads 0.00 and the verdict beside it says the value rounds to zero. What does a careful reader report?",
 "That the survey is priced at its value, found by comparing the cost with the gross voi, since the cost that makes information neutral is the gross value, 33.00 on the default study.",
 ["That the survey is a positive investment, because a card of 0.00 is a rounded positive amount and the verdict only hides its sign.",
  "That the survey is worth buying, because a 0.00 card means the net value is at least zero before rounding.",
  "That the survey is worth buying at any cost below the evpi card of 63.00, since the ceiling bounds the price and the gross value only bounds the net."],
 "Costs of 32.996 and 33.004 both round to a 0.00 card with the rounds-to-zero sentence, and no real tender separates them. The neutral price is the gross value, 33.00 on the default study and 24.8250 on the EKPAN lottery's full survey.")

# ord 9
q(1, "A symmetric survey on the EKPAN lottery at accuracy 0.600000 moves the success chance after a \"reads dry\" result from 0.35 to 0.264151. Why is its EVII 0.0000?",
 "Because 0.264151 is still above the drill against farm-out switch of 0.228571, so both readings lead to Drill and no action changes.",
 ["Because an accuracy of 0.600000 is too close to a coin toss for the engine to run Bayes, so it reports the prior's value in place of a posterior.",
  "Because the success chance after \"reads success\", 0.446809, rises by more than the other reading falls, and the two changes cancel in value.",
  "Because EVII is floored at zero, and the small negative value this survey really has is clamped to 0.0000 for display."],
 "Weighting Drill's value at each posterior by the chance of each reading returns Drill's value at the prior, 75.7500. Beliefs moved and no decision did; the survey first changes an action at accuracy 0.645051.")

# ord 10
q(0, "The same symmetric survey on the EKPAN lottery is worth 0.7250 at accuracy 0.650000. What changed from accuracy 0.600000?",
 "A \"reads dry\" result now moves the success chance to 0.224771, below the switch of 0.228571, so that reading leads to the farm-out.",
 ["A \"reads success\" result now moves the success chance to 0.500000, which makes Drill worth more after that reading than at the prior.",
  "The survey became more accurate than the prior of 0.35, and information is worth something once its accuracy beats the prior chance.",
  "The EVPI of 52.0000 began to pass through to the survey, which receives a share of it in proportion to its accuracy above one half."],
 "The survey first changes an action at 0.645051, and just past it that single changed reading adds 0.7250. After \"reads success\" the action was already Drill, so a larger shift there adds nothing.")

# ord 11
q(3, "At accuracy 0.550000 the engine returns an EVII of -1.42e-14 for the symmetric survey on the EKPAN lottery. How should that be read?",
 "As 0.0000, floating-point residue from subtracting two equal sums, printed as zero below 1e-9.",
 ["As a small genuine loss, because a survey this weak misleads often enough to cost a sliver of expected money whenever it is bought.",
  "As the mark of inputs that contradict each other, which the Bayes engine reports as a negative value where the Analyzer would withhold one.",
  "As the tie rule at work, because both readings lead to Drill and the engine subtracts the branch listed second from the branch listed first."],
 "Information derived by Bayes can never be worth less than 0, and the Bayes engine derives its posteriors from likelihoods, so its inputs cannot contradict each other. Both readings lead to Drill, so the value is 0.0000.")

# ord 12
q(3, "The published dominantAction lottery has Always paying 100.0000 / 50.0000 and Never paying 10.0000 / 5.0000, with an evpi of 0.0000. Why is perfect information worthless there?",
 "Always is best in both outcomes, so knowing the outcome never changes the action, and evWithPerfect equals emvPrior at 65.0000.",
 ["The outcome is already certain, so nothing is left to learn and the value with perfect information matches the value at the prior.",
  "The signal's readings do not depend on the outcome, so every posterior stays at the prior and no action is ever able to move.",
  "Never loses nothing in either outcome, so a decision maker can always fall back on it and information has no downside left to remove."],
 "Perfect information takes the best action per outcome, and that is Always both times. The certainOutcome lottery reaches 0.0000 another way, with emvPrior and evWithPerfect both 260.0000, and uselessSignal is an EVII of 0.0000.")

# ord 13
q(2, "Published threeByThree has three readings and costs 12.0000; after \"Dim\" it recommends the farm-out, worth 15.3333. Why is its evii only 1.2000 against an evpi of 24.0000?",
 "It changes one action, on one reading, and is worth only what that single change adds, so its netEvii at 12.0000 is -10.8000.",
 ["Its three readings split the 24.0000 of perfect information between them, and the \"Dim\" reading carries the smallest share of it.",
  "Its evii is reported net of the survey cost, so 1.2000 is what is left once most of the 12.0000 price is paid.",
  "One of its readings is too unlikely to carry a posterior and is dropped, so only two readings contribute value."],
 "Bright and Flat both still lead to Drill alone, so the survey adds nothing on those readings. Its gross 1.2000 is a tenth of the 12.0000 price, and the information tree chooses No further information.")

# ord 14
q(0, "The EKPAN tree's success payoff is linked in the Decision Tree Builder to a Monte Carlo summary with mean 420, P90 185, P50 390 and P10 710 (P90 the low case), and the run is revalued afterwards. What does the tree show?",
 "105.0000 from the mean copied at the moment of linking, because only the mean enters and nothing re-reads the run until it is linked again.",
 ["The revalued run's mean, because the Builder re-reads a linked run every time the tree is rolled back so that the payoff stays current.",
  "A value between its P90 and P10 cases, because the rollback weights the three percentiles of a linked summary ahead of the chance node.",
  "37.7500 with the farm-out recommended, because a linked summary enters at its P90, the conservative case for an exploration payoff."],
 "A linked summary is a copy taken at link time. Read at its P90 of 185 the EKPAN tree would fall to 37.7500 and flip to the farm-out; at the mean it is identical to a plain 420.0000 payoff, and the spread is carried and never used.")

# ord 15
q(1, "The EKPAN lottery's survey typed into the VOI Analyzer gives a gross voi of 19.84, while the Bayes engine values the same survey at 24.8250. Which is correct?",
 "Both: 19.84 is the value when the only actions are the drill and \"Do Not\", and 24.8250 is the value with the farm-out available.",
 ["24.8250 only, since the Analyzer rounds the posteriors it is given to whole percents and loses the difference in that rounding before valuing them.",
  "19.84 only, because the Bayes engine values the survey before the drill cost of 55.0000 is charged and so overstates it.",
  "Neither, because a survey that changes the action after only one of its readings must be valued at its EVPI of 52.0000."],
 "The Analyzer offers exactly two actions; with Farm out removed the Bayes engine gives an evii of 19.8375, which is the 19.84. The Analyzer values one survey before one decision and has no place for a third action.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/advanced/ec4a_m05.json", label="ec4a_m05", expect_n=15)
finish()
