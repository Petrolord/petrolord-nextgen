import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Professional m05, the media bed. Digest Section 13 throughout, which
# Professional m05 owns. The loading floor here is Section 13's worked
# example: three answering beds, two refusals in the engine's own words, and
# the bed area the refusal itself names.

q(1, "How does a media bed remove droplets far smaller than the gaps between its grains?",
 "By DEPTH FILTRATION: droplets come close to grain surfaces throughout the bed, touch them and are retained.",
 ["By screening the droplets out at the face of the bed, where the packing is at its tightest and the pore throats are at their narrowest.",
  "By coalescing the droplets on the media surfaces until they are large enough to rise out of the water standing above the bed.",
  "By holding the water still long enough inside the pores for the droplets to settle out under gravity."],
 "Capture happens everywhere in the bed rather than on its face, which is why the right way to describe it is a rate per unit of depth and why a bed can hold a great deal of oil before anything is visible at the surface.")

q(3, "Which three quantities move the filter coefficient in this module?",
 "The droplet diameter through its square, the grain size through its inverse cube, and the loading rate through a falling power.",
 ["The droplet diameter, the bed depth and the loading rate, each through its own declared exponent.",
  "The grain size, the bed depth and the bed area, which together fix how much surface the water sees.",
  "The droplet diameter, the grain size and the bed depth, with the loading rate entering the cut alone."],
 "Interception is behind two of them. A bigger droplet reaches a grain from further away, and finer grains mean both more collectors per unit volume and a better interception efficiency on each one.")

q(2, "A 20 m2 bed 0.8 m deep on 650 micron media carries the KOKORI flow. What does the module report?",
 "A loading of 24.841765 m/hr, a filter coefficient of 4.140060735138 per m, and a cut of 9.149437 micron.",
 ["A loading of 24.841765 m/hr, a filter coefficient of 3.5 per m, and a cut of 12.492787 micron.",
  "A loading of 62.104412 m/hr, a filter coefficient of 2.618404314893 per m, and a cut of 11.504808 micron.",
  "A loading of 1.013950 m/hr, a filter coefficient of 20.492255142381 per m, and a cut of 4.112471 micron."],
 "The penetration at the reference droplet on that bed is 0.036441443726, so 96.355856 percent of the droplets at that ONE size are caught. The cut size is the separate figure the train reads.")

q(0, "Why can the 96.355856 percent that bed reports not be quoted as what it does to produced water?",
 "Because it is the removal at ONE droplet size, the 20 micron reference, and real water carries most of its oil volume at other sizes.",
 ["Because it was computed at the reference grain rather than at the 650 micron media the bed actually holds.",
  "Because it is the penetration rather than the removal, so the figure a reader wants is its complement.",
  "Because it holds only while the bed is clean, and the module carries no fouling or breakthrough over time."],
 "The bed treats every droplet size differently, which is the whole content of a depth filtration model. What the train reports is that same curve integrated over the distribution in front of the bed.")

q(3, "The cut size of this bed is described as an inversion rather than a second opinion. What does that mean?",
 "There is exactly one droplet for which the filter coefficient times the depth is the log of two, and the module reports that droplet.",
 ["The cut is computed from the grade curve of the declared sharpness and then checked against the penetration law.",
  "The cut is found by marching the bed layer by layer until the marched removal reaches one half.",
  "The cut is read from the published bed rows nearest the loading the caller supplied."],
 "Nothing new is assumed to get it. One law, read two ways, with no second parameter set anywhere, which is why a reader who understands the exponential understands everything this device does.")

q(1, "The depth sweep carries a derived column, the cut size times the square root of the depth. What does that column do and what does it prove?",
 "It reads 8.183505 on every row, which says the cut goes as one over the root of the depth exactly.",
 ["It rises with the depth, which says the depth is a stronger lever than the square root would suggest.",
  "It reads 4.140060735138 on every row, which is the filter coefficient the whole sweep was run at.",
  "It falls with the depth, which says the bed loses capture per unit depth as it is made deeper."],
 "A swept table with a derived column that holds still is a claim about the FORM of a relationship, testable by eye, and it cannot be produced by accident. Across that sweep the depth moves the cut by a factor of 10.000000.")

q(0, "Why does the filter coefficient column hold at 4.140060735138 per m all the way down the depth sweep?",
 "Because depth is not one of the three things the filter coefficient depends on.",
 ["Because the sweep ran at the reference loading.",
  "Because the module recomputes the coefficient only when the media or the bed area changes.",
  "Because the coefficient is DECLARED and the module never scales it away from its declared value."],
 "Depth enters through the exponential rather than through the rate per unit depth. The two columns doing the work in that table are the one that holds still and the one derived beside it.")

q(2, "Changing the media from 800 micron to 400 micron multiplies the filter coefficient by 8.000000. Why that factor?",
 "Because the interception derivation gives the inverse CUBE of the grain diameter, and halving it cubes to eight.",
 ["Because the coefficient carries the inverse square of the grain diameter and a bed of that media holds twice as many grains in it.",
  "Because the reference coefficient is declared at 800 micron and the module doubles it per halving.",
  "Because the grain enters through the loading rate, which falls as the grain size to the power 0.5."],
 "Two separate effects multiply together. Finer grains mean MORE collectors in a given volume of bed, and finer grains also make each collector better at interception.")

q(1, "What is the standing of that grain size exponent?",
 "HELD FOR LITERATURE, because the interception derivation gives the cube and this repository carries no bed data to check it against.",
 ["DERIVED, because it follows from the same interception argument that fixes this device's sharpness at 2.",
  "DECLARED, because it lives in the frozen constants beside the reference grain of 800 micron.",
  "A CALIBRATION, because it was chosen so that a walnut shell bed cuts where such beds are customarily credited."],
 "It is a very strong dependence on an input a reader is free to change, so the grain column should be read as the MODEL'S STATEMENT. No gate here validates it, because there is nothing here to validate it with, and no citation may be invented for it.")

q(3, "At the module's own reference grain the derived ratio column reads exactly 1.000000. Why is that worth knowing?",
 "Because a bed packed at 800 micron gives an answer the held exponent is doing nothing to.",
 ["Because the bed cut size is at its finest there, which is why the reference was chosen at that grain.",
  "Because it is the only grain at which the module will report a cut size without a warning attached.",
  "Because the exponent is validated at that grain, and the ratio column is what records the validation."],
 "That is a reasonable thing to know when you want a result that does not rest on a number nobody here can check. Work away from it and the held cube is carrying part of your answer.")

q(0, "By what single route does the AREA of a bed reach its cut size?",
 "Through the loading rate, the flow divided by the area, and through nothing else at all.",
 ["Through the filter coefficient directly, which carries the bed area beside the grain size and the droplet.",
  "Through the exponential, since the penetration is taken over the area as well as over the depth.",
  "Through the residence time of the water in the bed, which the loading rate is another form of."],
 "The area is not in the exponential, it is not in the depth and it is not in the grain term. A bigger bed at the same flow is a slower bed, water spends longer near the grains, and the coefficient rises: 80 m2 gives 6.210441 m/hr and a cut of 6.469629 micron.")

q(2, "An 8 m2 bed on this flow runs at 62.104412 m/hr and the module warns. What does the warning do to the answer?",
 "Nothing. The cut of 11.504808 micron is still reported, with a statement that the bed will break through early.",
 ["It withholds the cut size altogether, because depth capture is not defined anywhere above the declared breakthrough loading.",
  "It scales the cut size by the ratio of the loading to the 25 m/hr threshold before reporting it.",
  "It reports instead the cut size the bed would have given at the threshold, so that the figure stays inside the declared band."],
 "A warning reports an answer and says something about it. Breakthrough is the bed passing oil before it is anywhere near full, and it is a real operating failure rather than a modelling nicety.")

q(3, "A 600 m2 bed is put on the KOKORI flow. What does the module do?",
 "It REFUSES, because the loading of 0.828 m/hr is below the 1 m/hr floor it answers above.",
 ["It warns and reports a cut size, because a slow bed is the conservative direction to be wrong in.",
  "It answers without comment, since the breakthrough warning is the only thing the loading rate triggers.",
  "It clamps the loading at the 10 m/hr the coefficient is declared at and reports the cut that gives."],
 "The reason is on the refusal rather than in a range check. The filter coefficient is DECLARED at 10 m/hr and its loading exponent is the only velocity dependence in this model, so below the floor the declared law is already claiming several times the one coefficient there is any calibration for.")

q(0, "That refusal names the bed that would run this flow AT the floor. What is that figure and where does it come from?",
 "496.835297 m2, which the return carries as `areaAtFloorM2` against the 20 m2 bed this stream actually runs.",
 ["496.835297 m2, which is the largest bed on this flow that the module will still answer for at its stated floor.",
  "490 m2, which is the smallest bed on this flow that the module refuses to answer for.",
  "2000 m2, which is the second of the two beds the section refuses and the one sitting furthest under the floor."],
 "The last beds that answer on this flow are 200, 400 and 490 m2, cutting at 5.145107, 4.326502 and 4.112471 micron. The floor area is the quantity the refusal names for a caller who wants to know what to change and by how much.")

q(2, "Why is the loading floor a refusal where the breakthrough loading is only a warning?",
 "Because what a bed really does far below its design rate is HELD FOR LITERATURE, so there is no answer to report.",
 ["Because a loading that low would put the cut droplet well outside the creeping flow band that this module states its migration law to.",
  "Because the loading exponent changes sign below the floor, so the reported cut would be meaningless.",
  "Because the module refuses wherever a warning would have to quote two thresholds in one sentence."],
 "The refusal names four things and each is doing work: the loading it was given, the floor it is under, the reference loading the coefficient is declared at, and the bed that would reach the floor. This module will not extend a one point calibration downward by three orders of magnitude and then report the result as a cut size.")

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/intermediate/fc7i_m05.json', label='fc7i_m05', expect_n=15)
finish()
