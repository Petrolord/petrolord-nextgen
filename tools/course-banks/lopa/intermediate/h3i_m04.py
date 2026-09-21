import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 Professional m04: The Architectures.
# Digest section 21 (one channel in every architecture, ranked, with the six
# in two out of three and the thinner evidence behind one out of three).

q(3,
 "In the ranking of all five architectures on the diagnostics bearing teaching channel, what risk reduction factor stands beside the single channel row?",
 "189.107413",
 ["777.344387","133.130974","190.258752"],
 "Ranked by PFDavg, the single channel row carries 189.107413 on a value of 0.005288000000. 190.258752 is the simplified single channel, with no detected failures and no repair time after a test, so that figure answers a different channel. 133.130974 is a shutdown valve at a proof test coverage of 0.9, and 777.344387 belongs to a published function summed from five subsystems.")

q(1,
 "What does the engine report beside a two out of two on this channel, read as one over its PFDavg?",
 "94.553707",
 ["95.129376","68.460327","90.422454"],
 "The ranked table prints 94.553707 against a 2oo2 PFDavg of 0.010576000000 and bands it 1, the worst of the five. 95.129376 is the two out of two of the channel with no diagnostics. 90.422454 and 68.460327 come from the coverage sweep on the OBAGI valve, which is a different subsystem entirely.")

q(2,
 "Set the two out of three against the one out of two on that channel. What does the derived comparison read?",
 "1.235857",
 ["1.045262","2.000000","1.002144"],
 "The section prints the 2oo3 over the 1oo2 as 1.235857, derived, so voting costs roughly a quarter of the pair's PFDavg while their common cause terms stay identical. 2.000000 is the two out of two over the single channel. 1.045262 and 1.002144 belong to the repair time sweep on the pair.")

q(0,
 "The ranked table measures every architecture against the single channel. What does the pair read in that column?",
 "0.056541",
 ["0.049925","0.069876","1.000000"],
 "The ranked table prints 0.056541 for the 1oo2 over the 1oo1, derived. 0.049925 belongs to the three channel arrangement and 0.069876 to the two out of three. 1.000000 is the single channel measured against itself, which is the base of the column.")

q(3,
 "Measured over the single channel row, which derived entry belongs to the two out of three?",
 "0.069876",
 ["0.056541","0.049925","2.000000"],
 "The ranked table prints 0.069876 for the 2oo3 over the 1oo1, derived, which is the largest of the three redundant entries because its independent term carries 6. 0.056541 is the pair and 0.049925 is the three channel arrangement. 2.000000 is the two out of two, which is the one entry above the single channel.")

q(1,
 "Where does the two out of two land in that same comparison?",
 "2.000000",
 ["1.000000","0.049925","1.235857"],
 "The ranked table prints 2.000000, because a 2oo2 fails on the first dangerous failure of either channel and its form is twice the single channel's. 1.000000 is the single channel itself. 0.049925 is the three channel arrangement. 1.235857 is the two out of three measured against the pair, which is a different comparison.")

q(2,
 "The ranking prints a risk reduction factor beside every architecture. Which one belongs to the pair?",
 "3344.625055",
 ["3787.861448","3801.573360","3377.890772"],
 "Ranked by PFDavg the pair carries 3344.625055 on a value of 0.000298987176, inside band 3. 3377.890772 is the simplified pair, with no detected failures and no repair time after a test. 3787.861448 belongs to the three channel arrangement of this ranking, and 3801.573360 to the three channel arrangement without diagnostics.")

q(0,
 "The two out of three in that ranking is credited with which risk reduction factor?",
 "2706.319458",
 ["2758.406219","3344.625055","3787.861448"],
 "The ranked table prints 2706.319458 beside a 2oo3 PFDavg of 0.000369505528. 2758.406219 comes from the simplified forms table, where lambdaDD and MRT are both zero. 3344.625055 is the pair of this ranking and 3787.861448 is the three channel arrangement of it, both of which sit lower on PFDavg and so higher here.")

q(3,
 "Every architecture in the ranked table is built on one channel. What total dangerous failure rate does that channel carry, derived?",
 "4e-6 per hour: lambdaDU of 1.2e-6 plus lambdaDD of 2.8e-6.",
 ["1.2e-6 per hour, because the diagnostics reclassify part of the undetected rate as detected and the total the channel carries stays where it was.",
  "2.8e-6 per hour, the detected rate alone, since a detected failure is the only one the MTTR restores.",
  "4e-6 per hour of undetected failures, with no detected rate left."],
 "The full form section derives lambdaD, the sum of lambdaDU and lambdaDD, as 4e-6 per hour. The detected rate is added to the channel on top of its undetected rate of 1.2e-6, so nothing is reclassified, which is why the single channel reads 0.005288000000 against 0.005256000000 with no detected failures. The total keeps its split, because the two shares are charged different down times in the channel equivalent down time.")

q(1,
 "Read the ranked table by band. Which architecture is the one sitting in band 2?",
 "1oo1",
 ["1oo2","2oo2","2oo3"],
 "The ranked table bands the 1oo1 at 2 on a PFDavg of 0.005288000000. The 2oo2 is banded 1, the worst of the five. The 1oo2 and the 2oo3 are both banded 3, alongside the three channel arrangement, so neither of them sits alone in band 2.")

q(0,
 "Why does the printed two out of three equation carry a coefficient of 6 where the one out of two carries 2?",
 "Because a two out of three fails when any two of its three channels are failed: three pairs, and either failure of a pair may come first, which is six orderings in all.",
 ["Because a two out of three has three channels and two of them must vote, so the coefficient is the channel count multiplied by the votes needed.",
  "Because the second failure of a group waits a third of the interval where the first waits half of it, and that ratio enters the coefficient.",
  "Because six is the coefficient Annex B gives to every architecture built on three channels, whatever its voting arrangement happens to be."],
 "The section derives the six by counting: three pairs at two orderings each. Channels times votes would give the same number here by coincidence and the wrong number elsewhere. The down time argument is what sets T1/3 in the group equivalent down time and has nothing to do with the coefficient. The three channel arrangement does carry a 6 as well, on a cubed term, and that is not why the two out of three carries one.")

q(2,
 "A design review picks a two out of three over a one out of two. What does the engine say about that choice?",
 "Nothing. It computes PFDavg and its terms, and no spurious trip rate at all.",
 ["It reports the tolerance of a single channel calling for a trip as a second output beside the PFDavg, so the two effects can be compared on one page.",
  "It refuses the comparison unless both calls hold every other input, and names the input that moved.",
  "It reports the choice as independent dominated and leaves the rest."],
 "The section says the two out of three buys tolerance of one channel tripping spuriously, which this engine does not compute, so the argument for it lives outside the calculation. The engine returns the PFDavg, its risk reduction factor, its band, its terms and its equivalent down times. It refuses nothing about a comparison, and the dominant term is a separate reading.")

q(1,
 "The course asks for more care with the three channel arrangement than with the other four. What is the reason?",
 "Its validation record checks it against the time dependent route to first order only, with no published worked row behind it.",
 ["Its cubed independent term falls below the precision the engine prints, so the figure it returns cannot be quoted at the twelve decimals this tier reads.",
  "The engine refuses it whenever common cause dominates.",
  "Annex B states no equation for it, so the engine infers one."],
 "The section states the evidence plainly: the one out of three is checked against the time dependent route to first order only, and no published worked row exists for it. The engine computes it from the published Annex B form like every other architecture, refuses nothing about it, and prints it at the same twelve decimals as the rest.")

q(3,
 "Which down times does the engine use for a three channel arrangement?",
 "The second failure uses T1/3 and the group uses T1/4.",
 ["The second failure uses T1/2 and the group uses T1/3, which are the same two down times a redundant pair and a two out of three already carry.",
  "Every failure uses T1/2, and the three equivalent down times differ only through the share of the rate that each failure population carries.",
  "The second failure uses T1/4 and the group uses T1/3, so the group is charged the longer of the two windows the arrangement can be exposed for."],
 "The Annex B section states that the group equivalent down time uses T1/3 in place of T1/2 for a pair and a two out of three, and that for a three channel arrangement the second failure uses T1/3 and the group T1/4. Swapping the two reverses the argument. A pair and a two out of three stop at one overlap. Charging every failure half the interval is the simplified single channel treatment.")

q(2,
 "How do the five architectures fall across the bands on this one channel?",
 "Three land in band 3, one in band 2 and one in band 1.",
 ["Four land in band 3 and one in band 2, because only the two out of two fails to gain from the diagnostics the channel carries.",
  "Two land in band 3, two in band 2 and one in band 1, since a two out of three pays for its voting with a whole division of the table.",
  "All five land in band 3 or better."],
 "The ranked table bands the three redundant arrangements at 3, the single channel at 2 and the two out of two at 1. The two out of two is worse than the single channel, so not all five reach band 3. The two out of three stays in band 3 beside the pair, and the single channel is the only entry in band 2.")

emit(Q, '/root/hse-wip-lopa/banks/h3i_m04.json', expect_n=15)
finish()
