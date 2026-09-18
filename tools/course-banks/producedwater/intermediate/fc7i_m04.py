import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Professional m04, flotation. Digest Section 11 throughout, which
# Professional m04 owns. The residence straddle and its cut identity are
# Section 11's own rows. attachmentEfficiency is never graded here: it is
# named only where the question is what STATUS the module gives it.

q(3, "Why is a flotation cut size a rate question rather than a settling question?",
 "Because the oil leaves attached to gas, so what matters is how likely a droplet is to meet a bubble and stick in the time the water is in the cell.",
 ["Because the bubbles rise faster than any droplet settles, so the settling term drops out of the balance.",
  "Because the cell is stirred, which destroys the quiescent layer a settling calculation would need.",
  "Because the froth is skimmed continuously, so no droplet is ever given a fixed distance to travel."],
 "There is no distance a droplet has to cross in this device. The cut is the droplet the cell removes half of in its residence time, and that is a completely different shape of argument from a basin or a liner.")

q(1, "Gas is fed to the KOKORI cells at 0.25 times the water flow. What does the return report?",
 "0.034502451156 m3/s to each cell and 0.172512255781 m3/s in all.",
 ["0.172512255781 m3/s to each cell, which is the bank total divided among the five of them.",
  "0.034502451156 m3/s in all, shared between the cells according to their volumes.",
  "0.008050571936 m3/s to each cell, which is the gas rate the flux is formed from."],
 "The ratio is applied to EACH cell, so the two figures are different quantities. A reader comparing two arrangements needs to know which one a menu setting moved, and four cells at a ratio use four times the gas of one.")

q(2, "How does the module turn a cell volume into the area the gas rises through?",
 "It divides the volume by the cell depth, so 12 m3 at a depth of 2.8 m gives 4.285714 m2.",
 ["It takes the square of the cube root of the volume, since the module assumes a cubic cell.",
  "It divides the volume by the residence time and then by the superficial gas velocity.",
  "It reads the plan area directly, because a cell is specified here by its area and its depth."],
 "Bubbles rise through an AREA and a cell is specified by a volume, so something has to bridge the two. The superficial gas velocity is then the gas per cell over that plan area, 0.008050571936 m/s.")

q(0, "A cell of fixed volume is made deeper, from 1.5 m to 6 m. What happens to the cut size?",
 "It gets finer, from 32.427302 micron to 16.213651 micron.",
 ["It gets coarser, from 16.213651 micron to 32.427302 micron, because a deeper cell is a longer rise.",
  "It does not move, because the residence time is the volume over the flow and the volume has not changed.",
  "It gets finer only until the holdup passes the declared swarm limit, and then it turns back."],
 "A deeper cell at the same volume is a NARROWER cell, so the same gas rises through less plan area, the flux is higher and the cut is finer. Nothing about that is visible from a residence time argument, which is why depth had to become an input.")

q(1, "A 400 micron bubble in this water rises at 0.055485861717 m/s, which is a Reynolds number of 41.641016. What does the module use to get that velocity?",
 "The full drag balance, because at a Reynolds number in the tens Stokes law is no longer the settling law.",
 ["Stokes law with a warning attached to the return, since this module states that law only as far as a Reynolds number of 1.",
  "Stokes law left uncorrected, because a rising gas bubble in water is always inside the creeping flow band.",
  "A declared rise velocity for the default bubble, scaled by the ratio of the bubble diameters."],
 "The module did not apply the wrong law and attach a warning. It used the method that is honest at these conditions, and it reports the Reynolds number so a reader can see which regime the bubble is in.")

q(3, "How does the module compute the gas holdup of the swarm?",
 "The superficial gas velocity divided by the bubble rise velocity, which on the KOKORI cell is 0.145092311579.",
 ["The gas rate per cell divided by the cell volume, which is the gas fraction of that volume.",
  "The bubble rise velocity divided by the superficial gas velocity, which makes a quickly rising bubble a high holdup.",
  "The total gas to the bank divided by the water flow, which is the declared gas to water ratio."],
 "It is bookkeeping. Gas arrives at the bottom at a flux and leaves the top at the bubble rise velocity, so the amount sitting in the cell at any moment is the ratio of the two.")

q(0, "At a gas to water ratio of 1.5 the holdup is 0.870553869473, past the declared 0.2, and the module still reports a cut of 9.689510 micron. What does the warning mean?",
 "That the model behind that figure is outside the conditions it was built for, so the number should be read as an extrapolation.",
 ["That the figure has been clamped at the swarm limit, so the true cut is finer than the one reported.",
  "That the cut size is withheld and the concentration alone is returned for that arrangement.",
  "That the cell is being fed more gas than it can possibly disengage at the surface, so the cut size reported beside the warning is a conservative one."],
 "A warning withholds nothing. It reports the answer, names the quantity, names the threshold and leaves the judgement with the reader who knows what cell was actually built. Past that holdup the bubbles meet each other rather than the water.")

q(2, "What does the interception rate constant of 2830279.196411133744 per second per square metre of droplet diameter tell a reader about the capture law?",
 "That capture goes as the SQUARE of the droplet diameter, which is what the units of the constant carry.",
 ["That capture goes as the square of the bubble diameter, since the bubble is the collector here.",
  "That capture goes linearly with the droplet diameter, with the square being an artefact of the area units.",
  "That the constant is a calibration, since no rate with units like that could be derived from geometry."],
 "A droplet is caught when it comes within its own radius of a bubble, so the efficiency of the encounter carries the droplet diameter squared. That same square is what fixes this device's sharpness at 2.")

q(3, "Where does the cut size of a flotation cell sit on the decay curve?",
 "Where the rate multiplied by the residence time equals the log of two, because an exponential has used up half of what it started with there.",
 ["Where the rate multiplied by the residence time equals one, which is the natural decay constant of the cell.",
  "Where the holdup reaches the declared swarm limit, since that is where the removal curve is pinned.",
  "Where the bubble rise velocity equals the superficial gas velocity, so the swarm is neither accumulating nor thinning."],
 "On the KOKORI cells the residence is 434.751720 s and the cut comes out at 23.734355 micron. Both interception devices in this module define their cut that way, which is why the same log of two appears in the bed as well.")

q(1, "The published pair that straddles the flotation residence threshold differs in the CELL VOLUME alone. What does the module report on each row?",
 "6.1 m3 gives 61.000000 s and no warning, and 5.9 m3 gives 59.000000 s and a warning.",
 ["6.1 m3 gives 61.000000 s with a warning and 5.9 m3 gives a refusal.",
  "Both rows warn, because the holdup on each of them is past the declared swarm limit as well.",
  "6.1 m3 gives 61.000000 s and 5.9 m3 gives 59.000000 s, and neither row carries any warning at all."],
 "Two seconds of residence either side of the threshold is the whole difference between those rows, and the holdup is under the swarm limit on both, so this warning is shown on its own rather than tangled with the other one.")

q(0, "Both rows of that straddling pair report a cut size of 74.465948 micron. Why is the cut the same number on both?",
 "Because a smaller cell is a shorter residence and a higher gas flux at once, and the cell volume cancels out of the product the cut is defined by.",
 ["Because the cut was computed at the threshold volume and carried across to both rows for comparison.",
  "Because the module holds the cut size fixed whenever it warns, so the warning can be read on its own.",
  "Because the two cells differ by too little volume for the difference to show at six decimals."],
 "The rate carries the flux and the cut is the droplet for which the rate times the residence is the log of two. So the warning is a statement about the CELL and about how little time the attachment process is being given, and the cut size beside it will not show it.")

q(2, "The module declares `flotationResidenceWarnS` at 60 s. How does the warning use that figure?",
 "It quotes the threshold it judged against in the warning text, so a reader can disagree with the threshold itself.",
 ["It withholds the cut size whenever the residence falls under it, and reports the concentration alone.",
  "It scales the cut size by the ratio of the residence to the threshold whenever the residence is short.",
  "It refuses below it, because the attachment kinetics have no meaning at a residence that short."],
 "In the engine's own words: 59.0 s of flotation residence is under the 60 s this module warns below: the attachment process needs time and this cell is too small for the flow. The KOKORI cells sit at 434.751720 s, far above it.")

q(3, "The bubble is changed from 300 micron to 1200 micron. What does the cut size do?",
 "It becomes 8.000000 times coarser, because the cut goes as the bubble diameter to the three halves.",
 ["It becomes four times coarser, because the cut goes linearly with the bubble diameter.",
  "It becomes 8.000000 times finer, because a larger bubble sweeps more water on its way up.",
  "It does not move, because the gas rate rather than the bubble size is what sets the interception rate."],
 "The rate carries the inverse cube of the bubble diameter and the cut is a square root of a rate. FINER BUBBLES CUT FINER, and that is the larger of the two engineering differences between the two kinds of cell.")

q(0, "Which of these does the module REFUSE outright?",
 "A gas to water volume ratio of 4, because it holds that ratio to 3.",
 ["A gas to water volume ratio of 1.5, because the holdup it produces is past the swarm limit.",
  "A bubble of 40 micron, because the attachment model is stated from 300 micron upward.",
  "A cell depth of 6 m, because the plan area it leaves is too small for the gas to disengage."],
 "A 5 micron bubble is refused too, because the diameter must lie between 20 and 2000 micron for this attachment model. A refusal names the input it was handed and reports nothing else, where a warning reports an answer and says something about it.")

q(2, "The gas to water ratio is raised from 0.02 to 0.25 at a fixed bubble. Which way does the cut go?",
 "The cut falls, 83.913617 micron at the low gas ratio against 23.734355 at the high one.",
 ["Coarser, from 23.734355 micron to 83.913617 micron, because more gas is a shorter contact per bubble.",
  "Finer at first and then coarser, turning over once the holdup passes the declared 0.2.",
  "It holds, because the gas ratio reaches the cut only through the holdup and the holdup is reported separately."],
 "More gas is a higher superficial velocity through the same plan area, so the rate rises and the droplet the cell can remove half of gets smaller. The holdup rises with it, which is what the swarm limit is watching.")

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/intermediate/fc7i_m04.json', label='fc7i_m04', expect_n=15)
finish()
