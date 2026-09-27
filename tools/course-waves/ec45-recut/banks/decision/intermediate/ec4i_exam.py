import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, intermediate, final exam.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(0, "An analyst values perfect information on the EKPAN lottery at its 0.350000 prior by repricing the prospect as a certain success, 365.0000 million USD after the drill cost. What is the EVPI, and where did the analyst go wrong?",
 "52.0000: the priors stay put, the best value per outcome weights to 127.7500, and EVPI is that less the 75.7500 already available.",
 ["365.0000, since perfect information turns the prospect into a known success and every well it recommends is drilled into a success.",
  "127.7500, since the value of deciding with the outcome known is itself the worth of the information that makes the deciding possible.",
  "61.7143, since the EVPI of a two outcome lottery is always read at the switch where Drill and Farm out are worth the same."],
 "Perfect information changes the action, never how often each outcome arrives: the EKPAN lottery is still dry 0.650000 of the time. Read as regret, 0.650000 x 80.0000 = 52.0000.")

# ord 2
q(1, "Sampling the EKPAN lottery at round probabilities gives an EVPI of 54.0000 at 0.200000 and 60.0000 at 0.250000, so a reader puts the peak at 0.250000. Where is the peak, and what locates it?",
 "At 0.228571, where Drill and Farm out are both worth 21.7143 and EVPI reaches 61.7143, because the prior choice is least settled there.",
 ["At 0.500000, where Success and Dry hole are equally likely and the outcome is hardest to predict, so knowing it in advance is worth the most.",
  "At 0.250000 as sampled, because EVPI runs straight between tabulated rows and the largest sampled row therefore holds the largest value.",
  "At 0.179775, where Drill first beats walking away, since below it there is no drilling decision left for perfect information to correct."],
 "Left of 0.228571 perfect information corrects Farm out on a success; right of it, Drill on a dry hole. The two lines meet at the switch, and at 0.500000 EVPI is only 40.0000.")

# ord 3
q(3, "The published dominantAction lottery returns emvPrior 65.0000 and evWithPerfect 65.0000. A vendor offers it a survey of accuracy 1.000000. What is that survey worth before its price?",
 "0.0000, because no survey can be worth more than an EVPI of 0.0000, and one action is already best in every outcome.",
 ["65.0000, since a survey that never misreads hands over the whole value of deciding with the outcome known in advance.",
  "Its full EVPI, which is positive here because Always swings from 100.0000 to 50.0000 and a perfect survey says which one arrives.",
  "Some amount between 0.0000 and 65.0000 set by the likelihoods, since every informative survey moves the posteriors and so earns value."],
 "0 <= evii <= evpi. Always pays 100.0000 or 50.0000 against Never's 10.0000 or 5.0000, so knowing the outcome changes no action and a perfect reading adds nothing.")

# ord 4
q(2, "As the CSEM survey's price on the EKPAN lottery is swept from 0.0000 to 32.0000, a planner expects a dearer survey to show bright spots less readily. What does the sweep do to the chance of a bright spot and to the success posterior after one?",
 "Nothing: they stay 0.460000 and 0.646739, since the price is paid before any reading and only the acquire branch moves.",
 ["Both fall as the price rises, because the tree weights each reading by its net value and a dearer survey leaves less value on the readings.",
  "The chance of a bright spot holds at 0.460000 while the posterior slides toward the prior 0.350000, since a costlier survey needs stronger evidence.",
  "Both reset to the prior 0.350000 at 28.0000, where the root takes No further information and the readings stop being weighed at all."],
 "pSignal and the posteriors come from the prior and the likelihoods alone. The gross value stays 24.8250 in every row; only the acquire branch and netEvii fall with the price.")

# ord 5
q(1, "Working Bayes by hand on the EKPAN lottery, a student divides the joint chance 0.297500 by 0.350000 and lands back on 0.850000. What should the divisor have been?",
 "The chance of a bright spot, 0.460000, which gives a success posterior of 0.646739.",
 ["The chance of a dry hole, 0.650000, since a posterior sets a success against the outcome it competes with on the same prospect.",
  "Nothing at all, since the joint 0.297500 is already the chance of success once a bright spot has been seen on the section.",
  "The sum of the Bright spot row of likelihoods, since that row gathers every way the same reading can appear across the outcomes."],
 "Dividing a joint by the prior returns the likelihood it came from. 0.297500 / 0.460000 = 0.646739, and 0.353261 of bright spots are still dry holes.")

# ord 6
q(2, "A team argues the CSEM survey makes the EKPAN lottery more likely to succeed, because a bright spot lifts success to 0.646739. Averaged over both readings, what happens to the success chance, and where does the survey's value come from?",
 "It averages back to 0.350000, since 0.460000 x 0.646739 plus 0.540000 x 0.097222 returns the prior; value comes only from fitting the action to the reading.",
 ["It rises, since a hit rate of 0.850000 exceeds a false alarm rate of 0.250000, and the survey's value is that lift in success priced at the Drill payoff.",
  "It falls, because no bright spot is the commoner reading at 0.540000, and the survey's value is the share of dry holes it leaves the company better informed about.",
  "It rises to 0.646739 across the programme, since a company that drills only after a bright spot faces those odds on every well it drills."],
 "A survey moves belief up on one reading and down on the other and nowhere on average. It earns money only where a reading changes what is done.")

# ord 7
q(0, "Under No bright spot in the EKPAN lottery's information tree, the drill chance node reads 18.2639 and the farm-out node 9.2361. Which action is on the optimal path under that reading?",
 "Farm out at 9.2361, because the Drill branch is 18.2639 less its 55.0000 cost, -36.7361, and every branch cost comes off before the maximum.",
 ["Drill, since 18.2639 is the larger node and a decision takes the maximum over the values of the nodes it leads to.",
  "Walk away, since at a posterior of 0.097222 drilling loses money and walking away is the action that avoids any loss.",
  "Drill, because the 55.0000 cost was settled at the root with the survey and is not charged again under a reading."],
 "A node's value sits before the cost on the branch into it. Farm out cannot lose money, so it also beats Walk away's 0.0000.")

# ord 8
q(3, "A hand-built information tree for the EKPAN lottery carries 0.350000 and 0.650000 on the outcome branches under both readings. What does that do to the value of acquiring the survey?",
 "Every reading then chooses Drill at 75.7500, so the survey adds nothing and the acquire branch is worse than doing without by its cost.",
 ["Nothing, because the reading chances 0.460000 and 0.540000 already carry the survey, so the outcome branches only ever need the priors and 92.5750 survives.",
  "It overstates the acquisition, since the prior of 0.350000 is above the no-bright-spot posterior of 0.097222 and flatters drilling on that reading.",
  "It leaves the tree needing the likelihoods 0.850000 and 0.250000 on those branches in place of either the prior or any posterior."],
 "Under a reading the outcome branches must carry that reading's posteriors, 0.646739 and 0.353261 after a bright spot. With the prior everywhere the reading node returns 75.7500 and the price is pure loss.")

# ord 9
q(2, "Before the EC4-0 repair the Analyzer printed a gross value of information of -15.00 on IRRI. Why is a negative value, on its own, evidence of broken inputs?",
 "Whoever holds a survey can ignore it and take the prior action, so information derived by Bayes is never worth less than 0.",
 ["Because the survey cost of 10.0000 had been subtracted from it, and a gross value by definition carries no cost inside it at all.",
  "Because IRRI's EVPI is 63.00, and a value below zero is admissible only on a survey that never misreads the outcome it reports.",
  "It is not, since a survey that misleads more often than it informs has a negative value, which the repair now hides from view."],
 "uselessSignal sits on that floor at 0.0000. IRRI's typed indicators imply success of 0.200000 against 0.300000 stated, and the repaired Analyzer withholds instead.")

# ord 10
q(0, "A contractor quotes 40.0000 for the CSEM survey on the EKPAN lottery, pointing out that the price is still under the EVPI of 52.0000. What is the most the survey is worth to this decision?",
 "24.8250, its gross value, where the acquire branch falls to the no-information branch at 75.7500.",
 ["52.0000, since EVPI is the ceiling on any survey, so every quote below it leaves some value with the buyer after payment.",
  "100.5750, the value of deciding after a reading, since any price short of it still leaves the acquire branch above zero.",
  "16.8250, the net value at a price of 8.0000, since a survey is worth what remains after it has been paid for."],
 "EVPI caps a survey that never misreads, and this one lights up over 0.250000 of dry holes. At 40.0000 the root would choose No further information.")

# ord 11
q(3, "Two engine choices on the EKPAN lottery sit at points of indifference: Farm out named at the success probability 0.228571, and Acquire CSEM survey named at a price of 24.8250. What decides each name?",
 "Binary residue decides the first, since Drill less Farm out is -7.11e-15; the tie rule decides the second, where both branches are exactly 75.7500.",
 ["The tie rule decides both, since in each case the engine keeps whichever branch was listed first when two values are equal.",
  "Binary residue decides both, since 24.8250 printed to four decimals hides a last-digit gap between the two root branches as well.",
  "Neither is a tie: Farm out is worth more at 0.228571 by the printed precision, and at 24.8250 acquiring keeps a positive net value."],
 "80 / 350 has no exact binary image, so the choice at the switch is rounding. 100.5750 less 24.8250 is exactly 75.7500, and at an exact tie the first branch listed, the acquisition, is kept.")

# ord 12
q(1, "At a survey cost of 32.0000 the EKPAN lottery's information tree root reads 75.7500, and a reviewer reports the survey as worth 75.7500. What are its gross and net values at that price?",
 "Gross 24.8250 and net -7.1750; the 75.7500 is the no-information branch, which no price touches.",
 ["Gross 68.5750 and net -7.1750, since the acquire branch at that cost is the survey's gross value and it falls one for one with the price.",
  "Gross and net both -7.1750, because a gross value is recomputed at each quoted price and so falls in step with every rise in the cost.",
  "Gross 52.0000 and net 20.0000, since a survey is valued at its EVPI ceiling and the quoted price is then taken off that ceiling."],
 "Nothing inside the survey branch responds to the price: pSignal stays 0.460000 and the gross value 24.8250. The root never falls below 75.7500 because declining is always available.")

# ord 13
q(1, "At a survey cost of 20.0000 the EKPAN lottery's information tree acquires with a net value of 4.8250, while the same lottery and survey typed into the Analyzer give a verdict against buying. Which is right for the lottery as described, and why do they part?",
 "The tree: the Analyzer can only walk away after no bright spot, so its gross value is 19.8375, short of the cost.",
 ["The Analyzer, because its consistency check caught typed posteriors that the tree engine accepts without question from the likelihoods it is given.",
  "The Analyzer, since its EMV with Information card is after the survey cost while the tree's evWithInfo of 100.5750 counts the price twice.",
  "Both, since they answer at different precision, the Analyzer's cards rounding to two decimals where the tree carries four of them."],
 "With the farm-out, 0.460000 x 207.7989 + 0.540000 x 9.2361 = 100.5750; without it the second term is 0.0000 and the sum 95.5875. Both tools agree on emvPrior 75.7500 and EVPI 52.0000.")

# ord 14
q(2, "A symmetric survey of accuracy 0.600000 on the EKPAN lottery drops the success chance to 0.264151 after a dry reading. What is it worth, and what would make it worth anything?",
 "0.0000; a dry reading has to carry success under the 0.228571 switch so that Farm out replaces Drill, which first happens at accuracy 0.645051.",
 ["A positive amount in proportion to the move from 0.350000 to 0.264151, since a change of belief is the thing a survey is bought to deliver.",
  "8.0500, the value the dial reaches as soon as a dry reading lowers the success chance to any point under the prior of 0.350000.",
  "0.7250, the first step on the accuracy dial, since every symmetric survey more accurate than a coin buys at least some value."],
 "At 0.600000 both readings still lead to Drill, and Drill is a straight line in p, so the weighted posteriors return 75.7500. Movement that does not cross 0.228571 buys nothing.")

# ord 15
q(3, "A symmetric survey of the EKPAN lottery is offered at a cost of 8.0000. Of the tabulated accuracies, which is the lowest at which buying it is justified on EMV grounds?",
 "0.700000, where the gross value 8.0500 first exceeds the cost.",
 ["0.645051, since the survey begins to change the action there and a changed action is the thing the price is paid for.",
  "0.650000, the first tabulated row with a positive gross value, 0.7250, since any positive gross value justifies a purchase.",
  "0.850000, the accuracy that matches the CSEM survey's hit rate, below which a symmetric survey cannot compete with that one."],
 "Net is gross less cost: 0.7250 less 8.0000 is negative and 8.0500 less 8.0000 is positive. Changing a choice is necessary for value and not sufficient for a purchase.")

# ord 16
q(0, "Midway along the dial between a coin and a perfect reading, a 0.750000 symmetric survey earns the EKPAN lottery 15.3750 against an EVPI of 52.0000. What explains the shortfall from half?",
 "Value is zero up to 0.645051 and only then climbs in equal steps to 52.0000, so the halfway accuracy has had little of the climb.",
 ["Because EVPI falls as accuracy rises, so halfway along the dial the ceiling is already lower than 52.0000.",
  "Because value grows with the square of accuracy, which leaves the halfway point with about a quarter of the EVPI.",
  "Because the value at 0.750000 is net of an 8.0000 survey cost that the EVPI of 52.0000 does not carry."],
 "EVPI is 52.0000 on every row. The steps 0.7250, 8.0500, 15.3750 are equal because the action after each reading is fixed across those accuracies.")

# ord 17
q(3, "Above the flip at 0.645051 the EKPAN lottery's symmetric-survey values climb on one straight line. Extended back to accuracy 0.600000 that line would go negative. What does the engine return at 0.600000, and why?",
 "0.0000: both readings keep Drill there, so the line no longer describes the policy and value rests on the Bayes floor.",
 ["A negative value on the same line, since the rows climb in equal steps and equal steps run on both sides of 0.645051.",
  "A refusal, because below the flip the likelihood columns of a symmetric survey can no longer sum to 1 at the accuracy asked for.",
  "The residue -1.42e-14 at every accuracy under the flip, which the engine returns as the value of a survey that changes nothing."],
 "The line assumes Drill after a success reading and Farm out after a dry one. At 0.600000 the weighted Drill values return 75.7500, and information by Bayes is never worth less than 0.")

# ord 18
q(1, "The published uselessSignal case and the EKPAN lottery's symmetric survey at accuracy 0.600000 are both worth 0.0000. What separates the two zeros?",
 "uselessSignal leaves its posteriors at the priors 0.300000 and 0.700000; the EKPAN lottery's survey moves success to 0.446809 or 0.264151 and still leaves Drill after both.",
 ["Nothing separates them, since a zero value of information means that the readings carry no information about the outcome in either case.",
  "uselessSignal is worth nothing because its prospect's EVPI is 0.0000, while the EKPAN lottery's survey is worth nothing because it costs 8.0000.",
  "The EKPAN lottery's zero is float residue of -1.42e-14 at every accuracy under 0.645051, while the uselessSignal zero is an exact one."],
 "A useless signal cannot move belief; a worthless one moves it without changing a choice. uselessSignal's prospect has an EVPI of 35.0000, so its zero belongs to the signal.")

# ord 19
q(0, "perfectSignal's readings leave posteriors of 1.000000 and 0.000000 and an evWithInfo of 78.0000. Which published number must its evii equal?",
 "The published prospect's evpi of 35.0000, since a signal that never misreads turns Bayes into the perfect information table.",
 ["63.0000, the evpi of voiDefaultLottery, since that lottery also reaches an evWithPerfect of 78.0000 and shares the ceiling.",
  "78.0000 itself, because with certain posteriors the value of deciding with the signal is the value of the signal.",
  "12.5000, the evii of seismicBayes, because a perfect signal on the same prospect cannot outdo its best real survey."],
 "evWithInfo less evii is 43.0000, the prospect's emvPrior, so evii is 35.0000. voiDefaultLottery reaches 78.0000 from a baseline of 15.0000, a different decision.")

# ord 20
q(2, "The Analyzer's default study fills four cards: 15.00, 38.00, 23.00 and 63.00. A reader looking for the gross value of the 3D Seismic Survey scans the panel. Where is it, and what is it?",
 "33.00, in the Decision Guidance sentence and the CSV export; no card carries it.",
 ["23.00 on the Net VOI card, measured against doing nothing.",
  "38.00 on the EMV with Information card, taken before the cost.",
  "63.00 on the EVPI card, since the Analyzer reports its ceiling as the gross value whenever the survey has a cost."],
 "EMV with Information is already after the 10.0000 cost, so 38.00 less 15.00 is the net 23.00; adding the cost back gives 33.00, which is also 48.00 at cost 0 less 15.00.")

# ord 21
q(2, "A slide sets the default study's Net VOI card, 23.00, beside its EVPI card, 63.00, to show how much of perfect information the seismic survey captures. What is the fair comparison?",
 "Gross against gross, 33.00 against 63.00, because EVPI charges nothing for information.",
 ["38.00 against 63.00, since EMV with Information is the survey's gross value and EVPI is the value of perfect information itself.",
  "23.00 against 63.00 as shown, since both cards come from one engine call.",
  "33.00 against 78.0000, the value with perfect information, since a gross value belongs beside the gross value of knowing."],
 "The net card has the 10.0000 price inside it and the ceiling does not. EVPI is 78.0000 less 15.0000, the difference of two decision values, so it compares with the gross 33.00.")

# ord 22
q(3, "The EKPAN lottery is typed into the Analyzer with Bright spot at 46.000000 percent and No bright spot at 64 percent. What comes back?",
 "A refusal naming the sum, \"Indicator chances sum to 110 percent, expected 100\", before any card is computed.",
 ["75.75 and 52.00 only, the rest withheld as for posteriors that contradict the stated chances.",
  "A full set of cards after the indicator chances are rescaled to 100, with a note that the typed chances were normalised.",
  "A full set of cards, since indicator chances only weight the readings and an excess shifts the values without breaking them."],
 "Percents that are not a distribution are refused first. Withholding is for percents that are distributions and still imply another prior, as with Bright spot at 56 percent.")

# ord 23
q(0, "Typed into the repaired Analyzer, the EKPAN lottery with Bright spot at 56 percent and No bright spot at 44 percent passes the sum check with its posteriors unchanged. What does it report?",
 "75.75 and 52.00 only, withholding EMV with Information, both values of information and the diagram.",
 ["Every card, since the indicator chances sum to 100 and the posteriors are the Bayes results carried at full precision.",
  "Every card, after rescaling the posteriors until implied success returns to 0.350000.",
  "A gross value of 40.62 marked inconsistent, since the Analyzer prints what it computed beside its consistency warning."],
 "56 percent of 64.673913 plus 44 percent of 9.722222 implies success 0.404952, beyond 0.005 of 0.350000. The 40.62 is what the Analyzer printed before the repair.")

# ord 24
q(1, "Inverting the EKPAN lottery's Analyzer entries, Bright spot given Success is 0.646739 x 0.460000 / 0.350000. What does it return, and what does the same arithmetic say with Bright spot typed at 56 percent?",
 "0.850000, the survey's hit rate; at 56 percent it exceeds 1, so the typing describes no survey.",
 ["0.297500, the joint chance; at 56 percent, a larger joint valued as a stronger survey.",
  "0.646739 unchanged, since inverting only relabels the posterior, and at 56 percent that same posterior with a heavier weight.",
  "0.850000, and at 56 percent a figure just under 1 marking a very strong survey that the Analyzer still values in full."],
 "The Success column sums to the implied success chance over the stated one, so it sums to 1 only when the typing is consistent. The repaired Analyzer withholds on those 56 percent inputs.")

# ord 25
q(3, "On the Analyzer's default study, what survey price leaves the survey value-neutral, and which number plays the same role on the tree engine's EKPAN lottery?",
 "33.0000, the gross value found only in the guidance sentence; on the EKPAN lottery, its evii of 24.8250.",
 ["23.00, the Net VOI card at the default cost, and on the EKPAN lottery its netEvii of 16.8250 at a price of 8.0000.",
  "63.00, the EVPI card, and on the EKPAN lottery its EVPI of 52.0000, since information turns neutral when priced at its ceiling.",
  "38.00, the EMV with Information card, and on the EKPAN lottery its acquire branch of 92.5750 at a price of 8.0000."],
 "At 33.0000 the net card reads 0.00 and the verdict says the information exactly pays for itself; at 24.8250 the EKPAN lottery's root branches tie at 75.7500. Both prices are gross values, which no card shows.")

# ord 26
q(0, "The Analyzer typed with the EKPAN lottery shows EMV without Information 75.75 and EVPI 52.00, exactly the lottery's own values, and a reviewer signs off the typing on that match. What does the match hide?",
 "The missing farm-out, which adds nothing at the prior or with perfect information and shows only in the value with information, 19.84 against 24.8250.",
 ["The survey cost of 8.0000, which both matching values leave out and which the EMV with Information card still has to subtract.",
  "Nothing, since emvPrior and EVPI bracket the value of information between them, so a match on both pins the survey's value.",
  "A rounding gap, since the cards are two-decimal strings and 75.75 conceals the digits that separate the two tools."],
 "After no bright spot the Analyzer can only walk away at 0.0000 where Farm out pays 9.2361, so its value with information is 95.5875 against 100.5750.")

# ord 27
q(2, "Squeezing the EKPAN lottery into the Analyzer drops the farm-out, an action the survey would choose after a poor reading. What would change if the action squeezed out were instead the best action at the prior?",
 "EMV without information would be wrong as well, so the value of information could err in either direction.",
 ["Nothing further, since a missing action always understates the value of information by its weighted value after the reading that uses it.",
  "EVPI would expose it at once, since EVPI is computed over every action the decision really has, whatever the form offers.",
  "The consistency check would withhold the value, since typed posteriors cannot agree with a prior valued on the wrong actions."],
 "On the EKPAN lottery Drill at 75.7500 beats Farm out at 33.2500, so emvPrior and EVPI survive the omission and only the value with information exposes it, 95.5875 against 100.5750.")

# ord 28
q(1, "The CSEM survey's hit rate, 0.850000, is typed into the Analyzer as P(Success | Bright spot) for the EKPAN lottery. How does the repaired Analyzer's response differ from a hand rollback that makes the same misreading?",
 "The rollback values Drill after a bright spot at 298.2500 against 207.7989; the Analyzer finds the implied success chance far from 0.350000 and withholds.",
 ["Both overvalue the survey by the same amount, since the Analyzer and the rollback run the same Bayes arithmetic on the number typed.",
  "The Analyzer refuses with a message naming the sum, since a success chance of 0.850000 cannot sit in a row that also holds a dry hole.",
  "The Analyzer converts 0.850000 into the posterior 0.646739 first, because it inverts every typed entry back to likelihoods before valuing."],
 "The Analyzer never inverts and never rescales; the row still sums to 100, so it is withheld and not refused. The hand overstatement lands on the reading that argues for drilling.")

# ord 29
q(3, "On IRRI both indicators are typed 20 / 80 percent against a stated Success Case of 30 percent. Which two values does the repaired Analyzer still print, and why can it?",
 "15.00 and 63.00, since EMV without information and EVPI use only the stated outcome chances.",
 ["15.00 and -15.00, the value at the prior and a gross value of information now shown beside a consistency warning.",
  "63.00 alone, since EMV without information uses the implied 0.200000.",
  "None, since typed percents that contradict each other are refused with a message naming the sum in percent."],
 "The indicators imply success of 0.200000 against 0.300000, far beyond the 0.005 tolerance, so every value that needs the posteriors is withheld. The -15.00 is pre-repair history.")

# ord 30
q(0, "Before the EC4-0 repair, a posterior row summing to 130 percent printed a gross value of information of 69.00 beside an EVPI card of 63.00. Which bound did that break, and what does the repaired Analyzer do with the input?",
 "The upper bound, since no information is worth more than knowing the outcome; the row is now refused with a message naming 130 percent.",
 ["The lower bound, since a gross value above EVPI turns negative once the survey cost is charged, and the input is now withheld.",
  "No bound, since EVPI is a card after cost and the gross value before it, and the repaired Analyzer prints both unchanged.",
  "The upper bound, and the repaired Analyzer now rescales the row to 100 percent and prints a value under 63.00."],
 "0 <= value <= EVPI for any information derived by Bayes. A row that is not a distribution is refused before any card; withholding is for distributions that contradict the stated chances.")

# ord 31
q(2, "A capstone answer subtracts the EKPAN tree's drill branch value, 105.0000, from the EKPAN lottery's evWithPerfect, 127.7500, to get EVPI. What is wrong?",
 "It mixes two models: the lottery's baseline is its own emvPrior of 75.7500, giving 52.0000, while 105.0000 belongs to the three-outcome tree.",
 ["Nothing, since the EKPAN tree and lottery share one prospect at a 0.350000 success chance, and EVPI needs only the best prior value.",
  "The baseline should be the lottery's farm-out at 33.2500, since perfect information recommends the farm-out on a dry hole.",
  "The subtraction runs backwards, since EVPI is the value at the prior less the value with perfect information."],
 "The EKPAN tree's drill branch of 105.0000 loses money with probability 0.500000; the EKPAN lottery's drill action of 75.7500 loses with probability 0.650000. Section 16 carries them as separate fields.")

# ord 32
q(1, "On a known dry hole in the EKPAN lottery, Farm out and Walk away both pay 0.0000 and the table names Farm out. If Walk away were listed first, what would happen to EVPI?",
 "Only the name changes: EVPI stays 52.0000, since it takes the best value per outcome.",
 ["EVPI would fall, because naming Walk away gives up the farm-out's 95.0000 on a success that perfect information could still reveal.",
  "It rises to 61.7143, as the farm-out line no longer sets the switch.",
  "The engine refuses: a tie on one outcome leaves the best action undefined."],
 "The best value on a dry hole is 0.0000 whichever action is named. A tie on an outcome row is the first-branch rule at work, and it moves labels, never values.")

# ord 33
q(0, "The CSEM survey on the EKPAN lottery is worth 24.8250, between the symmetric survey's 22.7000 at accuracy 0.800000 and 30.0250 at 0.850000. Why can no symmetric survey, at any accuracy, pass 52.0000?",
 "At accuracy 1.000000 Bayes becomes the perfect information table, and the lottery fixes EVPI at 52.0000 whatever the survey.",
 ["Because the engine clamps each evii at the EVPI and reports the clamp whenever a survey would otherwise exceed the ceiling.",
  "Because EVPI is recomputed at each accuracy and falls toward the survey's own value as the survey improves on the dial.",
  "Because a symmetric survey is right about a dry hole only as often as about a success, which holds it under the CSEM survey's 0.750000."],
 "At accuracy 1.000000, 0.350000 x 365.0000 = 127.7500 and evii is 52.0000. The bound is arithmetic and no clamp: every posterior is derived from one prior.")

# ord 34
q(3, "With the CSEM survey on the EKPAN lottery, which reading earns the survey's whole value over the prior action, and why?",
 "No bright spot: its posterior 0.097222 falls under the 0.228571 switch, and Farm out at 9.2361 replaces Drill at -36.7361.",
 ["Bright spot: it lifts success to 0.646739 and carries Drill to 207.7989, far above the prior value of 75.7500.",
  "Both readings, in proportion to their chances of 0.460000 and 0.540000, since each moves the posterior away from the prior.",
  "Neither alone: value is the gap between the posteriors 0.646739 and 0.097222, priced at Drill's net payoff of 365.0000."],
 "Drill is already best at the prior, so a reading that keeps Drill earns nothing over it. The gain after no bright spot, weighted by 0.540000, is the whole 24.8250.")

# ord 35
q(1, "A symmetric survey of accuracy 0.700000 is worth 8.0500 on the EKPAN lottery. Squeezed into the Analyzer's two actions, drill or Do Not, with its posteriors typed consistently, what is it worth?",
 "0.0000: a dry reading leaves success at 0.187500, still above the drill against walk-away switch of 0.179775, so Drill follows both readings.",
 ["8.0500, since the posteriors after each reading are the same in either tool, and the value of a survey comes from its posteriors.",
  "Less than 8.0500 but positive, short by the farm-out's value after a dry reading weighted by that reading's chance, as on the CSEM survey.",
  "Nothing it can print, since typing a symmetric survey's posteriors into a two-action form contradicts the stated outcome chances and is withheld."],
 "Without the farm-out the action after a dry reading turns only below 80 / 445 = 0.179775. The 0.750000 row, carrying success to 0.152174, is the first tabulated accuracy that would change the two-action choice.")

# ord 36
q(3, "A budget paper says the CSEM survey on the EKPAN lottery is worth 92.5750 at a price of 8.0000. What has it actually reported?",
 "The acquire branch, the whole decision with the survey bought; the survey's own contribution is 16.8250.",
 ["The survey's gross value, since 92.5750 is the reading chance node before any price has been charged.",
  "The survey's net value, since the price of 8.0000 has already come off the value with information.",
  "The value with perfect information less the price, the most a survey that never misread could return."],
 "100.5750 less 8.0000 is 92.5750, and against 75.7500 without the survey the difference, 16.8250, is netEvii. The gross 24.8250 is the neutral price.")

# ord 37
q(2, "On the published seismic prospect, seismicCost5's root reads 50.5000 with bestBranchIndex 0 and seismicCost20's reads 43.0000 with bestBranchIndex 1. What value with information do the two share, and where does the root flip?",
 "55.5000 before the price; the root flips once the price passes the gross value 12.5000, where costExactlyNetZero ties at 43.0000.",
 ["50.5000, the acquire branch at the cheaper price, with the flip at 7.5000, the net value seismicBayes records for its survey.",
  "43.0000, since that is the root both share once the price rises, with the flip at 20.0000 where the branch index changes.",
  "78.0000, the value with perfect information on that prospect, with the flip at its EVPI of 35.0000 on every quote."],
 "Each acquire branch is 55.5000 less the price, 50.5000 at 5.0000 and 35.5000 at 20.0000, against 43.0000 without the survey. At 12.5000 the tie keeps the acquisition, listed first.")

# ord 38
q(2, "The Analyzer shows EMV with Information 87.59 for the EKPAN lottery, while the tree engine's evWithInfo is 100.5750. What separates the two?",
 "The card is after the 8.0000 cost, and the Analyzer has no farm-out, so even with the cost added back it reaches only 95.5875.",
 ["Only the survey cost, since 100.5750 less 8.0000 is the card value once the card has been rounded to two decimals.",
  "Only the missing farm-out, since both numbers are values before the survey cost is charged on the acquire branch.",
  "The consistency check, which trims the Analyzer's value whenever its posteriors are typed to six decimals and the tree engine's posteriors are not."],
 "95.5875 less 8.0000 is 87.5875, the drawn tree's root. The tree engine's own acquire branch after the same cost is 92.5750.")

# ord 39
q(1, "A survey is entered in the tree engine with likelihoods over Success of 0.850000 for a bright spot and 0.050000 for none. What does the engine do?",
 "It refuses: \"Likelihoods P(signal | \"Success\") sum to 0.900000, expected 1\", and values nothing.",
 ["It rescales the Success column to sum to 1 and values the survey on the normalised likelihoods without comment.",
  "It treats the missing 0.100000 as a reading that never arrives and values the rest.",
  "It values the survey, since only the chances of the signals across both outcomes are required to sum to 1."],
 "Each outcome's column is a distribution over readings and must sum to 1 within 1e-6. The engine refuses and never quietly normalises.")

# ord 40
q(0, "If the geologist's success estimate on the EKPAN lottery moved from 0.350000 to 0.900000, with the CSEM survey's likelihoods unchanged, what happens to the ceiling on that survey's value?",
 "It falls to an EVPI of 8.0000, because Drill is then rarely wrong and perfect information corrects it only on the rare dry hole.",
 ["It stays at 52.0000, since EVPI belongs to the payoffs and to the survey, and neither of those has moved with the estimate.",
  "It rises to 328.5000, the value with perfect information at 0.900000, since the prospect itself is now worth much more.",
  "It rises toward the peak of 61.7143, since a likelier success makes the outcome more certain and so makes any information about it more decisive."],
 "EVPI at 0.900000 is 328.5000 less 320.5000. The likelihoods 0.850000 and 0.250000 have not moved, but no survey on that decision can be worth more than 8.0000.")

# ord 41
q(3, "At a survey cost of 50.0000 on the Analyzer's default study, the EMV with Information card reads -2.00, and a reader concludes the well itself has turned into a loss. What does the Analyzer actually say?",
 "Net VOI -17.00 and a verdict against buying the survey; the drawn tree's root takes No further information.",
 ["That drilling has turned negative, since EMV with Information is the value of the drill decision once the survey result is known.",
  "That the survey is still justified, since its gross value of 33.00 stays positive and the verdict sentence reads the gross value.",
  "Nothing further: a card below zero means contradictory chances, so the rest is withheld."],
 "The card is after the cost: 48.00 less 50.0000 is -2.00, and -2.00 less 15.00 is -17.00. A negative card here reflects a price and no broken input.")

# ord 42
q(0, "The Analyzer holds back a value of information when its typed numbers disagree. What keeps an information tree built from likelihoods from ever reaching that state?",
 "It takes likelihoods and derives every posterior from the one stated prior, so its inputs cannot imply a different prior.",
 ["It rounds every posterior to six decimals before valuing, which keeps any implied prior inside the 0.005 tolerance.",
  "It checks consistency as well, but it repairs a gap by rescaling the posteriors where the Analyzer withholds.",
  "It values only surveys with a positive EVPI, so an inconsistent survey is refused by the engine at the door before anything could be withheld."],
 "The Analyzer takes typed posteriors, which can carry a prior of their own, as IRRI's 0.200000 against 0.300000 shows. The engine's 0.460000 x 0.646739 plus 0.540000 x 0.097222 always returns 0.350000.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/intermediate/ec4i_exam.json", label="ec4i_exam", expect_n=42)
finish()
