import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Professional m03, gas capacity. Digest Section 9, with the conditions row
# from Section 2 where the actual rate has to be named. ABANA-2 and the
# published gas-overloaded case only.

q(0, "ABANA-2 puts 29.490437 ft3/s through 25.132741 ft2 at a level of 0.500000, which is 1.173387 ft/s. Where does that numerator come from?",
 "The 110.000000 MMscfd stream taken to 614.700000 psia, 95.000000 degF and a z of 0.908065, which is the volume the drum passes each second.",
 ["The 110.000000 MMscfd stream at standard conditions, which is 1273.148148 standard ft3/s and is the volume a separator running at 614.700000 psia has to move.",
  "The gas density of 2.239712 lb/ft3 multiplied by the gas area, which turns a mass rate into the volume the gas space is asked to carry.",
  "The settling velocity of 1.958255 ft/s times the gas area of 25.132741 ft2."],
 "The vessel sees 29.490437 ft3/s and nothing else. Dividing 1273.148148 standard ft3/s by an area gives a velocity tens of times too high.")

q(2, "The same 29.490437 ft3/s runs at 3.003871 ft/s in the 5.000000 ft drum and at 0.750968 ft/s in the 10.000000 ft drum. What does that say to somebody choosing a bore?",
 "Widening a narrow drum buys a great deal of gas room and widening a wide one buys very little, because the area climbs with the square of the bore.",
 ["Each extra foot of bore is worth the same fall in velocity, which is why the family is published at one foot steps from 5.000000 ft up to 10.000000 ft.",
  "The rate must have been recomputed for each bore, since one stream cannot give four times the area a quarter of the speed.",
  "The level was raised on the wider drums to keep the margin comfortable."],
 "From 5.000000 ft to 6.000000 ft the velocity falls from 3.003871 ft/s to 2.086022 ft/s. From 9.000000 ft to 10.000000 ft the same foot is worth 0.927121 ft/s down to 0.750968 ft/s.")

q(1, "What does the margin of 1.668891 on the 8.000000 ft drum measure?",
 "The settling velocity of 1.958255 ft/s divided by the gas velocity of 1.173387 ft/s, so the gas in the gas space moves more slowly than a droplet falls through it.",
 ["The gas velocity divided by the settling velocity, so any figure above one says the gas is winning and liquid is leaving with it.",
  "The gas area of 25.132741 ft2 as a share of the whole cross-section of 50.265482 ft2.",
  "The gas length of 2.396801 ft as a share of the gas height of 4.000000 ft."],
 "A margin above one says a droplet falls faster than the gas carries it along. Below one the gas is winning and liquid that should be landing leaves with it.")

q(3, "The 6.000000 ft drum returns a length of 41.369847 ft, a slenderness of 6.894974 and gasCapacityOk false. What can be built from that row?",
 "A fully dimensioned vessel that will not separate what the specification asked.",
 ["Nothing at all, because the engine withholds the dimensions of a vessel that fails its capacity check and prints the reasons in their place.",
  "A vessel whose verdict is advisory, since gasCapacityOk is a remark beside the dimensions rather than a field the sweep acts on.",
  "A vessel for a smaller stream, since the length of 41.369847 ft belongs to the liquid duty alone."],
 "A fabricator could build 41.369847 ft at a bore of 6.000000 ft from that row and every figure on it is arithmetically correct. The margin of 0.938751 is what says it will not do the job.")

q(2, "The verdict turns from false to true between the 6.000000 ft and the 7.000000 ft rows, at margins of 0.938751 and 1.277745. Why is that boundary worth printing?",
 "It shows a reviewer what anybody arguing for a smaller vessel is arguing against, which a sweep of the passing rows alone would hide.",
 ["It marks the bore at which the liquid requirement stops controlling the length, which on this family is where the two requirements cross each other.",
  "It fixes the smallest bore the stream can be given, since the engine will not report rows below the bore at which a verdict turns true.",
  "It shows where the margin passes one, which is the only row a sweep keeps."],
 "The repaired sweep returns every row with its reasons, so the failures stay beside the successes. The family crosses the threshold between 6.000000 ft and 7.000000 ft of bore.")

q(0, "A summary sheet rounds the 6.000000 ft drum's margin of 0.938751 to the nearest whole number. What has it reported?",
 "A margin of one on a drum whose verdict is false, because the rounded figure and the threshold are the same number.",
 ["The margin the engine would return at a level of 0.300000, since rounding a ratio has the same effect as moving the level that produced it.",
  "Nothing that matters, since the verdict of false travels beside the margin and cannot be rounded away.",
  "The 7.000000 ft drum's margin in the place of the 6.000000 ft drum's."],
 "The 6.000000 ft drum reports gasCapacityOk false at 0.938751. A reader handed the verdict alone cannot tell 1.277745 from 2.607642 either, so the pair travels together.")

q(3, "The settling velocity of 1.958255 ft/s on ABANA-2 is built from which inputs?",
 "A horizontal mesh K of 0.400000 with a liquid of 55.919504 lb/ft3 and a gas of 2.239712 lb/ft3, so an operating pressure change moves the density and the velocity together.",
 ["The gas velocity of 1.173387 ft/s and the margin of 1.668891, which are the two figures the capacity check holds against each other.",
  "The gas area of 25.132741 ft2 and the gas height of 4.000000 ft at a level of 0.500000.",
  "The droplet diameter the vessel is specified to take out of the gas."],
 "K, the two densities and therefore the pressure all move it, so a margin is not a fixed property of a vessel. The K of 0.400000 is itself a derated table value.")

q(1, "Why can the gas length never exceed the gas height on a vessel that passes its capacity check?",
 "The gas length is the velocity ratio times the gas height, and passing holds that ratio at one or below.",
 ["Because the capacity check compares the gas length against the gas height directly and returns gasCapacityOk false whenever the first of them is the larger.",
  "Because a droplet that has crossed the gas height has reached the liquid, so the engine caps the reported requirement at the height it crossed.",
  "Because the gas height at a level of 0.500000 is half the diameter, and no requirement may exceed half a bore."],
 "On the 8.000000 ft drum the gas height is 4.000000 ft and the gas length is 2.396801 ft. The overloaded published case breaks the bound at 16.976527 ft against 3.000000 ft.")

q(0, "Under this method, when can the gas requirement take control of a horizontal vessel's length?",
 "When the vessel is gas overloaded and has already failed the check, or when it is so wide for its duty that the liquid asks for less than its own gas height.",
 ["Whenever the settling velocity falls under the gas velocity of 1.173387 ft/s, which happens on any drum whose mist extractor was specified for a vertical vessel instead.",
  "Whenever the level is raised above 0.500000, since a higher level shortens the gas height and lengthens the ride a droplet has to take.",
  "On any row where the two requirements sit within a foot of each other."],
 "The published overloaded case is the first of those, at a margin of 0.176715 with gasCapacityOk false and a gas length of 16.976527 ft. On a passing vessel with a real liquid duty the gas cannot win.")

q(2, "The bound on the gas length is pinned by a gate on the engine. What has to be said about it alongside?",
 "It rests on Souders-Brown being borrowed as the droplet settling velocity, which is HELD FOR LITERATURE, so it is a property of this method rather than a fact about separators.",
 ["It rests on the capacity rule and the length requirement being taken at the same level, and the engine applies that rule at a level of 0.500000 while the length follows whatever level was typed into the sheet.",
  "It holds only for the six bores this family publishes, since the ratio was checked on those rows alone and a bore between two of them has never been put through the same gate.",
  "It applies to a vertical vessel too, where the gas height is the whole height."],
 "If the literature sizes a gas length from a stated droplet diameter, the ratio stops being the same quantity as the capacity check and the bound has to be read again from scratch.")

q(3, "The 5.000000 ft drum reports a margin of 0.651911 and the 10.000000 ft drum reports 2.607642. How should each be read?",
 "The first is a long way outside the check rather than a marginal case, and the second says the gas has more than twice the room it needs, which is a reason to ask what the extra steel bought.",
 ["Both sit inside the ordinary spread of a family, since a margin is a ratio and any positive value describes a vessel that works.",
  "The first is marginal and could be recovered by rounding, and the second is the row a sweep will prefer.",
  "The first fails on slenderness and the second fails on gas capacity."],
 "The 5.000000 ft row carries gas-capacity and ld-out-of-band together. A margin of 2.607642 is a comfortable vessel and an expensive one.")

q(1, "The 5.000000 ft row carries the reasons gas-capacity and ld-out-of-band. What different responses do those two ask for?",
 "The band can be restated by the project, and a capacity failure has to be designed out.",
 ["Both ask for a wider bore, since the slenderness of 11.914516 and the margin of 0.651911 are two readings of one shortage of cross-section on that row.",
  "The capacity failure can be waived by a reviewer with the authority, and the slenderness has to go back to the vendor for a different shell.",
  "Neither asks for anything, since a reason is a note attached to a row the sweep has already set aside."],
 "A slenderness outside the band is a preference somebody expressed. gasCapacityOk false at a margin of 0.651911 is the vessel failing to do the job it exists for.")

q(2, "The gas holds 25.132741 ft2 at a level of 0.500000 and 37.582708 ft2 at 0.300000 on the 8.000000 ft drum. What does that do to the capacity reading?",
 "The velocity falls from 1.173387 ft/s to 0.784681 ft/s, so the margin improves although nothing about the stream has changed.",
 ["The velocity falls and the settling velocity falls with it, since both are taken in the gas space, so the margin holds where it was.",
  "The margin holds, because the capacity check is taken at the level the vessel was sized at rather than the level it is run at.",
  "The verdict turns false, because a lower level shortens the fall a droplet makes."],
 "Gas velocity is the actual rate over the gas area. More area at the same 29.490437 ft3/s is slower gas and a larger margin, while the liquid side is losing the area it needs.")

q(0, "What goes missing when a report quotes gasCapacityOk true without the margin, or the margin without the verdict?",
 "The verdict on its own cannot tell 1.277745 from 2.607642, and the margin on its own leaves a reader to remember where the threshold sits.",
 ["The reasons list goes with them, which is the only place a row records whether its slenderness was inside the band of 3.000000 to 5.000000.",
  "The level the reading was taken at, which the engine prints beside the verdict.",
  "The gas area the velocity was divided by."],
 "The two answer different questions: whether the vessel carries its gas, and by how much. A margin of 0.938751 rounds to a pass and a bare true hides 2.607642.")

q(1, "Why does the repaired sweep report the rows that fail rather than dropping them?",
 "A reader can see what was rejected and why, so the boundary between 6.000000 ft and 7.000000 ft stays visible and nobody has to guess whether the smallest offered bore was ever considered.",
 ["The failing rows are needed to compute the preferred row, which is taken across the family once the reasons have been weighted against each other.",
  "A row that fails on gas may still pass on slenderness, and a sweep reports one reading at a time.",
  "The engine cannot tell a failing row from a passing one until a band is supplied."],
 "A sweep that printed only the vessels that worked would hide the boundary. Every row carries its own reasons, so 41.369847 ft at 6.000000 ft of bore is visible as a failure.")

emit(Q, '/root/fc-wip-separation/banks/fc1i_m03.json', expect_n=15)
finish()
