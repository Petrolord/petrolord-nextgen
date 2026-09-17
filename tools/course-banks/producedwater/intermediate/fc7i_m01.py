import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Professional m01, grade efficiency.
# Every figure is from digest Section 8, which Associate m05 and Professional
# m01 share, at the rendering that section prints. Nothing here quotes a
# discharge limit, because this engine states none.

q(2, "In this module's grade curve, what is the removal efficiency of a droplet whose diameter equals the device's own cut size?",
 "Exactly one half, 0.500000000000, at every sharpness the module accepts.",
 ["One half only at the declared sharpness of 3, and it drifts away from that value at the derived sharpness of 2.",
  "It depends on the device, because a hydrocyclone and a media bed place their half points at different reduced sizes.",
  "Whatever the integration over the droplet distribution in front of the device happens to return for that one bin."],
 "The reduced form is r to the m over one plus r to the m. At a reduced size of one the numerator and the denominator are equal whatever m is, so the half point is fixed by what a cut size MEANS rather than by any tuning.")

q(0, "What is the reduced size this module writes its grade curve in?",
 "The droplet diameter divided by the device's own cut size.",
 ["The droplet diameter divided by the median diameter of the water arriving at that device.",
  "The droplet volume divided by the coarsest reported bin.",
  "The droplet diameter divided by the 20 micron reference droplet the filter coefficient is declared at."],
 "Writing the curve in that ratio is what lets one family serve every device here. A basin, a liner, a cell and a bed produce four different cut sizes by four different arguments, and each one then sets its own horizontal scale.")

q(3, "Two devices have the same cut size, one at a sharpness of 3 and one at a sharpness of 2. What does each remove at four times that cut size?",
 "98.461538 percent at the sharpness of 3 and 94.117647 percent at the sharpness of 2.",
 ["94.117647 percent at the sharpness of 3 and 98.461538 percent at the sharpness of 2, because a lower exponent is the steeper climb away from the half point.",
  "98.461538 percent at both of them, because the two curves are pinned together at the cut size and again at four times it.",
  "5.882353 percent at the sharpness of 3 and 1.538462 percent at the sharpness of 2, which is the coarse end of the reduced curve."],
 "The sharper curve separates better on both sides of the cut at once. It takes more of the coarse oil and it also passes more of the fine oil, and the two statements are one statement about selectivity.")

q(1, "At a quarter of the cut size the sharpness of 2 removes 5.882353 percent and the sharpness of 3 removes 1.538462 percent. What does that pair of figures show?",
 "That the blunter curve picks up more of the fine oil, which is what the sharper curve gives away for its performance on the coarse side.",
 ["That the two curves cross somewhere below the cut size, which is the reason this module prints the sharpness beside every cut size it reports.",
  "That the sharper curve reaches the fine tail first, since 1.538462 percent is the figure carried by the sharpness of 2.",
  "That the sharpness moves where the half point sits, putting it below the cut size for the blunter of the two curves."],
 "Read this row beside the row at four times the cut size. A sharp device draws a cleaner line between what it catches and what it passes, and which side of that line is worth more depends entirely on the distribution in front of it.")

q(0, "Which sharpness does this module use for which devices?",
 "3 for the gravity devices and the hydrocyclone, and 2 for flotation and the media bed.",
 ["2 for the gravity devices and the cyclone, and 3 for flotation and the bed.",
  "3 for every device here, with the 2 reserved for the curve the train integrates after its last stage has run.",
  "3 for the hydrocyclone alone, since it is the one device whose curve an oracle marches, and 2 for everything else."],
 "The two values also have different standing. The 3 is DECLARED in the frozen constants as `defaultSharpness`. The 2 falls out of interception capture rather than from anybody choosing it.")

q(1, "Why is the sharpness of the flotation cell and the media bed DERIVED rather than chosen?",
 "Both capture by interception, whose rate goes as the square of the droplet diameter, so the survival is an exponential in the square of the reduced size, which has the same half point and the same leading power as the family at m equal to 2.",
 ["Both were fitted against the published cell and bed rows in the golden file, and a sharpness of 2 is what that fit returned.",
  "Both report a cut finer than the gravity devices do, and this module lowers the sharpness whenever a cut falls under the reference droplet.",
  "A sharpness of 2 is what the reduced efficiency family falls back to whenever a caller supplies no sharpness of their own."],
 "Change the capture mechanism and the exponent changes with it. That is what makes it a derivation, and it is why the module can say where the exponent came from rather than only what it is.")

q(3, "What is the sharpness never allowed to do here?",
 "Move the cut size, because the half point is nailed at a reduced size of one.",
 ["Fall below 2, because this module refuses a grade curve blunter than the interception one.",
  "Differ between two stages of one train, because the quadrature integrates a single curve across all of them.",
  "Rise above the declared 3, because that is the sharpest curve this repository carries any source for."],
 "The two columns of the reduced curve describe two devices with identical cut sizes and different selectivity. A sharpness that moved the half point would be describing a different cut size instead of a different curve.")

q(2, "One device is applied to this water at a cut size of 12 micron. What does the module report for the removal and for the outlet droplet median?",
 "78.263077 percent removed, with an outlet median of 10.953502 micron.",
 ["78.263077 percent removed, with an outlet median of 12 micron, because the cut size becomes the median of the water that survives.",
  "60.477315 percent removed, with a median of 14.126621 micron.",
  "92.922276 percent removed, with an outlet median of 7.691060 micron, since the removal is read against the inlet median."],
 "The two figures answer different questions. The removal is what this vessel took out. The median is what the next vessel will be asked to work on, and it has fallen because the device took the coarse oil preferentially.")

q(1, "The module reports a surviving volume of 0.217369227363 beside that removal. What is that number for?",
 "It is the divisor the outlet bins are renormalised by, so that the oil left can be described as a distribution in its own right.",
 ["It is the share of the inlet oil this device never reached at all, because those droplets fell outside the droplet grid that was reported back.",
  "It is the oil carried away in the reject stream the device sends off with its froth or its underflow.",
  "It is the grade efficiency at the reported cut size, which is what the removal integral is normalised against."],
 "The removal and the surviving volume are two views of one sum and they account for all of the oil between them. Renormalising by that divisor is what turns what survived into an inlet for the next stage.")

q(0, "A device on this water is tightened from a cut of 30 micron to a cut of 2 micron. What happens to the outlet droplet median?",
 "It falls, from 16.943389 micron to 4.880416 micron.",
 ["It rises, from 4.880416 micron to 16.943389 micron, because the coarse droplets are the ones a tighter device leaves behind.",
  "It holds at the inlet median throughout, because taking oil out does not change the shape of the oil that is left.",
  "It falls to 2 micron, because a device cutting there leaves nothing coarser than its own cut size in the water."],
 "A device removes the droplets it is good at, and those are the coarse ones, so the water leaving is always finer than the water that arrived. Tighten the cut and more of that coarse oil goes.")

q(3, "A device cutting at 0.001 micron on this water removes 99.999999999904 percent and leaves a surviving volume of 9.618e-13. What does the module report?",
 "A concentration, with `outletNormalised` no, no outlet droplet median at all, and a warning that what is left is numerical dust.",
 ["A refusal naming the cut size it was handed, because a surviving volume that small is outside anything the grid can describe.",
  "A concentration and an outlet median of 0.001 micron, since every droplet coarser than that has been taken out.",
  "A removal rounded up to 100.000000 percent, with the outlet distribution reported back as an empty set of bins."],
 "In the engine's own words: this device leaves 9.62e-13 of the oil volume behind: what is left is numerical dust and no outlet droplet median is reported for it. Renormalising a number that small would produce a median with a confident look and no content.")

q(2, "How is a device removal computed in this module?",
 "Each bin's volume fraction is multiplied by the grade efficiency at that bin's diameter, and the products are summed.",
 ["The grade efficiency is evaluated once at the inlet median diameter and that one figure is applied to the whole of the oil volume arriving.",
  "The cut size is compared with the inlet median and a removal is read from a curve indexed by those two.",
  "A removal is looked up for the device type and then scaled by the ratio of the cut size to the inlet median."],
 "Take the complement bin by bin instead of the product and you have the volume that survives, which becomes the outlet once it is renormalised. One quadrature yields both of them.")

q(1, "Why does this module carry the outlet distribution forward as well as the removal?",
 "Because the next device faces that water rather than the inlet water, and it performs worse on it than its own cut size alone would suggest.",
 ["Because the outlet median is what the next stage's reported cut size is rescaled against before its quadrature can run.",
  "Because the renormalisation is what restores the truncated tail the droplet grid dropped at the inlet.",
  "Because the concentration alone cannot be carried between stages, since removal is reported as a fraction of the oil."],
 "That coupling is the whole point of a train, and it is exactly what a table of fixed removal efficiencies throws away.")

q(0, "What can a fixed removal efficiency for a device not do?",
 "Say what the water leaving looks like, so it cannot say what the next device will do with it.",
 ["Reproduce the removal of one device on one water, which is the single case such a figure is fitted for.",
  "Move at all when the vessel geometry changes, although it does respond when the water temperature does.",
  "Respond to the plan area of a vessel, though it tracks the median arriving."],
 "The same device on finer water performs worse, and a quoted percentage cannot know that because it never knew what arrived. Every figure in this course is a cut size against a distribution instead.")

q(3, "What is the standing of the sharpness of 3 in this module?",
 "DECLARED, which is to say chosen and exported in one frozen object, with no publication here to check it against.",
 ["DERIVED, since it follows directly from the same settling balance that the gravity devices invert in order to arrive at their own cut size.",
  "A CALIBRATION, chosen so that a basin cuts in the range API 421 vessels are customarily credited with.",
  "HELD FOR LITERATURE, which is why the module states an absence in its place rather than a value."],
 "The module's own comment says that pinning such a number is all any gate can do, and a pin is not a validation. What a pin buys is that moving the value becomes a reviewed act rather than a silent one.")

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/intermediate/fc7i_m01.json', label='fc7i_m01', expect_n=15)
finish()
