import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Expert m03, The Air Cooler. Digest section 17, with the error-contract
# exception from section 1. 15 questions.

q(2, "The studio bay has a design ambient of 95.000000 degF and an air rise of 30.000000 degF, and ANTAN has 98.000000 degF and 26.000000 degF. What air outlet does each report?",
 "125.000000 degF and 124.000000 degF.",
 ["95.000000 degF and 98.000000 degF, because the air leaves at the ambient it arrived at.",
  "85.263896 degF and 82.901805 degF, which the engine reports as the air leaving temperature.",
  "150.000000 degF and 158.000000 degF, because the air leaves at the temperature the process leaves at."],
 "The air outlet is the ambient plus the rise, which the two columns show directly. The figures 85.263896 and 82.901805 are the two log means, and 150.000000 and 158.000000 are the process outlets.")

q(0, "On the studio bay, 2777777.7778 lb an hour of air carries 20000000.0000 Btu an hour across a rise of 30.000000 degF. What does that let a reader measure?",
 "The air heat capacity of 0.240000 Btu per lb per degF the module declares, taking the duty over the air mass and the rise.",
 ["The bare surface of 52125.749338 ft2, since a duty over a mass flow and a temperature change is an area.",
  "The air density of 0.071524401 lb per ft3 at the fan inlet, which follows from the same three figures.",
  "The log mean of 85.263896 degF, which the engine forms from the duty and the air mass together."],
 "Measuring a constant out of an answer is worth more than quoting it from a source file, because the measurement tests the path the constant travels on.")

q(3, "What computes the air rise on an air cooler in this module?",
 "Nothing, because it is an input.",
 ["The duty and the air mass, taken together with the declared air heat capacity.",
  "The design ambient and the log mean, which fix the air outlet between them.",
  "The bare surface and the coefficient, through the driving force they produce."],
 "It is a trade rather than a result: a larger rise needs less air and more bundle, and a smaller rise the reverse. A sheet that does not say which rise it assumed has not said what machine it describes.")

q(1, "The same bay is reported at 94.003933 brake horsepower and at 99.088250. What distinguishes the two figures?",
 "The draft type, which puts the fan inlet at 95.000000 degF in one machine and at 125.000000 degF in the other.",
 ["The barometric pressure, which stands at 14.700000 psia in one case and at 14.300000 psia in the other.",
  "The check ambient, which is the design ambient in one case and a hot afternoon in the other.",
  "The fan efficiency, which the module declares at 0.650000 and a study may state for itself."],
 "A forced-draft fan sits below the bundle and handles ambient air. An induced-draft fan sits above it and handles the heated air leaving. Nothing about the bundle changed between the two rows.")

q(1, "Which figure is the fan power ratio of 1.054086 formed from?",
 "The induced-draft brake horsepower divided by the forced-draft one on the same bay.",
 ["The forced-draft brake horsepower divided by the induced-draft one on the same bay.",
  "The motor horsepower divided by the brake horsepower on the forced-draft row.",
  "The induced-draft air density divided by the forced-draft air density."],
 "That ratio is computed rather than estimated, and it is the only comparison between the two draft rows this module stands behind.")

q(2, "Why does the answer carry the fan inlet temperature back with it?",
 "So the horsepower is attributable to one machine rather than the other.",
 ["So the air density can be recomputed if the barometer is later corrected.",
  "So the hot-day rating can start from the fan inlet temperature.",
  "So the module can report which of its two heat capacities it used for the air."],
 "Two sheets showing 94.003933 and 99.088250 for the same bay are not in conflict if each one says which machine it belongs to, and they are impossible to reconcile if neither does.")

q(0, "A draft type of balanced is refused. What does the second sentence of that message do?",
 "It states the size of the thing the module is declining to assume, at about 5 percent on fan power.",
 ["It names the two whole numbers of fans either side of the value given and declines to round between them.",
  "It states what the engine used to return for an unrecognised draft type before the repair.",
  "It hands back the two air densities as evidence so a caller can pick one and call again."],
 "The refusal states the size of the thing it declines to assume, which is what separates a refusal from an obstruction. A default here would have answered a question the caller never asked.")

q(3, "Take one bay from a barometer of 14.700000 psia down to 12.000000 psia. Which direction does each of the density, the volume and the fan power move?",
 "The density falls, the volume rises and the fan power rises.",
 ["The density falls, the volume falls and the fan power falls.",
  "The density rises and the volume falls with it.",
  "The density falls, the volume rises and the fan power holds at 84.515865."],
 "Three directions with one cause. The density runs 0.071139633 down to 0.058073170, the volume 581948.0744 up to 712886.3911, and the fan power 84.515865 up to 103.531935.")

q(2, "The air density export is asked for at 60.000000 degF and 14.700000 psia. What comes back?",
 "0.076341600 lb per ft3, as a bare number rather than as an object.",
 ["0.071524401 lb per ft3, as a bare number rather than as an object.",
  "0.076341600 lb per ft3, on an object whose error key is null.",
  "A refusal, because a density needs a barometer and a humidity together."],
 "That export is the one documented exception to this module's error contract: a leaf correlation has nowhere to put an error key. The figure 0.071524401 is the density at the studio fan inlet of 95.000000 degF.")

q(3, "Two of this module's exports sit outside its named-error contract. Which two?",
 "The air density, and the one that hands back a copy of the held bundle table.",
 ["The air density, and the bay itself, which returns 13 keys and no error key at all.",
  "The bundle table, and the tube-side film, which returns its evidence in place of a message.",
  "The air density, and the export that returns the declared bounds this module carries."],
 "The bay answers with an object carrying a named error string like the other doors. The film is one of the three doors that hand back evidence as well as a message, which is a different thing from sitting outside the contract.")

q(0, "The correction factor on both teaching bays comes back empty. What does the module say about the surface it reported?",
 "That it is a counter-current-basis surface and a real cross-flow unit needs more.",
 ["That it is a cross-flow surface already, since the counter-current log mean is the conservative one to size on.",
  "That it is provisional until the check ambient is supplied.",
  "That it carries the declared 10 percent margin this module applies wherever it cannot source a factor."],
 "The bare surfaces are 52125.749338 and 36660.428319 ft2 against log means of 85.263896 and 82.901805 degF. The number is not wrong, it is a stated basis, and how much more metal a real bay needs is the thing nobody here can state.")

q(1, "What would a silent correction factor of one have hidden?",
 "That the area reported rests on a factor this repository cannot source.",
 ["That the log mean was taken in the parallel pairing rather than the counter-current one.",
  "That the hot-day rating would then have depended on the same missing factor.",
  "That the coefficient on the bare surface is an input rather than a computed figure."],
 "A silent one produces exactly the same number with none of the warning attached, and a reader has no way to know which of the two they are holding. The honest form of a held item is to name the basis.")

q(3, "Why is the hot-day rating unaffected by the correction factor this bay declines?",
 "It holds effectiveness taken from its definition at the design point, so it assumes no arrangement and applies no correction.",
 ["It is computed at the design ambient, where the correction factor would be 1.000000 in any case.",
  "It reads the counter-current log mean, which is the pairing a cross-flow correction is defined against.",
  "It reads UA rather than a surface, and a correction factor acts on a surface rather than on UA."],
 "That is the mechanism rather than the conclusion. The one number this module cannot source never enters the rating, which is why a hot-day duty can be trusted further than a design area.")

q(0, "Three of the six refusals a bay carries have a second half that is history. How can a reader tell which three?",
 "A frame on the line immediately before each one says so, and the second half of the message names what the engine used to return.",
 ["The three that carry history are the three that hand back evidence beside the message.",
  "The three that carry history name a number in the message, and the other three name only a box.",
  "The three that carry history are refused by the bay and the other three by the fan chain beneath it."],
 "A fan efficiency of zero used to return Infinity bhp and a negative fan static pressure a negative horsepower. Only the first half of each message describes the module in use.")

q(2, "A bay refuses. How much does the answer carry besides the message?",
 "Nothing, because the bay is not one of the three doors that hand back evidence.",
 ["The 13 keys the bay returns on an answer, with the offending one set to null.",
  "The input it rejected, echoed on a key of its own so a caller can show it.",
  "The two air densities, since a refused bay still knows the draft type it was given."],
 "Three of this module's twelve doors hand back more than a message, which is the numbers that produced the state they refused. The bay is not one of them, so on these six the message is the whole of the answer.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/advanced/fc6a_m03.json', expect_n=15)
finish()
