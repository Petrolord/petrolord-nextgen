import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Associate m05, The Gravity Devices. Written from digest.txt Sections 6, 7
# and 8: the basin and the plate pack, the loading that sets their cut size,
# the velocity check that sizes the vessel, the allowance, the published cases,
# and what a cut size does to a droplet distribution.

q(1, "What does an API 421 basin remove, in one sentence, and what happens to the depth when that sentence is written as algebra?",
 "It removes the droplet that can rise the depth of the water in the time the water spends in the basin, and the depth cancels out.",
 ["It removes the droplet that can rise the depth of the water in the time the water spends in the basin, and the depth is what the answer then divides by.",
  "It removes every droplet coarser than the median of the inlet population, and the depth sets how much of the distribution that is.",
  "It removes the droplets that reach the surface before the residence time runs out, and the depth enters through the residence time alone."],
 "A droplet has further to rise in a deeper basin and is given proportionally longer to do it, so the depth leaves the expression entirely. What is left is the flow over the plan area."),

q(0, "What is the surface loading of a basin, and what is done to it before a cut size comes out?",
 "The flow divided by the plan area, multiplied by an allowance for turbulence and short-circuiting, and the rise balance is then inverted at the result.",
 ["The flow divided by the cross section the water actually moves through, which is compared against the fixed velocity limit before any cut size at all is reported.",
  "The flow divided by the plan area, multiplied by the plate efficiency factor of 0.7, which is the fraction of that area that settles.",
  "The rise velocity of the median droplet, multiplied by the residence time, which gives the depth a droplet can clear."],
 "The loading has units of velocity and it is the rise velocity a droplet must beat to get out. The flow over the cross section is the horizontal velocity, which is a separate check, and the efficiency factor belongs to a plate pack."),

q(2, "The UZERE basin is run at two water depths, 1.4 m and 0.9 m, and everything else is held. What happens?",
 "The cut size is 165.003927 micron on both rows, and the horizontal velocity rises from 0.014154851756 to 0.022018658288 m/s.",
 ["The cut size falls from 165.003927 micron to a finer figure, because a shallower basin gives every droplet less distance to travel.",
  "The cut size is 165.003927 micron on both rows and the residence time is 706.471546 s on both, because the flow and the plan area did not move.",
  "The cut size coarsens because the residence time falls from 706.471546 s to 454.160279 s, and the warning on the second row says so."],
 "The plan area and the flow are what the cut size is built from, and neither moved. The residence falls with the depth because the same flow through a smaller cross section moves faster and stays a shorter time, and the shallow row carries the velocity warning."),

q(3, "Why does a basin need a horizontal velocity check at all when its cut size is acceptable?",
 "Oil that has already risen to the surface is dragged back into the bulk and carried out when the water underneath moves fast enough, which a cut size calculation cannot see.",
 ["The horizontal velocity is what sets the residence time, so a fast basin gives its droplets too little time to reach the surface at all.",
  "The check is what fixes the plan area, since a basin sized on its cut size alone has no constraint on its length or its width.",
  "A fast basin carries the coarse droplets past the outlet before they can be skimmed, so the removal falls even where the cut size holds."],
 "The device does the separation and then undoes it, which is a separate failure with a separate criterion. The cut size question is only about whether a droplet can reach the top."),

q(1, "What does this module say about the API 421 horizontal velocity rule it applies?",
 "That only the fixed velocity half of the rule is applied here, marked on every return that carries the check.",
 ["That the rule is applied in full, with both halves reported, since the standard states the check as a single limiting velocity.",
  "That the rule is customary rather than published, so the module holds it as a warning and states no source for the figure.",
  "That the second half of the rule is applied and the fixed half is not, since a multiple of the design rise velocity is the tighter of the two."],
 "The standard limits the horizontal velocity to the lesser of a fixed velocity and a multiple of the design droplet rise velocity, and the second half is not in this repository. A basin that passes this check has passed half a rule, and the return says so rather than reporting a clean verdict."),

q(0, "Four basin footprints are swept from 12.000000 m2 of plan area to 80.000000, and the cut size falls from 242.879204 micron to 94.066711. The cut divided by the square root of the loading reads 3706.616030 on all four rows. What does that constant column establish?",
 "That the cut size goes as the square root of the surface loading exactly, with no other dependence hiding in the flow or the dimensions.",
 ["That the plan area is the only input the cut size responds to, since every other dimension of the basin has been shown to cancel.",
  "That the module reproduces the four published basin cases, since a constant ratio between the engine and a golden is what agreement looks like.",
  "That the cut size and the loading are the same quantity in different units, which is why the ratio between them does not move."],
 "A column that ought to hold still across a sweep, and does, is a statement about the form of the relationship. A hidden extra term in the flow or in the dimensions would show up as a drift without anybody reading the source."),

q(2, "What does the constant column in that sweep cost a designer who wants a finer cut?",
 "Halving the cut size costs four times the basin.",
 ["Halving the cut size costs twice the basin, since the loading and the cut size move together.",
  "Halving the cut size costs sixteen times the basin, because the driving force enters squared as well.",
  "Halving the cut size costs nothing in area and is bought by making the basin deeper instead."],
 "The cut size carries the square root of the loading, so the area carries the square of the improvement. Gravity separation runs into economics very quickly for that reason, and the depth does not enter the cut size at all."),

q(3, "The short-circuit allowance F is swept from 1 to 2.5 and the cut size runs from 134.725142 micron to 213.019154. What is the allowance for, and which way does raising it move the answer?",
 "It stands for the flow that reaches the outlet sooner than a uniform plug would, and raising it coarsens the cut size.",
 ["It stands for the fraction of the plan area that actually settles, and raising it coarsens the cut size.",
  "It stands for the turbulence a jetting inlet creates, and raising it refines the cut size by mixing the droplets across the depth.",
  "It stands for the margin between the design rise velocity and the horizontal velocity limit, and raising it refines the cut size."],
 "Real vessels do not cross as a uniform plug at one velocity, and the allowance raises the rise velocity a droplet must achieve, which coarsens the cut. It is the one place in this device where engineering judgement enters an otherwise closed calculation."),

q(1, "An allowance of 1 returns a cut size of 134.725142 micron with a warning, and an allowance of 0 is refused. Why are the two treated differently?",
 "An allowance of 1 is answerable and doubtful, and an allowance of zero or less is outside what the quantity means at all.",
 ["An allowance of 1 is inside the customary band of 1.3 to 1.8 and an allowance of 0 is outside it, which is the only distinction the module draws.",
  "An allowance of 1 produces a cut droplet inside the creeping flow band and an allowance of 0 produces one outside it.",
  "An allowance of 1 is the module's own default, so it is reported with a note, while any value a caller supplies is checked against the band."],
 "The engine says that F must be positive and that an F of zero or less leaves the separator undefined. The default is 1.5, the customary band is 1.3 to 1.8, and 1 sits outside that band and still answers."),

q(0, "What does this module do with an allowance of 6?",
 "It refuses, saying that F is a turbulence allowance customarily between 1.3 and 1.8, that this module holds it to 5, and that this is 6.",
 ["It answers with a warning that the allowance is outside its customary band, as it does at 1 and at 2.5.",
  "It refuses, saying that an allowance above the customary band would put the cut droplet outside creeping flow.",
  "It answers and marks the velocity rule as incomplete, because the allowance has left the range the published half of the rule is stated over."],
 "The refusal states what the quantity is before it states what was wrong with the input, which is the shape every guard in this engine takes. A refusal that only said the input was invalid would leave the caller guessing at the range."),

q(2, "A pack of 30 plates of 3 m2 reaches an effective area of 63.000000 m2. How was that figure built, and what does it change about the basin argument?",
 "The projected plate area times the plate count times a factor of 0.7, and it changes the area the flow is divided by while leaving the physics alone.",
 ["The projected plate area times the plate count times the short-circuit allowance of 1.5, which is what a pack of plates is credited with.",
  "The plan area of the vessel times the plate count, which is why a pack in a small box can reach the area of a very large basin.",
  "The projected plate area times the plate count, with the 0.7 applied afterwards to the cut size rather than to the area."],
 "Same physics, more area. The efficiency factor is the fraction of the projected area that actually settles, it is declared with no source in this repository, and it sits in the middle of the chain where the area, the design rise velocity and the cut size all move with it."),

q(1, "A plate pack is swept from 10 plates to 120 and the cut size falls from 149.908299 micron to 43.274798. What is the limit of that as a strategy?",
 "Stacking more plates keeps working and keeps costing, and no arrangement of settling surfaces reaches the finest droplets a produced water stream carries.",
 ["The cut size stops improving once the effective area passes the plan area of the vessel, which is where a pack runs out of room.",
  "The plate count enters the cut size linearly, so a pack has to be doubled in size for each micron of improvement.",
  "The pack begins to carry a warning past 60 plates, because the channels have become too narrow for the creeping flow assumption."],
 "The effective area runs from 21.000000 m2 to 252.000000 across that sweep and the cut size falls with the square root of the loading, exactly as the basin does. Devices that go further stop relying on gravity alone."),

q(3, "The published plate cases carry a channelHeightIndependence figure, and it comes out at 2.21e-14, 2.19e-14 and 2.15e-14. What is being proved?",
 "That a plate pack cut size does not depend on how the pack is sliced into channels, which follows from what the device is.",
 ["That the engine and the oracle agree on the plate cut size to that many digits, which is the gap between two independent methods.",
  "That the plate efficiency factor of 0.7 has been validated, since the three cases were run at different plate spacings.",
  "That the channel height is an input the module ignores, which is why a caller cannot supply one at all."],
 "The oracle marches the same pack at two different channel heights and reports the difference. The settling area is the same either way, so the requirement follows from the device rather than from a published comparison, and those three figures are the proof of it rather than the claim."),

q(0, "The four published basin cases come back at 44.331033, 99.128864, 188.080643 and 54.820774 micron against the golden values. What does the ratio column of that table read, and what does the set of cases show?",
 "It reads 1.000000000000 on every row, and the four are a spread of inputs rather than one comfortable case repeated.",
 ["It reads 1.000000000000 on every row, because the golden values are the engine's own answers recorded back into the file.",
  "It reads close to one, with the departure set by the Monte Carlo the oracle marches each case with.",
  "It reads 1.000000000000 on three rows and drifts on the fourth, which is the row whose cut droplet sits outside the band."],
 "The engine reproduces each published value to the digits printed, and the four cases differ in the flow and in every dimension of the vessel. A golden holding the engine's own answers back would agree with anything the engine later did."),

q(2, "A device is applied to the UZERE water at cut sizes from 30 micron down to 2, and the removal runs from 44.236922 percent to 99.398720 while the outlet median falls from 16.943389 micron to 4.880416. What are those two columns together saying?",
 "A tighter cut removes more of the oil and leaves a finer population behind, so the water each stage hands on is harder than the water it was given.",
 ["A tighter cut removes more of the oil and leaves a coarser population behind, since the fine droplets are the ones a low cut size takes out.",
  "A tighter cut removes more of the oil and leaves the same population behind, since a removal is a fraction of the volume and not of the sizes.",
  "The outlet median is what the removal is computed from, so the two columns are the same figure reported twice."],
 "A cut size acts on sizes, so the coarse end goes first whatever the cut is set to. Below a floor the module stops reporting an outlet median at all, because the shape of numerical dust means nothing."),

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/beginner/fc7b_m05.json', label='fc7b_m05', expect_n=15)
finish()
