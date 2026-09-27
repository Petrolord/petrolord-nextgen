import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, advanced, module m04-refusals-and-silent-defaults.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(3, "A chance node named \"Three equal outcomes\" pays 30, 60 and 90, and each of its three branches is typed as 0.333333. What does the rollback engine return?",
 "An emv just under 60.0000, because the engine accepts the sum and weights the three payoffs by the thirds exactly as they were typed.",
 ["An emv of 60.0000, because a sum of 0.999999 sits exactly 1e-6 from 1 and the tolerance on a chance node is inclusive at its edge, so the node passes.",
  "An emv of 60.0000, because the 1e-12 allowance absorbs the binary residue and the engine then rescales the thirds to sum to 1.",
  "A refusal, `Chance branch probabilities sum to 0.999999, expected 1`, because three copies of 0.333333 land a hair more than 1e-6 from 1 in binary and the sum check carries no allowance for that."],
 "The sum test is |sum - 1| at most 1e-6 plus a 1e-12 allowance for binary representation, inclusive, so the node passes and is worth 0.333333 x (30 + 60 + 90) = 59.9999; accepted probabilities are used as typed and never rescaled. Typed as 0.333 each the sum is 0.999000 and the node is refused.")

# ord 2
q(0, "The published justInsideTolerance case states a success chance of 0.300000 and implies 0.305000. How does the implied-priors check read it, and why?",
 "Consistent true, because the delta, which is 0.0050000000000000044 in binary, is compared against 0.005 plus a 1e-12 representation allowance.",
 ["Consistent false, because in binary floating point the delta is 0.0050000000000000044, which is above the 0.005 threshold by 4.3e-18, so even an inclusive comparison turns it away.",
  "Consistent true, because the engine rounds every delta to six decimals, 5.000000e-3, before comparing it with the threshold.",
  "Consistent true, because the threshold is widened to 6.000000e-3 so that cases on the boundary stop flipping."],
 "Compared against 0.005 alone the case would read false. The allowance absorbs a 4.3e-18 overshoot and nothing of a size worth arguing about.")

# ord 3
q(3, "A reviewer argues that since the half percent check carries an allowance, an implied success chance of 0.306000 against a stated 0.3 ought to pass. What does the Analyzer do with published withheldPastHalfPercent?",
 "It withholds the value of information, because the allowance is 1e-12 and a delta of 6.000000e-3 is inconsistent with or without it.",
 ["It prints a gross voi of 35.10, because the allowance moved the inclusive boundary far enough out to take in a delta just past half a percent.",
  "It refuses the inputs with a message naming the sum in percent, because a delta above half a percent means the typed chances are not a distribution.",
  "It prints every card with a consistency warning beside them, since the check only annotates a value built on chances that disagree."],
 "The Analyzer still reports EMV without information 15.00 and EVPI 63.00. The gross voi of 35.10 these inputs give with nothing checking them is a number built on chances that cannot all be true.")

# ord 4
q(1, "One engine family holds two boundaries: a chance node's probabilities must sum to within 1e-6 of 1, and an implied chance must sit within 0.005 of the stated one. What happens exactly at each edge?",
 "Both edges hold, because each of the two comparisons adds the same 1e-12 allowance for binary representation error.",
 ["The implied-priors edge holds because of its 1e-12 allowance, while the sum edge has none, so thirds typed as 0.333333 are refused although their decimal gap equals the tolerance.",
  "Both edges fail, because binary rounding pushes a value sitting exactly on either threshold a hair past it and neither check makes any allowance for that.",
  "The sum edge holds because its message prints 0.999999, while the implied-priors edge fails at 0.305000 on 4.3e-18 of binary overshoot."],
 "The implied-priors delta of 0.305 less 0.3 overshoots 0.005 by 4.3e-18 in binary, and a 0.333333 sum misses 1 by a hair more than 1e-6; one 1e-12 allowance absorbs each, so neither edge flips.")

# ord 5
q(1, "Branch A pays 20 with its cost typed as \"abc\", and branch B pays 12 at no cost. What does the rollback return?",
 "A refusal naming branch A, because the engine checks that every cost reads as a number in the same way that it checks every payoff.",
 ["An emv of 20.0000 with A best and no message, because a cost that does not read as a number is charged as zero.",
  "An emv of 15.0000 with A best, because text typed on a cost is converted to the number the user most likely meant, which here is 5.",
  "An emv of 12.0000 with B best, because the engine drops a branch whose cost cannot be read and rolls back only what remains."],
 "The engine refuses the cost with a message naming branch A and its node: the cost is not a finite number (\"abc\") and must be a number of 0 or more. Only a cost left out of the tree reads as 0, which gives 20.0000 against the intended 15.0000 with no message.")

# ord 6
q(3, "On the decision where A pays 20 at a cost of 5 and B pays 12, three slips are made one at a time: A's cost typed as \"abc\", A's cost typed as -5, and A's payoff left empty. What does each slip do?",
 "Each stops the rollback with its own message naming the node, so none of them produces a value or a changed first move.",
 ["The cost typed as \"abc\" is charged as 0 and lifts A to 20.0000, while the other two slips are refused.",
  "The cost of -5 is read as money received and lifts A to 25.0000, while the other two slips are refused.",
  "The empty payoff is read as 0, so branch A becomes -5.0000 and B wins at 12.0000, while the two cost slips are refused."],
 "A cost that is not a finite number, a negative cost and a blank payoff are all refused by node label; the negative cost message says to enter a receipt as a payoff. Only a cost or payoff left out of the tree reads as 0.")

# ord 7
q(0, "Why is a cost typed as -5 on branch A, which pays 20, refused?",
 "A cost cannot be negative: the engine refuses it by branch and node and says to enter a receipt as a payoff, so money received is never read off a cost.",
 ["The engine flags the negative cost as a receipt in its output and values A at 25.0000 beside the note, which is where the refusal is shown.",
  "The engine charges an unreadable cost as zero and refuses only the magnitude it cannot place on the branch.",
  "A branch value is the child value plus its cost, so the engine refuses any cost that would lower a branch."],
 "The message names branch A and the negative cost (-5) and says a cost cannot be negative: enter a receipt as a payoff. A branch value is the child value less the cost, so a cost of 5 gives 15.0000.")

# ord 8
q(2, "In the Decision Tree Builder a user clears the probability box on the branch paying 10 of a two-branch chance node paying 10 and 30, and the branch paying 30 already reads 1. What happens?",
 "The cleared box stores 0, the sum is still 1 so the check passes, and the node returns 30.0000 with the cleared branch gone from the weighting.",
 ["The cleared box stores 0, the sum falls short of 1, and the node is refused with a message that prints the sum to six decimals.",
  "The cleared box keeps its last saved value until a new number is typed, so the node rolls back exactly as it did before the edit and the drawing keeps the old chance.",
  "The node returns 20.0000, because an empty probability is shared out equally with the other branch before the payoffs are weighted."],
 "A cleared probability usually surfaces as a sum that is not 1 and is refused; it passes only when the other branches already sum to 1. The engine gives the same 30.0000 for a probability typed as an empty string beside a 1, and 20.0000 comes from typing one probability as the text \"0.5\" beside 0.5.")

# ord 9
q(3, "The published refusal case puts a bad distribution at node \"cc\", two levels under the root, whose probabilities sum to 0.200000. What does the rollback return for the rest of the tree?",
 "Nothing: the message names node \"cc\", and there is no root EMV, no best branch and no value for the healthy branches.",
 ["The root EMV with the faulty chance node valued at zero, and a message beside it naming \"cc\" as the node that was skipped over.",
  "The root EMV with node \"cc\" rescaled to sum to 1, since 0.200000 is a proportion the engine can normalise.",
  "Values for every branch that does not pass through \"cc\", with the best branch chosen from among those that could be rolled back."],
 "`Chance branch probabilities sum to 0.200000, expected 1 (at node \"cc\")` is the whole answer. One bad node stops the tree, so the node label in the message is the only pointer to where the fault lives.")

# ord 10
q(1, "The Bayes calculation behind EVII checks the likelihoods of the EKPAN lottery's survey before it computes anything. Which numbers must sum to 1?",
 "Each outcome's likelihoods down its column across the signals, so the Success column reads 0.850000 for a bright spot and 0.150000 for none.",
 ["Each signal's likelihoods across the outcomes, so a bright spot's 0.850000 given Success and 0.250000 given a dry hole must together sum to 1.",
  "The chances of the signals themselves, 0.460000 for a bright spot and 0.540000 for none, which the engine checks before any posterior.",
  "The posteriors after each signal, 0.646739 and 0.353261 after a bright spot, since those are the numbers the action is chosen on."],
 "The survey passes because Success reads 0.850000 / 0.150000 and Dry hole 0.250000 / 0.750000. A Dry hole column summing to 1.200000 is refused with the outcome named; the signal chances and posteriors are derived and are never typed.")

# ord 11
q(0, "The EKPAN lottery is typed into the VOI Analyzer with Bright spot at 46.000000 percent and No bright spot at 64 percent. What does the Analyzer show?",
 "No cards at all, only the refusal `Indicator chances sum to 110 percent, expected 100`.",
 ["EMV without information 75.75 and EVPI 52.00, with the value of information withheld because the indicators contradict the stated prior.",
  "A refusal stating the indicator sum as a fraction of 1, the engine's internal scale for every chance it checks, with no percent in it.",
  "The cards for renormalised indicator chances, since the Analyzer rescales any indicator set that misses 100 before valuing the survey."],
 "Indicator chances that are not a distribution are refused before anything is computed, with the sum in percent. Withholding with 75.75 and 52.00 is the answer for chances that do sum to 100 but contradict the stated outcome chances.")

# ord 12
q(2, "IRRI types both indicators as 20 / 80 percent, and published indicatorChancesAboveHundred types indicator chances summing to 110 percent. How do the Analyzer's answers differ?",
 "IRRI is withheld and still reports EMV without information 15.00 and EVPI 63.00, while the 110 percent case is refused and shows no card.",
 ["Both are refused with a message naming the sum in percent, because each set of typed percents fails the check before any card is drawn.",
  "Both are withheld with 15.00 and 63.00 reported, because each describes chances that the stated outcome chances cannot support.",
  "IRRI is refused because its implied success chance of 0.200000 is not the stated 0.3, while the 110 percent case is withheld with two cards."],
 "A refusal says the numbers are not chances at all; a withholding says they are chances that cannot all be true together. EMV without information and EVPI depend only on the stated outcome chances, so 15.00 and 63.00 survive a withholding.")

# ord 13
q(2, "Weighted as typed with nothing checking them, which input the Analyzer refuses gives a gross voi that looks exactly like a genuine answer on its default study?",
 "indicatorChancesAboveHundred, whose 33.00 is the default study's own voi, given for indicator chances summing to 110 percent.",
 ["posteriorsAboveHundred, whose 69.00 sits close enough to the evpi card of 63.00 that nothing on the screen would mark it out as a problem.",
  "chanceOutsideRange, whose -15.00 reads as an ordinary survey priced above its worth and hides a gross value below the floor of zero.",
  "missingOutcomeChanceCountsAsZero, whose 41.00 is the default study's own EMV with information, so it looks familiar to anyone who ran the defaults."],
 "These are unguarded figures from engine calls. 69.00 is above the 63.00 ceiling and -15.00 is below zero, both impossible on sight; 33.00 is the default study's genuine voi and could not be caught by eye, while its EMV with information is 38.00.")

# ord 14
q(0, "Published posteriorsOffsetButPriorsAgree types outcome chances given Positive Seismic that sum to 110 percent, built so that the priors they imply equal the stated ones. Why does a reviewer who checks only the implied priors miss it?",
 "The implied-priors test passes, and only the check that each set of outcome chances sums to 100 catches it, which the Analyzer runs first and refuses on.",
 ["The implied-priors test is run on rounded posteriors, so an offset of 10 percent is absorbed inside the half percent tolerance before it can register at all.",
  "The reviewer's test is the right one, and the Analyzer passes the case too, since priors that agree prove every typed number is a chance.",
  "The implied-priors test fails on this case, but the Analyzer reports that failure as a withholding, so the reviewer takes the missing cards for a refusal."],
 "The refusal reads `Outcome chances given \"Positive Seismic\" sum to 110 percent, expected 100`. Weighted as typed with nothing checking them, the same inputs give a gross voi of 42.50 beside an evpi of 63.00, a plausible number built on percents that are not chances.")

# ord 15
q(3, "Thirds typed as 0.333 on \"Three equal outcomes\", paying 30, 60 and 90, are refused. A user repairs the node by nudging the branch paying 90 until the sum reads 1. What is wrong with that repair?",
 "The node passes but no longer says the outcomes are equally likely, so the EMV moves off 60.0000 by whatever the nudge put on that branch.",
 ["Nothing, because the tolerance of 1e-6 exists precisely so a user can close a rounding gap on whichever branch is most convenient to edit by hand.",
  "It is refused again, because the engine compares each branch with the others and requires equal chances on a node whose payoffs are evenly spaced.",
  "It moves the EMV only in the sixth decimal, which the rollback does not print at four places, so the result still reads 60.0000."],
 "The fix is to type every third to six places or more: 0.333333 passes at 59.9999, weighted as typed, and 0.3333333 sums to 1.000000 and rolls back to 60.0000. A nudge changes the chances unequally, which is a different tree that happens to pass the check.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/advanced/ec4a_m04.json", label="ec4a_m04", expect_n=15)
finish()
