import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Expert m05, Losses and what control saves. Digest SECTION 29 only.
# 15 questions.

q(1, "The engine returns the annual loss on this tank as 77142.8167 lb/yr and again as 38.5714 short tons/yr. Why both?",
 "Because an operations engineer works in one unit and an emissions inventory is filed in the other, and a conversion done in correspondence eventually arrives wrong.",
 ["Because the two figures come from different relations, one over the vapour space and one over the throughput, and the units keep the two apart in the result.",
  "Because the emissions figure carries a control efficiency and the operations figure does not, so the two are the same loss before and after control.",
  "Because the short tons figure is the total and the pounds figure is the standing half, which is the half a cost estimate is built on."],
 "Returning both renderings makes the conversion part of the result rather than part of the correspondence, and the two rows are the same quantity.")

q(3, "What is the difference in mechanism between the standing loss and the working loss?",
 "Standing loss is breathing while nothing moves, and working loss is displacement by liquid coming in.",
 ["Standing loss is what a tank loses through the shell and the roof seams, and working loss is what leaves through the vent while the tank is breathing on the weather.",
  "Standing loss is the loss at zero throughput and working loss is the loss above the design liquid level, so the two are the same relation at two levels.",
  "Standing loss is what evaporates and working loss is what wets the shell."],
 "The standing half depends on the size of the vapour space and how much product vapour it holds, and the working half depends on throughput.")

q(2, "The digest prints a relation over the two halves of the annual loss. What does it carry?",
 "The standing loss at 3537.6108 lb/yr, the working loss at 73605.2059 lb/yr, a difference of -70067.5951 and a ratio of 0.048062.",
 ["A difference of 70067.5951 lb/yr, since a difference between two losses is printed as a magnitude and the sign is carried by the order of the two rows.",
  "A ratio of 0.048062 formed as the working loss over the standing loss.",
  "A ratio taken against the total of 77142.8167 lb/yr rather than against a half."],
 "The relation prints the standing loss first, so the difference of -70067.5951 is the first value less the second and the ratio of 0.048062 runs in the same order.")

q(0, "Why does this module tell a reader to look at the split before the total?",
 "Two tanks with the same annual loss and opposite splits are two different problems with two different answers.",
 ["Because the total is in pounds a year and the two halves in short tons a year.",
  "Because the total is the figure an emissions inventory takes and the halves are the figures a cost estimate takes, so the audience decides which to read.",
  "Because the total carries the control efficiency and the halves do not."],
 "Control equipment does not treat the two halves alike, so on a total of 77142.8167 lb/yr the split is what tells you which family of equipment is worth pricing.")

q(1, "The engine returns a vapour space expansion factor of 0.042556 and a saturation factor of 0.654638 beside the loss. What are they for?",
 "So a reader can tell which factor an input moved, rather than watching a total change and guessing why.",
 ["So the two can be multiplied together to recover the standing loss.",
  "So the two can be quoted on their own as screening figures for a tank of this kind, in the way a rate per barrel of capacity is quoted for venting.",
  "So a reviewer can check the two against the published tables."],
 "A loss figure is a product of several factors, and a reader who has only the total has to guess which one an input moved.")

q(0, "A product with a true vapour pressure of 15.4 psia is submitted to the loss calculation. What does the engine return?",
 "`a true vapour pressure of 15.4 psia is at or above the stated atmospheric pressure of 14.7 psia: the product boils at ambient and this is not a fixed-roof tank problem. It needs a pressure vessel or a refrigerated tank, and these relations do not apply to it`",
 ["A standing loss of zero with a note saying the expansion factor has collapsed, and a working loss computed normally, so the total is the working half alone.",
  "A total loss computed from the working half with the standing half omitted, and a warning that the figure is an extrapolation above the range of the relations.",
  "A refusal naming the control efficiency, because a product at atmospheric pressure cannot be controlled to any stated efficiency by a recovery unit."],
 "The refusal redirects as well as declining: it names the equipment the question actually needs rather than only saying the calculation cannot be done.")

q(2, "Which half of the loss carries the denominator that fails on a product boiling at ambient?",
 "The standing loss, through the vapour space expansion factor.",
 ["The working loss, because the throughput of 484000.0000 bbl a year is divided by the vapour pressure to form the turnover effect in that half.",
  "Both halves, because the vapour density of 0.027086 lb/ft3 is formed from the vapour pressure and it multiplies each of the two halves in turn.",
  "Neither half, because the relations are written on the difference between the two pressures rather than on a quotient of them."],
 "The expansion factor carries the difference between atmospheric pressure and the vapour pressure in a denominator, so at or above atmospheric there is no standing loss to return.")

q(3, "What would a package that returned only the total show for a product that boils at ambient?",
 "A number that looked like a loss, because the working half would still produce one.",
 ["A refusal, because a total cannot be formed while one of its two components is undefined and the sum would inherit the undefined component.",
  "A zero, because the working half is a fraction of the standing half.",
  "A total far above the real one, because the expansion factor would grow without limit as the vapour pressure approached the atmospheric pressure."],
 "A reader seeing only the sum has no way of knowing that one of its components was undefined, which is a good argument for engines returning their components.")

q(1, "What does the engine say about the turnover side of the working loss?",
 "That it is the stated workingTurnoverFactor, because AP-42's turnover factor Kn is not carried and a turnover count is not an input here.",
 ["That a turnover count is taken as an input and applied through the published factor, which is why the throughput appears twice in the working half.",
  "That the turnover effect is read from the same table the saturation factor is read from.",
  "That the turnover effect is withheld by name, in the way a required emergency vent capacity is withheld, so no working loss is returned."],
 "An input a package cannot honour should not be accepted, because accepting it moves the error out of the engine and into a user's head.")

q(2, "The engine is asked for the saving from a control device and no efficiency is supplied. What comes back?",
 "`a control efficiency is needed: leaving it out is not the same as saying zero`",
 ["The saving at the lowest efficiency in the table, which is 60.000000 percent, so a caller who omits the figure is given the most conservative of the cases.",
  "A saving of zero with the total of 77142.8167 lb/yr carried through as the remaining loss, which is the uncontrolled case and the safe default to report.",
  "A saving at a stated default efficiency, with the default named."],
 "An omitted input is unknown and a zero is a claim, and a package that treats the first as the second has invented an answer on the user's behalf.")

q(0, "A control efficiency of 140 percent is submitted. What does the engine do with it?",
 "It refuses, because an efficiency lies between 0 and 100.",
 ["It clamps the figure to 100.000000 percent and returns the whole of the loss as saved, with a note saying the input was above the range and was limited.",
  "It applies the figure and returns a remaining loss below zero, which is the sign a downstream reader is expected to catch before quoting the saving.",
  "It returns the saving at the highest efficiency in its own table, which is 98.000000 percent for a vapour recovery unit on a tank of this kind."],
 "The two loss control refusals are a pair: one fires on an input that is present and impossible, and the other on an input that is absent.")

q(3, "At a control efficiency of 90.000000 percent on this tank, what does the engine return?",
 "A saving of 69428.5350 lb/yr and a remaining loss of 7714.2817 lb/yr.",
 ["A saving of 73285.6759 lb/yr and a remaining loss of 3857.1408 lb/yr, which is the row a floating roof is customarily credited with on a tank of this throughput.",
  "A saving of 57857.1125 lb/yr and a remaining loss of 19285.7042 lb/yr, since the saving is applied to the working half of the loss and not to the standing half.",
  "A saving of 75599.9604 lb/yr and a remaining loss of 1542.8563 lb/yr, because the efficiency is applied to the total and then again to the standing loss."],
 "The table answers a conditional question: given an efficiency, the saving and the remaining loss both follow from the total of 77142.8167 lb/yr.")

q(1, "Where do the efficiencies in the control table come from?",
 "They are typed, because an internal floating roof customarily saves 60 to 90 percent and a vapour recovery unit 90 to 98 percent, and both are equipment and operating questions.",
 ["They are computed from the split between the two halves of the loss, since a device that works on one half can only save the share that half carries.",
  "They are read from the vendor curve the package carries for each device family, which is why the table stops at the highest certified figure.",
  "They are the efficiencies at which the remaining loss falls below a reporting threshold, which is what makes them the rows worth printing."],
 "The engine supplies the arithmetic and declines to supply the efficiency, which comes from a vendor quotation, a performance test or an operating history.")

q(2, "The vapour space volume comes back as 12844.2382 ft3. What is it?",
 "The same cylinder the rest of this tier works on, taken over the vapour space height of 4.200000 ft.",
 ["The volume between the design liquid level and the top of the shell, which is the space a fixed roof leaves above a tank filled to its design level.",
  "The volume of vapour that leaves the tank in a year, which is what the annual throughput of 484000.0000 bbl displaces out of the roof space.",
  "The volume the expansion factor of 0.042556 is applied to twice a day."],
 "It is the third answer this tier has taken out of one geometry, after the capacity and the wetted area.")

q(0, "Why does this tier put evaporative losses in the same module as money and emissions?",
 "Because what leaves the roof space is product that was bought and a release that has to be reported, and the two are the same arithmetic.",
 ["Because an emissions inventory is filed on the standing half and a cost estimate is built on the working half.",
  "Because the loss relations take a price per barrel as an input alongside the throughput.",
  "Because the control efficiencies in the table are set by the reporting threshold rather than by the equipment."],
 "The engine returns 77142.8167 lb/yr and 38.5714 short tons/yr for the same loss, so reading the result twice costs nothing.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/advanced/fc8a_m05.json', expect_n=15)
finish()
