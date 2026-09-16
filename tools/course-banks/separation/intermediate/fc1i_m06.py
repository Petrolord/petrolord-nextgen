import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Professional m06, the Professional reading. Digest Section 12 for the
# judged station, with the tier's own figures where the reading recaps them.

q(1, "The ERHA station reports 69 comparisons carrying a positive requirement and 21 pairs carrying none. What puts a pair in one group rather than the other?",
 "A pair counts as a check when the table gives it a positive requirement, and a table figure of 0.000000 m is counted on its own instead.",
 ["A pair counts when both items are placed and the distance between them is under the requirement, so the 21 are the pairs that cleared the figure they were held against.",
  "A pair counts when its requirement came out of the table, and the 21 are pairs whose requirement was computed from a flare duty or a bund instead.",
  "A pair counts when the two items share a type, and the 21 are the mixed pairs."],
 "Valve and relief-valve pairs score 0.000000 m in this table. They are reported separately so that a clean sheet cannot be built out of pairs nobody judged.")

q(3, "worstAbsolute names the flare against the control room at 43.8223 m short, and worstRelative names one transfer pump against the other at 0.597753 of its requirement. Why does the engine report both?",
 "They answer different questions and they name different pairs, so a reviewer who reads one ranking has read half the plot.",
 ["The absolute ranking covers spacing breaches and the relative one covers radiation breaches, so between them they carry the two kinds of requirement on the plan.",
  "The relative ranking is the one the engine calls worst, and the absolute figure is printed beside it for scale.",
  "Both name the same pair on most plots, and ERHA happens to be the exception."],
 "A pump 1.7933 m short of 3.0000 m is the sharpest breach in proportion. A control room 43.8223 m short of 90.0000 m is the largest in metres.")

q(0, "Transfer pump A stands 1.2067 m from Transfer pump B against a requirement of 3.000000 m. Why does that pair matter more than it looks?",
 "It is the sharpest breach on the plot in proportion, at 0.597753 of its requirement, and a gap of 1.7933 m is the sort of finding a reader scanning for large numbers walks straight past.",
 ["It is the largest breach in metres on the plot, which is why the nearest-neighbour listing puts it above the flare and the control room.",
  "It is the only pair on the plot for which the table carries no figure, so the shortfall cannot be scored at all.",
  "It is a pair of one type, and the table doubles the requirement for those."],
 "The nearest-neighbour reading is how a reviewer comes across it. The flare to the control room is 43.8223 m short and is the worst in metres.")

q(2, "The ERHA check reports 2 skipped items. What were they?",
 "A tank with bad coordinates and a radiation source that was never placed on the plan.",
 ["Two pairs whose requirement came back as null from the table, which the check sets aside because no figure exists to hold a distance against.",
  "Two comparisons that failed the table and the computed setback together, which are reported once rather than twice in the violation list.",
  "Two items whose type the table does not carry, which is the same count as the unknown type pairs."],
 "They are recorded as tk2 with bad-coordinates and fl2 with radiation-source-not-placed. Skipped items are part of why complete is false on this plot.")

q(1, "The station reports 12 unknown type pairs, all of them from one chemical injection skid. What does that do to the reading?",
 "The layout cannot be called complete, because a pair the table has no row for was never judged against anything.",
 ["The 12 join the 21 pairs with no requirement, since a null and a zero both describe a comparison the table declined to score.",
  "The check treats them as passing, because an item the table does not carry can impose no distance on anything around it.",
  "The skid is dropped and the remaining items are checked again."],
 "The production manifold's nearest neighbour is that skid at 5.8533 m, against a requirement of null. A table with no row for modern equipment leaves a real plot incomplete.")

q(0, "ABANA-2 at 8.000000 ft reports a liquid requirement of 23.270539 ft, a gas requirement of 2.396801 ft and a margin of 1.668891. What is the full reading?",
 "A vessel 23.270539 ft long, controlled by the liquid, carrying its gas with room to spare at a slenderness of 2.908817 outside the band.",
 ["A vessel 23.270539 ft long whose gas requirement of 2.396801 ft has been satisfied by that length, which is what the margin of 1.668891 records.",
  "A vessel 2.396801 ft long, the gas being the binding requirement at that margin.",
  "A vessel that fails on slenderness and is therefore not reported."],
 "Three answers travel together: the length, the requirement that set it, and whether the vessel carries its gas. A band of 3.000000 to 5.000000 is a separate preference.")

q(3, "A Professional answer sheet quotes a pressure, a gas rate and a site distance. Which conventions does it follow?",
 "600.000000 psig is written 614.700000 psia where it is absolute, the vessel sees 29.490437 ft3/s rather than 1273.148148 standard ft3/s, and site distances are metres to four decimals.",
 ["A gauge and an absolute pressure may stand in for each other, the standard rate is the one to quote, and site work is in feet as the vessel is.",
  "Pressures are quoted in psia throughout, rates in MMscfd, and distances in metres to six decimals.",
  "Vessel work is in metres and site work in feet."],
 "Vessel figures print to six decimals while metres, kilowatts and seconds print to four. Nothing on a plot plan is quoted in feet.")

q(2, "In the Professional reading, what does the slug catcher on ABANA come to?",
 "391.666667 bbl of working volume, a drum 10.527155 ft by 42.108619 ft, or a harp of 225.184350 ft in each finger.",
 ["350.000000 bbl of working volume, a drum 10.527155 ft by 42.108619 ft, and a harp carrying that same volume once a fill fraction of 0.600000 has been applied to its fingers.",
  "391.666667 bbl of working volume and a drum 42.108619 ft across, the slenderness of 4.000000 having been taken on the length rather than on the bore.",
  "3665.075231 bbl of working volume, which a fill fraction turns into a drum of 10.527155 ft."],
 "The slug of 350.000000 bbl plus 41.666667 bbl of normal inflow makes the working volume. The harp is sized on the slug alone, at 1125.921751 ft of pipe.")

q(0, "Of the figures 90.000000 m, 64.6458 m and 59.5294 m on the ERHA reading, which is a table figure and which are calculations?",
 "90.000000 m is the table, while 64.6458 m comes from 828000.0000 kW and 59.5294 m from an 18.000000 m bund.",
 ["All three are calculations, since the table figures were themselves solved at the allowable levels API 521 records for a control room and for a tank.",
  "90.000000 m and 64.6458 m are table figures for a flare, and only the pool radius of 59.5294 m is computed from a duty.",
  "All three are table figures, which is why they are held for the literature."],
 "A computed setback moves when the duty moves. The flare setback follows the relief rate and the pool radius follows the size of the bund.")

q(1, "Four gaps turn up in a Professional exercise: a level of 1, a missing slug volume, a table pair with no entry, and a pool answer inside the flame height. What do they share?",
 "Each of them is an answer in itself, and writing a plausible figure into any of them turns a correct reading into a wrong one.",
 ["Each of them is a state the engine recovers from by supplying its own default, so a reader has to find out which default was applied before quoting the result.",
  "Each of them is a thrown SeparatorInputError naming the input it came from.",
  "Each of them is reported as a zero for the reader to interpret."],
 "A level of 1 is refused by name, a missing slug volume returns an error naming the studio that owns it, a table pair returns null, and a pool result carries setbackStatus within-pool-edge.")

q(2, "Why does this tier insist that a vessel figure is quoted to six decimals and a site figure to four?",
 "Because rounding on the way to an answer changes the answer: a margin of 0.938751 rounds to one, and one is a pass on a vessel whose verdict is false.",
 ["Because the goldens are recorded at those precisions and a figure quoted any other way is refused by the studio form before it can reach a marking sheet at all.",
  "Because vessel work is in feet and site work in metres, and a metre carries fewer significant figures.",
  "Because a capstone is marked to the digit."],
 "Six decimals on a vessel and four on a site are the precisions the two halves of this engine print. A figure rounded on the way to an answer is a different answer, and a reader cannot tell which they were handed.")

q(3, "A sheet quotes a liquid requirement of 23.270539 ft for the 8.000000 ft drum on ABANA-2, with the duty named and the requirement labelled. Which condition is still missing?",
 "The level of 0.500000, since the same drum on the same duty asks for 46.113917 ft at 0.300000.",
 ["The slenderness of 2.908817, which is the only figure saying whether a length belongs to a vessel that can be built and transported.",
  "The controlling requirement, because a length with no label beside it could as easily have been the gas requirement of 2.396801 ft.",
  "The retention volume of 584.852431 ft3, without which the length cannot be checked against the area at all."],
 "Neither length is wrong and only one was asked for. A length is meaningless without the level it was sized at.")

q(1, "Before the repair, a layout that had checked nothing came back with a pass. Why is that reading dangerous on a plot like ERHA?",
 "A clean sheet could then come from a plan where the table had no row for most of its pairs, which is what 12 unknown type pairs and 2 skipped items would produce.",
 ["A pass computed from nothing still carries worstAbsolute and worstRelative, so a reviewer sees two rankings naming pairs that were never compared.",
  "A plan with 21 pairs carrying no requirement would report those as failures instead, which is the opposite error and every bit as misleading.",
  "It would move the six breaches out of the violation list."],
 "ERHA reports 69 checks and still comes back incomplete. A verdict has to say how much was judged before a pass means anything.")

q(0, "The inlet separator's nearest neighbour is its own dump valve at 2.8348 m against a requirement of 0.000000 m, and the production manifold's is a skid at 5.8533 m against null. Which of those is a finding?",
 "Neither is a breach, and the null is the one worth noting, because a pair with no table row leaves the layout incomplete.",
 ["Both are findings, since a distance under 3.000000 m between any two items is the shortest spacing the table carries anywhere on the plot.",
  "The dump valve at 2.8348 m, because a requirement of 0.000000 m means no separation was ever agreed.",
  "The skid, because 5.8533 m is under 15.000000 m."],
 "A requirement of 0.000000 m is a pair the table scores at nothing. A requirement of null is a pair it cannot score at all, and 12 of those sit on this plan.")

q(2, "This tier treats the liquid in a horizontal drum as one phase. What does the tier after it add, and what does that change about the chord?",
 "A second liquid with its own surface inside the liquid area, placed at its own height by the retention times, which is a different surface from the gas-liquid chord of 8.000000 ft at half full.",
 ["A second liquid whose surface is the chord itself, which is why a chord is reported at every level of the cross-section table.",
  "A droplet specification, which turns the chord into the height a drop has to cross.",
  "A wider slenderness band, which moves the chord with it."],
 "Reading the chord as the height of a water layer is the error the retired app made. The chord is a width across the drum and an interface is a height inside the liquid.")

emit(Q, '/root/fc-wip-separation/banks/fc1i_m06.json', expect_n=15)
finish()
