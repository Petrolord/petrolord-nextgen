import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Professional m03, the elevation adjustment. Digest Section 9, with the
# es figure at a rise of 3000.000000 ft taken from the Section 10 ceiling row.

q(2, "On the SOKU trunk 1500.000000 ft of rise gives s as 0.0795976556 and 1500.000000 ft of fall gives -0.0795976556, while 3000.000000 ft of fall gives -0.1591953113. What property of s do those three rows establish?",
 "That s is proportional to the elevation change, so equal distances up and down give exactly opposite values and doubling the fall doubles s.",
 ["That s is proportional to the elevation change only over falls, the rise column being the mirror image the engine writes rather than a value it computes separately.",
  "That s grows faster than the elevation change, which is the asymmetry between climbing and descending that the rest of the module is about.",
  "That s never exceeds one in size in either direction, which is what allows it to be handed to an exponential without the group overflowing on a tall hill."],
 "s itself is well behaved. Everything awkward about a hill happens after s, when it goes into an exponential.")

q(0, "At 1500.000000 ft of rise e to the s is 1.0828513009 and at 1500.000000 ft of fall it is 0.9234878318. What does each of those do to the driving group?",
 "The rise counts the outlet's square for more than it is, which shrinks the group and the rate, and the fall counts it for less, which enlarges both the group and the rate.",
 ["The rise counts the inlet's square for more, which enlarges the group, and the fall counts the inlet's square for less, the multiplier sitting on the upstream end because that is where the column of gas starts.",
  "The rise scales both squares together, so the group moves by that factor as a whole while the ratio between the two ends is preserved, which is why a flat test case cannot detect the term.",
  "The rise is subtracted from the group as a static head in psia squared, and the fall is added to it, in the same way a liquid line adds and subtracts an elevation head."],
 "The group becomes the inlet squared less e to the s times the outlet squared. The inlet is untouched, and the whole of the hill is a single multiplier on the outlet.")

q(3, "A reader applies e to the s to both pressures in the group rather than to the outlet alone. Why does that error survive testing so well?",
 "Scaling both ends leaves the group proportional to the flat one, so every rate is wrong by the same factor and a sweep stays self-consistent.",
 ["Scaling both ends leaves the group unchanged, because the multiplier cancels between the two squared pressures and the error has no effect on any line at all until an elevation change of 3000.000000 ft or more.",
  "Scaling both ends produces a group that is still zero when the pressures meet, and since the engine tests the dead-line refusal at every call the error is caught only on a line whose outlet meets its inlet.",
  "Scaling both ends reproduces the equivalent length factor of 1.0408761444 as a side effect, so the two halves of the adjustment appear to agree and the case passes its own internal check."],
 "Nothing inside a single case contradicts anything else in it. The error also vanishes on a flat line, where e to the s is exactly 1.0000000000.")

q(1, "The elevation group returns a second column beside e to the s. At 1500.000000 ft of rise it reads 1.0408761444 and at 3000.000000 ft of fall it reads 0.9244633111. What does that column act on?",
 "The length the friction acts over, so a climb behaves as though the pipe were longer than it was laid and a descent as though it were shorter.",
 ["The outlet pressure, as a second multiplier applied after e to the s, the two together forming the full adjustment the group carries.",
  "The gas gravity of 0.670000, which is scaled to an effective value for the column of gas standing in the inclined section of the line.",
  "The compressibility of 0.885000, which the engine corrects for the pressure distribution a hill produces along the line."],
 "Two columns, two jobs. The first scales a pressure inside the group and the second scales a length outside it. A factor of 1.0408761444 says the friction behaves as though the climb were over four percent more pipe.")

q(2, "At an elevation change of 0.000000 ft both e to the s and the equivalent length factor read exactly 1.0000000000. Why is that the cleanest check on an elevation implementation?",
 "Because the two parts of the adjustment vanish at the same moment and the flat form comes back unchanged, so a term that is merely near one on a flat line is a term that is wrong everywhere.",
 ["Because a flat line is the only case in which the two columns can be compared against each other, the rest of the table having no independent value to check either column against.",
  "Because the flat case is the only one whose rate is published with a golden, so an implementation that returns the flat form exactly has been checked against the one figure in the table that was measured.",
  "Because both columns are exponentials of s and an exponential of zero is one, so the check confirms that s was computed in the right units before anything else is examined."],
 "At an elevation change of 0.000000 ft, s is 0.0000000000 and the adjustment collapses. An elevation term leaving a residue at zero is wrong on every flat line it will be given.")

q(0, "The coefficient inside s is reported as 0.037500000000, and the course says it was measured rather than typed. How was it obtained?",
 "The engine was asked for s at a gravity of one, a rise of 1000.000000 ft, an absolute temperature of one and a compressibility of one, and the 37.500000 it returned was divided by the thousand feet.",
 ["The engine was asked for s at the SOKU conditions and at 1500.000000 ft of rise, and 0.0795976556 was divided by the gravity, the temperature and the compressibility in turn until only the elevation remained.",
  "The coefficient was read off the ratio of the two equivalent length factors at 1500.000000 ft of rise and 1500.000000 ft of fall, which isolates it from everything else in the group.",
  "The coefficient was recovered from the base conditions of 520.000000 degR and 14.650000 psia, which is where the field units of the published forms enter the elevation term."],
 "Setting three of the four inputs to one leaves the coefficient and the elevation change, so dividing by the elevation change leaves the coefficient. It is an engine return rather than a figure copied beside one.")

q(3, "Which quantities is s built from?",
 "The gas gravity, the elevation change, the absolute flowing temperature and the compressibility.",
 ["The gas gravity, the elevation change, the absolute flowing temperature and the length of the line in miles, the length entering because the hill is spread along it.",
  "The gas gravity, the elevation change and the two pressures, since the column of gas standing in the pipe weighs more where the line is at its inlet pressure than where it is at its outlet.",
  "The gas gravity, the elevation change, the compressibility and the transmission efficiency, the efficiency entering here because it is the one multiplier shared by all four forms."],
 "Those four are what decide how much a column of this gas weighs, which is what the term is for. A heavier gas, a taller hill, a colder line or a lower compressibility all make the column count for more.")

q(1, "s is arranged to carry no units. Why does that matter?",
 "Because it is handed to an exponential, and a quantity about to be exponentiated that still carries feet or degrees has gone wrong upstream.",
 ["Because it is compared against the equivalent length factor, and two quantities can only be compared when neither carries a unit the other does not.",
  "Because it is reported to ten decimal places, a precision that would be meaningless on a quantity carrying a physical unit.",
  "Because it is shared across all four forms, and the four are stated in different unit systems which only a dimensionless group can travel between."],
 "The coefficient of 0.037500000000 belongs to the field units these forms are written in and would be a different number in any other system.")

q(2, "At 1500.000000 ft of rise the four forms fall to 0.932862, 0.927767, 0.931566 and 0.931850 of their flat rates. Which form is most sensitive to this hill?",
 "Panhandle A, which falls furthest at 0.927767 on the climb and also gains most on the descent at 1.068566, so it is the most sensitive of the four in both directions.",
 ["Weymouth, which falls to 0.932862, because it carries the largest diameter exponent of the four and a form more sensitive to the bore is more sensitive to the profile.",
  "Panhandle B, which falls to 0.931566, since it returns the largest rate on the flat trunk and therefore has the most rate available to lose.",
  "General Flow, which falls to 0.931850, because it is the only form that resolves its friction factor against its own rate and so responds to the hill twice."],
 "Panhandle A is the most sensitive in both directions and Weymouth the least, losing least at 0.932862 and gaining least at 1.063402.")

q(0, "Averaging the Weymouth up and down fractions of 0.932862 and 1.063402 gives 0.998132. What is the point of printing that figure?",
 "That it is close to one and is not one, so a route that climbs 1500.000000 ft and then descends the same distance has not in fact done nothing to the gas.",
 ["That it is close to one, so an undulating profile may be netted to its total elevation change with an error small enough to ignore on any ordinary route.",
  "That it is below one, which is the correction the engine returns on every call carrying an elevation change and applies to the rate before reporting it.",
  "That it is the correction a designer applies to a flat-line rate before quoting it for a route with relief on it, which is why it is computed from the Weymouth row."],
 "The term is an exponential and an exponential is not symmetric about zero. On that row the climb loses more than the descent gains, which is why the average falls below one rather than above it.")

q(3, "All four forms share one elevation term and the four still respond to the same hill by different amounts. Why?",
 "Each form combines the shared adjustment with its own friction treatment.",
 ["Each form receives the elevation change in its own units, the two Panhandles taking it in feet and Weymouth and General Flow scaling it by the length in miles before the group is formed.",
  "Each form computes its own s, because s carries the compressibility and each of the four applies a different average compressibility to the line it is describing.",
  "Each form applies the equivalent length factor and only General Flow applies e to the s as well, which is why its response to a hill differs from the other three."],
 "They disagree about friction and they agree about gravity. So a project that has chosen its form has also chosen how sensitive its answer is to the survey.")

q(1, "What is the practical consequence of the elevation term sitting inside an exponential rather than being added as a head?",
 "The climb costs more than the matching descent gives back, so the ups and downs of a profile do not cancel in the way that a liquid line's do.",
 ["A tall enough hill drives the term to zero and the rate with it, which is the refusal a climbing line returns when its inlet cannot pay for the column.",
  "The descent gives back more than the matching climb costs, so a route with relief on it carries more gas than the same route laid flat.",
  "The term cannot be separated from the friction, so a rate on a hill carries no decomposition into what the slope cost and what the pipe cost."],
 "On the 1500.000000 ft table the Weymouth row reads 0.932862 climbing against 1.063402 descending, so the climb loses more than the descent gains and the two average to 0.998132 rather than to one.")

q(0, "A designer nets an undulating route to a single elevation change and hands that figure to a gas form. What does the engine do?",
 "It accepts the net figure and answers it honestly, and the answer it gives is for a line that climbs once rather than for a line that undulates.",
 ["It refuses, because the elevation guard compares the rise against the length of the line and a netted profile cannot satisfy that comparison.",
  "It returns the rate together with the equivalent length factor of the netted hill, which is the engine's way of signalling that the profile was reduced before it arrived.",
  "It applies the net change to the driving group and the full climbing distance to the equivalent length factor, which recovers most of what the netting discarded."],
 "Nothing in the call describes the shape of the ground between the two ends. Treating an undulating profile as though the ups and downs cancel is an assumption the arithmetic refuses.")

q(2, "Which part of a transmission form would still be there at no flow at all?",
 "The elevation term, because it is the weight of the gas standing in the pipe, which is a quantity that column has whether or not anything at all is passing along the line.",
 ["The equivalent length factor, since a length is a property of the line rather than of the flow through it and is therefore the one term independent of the rate.",
  "The efficiency, which multiplies the finished rate and is therefore the only input whose effect does not depend on the gas moving.",
  "The driving group, since two pressures can be read off a shut line and squared without any gas passing between them."],
 "The rest of a transmission form is about motion, and that includes the length the friction acts over, which multiplies a friction that has gone. A column of gas weighs what it weighs whether or not anything is moving.")

q(3, "A result is being reproduced by hand, and the multiplier is taken from the engine while the length factor is taken from a textbook. What is wrong with that?",
 "Both columns are consequences of the same s, so mixing two sources for one physical quantity gives two figures that will not correspond.",
 ["The textbook states the length factor against the physical length while the engine states it against the equivalent length, so the two differ by the factor itself and the error compounds.",
  "The engine's multiplier is computed at the SOKU compressibility of 0.885000 while a textbook factor assumes a compressibility of one, so the two can only be combined once the second has been rescaled.",
  "The length factor is the one part of the adjustment the engine does not return, which is why it has to be taken from a publication and reconciled against the multiplier afterwards."],
 "There are not two elevation inputs and there is no way to have one without the other. They correspond only when every input behind s matches.")

emit(Q, '/root/fc-wip-linesizing/banks/fc2i_m03.json', expect_n=15)
finish()
