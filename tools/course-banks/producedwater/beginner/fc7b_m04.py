import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Associate m04, A Droplet Rising. Written from digest.txt Section 5: the
# one balance everything in this module comes from, the band it is honest in,
# what an out of band cut size is worth, and reading a rise velocity.

q(1, "Everything gravity and everything centrifugal in this module comes from one balance. What is it?",
 "A droplet rises because it is lighter than the water, and the drag on it balances that buoyancy.",
 ["A droplet rises because the water around it is in motion, and the balance is between that motion and the residence time it is given.",
  "A droplet rises at the velocity the vessel imposes on it, and the balance is between the surface loading and the depth of the water.",
  "A droplet rises until it meets a droplet of its own size, and the balance is between the rate of those meetings and the flow through the vessel."],
 "Buoyancy against drag, and nothing else. The surface loading of a vessel is what a rise velocity is later compared against, and coalescence of droplets with each other is not in this module at all."),

q(3, "Why are the closed form and the full drag balance in this module described as two methods rather than two copies of one?",
 "The closed form solves in one line under the creeping flow assumption, and the balance is a damped iteration on the Schiller-Naumann drag coefficient.",
 ["The closed form is the engine's own route and the balance belongs to the oracle, so the two of them live in different files and are maintained quite separately.",
  "The closed form is stated for oil in water and the balance is stated for gas bubbles, so the two are never applied to the same droplet.",
  "The closed form carries the declared sharpness of 3 and the balance carries the derived 2, so the two produce different grade curves."],
 "Two different routes to one quantity is what makes their agreement inside the band evidence of anything. Sharpness belongs to the grade efficiency curve rather than to a rise velocity."),

q(0, "In the UZERE water the two routes are divided on each row of the droplet sweep: 1.000088 at 5 micron and 1.785576 at 500. What does that column do?",
 "It grows on every row of the table, which is the whole content of the band, since the departure tracks the Reynolds number rather than jumping at a threshold.",
 ["It grows until the stated Reynolds limit and then holds, since the module stops applying the closed form past the edge of the band.",
  "It grows and then turns over, because the drag coefficient falls again once the wake behind the droplet is fully developed.",
  "It holds near one across the band and then rises sharply, which is the cliff the stated limit of 1 was placed at."],
 "There is no cliff in that column and no threshold where the answer suddenly breaks. The band is a line drawn across a smooth departure, which is why the module reports the Reynolds number itself rather than only the verdict about it."),

q(2, "At 120 micron in the UZERE water the Reynolds number is 0.274873. What do the two routes do there?",
 "They already differ by 5.937008 percent, with the closed form giving the larger velocity.",
 ["They agree to 8.83e-5, which is the agreement the module reports at the fine end of the same sweep.",
  "They differ by 78.557612 percent, which is the departure the module warns about above its stated limit.",
  "They agree exactly, because 0.274873 sits inside the stated band."],
 "8.83e-5 is the agreement at 5 micron and 78.557612 percent is the departure at 500 micron and Reynolds 19.883778. Inside the band the two routes are close rather than identical, and the departure is already several percent well before the limit."),

q(1, "Where does this module state its closed form rise velocity to, and what does it do past that point?",
 "To a Reynolds number of 1, above which it warns and still returns the velocity.",
 ["To a Reynolds number of 1, above which it refuses, because the closed form has left the regime it was derived in.",
  "To a Reynolds number of 2, which is the widest departure the published rise cases in the golden file reach.",
  "To a droplet diameter of 120 micron, which is the coarsest row of the sweep that the module marks as in band."],
 "The limit is declared and sits in the same frozen object as every other choice in the engine. A number just past a smooth departure is nearly as good as one just inside it, so refusing would throw away a usable answer to make a point about a boundary."),

q(3, "The closed form gives the larger velocity on every row where the two disagree. Why does that direction earn a warning?",
 "An overstated rise velocity produces an understated cut size, so the equipment is credited with catching finer oil than it will, and that is the error a designer is least likely to catch.",
 ["An overstated rise velocity produces an overstated cut size, so the equipment is credited with less than it does, which wastes capital on vessels nobody needed.",
  "An overstated rise velocity puts the droplet outside the band, so the warning is really about the Reynolds number rather than about the direction of the error.",
  "An overstated rise velocity makes the removal larger and the outlet median coarser at once, so two reported figures move in ways a reader cannot separate."],
 "Optimistic in the direction that matters: a faster droplet is a smaller droplet caught. A conservative error advertises itself when the equipment is built, and an optimistic one shows up as oil in the effluent."),

q(2, "A cut size comes back with a Reynolds number beside it. What is the reader being handed?",
 "The evidence about that cut size's own trustworthiness, because every device here reports the Reynolds number of its own cut droplet and warns the same way.",
 ["A statement about the water rather than about the droplet it was computed for, so that one single figure covers every device that is ever sized on that one produced water stream.",
  "A check the reader has to run by hand against the stated limit, since the devices report the number without judging it.",
  "The Reynolds number of the median droplet of the inlet, which is the droplet the rise velocity was reported for."],
 "The band is a statement about the droplet and the water together, so one stream can hold droplets inside it and droplets outside it at once. The device does the judging as well as the reporting, and the warning arrives on the same return."),

q(0, "What does the engine say when a cut droplet sits outside creeping flow?",
 "That the cut droplet sits outside the creeping flow Stokes is stated for, so this cut size is optimistic.",
 ["That the cut droplet sits outside the creeping flow Stokes is stated for, so no cut size is reported for this device.",
  "That the droplet Reynolds number is above its limit, without saying which assumption that limit belongs to.",
  "That the answer is doubtful and the reader should add margin to the vessel before using it."],
 "The sentence carries two things a reader needs: which assumption was broken and which way the error points. A warning that only said the answer was doubtful would leave the designer guessing whether to add margin or take it away."),

q(1, "The UZERE basin cuts at 165.003927 micron with its cut droplet at Reynolds 0.714614. Push its short-circuit allowance to 2.5 and the cut becomes 213.019154. What comes back with the second answer?",
 "Two warnings and the answer: the allowance is outside its customary band, and the cut droplet is outside creeping flow.",
 ["One warning and the answer, naming the allowance, since the band on the allowance is the only thing that moved.",
  "A refusal, because an allowance of 2.5 puts the cut droplet past the Reynolds limit the module states its rise velocity to.",
  "Two warnings and a withheld cut size, because a figure outside the band is reported as null rather than as an optimistic number."],
 "Two warnings, one answer, and the answer still arrives. The first basin returns no warning of any kind, which is what makes the pair worth reading together."),

q(2, "One published basin row in the golden file cuts at 188.080643 micron with a golden Reynolds number of 1.851949, past the stated limit. Why is it there?",
 "A gate that only ever sees cases inside a band cannot tell whether the band is being policed at all.",
 ["The published case was measured on a real basin and the module has to reproduce it whether or not it sits in band.",
  "The row exists to fix the limit itself, since the band edge is placed where the published cases stop agreeing.",
  "Three of the four basin rows sit outside the band, so the file measures the module mostly where it warns."],
 "Testing the comfortable cases proves the arithmetic and testing an uncomfortable one proves the guard. 1 published row across the basin, plate and rise groups sits outside the band on purpose."),

q(0, "A design rests on a cut size whose droplet is outside the creeping flow band. What are the honest moves?",
 "Make the device larger until the cut droplet falls back inside the band, or get a rise velocity from a method that does not assume creeping flow.",
 ["Apply a margin to the cut size in proportion to the Reynolds number reported beside it, which is the whole reason that figure is printed on the same return as the answer.",
  "Take the answer as it stands, since the module warned rather than refusing and a warning is advice rather than a finding.",
  "Report the cut size with the warning attached and let the next reader decide what the figure is worth."],
 "The equipment is being credited with catching finer oil than it will, so the real performance is worse than the printed one. Carrying the optimistic figure forward without saying so is the one option the warning exists to prevent."),

q(3, "A 100 micron droplet in the UZERE water rises at 0.001091782327 m/s. What is recovered from that answer, and how?",
 "The 18 of the Stokes group, from gravity times the diameter squared times the density difference, over the viscosity times that velocity.",
 ["The Reynolds number of that droplet, which is what the same group reduces to once the diameter and the velocity have both been put into it.",
  "The density difference of 142.391799 kg/m3, which is the only unknown left once the diameter and the velocity are both in hand.",
  "The declared sharpness of 3, which the rise velocity carries into every grade efficiency curve the gravity devices use."],
 "The group comes to 18.000000000000 and nothing typed it into the answer. The viscosity and the density difference are inputs to that velocity rather than things recovered from it."),

q(1, "The UZERE median droplet rises at 0.000073804485 m/s at a Reynolds number of 0.002796. What should a reader do with those two figures?",
 "Read the velocity as the reason a gravity vessel has to be large, and the Reynolds number as the evidence that the velocity beside it can be believed.",
 ["Read the velocity as the treating answer for this stream, since it belongs to the median droplet and half of the oil volume in the water sits above that one size.",
  "Read the Reynolds number as a property of the water itself, so that every droplet carried in this particular stream can be taken as sitting inside the stated band.",
  "Read the velocity as the loading the basin has to be designed to, since a droplet rising that slowly sets the flow the vessel can take."],
 "Nothing has been removed from anything yet: a rise velocity says how fast a droplet travels and says nothing about whether the vessel gives it the room. The Reynolds number belongs to the droplet and the water together."),

q(2, "Why does a single produced water stream have many rise velocities rather than one?",
 "A population of droplets has a velocity for each size, coarse ones rising faster and fine ones slower, which is why a device removes a fraction rather than everything.",
 ["The velocity depends on where in the vessel the droplet sits, so the figure reported is an average over the depth of the water.",
  "The velocity changes as the droplet rises, since the drag falls away once the droplet leaves the bulk and nears the surface.",
  "Each device computes its own rise velocity from its own geometry, so a stream has as many velocities as it has stages."],
 "The reported figure belongs to the median droplet of that particular stream. Coarse droplets in the same water rise faster and fine ones slower, and the whole shape of a grade efficiency curve follows from that."),

q(0, "A rise velocity comes back far from what the water and the crude would suggest. What is it most useful for?",
 "As a sanity check on the inputs, because a density or a temperature typed wrong is much easier to see here than three devices further down a train.",
 ["As a signal that the droplet sits outside the band, since a velocity that surprising is usually a Reynolds number problem.",
  "As a reason to move to the full drag balance, which does not carry the assumption the closed form makes.",
  "As the figure to quote to a vendor, since a rise velocity is the one number in this chain that does not depend on equipment."],
 "Every figure below it in the chain consumes it, and each one prints normally on the way down. The band question is answered by the Reynolds number reported beside it rather than by the velocity looking odd."),

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/beginner/fc7b_m04.json', label='fc7b_m04', expect_n=15)
finish()
