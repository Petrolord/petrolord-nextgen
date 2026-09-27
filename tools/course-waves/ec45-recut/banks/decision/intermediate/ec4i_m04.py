import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, intermediate, module m04-accuracy-and-value.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(2, "A symmetric survey of accuracy 0.800000 runs on the EKPAN lottery, where success has a prior of 0.350000. How often does it read success?",
 "0.410000, from successes read correctly plus dry holes misread: 0.350000 x 0.800000 + 0.650000 x 0.200000.",
 ["0.800000, because a survey of that accuracy says success on that share of the wells it looks at.",
  "0.350000, since a reading can only turn up as often as the outcome it reports, whatever the accuracy.",
  "0.682927, the chance of success once the survey has read success, which is the same event seen from the reading."],
 "Dry holes are common, so the 0.200000 of them that misread push the success reading above success itself, 0.410000 against 0.350000.")

# ord 2
q(0, "On the EKPAN lottery a symmetric survey of accuracy 0.800000 reads success. What is the chance the well succeeds?",
 "0.682927, the joint 0.350000 x 0.800000 divided by the chance of the reading, 0.410000.",
 ["0.800000, because the survey is right that often and it has just said success.",
  "0.410000, the chance of a success reading, which is what the survey reports.",
  "0.118644, since a survey that reads success over a common dry hole is usually misreading."],
 "Reading accuracy as a posterior drops the prior; the prior of 0.350000 still weighs in, which is why the posterior sits below the accuracy. 0.118644 is the posterior after a dry reading.")

# ord 3
q(3, "At accuracy 0.600000 a dry reading on the EKPAN lottery moves the success probability from 0.350000 to 0.264151, and the table's evii is 0.0000. Why is a real change of belief worth nothing?",
 "Both readings still lead to Drill, since 0.264151 stays above the switch at 0.228571, so the weighted value with information is Drill at the prior, 75.7500.",
 ["The survey is still a coin at that accuracy, so neither reading tells the engine anything about the rock and both posteriors stay exactly where the prior put them.",
  "The survey has a small positive gross value that falls short of the survey cost of 8.0000, and the table prints any value that does not pay for itself as a net zero.",
  "The engine computes a negative value for a survey that changes nothing and clamps it at zero, because information cannot be reported as a loss."],
 "Drill is a straight line in p and the posteriors weighted by their reading chances return the prior, so the value with information equals the emvPrior of 75.7500. A coin is accuracy 0.500000, where both posteriors are 0.350000.")

# ord 4
q(1, "At accuracy 0.550000 the engine returns an evii of -1.42e-14 on the EKPAN lottery. What is that number?",
 "Floating-point residue from subtracting two equal sums, which the table prints as 0.0000.",
 ["A genuine small loss, because at that accuracy a misleading reading occasionally sends the company to the wrong action and costs it money on average.",
  "A negative value that escaped the clamp meant to hold information at zero, so the engine is reporting a defect in its own floor.",
  "A flag meaning the likelihood columns failed the 1e-6 tolerance, returned in place of a refusal message."],
 "Both readings lead to Drill, so the value with information and the emvPrior are the same 75.7500 computed two ways. Information derived by Bayes is never worth less than 0; the table prints residue below 1e-9 as 0.0000.")

# ord 5
q(1, "A symmetric survey on the EKPAN lottery first changes an action at accuracy 0.645051. How does its value behave as accuracy passes that point?",
 "It starts from zero with no jump, because at the flip Drill and Farm out are equal at the dry reading's posterior, and it reads 0.7250 at 0.650000.",
 ["It jumps straight to 0.7250, the farm-out value the survey gains the moment a dry reading switches the action.",
  "It began rising at 0.500000, where the posteriors first move away from the prior, and 0.645051 is only where the rise becomes visible at four decimals.",
  "It starts at 0.650000, where a success reading gives a posterior of 0.500000 and the survey becomes worth buying."],
 "Switching gains nothing at the exact flip and the gain grows as the dry posterior falls further, 0.7250 at 0.650000 and 8.0500 at 0.700000. Below 0.645051 the value is exactly 0.")

# ord 6
q(3, "Why can a success reading from a symmetric survey on the EKPAN lottery never change the action?",
 "It only pushes success above the prior of 0.350000, which already chooses Drill.",
 ["It arrives less often than a dry reading, so its weight in the value with information is too small to move the choice.",
  "The Farm out line, 95 p, rises faster than Drill above the prior, so a higher success probability favours the farm-out anyway.",
  "A symmetric survey reads success and dry with the same accuracy, so only the reading with the lower prior can carry information."],
 "Drill is 445 p - 80 and Farm out 95 p, crossing at 0.228571. Only a dry reading can change the action, once it pushes success under that switch.")

# ord 7
q(0, "The EKPAN lottery's survey costs 8.0000. Across the symmetric rows at accuracies 0.650000 and 0.700000, which pays for itself?",
 "Only 0.700000: 0.650000 changes a choice and is worth 0.7250 gross, far short of the cost, while 8.0500 at 0.700000 just clears it.",
 ["Both, because each one changes the action after a dry reading, and a survey that changes a choice has already shown it is worth buying at any price.",
  "Neither, since the value has to reach the EVPI of 52.0000 before a survey is worth its cost.",
  "Only 0.650000, because the value of a survey is largest where it first changes the decision and falls away as accuracy rises beyond it."],
 "Changing a choice makes the gross value positive; it does not make it larger than the price. The margin at 0.700000 is thin, 8.0500 against 8.0000.")

# ord 8
q(2, "From accuracy 0.650000 upward the symmetric survey on the EKPAN lottery is worth 0.7250, 8.0500, 15.3750 and so on, rising by the same step each 0.050000. Why equal steps?",
 "The actions are fixed across those rows, Drill after a success reading and Farm out after a dry one, so the value is four joint terms each a straight line in accuracy.",
 ["The posteriors rise in equal steps with accuracy, so the Drill value after a success reading grows by the same amount each row.",
  "The evii is a fixed fraction of the EVPI of 52.0000, and that fraction grows in proportion to accuracy.",
  "The engine interpolates between the switch accuracy and a perfect reading and skips Bayes on each row."],
 "The terms are 0.350000 x a x 365.0000, 0.650000 x (1 less a) x -80.0000 and 0.350000 x (1 less a) x 95.0000. The posteriors are not linear: 0.556818, 0.617647, 0.682927.")

# ord 9
q(3, "Accuracy 0.750000 is halfway from a coin to a perfect survey. On the EKPAN lottery, what is it worth?",
 "15.3750, well under half the EVPI, because the stretch up to 0.645051 buys nothing.",
 ["Half the EVPI of 52.0000, because value is proportional to accuracy between a coin, worth nothing, and a perfect survey, worth the EVPI.",
  "30.0250, since the value line runs straight from the coin at 0.500000 up to the EVPI at 1.000000 and passes through the midpoint above half.",
  "22.7000, since the symmetric survey is worth the same share of the EVPI as its success reading's posterior."],
 "The line is straight only from the flip at 0.645051; before that the value is 0.0000. 30.0250 and 22.7000 belong to accuracies 0.850000 and 0.800000.")

# ord 10
q(0, "A survey on the EKPAN lottery is sold as perfect, but its success reading arrives with chance 0.410000. What does that chance show?",
 "It cannot be perfect: a perfect reading arrives exactly as often as success, 0.350000, so some of these readings are wrong.",
 ["It is perfect only if its success posterior reaches 1.000000, which the reading chance alone can neither confirm nor rule out on any lottery.",
  "Nothing about perfection, because a perfect survey reads success with chance 0.500000 so that it stays unbiased across both outcomes.",
  "It is perfect, since a reading that arrives more often than success simply catches every success and some extra."],
 "At accuracy 1.000000 the success reading's chance is 0.350000, the prior, and the posteriors are 1.000000 and 0.000000; 0.410000 is accuracy 0.800000.")

# ord 11
q(2, "On the EKPAN lottery, how do a symmetric survey at accuracy 0.500000 and one at 0.600000 differ, given that both are worth 0.0000?",
 "The first is useless, leaving both posteriors at 0.350000; the second moves success to 0.446809 or 0.264151 and is worthless only because Drill follows both readings.",
 ["They do not differ, because a survey worth 0.0000 cannot move belief and both leave the success probability at the prior of 0.350000.",
  "The first is worthless because it is cheap and the second useless because it is expensive, since value is judged after the cost of 8.0000.",
  "The second is worth a small amount hidden by rounding, because any movement of the posteriors adds value that the four decimal print suppresses."],
 "A useless signal cannot move belief; a worthless one moves belief and changes nothing. At 0.600000 the dry posterior stays above the switch 0.228571.")

# ord 12
q(1, "The published dominantAction lottery has emvPrior 65.0000 and evWithPerfect 65.0000. What can the most accurate survey be worth on it?",
 "0.0000, because its evpi is 0.0000 and no survey can be worth more than perfect information.",
 ["Up to 65.0000, the emvPrior, which caps any value the survey can add to the decision.",
  "0.0000 at low accuracy, then something once a reading is accurate enough to change which action is chosen.",
  "65.0000 for a perfect survey, since knowing the outcome first is worth evWithPerfect on any lottery."],
 "One action is best whatever happens, so evpi is 65.0000 less 65.0000 = 0.0000, and 0 <= evii <= evpi forces every signal to 0.0000.")

# ord 13
q(0, "An analyst types a survey on the EKPAN lottery whose likelihoods over Success are 0.850000 and 0.050000. What does the engine do?",
 "It refuses, with a message naming the column and its sum: \"Likelihoods P(signal | \"Success\") sum to 0.900000, expected 1\".",
 ["It rescales the column to sum to 1 and values the survey as if the analyst had typed it correctly, without saying that it has done so.",
  "It treats 0.850000 as the accuracy of a symmetric survey and ignores the second entry.",
  "It values the survey anyway and reports an evii above the EVPI of 52.0000 as a warning sign."],
 "The engine takes likelihood columns and insists each outcome's column sums to 1; accuracy is only shorthand for one pair of them. It never repairs a column.")

# ord 14
q(3, "The published accuracySweep_0p7 case returns an evii of 6.5000, while the EKPAN lottery's symmetric survey at the same accuracy 0.700000 is worth 8.0500. Why do they differ?",
 "They run different lotteries: the drillFarmOut prospect at a prior of 0.300000, with an EVPI of 35.0000.",
 ["One of them has had the EKPAN lottery's survey cost of 8.0000 taken off, which accounts for the gap between two otherwise identical runs.",
  "The published case uses an asymmetric survey at that accuracy, so it is right about dry holes less often than about successes.",
  "The golden was written at a coarser rounding than the engine returns, so the two agree before rounding and differ after."],
 "Mixing a published case's inputs with the EKPAN lottery is the mistake. Both lotteries have the same shape, nothing at a coin and the EVPI at a perfect reading: 35.0000 on the prospect, 52.0000 on the EKPAN lottery.")

# ord 15
q(2, "The CSEM survey on the EKPAN lottery shows a bright spot over 0.850000 of successes and 0.250000 of dry holes. A reader books it as a symmetric survey of accuracy 0.850000, worth 30.0250. What is wrong?",
 "It is not symmetric: it is right about a dry hole only 0.750000 of the time, and it is worth 24.8250, between the symmetric rows at 0.800000 and 0.850000.",
 ["Nothing, because accuracy is the chance of a correct bright spot over a success, and that is 0.850000.",
  "It should be booked at its weaker side, accuracy 0.750000, worth 15.3750, since a survey is only as good as its worst reading.",
  "It should be booked at the average of its two sides, accuracy 0.800000, worth 22.7000, because symmetry is a mean of both columns."],
 "Only the engine's Bayes run on the two actual columns values it: 24.8250, above 22.7000 and below 30.0250.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/intermediate/ec4i_m04.json", label="ec4i_m04", expect_n=15)
finish()
