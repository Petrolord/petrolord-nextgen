import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Associate m03, Paying and Beneficial Interests.
# Sources: the interests rule and the carriers rule, the golden cases
# int-ekene, int-half-carry-stated and int-two-carries with their reasons, the
# carry refusals, the precision rule for a figure inside a message, and the
# IMF WP/24/89 provision. Every key rests on a digest-printed line or an engine
# return re-run in /root/cat-wip-joa/scratch/bank-beginner/witness.mjs.

q(2, "NOC is carried in full on the Ekene terms. Which pair of figures does the engine return for it?",
 "Beneficial 20.000000 and paying 0.000000.",
 ["Beneficial 0.000000 and paying 20.000000, the carriers taking its barrels.",
  "Beneficial 0.000000 and paying 0.000000 until the carry is repaid.",
  "Beneficial 10.000000, paying 10.000000."],
 "On int-ekene NOC's beneficial interest is 20.000000, its share of production, and its paying interest 0.000000, its share of cost while it is carried. A carry moves cost and never moves production, so NOC's production share stays whole: the carriers take none of its barrels. On the half carry in stated shares NOC's paying interest is 10.000000 while its beneficial interest stays 20.000000.")

q(0, "Under the Ekene carry, NOC carried in full by pro rata carriers, how many of NOC's carried points does EKO pay, and what paying interest does that give EKO?",
 "10.000000 points, for a paying interest of 50.000000.",
 ["12.307692 points, for a paying interest of 59.807692.",
  "7.500000 points, for a paying interest of 47.500000.",
  "20.000000 points, all of them, as the operator."],
 "The Ekene carry puts NOC's 20 points on EKO, PA and PB pro rata to their participating interests: EKO 10.000000, PA 6.250000 and PB 3.750000. EKO's paying interest is its 40.000000 plus 10.000000, or 50.000000. 12.307692 and 59.807692 come from the case with two carries, 7.500000 and 47.500000 from the half carry in stated shares, and the operator carries no more than its pro rata part.")

q(1, "PA holds 25.000000 of the Ekene licence and shares the full carry of NOC's 20 with the other payers pro rata. What paying interest does PA reach?",
 "31.250000: its 25.000000 plus 6.250000 carry points.",
 ["5.000000 points, a quarter of NOC's twenty points, for a paying interest of 30.000000.",
  "2.500000 points, as in the half carry, for 27.500000.",
  "7.692308 points, as when PB is carried too, for 40.192308 in all."],
 "The carriers share pro rata among the parties no carry names as carried, so PA takes 25 of the 80 points EKO, PA and PB hold, which is 6.250000 of NOC's 20, and its paying interest is 31.250000. A quarter of twenty ignores that NOC's own share is left out of the ratio. 2.500000 is PA's part of the half carry in stated shares, and 7.692308 its part of NOC's carry when PB is carried as well.")

q(3, "The engine's reason for the Ekene carry ends with a clause about NOC. Which clause is it?",
 "its share of production stays 20%",
 ["it pays 20% once repaid",
  "its barrels pass to the carriers",
  "its beneficial interest falls to 0% while it is carried"],
 "The engine's reason, in its own words, reads: NOC: 100% of its 20% cost share is carried (20 points), paid by EKO 10, PA 6.25, PB 3.75 (pro rata to their participating interests); its share of production stays 20%. NOC's beneficial interest stays 20.000000 while it is carried, so no production passes to the carriers, and the reason says nothing about a repayment.")

q(1, "On int-half-carry-stated, NOC is carried for 50.000000 percent of its cost share by EKO and PA. What is NOC's paying interest?",
 "10.000000: it pays the half of its share that is not carried.",
 ["0.000000: any carry relieves it of all its cost.",
  "15.000000, the same as PB.",
  "20.000000: stated shares move only the carriers' points."],
 "Half of NOC's 20 points of cost is carried, 10 points, so NOC still pays the other 10 itself: its paying interest is 10.000000, as the engine returns. A carry moves only the carried percentage stated, so 0.000000 would need a carry of 100 percent. 15.000000 is PB's paying interest, and stated shares do move cost off the carried party.")

q(2, "EKO takes 75.000000 and PA 25.000000 of a half carry of NOC's cost. Whose paying interest equals its participating interest?",
 "PB, at 15.000000: the stated shares name only EKO and PA.",
 ["PA, at 25.000000: a carrier's paying interest stays at its participating interest.",
  "NOC, at 20.000000: a half carry leaves the carried party's share whole.",
  "EKO, at 40.000000."],
 "The stated shares are EKO 75.000000 and PA 25.000000, so PB pays none of the carry and its paying interest stays 15.000000. PA's paying interest is 27.500000 and EKO's 47.500000, each raised by its carry points, and NOC's falls to 10.000000.")

q(0, "On int-half-carry-stated, EKO and PA carry 10 points of NOC's cost in stated shares of 75.000000 and 25.000000. How many points does EKO pay?",
 "7.500000, three quarters of the 10 carried points.",
 ["15.000000, three quarters of NOC's whole 20 points.",
  "10.000000, the points it pays under pro rata.",
  "5.000000, half of the 10 carried points."],
 "The engine's reason reads, in its own words: NOC: 50% of its 20% cost share is carried (10 points), paid by EKO 7.5, PA 2.5 (in the stated shares); its share of production stays 20%. The stated shares apply to the carried points, 10, so EKO's 75 percent is 7.500000. Three quarters of 20 applies the shares to the part NOC still pays, 10.000000 is EKO's pro rata part of a full carry, and a half ignores the stated shares.")

q(3, "On int-two-carries NOC is carried in full pro rata, and PB is carried as well. Who carries NOC's 20 points?",
 "EKO and PA alone: 12.307692 and 7.692308.",
 ["EKO, PA and PB, 10.000000, 6.250000 and 3.750000, as on the Ekene carry, with PB's part paid by the others.",
  "EKO and PA in equal halves, 10.000000 each, following the stated halves of PB's carry.",
  "EKO, PA and PB pro rata to their participating interests, PB included."],
 "Pro rata carriers share a carry in proportion to their participating interests among the parties no carry names as carried. PB is carried, so NOC's carriers are EKO and PA alone, in the ratio of their participating interests, and the engine returns 12.307692 and 7.692308. The equal halves are the stated shares of PB's carry, which do not govern NOC's.")

q(1, "PB's 15 points are carried in full by EKO and PA, half each, and NOC's 20 by the uncarried parties pro rata. What paying interest does EKO reach?",
 "59.807692: 40 plus 12.307692 plus 7.500000.",
 ["50.000000, as on the Ekene carry.",
  "47.500000, as on the half carry in stated shares, EKO carrying 7.500000 of one carry.",
  "40.192308, its participating interest plus a share of each carry."],
 "EKO's paying interest is its participating interest of 40.000000 plus its carry points on both carries, NOC 12.307692 and PB 7.500000, which is 59.807692. 50.000000 is its figure under one carry, 47.500000 under the half carry, and 40.192308 is PA's paying interest on int-two-carries.")

q(2, "A carry is stated with carried and carriedPct but no carriers. What does the engine do?",
 "It refuses: the carriers must be stated, with no default.",
 ["It applies pro rata carriers and says so.",
  "A refusal naming carries[0].carriedPct.",
  "It leaves the carried party paying its own share, as though the carry had never been stated in the box."],
 "The engine refuses, in its own words: carries[0].carriers must be \"pro-rata\" or an object of carrier shares in per cent (no default); got nothing. The field it names is carries[0].carriers; the carried percentage is stated. It chooses no carriers' rule for the box and does not compute as if the carry were absent.")

q(0, "Stated carrier shares of 60 and 30 are typed for a carry. What happens?",
 "The engine refuses, printing the sum of 90 it found.",
 ["The shares are rescaled pro rata to 100, and a reason says so.",
  "The missing 10 stays with the carried party.",
  "The missing 10 is spread over the parties the stated shares leave out, pro rata to their participating interests."],
 "Stated shares must sum to 100. The engine refuses, in its own words: carries[0].carriers must sum to 100; got a sum of 90. It rescales nothing and assigns the missing 10 to nobody, because each would compute on a carry the agreement did not state.")

q(3, "A second carry names NOC, itself carried, among its carriers. What is the engine's answer?",
 "A refusal: a carried party cannot carry another.",
 ["Its part passes to its own carriers.",
  "It pays its part from its production.",
  "A refusal naming carries[1].carried."],
 "The engine refuses, in its own words: carries[1].carriers.NOC is a carried party and cannot carry another. The field it names is the carrier, carries[1].carriers.NOC, and nothing is wrong with the party the second carry names as carried. It passes nothing on to other carriers and takes nothing from NOC's production share.")

q(1, "Someone types carriedPct as 0 when stating a carry. How does the engine answer?",
 "It refuses, since carriedPct must be above 0 and at most 100.",
 ["It treats the carry as absent and returns the participating interests as the paying interests.",
  "It treats 0 as no limit stated and carries the whole share.",
  "It accepts it with a reason: the party pays its whole share."],
 "The carried percentage states how much of the carried party's cost share moves to its carriers, so a figure of 0 states no carry at all and the engine refuses it. Its own words: carries[0].carriedPct must be a number above 0 and at most 100; got 0. Reading 0 as an absent carry or as a full one would compute on a term the agreement never stated.")

q(3, "The carries of a box name every party as carried. What does the engine return?",
 "A refusal: at least one party must be left not carried.",
 ["The participating interests as the paying interests, since the carries cancel out.",
  "A refusal naming parties, as the carried shares leave no cost to split.",
  "A result in which the carries are applied in order, the last one dropped with a reason saying so."],
 "A carry must leave at least one party paying. The engine refuses, in its own words: carries must be leaving at least one party that is not carried; got [\"A\",\"B\"]. The field it names is carries, and the parties themselves are stated correctly. Carries do not cancel, and the engine drops no carry.")

q(2, "The reason for int-two-carries prints EKO's part of NOC's carry with many more digits than the table's 12.307692. Why?",
 "Inside a message a percentage prints as the shortest round-trip decimal of the double the engine holds.",
 ["A different carriers' rule applies in the reason, so the two are different figures.",
  "The table rounds the figure after the carry is repaid, and the reason prints it before.",
  "The reason adds EKO's stated share of PB's carry to its part of NOC's carry, so its figure is a sum."],
 "The course prints every share to six decimals, so the field reads 12.307692, while inside a message a percentage or rate prints as the shortest round-trip decimal of the double the engine holds. Both come from the same pro rata rule and the same number, and the reason for NOC's carry names only NOC's carriers.")

emit(Q, '/root/cat-wip-joa/banks/ec9b_m03.json', expect_n=15)
finish()
