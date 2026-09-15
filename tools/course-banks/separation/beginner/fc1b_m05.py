import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Associate m05, The Vertical Vessel. Digest section 5.

q(2, "ABANA-1 puts 4.825708 ft3/s through a vessel whose drops settle at 1.458422 ft/s. What is the whole of the diameter calculation?",
 "The rate over the velocity is an area of 3.308855 ft2, and a circle of that area is 2.052551 ft across.",
 ["The rate over the velocity is a volume, divided by the liquid depth of 10.605223 ft.",
  "The rate times the velocity gives the area, and the diameter follows from it.",
  "The standard rate of 208.333333 standard ft3/s over the velocity, since the floor has to be large enough for the gas the meter counted rather than for the volume at conditions."],
 "That is the whole calculation. The rate came from the conditions, the velocity came from K and the two densities, and the geometry is a circle."),

q(0, "A result reports a velocity margin of exactly 1.000000. What does that tell a reader?",
 "The diameter was computed from the gas rather than chosen from a list.",
 ["The vessel is one size below the smallest that works, which is why a reader steps to the next offered diameter whenever a margin of exactly 1.000000 appears on a row.",
  "The gas velocity and the liquid depth are in balance.",
  "The vessel was sized on a K that was neither derated nor floored, since a margin of exactly 1.000000 can only come from an undisturbed base row of the published table."],
 "At the gas-required diameter the gas velocity equals the settling velocity, so the margin is 1.000000 by construction. Both published vertical cases report it for that reason."),

q(3, "Two published vertical cases put 12.000000 and 30.000000 ft3/s through diameters of 4.239711 and 5.641896 ft. Why did a rate two and a half times larger buy so little diameter?",
 "Diameter enters through area, so duty and diameter are related by a square root.",
 ["The two cases carry retention times of 3.000000 and 2.000000 minutes, and the shorter hold took most of the extra duty out of the larger vessel before its gas was sized at all.",
  "The faster of the two settling velocities absorbed the extra rate.",
  "A vertical vessel takes the larger of its gas and liquid diameters."],
 "The rate rose by two and a half times and the diameter by about a third. A small increase in diameter buys a surprisingly large increase in capacity."),

q(1, "A basis says to hold the oil 3.000000 minutes, and 2600.000000 bpd of oil is used in place of the 3000.000000 bpd of total liquid. What does the vessel lose?",
 "The 400.000000 bpd of water, which occupies the vessel whether or not the retention basis was written for it.",
 ["Nothing at all, since the water settles below the oil and 35.091146 ft3 is the room the oil needs.",
  "Its diameter, since the retention volume sets the floor area of a vertical vessel.",
  "Its allowance, since the 6.000000 ft above the liquid is scaled from the liquid rate and a smaller rate leaves less room for the disengagement that allowance pays for."],
 "35.091146 ft3 is 3000.000000 bpd held 3.000000 minutes. Holding 2600.000000 bpd instead gives a volume and a depth about a seventh short."),

q(0, "Going from 2.000000 to 4.000000 ft of diameter takes the ABANA-1 liquid from 11.169859 to 2.792465 ft. Why four times shallower for twice the width?",
 "The same 35.091146 ft3 is spread over an area that went up four times.",
 ["The retention volume falls as the diameter rises.",
  "The depth is the volume over the circumference rather than over the area, and the circumference doubled while the volume stayed where it was, which is the first factor of two.",
  "The allowance of 6.000000 ft is a fixed part of the height, so a taller vessel carries proportionally less of it and the liquid depth absorbs the whole of the change."],
 "Divide the volume by the floor area and the result is a depth, so depth is inversely proportional to area. The same 35.091146 ft3 is in the vessel on every row."),

q(1, "vertical12ft3sGasSized holds 2.485623 ft of liquid and finishes at 8.485623 ft, and vertical30ft3sGasSized holds 2.495370 ft and finishes at 9.495370 ft. What separates the two heights?",
 "Their allowances of 6.000000 and 7.000000 ft, since an allowance is a single figure added to the depth and it scales with nothing.",
 ["Their diameters of 4.239711 and 5.641896 ft, since a wider vessel needs more room above the liquid.",
  "Their gas rates of 12.000000 and 30.000000 ft3/s, since the gas slows down above the liquid.",
  "Their retention times of 3.000000 and 2.000000 minutes, which set the two liquid depths."],
 "The two liquid depths are within a hundredth of a foot of each other. On a short vessel the allowance is most of the height."),

q(2, "A designer widens a drum in order to shorten it. What stops the height falling indefinitely?",
 "The allowance, because the liquid depth tends toward zero as the vessel widens while the allowance does not move at all.",
 ["The slenderness, because a ratio below about two is a shape nobody builds.",
  "The gas-required diameter of 2.052551 ft, which is a floor on the width.",
  "The retention volume of 35.091146 ft3, which has to fit the vessel whatever its shape."],
 "It is a single figure added to the liquid depth. A vessel cannot be shortened below its allowance however wide it gets."),

q(3, "At 2.000000 ft the ABANA-1 vessel returns a liquid depth of 11.169859 ft, a height of 17.169859 ft, a slenderness of 8.584929 and a margin of 0.949450. Which of those makes it unbuildable?",
 "The margin, because below 1 the gas moves faster than a drop can fall.",
 ["The slenderness of 8.584929, which is the highest of the five diameters offered and is a shape a fabricator refuses long before any verdict about the gas is reached.",
  "The height of 17.169859 ft in a drum 2.000000 ft across.",
  "None of them. The row returns four ordinary numbers and the engine reports it as feasible, since a margin within about five parts in a hundred of 1 is inside the method's tolerance."],
 "The gas crosses at 1.536071 ft/s against a settling velocity of 1.458422 ft/s. Every column in that row prints a perfectly ordinary number, and the verdict is the only thing saying the vessel is unusable."),

q(1, "The gas needs 2.052551 ft and the shop offers 2.000000 ft and 2.500000 ft. Which rounding rule applies, and why is nearest the wrong one?",
 "Round up, because a required minimum has tolerance on one side only.",
 ["Round to nearest once the margin has been checked, since 2.000000 ft returns 0.949450 and a margin within a tenth of 1 is reported by the engine as a vessel that carries its gas.",
  "Round up, because the offered sizes are outside diameters.",
  "Round to nearest, because the gas-required diameter rests on a K the module records as unverified, and rounding a soft figure to the nearest hard one is the ordinary practice."],
 "Nearest is right for a dimension with tolerance on both sides. Taking 2.000000 ft turns a vessel with no margin into a vessel with a margin of 0.949450."),

q(2, "The 3.000000 ft vessel carries a margin of 2.136263. How should that be read to somebody asking how much room the design has?",
 "It can take more than twice its gas rate before it stops separating.",
 ["It can take about twice its liquid rate too, since the margin is the ratio of the settling velocity to the gas velocity and both scale with the throughput of the vessel.",
  "It is more than twice as comfortable as the 2.500000 ft vessel at 1.483516, which is the comparison a margin is reported for and the one a reviewer ought to quote.",
  "It stands at twice the required diameter, since a margin of 2.136263 at 3.000000 ft is measured against the gas-required 2.052551 ft the same stream produced."],
 "The margin is the settling velocity over the actual gas velocity, 1.458422 ft/s against 0.682698 ft/s at that diameter. The liquid side has its own dimension and the margin says nothing about it."),

q(0, "L/D runs from 8.584929 at the narrowest vessel to 2.198116 at the widest. What does this method do with that figure?",
 "It reports the ratio and declines to judge it.",
 ["It rejects any vessel outside the band a fabricator will quote, which is why the 2.000000 ft row at 8.584929 is reported as unable to carry the gas it was given.",
  "It uses the ratio to choose among the offered sizes, preferring the row nearest the middle of the range, which on this stream is the 3.000000 ft vessel at 3.654794.",
  "It turns the ratio into a wall thickness and a weight, which is how a slenderness becomes a cost and how two vessels of the same duty are compared with each other."],
 "Wind and seismic loading, foundation cost, platform space and getting a mist extractor in and out all sit outside this calculation. Slenderness has no opinion about wall thickness, pressure rating or weight."),

q(3, "The 2.000000 ft vessel is unusable on one count and awkward on another. Which is which?",
 "The margin of 0.949450 disqualifies it and the slenderness of 8.584929 only makes it awkward.",
 ["The slenderness of 8.584929 disqualifies it and the margin is recoverable.",
  "Both disqualify it, since the engine reports that it does not carry its gas and reports a slenderness outside any reasonable band, and a row failing twice is refused rather than reported.",
  "Neither disqualifies it. The engine returns every column and leaves the judgements."],
 "Feasibility is a separate question from size and it has to be answered first. A margin below 1 means the vessel does not carry its gas whatever its other numbers look like."),

q(1, "The height falls and the margin rises all the way from 2.000000 to 4.000000 ft. Why would anyone not simply take the widest vessel?",
 "A wider drum costs more steel per foot, and at 4.000000 ft a slenderness of 2.198116 is approaching a shape that is more a tank than a separator.",
 ["Because a margin of 3.797800 is above the range the method is valid in.",
  "Because a liquid depth of 2.792465 ft is too shallow for a level controller to work against.",
  "Because the retention volume of 35.091146 ft3 would no longer fit in a wider drum."],
 "Both changes are improvements in this calculation and both cost money in the yard. Margin rises with diameter for free here, and a vessel at 3.797800 carries capacity nobody asked for."),

q(2, "A margin of 2.136263 is a ratio against what?",
 "An allowable velocity whose K was read from a table and then derated by a rule the module records as customary practice with an unchecked published form.",
 ["A measured carryover velocity for that arrangement, since the six base rows were fitted to observed carryover.",
  "The settling velocity of a drop of the size the mesh pad is rated to remove.",
  "The gas velocity at 2.000000 ft of 1.536071 ft/s, which is the reference every other diameter on the list is measured against."],
 "The margin inherits whatever the allowable is worth. 1.458422 ft/s on ABANA-1 was built from a K of 0.300000 that the module derated from a base row of 0.350000."),

q(0, "The gas-required diameter of 2.052551 ft describes a vessel with a floor and no height. Which liquid quantities have not entered it?",
 "The retention time, the liquid rate and the allowance.",
 ["The liquid density of 55.171463 lb/ft3, which arrives only later, when the retention volume of 35.091146 ft3 is turned into a depth against the floor area.",
  "The water cut, since a mixture of 55.171463 lb/ft3 is computed from the oil density alone until a three-phase vessel is being sized and the water rate is read in.",
  "None of them. All three are inputs to the area of 3.308855 ft2, and the height is a second calculation reusing figures the diameter has already consumed."],
 "The liquid supplies the height. The area of 3.308855 ft2 came from the actual gas rate and the settling velocity, and the liquid reaches that velocity only through the mixture density."),

emit(Q, '/root/fc-wip-separation/banks/fc1b_m05.json')
finish()
