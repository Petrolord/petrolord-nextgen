import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC4 decision, advanced, module m01-inputs-that-contradict-each-other.
# One q() per served question, in ord order (ord = position, from 1).

# ord 1
q(1, "The EKPAN lottery is typed into the VOI Analyzer at full precision: Bright spot 46.000000 percent, success given Bright spot 64.673913 percent, success given No bright spot 9.722222 percent, against a stated success chance of 35 percent. What does the consistency check compute?",
 "The indicator weighted average of the two posteriors, 0.297500 plus 0.052500, which is 0.350000 and leaves only binary residue as the delta.",
 ["The sum of the two posteriors, which must reach 100 percent before the Analyzer will print any value of information for the survey.",
  "The likelihoods recovered from the posteriors, 0.850000 and 0.250000, each compared in turn against the stated success chance of 0.350000.",
  "The posterior after No bright spot read alone against the stated chance, because it is the more likely of the two readings on this survey."],
 "Implied success is the sum over readings of each reading's chance times its posterior; on the EKPAN lottery 0.460000 x 0.646739 + 0.540000 x 0.097222 returns 0.350000 with a delta of 5.551115e-17, so the entries are consistent and the gross voi reads 19.84.")

# ord 2
q(3, "IRRI is the Analyzer's default study with both Positive Seismic and Negative Seismic typed as 20 / 80 percent. What does the Analyzer show?",
 "EMV without information 15.00 and EVPI 63.00, with every other card and the diagram withheld.",
 ["A gross voi of -15.00 and a netVoi card of -25.00, because after either reading the best action is Do Not and the with side comes to 0.",
  "A refusal naming the sum in percent, since two indicators typed with identical outcome chances do not form a distribution at all.",
  "Every card at 0.00, since a withheld value is printed as zero so that the verdict sentence can still call the survey value neutral."],
 "The readings imply a 0.200000 success chance against a stated 0.300000, so consistent is false and withheld is true; the -15.00 and -25.00 are what the typed chances give with nothing checking them against the stated prior, and the two surviving cards use only the stated outcome chances.")

# ord 3
q(0, "Why does IRRI imply a success chance of 0.200000 whatever its indicator chances of 40 and 60 percent are typed as?",
 "Both readings carry a success chance of 20 percent, and a weighted average of equal numbers returns that number for any weights.",
 ["The engine substitutes the smallest outcome chance typed on the form whenever the entries disagree with the stated chances.",
  "The indicator chances enter only the value of information, and the check reads the posteriors of the first indicator listed, Positive Seismic.",
  "The indicator chances are rescaled until they reproduce a stated chance, and 20 percent is the closest those entries reach."],
 "Implied success is 40 percent of 20 percent plus 60 percent of 20 percent, which is 0.200000; the delta against the stated 0.300000 is -0.100000, far past the 0.005 allowance.")

# ord 4
q(2, "The published justInsideTolerance case states 0.300000 / 0.700000 and implies 0.305000 / 0.695000. What does the engine report?",
 "Consistent true, because the boundary is inclusive and a 1e-12 allowance absorbs the binary residue in 0.305 - 0.3.",
 ["Consistent false, because 0.305 - 0.3 is 0.0050000000000000044 in binary, above 0.005, and the check compares against 0.005 alone.",
  "Consistent false, because the allowance is relative, half a percent of the stated 0.300000, and a delta of 5.000000e-3 is far beyond it.",
  "Consistent true with a boundary mark beside the cards, showing the delta sits exactly on the half percent line."],
 "The check compares every delta against 0.005 plus a 1e-12 allowance, so a delta of exactly 5.000000e-3 in the typed decimals reads consistent true, and nothing grades it as sitting on the line.")

# ord 5
q(1, "On the Analyzer defaults the gross voi is 33.00 at an implied success chance of 0.300000 and 34.75 at 0.305000 (consistentAtHalfPercent), while 35.10 at 0.306000, what its typed chances give with nothing checking them, is withheld. What does the climb from 33.00 to 34.75 show?",
 "Part of an accepted value can be extra success the stated chances never granted, so a pass does not certify the value.",
 ["The typed posteriors describe a sharper survey, and posteriors further from the prior always carry more information.",
  "The allowance rescales the posteriors onto the stated chances before valuing, so 34.75 includes a correction the engine adds.",
  "It is binary residue from the 1e-12 allowance, so 33.00 and 34.75 describe the same survey to two decimals."],
 "The value climbs with the contradiction inside the half point: 34.75 carries the same kind of error as the withheld 35.10, only less of it, and nudging entries under the line does not make them agree.")

# ord 6
q(0, "On the EKPAN lottery, posteriors typed 65.000000 / 10.000000 and 65.000000 / 9.000000, both with Bright spot at 46.000000 percent, print the same gross voi of 20.51. Why?",
 "After No bright spot the Analyzer's best action is Do Not at either posterior, and Do Not pays 0 at any success chance.",
 ["The Analyzer rounds each typed posterior to the nearest 5 percent before valuing, so 9 and 10 percent become one entry.",
  "Both rows pass the half percent check, and every accepted row prints the value the full precision entries would have given.",
  "A posterior below 10 percent is treated as a dry reading and valued as if the success chance after it were exactly zero."],
 "The posterior after No bright spot multiplies a branch worth nothing, so the card cannot see it; on the EKPAN lottery full precision prints 19.84, so 20.51 overvalues the survey by rounding alone.")

# ord 7
q(3, "The EKPAN lottery typed with posteriors rounded to 64.700000 and 9.700000 gives an implied success chance of 0.350000 and a delta of 0.000000e+0. What does that result certify?",
 "Only that the entries average back to the stated chance; the card still reads 19.89 against 19.84 at full precision.",
 ["That the entries match the survey, so 19.89 is the survey's value and the 19.84 printed at full precision is the approximation.",
  "That the posteriors were derived by Bayes, since only posteriors derived from likelihoods can land on a delta of exactly zero.",
  "That the value is exact to two decimals, since a gross voi can be off only when the delta is not zero."],
 "The check compares implied against stated chances and nothing else: on the EKPAN lottery, rounding to one decimal happened to average back exactly while still moving the gross voi from 19.84 to 19.89.")

# ord 8
q(2, "Having seen 65.000000 / 9.000000 print the same 20.51 as 65.000000 / 10.000000 on the EKPAN lottery, a user types the posterior after No bright spot as 8.000000 percent. What does the Analyzer show?",
 "EMV without information 75.75 and EVPI 52.00 only, because the implied success chance falls to 0.342200.",
 ["20.51 again, since the posterior after No bright spot multiplies a Do Not branch worth 0 and cannot move any output of the Analyzer.",
  "18.46, since lowering either posterior lowers the value of information, as the row typed 64.000000 / 10.000000 already shows.",
  "A refusal saying the outcome chances given No bright spot fail to sum to 100 percent, since 8 percent sits below the allowance."],
 "On the EKPAN lottery the delta of -7.800000e-3 is past the 0.005 allowance, so the value is withheld: a posterior that never reaches the value still breaks the agreement every value depends on. The entry is still a distribution, so it is withheld and not refused.")

# ord 9
q(0, "With the EKPAN lottery posteriors at 65.000000 and 10.000000, Bright spot typed at 45.000000 percent passes at an implied 0.347500, and typed at 47.000000 percent fails at 0.358500. Why does the indicator chance move the implied prior fastest?",
 "It weights both posteriors at once, shifting weight from one reading's success chance to the other's.",
 ["It is the only entry the check reads, because the posteriors enter the value of information and never the implied prior.",
  "Indicator chances are typed in whole percents and posteriors to six decimals, so each step on an indicator chance is coarser.",
  "The Analyzer rescales the indicator chances to sum to 100 after every edit, which doubles the effect of any change to one of them."],
 "On the EKPAN lottery a point of indicator chance moves weight across the whole gap between 65 and 10 percent, so 45.000000 prints 18.41 and 47.000000 is withheld; rounding 65 up to 66.000000 fails too, at 0.357600.")

# ord 10
q(1, "Weighted as typed with nothing checking them, the published contradictingPosterior case gives a gross voi of 75.00 beside an EVPI card of 63.00. Why is that value impossible?",
 "The with side averages to a 0.420000 success chance against a stated 0.300000, so the subtraction includes the uplift of believing in a better prospect.",
 ["The survey cost of 10.0000 is added to the with side where it should be subtracted, which lifts the gross value past its ceiling.",
  "The EVPI card comes from the two action form and the voi from a lottery with a farm-out, so the two numbers describe different lotteries.",
  "EVPI caps only the expected value with information, leaving the value of information free, so 75.00 above 63.00 is ordinary arithmetic on consistent inputs."],
 "Information derived by Bayes satisfies 0 <= evii <= evpi; 75.00 sets a 0.420000 prospect after the survey against a 0.300000 prospect before it, and the Analyzer withholds the value.")

# ord 11
q(3, "A reviewer proposes guarding the Analyzer by capping any value of information at EVPI and printing it. Why would that not be enough?",
 "Contradictions also land below the ceiling: the EKPAN lottery typed with indicators at 56 and 44 percent gives 40.62 under an EVPI of 52.00.",
 ["Clipping would change the verdict sentence, which is computed from the unclipped value, so the card and the sentence would disagree.",
  "EVPI is itself withheld whenever the inputs contradict each other, so there would be no ceiling left to clip the value against.",
  "Capping 75.00 at 63.00 is what the Analyzer already does, so the proposal only duplicates a check it already carries."],
 "The honest value on those EKPAN lottery entries is 19.84, and indicatorChancesAboveHundred gives 33.00, matching the defaults' own gross voi; a test on the output catches only the loudest cases, so the Analyzer tests the inputs.")

# ord 12
q(2, "The published pricey case prints a netVoi card of -17.00, and IRRI's typed chances give a gross voi of -15.00 with nothing checking them against the stated prior. What separates the two?",
 "The first says a price of 50.0000 exceeds a gross value of 33.00; the second could only come from typed inputs that contradict the stated prior.",
 ["Nothing of substance: a misleading survey has a negative gross value just as an expensive survey has a negative net value.",
  "The first is a figure the Analyzer withholds, while the second is what the Analyzer prints for IRRI beside its warning.",
  "Both say the survey costs more than it adds, and they differ only in whether the survey cost of 10.0000 was deducted."],
 "A decision maker can always ignore a Bayes signal, so evii is at least 0, and uselessSignal sits on that floor at 0.0000; a negative net value says the price is too high, a negative gross value says the inputs disagree.")

# ord 13
q(0, "posteriorsAboveHundred types outcome chances given Positive Seismic that sum to 130 percent; IRRI types two readings whose outcome chances each sum to 100. How does the Analyzer treat each?",
 "It refuses the first before computing anything, and withholds the value on IRRI while still showing 15.00 and 63.00.",
 ["It withholds both, keeping EMV without information and EVPI, because every contradiction in typed percents is reported the same way.",
  "It clips the first to 100 percent and values it at 69.00, and it withholds the value of information on IRRI.",
  "It withholds the first with a warning naming 130 percent, and refuses IRRI because its two readings are typed identically."],
 "A refusal says the typed numbers are not chances at all, with the message \"Outcome chances given \"Positive Seismic\" sum to 130 percent, expected 100\"; a withholding says they are chances that cannot all be true together.")

# ord 14
q(1, "Why can typed inputs contradict each other in the VOI Analyzer when the Decision Tree Builder's information tree cannot?",
 "The Analyzer takes posteriors as typed, while the Builder derives them from likelihoods and the stated prior, so they agree by construction.",
 ["The Builder rounds posteriors to six decimals and the Analyzer to two, and only the coarser rounding can break the half percent check.",
  "The Builder refuses any survey whose readings disagree with the prior, while the Analyzer accepts them and repairs the posteriors afterwards.",
  "The Analyzer takes likelihoods where the Builder takes posteriors, and a likelihood typed in is compared against the wrong prior."],
 "Averaging Bayes posteriors over the readings returns the prior, as the EKPAN lottery's 0.460000 x 0.646739 + 0.540000 x 0.097222 = 0.350000 shows; nothing ties typed posteriors to outcome chances typed two boxes earlier, which is why the IRRI warning points to the Builder.")

# ord 15
q(3, "With nothing checking its sums, indicatorChancesAboveHundred, with indicator chances summing to 110 percent, gives a gross voi of 33.00. What makes that value dangerous, and what does the Analyzer do with the entry?",
 "It matches the defaults' own gross voi of 33.00, and the entry is refused with \"Indicator chances sum to 110 percent, expected 100\".",
 ["Nothing, since rescaling indicator chances by their sum leaves the posteriors alone, and the Analyzer prints 33.00.",
  "It sits inside the half percent allowance, so the check passes it, and the allowance would need narrowing to catch it.",
  "It contradicts the stated chances, so the value is withheld and EMV without information 15.00 and EVPI 63.00 remain on the screen beside the consistency warning."],
 "A 110 percent indicator set is not a distribution, so it is refused outright before the consistency check; an output test would have passed 33.00, which sits under 63.00.")

emit(Q, "/root/wt-ec45-recut/tools/course-waves/ec45-recut/banks/decision/advanced/ec4a_m01.json", label="ec4a_m01", expect_n=15)
finish()
