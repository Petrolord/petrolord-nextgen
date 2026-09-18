import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Associate m06, The Associate Reading. Written from digest.txt Section 20,
# one stream from the rate to the withheld verdict, with Section 8 for what a
# device does to the distribution it is given.

q(2, "Step one of the UZERE reading turns 28000 bwpd into 0.051523660393 m3/s. What is that step, and why is it worth naming?",
 "Bookkeeping in exact units, since the barrel is exactly 0.158987294928 m3 and every device answer below is in the units this step produced.",
 ["The first physical calculation, since the flow is what the surface loading of the basin is built from and nothing above it is physics.",
  "A conversion the caller has to make, since this module takes a rate in barrels a day and reports back in the same unit.",
  "A declared conversion of this module, pinned in the frozen object with the rest of the chosen values in it."],
 "The rate becomes a volumetric flow before any physics happens. The exact barrel is a definition rather than a choice, and the Suite layer does the conversion so that everything downstream is in one system of units."),

q(0, "Steps two to five of the chain produce a viscosity, a brine density, a crude density and a difference. What has not been mentioned yet, and why does that matter?",
 "No dimension of any vessel, which is why the hardness of a duty can be judged before a catalogue is opened.",
 ["No input the caller typed, since those four steps are computed from the flow step one produced.",
  "No temperature, since temperature enters only where the crude is thinned and the rest of the chain is isothermal.",
  "No flow rate, since the fluid properties are intensive and the rate enters only at the device."],
 "The fluid properties are settled before any equipment is chosen. The temperature is the input three of those four steps consume, and the flow arrived at step one."),

q(1, "Step six asks how fast the UZERE median droplet rises. What comes back, and what does the second figure add?",
 "0.000073804485 m/s at a Reynolds number of 0.002796, and the Reynolds number is what says the velocity beside it can be believed.",
 ["0.000073804485 m/s at a Reynolds number of 0.002796, and the Reynolds number is the fraction of the population sitting inside the band.",
  "0.001091782327 m/s at a Reynolds number of 0.002796, which is the velocity of the median droplet of this stream.",
  "0.000073804485 m/s with no Reynolds number, since the number is reported by the devices rather than by the rise velocity."],
 "0.001091782327 m/s belongs to a 100 micron droplet in the same water. The Reynolds number is a property of that droplet in that water, and it sits far below the stated limit of 1 here."),

q(3, "Step nine reports that the basin removes 3.284882 percent of the oil in this water. Why is the figure so small?",
 "The basin cuts at 165.003927 micron and the droplets arrive at a median of 26, so nearly all the oil volume is in droplets it cannot catch.",
 ["The basin removes only the oil that has risen by the time the residence of 706.471546 s runs out, and the rest is carried over.",
  "The removal is quoted over the whole train rather than over the basin alone, so the plate pack downstream carries most of it.",
  "The inlet is only 650 ppm, so there is little oil in the water for the basin to take out in the first place."],
 "A cut size is the droplet the device removes half of, so a population whose median sits far below it is barely touched. A removal is a fraction of whatever oil is present, so the inlet concentration does not set it."),

q(1, "The basin is left exactly as it is. What change in the water would raise that removal?",
 "A coarser droplet population, because the removal depends on the droplet sizes against the cut size.",
 ["A higher oil concentration at the same droplet sizes, since there is then more oil for the device to work on.",
  "A finer droplet population, since fine droplets are the ones a basin holds on to best.",
  "The same droplets at a higher water rate, since a faster basin presents more oil to the surface in the same time."],
 "Read the sweep of cut sizes against this water the other way round: what matters is where the population sits against the cut. A higher rate raises the surface loading and coarsens the cut size, so it moves the removal the other way."),

q(0, "How does the engine turn a cut size into the 3.284882 percent, and why does it insist on a droplet median and a spread first?",
 "It multiplies the grade efficiency at every bin by the oil volume in that bin and sums, so the answer depends on the device and the water together.",
 ["It reads the removal for that cut size from the grade efficiency curve at the median droplet size of the inlet population.",
  "It compares the cut size with the median and takes the fraction of the distribution above it, which is why the spread is needed.",
  "It integrates the grade efficiency over the droplet sizes with each size weighted equally, which is what the fixed grid is for."],
 "A coarse bin gives up nearly all of its volume, a bin at the cut size about half of it, and a fine bin almost none. Weighting sizes equally would be a count basis, and a single figure read at the median would throw the whole distribution away."),

q(3, "Step ten gives the plate pack a cut size of 86.549597 micron on the same water the basin cut at 165.003927. What did the change?",
 "The area the flow is divided by, since the pack reaches an effective area of 63.000000 m2 where the basin has its footprint.",
 ["The driving force, since a pack of plates presents its droplets to a settling surface that is inclined rather than horizontal.",
  "The residence time, since the water inside a plate pack is held a great deal longer than the water in a basin of the same duty.",
  "The allowance, since a plate pack carries a smaller short-circuit factor than an open basin does."],
 "The water did not change between those two answers. Both devices invert the same balance at the design rise velocity, and the only thing that moved was what the flow was divided by."),

q(2, "Step eleven puts the UZERE stream through both devices. What comes out?",
 "567.644189 ppm from the 650 ppm that arrived, which is 12.670125 percent of the oil removed.",
 ["567.644189 ppm from the 650 ppm that arrived, which is the basin removal and the pack removal added together.",
  "The 3.284882 percent of the basin multiplied by what the pack removes, which is how two stages in series compound.",
  "650 ppm still, since neither device cuts near the 26 micron median."],
 "The train reports its own outlet and its own overall figure. Adding two stage removals counts oil that was gone before the second device saw it, and multiplying two fractions measured on the raw stream credits the second device with performance it cannot reach."),

q(0, "Step twelve reports the droplet median falling from 26.000000 micron to 23.018983. What did that?",
 "The basin and the pack took the coarse end of the population, which is what a cut size does, so what is left is finer.",
 ["The devices removed oil evenly across the sizes, so the median fell in proportion to the concentration.",
  "The two medians are measured differently, the first typed and the second read off the bins, so part of the fall is the change of basis.",
  "The grid was renormalised after each stage, which moves the median across the bin it falls in."],
 "Both medians are the volume median of the same bin set and the module says so on its own return, which is what makes them comparable. A device that removed a uniform slice of every size would leave the median where it was."),

q(1, "Why can the two stage removals of this train not be added together?",
 "Each figure is a percentage of what arrived at that stage rather than of what entered the train.",
 ["Each figure is computed on a different droplet grid, so the two are not measured on a common basis.",
  "The second stage removes some of the oil the first stage had already taken out, so the overlap would be counted twice.",
  "The percentages are volume fractions and the overall figure is a mass fraction, so they cannot be combined without a density."],
 "Adding them counts oil that was gone before the second device saw it. One grid runs through the whole train, and the removals are fractions of the oil throughout."),

q(2, "The plate pack alone on the raw UZERE water removes 11.315691 percent, and compounding that with the basin predicts 14.228866 percent where the train reports 12.670125. Why does that compounding overstate the train?",
 "The coupling: in the train the pack works on the basin\'s residue, which is finer by construction, so its raw figure credits it with coarse oil already taken out.",
 ["The product ignores the oil in the truncated tails of the grid, which the normalisation absorbs at each stage.",
  "The product is right only where both devices carry the same sharpness, and these two carry different ones.",
  "The product is right only when the device with the larger removal comes first, and in this train the basin comes first although it removes the smaller share of the two."],
 "Compounding the train\'s OWN stage figures, 3.284882 and 9.704008 percent, gives 12.670125 exactly, because each is a fraction of the water that reached its stage. Both of these devices carry the declared sharpness of 3."),

q(3, "What does this engine actually pass from one stage to the next?",
 "The outlet bin distribution of the stage, normalised by the volume that survived it, with the concentration as a scaling on it.",
 ["The outlet concentration of the stage, out of which the next stage rebuilds a droplet distribution at the same median and the same spread.",
  "The cut size of the stage, so that the next device can be compared against what the last one achieved.",
  "The removal fraction of the stage, which the train then compounds into an overall figure at the end."],
 "The distribution is the state carried down the train and the concentration is a scaling on it. That coupling is the whole point of a train, and it is exactly what a table of fixed efficiencies throws away."),

q(0, "The chain is finished and the engine is asked for a verdict. What does it return?",
 "Null, with the reason that no discharge specification was given.",
 ["Null, with the reason that one of the two stages of this train did not run to completion on the stream it was given.",
  "A pass, since the outlet is below the figure the module holds for produced water.",
  "A refusal, since a verdict asked for without any specification behind it is a question this method has no way of answering."],
 "The computation ran in full and only the judgement was declined, which is a withheld verdict rather than a refusal. A verdict needs a specification supplied by the caller, and that is the person who knows the licence, the receiving environment and the regulator."),

q(2, "A studio screen shows that blank verdict. What has the reader actually been told, and what would painting it red tell them instead?",
 "That an input is missing and should be supplied, where a red field would say the train had failed.",
 ["That the train ran and did not reach the outlet the module holds for it, where a red field would say the same thing more loudly.",
  "That the engine could not compute the outlet, where a red field would correctly report a computation that did not happen.",
  "That the verdict is being withheld until every stage of the train has run, where a red field would report a skipped stage."],
 "A blank verdict is not a failure and it is not a pass. It is an absence of input, and the correct response is to supply the input rather than to interpret the silence."),

q(1, "Somebody quotes the 3.284882 percent as the removal of an API 421 basin. What is wrong with that?",
 "It is a property of this basin on this water at this droplet distribution, and a stream with coarser droplets gives a different figure out of the same vessel.",
 ["It is a property of the train rather than of the basin, since the figure was computed with the plate pack in place downstream.",
  "It understates the basin, since the percentage on a steady sample is quoted before the short-circuit allowance has been applied.",
  "It is a property of the grid rather than of the device, since the removal is read off the bin the inlet median falls in."],
 "Nothing in this module is a fixed removal efficiency, which is why the same device on finer water performs worse. The stage figure is the basin alone, and the allowance is already in the cut size."),

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/beginner/fc7b_m06.json', label='fc7b_m06', expect_n=15)
finish()
